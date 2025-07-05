import { useState } from "react";
import { useGetBorrowSummaryQuery } from "../redux/api/books.api";
import type { IBorrowSummaryItem } from "../types/books.type";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import
  {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";

export default function BorrowSummary() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetBorrowSummaryQuery({ page });

  const totalPages = data?.pagination?.totalPages || 1;

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    const errorMessage =
      "status" in error
        ? JSON.stringify(error.data) || "Unknown error"
        : error?.message || "Unknown error";
  
    return <p className="text-red-500 text-center">Error fetching summary. {errorMessage}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold my-10 text-center font-serif">Borrow Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow bg-sky-50">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">{item.book.title}</h2>
              <p className="text-sm text-gray-500 mb-2">ISBN: {item.book.isbn}</p>
              <p className="font-medium mb-2">Total Borrowed: <Badge variant={"default"}>{item.totalQuantity}</Badge></p>

              <div className="border-t pt-2 mt-2">
                <p className="font-semibold text-sm mb-1">Borrowers:</p>
                {item.users.map((user : IBorrowSummaryItem["users"][0]) => (
                  <ul key={user.id} className="text-sm">
                    <span className="font-medium text-violet-700">{user.name}</span> ({user.email}) - <Badge variant={"outline"}>{user.quantity}</Badge>
                  </ul>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-8 justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              className={page === 1 ? "opacity-50 pointer-events-none" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
                isActive={i + 1 === page}
                className={`${
                  i + 1 === page ? "bg-primary text-white" : "hover:bg-primary/20"
                } transition-colors`}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
