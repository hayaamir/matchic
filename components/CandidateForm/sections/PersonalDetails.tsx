"use client";

import { useFormContext } from "react-hook-form";

import { Grid, InputFormField, RadioFormField } from "@/components/form-fields";
import { type CandidateFormValues } from "../types";
import { FormSection } from "../FormSection";

const GenderOptions = [
  { id: "female", label: "אישה" },
  { id: "male", label: "גבר" },
];

export const PersonalDetails = () => {
  const { control } = useFormContext<CandidateFormValues>();

  return (
    <FormSection number="01" title="פרטים אישיים" subtitle='הבסיס — שם, גיל, ת"ז'>
      <Grid>
        <InputFormField
          control={control}
          name="firstName"
          label="שם פרטי"
          required
          placeholder="שירה"
        />
        <InputFormField
          control={control}
          name="lastName"
          label="שם משפחה"
          required
          placeholder="לוי"
        />
        {/* <RadioFormField
          control={control}
          name="gender"
          label="מין"
          required
          span={2}
          options={GenderOptions}
        /> */}
        {/* <InputFormField
          control={control}
          name="dateOfBirth"
          label="תאריך לידה"
          required
          type="date"
        /> */}
        {/* <InputFormField
          control={control}
          name="idNumber"
          label="תעודת זהות"
          required
          hint="לבדיקת חפיפה עם שדכניות אחרות · נשמר מוצפן"
          placeholder="9 ספרות"
        /> */}
      </Grid>
    </FormSection>
  );
};
