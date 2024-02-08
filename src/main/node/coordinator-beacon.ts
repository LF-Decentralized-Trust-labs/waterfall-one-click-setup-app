import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process'
import fs from 'node:fs'
import { coordinatorBeaconPath } from '../utils'

let child: ChildProcessWithoutNullStreams | null = null
const args = [
  '--accept-terms-of-use',
  '--disable-peer-scorer',
  '--datadir=/Users/alex/.wf8/data/coordinator',
  '--bootstrap-node=enr:-LG4QC0DoIv8bWBuE_ZVx9zcrDaE1HbBPuNWVpl74GoStnSPXO0B73WF5VlfDJQSqTetQ775V9PWi7Yg3Ua7igL1ucOGAYvKzQeKh2F0dG5ldHOIAAAAAAAAAACEZXRoMpATfFTTAAAgCf__________gmlkgnY0gmlwhICMLZGJc2VjcDI1NmsxoQKi0xTSOgGw6UO9URJjAM1TPqPfadDeuORaJ027WIjLYIN1ZHCCD6A',
  '--genesis-state=/Users/alex/.wf8/state/coordinator-genesis-t8.ssz',
  '--chain-id=8601152',
  '--network-id=8601152',
  '--contract-deployment-block=0',
  '--deposit-contract=0x6671Ed1732b6b5AF82724A1d1A94732D1AA37aa6',
  '--http-web3provider=/Users/alex/.wf8/data/gwat/gwat.ipc'
  // '--http-web3provider=http://127.0.0.1:9545'
]

export const isRunning = (): boolean => {
  return !!child
}
export const start = async (): Promise<string> => {
  const outLogStream = fs.createWriteStream('/Users/alex/.wf8/data/logs/coordinator-beacon.out.log', { flags: 'a' })
  const errLogStream = fs.createWriteStream('/Users/alex/.wf8/data/logs/coordinator-beacon.err.log', { flags: 'a' })


  child = spawn(coordinatorBeaconPath, args)

  child.stdout.pipe(outLogStream)
  child.stderr.pipe(errLogStream)


  // child.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`)
  // })
  //
  // child.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`)
  // })


  if (child.pid)
    return Promise.resolve('success')

  await new Promise((resolve, reject) => {
    let count = 0
    const interval = setInterval(() => {
      if (!child) {
        return reject('fail')
      }
      if (child.pid) {
        clearInterval(interval)
        return resolve('success')
      }
      count++
      if (count > 10) {
        clearInterval(interval)
        return reject('fail')
      }
    }, 500)
  })
  return 'success'
}

export const stop = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!child) {
      resolve('success')
    }
    if (child) {
      child.on('close', (code) => {
        console.log(`spawn child process exited with code ${code}`)
        child = null
        resolve('success')
      })
      child.kill()
    }
  })
}
