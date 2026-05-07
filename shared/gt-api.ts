export interface GtChunkPayload {
  runId: string
  chunk: string
}

export interface GtExitPayload {
  runId: string
  code: number | null
  signal: string | null
}

export type GtRunResult =
  | { ok: true; pid: number | undefined; binaryPath: string }
  | { ok: false; error: string }

export type GtKillResult =
  | { ok: true }
  | { ok: false; error: string }

export interface GtAPI {
  run: (runId: string, args: string[]) => Promise<GtRunResult>
  kill: (runId: string) => Promise<GtKillResult>
  onStdout: (callback: (payload: GtChunkPayload) => void) => void
  onStderr: (callback: (payload: GtChunkPayload) => void) => void
  onExit: (callback: (payload: GtExitPayload) => void) => void
}
