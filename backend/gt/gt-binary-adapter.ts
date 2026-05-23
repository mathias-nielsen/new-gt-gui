import { app } from "electron";
import path from "path";

/**
 * Shared base for any integration that drives the bundled `gt` binary.
 * Responsibility: binary resolution, the workspace cwd, and the dolt PATH injection
 * (dolt is a nested dependency of beads, used by gt).
 */
export abstract class GtBinaryAdapter {
    private static workspaceCwd: string | undefined;

    protected readonly binaryPath: string;
    protected readonly doltBinDir: string;

    protected constructor() {
        const binaryName = process.platform === "win32" ? "gt.exe" : "gt";
        const relative = path.join("node_modules", "@gastown", "gt", "bin", binaryName);
        if (app.isPackaged) {
            this.binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", relative);
            this.doltBinDir = path.join(process.resourcesPath, "app.asar.unpacked", "bin", "dolt");
        } else {
            this.binaryPath = path.join(app.getAppPath(), relative);
            this.doltBinDir = path.join(app.getAppPath(), "bin", "dolt");
        }
    }

    /**
     * Set: Workspace Current Working Directory
     * Shared across all gt-driven integrations.
     */
    setCwd(cwd: string): void {
        GtBinaryAdapter.workspaceCwd = cwd;
    }

    /**
     * Get: Workspace Current Working Directory
     */
    getCwd(): string | undefined {
        return GtBinaryAdapter.workspaceCwd;
    }

    /**
     * Environment for spawning gt — prepends the bundled dolt bin dir to PATH.
     */
    protected buildEnv(): NodeJS.ProcessEnv {
        const sep = process.platform === "win32" ? ";" : ":";
        return { ...process.env, PATH: `${this.doltBinDir}${sep}${process.env.PATH}` };
    }
}
