"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, Grid, QnInput, QnRadio } from "@/components/form-fields";
import { FormSection } from "../FormSection";
import { PhotoUploaderPlaceholder } from "../PhotoUploaderPlaceholder";
import { CandidateFormValues } from "../types";

const genderOptions = [
  { id: "female", label: "אישה" },
  { id: "male", label: "גבר" },
];

export const Demo = () => {
  const { control } = useFormContext<CandidateFormValues>();

  return (
    <>
      <FormSection number="1" title="פרטים בסיסיים" subtitle="שם, ת״ז, טלפון ותאריך לידה">
        <Grid>
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field label="שם פרטי" required error={fieldState.error?.message}>
                <QnInput {...field} placeholder="שירה" hasError={!!fieldState.error} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field label="שם משפחה" required error={fieldState.error?.message}>
                <QnInput {...field} placeholder="לוי" hasError={!!fieldState.error} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field label="מין" required span={2} error={fieldState.error?.message}>
                <QnRadio
                  options={genderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!fieldState.error}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="idNumber"
            render={({ field, fieldState }) => (
              <Field label='תעודת זהות' required error={fieldState.error?.message} hint="לבדיקת חפיפה עם שדכניות אחרות · נשמר מוצפן">
                <QnInput {...field} placeholder="9 ספרות" hasError={!!fieldState.error} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field label="טלפון" required error={fieldState.error?.message}>
                <QnInput {...field} placeholder="050-0000000" hasError={!!fieldState.error} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field label="תאריך לידה" required span={2} error={fieldState.error?.message}>
                <QnInput {...field} type="date" hasError={!!fieldState.error} />
              </Field>
            )}
          />
        </Grid>
      </FormSection>
      <FormSection number="2" title="תמונות" subtitle="אופציונלי · אפשר להוסיף מאוחר יותר">
        <PhotoUploaderPlaceholder />
      </FormSection>
    </>
  );
};
