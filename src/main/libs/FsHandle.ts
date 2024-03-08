import { IpcMain, dialog, IpcMainInvokeEvent } from 'electron'

class FsHandle {
  private ipcMain: IpcMain

  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain
  }

  public initialize() {
    this.ipcMain.handle('os:selectDirectory', (_event: IpcMainInvokeEvent, defaultPath) =>
      this._selectDirectory(defaultPath)
    )
  }

  public async destroy() {
    this.ipcMain.removeHandler('os:selectDirectory')
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
}

export default FsHandle
