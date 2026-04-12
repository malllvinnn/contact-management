import { z } from "zod";

export const CreateAddressSchema = z.object({
    street: z.string().max(255).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    province: z.string().max(100).optional().or(z.literal("")),
    country: z.string().min(1, { error: "Country wajib diisi" }).max(100),
    postal_code: z.string().min(1, { error: "Postal code wajib diisi" }).max(10),
});

export type CreateAddressPayload = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = CreateAddressSchema;

export type UpdateAddressPayload = z.infer<typeof UpdateAddressSchema>;