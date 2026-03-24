import { useMutation } from "@tanstack/react-query"
import { authService } from "./auth.service"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import axios from "axios"
import type { RegisterPayload } from "./auth.schema"

export const useRegister = () => {

    const navigate = useNavigate();

    return useMutation({

        mutationFn: (payload: RegisterPayload) => authService.register(payload),

        onSuccess: () => {

            toast.success("Registrasi berhasil! Silahkan login");

            navigate("/auth/login");
        },

        onError: (error) => {

            if (axios.isAxiosError(error)) {

                const responseData = error.response?.data;
                let errorMessage = responseData?.message || "Terjadi kesalahan pada server";

                if (responseData?.errors && responseData.errors.length > 0) {
                    errorMessage = "Data tidak valid, silakan periksa kembali isian Anda.";
                }

                toast.error(errorMessage);
            } else if (error instanceof Error) {

                toast.error(error.message);
            } else {

                toast.error("Terjadi kesalahan yang tidak diketahui");
            }
        }
    })
}