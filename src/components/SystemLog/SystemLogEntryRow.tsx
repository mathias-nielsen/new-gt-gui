import { Box, Button, Code, HStack } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { type SystemLogEntry } from "../../stores/systemLog";
import { ExitCodeBadge } from "./ExitCodeBadge";

export const SystemLogEntryRow = ({ entry }: { entry: SystemLogEntry }) => {
    const [expanded, setExpanded] = useState(false);
    const lineCount = entry.output.split("\n").filter(Boolean).length;

    return (
        <Box borderBottom="1px solid" borderColor="border.subtle" py={3}>
            <HStack justify="space-between" mb={1}>
                <Code background="none" px={0} fontWeight="semibold" fontSize="sm">
                    $ {entry.command}
                </Code>
                <ExitCodeBadge code={entry.exitCode} />
            </HStack>
            <Button
                size="xs"
                variant="ghost"
                px={0}
                color="fg.muted"
                onClick={() => setExpanded((v) => !v)}
            >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? "Hide output" : `Show output (${lineCount} line${lineCount !== 1 ? "s" : ""})`}
            </Button>
            {expanded && (
                <Box
                    as="pre"
                    mt={2}
                    p={3}
                    bg="bg.subtle"
                    borderRadius="md"
                    fontSize="xs"
                    fontFamily="mono"
                    overflowX="auto"
                    whiteSpace="pre-wrap"
                    wordBreak="break-all"
                >
                    {entry.output}
                </Box>
            )}
        </Box>
    );
};
