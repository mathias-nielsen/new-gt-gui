import { Box, Button, Flex, HStack, Heading, Stack } from "@chakra-ui/react";
import { PlugZap, Unplug } from "lucide-react";
import { useMemo } from "react";

import { InfoIcon } from "../../components/atoms/InfoIcon";
import { TerminalPane } from "../../components/Mayor/TerminalPane";
import { Tooltip } from "../../components/ui/tooltip";
import { useWorkspace } from "../../stores/workspaceStore";
import { Terminal } from "@xterm/xterm";
import { useMayor } from "@/stores/mayorStore";

const MAYOR_DESCRIPTION =
    "Your primary AI coordinator. The Mayor is a Claude Code instance with full context about your workspace, projects, and agents. Start here - just tell the Mayor what you want to accomplish.";

export default function TownMayorPage() {
    const { upStatus } = useWorkspace();
    const canAttach = upStatus === "ready";
    const { attach, attached, detach } = useMayor();

    const terminal = useMemo(() => new Terminal({ fontSize: 13, fontFamily: "monospace" }), []);

    return (
        <Stack gap={4} h="100%" overflow="hidden">
            <Flex justify="space-between" align="baseline" flexShrink={0}>
                <HStack gap={2} align="baseline">
                    <Heading size="2xl">Mayor</Heading>
                    <InfoIcon text={MAYOR_DESCRIPTION} />
                </HStack>
                <Tooltip content="Waiting for workspace to be ready…" disabled={!canAttach}>
                    {attached ? (
                        <Button colorPalette={"red"} variant={"outline"} onClick={detach}>
                            <Unplug /> Detach
                        </Button>
                    ) : (
                        <Button
                            colorPalette={"blue"}
                            variant={"solid"}
                            onClick={() => attach(terminal)}
                            disabled={!canAttach}
                        >
                            <PlugZap /> {attached ? "Detach" : "Attach"}
                        </Button>
                    )}
                </Tooltip>
            </Flex>
            <Box
                flex="1"
                minH={0}
                borderRadius="md"
                overflow="hidden"
                borderWidth="1px"
                borderColor="border"
            >
                <TerminalPane terminal={terminal} />
            </Box>
        </Stack>
    );
}
