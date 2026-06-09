"use client";

import {
  useState,
  useEffect,
  useActionState,
  startTransition,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { createCandidateAction } from "@/lib/actions/candidates.actions";
import {
  candidateFormSchema,
  CandidateFormValues,
  CandidateWizardProps,
} from "./types";
import { SmartPasteBanner } from "./SmartPasteBanner";
import { PersonalDetails } from "./sections/PersonalDetails";
import { ContactDetails } from "./sections/ContactDetails";
import { Background } from "./sections/Background";
import { Family } from "./sections/Family";
import { References } from "./sections/References";
import { LookingFor } from "./sections/LookingFor";
import { InternalNotes } from "./sections/InternalNotes";
import { PhotosSection } from "./sections/PhotosSection";

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
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      startTransition(() => dispatch(fd));
    })();
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "inherit" }}>

      {/* Page title
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
      </div> */}

      {/* <SmartPasteBanner /> */}

      <Form {...form}>
        <PersonalDetails />
        {/* <ContactDetails />
        <Background />
        <Family />
        <References />
        <LookingFor />  */}
        <InternalNotes />
        <PhotosSection phase={phase} candidateId={candidateId} sectionRef={photosRef} /> 
      </Form>

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
