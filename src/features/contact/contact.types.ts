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
    // create state
    isOpenCreateModal: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;

    // edit state
    isOpenEditModal: boolean;
    selectedContact: Contact | null;
    openEditModal: (contact: Contact) => void;
    closeEditModal: () => void;
};
