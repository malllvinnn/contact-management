export interface User {
    username: string;
    name: string;
}

export interface LoginResponseData extends User {
    token: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    hasHydrated: boolean;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
    setHasHydrated: (value: boolean) => void;
    updateUser: (user: Partial<User>) => void;
}