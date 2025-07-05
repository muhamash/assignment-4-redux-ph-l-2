import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";
import { Book, LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { logout } from "../redux/features/auth/authSlice";
import type { RootState } from "../redux/store/store";
import { Button } from "../ui/button";

const Nav = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { to: "/books", label: "All Books" },
    { to: "/create-book", label: "Add Book" },
    { to: "/borrow-summary", label: "Borrow Summary" },
  ];

    return (
        <nav className="bg-slate-200 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Book className="h-8 w-8 text-primary" />
                        <span className="md:text-xl text-md font-bold text-foreground">LibraryMS</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map( ( link ) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-muted-foreground hover:text-foreground transition-all duration-200 ${ location.pathname === link.to && "text-lg font-bold text-violet-600"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ) )}
                    </div>

                    {/* Mobile drawer button */}
                    <div className="md:hidden flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-6 w-64">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4">
                                    {navLinks.map( ( link ) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`text-muted-foreground hover:text-foreground transition-all duration-200 ${ location.pathname === link.to && "text-lg font-bold text-violet-600"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ) )}
                                    <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                                        {!user ? (
                                            <>
                                                <Link to="/login">
                                                    <Button variant="outline" className="w-full justify-start">
                                                        <LogIn className="h-4 w-4 mr-2" />
                                                        Sign In
                                                    </Button>
                                                </Link>
                                                <Link to="/register">
                                                    <Button variant="default" className="w-full justify-start">
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Sign Up
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-muted-foreground">Hello, {user.name}</span>
                                                <Button
                                                    variant="destructive"
                                                    className="w-full justify-start"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Logout
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop user buttons */}
                    <div className="hidden md:flex items-center space-x-3">
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