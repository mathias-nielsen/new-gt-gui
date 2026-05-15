import { Card, Flex, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { Logo } from "@/components/atoms/Logo";
import { InitializeTown, OpenExistingTown } from "@/components/Towns";

export default function LandingPage() {
    return (
        <Flex flex="1" align="center" justify="center" bg="bg" px={4} py={10}>
            <Stack gap={6} align="center" w="full" maxW="lg">
                <Card.Root w="full" shadow="md">
                    <Card.Body>
                        <Stack gap={6}>
                            <Stack gap={3} align="center" textAlign="center">
                                <Logo size={14} />
                                <Heading size="2xl">Welcome to Gastown</Heading>
                                <Text color="fg.muted">Agent orchestration platform</Text>
                            </Stack>

                            <InitializeTown />

                            <Separator />

                            <OpenExistingTown />
                        </Stack>
                    </Card.Body>
                </Card.Root>

                <Text fontSize="xs" color="fg.muted">
                    Gastown v1.0.0 · Agent Orchestration Platform
                </Text>
            </Stack>
        </Flex>
    );
}
