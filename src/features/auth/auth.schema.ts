import { z } from "zod";

export const RegisterPayloadSchema = z.object({
    username: z.string().min(2, { error: "Username minimal 2 karakter" }).max(20),
    name: z.string().min(2, { error: "Name minimal 2 karakter" }).max(100),
    password: z.string().min(6, { error: "Password minimal 6 karakter" }).max(100),
});

export const RegisterSchema = RegisterPayloadSchema.extend({
    confirmPassword: z.string().min(1, { error: "Konfirmasi password wajib diisi" })
}).refine((data) => data.password === data.confirmPassword, {
    error: "Password tidak sama!",
    path: ["confirmPassword"],
});

export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;