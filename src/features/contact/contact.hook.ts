import { useMutation } from "@tanstack/react-query"
import type { CreateContactPayload } from "./contact.schema"
import { contactService } from "./contact.service"
import { queryClient } from "@/lib/queryClient"
import { toast } from "sonner"
import { errorHookResponse } from "@/lib/utils"
import { useContactStore } from "./contact.store"

export const useCreateContact = () => {

    const { closeCreateModal } = useContactStore();

    return useMutation({

        mutationFn: (payload: CreateContactPayload) => contactService.createContact(payload),

        onSuccess: (response) => {

            closeCreateModal();

            queryClient.invalidateQueries({ queryKey: ["contacts"] });

            toast.success(response.message || "Contact created successfully");
        },

        onError: (error) => {
            errorHookResponse(error);
        }
    })
}