import { Field, Grid, QnInput, QnRadio, QnTextarea } from "@/components/form-fields";
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

export const LookingFor = () => (
  <FormSection
    number="06"
    title="מה מחפש/ת"
    subtitle="מה היא או הוא מחפש/ת בבן/ת הזוג"
    comingSoon
  >
    <Grid>
      <Field label="טווח גיל">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <QnInput placeholder="26" />
          <span style={{ color: "var(--mc-ink-muted)", flexShrink: 0 }}>—</span>
          <QnInput placeholder="32" />
        </div>
      </Field>
      <Field label="גובה מינימלי">
        <QnInput placeholder="1.72" suffix="מ׳" />
      </Field>
    </Grid>
    <div style={{ height: 18 }} />
    <Field label="מגזרים פתוחים אליהם">
      <QnRadio options={SectorOptions} />
    </Field>
    <div style={{ height: 18 }} />
    <Field
      label="תיאור חופשי"
      hint="מה הכי חשוב? סגנון חיים, ערכים, נקודות אסור לפספס"
    >
      <QnTextarea placeholder="בחור רציני עם דרך ארץ, רקע תורני ומקצוע יציב…" />
    </Field>
  </FormSection>
);
