"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Field } from "./Field";
import { QnTextarea } from "./QnTextarea";
import { TextareaFormFieldProps } from "./types";

export const TextareaFormField = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  span,
  placeholder,
  tone,
  minHeight,
}: TextareaFormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field label={label} required={required} hint={hint} span={span} error={fieldState.error?.message}>
        <QnTextarea
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
          tone={tone}
          minHeight={minHeight}
        />
      </Field>
    )}
  />
);
