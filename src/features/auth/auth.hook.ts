import { useMutation } from "@tanstack/react-query"
import { authService } from "./auth.service"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import type { LoginPayload, RegisterPayload } from "./auth.schema"
import { useAuthStore } from "./auth.store"
import { errorHookResponse } from "@/lib/utils"

export const useRegister = () => {

    const navigate = useNavigate();

    return useMutation({

        mutationFn: (payload: RegisterPayload) => authService.register(payload),

        onSuccess: () => {

            toast.success("Registrasi berhasil! Silahkan login");

            navigate("/auth/login");
        },

        onError: (error) => {

            errorHookResponse(error);
        }
    })
}

export const useLogin = () => {

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({

        mutationFn: (payload: LoginPayload) => authService.login(payload),

        onSuccess: (response) => {

            const { token, username, name } = response.data;

            setAuth(token, { username, name });
            navigate("/")
        },

        onError: (error) => {

            errorHookResponse(error);
        },
    })
}