import { IpcMain, dialog, shell, IpcMainInvokeEvent } from 'electron'
import { writeFile } from 'node:fs/promises'

class FsHandle {
  private ipcMain: IpcMain

  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain
  }

  public initialize() {
    this.ipcMain.handle('os:selectDirectory', (_event: IpcMainInvokeEvent, defaultPath) =>
      this._selectDirectory(defaultPath)
    )
    this.ipcMain.handle('os:selectFile', (_event: IpcMainInvokeEvent, defaultPath, filters) =>
      this._selectFile(defaultPath, filters)
    )
    this.ipcMain.handle('os:saveTextFile', (_event: IpcMainInvokeEvent, text, title, fileName) =>
      this._saveTextFile(text, title, fileName)
    )
    this.ipcMain.handle('os:openExternal', (_event: IpcMainInvokeEvent, url) =>
      this._openExternal(url)
    )
  }

  public async destroy() {
    this.ipcMain.removeHandler('os:selectDirectory')
    this.ipcMain.removeHandler('os:selectFile')
    this.ipcMain.removeHandler('os:saveTextFile')
    this.ipcMain.removeHandler('os:openUrl')
  }

  private async _openExternal(url: string): Promise<void> {
    return await shell.openExternal(url)
  }

  private async _selectDirectory(defaultPath?: string): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath,
      properties: ['openDirectory', 'createDirectory', 'promptToCreate']
    })
    if (canceled) {
      return null
    } else {
      return filePaths[0]
    }
  }
  private async _selectFile(
    defaultPath?: string,
    filters?: { name: string; extensions: string[] }[]
  ): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath,
      filters,
      properties: ['openFile']
    })
    if (canceled) {
      return null
    } else {
      return filePaths[0]
    }
  }
  private async _saveTextFile(text: string, title?: string, fileName?: string): Promise<boolean> {
    try {
      const { filePath } = await dialog.showSaveDialog({
        defaultPath: fileName,
        title: title || 'Save text file',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
      })
      if (filePath) {
        await writeFile(filePath, text)
        return true
      }
    } catch (err) {
      return false
    }
    return false
  }
}

export default FsHandle
