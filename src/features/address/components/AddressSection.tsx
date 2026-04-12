import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListAddresses } from "../address.hook";
import { useAddressStore } from "../address.store";
import { AddressCard } from "./AddressCard";
import { AddressCardSkeleton } from "./AddressCardSkeleton";
import { AddressEmptyState } from "./AddressEmptyState";
import { AddressFormDialog } from "./AddressFormDialog";
import { AddressForm } from "./AddressForm";

interface AddressSectionProps {
    contactId: string;
    className?: string;
}

export const AddressSection = ({ contactId, className }: AddressSectionProps) => {

    const { data, isLoading, isError } = useListAddresses(contactId);
    const addresses = data?.data;

    const { openCreateModal, isOpenEditModal, selectedAddress } = useAddressStore();

    return (
        <div className={cn("page-card", className)}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden />
                    <h2 className="text-base font-semibold md:text-lg">Alamat</h2>
                </div>
                <AddressFormDialog contactId={contactId} />
            </div>

            {isOpenEditModal && selectedAddress && (
                <AddressForm
                    mode="edit"
                    contactId={contactId}
                    addressId={selectedAddress.id}
                    defaultValues={selectedAddress}
                />
            )}

            {isLoading && (
                <div className="flex flex-col gap-3">
                    <AddressCardSkeleton />
                    <AddressCardSkeleton />
                </div>
            )}

            {isError && (
                <p className="text-sm text-destructive">Gagal memuat alamat.</p>
            )}

            {!isLoading && !isError && addresses && addresses.length === 0 && (
                <AddressEmptyState onAddClick={openCreateModal} />
            )}

            {!isLoading && !isError && addresses && addresses.length > 0 && (
                <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            )}
        </div>
    );
};
