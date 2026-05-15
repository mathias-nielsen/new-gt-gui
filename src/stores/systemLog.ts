import { create } from "zustand";

export interface SystemLogEntry {
    command: string;
    output: string;
    exitCode: number;
}

interface StoreEntries extends SystemLogEntry {
    id: string;
}

interface SystemLogState {
    entries: StoreEntries[];
    append: (entry: SystemLogEntry) => void;
    clear: () => void;
}

export const useSystemLog = create<SystemLogState>((set) => ({
    entries: [],

    append: (entry: SystemLogEntry) =>
        set((state) => ({
            entries: [...state.entries, { id: crypto.randomUUID(), ...entry }],
        })),

    clear: () => set({ entries: [] }),
}));

export const systemLog = {
    append: (entry: SystemLogEntry) => useSystemLog.getState().append(entry),
};
