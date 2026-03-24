import { Outlet } from "react-router";

export const AuthLayout = () => {
    return (
        <>
            <h1>AuthLayout</h1>
            <main>
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
