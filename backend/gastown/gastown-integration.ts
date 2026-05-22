import { spawn, type ChildProcess } from "child_process";
import { app, type BrowserWindow } from "electron";
import path from "path";
import type { GtRunResult, GtKillResult } from "../../shared/gt-api";

export class GastownIntegration {
    private static instance: GastownIntegration;
    private readonly binaryPath: string;
    private readonly doltBinDir: string;
    private window: BrowserWindow | null = null;

    private runs = new Map<string, ChildProcess>();
    private cwd: string | undefined;

    /**
     *  Singleton pattern
     */
    private constructor(window: BrowserWindow) {
        this.window = window;
        const binaryName = process.platform === "win32" ? "gt.exe" : "gt";
        const relative = path.join("node_modules", "@gastown", "gt", "bin", binaryName);
        if (app.isPackaged) {
            this.binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", relative);
            this.doltBinDir = path.join(process.resourcesPath, "app.asar.unpacked", "bin", "dolt");
        } else {
            this.binaryPath = path.join(app.getAppPath(), relative);
            this.doltBinDir = path.join(app.getAppPath(), "bin", "dolt");
        }
    }

    static initialize(window: BrowserWindow): void {
        if (GastownIntegration.instance) return;
        GastownIntegration.instance = new GastownIntegration(window);
    }

    static getInstance(): GastownIntegration {
        if (!GastownIntegration.instance) throw new Error("GastownIntegration not initialized");
        return GastownIntegration.instance;
    }

    /**
     * Set: Current Working Directory
     * Used for externally located Gastown workspace folders
     */
    setCwd(path: string): void {
        this.cwd = path;
    }

    /**
     * get: Current Working Directory
     * Used for externally located Gastown workspace folders
     */
    getCwd(): string | undefined {
        return this.cwd;
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

        const pathSep = process.platform === "win32" ? ";" : ":";
        const env = { ...process.env, PATH: `${this.doltBinDir}${pathSep}${process.env.PATH}` };
        const gastownProcess = spawn(this.binaryPath, args, { env, cwd: this.cwd });

        this.runs.set(runId, gastownProcess);

        const win = this.window;
        gastownProcess.stdout?.on("data", (data: Buffer) =>
            win.webContents.send("gt:stdout", { runId, chunk: data.toString() })
        );
        gastownProcess.stderr?.on("data", (data: Buffer) =>
            win.webContents.send("gt:stderr", { runId, chunk: data.toString() })
        );
        gastownProcess.on("error", (err) =>
            win.webContents.send("gt:stderr", { runId, chunk: `spawn error: ${err.message}\n` })
        );
        gastownProcess.on("exit", (code, signal) => {
            this.runs.delete(runId);
            win.webContents.send("gt:exit", { runId, code, signal });
        });

        return { ok: true, pid: gastownProcess.pid, binaryPath: this.binaryPath };
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
}
