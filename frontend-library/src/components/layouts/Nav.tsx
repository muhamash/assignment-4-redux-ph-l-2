import { Book, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/button';

const Nav = () =>
{
    return (
        <nav className="bg-slate-200 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Book className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">LibraryMS</span>
                    </Link>
            
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/books" className="text-muted-foreground hover:text-foreground transition-colors">
                            All Books
                        </Link>
                        <Link to="/create-book" className="text-muted-foreground hover:text-foreground transition-colors">
                            Add Book
                        </Link>
                        <Link to="/borrow-summary" className="text-muted-foreground hover:text-foreground transition-colors">
                        Borrow Summary
                        </Link>
                    </div>
            
                    <div className="flex items-center space-x-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="sm">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;