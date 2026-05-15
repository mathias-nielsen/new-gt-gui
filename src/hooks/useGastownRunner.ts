import { useEffect, useState } from "react";
import { useGtSessions, type GtChunk } from "../stores/gtSessions";
import { createLogEntry } from "@/components/SystemLog/util";
import { systemLog, type SystemLogEntry } from "@/stores/systemLog";

export interface GastownRunner {
    run: (args: string[]) => void;
    kill: () => void;
    dismiss: () => void;
    status: "idle" | "running" | "exited" | "error";
    exitCode: number | null;
    chunks: GtChunk[];
    output: string;
}

export const useGastownRunner = (
    onExited?: (entry: SystemLogEntry) => void
): GastownRunner => {
    const [runId, setRunId] = useState<string | null>(null);

    const start = useGtSessions((s) => s.start);
    const kill = useGtSessions((s) => s.kill);
    const dismiss = useGtSessions((s) => s.dismiss);
    const currentRun = useGtSessions((s) => (runId ? s.runs[runId] : undefined));

    useEffect(() => {
        if (currentRun?.status !== "exited") return;
        const entry = createLogEntry(currentRun.chunks);
        systemLog.append(entry);
        onExited?.(entry);
    }, [currentRun?.status]);

    return {
        run: (args) => setRunId(start(args)),
        kill: () => {
            if (runId) kill(runId);
        },
        dismiss: () => {
            if (runId) {
                dismiss(runId);
                setRunId(null);
            }
        },
        status: currentRun?.status ?? "idle",
        exitCode: currentRun?.code ?? null,
        chunks: currentRun?.chunks ?? [],
        output: currentRun?.chunks.map((c) => c.text).join("") ?? "",
    };
};
