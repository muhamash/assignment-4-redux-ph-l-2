// import React from 'react'
import { Outlet } from 'react-router';
import { useAutoRefresh } from './components/hooks/useAutoRefresh';
import BorrowModal from './components/layouts/BorrowModal';
import EditModal from './components/layouts/EditModal';
import Footer from './components/layouts/Footer';
import Nav from './components/layouts/Nav';

export default function App ()
{
    useAutoRefresh();

    return (
        <div className="min-h-screen bg-background">
            <Nav />
            <Outlet />
            <Footer />
            <BorrowModal />
            <EditModal/>
        </div>
    );
}
