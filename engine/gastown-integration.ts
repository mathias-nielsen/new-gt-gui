import { spawn, type ChildProcess } from 'child_process'
import { app, ipcMain, type BrowserWindow } from 'electron'
import path from 'path'
import type { GtRunResult, GtKillResult } from '../shared/gt-api'

const runs = new Map<string, ChildProcess>()

function getGtBinaryPath(): string {
    const binaryName = process.platform === 'win32' ? 'gt.exe' : 'gt'
    const relative = path.join('node_modules', '@gastown', 'gt', 'bin', binaryName)
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app.asar.unpacked', relative)
    }
    return path.join(__dirname, '..', '..', relative)
}

const handleRun = (window: BrowserWindow, runId: string, args: string[] = []): GtRunResult => {
        if (typeof runId !== 'string' || !runId) {
            return { ok: false, error: 'runId must be a non-empty string' }
        }
        if (runs.has(runId)) {
            return { ok: false, error: `runId ${runId} already in use` }
        }

        const binaryPath = getGtBinaryPath()
        const child = spawn(binaryPath, args, { env: process.env })

        runs.set(runId, child)

        child.stdout?.on('data', (d: Buffer) =>
            window.webContents.send('gt:stdout', { runId, chunk: d.toString() })
        )
        child.stderr?.on('data', (d: Buffer) =>
            window.webContents.send('gt:stderr', { runId, chunk: d.toString() })
        )
        child.on('error', (err) =>
            window.webContents.send('gt:stderr', { runId, chunk: `spawn error: ${err.message}\n` })
        )
        child.on('exit', (code, signal) => {
            runs.delete(runId)
            window.webContents.send('gt:exit', { runId, code, signal })
        })

        return { ok: true, pid: child.pid, binaryPath }
}


const handleKill = (runId: string): GtKillResult => {
    if (typeof runId !== 'string') {
        return { ok: false, error: 'runId must be a string' }
    }
    
    const child = runs.get(runId)

    if (!child) {
        return { ok: false, error: `no run with id ${runId}` }
    } 

    child.kill()
    
    return { ok: true }
}


export function registerGtIpc(window: BrowserWindow): void {
    ipcMain.handle('gt:run', (_event, runId: string, args: string[]): GtRunResult => handleRun(window, runId, args))
    ipcMain.handle('gt:kill', (_event, runId: string): GtKillResult => handleKill(runId))
}