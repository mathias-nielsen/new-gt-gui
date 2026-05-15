import { Button, CloseButton, Drawer, HStack, Portal } from "@chakra-ui/react";
import { ScrollText } from "lucide-react";
import { useRef, useEffect } from "react";
import { useSystemLog } from "../../stores/systemLog";
import { IconLabel } from "../atoms/IconLabel";
import { SystemLogList } from "./SystemLogList";

export const SystemLog = () => {
    const entries = useSystemLog((s) => s.entries);
    const clear = useSystemLog((s) => s.clear);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [entries]);

    return (
        <Drawer.Root placement="end" size="full">
            <Drawer.Trigger asChild>
                <Button variant="ghost" size="sm">
                    <IconLabel icon={<ScrollText size={18} />}>System Log</IconLabel>
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <HStack justify="space-between" w="full">
                                <Drawer.Title>System Log</Drawer.Title>
                                <Button size="xs" variant="ghost" onClick={clear} mr={8}>
                                    Clear
                                </Button>
                            </HStack>
                        </Drawer.Header>
                        <Drawer.Body overflowY="auto">
                            <SystemLogList entries={entries} />
                            <div ref={bottomRef} />
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
