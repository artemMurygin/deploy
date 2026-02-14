import type {Dispatch, SetStateAction} from 'react';

export type User = {
    name: string;
    email: string;
    role: number
}

export type MainContextType = {
    user: User | undefined,
    setUser: Dispatch<SetStateAction<User | undefined>>,
}