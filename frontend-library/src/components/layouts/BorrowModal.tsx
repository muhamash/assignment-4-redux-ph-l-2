import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { zodBorrowSchema } from "../../lib/zod";
import { isFetchBaseQueryError } from "../guard/TypeGuards";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useBorrowBookMutation } from "../redux/api/books.api";
import { closeBorrowModal } from "../redux/features/books/modalSlice";
import type { RootState } from "../redux/store/store";
import type { BorrowModalBook } from "../types/modal.type";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";


export default function BorrowModal ()
{
    const dispatch = useAppDispatch();
    const user = useAppSelector( ( state: RootState ) => state.auth.user );
    const { isOpen, book } = useAppSelector( ( state: RootState ) => state.modal.borrowModal );

    const [ borrowBook, {data, isLoading, error } ] = useBorrowBookMutation();

    const form = useForm<BorrowModalBook>( {
        defaultValues: {
            quantity: 1,
            dueDate: undefined,
        },
    } );

    const onSubmit = async ( data: BorrowModalBook ) =>
    {
        if ( !book ) return;
      
        try
        {
            const zodValidation = await zodBorrowSchema.parseAsync( {
                book: book.id,
                quantity: data.quantity,
                dueDate: data.dueDate,
                user: user?.id
            } );
            // console.log({
            //     book: book.id,
            //     quantity: data.quantity,
            //     dueDate: data.dueDate,
            //     user: user?.id
            // })
            const res = await borrowBook( zodValidation ).unwrap();
            // console.log(res)
            if ( res.success )
            {
                toast.success( "Success!", {
                    description: `You have borrowed "${ book.title }" successfully.`,
                } );
          
                dispatch( closeBorrowModal() );
                form.reset();
            }
            else
            {
                toast.error( "Failed!", {
                    description: `Failed to borrow the book.`,
                } );
            }
        }
        catch ( error: unknown )
        {
            const apiError =
                isFetchBaseQueryError( error ) && error.data && typeof error.data === "object"
                    ? ( error.data as { message?: string } ).message
                    : "Unknown error";
        
            toast.error( "Failed!", {
                description: apiError ?? "Unknown error",
            } );
        }  
    };    

    if ( !book ) return null;

    const apiError =
                isFetchBaseQueryError( error ) && error.data && typeof error.data === "object"
                    ? ( error.data as { message?: string } ).message
                    : "unknown error!!";


    console.log( apiError, error, data, "borrow modal" );

    return (
        <Dialog open={isOpen} onOpenChange={( open ) => !open && dispatch( closeBorrowModal() )}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Borrow: {book.title}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            rules={{
                                required: "Quantity is required at least 1",
                                min: { value: 1, message: "At least 1" },
                            }}
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Borrow quantity" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            rules={{
                                required: "Due date is required and date should not be past/present!",
                                validate: ( value ) =>
                                {
                                    if ( !value ) return "Due date is required and date should not be past/present!";
                                    const today = new Date();
                                    today.setHours( 0, 0, 0, 0 );
                                    const selected = new Date( value );
                                    selected.setHours( 0, 0, 0, 0 );

                                    if ( selected <= today )
                                    {
                                        return "Due date must be a future date";
                                    }
                                    return true;
                                },
                            }}
                            render={( { field } ) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due date of borrowing</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn( "pl-3 text-left font-normal", !field.value && "text-muted-foreground" )}
                                                >
                                                    {field.value ? format( field.value, "PPP" ) : "Pick a date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={field.onChange}
                                                captionLayout="dropdown"
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button" onClick={() => dispatch( closeBorrowModal() )}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">{ isLoading ? "working.." : "Confirm" }</Button>
                        </DialogFooter>
                        {apiError && (
                            <p className="text-red-500 text-center text-sm">{apiError}</p>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}