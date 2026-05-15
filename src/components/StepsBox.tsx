import { Box, Card, HStack, Stack, Text } from "@chakra-ui/react";
import { Terminal } from "lucide-react";

export interface Step {
    command: string;
    description: string;
}

type Props = {
    steps: Step[];
};

export const StepsBox = ({ steps }: Props) => {
    return (
        <Card.Root variant="subtle">
            <Card.Body>
                <Stack gap={3}>
                    <HStack gap={2}>
                        <Terminal size={16} />
                        <Text fontWeight="semibold">Initialization Steps</Text>
                    </HStack>
                    <Stack gap={3} as="ol">
                        {steps.map((step, i) => (
                            <HStack key={step.command} align="flex-start" gap={3}>
                                <Text color="fg.muted" fontFamily="mono">
                                    {i + 1}.
                                </Text>
                                <Stack gap={1}>
                                    <Box
                                        as="code"
                                        bg="bg.muted"
                                        color="blue.600"
                                        px={2}
                                        py={0.5}
                                        rounded="sm"
                                        fontFamily="mono"
                                        fontSize="sm"
                                        w="fit-content"
                                    >
                                        {step.command}
                                    </Box>
                                    <Text fontSize="sm" color="fg.muted">
                                        {step.description}
                                    </Text>
                                </Stack>
                            </HStack>
                        ))}
                    </Stack>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};
