import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { GtAPI, GtChunkPayload, GtExitPayload } from "../shared/gt-api";
import type { StorageAPI } from "../shared/storage-api";
import type { MayorAPI } from "../shared/mayor-api";

/* Docs
https://www.electronjs.org/docs/latest/api/context-bridge
https://www.electronjs.org/docs/latest/api/ipc-renderer
*/

/**
 * The renderer-engine (Frontend) owns the runId so its routing entry can be set up before
 * any output events arrive — see docs/wrapping-gt.md for the rationale.
 */
const gtAPI: GtAPI = {
    run: (runId, args) => ipcRenderer.invoke("gt:run", runId, args),
    kill: (runId) => ipcRenderer.invoke("gt:kill", runId),
    setCwd: (path) => ipcRenderer.invoke("gt:setCwd", path),
    onStdout: (callback) =>
        ipcRenderer.on("gt:stdout", (_e: IpcRendererEvent, payload: GtChunkPayload) =>
            callback(payload)
        ),
    onStderr: (callback) =>
        ipcRenderer.on("gt:stderr", (_e: IpcRendererEvent, payload: GtChunkPayload) =>
            callback(payload)
        ),
    onExit: (callback) =>
        ipcRenderer.on("gt:exit", (_e: IpcRendererEvent, payload: GtExitPayload) =>
            callback(payload)
        ),
};

const storageAPI: StorageAPI = {
    get: (key: string) => ipcRenderer.invoke("storage:get", key),
    set: (key: string, value: unknown) => ipcRenderer.invoke("storage:set", key, value),
};

const mayorAPI: MayorAPI = {
    attach: () => ipcRenderer.invoke("mayor:attach"),
    detach: () => ipcRenderer.invoke("mayor:detach"),
    write: (data) => ipcRenderer.send("mayor:write", data),
    resize: (cols, rows) => ipcRenderer.send("mayor:resize", cols, rows),
    onData: (callback) => {
        const handler = (_e: IpcRendererEvent, data: string) => callback(data);
        ipcRenderer.on("mayor:data", handler);
        return () => ipcRenderer.removeListener("mayor:data", handler);
    },
};

contextBridge.exposeInMainWorld("gt", gtAPI);
contextBridge.exposeInMainWorld("storage", storageAPI);
contextBridge.exposeInMainWorld("mayor", mayorAPI);
