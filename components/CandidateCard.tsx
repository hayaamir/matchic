"use client";

import { CandidateStatus } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";

type CandidateCardProps = {
  id: string;
  img?: string;
  status: CandidateStatus;
  fullName: string;
  sector?: string;
  dateOfBirth?: string;
  createdAt?: Date | string;
  tone?: "rose" | "warm" | "sand" | "moss" | "dusk" | "sky" | "blush";
};

const STATUS_CONFIG: Record<CandidateStatus, { label: string; color: string }> = {
  active:      { label: "ממתינה להצעה", color: "#C88A8E" },
  in_date:     { label: "בפגישות",       color: "#7C9577" },
  found_match: { label: "שידוך נסגר",    color: "#8E84A8" },
  on_hold:     { label: "בהפסקה",        color: "#A89690" },
};

const PORTRAIT_TONES: Record<string, [string, string]> = {
  rose:  ["#F8DDE0", "#E8B8BE"],
  warm:  ["#F4E8E0", "#E8D2C2"],
  sand:  ["#F0E8DA", "#D8C8AE"],
  moss:  ["#DDE2D2", "#B8C0A4"],
  dusk:  ["#E0DDE6", "#BFB8C8"],
  sky:   ["#DDE5EA", "#B4C0CA"],
  blush: ["#FBF1F0", "#F0D9D7"],
};

const calcAge = (dob?: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const relativeTime = (date?: Date | string): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "היום";
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "לפני שבוע";
  if (weeks < 4) return `לפני ${weeks} שבועות`;
  const months = Math.floor(days / 30);
  if (months === 1) return "לפני חודש";
  return `לפני ${months} חודשים`;
};

export const CandidateCard = ({
  id,
  img,
  status,
  fullName,
  sector,
  dateOfBirth,
  createdAt,
  tone = "blush",
}: CandidateCardProps) => {
  const { locale } = useParams<{ locale: string }>();
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const age = calcAge(dateOfBirth);
  const added = relativeTime(createdAt);
  const [gradA, gradB] = PORTRAIT_TONES[tone] ?? PORTRAIT_TONES.blush;

  return (
    <Link
      href={`/${locale}/candidates/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="mc-card-lift shelf-card"
        style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 12 }}
      >
        {/* Portrait — 3:4 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: 14,
            overflow: "hidden",
            background: `linear-gradient(160deg, ${gradA} 0%, ${gradB} 100%)`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {img ? (
            <img
              src={img}
              alt={fullName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
            />
          ) : (
            <svg
              width="42%"
              height="auto"
              viewBox="0 0 100 130"
              style={{
                position: "absolute",
                bottom: "-2%",
                left: "29%",
                opacity: 0.2,
              }}
            >
              <circle cx="50" cy="36" r="20" fill="white" />
              <path d="M10 130 Q10 70 50 70 Q90 70 90 130 Z" fill="white" />
            </svg>
          )}

          {/* Heart button — top-right */}
          <button
            className="heart-btn"
            onClick={(e) => e.preventDefault()}
            style={{
              position: "absolute",
              top: 10,
              insetInlineStart: 10,
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(6px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--mc-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Status pill — bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              insetInlineEnd: 10,
              background: "#FFF",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500,
              color: "var(--mc-ink)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              border: "1px solid var(--mc-line)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
              }}
            />
            {s.label}
          </div>
        </div>

        {/* Info below image */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--mc-ink)",
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fullName}
            </div>
            {age !== null && (
              <div
                style={{
                  fontSize: 14,
                  color: "var(--mc-ink)",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 500,
                  flexShrink: 0,
                  marginInlineStart: 4,
                }}
              >
                {age}
              </div>
            )}
          </div>
          {sector && (
            <div
              style={{
                fontSize: 13,
                color: "var(--mc-ink-soft)",
                marginTop: 2,
                lineHeight: 1.5,
              }}
            >
              {sector}
            </div>
          )}
          {added && (
            <div
              style={{
                fontSize: 12,
                color: "var(--mc-ink-muted)",
                marginTop: 6,
              }}
            >
              נוסף {added}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
