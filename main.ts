import { app, BrowserWindow } from 'electron'
import path from 'path'
import { registerGtIpc } from './engine/gastown-integration'

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'engine', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    if (VITE_DEV_SERVER_URL) {
        window.loadURL(VITE_DEV_SERVER_URL)
    } else {
        window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
    }
    registerGtIpc(window)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
