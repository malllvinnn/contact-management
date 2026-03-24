import { Outlet } from "react-router";

export const AuthLayout = () => {
    return (
        <>
            <main className="border-2">
                <Outlet />
            </main>
            <footer>
                <span>
                    &copy; {new Date().getFullYear()} Muhammad Malfin. All rights reserved.
                </span>
            </footer>
        </>
    );
};
