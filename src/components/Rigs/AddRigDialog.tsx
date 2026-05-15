import { Button, Dialog, Input, Portal, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useGastownRunner } from "@/hooks/useGastownRunner";

interface AddRigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddRigDialog({ open, onOpenChange }: AddRigDialogProps) {
    const [rigName, setRigName] = useState("");
    const [repoLink, setRepoLink] = useState("");

    const runner = useGastownRunner((entry) => {
        if (entry.exitCode === 0) {
            onOpenChange(false);
            setRigName("");
            setRepoLink("");
        }
    });

    const canSubmit = rigName.trim() && repoLink.trim();
    const isRunning = runner.status === "running";
    const hasError =
        (runner.status === "exited" && runner.exitCode !== 0) || runner.status === "error";

    const handleAdd = () => {
        if (!canSubmit) return;
        runner.run(["rig", "add", rigName.trim(), repoLink.trim()]);
    };

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => onOpenChange(open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>New Rig</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap={3}>
                                <Input
                                    placeholder="Rig name"
                                    value={rigName}
                                    onChange={(e) => setRigName(e.target.value)}
                                    disabled={isRunning}
                                    autoFocus
                                />
                                <Input
                                    placeholder="GitHub repo link"
                                    value={repoLink}
                                    onChange={(e) => setRepoLink(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                    disabled={isRunning}
                                />
                                {hasError && (
                                    <Text fontSize="sm" color="red.500" fontFamily="mono" whiteSpace="pre-wrap">
                                        {runner.output.trim()}
                                    </Text>
                                )}
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={isRunning}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="blue"
                                onClick={handleAdd}
                                disabled={!canSubmit || isRunning}
                            >
                                {isRunning ? <Spinner size="sm" /> : "Add"}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
