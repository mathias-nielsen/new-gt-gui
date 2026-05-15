import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export function TerminalPane() {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new Terminal({ cursorBlink: true, fontSize: 13, fontFamily: "monospace" });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(containerRef.current);
        fitAddon.fit();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        term.onData((data) => window.mayor.write(data));
        window.mayor.onData((data) => term.write(data));
        window.mayor.attach();

        const observer = new ResizeObserver(() => {
            fitAddon.fit();
            window.mayor.resize(term.cols, term.rows);
        });
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            window.mayor.detach();
            term.dispose();
            termRef.current = null;
            fitAddonRef.current = null;
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
