import { Button, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Folder, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGastownRunner } from "@/hooks/useGastownRunner";
import { useTowns } from "@/stores/towns";
import { toast } from "@/lib/toast";
import { IconLabel } from "@/components/atoms/IconLabel";

export const InitializeTown = () => {
    const [dir, setDir] = useState("/Users/mnin/code/dtu/new-gastown-hq");
    const add = useTowns((s) => s.add);
    const navigate = useNavigate();

    const runner = useGastownRunner((entry) => {
        if (entry.exitCode !== 0) {
            toast.error("Failed", entry.output);
        } else {
            add(dir);
            toast.success("New Gastown HQ created. \n Redirecting ...");
            navigate("/town", { state: { townPath: dir } });
        }
    });

    const handleInit = () => {
        runner.run(["install", dir, "--git"]);
    };

    return (
        <Stack gap={2}>
            <IconLabel icon={<Folder size={16} />} fontWeight="semibold">
                Town Directory
            </IconLabel>

            <Input
                placeholder="/path/to/your/town"
                value={dir}
                onChange={(e) => setDir(e.target.value)}
            />

            <Text fontSize="sm" color="fg.muted">
                Select the directory where you want to create your Gastown workspace
            </Text>

            <Button
                colorPalette="blue"
                size="lg"
                onClick={handleInit}
                disabled={runner.status === "running"}
            >
                {runner.status === "running" ? <Spinner size="sm" /> : <Play size={18} />}
                Initialize Town
            </Button>
        </Stack>
    );
};
