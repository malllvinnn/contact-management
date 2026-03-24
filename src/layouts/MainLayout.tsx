import { Outlet } from "react-router";

export const MainLayout = () => {
    return (
        <>
            <h1>MainLayout</h1>
            <main>
                <Outlet />
            </main>
        </>
    );
};
