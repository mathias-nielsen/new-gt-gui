import * as pty from "node-pty";
import { app, type BrowserWindow } from "electron";
import path from "path";
import { GastownIntegration } from "../gastown/gastown-integration";

export class MayorIntegration {
    private static instance: MayorIntegration;
    private readonly binaryPath: string;
    private window: BrowserWindow | null = null;

    private ptyProcess: pty.IPty | null = null;

    /**
     *  Singleton pattern
     */
    private constructor(window: BrowserWindow) {
        this.window = window;
        const binaryName = process.platform === "win32" ? "gt.exe" : "gt";
        const relative = path.join("node_modules", "@gastown", "gt", "bin", binaryName);
        if (app.isPackaged) {
            this.binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", relative);
        } else {
            this.binaryPath = path.join(app.getAppPath(), relative);
        }
    }

    static initialize(window: BrowserWindow): void {
        if (MayorIntegration.instance) return;
        MayorIntegration.instance = new MayorIntegration(window);
    }

    static getInstance(): MayorIntegration {
        if (!MayorIntegration.instance) throw new Error("MayorIntegration not initialized");
        return MayorIntegration.instance;
    }

    /**
     * get: Current Working Directory
     * Used for externally located Gastown workspace folders
     */
    private getCwd(): string | undefined {
        return GastownIntegration.getInstance().getCwd();
    }

    attach(): void {
        if (this.ptyProcess || !this.window) return;

        this.ptyProcess = pty.spawn(this.binaryPath, ["mayor", "attach"], {
            name: "xterm-color",
            cols: 80,
            rows: 24,
            cwd: this.getCwd(),
            env: process.env as Record<string, string>,
        });

        const win = this.window;
        this.ptyProcess.onData((data) => {
            win.webContents.send("mayor:data", data);
        });

        this.ptyProcess.onExit(() => {
            this.ptyProcess = null;
            win.webContents.send("mayor:exit");
        });
    }

    detach(): void {
        this.ptyProcess?.kill();
        this.ptyProcess = null;
    }

    write(data: string): void {
        this.ptyProcess?.write(data);
    }

    resize(cols: number, rows: number): void {
        this.ptyProcess?.resize(cols, rows);
    }
}
