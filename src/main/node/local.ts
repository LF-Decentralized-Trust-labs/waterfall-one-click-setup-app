import * as crypto from 'crypto'
import log from 'electron-log/node'
import { exec } from 'node:child_process'
import Child, { StatusResult } from './child'
import { checkOrCreateDir, checkOrCreateFile, checkPort, checkSocket } from '../libs/fs'
import AppEnv from '../libs/appEnv'
import {
  getChainId,
  getCoordinatorBootnode,
  getCoordinatorPath,
  getCoordinatorWalletPath,
  getLogPath,
  getValidatorAddress,
  getValidatorBootnode,
  getValidatorPath
} from '../libs/env'

import { Node } from '../models/node'
import { EventEmitter } from 'node:events'

export { StatusResult }

export type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  validator: StatusResult
}

class LocalNode extends EventEmitter {
  private readonly appEnv: AppEnv
  private readonly model: Node | null
  private coordinatorBeacon: Child | null
  private coordinatorValidator: Child | null
  private validator: Child | null

  constructor(model: Node | undefined, appEnv) {
    super()
    this.appEnv = appEnv
    this.model = model || null
    this.coordinatorBeacon = null
    this.coordinatorValidator = null
    this.validator = null
  }

  public async initialize(): Promise<StatusResults> {
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.fail,
      validator: StatusResult.fail,
      coordinatorValidator: StatusResult.fail
    }
    if (this.model === null) {
      return results
    }
    if (!(await this._checkMain())) {
      return results
    }

    results.coordinatorBeacon = (await this._checkCoordinatorBeacon())
      ? StatusResult.success
      : StatusResult.fail
    results.validator = (await this._checkValidator()) ? StatusResult.success : StatusResult.fail
    results.coordinatorValidator = (await this._checkCoordinatorValidator())
      ? StatusResult.success
      : StatusResult.fail

    if (
      results.coordinatorBeacon === StatusResult.fail ||
      results.validator === StatusResult.fail ||
      results.coordinatorValidator === StatusResult.fail
    ) {
      return results
    }

    this._setCoordinatorBeacon()
    this._setValidator()
    this._setCoordinatorValidator()

