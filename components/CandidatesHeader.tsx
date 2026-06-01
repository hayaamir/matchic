"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  totalCount: number;
  activeGenderCount?: { female: number; male: number };
};

export const CandidatesHeader = ({
  totalCount,
  activeGenderCount,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeGender = searchParams.get("gender") as "male" | "female" | null;
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const femaleCount = activeGenderCount?.female ?? Math.round(totalCount * 0.6);
  const maleCount = activeGenderCount?.male ?? totalCount - femaleCount;

  const setGender = (gender: "male" | "female") => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeGender === gender) {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const displayCount = activeGender === "male" ? maleCount : activeGender === "female" ? femaleCount : totalCount;
  const genderLabel = activeGender === "male" ? "משודכים" : "משודכות";

  return (
    <div>
      {/* Search pill */}
      <div
        style={{
          background: "#FFF",
          border: "1px solid var(--mc-line)",
          borderRadius: 999,
          padding: 6,
          display: "flex",
          alignItems: "center",
          gap: 4,
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Gender toggle */}
        <div style={{ display: "flex", padding: 2, gap: 2, flexShrink: 0 }}>
          {(
            [
              { id: "female" as const, label: "נשים", count: femaleCount },
              { id: "male" as const, label: "גברים", count: maleCount },
            ] as const
          ).map((t) => {
            const active = activeGender === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setGender(t.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  background: active ? "var(--mc-ink)" : "transparent",
                  color: active ? "#FFF" : "var(--mc-ink-soft)",
                  border: "none",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all .15s",
                }}
              >
                {t.label}
                <span
                  style={{
                    fontSize: 11,
                    background: active
                      ? "rgba(255,255,255,0.18)"
                      : "var(--mc-bg-alt)",
                    color: active ? "#FFF" : "var(--mc-ink-muted)",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontWeight: 500,
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 28,
            background: "var(--mc-line)",
            margin: "0 8px",
            flexShrink: 0,
          }}
        />

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 14px",
            minWidth: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--mc-ink-muted)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          <input
            placeholder='חיפוש לפי שם, עיר, ת"ז…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontFamily: "inherit",
              fontSize: 14,
              color: "var(--mc-ink)",
              height: 40,
              minWidth: 0,
            }}
          />
        </form>

        {/* Filter pills */}
        {[
          { label: "ממתינה להצעה", active: true },
          { label: "גיל 22-30" },
          { label: "כל המגזרים" },
          { label: "כל האזורים" },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: p.active ? 600 : 500,
              color: p.active ? "var(--mc-accent-deep)" : "var(--mc-ink-soft)",
              background: p.active ? "var(--mc-accent-soft)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: p.active
                ? "1px solid var(--mc-accent-tint)"
                : "1px solid transparent",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {p.label}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        ))}

        {/* Advanced filter */}
        <button
          style={{
            background: "var(--mc-accent)",
            color: "#FFF",
            border: "none",
            borderRadius: 999,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginInlineEnd: 2,
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          סינון מתקדם
        </button>
      </div>

      {/* Result row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 28,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 14, color: "var(--mc-ink-soft)" }}>
          <b style={{ color: "var(--mc-ink)", fontWeight: 600 }}>
            {displayCount} {genderLabel}
          </b>
          {" · "}
          {activeGender ? `מסוננ${activeGender === "female" ? "ות" : "ים"} לפי מגדר` : "כל המשודכים"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: "var(--mc-ink-soft)",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          מיון:&nbsp;
          <b style={{ color: "var(--mc-ink)", fontWeight: 600 }}>הכי חדשות</b>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--mc-ink-soft)"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
