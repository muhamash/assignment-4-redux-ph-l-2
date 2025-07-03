import { createBrowserRouter } from 'react-router';
import App from '../../App';
import Books from '../pages/Books';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';

export const appRouter = createBrowserRouter( [
    {
        path: '/',
        Component: App,
        children: [
            {
                path: '/books',
                Component: Books
            },
            {
                Component: Home,
                index: true
            }
        ]
    },
    // {
    //     path: '/books',
    //     Component: Books
    // },
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/register',
        Component: Register
    },
    {
        path: "*",
        Component: NotFound
    }
] );