    console.log(`Node load`)
    return results
  }

  public async start(): Promise<StatusResults> {
    console.log('start')
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (this.validator && !this.validator.isRunning()) {
      results.validator = await this.validator.start()
      console.log(`start gwat: ${results.validator}`)
    }

    if (this.coordinatorBeacon && !this.coordinatorBeacon.isRunning()) {
      results.coordinatorBeacon = await this.coordinatorBeacon.start()
      console.log(`start coord: ${results.coordinatorBeacon}`)
    }

    if (this.coordinatorValidator && !this.coordinatorValidator.isRunning()) {
      results.coordinatorValidator = await this.coordinatorValidator.start()
      console.log(`start valid: ${results.coordinatorValidator}`)
    }

    return results
  }

  public async stop(): Promise<StatusResults> {
    console.log('stop')
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (this.coordinatorBeacon && this.coordinatorBeacon.isRunning()) {
      results.coordinatorBeacon = await this.coordinatorBeacon.stop()
      console.log(`stop coord: ${results.coordinatorBeacon}`)
    }

    if (this.coordinatorValidator && this.coordinatorValidator.isRunning()) {
      results.coordinatorValidator = await this.coordinatorValidator.stop()
      console.log(`stop valid: ${results.coordinatorValidator}`)
    }

    if (this.validator && this.validator.isRunning()) {
      results.validator = await this.validator.stop()
      console.log(`stop gwat: ${results.validator}`)
    }

    return results
  }

  public async restart(): Promise<StatusResults> {
    console.log('restart')

    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      validator: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (this.coordinatorBeacon && this.coordinatorBeacon.isRunning()) {
      await this.coordinatorBeacon.stop()
      console.log(`stop coord`)
    }

    if (this.coordinatorValidator && this.coordinatorValidator.isRunning()) {
      await this.coordinatorValidator.stop()
      console.log(`stop valid`)
    }

    if (this.validator && this.validator.isRunning()) {
      await this.validator.stop()
      console.log(`stop gwat`)
    }
    if (this.validator) {
      results.validator = await this.validator.start()
      console.log(`start gwat: ${results.validator}`)
    }
    if (this.coordinatorBeacon) {
      results.coordinatorBeacon = await this.coordinatorBeacon.start()
      console.log(`start coord: ${results.coordinatorBeacon}`)
    }
    if (this.coordinatorValidator) {
      results.coordinatorValidator = await this.coordinatorValidator.start()
      console.log(`start valid: ${results.coordinatorValidator}`)
    }
    return results
  }

  public getPids() {
    return {
      coordinatorBeacon: this.coordinatorBeacon ? this.coordinatorBeacon.getPid() : undefined,
      validator: this.validator ? this.validator.getPid() : undefined,
      coordinatorValidator: this.coordinatorValidator
        ? this.coordinatorValidator.getPid()
        : undefined
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
      const response = await this._runCoordinatorCommand('/eth/v1/node/peer_count')
      if (response && response?.data) {
        results.coordinatorPeersCount = response.data.connected
      }
    } catch (error) {
      log.debug(error)
    }
    try {
      const response = (await this._runValidatorCommand('admin.peers.length')) as string
      if (response !== '') {
        results.validatorPeersCount = parseInt(response)
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
      const response = await this._runCoordinatorCommand('/eth/v1/node/syncing')
      if (response && response?.data) {
        results.coordinatorHeadSlot = BigInt(response.data.head_slot)
        results.coordinatorSyncDistance = BigInt(response.data.sync_distance)
      }
    } catch (error) {
      log.debug(error)
    }
    try {
      const response = await this._runCoordinatorCommand(
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
      const response = (await this._runValidatorCommand('eth.syncing')) as string

      if (response !== 'false' && response !== '') {
        const currentSlot = (await this._runValidatorCommand('eth.syncing.currentSlot')) as string
        const finalizedSlot = (await this._runValidatorCommand(
          'eth.syncing.finalizedSlot'
        )) as string
        results.validatorHeadSlot = BigInt(finalizedSlot)
        results.validatorSyncDistance = BigInt(currentSlot) - BigInt(finalizedSlot)
        results.validatorFinalizedSlot = BigInt(finalizedSlot)
      }
    } catch (error) {
      log.debug(error)
    }
    return Object.keys(results).length > 0 ? results : null
  }

  private async _checkMain(): Promise<boolean> {
    if (this.model === null) {
      return false
    }
    if (!(await checkOrCreateDir(this.model.locationDir))) {
      return false
    }
    if (!(await checkOrCreateDir(getLogPath(this.model.locationDir)))) {
      return false
    }
    if (!(await checkOrCreateDir(getCoordinatorPath(this.model.locationDir)))) {
      return false
    }
    if (!(await checkOrCreateDir(getValidatorPath(this.model.locationDir)))) {
      return false
    }
    if (!(await checkOrCreateDir(getCoordinatorWalletPath(this.model.locationDir)))) {
      return false
    }

    this.model.locationDir
    return true
  }

  private async _checkCoordinatorBeacon(): Promise<boolean> {
    if (this.model === null) {
      return false
    }
    if (!(await checkPort(this.model.coordinatorHttpApiPort))) {
      return false
    }
    if (!(await checkPort(this.model.coordinatorHttpValidatorApiPort))) {
      return false
    }
    if (!(await checkPort(this.model.coordinatorP2PTcpPort))) {
      return false
    }
    if (!(await checkPort(this.model.coordinatorP2PUdpPort))) {
      return false
    }

    return true
  }

  private async _checkValidator(): Promise<boolean> {
    if (this.model === null) {
      return false
    }
    if (
      !(await checkOrCreateFile(`${getValidatorPath(this.model.locationDir)}/password.txt`, ''))
    ) {
      return false
    }
    if (
      !(await checkOrCreateFile(
        `${getValidatorPath(this.model.locationDir)}/gwat/nodekey`,
        undefined
      ))
    ) {
      const child = new Child({
        binPath: this.appEnv.getValidatorBinPath(this.model.network),
        args: [
          `--datadir=${getValidatorPath(this.model.locationDir)}`,
          `init`,
          `${this.appEnv.getValidatorGenesisPath(this.model.network)}`,
          `${this.appEnv.getValidatorGenesisDataPath(this.model.network)}`
        ],
        outLogPath: `${getLogPath(this.model.locationDir)}/validator.out.log`,
        errLogPath: `${getLogPath(this.model.locationDir)}/validator.err.log`
      })
      await child.start()
    }

    if (!(await checkPort(this.model.validatorP2PPort))) {
      return false
    }
    if (!(await checkPort(this.model.validatorHttpApiPort))) {
      return false
    }
    if (!(await checkPort(this.model.validatorWsApiPort))) {
      return false
    }

    return true
  }

  private async _checkCoordinatorValidator(): Promise<boolean> {
    if (this.model === null) {
      return false
    }
    const password = crypto.randomBytes(16).toString('hex')
    if (
      !(await checkOrCreateFile(
        `${getCoordinatorWalletPath(this.model.locationDir)}/password.txt`,
        password
      ))
    ) {
      return false
    }
    return true
  }

  private _setCoordinatorBeacon(): boolean {
    if (this.model === null || this.coordinatorBeacon !== null) {
      return false
    }
    this.coordinatorBeacon = new Child({
      binPath: this.appEnv.getCoordinatorBeaconBinPath(this.model.network),
      args: [
        '--accept-terms-of-use',
        '--disable-peer-scorer',
        `--datadir=${getCoordinatorPath(this.model.locationDir)}`,
        `--bootstrap-node=${getCoordinatorBootnode(this.model.network)}`,
        `--genesis-state=${this.appEnv.getCoordinatorBeaconGenesisPath(this.model.network)}`,
        `--chain-id=${getChainId(this.model.network)}`,
        `--network-id=${getChainId(this.model.network)}`,
        '--contract-deployment-block=0',
        `--deposit-contract=${getValidatorAddress(this.model.network)}`,
        `--p2p-tcp-port=${this.model.coordinatorP2PTcpPort}`,
        `--p2p-udp-port=${this.model.coordinatorP2PUdpPort}`,
        `--grpc-gateway-port=${this.model.coordinatorHttpApiPort}`,
        `--rpc-port=${this.model.coordinatorHttpValidatorApiPort}`,
        `--http-web3provider=${getValidatorPath(this.model.locationDir)}/validator.ipc`
      ],
      outLogPath: `${getLogPath(this.model.locationDir)}/coordinator-beacon.out.log`,
      errLogPath: `${getLogPath(this.model.locationDir)}/coordinator-beacon.err.log`
    })
    this.coordinatorBeacon.on('stop', () => {
      this.emit('stop', 'coordinatorBeacon')
    })

    return true
  }

  private _setValidator(): boolean {
    if (this.model === null || this.validator !== null) {
      return false
    }
    this.validator = new Child({
      binPath: this.appEnv.getValidatorBinPath(this.model.network),
      args: [
        `--datadir=${getValidatorPath(this.model.locationDir)}`,
        `--bootnodes=${getValidatorBootnode(this.model.network)}`,
        `--networkid=${getChainId(this.model.network)}`,
        '--syncmode=full',
        `--port=${this.model.validatorP2PPort}`,
        `--ipcpath=${getValidatorPath(this.model.locationDir)}/validator.ipc`
      ],
      outLogPath: `${getLogPath(this.model.locationDir)}/validator.out.log`,
      errLogPath: `${getLogPath(this.model.locationDir)}/validator.err.log`
    })
    this.validator.on('stop', () => {
      this.emit('stop', 'validator')
    })
    return true
  }

  private _setCoordinatorValidator(): boolean {
    if (this.model === null || this.coordinatorValidator !== null) {
      return false
    }
    this.coordinatorValidator = new Child({
      binPath: this.appEnv.getCoordinatorValidatorBinPath(this.model.network),
      args: [
        '--accept-terms-of-use',
        '--grpc-max-msg-size=15900000',
        `--beacon-rpc-provider=localhost:${this.model.coordinatorHttpValidatorApiPort}`,
        `--wallet-dir=${getCoordinatorWalletPath(this.model.locationDir)}`,
        `--wallet-password-file=${getCoordinatorWalletPath(this.model.locationDir)}/password.txt`
      ],
      outLogPath: `${getLogPath(this.model.locationDir)}/coordinator-validator.out.log`,
      errLogPath: `${getLogPath(this.model.locationDir)}/coordinator-validator.err.log`
    })
    this.coordinatorValidator.on('stop', () => {
      this.emit('stop', 'coordinatorValidator')
    })
    return true
  }

  private async _runCoordinatorCommand(command: string) {
    if (!this.model) {
      return {}
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:${this.model.coordinatorHttpApiPort}${command}`,
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

  private async _runValidatorCommand(command: string) {
    if (!this.model) {
      return ''
    }
    const isWorking = await checkSocket(`${getValidatorPath(this.model.locationDir)}/validator.ipc`)
    if (!isWorking) {
      return ''
    }
    return new Promise((resolve, reject) => {
      if (!this.model) {
        return reject('')
      }
      exec(
        `${this.appEnv.getValidatorBinPath(this.model.network)} --exec "${command}" attach ${getValidatorPath(this.model.locationDir)}/validator.ipc`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(err)
          }
          if (stderr) {
            return reject(stderr)
          }
          if (stdout) {
            return resolve(stdout)
          }
        }
      )
    })
  }
}

export default LocalNode
