import log from 'electron-log/node'

import AppEnv from '../libs/appEnv'

import { Node } from '../models/node'
import { EventEmitter } from 'node:events'
import { ValidatorStatus, Worker as WorkerModelType, WorkerStatus } from '../models/worker'
import Web3 from 'web3'
import { isSyncInfo, isWatInfo } from '../helpers/node'
import { EraInfo, isEraInfo, isValidatorInfo } from '../helpers/worker'
import { PublicKey } from '../worker'
import { getWeb3 } from '../libs/web3'
import { getRPC, Network } from '../libs/env'

export enum StatusResult {
  success = 'success',
  fail = 'fail'
}

export type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  validator: StatusResult
}

export type removeWorkersResponse = {
  id: number | bigint
  status: boolean
}

class ProviderNode extends EventEmitter {
  private readonly appEnv: AppEnv
  private readonly model: Node | null
  public readonly web3: Web3 | null

  constructor(model: Node | undefined, appEnv: AppEnv) {
    super()
    this.appEnv = appEnv
    this.model = model || null
    this.web3 = getWeb3(getRPC(model ? model.network : Network.mainnet))
  }

  public async initialize(): Promise<StatusResults> {
    if (this.model === null) {
      return {
        coordinatorBeacon: StatusResult.fail,
        validator: StatusResult.fail,
        coordinatorValidator: StatusResult.fail
      }
    }
    log.debug('initialize', this.appEnv.version)
    return {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }
  }

