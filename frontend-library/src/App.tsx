// import React from 'react'
import { Outlet } from 'react-router';
import { useAutoRefresh } from './components/hooks/useAutoRefresh';
import Footer from './components/layouts/Footer';
import Nav from './components/layouts/Nav';

export default function App ()
{
    useAutoRefresh();

    // const { data, isLoading, isError } = useGetBooksQuery();
    // console.log( data, isLoading, isError );

    return (
        <div className="min-h-screen bg-background">
            <Nav />
            <Outlet />
            <Footer />
        </div>
    );
}
