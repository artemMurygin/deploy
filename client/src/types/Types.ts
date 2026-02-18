export type User = {
    name: string;
    email: string;
    role: number
}

export type MainContextType = {
    user: User | undefined,
    setUser: (user: User | undefined) => void,
}

