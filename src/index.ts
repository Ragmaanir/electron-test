// import * as app from 'electron'
// import {app, BrowserWindow} from 'electron'
import * as path from "path"
import * as url from "url"
import * as ipc from 'node-ipc'
import {Socket} from 'net'

// const Socket = ipc.Socket

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const NativeImage = electron.NativeImage

// import path = require("path")
// import url = require("url")

// import {app, BrowserWindow} = require("electron")

// import app = require("electron").app
// import BrowserWindow = require("electron").BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win : typeof BrowserWindow

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    skipTaskbar: true,
    frame: false,
    show: false
  })

  // win.webContents.openDevTools()

  // child.once('ready-to-show', () => {
  //   child.show()
  // })

  // win.on('resize', (event : Event) => {
  //   console.log("resize")
  // })

  // Emitted when the window is closed.
  win.once('closed', () => {
    console.log("closed")
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // win.once('close', () => {
  //   console.log("close")
  // })

  let contents = win.webContents

  let screenshot = (name : string, callback : () => void) => {
    win.capturePage((img : typeof NativeImage) => {
      require('fs').writeFile(name, img.toPng(), () => {
        console.log(img.toPng().length)
        callback()
      })
    })
  }

  // contents.on("paint", (event : Event) => {
  //   console.log("PAINT")
  // })

  win.on("ready-to-show", (event : Event) => {
    console.log("ready-to-show")

    // screenshot("ready-to-show.png")
    // win.close()
  })

  contents.once("did-finish-load", (event : Event) => {
    console.log("did-finish-load")
    // contents.executeJavaScript("1+1", () => {
    // })
  })

  // contents.once("dom-ready", (event : Event) => {
  //   console.log("dom-ready")
  // })

  ipc.config.id    = 'world'
  ipc.config.retry = 1500

  ipc.serve(
    () => {
      ipc.server.on(
        'screenshot',
        (data : string, socket : Socket) => {
          ipc.log('Received: SCREENSHOT')
          screenshot("didit.png", () => {
            ipc.log('Sending: SCREENSHOT.DONE')
            ipc.server.emit(socket, 'screenshot.done')
          })
        }
      )

      ipc.server.on(
        'socket.disconnected',
        (socket : Socket, destroyedSocketID : string) => {
          ipc.log('Received: SOCKET.DISCONNECT : ' + destroyedSocketID)
        }
      )

      ipc.server.on(
        'quit',
        (data : string, socket : Socket) => {
          ipc.log('Received: QUIT')
          win.close()
        }
      )
    }
  )

  ipc.server.start();

  console.log("server started")

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../src/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

