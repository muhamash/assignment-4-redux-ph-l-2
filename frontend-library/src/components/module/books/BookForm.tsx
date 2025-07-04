import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { allowedGenres, zodBookSchema, zodUpdateBookSchema } from "../../../lib/zod";
import type { IBook } from "../../types/books.type";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

type BookFormValues = z.infer<typeof zodBookSchema>;
interface BookFormProps
{
    mode?: "edit" | undefined;
    book?: IBook | undefined
}

export default function BookForm({mode, book}: BookFormProps) {

    // const user = useAppSelector( ( state: RootState ) => state.auth.user );

    const isEdit = mode === "edit";
    const schema = isEdit ? zodUpdateBookSchema : zodBookSchema

    const form = useForm<BookFormValues>( {
        resolver: zodResolver( schema ),
        defaultValues: {
            title: book?.title || "",
            author: book?.author || "",
            genre: book?.genre || "",
            isbn: book?.isbn ||  "",
            description: book?.description || "",
            copies: book?.copies || "",
            available: book?.available || "",
        },
    } );

    const onSubmit = ( data: BookFormValues ) =>
    {
        console.log( "Form submitted data:", data );
    };

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
                                                    {genre.charAt( 0 ) + genre.slice( 1 ).toLowerCase()}
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
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Available</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full">Save Book</Button>
                </form>
            </Form>
        </div>
    );
}
