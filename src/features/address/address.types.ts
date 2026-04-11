export type Address = {
    id: string;
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
};

export type AddressState = {
    isOpenCreateModal: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
};
