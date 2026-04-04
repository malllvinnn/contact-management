import type { ApiResponse } from "@/types/api";
import type { CreateContactPayload } from "./contact.schema";
import type { Contact } from "./contact.types";
import { api } from "@/lib/api";

export const contactService = {

    createContact: async (payload: CreateContactPayload): Promise<ApiResponse<Contact>> => {

        const response = await api.post("/contacts", payload);

        return response.data;
    }
}