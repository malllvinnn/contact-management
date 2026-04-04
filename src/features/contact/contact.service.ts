import type { ApiPaginatedResponse, ApiResponse } from "@/types/api";
import type { CreateContactPayload } from "./contact.schema";
import type { Contact, SearchContactParams } from "./contact.types";
import { api } from "@/lib/api";

export const contactService = {

    createContact: async (payload: CreateContactPayload): Promise<ApiResponse<Contact>> => {

        const response = await api.post("/contacts", payload);

        return response.data;
    },

    searchContacts: async (params: SearchContactParams): Promise<ApiPaginatedResponse<Contact>> => {

        const response = await api.get("/contacts", { params });

        return response.data;
    }
}