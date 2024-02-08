import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process'
import fs from 'node:fs'
import { gwatPath } from '../utils'


let child: ChildProcessWithoutNullStreams | null = null

const args = [
  '--datadir=/Users/alex/.wf8/data/gwat',
  '--bootnodes=enode://716898aedc2337bc1f8c2a936f4b1080e5c4794ba55b31d4cf5898d02dd036150debb742f9929f6f6a7030afaf324604fda57702769ad05bdcce526b3b12cbf1@128.140.45.145:30301',
  '--networkid=8601152',
  '--syncmode=full',
  '--ipcpath=/Users/alex/.wf8/data/gwat/gwat.ipc',
  '--http',
  '--http.corsdomain=*',
  '--http.vhosts=*',
  '--http.addr=0.0.0.0',
  '--http.port=9545',
  '--http.api=eth,net,wat',
  '--authrpc.port=8591'
]

export const isRunning = (): boolean => {
  return !!child
}
export const start = async (): Promise<string> => {
  const outLogStream = fs.createWriteStream('/Users/alex/.wf8/data/logs/gwat.out.log', { flags: 'a' })
  const errLogStream = fs.createWriteStream('/Users/alex/.wf8/data/logs/gwat.err.log', { flags: 'a' })

  child = spawn(gwatPath, args)
  child.stdout.pipe(outLogStream)
  child.stderr.pipe(errLogStream)
  // child.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`)
  // })
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
