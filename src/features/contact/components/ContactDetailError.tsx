import { AlertCircle } from "lucide-react";

interface ContactDetailErrorProps {
    message: string;
}

export const ContactDetailError = ({ message }: ContactDetailErrorProps) => {
    return (
        <div
            className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive"
            role="alert"
        >
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-sm leading-snug">{message}</p>
        </div>
    );
};
