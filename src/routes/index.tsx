import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { createBrowserRouter } from "react-router";

import RegisterPage from "@/pages/RegisterPage";
import ContactPage from "@/pages/ContactPage";

export const router = createBrowserRouter([
    {
        path: "auth",
        Component: AuthLayout,
        children: [
            {
                path: "register",
                Component: RegisterPage,
            },
        ],
    },
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: ContactPage,
            },
        ],
    },
])