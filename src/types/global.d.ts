import type { GtAPI } from "../../shared/gt-api";
import type { StorageAPI } from "../../shared/storage-api";
import type { MayorAPI } from "../../shared/mayor-api";

declare global {
    interface Window {
        gt: GtAPI;
        storage: StorageAPI;
        mayor: MayorAPI;
    }
}
