import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process'
import fs from 'node:fs'
import log from 'electron-log/main'

export enum StatusResult {
  success = 'success',
  fail = 'fail'
}

type Options = {
  binPath: string
  args: string[]
  outLogPath: string
  errLogPath: string
}

class Child {
  child: ChildProcessWithoutNullStreams | null = null

  readonly binPath: string
  readonly args: string[]
  readonly outLogPath: string
  readonly errLogPath: string

  constructor(options: Options) {
    this.binPath = options.binPath
    this.args = options.args
    this.outLogPath = options.outLogPath
    this.errLogPath = options.errLogPath
    log.debug(`Child constructor ${this.binPath}`)
  }

  public isRunning(): boolean {
    return !!this.child
  }

  public async start(): Promise<StatusResult> {
    const outLogStream = fs.createWriteStream(this.outLogPath, { flags: 'a' })
    const errLogStream = fs.createWriteStream(this.errLogPath, { flags: 'a' })

    this.child = spawn(this.binPath, this.args)

    this.child.stdout.pipe(outLogStream)
    this.child.stderr.pipe(errLogStream)

    if (this.child.pid) return Promise.resolve(StatusResult.success)

    return await new Promise((resolve, reject) => {
      let count = 0
      const interval = setInterval(() => {
        if (!this.child) {
          return reject(StatusResult.fail)
        }
        if (this.child.pid) {
          clearInterval(interval)
          return resolve(StatusResult.success)
        }
        count++
        if (count > 10) {
          clearInterval(interval)
          return reject(StatusResult.fail)
        }
      }, 500)
    })
  }

  public stop(): Promise<StatusResult> {
    return new Promise((resolve) => {
      if (!this.child) {
        return resolve(StatusResult.success)
      }
      this.child.on('close', (code) => {
        log.debug(`spawn child process exited with code ${code}`)
        this.child = null
        resolve(StatusResult.success)
      })
      this.child.kill()
    })
  }
}

export default Child
