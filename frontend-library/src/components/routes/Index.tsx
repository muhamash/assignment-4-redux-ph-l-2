import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import Books from '../pages/Books';
import Login from '../pages/Login';
import App from '../../App';
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
    }
] );