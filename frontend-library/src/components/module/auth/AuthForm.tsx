import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema, registerSchema } from "../../../lib/zod";
import { useAppDispatch } from "../../hooks/useRedux";
import { useLoginMutation, useRegisterMutation } from "../../redux/api/auth.api";
import { getCredentials } from "../../redux/features/auth/authSlice";
import type { User } from "../../types/auth.type";
import type { ApiError, AuthFormInterface, AuthFormValues, LoginValues, RegisterValues } from "../../types/form.type";
import { Button } from "../../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";

export default function AuthForm({ mode }: AuthFormInterface) {
  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;

  const [login, { data: loginData, isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [ register, { data: regData, isLoading: isRegisterLoading, error: regError } ] = useRegisterMutation();
  
  console.log(JSON.stringify(regError), loginError, regData, loginData)
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(isRegister ? { name: "" } : {}),
    },
  });

  const onSubmit = async ( values: LoginValues | RegisterValues ) =>
  {
    try
    {
      if ( isRegister )
      {
        await register( values as RegisterValues ).unwrap();

        toast.success( "Registered successfully! Please log in." );

        setTimeout( () =>
        {
          navigate( "/login" );
        }, 1000 );
      }
      else
      {
        const res = await login( values as LoginValues ).unwrap();

        const user: User = {
          id: res.id,
          email: res.email,
          name: res.name,
        };

        dispatch( getCredentials( {
          user,
          accessToken: res.accessToken,
          accessTokenExpiresAt: res.accessTokenExpiresAt,
        } ) );

        navigate( "/" );
      }
    }
    catch ( error: unknown )
    {
      toast.error( "Operation failed!" );
      if ( error instanceof Error )
      {
        console.error( "Error:", error.message );
      } else
      {
        console.error( "Error:", error );
      }
    }
  };

  const apiError = ( loginError as ApiError )?.data?.message || ( regError as ApiError )?.data?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isRegister && (
          <FormField
            control={form.control}
            name={"name" as const}
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