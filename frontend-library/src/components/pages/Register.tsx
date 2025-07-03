import { Book } from 'lucide-react';
// import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Link } from 'react-router';
import AuthForm from '../module/auth/AuthForm';

export default function Register() {

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 gap-10 w-full">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <Book className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground mt-2">Welcome to your library</p>
                    <p className='text-yellow-600'>Please Register an account!!</p>
                </div>
            </div>

            {/* Login form */}
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Registration</CardTitle>
                    <CardDescription>Enter your credentials to register your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm mode='register'/>
                </CardContent>
                <CardFooter className="text-center text-muted-foreground text-sm flex flex-col gap-5">
                    <p>Already have an account? <span className='text-bold text-rose-600 text-md font-mono'><Link to={"/login"}>Login</Link></span>
                    </p>
                    <p>© {new Date().getFullYear()} github.com/muhamash. All rights reserved.</p>
                </CardFooter>
            </Card>
        </div>
    );
}