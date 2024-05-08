import {
  app,
  shell,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  globalShortcut,
  powerSaveBlocker
} from 'electron'
import { Event, HandlerDetails } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import log from 'electron-log/main'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/app/iconTemplate.png?asset'
import trayIcon from '../../resources/tray/iconTemplate.png?asset'
import EventBus from './libs/EventBus'
import Node from './node'
import Worker from './worker'
import AppEnv from './libs/appEnv'
import { runMigrations } from './libs/migrate'
import StatusWorker from './monitoring/status'
import SnapshotWorker from './monitoring/snapshot'
import FsHandle from './libs/FsHandle'

log.transports.file.level = 'debug'
autoUpdater.logger = log

const eventBus = new EventBus()
let tray: null | Tray = null
let preventSleepId: null | number = null
let mainWindow: null | BrowserWindow = null
let updateWindow: null | BrowserWindow = null
const appEnv = new AppEnv({
  isPackaged: app.isPackaged,
  appPath: app.getAppPath(),
  userData: app.getPath('userData'),
  version: app.getVersion()
})
const node = new Node(ipcMain, appEnv, eventBus)
const worker = new Worker(ipcMain, appEnv)
const fsHandle = new FsHandle(ipcMain)
const statusWorker = new StatusWorker(appEnv, eventBus)
const snapshotWorker = new SnapshotWorker(appEnv, eventBus)
// Optional, initialize the logger for any renderer process
log.initialize({ spyRendererConsole: true })

process.on('uncaughtException', (error) => {
  log.error(`Uncaught Exception: ${error.message}`)
  log.error(error.stack)
})

function createUpdateWindow(): void {
  updateWindow = new BrowserWindow({
    // width: 1024,
    // height: 768,
    width: 1200,
    height: 900,
    icon: icon,
    center: true,
    title: 'Waterfall Update',
    webPreferences: {
      sandbox: false
    }
  })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    log.debug('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])
    updateWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/update.html`).then(() => {})
  } else {
    updateWindow.loadFile(join(__dirname, '../renderer/update.html')).then(() => {})
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 1024,
    // height: 768,
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    center: true,
    title: 'Waterfall',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1677ff',
      symbolColor: '#fff',
      height: 40
    },
    trafficLightPosition: { x: 10, y: 12 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    if (updateWindow) {
      updateWindow.close()
    }
    if (mainWindow === null) {
      return
    }
    mainWindow.show()
  })

  mainWindow.on('close', function (event: Event): void {
    event.preventDefault()
    if (mainWindow === null) {
      return
    }
    mainWindow.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details: HandlerDetails) => {
    shell.openExternal(details.url).then(() => {
      return { action: 'deny' }
    })
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`).then(() => {})
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then(() => {})
  }
}

app.setName('Waterfall')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('app.waterfall')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  if (appEnv.getPlatform() === 'mac') {
    //   app.dock.hide()
    app.dock.setIcon(icon)
  }
  createUpdateWindow()

  try {
    await runMigrations()
    log.debug('runMigrations Done')
  } catch (e) {
    log.error('runMigrations', e)
    return await quit()
  }

  try {
    await node.initialize()
    log.debug('node.initialize Done')
  } catch (e) {
    log.error('node.initialize', e)
    return await quit()
  }

  try {
    await worker.initialize()
    log.debug('worker.initialize Done')
  } catch (e) {
    log.error('worker.initialize', e)
    return await quit()
  }

  try {
    fsHandle.initialize()
    log.debug('sHandle.initialize Done')
  } catch (e) {
    log.error('fsHandle.initialize', e)
    return await quit()
  }

  statusWorker.start()
  log.debug('statusWorker.postMessage start')

  snapshotWorker.start()

  log.debug('snapshotWorker.postMessage start')

  preventSleepId = powerSaveBlocker.start('prevent-app-suspension')

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: (): void => {
        // if (getPlatform() === 'mac') {
        //   app.show()
        // }
        // app.focus()
        if (mainWindow === null) {
          return
        }
        mainWindow.show()
        log.debug('Show')
      }
    },
    {
      label: 'Check Updates',
      click: (): void => {
        // autoUpdater.channel = 'beta'
        autoUpdater.checkForUpdatesAndNotify()
        log.debug('check update')
      }
    },
    {
      label: 'Quit',
      click: async () => {
        await quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Waterfall')
  ipcMain.handle('app:quit', async () => await quit())
  ipcMain.handle('app:state', async () => ({
    version: appEnv.version
  }))

  createWindow()

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      return
    }
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow === null) {
      return
    }
    mainWindow.webContents.toggleDevTools()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const quit = async () => {
  await statusWorker.destroy()

  await snapshotWorker.destroy()

  await worker.destroy()

  await node.destroy()

  await fsHandle.destroy()

  if (preventSleepId !== null) {
    powerSaveBlocker.stop(preventSleepId)
  }

  if (mainWindow !== null) {
    mainWindow.destroy()
  }
  globalShortcut.unregisterAll()
  app.quit()
  log.debug('Quit')
}
