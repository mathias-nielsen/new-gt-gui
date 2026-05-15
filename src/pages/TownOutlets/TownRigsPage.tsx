import { Button, Flex, HStack, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddRigDialog, GridList, type Rig, parseRigList } from "../../components/Rigs";
import { InfoIcon } from "../../components/atoms/InfoIcon";
import { useGastownRunner } from "../../hooks/useGastownRunner";

export default function TownRigsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rigs, setRigs] = useState<Rig[]>([]);

    const runner = useGastownRunner((entry) => {
        if (entry.exitCode !== 0) return;
        try {
            setRigs(parseRigList(entry.output.trim()));
        } catch {
            setRigs([]);
        }
    });

    useEffect(() => {
        runner.run(["rig", "list", "--json"]);
    }, []);

    const isLoading = runner.status === "idle" || runner.status === "running";

    return (
        <Stack gap={8} maxW="1200px">
            <Stack gap={1}>
                <Flex justify="space-between" align="baseline">
                    <HStack gap={2} align="baseline">
                        <Heading size="2xl">Your Rigs</Heading>
                        <InfoIcon text="Project containers. Each rig wraps a git repository and manages its associated agents." />
                    </HStack>
                    <Button colorPalette="blue" onClick={() => setDialogOpen(true)}>
                        <Plus /> New Rig
                    </Button>
                </Flex>
                <Text color="fg.muted">Select a project container to view agents and tasks</Text>
            </Stack>

            {isLoading ? (
                <Flex justify="center" py={16}>
                    <Spinner size="lg" color="fg.muted" />
                </Flex>
            ) : (
                <GridList rigs={rigs} />
            )}

            <AddRigDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </Stack>
    );
}
