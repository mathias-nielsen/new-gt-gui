import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { GtAPI, GtChunkPayload, GtExitPayload } from "./shared/gt-api";
import type { StorageAPI } from "./shared/storage-api";
import { MayorAPI } from "./shared/mayor-api";
import { CHANNELS } from "./shared/channels";

/* Docs
https://www.electronjs.org/docs/latest/api/context-bridge
https://www.electronjs.org/docs/latest/api/ipc-renderer
*/

/**
 * The renderer-engine (Frontend) owns the runId so its routing entry can be set up before
 * any output events arrive — see docs/wrapping-gt.md for the rationale.
 */
const gtAPI: GtAPI = {
    run: (runId, args) => ipcRenderer.invoke(CHANNELS.GT.RUN, runId, args),
    kill: (runId) => ipcRenderer.invoke(CHANNELS.GT.KILL, runId),
    setCwd: (path) => ipcRenderer.invoke(CHANNELS.GT.SET_CURRENT_WORKING_DIRECTORY, path),
    onStdout: (callback) =>
        ipcRenderer.on(CHANNELS.GT.STD_OUT, (_e: IpcRendererEvent, payload: GtChunkPayload) =>
            callback(payload)
        ),
    onStderr: (callback) =>
        ipcRenderer.on(CHANNELS.GT.STD_ERROR, (_e: IpcRendererEvent, payload: GtChunkPayload) =>
            callback(payload)
        ),
    onExit: (callback) =>
        ipcRenderer.on(CHANNELS.GT.EXIT, (_e: IpcRendererEvent, payload: GtExitPayload) =>
            callback(payload)
        ),
};

const storageAPI: StorageAPI = {
    get: (key: string) => ipcRenderer.invoke(CHANNELS.STORAGE.GET, key),
    set: (key: string, value: unknown) => ipcRenderer.invoke(CHANNELS.STORAGE.SET, key, value),
};

const mayorAPI: MayorAPI = {
    attach: () => ipcRenderer.invoke(CHANNELS.MAYOR.ATTACH),
    detach: () => ipcRenderer.invoke(CHANNELS.MAYOR.DETACH),
    write: (data) => ipcRenderer.send(CHANNELS.MAYOR.WRITE, data),
    resize: (cols, rows) => ipcRenderer.send(CHANNELS.MAYOR.RESIZE, cols, rows),
    onData: (callback) => {
        const handler = (_e: IpcRendererEvent, data: string) => callback(data);
        ipcRenderer.on(CHANNELS.MAYOR.DATA, handler);
        return () => ipcRenderer.removeListener(CHANNELS.MAYOR.DATA, handler);
    },
};

const WINDOW_OBJECT_KEYS = {
    GT: "gt",
    STORAGE: "storage",
    MAYOR: "mayor",
};

contextBridge.exposeInMainWorld(WINDOW_OBJECT_KEYS.GT, gtAPI);
contextBridge.exposeInMainWorld(WINDOW_OBJECT_KEYS.STORAGE, storageAPI);
contextBridge.exposeInMainWorld(WINDOW_OBJECT_KEYS.MAYOR, mayorAPI);
