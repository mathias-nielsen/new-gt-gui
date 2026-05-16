export interface MayorAPI {
    attach: () => Promise<void>;
    detach: () => Promise<void>;
    write: (data: string) => void;
    resize: (cols: number, rows: number) => void;
    onData: (callback: (data: string) => void) => () => void;
}
