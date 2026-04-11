import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Address } from "./address.types";

export const addressService = {

    listAddresses: async (contactId: string): Promise<ApiResponse<Address[]>> => {

        const response = await api.get(`/contacts/${contactId}/addresses`);

        return response.data;
    },
};
