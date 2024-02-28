import { app, shell, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { Event, HandlerDetails } from 'electron'
import { join } from 'path'
import log from 'electron-log/main'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/app/iconTemplate.png?asset'
import trayIcon from '../../resources/tray/iconTemplate.png?asset'
import Node from './node'
import AppEnv from './libs/appEnv'
import { runMigrations } from './libs/migrate'
import createStatusWorker from './monitoring/status?nodeWorker'

let tray: null | Tray = null
let mainWindow: null | BrowserWindow = null
let updateWindow: null | BrowserWindow = null
const appEnv = new AppEnv({
  isPackaged: app.isPackaged,
  appPath: app.getAppPath(),
  userData: app.getPath('userData')
})
const node = new Node(ipcMain, appEnv)
const statusWorker = createStatusWorker({
  workerData: {
    isPackaged: appEnv.isPackaged,
    appPath: appEnv.appPath,
    userData: appEnv.userData
  }
})
// Optional, initialize the logger for any renderer process
log.initialize()

function createUpdateWindow(): void {
  updateWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: icon,
    center: true,
    title: 'Waterfall App Update',
    webPreferences: {
      sandbox: false
    }
  })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])
    updateWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/update.html`).then(() => {})
  } else {
    updateWindow.loadFile(join(__dirname, '../renderer/update.html')).then(() => {})
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    center: true,
    title: 'Waterfall App',
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

app.setName('Waterfall App')
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
  } catch (e) {
    console.log('runMigrations', e)
    return await quit()
  }

  try {
    await node.initialize()
  } catch (e) {
    console.log('node.initialize', e)
    return await quit()
  }

  statusWorker.postMessage({
    type: 'start'
  })

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
        console.log('Show')
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
  tray.setToolTip('Waterfall App')

  // setTimeout(async () => {
  //   console.log('start add')
  //   if (!node) {
  //     return
  //   }
  //   const res = await node.tmp()
  //   console.log('end add', res)
  // }, 5000)
  createWindow()

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      return
    }
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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
  statusWorker.postMessage({
    type: 'stop'
  })
  statusWorker.terminate()

  await node.destroy()

  if (mainWindow !== null) {
    mainWindow.destroy()
  }
  app.quit()
  console.log('Quit')
}
