"use client";

import {
  useState,
  useEffect,
  useActionState,
  startTransition,
  useRef,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { ImageUpload } from "@/components/ui/Imageupload";
import { createCandidateAction } from "@/lib/actions/candidates.actions";
import {
  candidateFormSchema,
  CandidateFormValues,
  CandidateWizardProps,
} from "./types";

// ─── Atoms ────────────────────────────────────────────────────────────────────

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  span?: 1 | 2;
  error?: string;
  children: React.ReactNode;
};

const Field = ({ label, required, hint, span = 1, error, children }: FieldProps) => (
  <div style={{ gridColumn: span === 2 ? "span 2" : "span 1" }}>
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--mc-ink)",
        marginBottom: 8,
      }}
    >
      {label}
      {required && (
        <span style={{ color: "var(--mc-accent)", marginInlineStart: 4 }}>*</span>
      )}
    </label>
    {children}
    {hint && (
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "var(--mc-ink-muted)",
          lineHeight: 1.5,
        }}
      >
        {hint}
      </div>
    )}
    {error && (
      <div style={{ marginTop: 5, fontSize: 12, color: "#BF4A4A" }}>{error}</div>
    )}
  </div>
);

const Grid = ({
  cols = 2,
  children,
}: {
  cols?: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 18,
    }}
  >
    {children}
  </div>
);

type QnInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  suffix?: string;
  suffixAccent?: boolean;
  hasError?: boolean;
};

const QnInput = ({ suffix, suffixAccent, hasError, ...props }: QnInputProps) => (
  <div
    style={{
      background: "#FFF",
      border: `1.5px solid ${hasError ? "#BF4A4A" : "var(--mc-line)"}`,
      borderRadius: 12,
      padding: "0 16px",
      height: 50,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <input
      {...props}
      className="mc-qn-input"
      style={{
        flex: 1,
        border: "none",
        background: "transparent",
        outline: "none",
        fontFamily: "inherit",
        fontSize: 15,
        color: "var(--mc-ink)",
        height: "100%",
        minWidth: 0,
      }}
    />
    {suffix &&
      (suffixAccent ? (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--mc-accent-deep)",
            background: "var(--mc-accent-soft)",
            padding: "4px 10px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {suffix}
        </span>
      ) : (
        <span
          style={{
            fontSize: 13,
            color: "var(--mc-ink-muted)",
            flexShrink: 0,
          }}
        >
          {suffix}
        </span>
      ))}
  </div>
);

type QnSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
};

const QnSelect = ({
  placeholder,
  options,
  hasError,
  ...props
}: QnSelectProps) => (
  <select
    {...props}
    className="mc-qn-select"
    style={{
      height: 50,
      border: `1.5px solid ${hasError ? "#BF4A4A" : "var(--mc-line)"}`,
      borderRadius: 12,
      padding: "0 16px",
      fontSize: 15,
      fontFamily: "inherit",
      background: "#FFF",
      color: props.value ? "var(--mc-ink)" : "var(--mc-ink-muted)",
      width: "100%",
      boxSizing: "border-box",
      outline: "none",
      cursor: "pointer",
    }}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

type QnRadioProps = {
  options: { id: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  hasError?: boolean;
};

const QnRadio = ({ options, value, onChange, hasError }: QnRadioProps) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {options.map((o) => {
      const active = o.id === value;
      return (
        <div
          key={o.id}
          onClick={() => onChange?.(o.id)}
          style={{
            padding: "10px 20px",
            background: active ? "var(--mc-accent-soft)" : "#FFF",
            border: `1.5px solid ${
              hasError && !value
                ? "#BF4A4A"
                : active
                ? "var(--mc-accent)"
                : "var(--mc-line)"
            }`,
            color: active ? "var(--mc-accent-deep)" : "var(--mc-ink)",
            fontWeight: active ? 600 : 500,
            borderRadius: 999,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all .15s",
            userSelect: "none",
          }}
        >
          {o.label}
        </div>
      );
    })}
  </div>
);

type QnTextareaProps = {
  placeholder?: string;
  tone?: "default" | "note";
  minHeight?: number;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const QnTextarea = ({
  placeholder,
  tone = "default",
  minHeight = 96,
  value,
  onChange,
}: QnTextareaProps) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      minHeight,
      padding: 16,
      border:
        tone === "note"
          ? "1.5px dashed var(--mc-accent-tint)"
          : "1.5px solid var(--mc-line)",
      background:
        tone === "note" ? "var(--mc-accent-soft)" : "#FFF",
      borderRadius: 12,
      fontFamily: "inherit",
      fontSize: 14,
      color: "var(--mc-ink)",
      outline: "none",
      resize: "vertical",
      lineHeight: 1.6,
      boxSizing: "border-box",
    }}
  />
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

