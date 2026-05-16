import { create } from "zustand";

type UpStatus = "pending" | "ready" | "failed";

interface WorkspaceState {
    upStatus: UpStatus;
    setUpStatus: (status: UpStatus) => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
    upStatus: "pending",
    setUpStatus: (status) => set({ upStatus: status }),
}));
