import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

type Props = {
    terminal: Terminal;
};

export function TerminalPane({ terminal }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        // Terminal size:
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(containerRef.current);

        // Defer fit until flex layout has settled; calling it synchronously
        // gives wrong dimensions, which misaligns cursor tracking.
        const frame = requestAnimationFrame(() => fitAddon.fit());

        const observer = new ResizeObserver(() => {
            fitAddon.fit();
            window.mayor.resize(terminal.cols, terminal.rows);
        });
        observer.observe(containerRef.current);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
