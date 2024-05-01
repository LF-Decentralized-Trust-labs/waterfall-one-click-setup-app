import * as https from 'node:https'
import { createWriteStream, WriteStream, createReadStream, ReadStream } from 'node:fs'
import { dirname, join, basename } from 'path'
import log from 'electron-log/node'
import { stat, readdir, rename, unlink, rm } from 'node:fs/promises'
import { ClientRequest, IncomingMessage } from 'node:http'
import * as crypto from 'crypto'
import * as tar from 'tar'
import { EventEmitter } from 'node:events'

enum Status {
  download = 'download',
  verify = 'verify',
  extract = 'extract'
}

class FileDownloader extends EventEmitter {
  private req: ClientRequest | null = null
  private downloadStream: WriteStream | null = null
  private verifyStream: ReadStream | null = null
  private status: Status | null = null
  constructor(
    private url: string,
    private filePath: string,
    private extractPath: string,
    private expectedHash: string
  ) {
    super()
  }

  public async download() {
    if (this.status) {
      return
    }
    this.status = Status.download
    let downloadedBytes = 0

    try {
      const _stat = await stat(this.filePath)
      if (_stat && _stat.size) {
        downloadedBytes = _stat.size
      }
    } catch (e) {
      log.error(e)
    }
    log.debug('downloadedBytes', downloadedBytes)
    const options = downloadedBytes ? { headers: { Range: `bytes=${downloadedBytes}-` } } : {}

    this.req = https.get(this.url, options, (res: IncomingMessage) => {
      this.downloadStream = createWriteStream(this.filePath, { flags: 'a' })
      res.pipe(this.downloadStream)
      this.downloadStream.on('finish', () => {
        this.downloadStream!.close()
        this.status = null
        this.emit('finishDownload')
      })
      res.on('data', (chunk: Buffer) => {
        downloadedBytes += chunk.length
        this.emit('progressDownload', downloadedBytes)
      })
    })
    this.req.on('error', (error: Error) => {
      log.error('Error during the download:', error)
      this.status = null
      this.emit('error', error)
    })
  }
  public verifyFileIntegrity(): void {
    if (this.status) {
      return
    }
    this.status = Status.verify
    this.verifyStream = createReadStream(this.filePath)
    const hash = crypto.createHash('sha256')
    this.verifyStream.on('data', (data) => {
      hash.update(data)
    })
    this.verifyStream.on('end', async () => {
      const calculatedHash = hash.digest('hex')
      if (calculatedHash !== this.expectedHash) {
        await unlink(this.filePath)
      }
      this.status = null
      this.emit('finishVerified', calculatedHash === this.expectedHash)
    })
    this.verifyStream.on('error', (error) => {
      this.status = null
      this.emit('error', error)
    })
  }
  public async extractAndDeleteTar() {
    if (this.status) {
      return
    }
    this.status = Status.extract

    const directory = dirname(this.filePath)
    const exceptFileName = basename(this.filePath)
    try {
      const files = await readdir(directory)
      for (const file of files) {
        if (file !== exceptFileName) {
          const currentPath = join(directory, file)
          const _stat = await stat(currentPath)
          if (_stat.isDirectory()) {
            await rm(currentPath, { recursive: true, force: true })
          } else {
            await unlink(currentPath)
          }
        }
      }
    } catch (error) {
      this.emit('error', error)
    }

    tar
      .x({
        file: this.filePath,
        cwd: this.extractPath
      })
      .then(async () => {
        try {
          await unlink(this.filePath)
          const removeDirs: string[] = []
          const parentFiles = await readdir(this.extractPath)
          for (const parentFile of parentFiles) {
            const parentPath = join(this.extractPath, parentFile)
            const _stat = await stat(parentPath)
            if (_stat.isDirectory()) {
              removeDirs.push(parentPath)
              const files = await readdir(parentPath)
              for (const file of files) {
                const currentPath = join(parentPath, file)
                const newPath = join(this.extractPath, file)
                await rename(currentPath, newPath)
              }
            }
          }
          for (const dir of removeDirs) {
            await rm(dir, { recursive: true, force: true })
          }
          this.status = null
          this.emit('finishExtracted')
        } catch (error) {
          this.emit('error', error)
        }
      })
      .catch((error) => {
        this.status = null
        this.emit('error', error)
      })
  }
  public stop(): void {
    if (this.req) {
      this.req.destroy()
    }
    if (this.downloadStream) {
      this.downloadStream.close()
    }
    if (this.verifyStream) {
      this.verifyStream.close()
    }
    this.status = null
    this.emit('stopped')
  }
}

export default FileDownloader
