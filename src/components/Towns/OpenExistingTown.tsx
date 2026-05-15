import { NativeSelect } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTowns } from "@/stores/towns";

export const OpenExistingTown = () => {
    const towns = useTowns((s) => s.towns);
    const activate = useTowns((s) => s.activate);
    const navigate = useNavigate();

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const town = towns.find((t) => t.path === e.target.value);
        if (!town) return;
        activate(town.path);
        navigate("/town", { state: { townPath: town.path } });
    };

    return (
        <NativeSelect.Root size="lg" disabled={towns.length === 0}>
            <NativeSelect.Field onChange={handleSelect} defaultValue="">
                <option value="" disabled>
                    {towns.length === 0 ? "No towns yet" : "Open an existing town"}
                </option>
                {towns.map((t) => (
                    <option key={t.path} value={t.path}>
                        {t.path}
                    </option>
                ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
        </NativeSelect.Root>
    );
};
