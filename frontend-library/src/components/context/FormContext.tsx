import React from "react";
import type { FormFieldContextValue, FormItemContextValue } from "../types/form.type";


export const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);
  
  
export const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
);