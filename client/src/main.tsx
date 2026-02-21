import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './common/Layout/Layout.tsx';
import Registration from './pages/Registration/Registration.tsx';
import Login from './pages/Login/Login.tsx';
import Main from './pages/Main/Main.tsx';
import BookDetails from './pages/BookDetails/BookDetails.tsx';
import CreateBook from './pages/CreateBook/CreateBook.tsx';
import Profile from './pages/Profile/Profile.tsx';
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
                element: <Main />
            },
            {
                path: '/books/:id',
                element: <BookDetails />
            },
            {
                path: '/books/create',
                element: <CreateBook />
            },
            {
                path: '/profile',
                element: <Profile />
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
