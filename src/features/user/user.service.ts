import type { ApiResponse } from "@/types/api";
import type { User } from "./user.types";
import { api } from "@/lib/api";
import type { UpdateUserPayload } from "./user.schema";

export const userService = {

    getUser: async (): Promise<ApiResponse<User>> => {

        const response = await api.get("/api/users/current");

        return response.data;
    },

    updateUser: async (payload: UpdateUserPayload): Promise<ApiResponse<User>> => {

        const response = await api.patch("/api/users/current", payload);

        return response.data;
    }
}