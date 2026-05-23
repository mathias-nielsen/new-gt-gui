import { spawn, type ChildProcess } from "child_process";
import { GtBinaryAdapter } from "../gt/gt-binary-adapter";
import type {
    GtRunResult,
    GtKillResult,
    GtExitPayload,
    GtChunkPayload,
    HandlePayload,
} from "../../shared/gt-api";

export class GastownIntegration extends GtBinaryAdapter {
    private static instance: GastownIntegration;
    private runs = new Map<string, ChildProcess>();

    private onData: HandlePayload<GtChunkPayload>;
    private onError: HandlePayload<GtChunkPayload>;
    private onExit: HandlePayload<GtExitPayload>;

    /**
     *  Singleton pattern
     */
    private constructor(
        onData: HandlePayload<GtChunkPayload>,
        onError: HandlePayload<GtChunkPayload>,
        onExit: HandlePayload<GtExitPayload>
    ) {
        super();
        this.onData = onData;
        this.onError = onError;
        this.onExit = onExit;
    }

    static initialize(
        onData: HandlePayload<GtChunkPayload>,
        onError: HandlePayload<GtChunkPayload>,
        onExit: HandlePayload<GtExitPayload>
    ): void {
        if (GastownIntegration.instance) return;
        GastownIntegration.instance = new GastownIntegration(onData, onError, onExit);
    }

    static getInstance(): GastownIntegration {
        if (!GastownIntegration.instance) throw new Error("GastownIntegration not initialized");
        return GastownIntegration.instance;
    }

    run(runId: string, args: string[] = []): GtRunResult {
        if (typeof runId !== "string" || !runId) {
            return { ok: false, error: "runId must be a non-empty string" };
        }
        if (this.runs.has(runId)) {
            return { ok: false, error: `runId ${runId} already in use` };
        }

        const gastownProcess = spawn(this.binaryPath, args, {
            env: this.buildEnv(),
            cwd: this.getCwd(),
        });

        this.runs.set(runId, gastownProcess);

        gastownProcess.stdout?.on("data", (data: Buffer) => {
            this.onData({ runId, chunk: data.toString() });
        });

        gastownProcess.stderr?.on("data", (data: Buffer) => {
            this.onError({ runId, chunk: data.toString() });
        });

        gastownProcess.on("error", (err) => {
            this.onError({ runId, chunk: `spawn error: ${err.message}\n` });
        });

        gastownProcess.on("exit", (code, signal) => {
            this.runs.delete(runId);
            this.onExit({ runId, code, signal });
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
