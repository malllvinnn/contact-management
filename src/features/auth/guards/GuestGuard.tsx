import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../auth.store";
import { Spinner } from "@/components/ui/spinner";

export const GuestGuard = () => {

    const token = useAuthStore((state) => state.token);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);

    if (!hasHydrated) {
        return (
            <div className="flex items-center gap-6">
                <Spinner className="size-8" />
            </div>
        )
    }

    if (token) return <Navigate to="/" replace />

    return <Outlet />
};
