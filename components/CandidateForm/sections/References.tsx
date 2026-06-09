import { Field, Grid, QnInput } from "@/components/form-fields";
import { FormSection } from "../FormSection";

export const References = () => (
  <FormSection
    number="05"
    title="אנשי קשר לבירורים"
    subtitle="אנשים שיודעים על המשודך/ת ואפשר לדבר איתם"
    comingSoon
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            background: "#FFF",
            border: "1.5px solid var(--mc-line)",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--mc-accent-deep)",
              background: "var(--mc-accent-soft)",
              padding: "4px 10px",
              borderRadius: 999,
              display: "inline-block",
              marginBottom: 14,
            }}
          >
            איש קשר {i + 1}
          </div>
          <Grid>
            <Field label="שם מלא">
              <QnInput placeholder="הרב יעקב נסים" />
            </Field>
            <Field label="טלפון">
              <QnInput placeholder="052-1234567" />
            </Field>
          </Grid>
          <div style={{ marginTop: 14 }}>
            <Field
              label="מי הוא/היא?"
              hint="לדוגמה: דוד מצד אבא · רבה של המשפחה · חברת ילדות"
            >
              <QnInput placeholder="רב המשפחה" />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        style={{
          background: "#FFF",
          border: "1.5px dashed var(--mc-accent-tint)",
          color: "var(--mc-accent-deep)",
          borderRadius: 14,
          padding: 16,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--mc-accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        הוסיפי איש קשר נוסף
      </button>
    </div>
  </FormSection>
);
