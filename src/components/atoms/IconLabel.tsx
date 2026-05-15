import { HStack, Text, type TextProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type IconLabelProps = {
    icon: ReactNode;
    children: ReactNode;
    gap?: number;
    fontWeight?: TextProps["fontWeight"];
    fontSize?: TextProps["fontSize"];
};

export const IconLabel = ({
    icon,
    children,
    gap = 2,
    fontWeight,
    fontSize,
}: IconLabelProps) => (
    <HStack gap={gap}>
        {icon}
        <Text fontWeight={fontWeight} fontSize={fontSize}>
            {children}
        </Text>
    </HStack>
);
