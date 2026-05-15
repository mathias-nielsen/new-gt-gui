import { Icon } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

interface InfoIconProps {
    text: string;
}

export function InfoIcon({ text }: InfoIconProps) {
    return (
        <Tooltip content={text} showArrow>
            <Icon as={Info} boxSize={4} color="fg.muted" cursor="default" />
        </Tooltip>
    );
}
