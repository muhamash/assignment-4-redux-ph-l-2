import { createBrowserRouter } from 'react-router';
import App from '../../App';
import AuthGuard from '../guard/AuthGuard';
import AddBooks from '../pages/AddBooks';
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
                element: <AuthGuard>
                    <BorrowSummery />
                </AuthGuard>,
                path: '/borrow-summary'
            },
            {
                path: "/books/:id",
                Component: BookDetail,
            },
            {
                path: "/create-book",
                element: <AuthGuard>
                    <AddBooks />
                </AuthGuard>
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