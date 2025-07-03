import type { loginSchema, registerSchema } from "../../lib/zod";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface AuthFormInterface
{
    mode: "login" | "register"
}