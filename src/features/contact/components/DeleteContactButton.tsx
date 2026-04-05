import { Button } from "@/components/ui/button";

/** Slot delete untuk kartu; sambungkan handler / dialog di PR terpisah. */
export interface DeleteContactButtonProps {
    contactId: string;
    contactName: string;
}

export const DeleteContactButton = ({
    contactId: _contactId,
    contactName: _contactName,
}: DeleteContactButtonProps) => {
    return (
        <Button type="button" variant="destructive" size="sm">
            Delete
        </Button>
    );
};
