import * as pty from "node-pty";
import { app, ipcMain, type BrowserWindow } from "electron";
import path from "path";
import { GastownIntegration } from "./gastown-integration";

export class MayorIntegration {
    private static instance: MayorIntegration;
    private ptyProcess: pty.IPty | null = null;
    private window: BrowserWindow | null = null;
    private readonly binaryPath: string;

    private constructor() {
        const binaryName = process.platform === "win32" ? "gt.exe" : "gt";
        const relative = path.join("node_modules", "@gastown", "gt", "bin", binaryName);
        if (app.isPackaged) {
            this.binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", relative);
        } else {
            this.binaryPath = path.join(__dirname, "..", "..", relative);
        }
    }

    static getInstance(): MayorIntegration {
        if (!MayorIntegration.instance) {
            MayorIntegration.instance = new MayorIntegration();
        }
        return MayorIntegration.instance;
    }

    private get cwd(): string | undefined {
        return GastownIntegration.getInstance().getCwd();
    }

    attach(): void {
        if (this.ptyProcess || !this.window) return;

        this.ptyProcess = pty.spawn(this.binaryPath, ["mayor", "attach"], {
            name: "xterm-color",
            cols: 80,
            rows: 24,
            cwd: this.cwd,
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

    registerIpc(window: BrowserWindow): void {
        this.window = window;
        ipcMain.handle("mayor:attach", () => this.attach());
        ipcMain.handle("mayor:detach", () => this.detach());
        ipcMain.on("mayor:write", (_event, data: string) => this.write(data));
        ipcMain.on("mayor:resize", (_event, cols: number, rows: number) => this.resize(cols, rows));
    }
}
