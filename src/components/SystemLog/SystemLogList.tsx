import { Stack, Text } from "@chakra-ui/react";
import { type SystemLogEntry } from "../../stores/systemLog";
import { SystemLogEntryRow } from "./SystemLogEntryRow";

export const SystemLogList = ({ entries }: { entries: SystemLogEntry[] }) => {
    if (entries.length === 0) {
        return <Text color="fg.muted">No entries yet.</Text>;
    }
    return (
        <Stack gap={0}>
            {entries.map((entry) => (
                <SystemLogEntryRow key={entry.id} entry={entry} />
            ))}
        </Stack>
    );
};
