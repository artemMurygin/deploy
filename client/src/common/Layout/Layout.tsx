import './Layout.scss'
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/store.ts';
import { userAuthCheck } from '@/redux/user.slice.ts';


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
        <Outlet />
    )
}

export default Layout