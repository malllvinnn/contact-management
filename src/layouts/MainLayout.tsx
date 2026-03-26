import { ButtonField } from "@/components/form/ButtonField";
import { useLogout } from "@/features/auth/auth.hook";
import { Outlet } from "react-router";

export const MainLayout = () => {

    const { mutate, isPending } = useLogout()

    return (
        <>
            <h1>MainLayout</h1>
            <ButtonField
                orientation="horizontal"
                isPending={isPending}
                label="Logout"
                onClick={() => mutate()}
                className="cursor-pointer"
            />
            <main>
                <Outlet />
            </main>
        </>
    );
};
