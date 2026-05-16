import { Terminal } from "@xterm/xterm";
import { create } from "zustand";

type CleanupFunction = () => void;

export interface MayorState {
    attached: boolean;
    attach: (terminal: Terminal) => void;
    detach: () => void;
    cleanup: () => void;
}

export const useMayor = create<MayorState>((set, get) => {
    let cleanup: CleanupFunction = () => {};

    const attach = async (terminal: Terminal) => {
        console.log("Store: Attaching");
        set({ attached: true });
        await window.mayor.attach();
        // Sync PTY dimensions to xterm's actual fitted size.
        // PTY spawns at 80x24; without this the cursor position drifts.
        window.mayor.resize(terminal.cols, terminal.rows);

        const disposable = terminal.onData((data: string) => {
            console.log("Data from User", data);
            window.mayor.write(data);
        });

        const mayorCleanup = window.mayor.onData((data: string) => {
            console.log("Data from Mayor IPC", data);
            terminal.write(data);
        });

        cleanup = () => {
            mayorCleanup();
            disposable.dispose();
        };
    };

    const detach = async () => {
        set({ attached: false });
        await window.mayor.detach();
        get().cleanup();
    };

    return {
        attached: false,
        attach,
        detach,
        cleanup,
    };
});