  public async start(): Promise<StatusResults> {
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }
    this.emit('start', 'provider')
    return results
  }

  public async stop(): Promise<StatusResults> {
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }
    this.emit('stop', 'provider')
    return results
  }

  public async restart(): Promise<StatusResults> {
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }
    return results
  }

  public getPids() {
    return {
      coordinatorBeacon: undefined,
      validator: undefined,
      coordinatorValidator: undefined
    }
  }

  public async getPeers() {
    const results: {
      coordinatorPeersCount?: number
      validatorPeersCount?: number
    } = {}
    if (this.model === null) {
      return null
    }
    try {
      const response = await this.runCoordinatorCommand('/eth/v1/node/peer_count')
      if (response && response?.data) {
        results.coordinatorPeersCount = response.data.connected
      }
    } catch (error) {
      log.debug(error)
    }

    return Object.keys(results).length > 0 ? results : null
  }

  public async getSync() {
    const results: {
      coordinatorHeadSlot?: bigint
      coordinatorSyncDistance?: bigint
      coordinatorPreviousJustifiedEpoch?: bigint
      coordinatorCurrentJustifiedEpoch?: bigint
      coordinatorFinalizedEpoch?: bigint
      validatorHeadSlot?: bigint
      validatorSyncDistance?: bigint
      validatorFinalizedSlot?: bigint
    } = {}
    if (this.model === null) {
      return null
    }
    try {
      const response = await this.runCoordinatorCommand('/eth/v1/node/syncing')
      if (response && response?.data) {
        results.coordinatorHeadSlot = BigInt(response.data.head_slot)
        results.coordinatorSyncDistance = BigInt(response.data.sync_distance)
      }
    } catch (error) {
      log.debug(error)
    }
    try {
      const response = await this.runCoordinatorCommand(
        '/eth/v1/beacon/states/head/finality_checkpoints'
      )
      if (response && response?.data) {
        results.coordinatorPreviousJustifiedEpoch = BigInt(response.data.previous_justified.epoch)
        results.coordinatorCurrentJustifiedEpoch = BigInt(response.data.current_justified.epoch)
        results.coordinatorFinalizedEpoch = BigInt(response.data.finalized.epoch)
      }
    } catch (error) {
      log.debug(error)
    }

    try {
      const response = await this.runValidatorCommand('eth_syncing')
      if (isSyncInfo(response)) {
        const currentSlot = response.currentSlot
        const finalizedSlot = response.finalizedSlot
        results.validatorHeadSlot = BigInt(finalizedSlot)
        results.validatorSyncDistance = BigInt(currentSlot) - BigInt(finalizedSlot)
        results.validatorFinalizedSlot = BigInt(finalizedSlot)
      } else {
        const response = await this.runValidatorCommand('wat_info')

        if (isWatInfo(response)) {
          results.validatorHeadSlot = BigInt(response.currSlot)
          // results.validatorSyncDistance = BigInt(response.currSlot) - BigInt(response.maxDagSlot)
          results.validatorSyncDistance = BigInt(0)
          results.validatorFinalizedSlot = BigInt(response.cpSlot)
        }
      }
    } catch (error) {
      log.debug(error)
    }

    return Object.keys(results).length > 0 ? results : null
  }

  public async getWorkerStatus(worker: WorkerModelType) {
    const results: WorkerStatus = {
      coordinatorStatus: worker.coordinatorStatus,
      coordinatorBalanceAmount: worker.coordinatorBalanceAmount,
      coordinatorActivationEpoch: worker.coordinatorActivationEpoch,
      coordinatorDeActivationEpoch: worker.coordinatorDeActivationEpoch,
      validatorStatus: worker.validatorStatus,
      validatorBalanceAmount: worker.validatorBalanceAmount,
      validatorActivationEpoch: worker.validatorActivationEpoch,
      validatorDeActivationEpoch: worker.validatorDeActivationEpoch,
      stakeAmount: worker.stakeAmount
    }
    if (this.model === null) {
      return results
    }

    try {
      const coordinatorResponse = await this.runCoordinatorCommand(
        `/eth/v1/beacon/states/head/validators/0x${worker.coordinatorPublicKey}`
      )

      if (coordinatorResponse?.data) {
        results.coordinatorStatus = coordinatorResponse.data.status
        results.coordinatorBalanceAmount = Web3.utils.fromWei(
          Web3.utils.toWei(coordinatorResponse.data.balance, 'gwei'),
          'ether'
        )
        if (coordinatorResponse.data.validator.activation_epoch !== '18446744073709551615') {
          results.coordinatorActivationEpoch = coordinatorResponse.data.validator.activation_epoch
        }
        if (coordinatorResponse.data.validator.exit_epoch !== '18446744073709551615') {
          results.coordinatorDeActivationEpoch = coordinatorResponse.data.validator.exit_epoch
        }
        results.stakeAmount = Web3.utils.fromWei(
          Web3.utils.toWei(coordinatorResponse.data.validator.effective_balance, 'gwei'),
          'ether'
        )
      }
    } catch (e) {
      log.error(e)
    }

    try {
      const [validatorResponse, currentEra, validatorBalanceAmount] = await Promise.all([
        this.runValidatorCommand(`wat_validator_GetInfo`, [
          `0x${worker.validatorAddress}`,
          'latest'
        ]).catch(() => null),
        this.runValidatorCommand('wat_getEra'),
        this.runValidatorCommand(`eth_getBalance`, [`0x${worker.validatorAddress}`, 'latest'])
      ])
      if (isValidatorInfo(validatorResponse)) {
        let activationEra: null | EraInfo = null
        let exitEra: null | EraInfo = null
        try {
          activationEra =
            validatorResponse.activationEra === 18446744073709552000
              ? null
              : ((await this.runValidatorCommand(`wat_getEra`, [
                  validatorResponse.activationEra
                ])) as EraInfo)
        } catch (e) {
          log.error(e)
        }
        try {
          exitEra =
            validatorResponse.exitEra === 18446744073709552000
              ? null
              : ((await this.runValidatorCommand(`wat_getEra`, [
                  validatorResponse.exitEra
                ])) as EraInfo)
        } catch (e) {
          log.error(e)
        }

        results.validatorStatus = ValidatorStatus.pending_initialized
        if (isEraInfo(currentEra)) {
          if (validatorResponse.activationEra !== 18446744073709552000) {
            results.validatorStatus =
              validatorResponse.activationEra <= currentEra.number
                ? ValidatorStatus.active
                : ValidatorStatus.pending_activation
          }
          if (isEraInfo(activationEra)) {
            results.validatorActivationEpoch = activationEra.fromEpoch.toString()
          } else if (validatorResponse.activationEra === currentEra.number + 1) {
            results.validatorActivationEpoch = (currentEra.toEpoch + 1).toString()
          }

          if (validatorResponse.exitEra !== 18446744073709552000) {
            results.validatorStatus =
              validatorResponse.exitEra <= currentEra.number
                ? ValidatorStatus.exited
                : ValidatorStatus.pending_exiting
          }
          if (isEraInfo(exitEra)) {
            results.validatorDeActivationEpoch = exitEra.fromEpoch.toString()
          } else if (validatorResponse.exitEra === currentEra.number + 1) {
            results.validatorDeActivationEpoch = (currentEra.toEpoch + 1).toString()
          }
        }
      }
      if (validatorBalanceAmount && typeof validatorBalanceAmount === 'string') {
        results.validatorBalanceAmount = Web3.utils.fromWei(validatorBalanceAmount, 'ether')
      }
    } catch (e) {
      log.error(e)
    }

    return results
  }
  public async removeData() {
    if (this.model === null) {
      return false
    }
    return true
  }
  public async runCoordinatorCommand(command: string) {
    if (!this.model) {
      return {}
    }
    try {
      const response = await fetch(
        `${getRPC(this.model ? this.model.network : Network.mainnet)}/coordinator/${command}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        return {}
      }
      return await response.json()
    } catch (error) {
      // log.debug(error)
    }
    return {}
  }
  public async runValidatorCommand(
    method: string,
    params: (string | number | bigint | boolean)[] = []
  ): Promise<string | boolean | object> {
    if (!this.model) {
      return {}
    }
    try {
      const response = await fetch(getRPC(this.model ? this.model.network : Network.mainnet), {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1
        }),
        method: 'POST'
      })
      if (!response.ok) {
        return {}
      }
      const result = await response.json()
      return result.result
    } catch (error) {
      // log.debug(error)
    }
    return {}
  }
  public async removeWorkers(keys: PublicKey[]): Promise<removeWorkersResponse[]> {
    return keys.map((key) => ({ id: key.id, status: true }))
  }
}

export default ProviderNode
