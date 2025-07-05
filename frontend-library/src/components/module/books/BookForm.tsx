import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { allowedGenres, zodBookSchema, zodUpdateBookSchema } from "../../../lib/zod";
import { useAppDispatch } from "../../hooks/useRedux";
import
    {
        useCreateBookMutation,
        useUpdateBookMutation,
    } from "../../redux/api/books.api";
import { closeEditModal } from "../../redux/features/books/modalSlice";
import type { IBook } from "../../types/books.type";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import
    {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from "../../ui/form";
import { Input } from "../../ui/input";
import
    {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

type BookFormValues = z.infer<typeof zodBookSchema>;

interface BookFormProps {
  mode?: "edit";
  book?: IBook;
}

export default function BookForm({ mode, book }: BookFormProps) {
    const dispatch = useAppDispatch();

    const [ createBook, { isLoading: isCreateLoading, error: createError } ] = useCreateBookMutation();
    const [ updateBook, { isLoading: isUpdateLoading, error: updateError } ] = useUpdateBookMutation();

    const isEdit = mode === "edit";
    const schema = isEdit ? zodUpdateBookSchema : zodBookSchema;

    const navigate = useNavigate()

    const form = useForm<BookFormValues>( {
        resolver: zodResolver( schema ),
        defaultValues: {
            title: book?.title || "",
            author: book?.author || "",
            genre: book?.genre || "",
            isbn: book?.isbn || "",
            description: book?.description || "",
            copies: book?.copies || "",
            available: book?.available || false,
        },
    } );

    const onSubmit = async ( data: BookFormValues ) =>
    {
        try
        {
            if ( isEdit && book?.id )
            {
                const res = await updateBook( { id: book.id, body: data } ).unwrap();
                if ( res?.success )
                {
                    toast.success( "Book updated successfully!" );
                }
                else
                {
                    toast.error( `Book updates error! ${ res?.error?.message }` );
                }
            }
            else
            {
                const res = await createBook( data ).unwrap();
                if ( res?.success )
                {
                    toast.success( "Book created successfully!" );
                }
                else
                {
                    toast.error( `Book creates error! ${ res?.error?.message }` );
                }
          
                navigate( "/books" )
            }

            dispatch( closeEditModal() );
            form.reset();
        } catch ( err: unknown )
        {
            const errMsg = err?.data?.message || "An error occurred.";
            toast.error( errMsg );
        }
    };

    const isSubmitting = isEdit ? isUpdateLoading : isCreateLoading;
    const currentError = isEdit ? updateError : createError;

    return (
        <div className="sm:max-w-[500px] mx-auto w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Title *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Book title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="author"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Author *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Author name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isbn"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>ISBN *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Book ISBN" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Description (optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Short book description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="copies"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Copies *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Number of copies"
                                        value={field.value ?? ""}
                                        onChange={( e ) => field.onChange( Number( e.target.value ) )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="genre"
                            render={( { field } ) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Genre *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select genre" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {allowedGenres.map( ( genre ) => (
                                                <SelectItem key={genre} value={genre}>
                                                    {genre.charAt( 0 ).toUpperCase() + genre.slice( 1 ).toLowerCase()}
                                                </SelectItem>
                                            ) )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="available"
                            render={( { field } ) => (
                                <FormItem className="flex items-center space-x-2 pt-6">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Available</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Book"}
                    </Button>
                    {currentError && (
                        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                    )}
                </form>
            </Form>
        </div>
    );
}