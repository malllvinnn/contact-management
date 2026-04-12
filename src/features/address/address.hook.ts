import { useMutation, useQuery } from "@tanstack/react-query";
import { addressService } from "./address.service";
import type { CreateAddressPayload, UpdateAddressPayload } from "./address.schema";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { errorHookResponse } from "@/lib/utils";
import { useAddressStore } from "./address.store";

export const useListAddresses = (contactId: string) => {

    return useQuery({
        queryFn: () => addressService.listAddresses(contactId),
        queryKey: ["contacts", contactId, "addresses"],
        enabled: !!contactId,
    });
};

export const useGetAddress = (contactId: string, addressId: string) => {

    return useQuery({
        queryFn: () => addressService.getAddress(contactId, addressId),
        queryKey: ["contacts", contactId, "addresses", addressId],
        enabled: !!contactId && !!addressId,
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

export const useUpdateAddress = (contactId: string, addressId: string) => {

    const { closeEditModal } = useAddressStore();

    return useMutation({

        mutationFn: (payload: UpdateAddressPayload) => addressService.updateAddress(contactId, addressId, payload),

        onSuccess: (response) => {
            closeEditModal();
            toast.success(response.message || "Address updated successfully");
            queryClient.invalidateQueries({ queryKey: ["contacts", contactId, "addresses"] });
        },

        onError: (error) => {
            errorHookResponse(error);
        },
    });
};

export const useRemoveAddress = (contactId: string) => {

    return useMutation({

        mutationFn: (addressId: string) => addressService.removeAddress(contactId, addressId),

        onSuccess: (response) => {
            toast.success(response.message || "Address removed successfully");
            queryClient.invalidateQueries({ queryKey: ["contacts", contactId, "addresses"] });
        },

        onError: (error) => {
            errorHookResponse(error);
        },
    });
};
