export interface GtChunkPayload {
    runId: string;
    chunk: string;
}

export interface GtExitPayload {
    runId: string;
    code: number | null;
    signal: string | null;
}

export type HandlePayload<T = GtChunkPayload | GtExitPayload> = (payload: T) => void;

export type GtRunResult =
    | { ok: true; pid: number | undefined; binaryPath: string }
    | { ok: false; error: string };

export type GtKillResult = { ok: true } | { ok: false; error: string };

export interface GtAPI {
    run: (runId: string, args: string[]) => Promise<GtRunResult>;
    kill: (runId: string) => Promise<GtKillResult>;
    setCwd: (path: string) => Promise<void>;
    onStdout: (callback: HandlePayload<GtChunkPayload>) => void;
    onStderr: (callback: HandlePayload<GtChunkPayload>) => void;
    onExit: (callback: HandlePayload<GtExitPayload>) => void;
}
