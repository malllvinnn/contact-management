export type Contact = {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
};

export type ContactState = {
    isOpenCreateModal: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
};
