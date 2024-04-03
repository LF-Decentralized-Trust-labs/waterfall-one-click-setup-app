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
import { join } from 'path'
import log from 'electron-log/main'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/app/iconTemplate.png?asset'
import trayIcon from '../../resources/tray/iconTemplate.png?asset'
import Node from './node'
import Worker from './worker'
import AppEnv from './libs/appEnv'
import { runMigrations } from './libs/migrate'
import createStatusWorker from './monitoring/status?nodeWorker'
import FsHandle from './libs/FsHandle'

let tray: null | Tray = null
let preventSleepId: null | number = null
let mainWindow: null | BrowserWindow = null
let updateWindow: null | BrowserWindow = null
const appEnv = new AppEnv({
  isPackaged: app.isPackaged,
  appPath: app.getAppPath(),
  userData: app.getPath('userData')
})
const node = new Node(ipcMain, appEnv)
const worker = new Worker(ipcMain, appEnv)
const fsHandle = new FsHandle(ipcMain)
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
    console.log('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])
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
    console.log('runMigrations', e)
    return await quit()
  }

  try {
    await node.initialize()
    log.debug('node.initialize Done')
  } catch (e) {
    console.log('node.initialize', e)
    return await quit()
  }

  try {
    await worker.initialize()
    log.debug('worker.initialize Done')
  } catch (e) {
    console.log('worker.initialize', e)
    return await quit()
  }

  try {
    fsHandle.initialize()
    log.debug('sHandle.initialize Done')
  } catch (e) {
    console.log('fsHandle.initialize', e)
    return await quit()
  }

  statusWorker.postMessage({
    type: 'start'
  })
  log.debug('statusWorker.postMessage start')

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
  tray.setToolTip('Waterfall')

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
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow === null) {
      return
    }
    mainWindow.webContents.toggleDevTools()
  })

  // const m1 = web3.utils.genMnemonic()
  //
  // log.debug('Mnemonic2', m1)
  //
  // const prase =
  //   'empty slogan praise parent spin female ladder orange cost gospel split regret caught inquiry glad alter hundred cry write judge point assist trust kick'
  // const depositData = await web3.utils.getDepositData(
  //   prase,
  //   1,
  //   '0x30c35895fe0f7768a261b5326e4332cbb4556ba3'
  // )
  // log.debug('depositData', depositData)
  // const keystore =
  //   '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "dc8e0eb6cfd8b5c67288940873373a85333e77407f7d56a91e8ae97d52d3c201"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "90bfdbec871d2a2e25ffe1edc27352add7d33331457f026c2a0156d41438e31a"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "ad3312b6841dbb483d07b2f48e96616e"}, "message": "3c79c61344cbafc1f5b632a0996595ebe40e1d75c052e1c93406b89808f5c02a"}}, "description": "", "pubkey": "865144c3f453813c1145617672b2abf16f0ed1b09365af178b3130819c0e6ad2a98d7c4342b43b2bb0ce61b6badeeae9", "path": "m/12381/3600/1/0/0", "uuid": "6cf3ddb3-9d9e-49db-8256-bf63a5991e1b", "version": 4}'
  // const keystoreObject = JSON.parse(keystore)
  // const pass = 'COORDINATOR_PASSWORD'
  // const pkey = await web3.utils.getSecretKeyFromKeystore(keystoreObject, pass)
  // log.debug('pkey', pkey)
  // const keystoreObject2 = await web3.utils.getKeyStore(prase, 1, pass)
  // log.debug('keystoreObject2', keystoreObject2)
  // const pkey2 = await web3.utils.getSecretKeyFromKeystore(keystoreObject2, pass)
  // log.debug('pkey2', pkey2)
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
  await statusWorker.terminate()

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
  console.log('Quit')
}
