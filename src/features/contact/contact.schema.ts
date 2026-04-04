import { z } from "zod";

export const CreateContactSchema = z.object({
    first_name: z.string().min(1, { error: "First name wajib diisi" }).max(100),
    last_name: z.string().max(100).optional().or(z.literal("")),
    email: z.union([
        z.literal(""),
        z.email({ error: "Email tidak valid" }),
    ]),
    phone: z.string().max(50).optional().or(z.literal("")),
});

export type CreateContactPayload = z.infer<typeof CreateContactSchema>;
