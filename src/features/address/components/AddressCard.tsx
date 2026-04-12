import { MapPin, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAddressStore } from "../address.store";
import { useRemoveAddress } from "../address.hook";
import type { Address } from "../address.types";

interface AddressCardProps {
    contactId: string;
    address: Address;
    className?: string;
}

export const AddressCard = ({ contactId, address, className }: AddressCardProps) => {

    const { openEditModal } = useAddressStore();
    const { mutate: removeAddress, isPending } = useRemoveAddress(contactId);

    const handleRemove = () => {
        if (!window.confirm("Yakin ingin menghapus alamat ini?")) return;
        removeAddress(address.id);
    };

    return (
        <article
            className={cn(
                "rounded-xl border border-border bg-card p-4 shadow-sm",
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 gap-3">
                    <MapPin
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                    />
                    <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium">{address.country}</p>
                        {address.province && (
                            <p className="text-sm text-muted-foreground">{address.province}</p>
                        )}
                        {address.city && (
                            <p className="text-sm text-muted-foreground">{address.city}</p>
                        )}
                        {address.street ? (
                            <p className="text-sm text-muted-foreground">{address.street}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">—</p>
                        )}
                        <p className="text-sm text-muted-foreground">{address.postal_code}</p>
                    </div>
                </div>

                <div className="flex shrink-0 gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => openEditModal(address)}
                        aria-label="Edit Alamat"
                        disabled={isPending}
                    >
                        <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={handleRemove}
                        aria-label="Hapus Alamat"
                        disabled={isPending}
                    >
                        <Trash2 className="size-4" aria-hidden />
                    </Button>
                </div>
            </div>
        </article>
    );
};
