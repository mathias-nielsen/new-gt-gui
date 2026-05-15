import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./atoms/Logo";
import { SystemLog } from "./SystemLog";
import { GastownREPL } from "./GastownREPL";

export function TopNavigation() {
    const [replOpen, setReplOpen] = useState(false);
    const navigate = useNavigate();
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLogoClick = () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => navigate("/"), 200);
    };

    const handleLogoDoubleClick = () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        setReplOpen(true);
    };

    return (
        <>
            <Flex
                as="header"
                align="center"
                justify="space-between"
                px={{ base: 3, md: 4 }}
                py={3}
                borderBottomWidth="1px"
                borderColor="border"
                bg="bg.panel"
            >
                <HStack gap={2}>
                    <Box
                        onClick={handleLogoClick}
                        onDoubleClick={handleLogoDoubleClick}
                        cursor="pointer"
                    >
                        <Logo size={8} />
                    </Box>
                    <Heading size="md" cursor="pointer" onClick={() => navigate("/")}>
                        Gastown
                    </Heading>
                </HStack>
                <HStack gap={2}>
                    <SystemLog />
                </HStack>
            </Flex>

            <GastownREPL open={replOpen} onClose={() => setReplOpen(false)} />
        </>
    );
}
