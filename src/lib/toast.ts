import { toaster } from "../components/ui/toaster";

type ToastType = "info" | "success" | "warning" | "error";

export const toast = {
    show: (title: string, description?: string, type: ToastType = "info") =>
        toaster.create({ title, description, type, duration: 3000 }),

    success: (title: string, description?: string) =>
        toaster.create({ title, description, type: "success", duration: 3000 }),

    error: (title: string, description?: string) =>
        toaster.create({ title, description, type: "error", duration: 4000 }),

    warning: (title: string, description?: string) =>
        toaster.create({ title, description, type: "warning", duration: 3000 }),
};
