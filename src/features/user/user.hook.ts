import { useMutation, useQuery } from "@tanstack/react-query"
import { userService } from "./user.service"
import { toast } from "sonner"
import { errorHookResponse } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/auth.store"
import type { UpdateUserPayload } from "./user.schema"
import { queryClient } from "@/lib/queryClient"


export const useGetUser = () => {

    return useQuery({

        queryKey: ["user"],
        queryFn: () => userService.getUser(),
    })
}

export const useUpdateUser = () => {

    const updateUser = useAuthStore((state) => state.updateUser);

    return useMutation({

        mutationFn: (payload: UpdateUserPayload) => userService.updateUser(payload),

        onSuccess: (response) => {

            queryClient.invalidateQueries({ queryKey: ["user"] });

            toast.success(response.message || "User updated successfully");

            if (response.data) updateUser(response.data);
        },

        onError: (error) => {
            errorHookResponse(error);
        }
    })
}