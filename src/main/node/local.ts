import * as crypto from 'crypto'
import Child, { StatusResult } from './child'
import { checkOrCreateDir, checkOrCreateFile, checkPort } from '../libs/fs'
import {
  getChainId,
  getCoordinatorBeaconBinPath,
  getCoordinatorBeaconGenesisPath,
  getCoordinatorBootnode,
  getCoordinatorPath,
  getCoordinatorValidatorBinPath,
  getCoordinatorWalletPath,
  getLogPath,
  getValidatorAddress,
  getValidatorBinPath,
  getValidatorBootnode,
  getValidatorGenesisDataPath,
  getValidatorGenesisPath,
  getValidatorPath
} from '../libs/env'

import { Node } from '../models/node'

export { StatusResult }

export type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  validator: StatusResult
}

class LocalNode {
  private readonly model: Node | null
  private coordinatorBeacon: Child | null
  private coordinatorValidator: Child | null
  private validator: Child | null

  constructor(model: Node | undefined) {
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
        binPath: getValidatorBinPath(this.model.network),
        args: [
          `--datadir=${getValidatorPath(this.model.locationDir)}`,
          `init`,
          `${getValidatorGenesisPath(this.model.network)}`,
          `${getValidatorGenesisDataPath(this.model.network)}`
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
      binPath: getCoordinatorBeaconBinPath(this.model.network),
      args: [
        '--accept-terms-of-use',
        '--disable-peer-scorer',
        `--datadir=${getCoordinatorPath(this.model.locationDir)}`,
        `--bootstrap-node=${getCoordinatorBootnode(this.model.network)}`,
        `--genesis-state=${getCoordinatorBeaconGenesisPath(this.model.network)}`,
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
    return true
  }

  private _setValidator(): boolean {
    if (this.model === null || this.validator !== null) {
      return false
    }
    this.validator = new Child({
      binPath: getValidatorBinPath(this.model.network),
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
    return true
  }

  private _setCoordinatorValidator(): boolean {
    if (this.model === null || this.coordinatorValidator !== null) {
      return false
    }
    this.coordinatorValidator = new Child({
      binPath: getCoordinatorValidatorBinPath(this.model.network),
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
    return true
  }
}

export default LocalNode
