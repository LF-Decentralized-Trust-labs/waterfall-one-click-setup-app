import Child, { StatusResult } from './child'
import { IpcMain } from 'electron'
import { coordinatorBeaconPath, gwatPath, coordinatorValidatorPath } from '../utils'

type StatusResults = {
  coordinatorBeacon: StatusResult
  coordinatorValidator: StatusResult
  gwat: StatusResult
}

class Node {
  private ipcMain: IpcMain
  private coordinatorBeacon: Child
  private coordinatorValidator: Child
  private gwat: Child

  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain
    this.coordinatorBeacon = new Child({
      binPath: coordinatorBeaconPath,
      args: [
        '--accept-terms-of-use',
        '--disable-peer-scorer',
        '--datadir=/Users/alex/.wf8/coordinator',
        '--bootstrap-node=enr:-LG4QC0DoIv8bWBuE_ZVx9zcrDaE1HbBPuNWVpl74GoStnSPXO0B73WF5VlfDJQSqTetQ775V9PWi7Yg3Ua7igL1ucOGAYvKzQeKh2F0dG5ldHOIAAAAAAAAAACEZXRoMpATfFTTAAAgCf__________gmlkgnY0gmlwhICMLZGJc2VjcDI1NmsxoQKi0xTSOgGw6UO9URJjAM1TPqPfadDeuORaJ027WIjLYIN1ZHCCD6A',
        '--genesis-state=/Users/alex/.wf8/coordinator/coordinator-genesis.ssz',
        '--chain-id=8601152',
        '--network-id=8601152',
        '--contract-deployment-block=0',
        '--deposit-contract=0x6671Ed1732b6b5AF82724A1d1A94732D1AA37aa6',
        '--http-web3provider=/Users/alex/.wf8/gwat/gwat.ipc'
        // '--http-web3provider=http://127.0.0.1:9545'
      ],
      outLogPath: '/Users/alex/.wf8/logs/coordinator-beacon.out.log',
      errLogPath: '/Users/alex/.wf8/logs/coordinator-beacon.err.log'
    })
    this.gwat = new Child({
      binPath: gwatPath,
      args: [
        '--datadir=/Users/alex/.wf8/gwat',
        '--bootnodes=enode://716898aedc2337bc1f8c2a936f4b1080e5c4794ba55b31d4cf5898d02dd036150debb742f9929f6f6a7030afaf324604fda57702769ad05bdcce526b3b12cbf1@128.140.45.145:30301',
        '--networkid=8601152',
        '--syncmode=full',
        '--ipcpath=/Users/alex/.wf8/gwat/gwat.ipc',
        '--http',
        '--http.corsdomain=*',
        '--http.vhosts=*',
        '--http.addr=0.0.0.0',
        '--http.port=9545',
        '--http.api=eth,net,wat',
        '--authrpc.port=8591'
      ],
      outLogPath: '/Users/alex/.wf8/logs/gwat.out.log',
      errLogPath: '/Users/alex/.wf8/logs/gwat.err.log'
    })
    this.coordinatorValidator = new Child({
      binPath: coordinatorValidatorPath,
      args: [
        '--accept-terms-of-use',
        '--grpc-max-msg-size=15900000',
        '--beacon-rpc-provider=localhost:4000',
        '--wallet-dir=/Users/alex/.wf8/coordinator/wallet',
        '--wallet-password-file=/Users/alex/.wf8/coordinator/wallet/password.txt'
      ],
      outLogPath: '/Users/alex/.wf8/logs/coordinator-validator.out.log',
      errLogPath: '/Users/alex/.wf8/logs/coordinator-validator.err.log'
    })
    console.log(`Node constructor`)
  }

  public handle(): void {
    this.ipcMain.handle('node:start', this._start.bind(this))
    this.ipcMain.handle('node:stop', this._stop.bind(this))
    this.ipcMain.handle('node:restart', this._restart.bind(this))
  }

  private async _start(): Promise<StatusResults> {
    console.log('start')
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      gwat: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (!this.gwat.isRunning()) {
      results.gwat = await this.gwat.start()
      console.log(`start gwat: ${results.gwat}`)
    }

    if (!this.coordinatorBeacon.isRunning()) {
      results.coordinatorBeacon = await this.coordinatorBeacon.start()
      console.log(`start coord: ${results.coordinatorBeacon}`)
    }

    if (!this.coordinatorValidator.isRunning()) {
      results.coordinatorValidator = await this.coordinatorValidator.start()
      console.log(`start valid: ${results.coordinatorValidator}`)
    }

    return results
  }

  private async _stop(): Promise<StatusResults> {
    console.log('stop')
    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      gwat: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (!this.coordinatorBeacon.isRunning()) {
      console.log('stop coord: not running')
    } else {
      results.coordinatorBeacon = await this.coordinatorBeacon.stop()
      console.log(`stop coord: ${results.coordinatorBeacon}`)
    }

    if (!this.coordinatorValidator.isRunning()) {
      console.log('stop valid: not running')
    } else {
      results.coordinatorValidator = await this.coordinatorValidator.stop()
      console.log(`stop valid: ${results.coordinatorValidator}`)
    }

    if (!this.gwat.isRunning()) {
      console.log('stop gwat: not running')
    } else {
      results.gwat = await this.gwat.stop()
      console.log(`stop gwat: ${results.gwat}`)
    }

    return results
  }

  private async _restart(): Promise<StatusResults> {
    console.log('restart')

    const results: StatusResults = {
      coordinatorBeacon: StatusResult.success,
      gwat: StatusResult.success,
      coordinatorValidator: StatusResult.success
    }

    if (this.coordinatorBeacon.isRunning()) {
      await this.coordinatorBeacon.stop()
      console.log(`stop coord`)
    }

    if (this.coordinatorValidator.isRunning()) {
      await this.coordinatorValidator.stop()
      console.log(`stop valid`)
    }

    if (this.gwat.isRunning()) {
      await this.gwat.stop()
      console.log(`stop gwat`)
    }
    results.gwat = await this.gwat.start()
    console.log(`start gwat: ${results.gwat}`)
    results.coordinatorBeacon = await this.coordinatorBeacon.start()
    console.log(`start coord: ${results.coordinatorBeacon}`)
    results.coordinatorValidator = await this.coordinatorValidator.start()
    console.log(`start valid: ${results.coordinatorValidator}`)
    return results
  }
}

export default Node
