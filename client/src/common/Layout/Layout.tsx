import './Layout.scss'
import { useContext } from 'react';
import { MainContext } from '../../context/MainContext.tsx';
import { Navigate, Outlet } from 'react-router-dom';


const Layout = () => {
    const { user } = useContext(MainContext)

    if (!user) {
        return ( <Navigate to="/login" /> )
    }

    return (
        <Outlet />
    )
}

export default Layout