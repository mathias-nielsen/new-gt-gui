import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import type { GtAPI, GtChunkPayload, GtExitPayload } from '../shared/gt-api'

/* Docs
https://www.electronjs.org/docs/latest/api/context-bridge
https://www.electronjs.org/docs/latest/api/ipc-renderer
*/

/**
 * The renderer owns the runId so its routing entry can be set up before
 * any output events arrive — see docs/wrapping-gt.md for the rationale.
 */
const gtAPI: GtAPI = {
    run: (runId, args) => ipcRenderer.invoke('gt:run', runId, args),
    kill: (runId) => ipcRenderer.invoke('gt:kill', runId),
    onStdout: (callback) => ipcRenderer.on('gt:stdout', (_e: IpcRendererEvent, payload: GtChunkPayload) => callback(payload)),
    onStderr: (callback) => ipcRenderer.on('gt:stderr', (_e: IpcRendererEvent, payload: GtChunkPayload) => callback(payload)),
    onExit: (callback) => ipcRenderer.on('gt:exit', (_e: IpcRendererEvent, payload: GtExitPayload) => callback(payload))
}

const gtAPIKey = 'gt'

contextBridge.exposeInMainWorld(gtAPIKey, gtAPI)
