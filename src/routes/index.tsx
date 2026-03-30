import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { createBrowserRouter, Navigate } from "react-router";

import RegisterPage from "@/pages/RegisterPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import { AuthGuard } from "@/features/auth/guards/AuthGuard";
import { GuestGuard } from "@/features/auth/guards/GuestGuard";
import ProfilePage from "@/pages/ProfilePage";

export const router = createBrowserRouter([
    {
        Component: GuestGuard,
        children: [
            {
                path: "auth",
                Component: AuthLayout,
                children: [
                    {
                        path: "register",
                        Component: RegisterPage,
                    },
                    {
                        path: "login",
                        Component: LoginPage
                    }
                ]
            }
        ]
    },
    {
        Component: AuthGuard,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" replace />,
            },
            {
                Component: MainLayout,
                children: [
                    {
                        path: "dashboard",
                        Component: ContactPage,
                    },
                    {
                        path: "profile",
                        Component: ProfilePage,
                    },
                ],
            },
        ],
    },
])