import { spawn, exec, ChildProcessWithoutNullStreams } from 'node:child_process'
import util from 'node:util'
import log from 'electron-log/node'
import { EventEmitter } from 'node:events'
import * as rfs from 'rotating-file-stream'

const execPromise = util.promisify(exec)
export enum StatusResult {
  success = 'success',
  fail = 'fail'
}

type Options = {
  binPath: string
  args: string[]
  logPath: string
  logName: string
}

class Child extends EventEmitter {
  child: ChildProcessWithoutNullStreams | null = null

  readonly binPath: string
  readonly args: string[]
  readonly logPath: string
  readonly logName: string

  constructor(options: Options) {
    super()
    this.binPath = options.binPath
    this.args = options.args
    this.logPath = options.logPath
    this.logName = options.logName
    log.debug(`Child constructor ${this.binPath}`)
  }

  public isRunning(): boolean {
    return !!this.child
  }

  public async start(): Promise<StatusResult> {
    const logStream = rfs.createStream(this.logName, {
      size: '50M',
      interval: '1d',
      compress: 'gzip',
      maxFiles: 10,
      path: this.logPath
    })

    this.child = spawn(this.binPath, this.args)

    this.child.stdout.pipe(logStream)
    this.child.stderr.pipe(logStream)

    this.child.on('spawn', () => {
      this.emit('start', this.child ? this.child.pid : null)
    })
    this.child.on('end', () => {
      logStream.end(() => {})
    })
    this.child.on('close', () => {
      this.child = null
      this.emit('stop')
    })

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
      this.child.once('close', (code) => {
        log.debug(`spawn child process exited with code ${code}`)
        this.child = null
        resolve(StatusResult.success)
      })
      this.child.kill()
    })
  }
  public getPid() {
    if (!this.child) {
      return undefined
    }
    return this.child.pid
  }
  public async exec() {
    return await execPromise(`${this.binPath} ${this.args.join(' ')}`)
  }
}

export default Child
