import { IpcMain, dialog, IpcMainInvokeEvent } from 'electron'
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
    this.ipcMain.handle('os:saveTextFile', (_event: IpcMainInvokeEvent, text, title, fileName) =>
      this._saveTextFile(text, title, fileName)
    )
  }

  public async destroy() {
    this.ipcMain.removeHandler('os:selectDirectory')
    this.ipcMain.removeHandler('os:saveTextFile')
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
