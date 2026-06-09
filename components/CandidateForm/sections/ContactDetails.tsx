"use client";

import { useFormContext } from "react-hook-form";

import { Field, Grid, InputFormField, QnInput } from "@/components/form-fields";
import { type CandidateFormValues } from "../types";
import { FormSection } from "../FormSection";

export const ContactDetails = () => {
  const { control } = useFormContext<CandidateFormValues>();

  return (
    <FormSection number="02" title="פרטי קשר" subtitle="איך הכי נוח ליצור קשר">
      <Grid>
        <InputFormField
          control={control}
          name="phone"
          label="טלפון"
          required
          type="tel"
          placeholder="050-1234567"
        />
        <Field label="אימייל">
          <QnInput type="email" placeholder="shira@example.com" />
        </Field>
        <Field label="כתובת" span={2} hint="עיר ושכונה">
          <QnInput placeholder="ירושלים, רחביה" />
        </Field>
      </Grid>
    </FormSection>
  );
};
