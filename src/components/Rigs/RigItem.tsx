import { Badge, Box, Card, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { Activity, ChevronRight, Settings } from "lucide-react";
import type { Rig, ServiceStatus } from "./types";

const statusColors: Record<Rig["status"], string> = {
    active: "green",
    idle: "orange",
    stopped: "gray",
};

const serviceColors: Record<ServiceStatus, string> = {
    running: "green",
    stopped: "gray",
};

interface RigItemProps {
    rig: Rig;
    onOpen?: (rig: Rig) => void;
    onSettings?: (rig: Rig) => void;
}

export function RigItem({ rig, onOpen, onSettings }: RigItemProps) {
    return (
        <Card.Root variant="outline" bg="bg" _hover={{ borderColor: "border.emphasized" }} transition="border-color 0.15s">
            <Card.Body p={5} gap={4}>
                <Flex justify="space-between" align="flex-start">
                    <HStack gap={2} flex={1} minW={0}>
                        <Text fontWeight="bold" fontSize="md" truncate>
                            {rig.name}
                        </Text>
                        <Badge colorPalette={statusColors[rig.status]} size="sm" flexShrink={0}>
                            {rig.status}
                        </Badge>
                    </HStack>
                    <HStack gap={1} flexShrink={0} ml={2}>
                        <Box
                            as="button"
                            p={1}
                            rounded="sm"
                            color="fg.muted"
                            _hover={{ color: "fg", bg: "bg.subtle" }}
                            onClick={() => onSettings?.(rig)}
                            aria-label="Rig settings"
                        >
                            <Icon as={Settings} boxSize={4} />
                        </Box>
                        <Box
                            as="button"
                            p={1}
                            rounded="sm"
                            color="fg.muted"
                            _hover={{ color: "fg", bg: "bg.subtle" }}
                            onClick={() => onOpen?.(rig)}
                            aria-label="Open rig"
                        >
                            <Icon as={ChevronRight} boxSize={4} />
                        </Box>
                    </HStack>
                </Flex>

                <HStack gap={2}>
                    <Badge colorPalette={serviceColors[rig.witness]} variant="subtle" size="sm">
                        witness {rig.witness}
                    </Badge>
                    <Badge colorPalette={serviceColors[rig.refinery]} variant="subtle" size="sm">
                        refinery {rig.refinery}
                    </Badge>
                    <Badge
                        variant="outline"
                        colorPalette="gray"
                        fontFamily="mono"
                        fontSize="xs"
                        px={2}
                        borderRadius="sm"
                    >
                        {rig.beadsPrefix}
                    </Badge>
                </HStack>

                <HStack gap={3}>
                    <HStack gap={1.5} color="fg.muted">
                        <Icon as={Activity} boxSize={3.5} />
                        <Text fontSize="sm">{rig.crew} crew</Text>
                    </HStack>
                    <HStack gap={1.5}>
                        <Badge
                            colorPalette={rig.polecats > 0 ? "blue" : "gray"}
                            variant="solid"
                            borderRadius="full"
                            minW={5}
                            textAlign="center"
                            fontSize="xs"
                        >
                            {rig.polecats}
                        </Badge>
                        <Text fontSize="sm" color="fg.muted">
                            polecats
                        </Text>
                    </HStack>
                </HStack>
            </Card.Body>
        </Card.Root>
    );
}
