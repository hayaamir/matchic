"use client";

import { useFormContext } from "react-hook-form";

import {
  Field,
  Grid,
  InputFormField,
  QnInput,
  QnRadio,
  QnSelect,
  RadioFormField,
  SelectFormField,
} from "@/components/form-fields";
import { type CandidateFormValues } from "../types";
import { FormSection } from "../FormSection";

const SectorOptions = [
  { id: "dl", label: "דתי לאומי" },
  { id: "lit", label: "ליטאי" },
  { id: "chasid", label: "חסידי" },
  { id: "chabad", label: 'חב"ד' },
  { id: "sephardi", label: "ספרדי" },
  { id: "haredi", label: "חרדי" },
  { id: "other", label: "אחר" },
];

const MaritalStatusOptions = [
  { id: "single", label: "רווק/ה" },
  { id: "divorced", label: "גרוש/ה" },
  { id: "widowed", label: "אלמן/ה" },
];

const StatusOptions = [
  { value: "active", label: "ממתינה להצעה" },
  { value: "in_date", label: "בפגישות" },
  { value: "found_match", label: "שידוך נסגר" },
  { value: "on_hold", label: "בהפסקה" },
];

export const Background = () => {
  const { control } = useFormContext<CandidateFormValues>();

  return (
    <FormSection
      number="03"
      title="רקע ופרטים נוספים"
      subtitle="הקונטקסט שיעזור להציע התאמות"
    >
      <RadioFormField
        control={control}
        name="sector"
        label="מגזר"
        required
        options={SectorOptions}
      />
      <div style={{ height: 18 }} />
      <Grid>
        <Field label="גובה">
          <QnInput placeholder="1.65" suffix="מ׳" />
        </Field>
        <Field label="מצב משפחתי">
          <QnRadio options={MaritalStatusOptions} />
        </Field>
        <Field label="מקצוע">
          <QnInput placeholder="מעצבת גרפית עצמאית" />
        </Field>
        <Field label="לימודים">
          <QnInput placeholder='בצלאל · תואר ראשון' />
        </Field>
        <Field label="עדה">
          <QnSelect
            placeholder="אשכנזי / ספרדי / מעורב"
            options={[
              { value: "ashkenazi", label: "אשכנזי" },
              { value: "sephardi", label: "ספרדי" },
              { value: "mixed", label: "מעורב" },
            ]}
          />
        </Field>
        <Field label="שפות">
          <QnInput placeholder="עברית, אנגלית, צרפתית" />
        </Field>
        <SelectFormField
          control={control}
          name="status"
          label="סטטוס"
          placeholder="בחרי"
          options={StatusOptions}
        />
      </Grid>
    </FormSection>
  );
};
