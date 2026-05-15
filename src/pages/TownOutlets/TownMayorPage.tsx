import { Box, HStack, Heading, Stack } from "@chakra-ui/react";
import { InfoIcon } from "../../components/atoms/InfoIcon";
import { TerminalPane } from "../../components/Mayor/TerminalPane";

const MAYOR_DESCRIPTION =
    "Your primary AI coordinator. The Mayor is a Claude Code instance with full context about your workspace, projects, and agents. Start here - just tell the Mayor what you want to accomplish.";

export default function TownMayorPage() {
    return (
        <Stack gap={4} h="100%" overflow="hidden">
            <HStack gap={2} align="baseline" flexShrink={0}>
                <Heading size="2xl">Mayor</Heading>
                <InfoIcon text={MAYOR_DESCRIPTION} />
            </HStack>
            <Box flex="1" borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="border">
                <TerminalPane />
            </Box>
        </Stack>
    );
}
