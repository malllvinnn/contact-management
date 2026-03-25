import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../auth.store";
import { Spinner } from "@/components/ui/spinner";

export const AuthGuard = () => {

    const token = useAuthStore((state) => state.token);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const location = useLocation();

    if (!hasHydrated) {
        return (
            <div className="flex items-center gap-6">
                <Spinner className="size-8" />
            </div>
        )
    }

    if (!token) return <Navigate to="/auth/login" replace state={{ from: location }} />

    return <Outlet />
};
