export type RigStatus = "active" | "idle" | "stopped";
export type ServiceStatus = "running" | "stopped";

export interface Rig {
    name: string;
    beadsPrefix: string;
    status: RigStatus;
    witness: ServiceStatus;
    refinery: ServiceStatus;
    crew: number;
    polecats: number;
}

interface GtRigListItem {
    name: string;
    beads_prefix: string;
    status: string;
    witness: ServiceStatus;
    refinery: ServiceStatus;
    crew: number;
    polecats: number;
}

const STATUS_MAP: Record<string, RigStatus> = {
    operational: "active",
    stopped: "stopped",
};

export const parseRigList = (stdout: string): Rig[] => {
    const raw: GtRigListItem[] = JSON.parse(stdout);
    return raw.map((item) => ({
        name: item.name,
        beadsPrefix: item.beads_prefix,
        status: STATUS_MAP[item.status] ?? "idle",
        witness: item.witness,
        refinery: item.refinery,
        crew: item.crew,
        polecats: item.polecats,
    }));
};
