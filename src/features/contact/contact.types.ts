export type Contact = {
    id: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
};

export interface SearchContactParams {
    name?: string;
    email?: string;
    phone?: string;
    page?: number;
    size?: number;
}

export type ContactState = {
    isOpenCreateModal: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
};
