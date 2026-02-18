import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainProvider } from './context/MainContext.tsx';
import Layout from './common/Layout/Layout.tsx';
import Registration from './pages/Registration/Registration.tsx';
import Login from './pages/Login/Login.tsx';


const router = createBrowserRouter([
    {
        path: '/registration',
        element: <Registration />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <App />
            }
        ]
    }
])

createRoot(document.getElementById('root')!)
    .render(
        <MainProvider>
            <RouterProvider router={router} />
        </MainProvider>
    )


// 1 хочу попробовать сделать форму с валидацией, изучить возможности реакт hookform
// 2 хочу поюзать shadsCN
// 3 хочу заюзать хуки оптимизации
// RTK
