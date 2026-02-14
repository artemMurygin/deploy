import * as React from 'react'
import { createContext, useEffect, useState } from 'react'
import $api from '../../shared/axios.instance.ts';
import type { MainContextType, User } from '../types/Types.ts';


export const MainContext = createContext<MainContextType>(
    {} as MainContextType
)

export const MainProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        $api('/auth')
            .then((response) => {
                setUser(response.data.user);
                console.log(response.data.user)
            })
            .catch((error) => {
                console.log('error ', error);
            })
            .finally(() => {
                setIsLoading(false)
            });
    }, []);

    if (isLoading) {
        return <div>Загружаем страницу...</div>;
    }

    return (
        <MainContext.Provider value={{
            user,
            setUser
        }}
        >
            {children}
        </MainContext.Provider>
    )
}