import { createBrowserRouter } from 'react-router';
import App from '../../App';
import BookDetail from '../pages/BookDetail';
import Books from '../pages/Books';
import BorrowSummery from '../pages/BorrowSummery';
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
            },
            {
                Component: BorrowSummery,
                path: '/borrow-summary'
            },
            {
                path: "/books/:id",
                Component: BookDetail,
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