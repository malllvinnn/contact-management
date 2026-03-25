import { api } from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "./auth.schema";
import type { ApiResponse } from "@/types/api";
import type { LoginResponseData, User } from "./auth.types";

export const authService = {

    register: async (payload: RegisterPayload): Promise<ApiResponse<User>> => {

        const response = await api.post("/api/users", payload);

        return response.data;
    },

    login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {

        const response = await api.post("/api/users/login", payload);

        return response.data;
    }
} 