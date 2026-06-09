import { Control, FieldPath, FieldValues } from "react-hook-form";

export type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  hint?: string;
  span?: 1 | 2;
};

export type InputFormFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  suffix?: string;
  suffixAccent?: boolean;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectFormFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  placeholder?: string;
  options: SelectOption[];
};

export type RadioOption = {
  id: string;
  label: string;
};

export type RadioFormFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  options: RadioOption[];
};

export type TextareaFormFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  placeholder?: string;
  tone?: "default" | "note";
  minHeight?: number;
};
