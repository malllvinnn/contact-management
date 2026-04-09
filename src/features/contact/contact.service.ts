import type { ApiPaginatedResponse, ApiResponse } from "@/types/api";
import type { CreateContactPayload, UpdateContactPayload } from "./contact.schema";
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
    },

    getContact: async (id: string): Promise<ApiResponse<Contact>> => {

        const response = await api.get(`/contacts/${id}`);

        return response.data;
    },

    updateContact: async (id: string, payload: UpdateContactPayload): Promise<ApiResponse<Contact>> => {

        const response = await api.put(`/contacts/${id}`, payload);

        return response.data;
    },
}