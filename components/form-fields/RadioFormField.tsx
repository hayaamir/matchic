"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Field } from "./Field";
import { QnRadio } from "./QnRadio";
import { RadioFormFieldProps } from "./types";

export const RadioFormField = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  span,
  options,
}: RadioFormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field label={label} required={required} hint={hint} span={span} error={fieldState.error?.message}>
        <QnRadio
          options={options}
          value={field.value}
          onChange={field.onChange}
          hasError={!!fieldState.error}
        />
      </Field>
    )}
  />
);
