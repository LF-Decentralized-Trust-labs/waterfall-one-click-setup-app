import { access, mkdir, writeFile, readFile, constants } from 'node:fs/promises'
import * as net from 'node:net'
import log from 'electron-log/main'

export const checkOrCreateDir = async (dirPath: string): Promise<boolean> => {
  try {
    await access(dirPath, constants.F_OK)
    await access(dirPath, constants.R_OK | constants.W_OK)
    return true
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') {
      try {
        await mkdir(dirPath, { recursive: true })
        return true
      } catch (mkdirError) {
        log.error('Not permissions to create dir:', dirPath)
        return false
      }
    } else if (nodeError.code === 'EACCES') {
      log.error('Not permissions to access dir:', dirPath)
      return false
    } else {
      log.error('Other error:', dirPath)
    }
  }
  return false
}

export const checkOrCreateFile = async (
  filePath: string,
  data: undefined | string
): Promise<boolean> => {
  try {
    await readFile(filePath, { encoding: 'utf-8' })
    return true
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') {
      if (data !== undefined) {
        await writeFile(filePath, data)
        return true
      }
    }
  }
  return false
}
export const checkPort = async (port: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false)
      } else {
        reject(err)
      }
    })
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port)
  })
}
