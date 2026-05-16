import { Box, Flex, Stack } from "@chakra-ui/react";
import { Construction, Crown } from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavItem } from "../components/Towns";
import { useGastownRunner } from "../hooks/useGastownRunner";
import { toast } from "../lib/toast";
import { useWorkspace } from "../stores/workspaceStore";

const NAV_ITEMS = [
    { to: "mayor", label: "Mayor", icon: Crown },
    { to: "rigs", label: "Rigs", icon: Construction },
];

export default function TownPage() {
    const { setUpStatus } = useWorkspace();

    const runner = useGastownRunner((entry) => {
        if (entry.exitCode === 0) {
            setUpStatus("ready");
            toast.success("Workspace ready");
        } else {
            setUpStatus("failed");
        }
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

            <Box flex="1" minH={0} px={8} py={10} overflow="hidden">
                <Outlet />
            </Box>
        </Flex>
    );
}
