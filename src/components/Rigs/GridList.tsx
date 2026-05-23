import { Grid, Stack, Text } from "@chakra-ui/react";
import type { Rig } from "./types";
import { RigItem } from "./RigItem";

interface GridListProps {
    rigs: Rig[];
    onOpen?: (rig: Rig) => void;
    onSettings?: (rig: Rig) => void;
}

export function GridList({ rigs, onOpen, onSettings }: GridListProps) {
    if (rigs.length === 0) {
        return (
            <Stack align="center" justify="center" py={16} gap={2} color="fg.muted">
                <Text fontWeight="medium">No rigs yet</Text>
                <Text fontSize="sm">Create a new rig to get started</Text>
            </Stack>
        );
    }

    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {rigs.map((rig) => (
                <RigItem key={rig.name} rig={rig} onOpen={onOpen} onSettings={onSettings} />
            ))}
        </Grid>
    );
}
