import { Book, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { logout } from "../redux/features/auth/authSlice";
import { Button } from "../ui/button";
import type { RootState } from "../redux/store/store";

const Nav = () => {
    const user = useAppSelector( ( state: RootState ) => state.auth.user );
    const dispatch = useAppDispatch();
    const location = useLocation();

    console.log(location.pathname)

    // console.log(user)
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        dispatch( logout() );
        navigate('/')
    };

    return (
        <nav className="bg-slate-200 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Book className="h-8 w-8 text-primary" />
                        <span className="md:text-xl text-md font-bold text-foreground">LibraryMS</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/books" className={`text-muted-foreground hover:text-foreground transition-all duration-200 ${location.pathname === "/books" && "text-lg font-bold text-violet-600"}`}>
                            All Books
                        </Link>
                        <Link to="/create-book" className={`text-muted-foreground hover:text-foreground transition-all duration-200 ${location.pathname === "/create-book" && "text-lg font-bold text-violet-600"}`}>
                            Add Book
                        </Link>
                        <Link to="/borrow-summary" className={`text-muted-foreground hover:text-foreground transition-all duration-200 ${location.pathname === "/borrow-summary" && "text-lg font-bold text-violet-600"}`}>
                            Borrow Summary
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        {!user ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <span className="text-muted-foreground">Hello, {user.name}</span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;