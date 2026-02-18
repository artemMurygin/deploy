import * as React from 'react'
import { createContext, useEffect, useState } from 'react'
import type { MainContextType, User } from '../types/Types.ts';
import $api from '../../shared/axios.instance.ts';


export const MainContext = createContext<MainContextType>(
    { user: undefined, setUser: () => {} }
)

export const MainProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    function handler(user: User | undefined) {
        setUser(user)
    }

    useEffect(() => {
        $api('/auth')
            .then((response) => {
                handler(response.data.user);
                console.log(response.data.user)
            })
            .catch((error) => {
                console.log('error ', error);
            })
            .finally(() => {
                setIsLoading(false)
            });
    }, []);


    console.log('render Main Provider')

    if (isLoading) {
        return <div>Загружаем страницу...</div>;
    }


    return (
        <MainContext.Provider value={{
            user,
            setUser: handler
        }}
        >
            {children}
        </MainContext.Provider>
    )
}