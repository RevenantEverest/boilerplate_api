export interface AuthUser {
    id: string,
    email: string,
    display_name: string,
};

export interface AuthPayload {
    user: AuthUser,
    token?: string
};