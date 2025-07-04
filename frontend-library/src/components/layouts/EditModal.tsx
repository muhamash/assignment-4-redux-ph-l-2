import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import BookForm from "../module/books/BookForm";
import { closeEditModal } from "../redux/features/books/modalSlice";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function EditModal ()
{
    const dispatch = useAppDispatch();
    const { isOpen, book } = useAppSelector( ( state: RootState ) => state.modal.editModal );
    // console.log("edit modal", user)

    return (
        <Dialog open={isOpen} onOpenChange={( open ) => !open && dispatch( closeEditModal() )}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Editing : {book?.title}</DialogTitle>
                <BookForm book={book} mode={ "edit" } />
            </DialogContent>
        </Dialog>
    );
}
