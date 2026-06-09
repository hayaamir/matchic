"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Field } from "./Field";
import { QnInput } from "./QnInput";
import { InputFormFieldProps } from "./types";

export const InputFormField = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  span,
  placeholder,
  type = "text",
  suffix,
  suffixAccent,
}: InputFormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field label={label} required={required} hint={hint} span={span} error={fieldState.error?.message}>
        <QnInput
          {...field}
          type={type}
          placeholder={placeholder}
          suffix={suffix}
          suffixAccent={suffixAccent}
          hasError={!!fieldState.error}
        />
      </Field>
    )}
  />
);
