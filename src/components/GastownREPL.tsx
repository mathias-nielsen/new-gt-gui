import { Box, Button, Dialog, HStack, Input, Portal, Stack, Text } from "@chakra-ui/react";
import { Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGastownRunner } from "@/hooks/useGastownRunner";

interface GastownREPLProps {
    open: boolean;
    onClose: () => void;
}

const CHUNK_COLOR: Record<string, string> = {
    err: "red.400",
    meta: "fg.muted",
};

export const GastownREPL = ({ open, onClose }: GastownREPLProps) => {
    const [input, setInput] = useState("");
    const { chunks, run, kill, status } = useGastownRunner();
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [chunks]);

    const handleRun = () => {
        const args = input.trim().split(/\s+/).filter(Boolean);
        if (args.length === 0) return;
        run(args);
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(d) => {
                if (!d.open) onClose();
            }}
            size="cover"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title fontFamily="mono">Gastown REPL</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb={6}>
                            <Stack gap={3}>
                                <HStack>
                                    <Text fontFamily="mono" color="fg.muted" flexShrink={0}>
                                        gt
                                    </Text>
                                    <Input
                                        fontFamily="mono"
                                        placeholder="--help"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleRun()}
                                        disabled={status === "running"}
                                        autoFocus
                                    />
                                    {status === "running" ? (
                                        <Button colorPalette="red" flexShrink={0} onClick={kill}>
                                            <Square size={14} />
                                            Kill
                                        </Button>
                                    ) : (
                                        <Button
                                            colorPalette="green"
                                            flexShrink={0}
                                            onClick={handleRun}
                                            disabled={!input.trim()}
                                        >
                                            <Play size={14} />
                                            Run
                                        </Button>
                                    )}
                                </HStack>

                                <Box
                                    ref={outputRef}
                                    as="pre"
                                    fontFamily="mono"
                                    fontSize="xs"
                                    bg="bg.subtle"
                                    p={3}
                                    borderRadius="md"
                                    h="680px"
                                    overflowY="auto"
                                    whiteSpace="pre-wrap"
                                    wordBreak="break-all"
                                >
                                    {chunks.length === 0 ? (
                                        <Text as="span" color="fg.subtle">
                                            No output yet — run a command above.
                                        </Text>
                                    ) : (
                                        chunks.map((chunk, i) => (
                                            <Text
                                                as="span"
                                                key={i}
                                                color={CHUNK_COLOR[chunk.cls ?? ""] ?? "fg"}
                                            >
                                                {chunk.text}
                                            </Text>
                                        ))
                                    )}
                                </Box>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
