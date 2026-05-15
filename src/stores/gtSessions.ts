import { create } from "zustand";

export interface GtChunk {
    text: string;
    cls?: "meta" | "err";
}

export interface GtRun {
    args: string[];
    status: "running" | "exited" | "error";
    code?: number | null;
    signal?: string | null;
    chunks: GtChunk[];
}

interface GtSessionsState {
    runs: Record<string, GtRun>;
    start: (args: string[]) => string;
    kill: (runId: string) => void;
    dismiss: (runId: string) => void;
    _appendChunk: (runId: string, chunk: GtChunk) => void;
    _markExited: (runId: string, code: number | null, signal: string | null) => void;
    _markError: (runId: string, message: string) => void;
}

export const useGtSessions = create<GtSessionsState>((set, get) => {
    window.gt.onStdout(({ runId, chunk }) => get()._appendChunk(runId, { text: chunk }));
    window.gt.onStderr(({ runId, chunk }) => get()._appendChunk(runId, { text: chunk, cls: "err" }));
    window.gt.onExit(({ runId, code, signal }) => get()._markExited(runId, code, signal));

    return {
        runs: {},

        start: (args) => {
            const runId = crypto.randomUUID();
            set((state) => ({
                runs: {
                    ...state.runs,
                    [runId]: { args, status: "running", chunks: [{ text: `$ gt ${args.join(" ")}\n`, cls: "meta" }] },
                },
            }));
            window.gt.run(runId, args).then((result) => {
                if (!result.ok) get()._markError(runId, result.error);
            });
            return runId;
        },

        kill: (runId) => void window.gt.kill(runId),

        dismiss: (runId) =>
            set((state) => {
                const next = { ...state.runs };
                delete next[runId];
                return { runs: next };
            }),

        _appendChunk: (runId, chunk) =>
            set((state) =>
                state.runs[runId]
                    ? { runs: { ...state.runs, [runId]: { ...state.runs[runId], chunks: [...state.runs[runId].chunks, chunk] } } }
                    : state
            ),

        _markExited: (runId, code, signal) =>
            set((state) =>
                state.runs[runId]
                    ? {
                          runs: {
                              ...state.runs,
                              [runId]: {
                                  ...state.runs[runId],
                                  status: "exited",
                                  code,
                                  signal,
                                  chunks: [
                                      ...state.runs[runId].chunks,
                                      { text: `\n[exited code=${code} signal=${signal ?? "none"}]\n`, cls: "meta" },
                                  ],
                              },
                          },
                      }
                    : state
            ),

        _markError: (runId, message) =>
            set((state) =>
                state.runs[runId]
                    ? { runs: { ...state.runs, [runId]: { ...state.runs[runId], status: "error", chunks: [...state.runs[runId].chunks, { text: message, cls: "err" }] } } }
                    : state
            ),
    };
});
