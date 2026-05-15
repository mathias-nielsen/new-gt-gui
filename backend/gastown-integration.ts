import { spawn, type ChildProcess } from "child_process";
import { app, ipcMain, type BrowserWindow } from "electron";
import path from "path";
import type { GtRunResult, GtKillResult } from "../shared/gt-api";

export class GastownIntegration {
    private static instance: GastownIntegration;
    private runs = new Map<string, ChildProcess>();
    private window: BrowserWindow | null = null;
    private readonly binaryPath: string;
    private cwd: string | undefined;

    private constructor() {
        const binaryName = process.platform === "win32" ? "gt.exe" : "gt";
        const relative = path.join("node_modules", "@gastown", "gt", "bin", binaryName);
        if (app.isPackaged) {
            this.binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", relative);
        } else {
            this.binaryPath = path.join(__dirname, "..", "..", relative);
        }
    }

    static getInstance(): GastownIntegration {
        if (!GastownIntegration.instance) {
            GastownIntegration.instance = new GastownIntegration();
        }
        return GastownIntegration.instance;
    }

    run(runId: string, args: string[] = []): GtRunResult {
        if (typeof runId !== "string" || !runId) {
            return { ok: false, error: "runId must be a non-empty string" };
        }
        if (this.runs.has(runId)) {
            return { ok: false, error: `runId ${runId} already in use` };
        }
        if (!this.window) {
            return { ok: false, error: "no window registered" };
        }

        const child = spawn(this.binaryPath, args, { env: process.env, cwd: this.cwd });

        this.runs.set(runId, child);

        const win = this.window;
        child.stdout?.on("data", (d: Buffer) =>
            win.webContents.send("gt:stdout", { runId, chunk: d.toString() })
        );
        child.stderr?.on("data", (d: Buffer) =>
            win.webContents.send("gt:stderr", { runId, chunk: d.toString() })
        );
        child.on("error", (err) =>
            win.webContents.send("gt:stderr", { runId, chunk: `spawn error: ${err.message}\n` })
        );
        child.on("exit", (code, signal) => {
            this.runs.delete(runId);
            win.webContents.send("gt:exit", { runId, code, signal });
        });

        return { ok: true, pid: child.pid, binaryPath: this.binaryPath };
    }

    setCwd(path: string): void {
        this.cwd = path;
    }

    getCwd(): string | undefined {
        return this.cwd;
    }

    kill(runId: string): GtKillResult {
        if (typeof runId !== "string") {
            return { ok: false, error: "runId must be a string" };
        }

        const child = this.runs.get(runId);
        if (!child) {
            return { ok: false, error: `no run with id ${runId}` };
        }

        child.kill();
        return { ok: true };
    }

    registerIpc(window: BrowserWindow): void {
        this.window = window;
        ipcMain.handle(
            "gt:run",
            (_event, runId: string, args: string[]): GtRunResult => this.run(runId, args)
        );
        ipcMain.handle("gt:kill", (_event, runId: string): GtKillResult => this.kill(runId));
        ipcMain.handle("gt:setCwd", (_event, path: string): void => this.setCwd(path));
    }
}
