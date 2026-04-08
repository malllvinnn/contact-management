import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import type { CreateContactPayload } from "./contact.schema"
import { contactService } from "./contact.service"
import { queryClient } from "@/lib/queryClient"
import { toast } from "sonner"
import { errorHookResponse } from "@/lib/utils"
import { useContactStore } from "./contact.store"
import type { SearchContactParams } from "./contact.types"

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

export const useSearchContacts = (params: SearchContactParams) => {

    return useQuery({
        queryKey: ["contacts", "search", params],
        queryFn: () => contactService.searchContacts(params),
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    })
}

export const useGetContact = (id: string) => {

    return useQuery({
        queryKey: ["contacts", id],
        queryFn: () => contactService.getContact(id),
        enabled: !!id,
    })
}