import { QnTextarea } from "@/components/form-fields";
import { FormSection } from "../FormSection";

export const InternalNotes = () => (
  <FormSection
    number="07"
    title="הערות פנימיות"
    subtitle="פרטי · רק את רואה את זה"
    tone="accent"
  >
    <QnTextarea
      tone="note"
      placeholder="ההורים גרושים — חשוב לציין לצד השני. מעדיפה בית קפה ולא מסעדה. הומור חשוב לה…"
      minHeight={120}
    />
  </FormSection>
);
