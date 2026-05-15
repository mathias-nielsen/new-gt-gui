import { GtChunk } from "@/stores/gtSessions";
import { SystemLogEntry } from "@/stores/systemLog";

const parseExitChunk = (text: string): number => {
    const match = text.match(/\[exited code=(-?\d+) signal=\S+\]/);
    return match ? parseInt(match[1], 10) : -1;
};

export const createLogEntry = (chunks: GtChunk[]): SystemLogEntry => {
    let command = "";
    const output: string[] = [];
    let exitCode = -1;

    chunks.forEach(({ text, cls }) => {
        if (!cls || cls === "err") {
            output.push(text);
        } else if (cls === "meta" && text.includes("$ gt")) {
            command = text.trim();
        } else if (cls === "meta" && text.includes("exited")) {
            exitCode = parseExitChunk(text);
        }
    });

    return {
        command,
        output: output.join(""),
        exitCode,
    };
};
