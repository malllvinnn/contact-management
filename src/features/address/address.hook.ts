import { useMutation, useQuery } from "@tanstack/react-query";
import { addressService } from "./address.service";
import type { CreateAddressPayload } from "./address.schema";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { errorHookResponse } from "@/lib/utils";
import { useAddressStore } from "./address.store";

export const useListAddresses = (contactId: string) => {

    return useQuery({
        queryKey: ["contacts", contactId, "addresses"],
        queryFn: () => addressService.listAddresses(contactId),
        enabled: !!contactId,
    });
};

export const useCreateAddress = (contactId: string) => {

    const { closeCreateModal } = useAddressStore();

    return useMutation({

        mutationFn: (payload: CreateAddressPayload) => addressService.createAddress(contactId, payload),

        onSuccess: (response) => {
            closeCreateModal();
            toast.success(response.message || "Address created successfully");
            queryClient.invalidateQueries({ queryKey: ["contacts", contactId, "addresses"] });
        },

        onError: (error) => {
            errorHookResponse(error);
        },
    });
};
