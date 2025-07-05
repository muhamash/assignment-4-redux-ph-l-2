import { Book, EditIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isFetchBaseQueryError } from "../guard/TypeGuards";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useDeleteBookMutation } from "../redux/api/books.api";
import { openBorrowModal, openEditModal } from "../redux/features/books/modalSlice";
import type { RootState } from "../redux/store/store";
import type { IBook } from "../types/books.type";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function BookCard ( { book }: { book: IBook } )
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector( ( state: RootState ) => state?.auth?.user );
    const [ deleteBook ] = useDeleteBookMutation();

    // console.log(user.id)

    const handleDelete = ( bookId: string ) =>
    {
        toast.custom( ( t ) => (
            <div className="space-y-2 w-full">
                <p className="text-rose-600 text-lg">Are you sure you want to delete this book?</p>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () =>
                        {
                            try
                            {
                                await deleteBook( bookId ).unwrap();
                                toast.dismiss( t );
                                toast.success( "Book deleted successfully" );
                            } catch ( error: unknown )
                            {
                                toast.dismiss( t );
                                const msg = isFetchBaseQueryError( error ) && error.data && typeof error.data === "object"
                                    ? ( error.data as { message?: string } ).message
                                    : "unknown error!!";
                                
                                toast.error( msg );
                            }
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.dismiss( t )}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        ) );
        
    };

    return (
        <Card className="card-shadow transition-smooth hover:shadow-lg">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-md text-sky-800 mb-2">{book.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        <p className="text-xs text-violet-600">
                            Created by: {book.createdBy?.name}
                        </p>
                    </div>
                    <Book className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Genre:</span>
                        <Badge variant="secondary">{book.genre}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ISBN:</span>
                        <span className="font-mono text-xs">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <Badge variant={book.available ? "default" : "destructive"}>
                            {book.available ? `${ book.copies } copies` : "Not available"}
                        </Badge>
                    </div>
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    {
                        user?.id === book.createdBy?.id && user?.id && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => dispatch( openEditModal( book ) )}
                                >
                                    <EditIcon className="w-4 h-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete( book.id! )}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        )
                    }
                    <>
                        <Button
                            disabled={!book?.available || user?.id === book.createdBy?.id || !user?.id}
                            variant="outline"
                            size="sm"
                            onClick={
                                () => dispatch( openBorrowModal( { ...book, quantity: 1, dueDate: new Date().toISOString() } ) )
                            }
                        >
                            Borrow
                        </Button>
                    </>

                    <>
                        <Button
                            className="ml-auto"
                            variant="link"
                            size="sm"
                            onClick={() => navigate( `/books/${ book?.id }` )}
                        >
                            View
                        </Button>
                    </>
                </div>
            </CardContent>
        </Card>
    );
}