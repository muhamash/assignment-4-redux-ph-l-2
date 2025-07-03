import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AuthFormInterface } from "../../types/FormTypes";
import { loginSchema, registerSchema } from "../../../lib/zod";
import { useLoginMutation, useRegisterMutation } from "../../redux/api/auth.api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AuthForm({ mode }: AuthFormInterface) {
  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;

  const [login, { data: loginData, isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [ register, { data: regData, isLoading: isRegisterLoading, error: regError } ] = useRegisterMutation();
  
  // console.log(JSON.stringify(regError), loginError, regData, loginData)

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(isRegister ? { name: "" } : {}),
    },
  });

  const onSubmit = async ( values: z.infer<typeof schema> ) =>
  {
    try
    {
      if ( isRegister )
      {
        await register( values ).unwrap();
        toast.success( "Registered successfully! Please log in." );
        navigate( "/login" );
      }
      else
      {
        await login( values ).unwrap();
        toast.success( "Logged in successfully!" );
        navigate( "/" );
      }
    }
    catch ( error: any )
    {
      console.error( "Error:", error );
    }
  };

  const apiError = (loginError as any)?.data?.message || (regError as any)?.data?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isRegister && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormDescription>We can share your name publicly.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormDescription>Use at least 6 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {apiError && (
          <p className="text-red-500 text-center text-sm">{apiError}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoginLoading || isRegisterLoading}
        >
          {isLoginLoading || isRegisterLoading ? "Please wait..." : isRegister ? "Register" : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}