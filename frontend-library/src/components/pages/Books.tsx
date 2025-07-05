import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import BookCard from "../layouts/BookCard";
import { useGetBooksQuery } from "../redux/api/books.api";
import { setPage, setTab } from "../redux/features/books/paginationSlice";
import type { RootState } from "../redux/store/store";
import type { IBook } from "../types/books.type";
import
  {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { isFetchBaseQueryError } from "../guard/TypeGuards";

export default function Books() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const { page, limit, tab } = useAppSelector((state: RootState) => state.pagination);

  const userId = tab === "my" ? user?.id : undefined;

  const { data, isLoading, error: isError } = useGetBooksQuery( {
    page: String( page ),
    limit: String( limit ),
    userId,
  }, {
    refetchOnMountOrArgChange: true,
  } );
  
  // console.log(user)

  const books = data?.data || undefined;
  // console.log(data, isError)
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handleNext = () : void => {
    if (page < totalPages) dispatch(setPage(page + 1));
  };

  const handlePrevious = () : void => {
    if (page > 1) dispatch(setPage(page - 1));
  };

  const handleTabChange = ( value: string ): void =>
  {
    if ( value === "all" || value === "my" )
    {
      dispatch( setTab( value ) );
    }
  };

  const apiError = isError && isFetchBaseQueryError( isError ) && isError.data && typeof isError.data === "object"
    ? ( isError.data as { message?: string } ).message
    : null;


  return (
    <div className="bg-gray-100 py-20 flex flex-col items-center justify-center gap-10">
      <h1 className="text-2xl text-slate-800 font-serif font-semibold">All books</h1>

      {user?.id && (
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my">My books</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {isLoading && <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
        <span className="ml-3 text-lg text-black">Loading books...</span>
      </div>}

      {
        apiError && ( <p className="text-red-600">{ apiError }</p>)
      }
      

      {!isLoading && !isError && books?.length === 0 && (
        <div className="text-white">No books found!</div>
      )}

      {!isLoading && !isError && ( books?.length ?? 0 ) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {books?.map( ( book: IBook ) => (
            <BookCard key={book.id} book={book} />
          ) )}
        </div>
      )}


      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={( e ) =>
                {
                  e.preventDefault();
                  handlePrevious();
                }}
                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from( { length: totalPages }, ( _, i ) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={( e ) =>
                  {
                    e.preventDefault();
                    dispatch( setPage( i + 1 ) );
                  }}
                  isActive={i + 1 === page}
                  className={`${ i + 1 === page ? "bg-primary text-white" : "hover:bg-primary/20"
                    } transition-colors`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ) )}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={( e ) =>
                {
                  e.preventDefault();
                  handleNext();
                }}
                className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}