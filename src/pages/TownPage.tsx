import { Box, Flex, Stack } from "@chakra-ui/react";
import { Construction, Crown } from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavItem } from "../components/Towns";
import { useGastownRunner } from "../hooks/useGastownRunner";
import { toast } from "../lib/toast";

const NAV_ITEMS = [
    { to: "mayor", label: "Mayor", icon: Crown },
    { to: "rigs", label: "Rigs", icon: Construction },
];

export default function TownPage() {
    const runner = useGastownRunner((entry) => {
        if (entry.exitCode === 0) toast.success("Workspace ready");
    });

    useEffect(() => {
        runner.run(["up"]);
    }, []);

    return (
        <Flex flex="1" bg="bg" overflow="hidden">
            <Stack
                gap={1}
                w="48"
                flexShrink={0}
                bg="bg.panel"
                borderRightWidth="1px"
                borderColor="border"
                px={3}
                py={6}
            >
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
                ))}
            </Stack>

            <Box flex="1" px={8} py={10} overflow="auto">
                <Outlet />
            </Box>
        </Flex>
    );
}
