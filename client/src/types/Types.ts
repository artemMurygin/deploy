export type User = {
    name: string | undefined;
    email: string | undefined;
    role: string | undefined
}

export type UserState = {
    isLoading: boolean
    error?: string | null
    user?: User
}

export type MainContextType = {
    user: User | undefined,
    setUser: (user: User | undefined) => void,
}

