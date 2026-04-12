import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { CreateAddressPayload, UpdateAddressPayload } from "./address.schema";
import type { Address } from "./address.types";

export const addressService = {

    listAddresses: async (contactId: string): Promise<ApiResponse<Address[]>> => {

        const response = await api.get(`/contacts/${contactId}/addresses`);

        return response.data;
    },

    createAddress: async (contactId: string, payload: CreateAddressPayload): Promise<ApiResponse<Address>> => {

        const response = await api.post(`/contacts/${contactId}/addresses`, payload);

        return response.data;
    },

    getAddress: async (contactId: string, addressId: string): Promise<ApiResponse<Address>> => {

        const response = await api.get(`/contacts/${contactId}/addresses/${addressId}`);

        return response.data;
    },

    updateAddress: async (contactId: string, addressId: string, payload: UpdateAddressPayload): Promise<ApiResponse<Address>> => {

        const response = await api.put(`/contacts/${contactId}/addresses/${addressId}`, payload);

        return response.data;
    },
};
