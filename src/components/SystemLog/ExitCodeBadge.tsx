import { Text } from "@chakra-ui/react";

export const ExitCodeBadge = ({ code }: { code: number | null }) => {
    if (code === null) return <Text fontSize="xs" color="fg.muted">running…</Text>;
    return (
        <Text
            fontSize="xs"
            fontFamily="mono"
            color={code === 0 ? "green.400" : "red.400"}
            fontWeight="semibold"
        >
            exit {code}
        </Text>
    );
};
