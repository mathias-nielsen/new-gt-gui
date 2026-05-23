const GT = {
    RUN: "gt:run",
    KILL: "gt:kill",
    SET_CURRENT_WORKING_DIRECTORY: "gt:setCwd",
    STD_OUT: "gt:stdout",
    STD_ERROR: "gt:stderr",
    EXIT: "gt:exit",
};

const MAYOR = {
    ATTACH: "mayor:attach",
    DETACH: "mayor:detach",
    WRITE: "mayor:write",
    RESIZE: "mayor:resize",
    DATA: "mayor:data",
};

const STORAGE = {
    GET: "storage:get",
    SET: "storage:set",
};

export const CHANNELS = {
    GT,
    STORAGE,
    MAYOR,
};
