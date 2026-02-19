import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './common/Layout/Layout.tsx';
import Registration from './pages/Registration/Registration.tsx';
import Login from './pages/Login/Login.tsx';
import { store } from '@/redux/store.ts';
import { Provider } from 'react-redux';


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
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )


