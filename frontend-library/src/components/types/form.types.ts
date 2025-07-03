import
    {
        type FieldPath,
        type FieldValues,
    } from "react-hook-form";
import type z from "zod";
import type { loginSchema, registerSchema } from "../../lib/zod";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface AuthFormInterface {
    mode: "login" | "register";
}

export type FormItemContextValue = {
    id: string;
};

export type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type AuthFormValues = LoginValues | RegisterValues;

export interface ApiError {
    data?: {
        message?: string;
    };
}
