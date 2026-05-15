import { create } from "zustand";

export interface Town {
    path: string;
    initializedAt: string;
}

const STORE_KEY = "towns";

interface TownsState {
    towns: Town[];
    load: () => Promise<void>;
    add: (path: string) => Promise<void>;
    activate: (path: string) => void;
    remove: (path: string) => Promise<void>;
}

export const useTowns = create<TownsState>((set, get) => {
    setTimeout(() => get().load(), 0);

    return {
        towns: [],

        load: async () => {
            const saved = await window.storage.get<Town[]>(STORE_KEY);
            set({ towns: saved ?? [] });
        },

        add: async (path) => {
            const next = [
                ...get().towns.filter((t) => t.path !== path),
                { path, initializedAt: new Date().toISOString() },
            ];
            set({ towns: next });
            await window.storage.set(STORE_KEY, next);
            get().activate(path);
        },

        activate: (path) => {
            window.gt.setCwd(path);
        },

        remove: async (path) => {
            const next = get().towns.filter((t) => t.path !== path);
            set({ towns: next });
            await window.storage.set(STORE_KEY, next);
        },
    };
});
