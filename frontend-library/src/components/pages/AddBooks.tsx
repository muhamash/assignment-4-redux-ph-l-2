import { useNavigate } from "react-router-dom";
import BookForm from "../module/books/BookForm";
import { Button } from "../ui/button";

export default function AddBooks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg p-8 relative">
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 px-3 py-1 text-sm bg-violet-100 hover:bg-violet-200 hover:shadow-2xl text-violet-800 rounded-md transition-all"
        >
          ← Back
        </Button>

        <h1 className="text-2xl font-bold text-center text-violet-900 mb-2">
          Add New Book
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Fill in the details below to create a new book entry.
        </p>

        {/* You can render a global error message above form here if needed */}
        {/* Example: */}
        {/* <p className="text-center text-red-500 mb-4">Please fix the highlighted errors</p> */}

        <BookForm />

        <p className="mt-6 text-xs text-gray-400 text-center">
          After adding, you’ll be redirected to the books list automatically.
        </p>
      </div>
    </div>
  );
}
