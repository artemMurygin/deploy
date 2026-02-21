import './Layout.scss'
import { useEffect } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store.ts';
import { userAuthCheck } from '@/redux/user.slice.ts';
import { CircleUserRound } from 'lucide-react';


const Layout = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(userAuthCheck())
    }, [dispatch]);

    const userState = useAppSelector((store) => store.userState)

    if (userState.isLoading) {
        return <div>Загрузка</div>
    }

    if (!userState.user) {
        return ( <Navigate to="/login" /> )
    }

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-bold">
                        BookApp
                    </Link>

                    <Link to="/profile" className="flex items-center gap-3 rounded-md border px-3 py-2 transition-colors hover:bg-muted">
                        <CircleUserRound className="h-5 w-5 text-muted-foreground" />
                        <div className="text-sm leading-tight">
                            <p className="font-medium">{userState.user.name ?? 'Профиль'}</p>
                            <p className="text-muted-foreground">{userState.user.role ?? 'USER'}</p>
                        </div>
                    </Link>
                </div>
            </header>

            <Outlet />
        </div>
    )
}

export default Layout
