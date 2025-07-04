import { Book } from 'lucide-react';
import { Link } from 'react-router';
import BookCard from '../../layouts/BookCard';
import BorrowModal from '../../layouts/BorrowModal';
import { useGetBooksQuery } from '../../redux/api/books.api';
import type { IBook } from '../../types/books.type';

export default function Hero() {
    const { data, isLoading, isError } = useGetBooksQuery();

    const books = data?.data?.slice( 0, 6 ) || [];
    // console.log(books)

    return (
        <section className="bg-sky-800 py-20 flex flex-col items-center justify-center gap-10">
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
            </div>

            {isLoading && (
                <p className="text-primary-foreground">Loading books...</p>
            )}

            {isError && (
                <p className="text-red-300">Failed to load books. Please try again.</p>
            )}

            {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {books?.map( ( book: IBook ) => (
                        <BookCard key={book?.id} book={book} />
                    ) )}
                </div>
            )}

            {
                books?.length === 0 && (
                    <div>
                        Empty database!!!
                    </div>
                )
            }

            <div className="place-self-center">
                <Link to="/books" className='px-4 py-2 rounded-md bg-slate-400 text-black shadow-md text-sm'>
                    View More
                </Link>
            </div>
            <BorrowModal/>
        </section>
    );
}