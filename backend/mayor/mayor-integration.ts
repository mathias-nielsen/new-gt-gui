import * as pty from "node-pty";
import { GtBinaryAdapter } from "../gt/gt-binary-adapter";
import { HandleData, HandleExit } from ".";

export class MayorIntegration extends GtBinaryAdapter {
    private static instance: MayorIntegration;

    private ptyProcess: pty.IPty | null = null;

    /**
     *  Singleton pattern
     */
    private constructor() {
        super();
    }

    static initialize(): void {
        if (MayorIntegration.instance) return;
        MayorIntegration.instance = new MayorIntegration();
    }

    static getInstance(): MayorIntegration {
        if (!MayorIntegration.instance) throw new Error("MayorIntegration not initialized");
        return MayorIntegration.instance;
    }

    attach(onData: HandleData, onExit: HandleExit): void {
        if (this.ptyProcess) return;

        this.ptyProcess = pty.spawn(this.binaryPath, ["mayor", "attach"], {
            name: "xterm-color",
            cols: 80,
            rows: 24,
            cwd: this.getCwd(),
            env: this.buildEnv() as Record<string, string>,
        });

        this.ptyProcess.onData(onData);

        this.ptyProcess.onExit(() => {
            this.ptyProcess = null;
            onExit();
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
