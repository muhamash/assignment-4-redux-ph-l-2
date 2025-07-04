import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import BookForm from "../module/books/BookForm";
import { closeModal } from "../redux/features/books/modalSlice";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function EditModal ()
{
    const dispatch = useAppDispatch();
    const user = useAppSelector( ( state: RootState ) => state.auth.user );
    const { isOpen, book } = useAppSelector( ( state: RootState ) => state.modal );
    console.log(user, book)

    return (
        <Dialog open={isOpen} onOpenChange={( open ) => !open && dispatch( closeModal() )}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Editing : {book?.title}</DialogTitle>
                <BookForm/>
            </DialogContent>
        </Dialog>
    );
}