type SectionTone = "default" | "accent";

type FormSectionProps = {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: SectionTone;
  comingSoon?: boolean;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
};

const FormSection = ({
  number,
  title,
  subtitle,
  children,
  tone = "default",
  comingSoon,
  sectionRef,
}: FormSectionProps) => (
  <div
    ref={sectionRef}
    style={{
      background: tone === "accent" ? "var(--mc-accent-soft)" : "#FFF",
      border:
        tone === "accent"
          ? "1px solid var(--mc-accent-tint)"
          : "1px solid var(--mc-line)",
      borderRadius: 20,
      padding: "28px 32px",
      marginBottom: 20,
    }}
  >
    {/* Section header */}
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "center",
        marginBottom: 22,
        paddingBottom: 18,
        borderBottom:
          tone === "accent"
            ? "1px solid var(--mc-accent-tint)"
            : "1px solid var(--mc-line-soft)",
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background:
            tone === "accent" ? "var(--mc-accent)" : "var(--mc-accent-soft)",
          color:
            tone === "accent" ? "#FFF" : "var(--mc-accent-deep)",
          fontSize: 13,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--mc-ink)",
            }}
          >
            {title}
          </span>
          {comingSoon && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--mc-ink-muted)",
                background: "var(--mc-line-soft)",
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              בקרוב
            </span>
          )}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 13,
              color: "var(--mc-ink-soft)",
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div style={{ opacity: comingSoon ? 0.45 : 1, pointerEvents: comingSoon ? "none" : "auto" }}>
      {children}
    </div>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const GenderOptions = [
  { id: "female", label: "אישה" },
  { id: "male", label: "גבר" },
];

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

// ─── Photo uploader ───────────────────────────────────────────────────────────

