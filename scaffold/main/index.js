/**
 * electron main script
 *
 * @flow
 */

import path from 'path'
import { app, BrowserWindow } from 'electron'

/// code

function createWindow(clearContext) {
  const window = new BrowserWindow({
    height: 480,
    width: 320,
    frame: false,
    titleBarStyle: 'hidden'
  })

  if('production' !== process.env.NODE_ENV) {
    window.webContents.openDevTools()
  }

  window.loadURL(
    'production' !== process.env.NODE_ENV
      ? 'http://localhost:23333'
      : path.resolve('./scaffold/build/index.html')
  )

  window.on('closed', () => {
    clearContext && clearContext()
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}


function main() {
  let mainWindow

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      mainWindow = createWindow(() => mainWindow == null)
    }
  })

  app.on('ready', () => {
    mainWindow = createWindow(() => mainWindow == null)
  })
}


/// run

main()
