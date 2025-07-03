import React from 'react'
import { Outlet } from 'react-router';
import Nav from './components/layouts/Nav';
import Footer from './components/layouts/Footer';

export default function App() {
    return (
        <div className="min-h-screen bg-background">
            <Nav />
            <Outlet />
            <Footer />
        </div>
    );
}
