import { Box, HStack, Icon } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

interface NavItemProps {
    to: string;
    label: string;
    icon?: LucideIcon;
}

export function NavItem({ to, label, icon }: NavItemProps) {
    const resolved = useResolvedPath(to);
    const isActive = Boolean(useMatch({ path: resolved.pathname, end: false }));

    return (
        <Link to={to} style={{ textDecoration: "none" }}>
            <HStack
                px={3}
                py={1.5}
                gap={2}
                rounded="md"
                fontSize="sm"
                fontWeight={isActive ? "semibold" : "normal"}
                color={isActive ? "fg" : "fg.muted"}
                bg={isActive ? "bg.emphasized" : "transparent"}
                _hover={{ bg: isActive ? "bg.emphasized" : "bg.muted", color: "fg" }}
                transition="background 0.1s"
            >
                {icon && <Icon as={icon} boxSize={3.5} />}
                <Box>{label}</Box>
            </HStack>
        </Link>
    );
}
