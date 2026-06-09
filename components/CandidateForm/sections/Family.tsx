import { Field, Grid, QnInput } from "@/components/form-fields";
import { FormSection } from "../FormSection";

export const Family = () => (
  <FormSection
    number="04"
    title="משפחה"
    subtitle="פרטי ההורים והאחים"
    comingSoon
  >
    <Grid>
      <Field label="שם האב">
        <QnInput placeholder='ד"ר רפאל לוי' />
      </Field>
      <Field label="עיסוק האב">
        <QnInput placeholder="רופא משפחה" />
      </Field>
      <Field label="שם האם">
        <QnInput placeholder="חני לוי" />
      </Field>
      <Field label="עיסוק האם">
        <QnInput placeholder="גננת" />
      </Field>
      <Field
        label="אחים ואחיות"
        span={2}
        hint="לדוגמה: 3 · שני אחים גדולים נשואים, אחות קטנה"
      >
        <QnInput placeholder="מספר ופרטים קצרים" />
      </Field>
    </Grid>
  </FormSection>
);
