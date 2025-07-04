import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useGetBookQuery } from "../redux/api/books.api";
import { openModal } from "../redux/features/books/modalSlice";
import { Button } from "../ui/button";

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector( ( state: RootState ) => state?.auth?.user );

    const { data, isLoading, error } = useGetBookQuery( id );

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
              <span className="ml-3 text-lg">Loading book details...</span>
          </div>
      );
    };

  if (error || !data?.data) {
      return (
          <div className="flex flex-col justify-center items-center h-screen text-center">
              <h2 className="text-2xl font-semibold text-red-600">Book not found</h2>
              <Button variant="outline" className="mt-4" onClick={() => navigate( -1 )}>
                  Go Back
              </Button>
          </div>
      );
    };

    const book = data.data;
    
    console.log(book)

    return (
        <>
            <Helmet>
                <title>{book.title} - Book Details</title>
                <meta name="description" content={book.description || "Book detail page"} />
            </Helmet>
            <div className="max-w-5xl mx-auto py-12 px-6">
            
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

                <div className="prose max-w-none mb-10">
                    <p>{book.description}</p>
                </div>

                <div className="space-y-2 text-lg">
                    <p>
                        <strong>Available:</strong>{" "}
                        <span className={book.available ? "text-green-600" : "text-red-600"}>
                            {book.available ? "Yes" : "No"}
                        </span>
                    </p>

                    <p>
                        <strong>Created by:</strong> {book.createdBy?.name || "Unknown"}
                    </p>
                    <p>
                        <strong>Contact owner:</strong> {book.createdBy?.email || "Unknown"}
                    </p>

                    <p>
                        <strong>Total Copies:</strong> {book.copies || "N/A"}
                    </p>

                    {/* <p>
          <strong>Borrowed Count:</strong> {book.borrowCount || 0}
        </p> */}

                    <p>
                        <strong>Genre:</strong> {book.genre || "N/A"}
                    </p>

                    <p>
                        <strong>Isbn:</strong> {book.isbn || "N/A"}
                    </p>

                    <p>
                        <strong>Added at:</strong>{" "}
                        {book.createdAt ? new Date( book.createdAt ).toLocaleDateString() : "N/A"}
                    </p>
                </div>

                <div className="flex space-x-4 mt-10">
                    <Button
                        disabled={!book?.available || user?.id === book.createdBy.id || !user?.id}
                        onClick={() => dispatch( openModal( book ) )}
                    >
                        Borrow This Book
                    </Button>
                    <Button variant="outline" onClick={() => navigate( -1 )}>
                        Back
                    </Button>
                </div>
            </div></>
    );
}