const PhotoUploaderPlaceholder = () => (
  <div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      {/* Add tile */}
      <div
        style={{
          aspectRatio: "3/4",
          borderRadius: 12,
          border: "1.5px dashed var(--mc-accent-tint)",
          background: "var(--mc-accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
          cursor: "pointer",
          color: "var(--mc-accent-deep)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--mc-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.4,
            padding: "0 8px",
          }}
        >
          הוסיפי תמונה
          <div
            style={{
              fontWeight: 400,
              fontSize: 10,
              color: "var(--mc-ink-muted)",
              marginTop: 2,
            }}
          >
            גררי או הקליקי
          </div>
        </div>
      </div>
    </div>
    <div
      style={{
        marginTop: 12,
        fontSize: 12,
        color: "var(--mc-ink-muted)",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#7C9577"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span>אפשר להוסיף עד 6 תמונות · גררי כדי לשנות סדר</span>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const CandidateWizard = ({ candidateData }: CandidateWizardProps) => {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [phase, setPhase] = useState<"form" | "photos">("form");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const addAnotherRef = useRef(false);
  const photosRef = useRef<HTMLDivElement | null>(null);

  const [state, dispatch, isPending] = useActionState(
    createCandidateAction,
    null
  );

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      firstName: candidateData?.firstName ?? "",
      lastName: candidateData?.lastName ?? "",
      gender: candidateData?.gender ?? undefined,
      dateOfBirth: candidateData?.dateOfBirth ?? "",
      phone: candidateData?.phone ?? "",
      sector: candidateData?.sector ?? undefined,
      status: candidateData?.status ?? "active",
      idNumber: candidateData?.idNumber ?? "",
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!state) return;
    if (state.success && state.id) {
      if (addAnotherRef.current) {
        addAnotherRef.current = false;
        form.reset();
        toast.success("המשודך/ת נשמר/ה בהצלחה!");
      } else {
        setCandidateId(state.id as string);
        setPhase("photos");
        setTimeout(
          () =>
            photosRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          80
        );
      }
    } else if (state.error) {
      if (typeof state.error === "string") {
        toast.error("שגיאה", { description: state.error });
      } else if (
        typeof state.error === "object" &&
        "idNumber" in state.error
      ) {
        form.setError("idNumber", {
          message: (state.error.idNumber as string[])[0],
        });
      }
    }
  }, [state]);

  const submitForm = (addAnother = false) => {
    addAnotherRef.current = addAnother;
    form.handleSubmit((data) => {
      const fd = new FormData();
      const payload = {
        ...data,
        sector: data.sector ?? "chabad",
        status: data.status ?? "active",
      };
      Object.entries(payload).forEach(([k, v]) =>
        fd.append(k, String(v ?? ""))
      );
      startTransition(() => dispatch(fd));
    })();
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "inherit" }}>

      {/* Page title */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--mc-accent-deep)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          הוספה למשודכים
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--mc-ink)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          משודך/ת חדש/ה
        </h1>
        <p
          style={{
            marginTop: 10,
            color: "var(--mc-ink-soft)",
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 580,
          }}
        >
          מלאי את הפרטים שאת יודעת. שדות שלא ידועים — פשוט דלגי.
          הכל נשמר אוטומטית ואת יכולה לחזור ולערוך בכל רגע.
        </p>
      </div>

      {/* Smart paste banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--mc-accent-soft), var(--mc-bg-alt))",
          border: "1px solid var(--mc-accent-tint)",
          borderRadius: 16,
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--mc-accent-deep)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--mc-ink)",
            }}
          >
            כבר יש לך טקסט על המשודך/ת?
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--mc-ink-soft)",
              marginTop: 2,
            }}
          >
            הדביקי הודעת WhatsApp, פתק או מייל — נמלא לך את השדות אוטומטית.
          </div>
        </div>
        <button
          type="button"
          style={{
            background: "var(--mc-ink)",
            color: "#FFF",
            border: "none",
            borderRadius: 12,
            padding: "11px 18px",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          הדביקי טקסט
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── 01 · Personal basics ─────────────────────────────────────────────── */}
      <FormSection
        number="01"
        title="פרטים אישיים"
        subtitle='הבסיס — שם, גיל, ת"ז'
      >
        <Grid>
          <Field label="שם פרטי" required error={errors.firstName?.message}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <QnInput
                  {...field}
                  placeholder="שירה"
                  hasError={!!errors.firstName}
                />
              )}
            />
          </Field>
          <Field label="שם משפחה" required error={errors.lastName?.message}>
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <QnInput
                  {...field}
                  placeholder="לוי"
                  hasError={!!errors.lastName}
                />
              )}
            />
          </Field>
          <Field label="מין" required span={2} error={errors.gender?.message}>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <QnRadio
                  options={GenderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.gender}
                />
              )}
            />
          </Field>
          <Field
            label="תאריך לידה"
            required
            error={errors.dateOfBirth?.message}
          >
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <QnInput
                  type="date"
                  {...field}
                  hasError={!!errors.dateOfBirth}
                />
              )}
            />
          </Field>
          <Field
            label="תעודת זהות"
            required
            hint="לבדיקת חפיפה עם שדכניות אחרות · נשמר מוצפן"
            error={errors.idNumber?.message}
          >
            <Controller
              control={control}
              name="idNumber"
              render={({ field }) => (
                <QnInput
                  {...field}
                  placeholder="9 ספרות"
                  hasError={!!errors.idNumber}
                />
              )}
            />
          </Field>
        </Grid>
      </FormSection>

      {/* ── 02 · Contact ─────────────────────────────────────────────────────── */}
      <FormSection number="02" title="פרטי קשר" subtitle="איך הכי נוח ליצור קשר">
        <Grid>
          <Field label="טלפון" required error={errors.phone?.message}>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <QnInput
                  type="tel"
                  {...field}
                  placeholder="050-1234567"
                  hasError={!!errors.phone}
                />
              )}
            />
          </Field>
          <Field label="אימייל">
            <QnInput type="email" placeholder="shira@example.com" />
          </Field>
          <Field label="כתובת" span={2} hint="עיר ושכונה">
            <QnInput placeholder="ירושלים, רחביה" />
          </Field>
        </Grid>
      </FormSection>

      {/* ── 03 · Background ──────────────────────────────────────────────────── */}
      <FormSection
        number="03"
        title="רקע ופרטים נוספים"
        subtitle="הקונטקסט שיעזור להציע התאמות"
      >
        <Field label="מגזר" required error={errors.sector?.message}>
          <Controller
            control={control}
            name="sector"
            render={({ field }) => (
              <QnRadio
                options={SectorOptions}
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.sector}
              />
            )}
          />
        </Field>
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
          <Field label="סטטוס" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <QnSelect
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="בחרי"
                  options={StatusOptions}
                  hasError={!!errors.status}
                />
              )}
            />
          </Field>
        </Grid>
      </FormSection>

      {/* ── 04 · Family ──────────────────────────────────────────────────────── */}
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

      {/* ── 05 · References ──────────────────────────────────────────────────── */}
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

      {/* ── 06 · Looking for ─────────────────────────────────────────────────── */}
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

      {/* ── 07 · Internal notes ──────────────────────────────────────────────── */}
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

      {/* ── 08 · Photos ──────────────────────────────────────────────────────── */}
      <FormSection
        number="08"
        title="תמונות"
        subtitle="אופציונלי · אפשר להוסיף מאוחר יותר"
        sectionRef={photosRef}
      >
        {phase === "form" ? (
          <PhotoUploaderPlaceholder />
        ) : (
          <ImageUpload candidateId={candidateId!} />
        )}
      </FormSection>

      {/* ── Fixed footer ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFF",
          borderTop: "1px solid var(--mc-line)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.04)",
          zIndex: 50,
        }}
      >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "16px 56px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: save indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--mc-ink-soft)",
          }}
        >
          {phase === "photos" ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C9577"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>הפרטים נשמרו · עכשיו הוסיפי תמונות</span>
            </>
          ) : (
            <span style={{ color: "var(--mc-ink-muted)" }}>
              הפרטים יישמרו בלחיצה
            </span>
          )}
        </div>

        {/* Right: action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {phase === "form" ? (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={() => submitForm(true)}
                style={{
                  background: "#FFF",
                  border: "1.5px solid var(--mc-line)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "inherit",
                  cursor: isPending ? "not-allowed" : "pointer",
                  color: "var(--mc-ink)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: isPending ? 0.55 : 1,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                שמרי והוסיפי עוד
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => submitForm(false)}
                style={{
                  background: "var(--mc-ink)",
                  color: "#FFF",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 28px",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: isPending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending && (
                  <span
                    className="mc-spin"
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#FFF",
                      borderRadius: "50%",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                )}
                שמרי ופתחי פרופיל
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push(`/${locale}/candidates`)}
              style={{
                background: "var(--mc-ink)",
                color: "#FFF",
                border: "none",
                borderRadius: 12,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              סיימתי
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFF"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
