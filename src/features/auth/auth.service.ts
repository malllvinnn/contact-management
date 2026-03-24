import { api } from "@/lib/api";
import type { RegisterPayload } from "./auth.schema";

export const authService = {

    register: async (payload: RegisterPayload) => {

        const response = await api.post("/api/users", payload);

        return response.data;
    }
} 