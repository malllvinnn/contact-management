import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useContactStore } from "../contact.store";
import type { Contact } from "../contact.types";

interface EditContactButtonProps {
    contact: Contact;
}

export const EditContactButton = ({ contact }: EditContactButtonProps) => {

    const openEditModal = useContactStore((s) => s.openEditModal);

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 border-border/80 ring-1 ring-transparent transition-[box-shadow,ring-color] hover:border-ring/60 hover:ring-ring/30"
            onClick={() => openEditModal(contact)}
        >
            <span className="flex items-center gap-1">
                <Pencil className="size-3.5" aria-hidden />
                Edit
            </span>
        </Button>
    );
};
