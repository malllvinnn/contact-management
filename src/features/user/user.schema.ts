import { z } from "zod";

export const UpdateUserPayloadSchema = z.object({
    name: z.string().min(2, { error: "Name minimal 2 karakter" }).max(100).optional().or(z.literal("")),
    password: z.string().min(6, { error: "Password minimal 6 karakter" }).max(100).optional().or(z.literal("")),
}).refine((data) => (data.name?.trim() ?? "") !== "" || (data.password?.trim() ?? "") !== "",
    {
        message: "Minimal salah satu field (name atau password) harus diisi",
        path: ["name"],
    }
);

export const UpdateUserSchema = UpdateUserPayloadSchema.extend({
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine(
    (data) => {
        const hasPassword = (data.password?.trim() ?? "") !== "";
        const hasConfirm = (data.confirmPassword?.trim() ?? "") !== "";
        if (hasPassword && !hasConfirm) return false;
        return true;
    },
    { message: "Konfirmasi password wajib diisi", path: ["confirmPassword"] }
).refine(
    (data) => {
        const pw = data.password?.trim() ?? "";
        const cpw = data.confirmPassword?.trim() ?? "";
        if (pw !== "" && cpw !== "") return pw === cpw;
        return true;
    },
    { message: "Password tidak sama!", path: ["confirmPassword"] }
);

export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;