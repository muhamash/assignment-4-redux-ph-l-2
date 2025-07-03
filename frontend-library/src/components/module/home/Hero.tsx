import { Book } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router';
import { Button } from '../../ui/button';

export default function Hero() {
    return (
        <section className="bg-sky-800 py-20">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center mb-8">
                    <Book className="h-20 w-20 text-primary-foreground" />
                </div>
                <h1 className="text-5xl font-bold text-primary-foreground mb-6">
                    LibraryMS
                </h1>
                <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                    Manage your library efficiently with our modern, intuitive management system.
                    Track books, manage borrowing, and keep your collection organized.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/books">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                            Browse Books
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
