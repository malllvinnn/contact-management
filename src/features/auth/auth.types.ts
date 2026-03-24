export interface User {
    username: string;
    name: string;
}

export interface LoginResponseData extends User {
    token: string;
}

export interface RegisterPayload {
    username: string;
    name: string;
    password?: string;
}

export interface LoginPayload {
    username: string;
    password?: string;
}

export interface UpdateUserPayload {
    name?: string;
    password?: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
}