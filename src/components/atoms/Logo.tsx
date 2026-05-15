import { Flex } from "@chakra-ui/react";
import { Castle } from "lucide-react";

type LogoProps = {
    size?: number;
};

export function Logo({ size = 8 }: LogoProps) {
    return (
        <Flex
            boxSize={size}
            rounded="md"
            bg="orange.500"
            align="center"
            justify="center"
        >
            <Castle size={size * 2.25} color="black" />
        </Flex>
    );
}
