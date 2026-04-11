import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "../address.types";

interface AddressCardProps {
    address: Address;
    className?: string;
}

export const AddressCard = ({ address, className }: AddressCardProps) => {
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

                {/* Placeholder untuk action buttons (Edit, Hapus) — diisi di issue berikutnya */}
                <div className="flex shrink-0 gap-1" />
            </div>
        </article>
    );
};
