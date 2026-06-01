import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCandidates } from "@/lib/dal/candidates/getCandidates.dal";
import { CandidatesSection } from "@/components/CandidatesSection";
import { CandidatesHeader } from "@/components/CandidatesHeader";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ gender?: string; q?: string }>;
};

const CandidatesPage = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const { gender } = await searchParams;
  const validGender =
    gender === "male" || gender === "female" ? gender : undefined;

  const { page } = await getCandidates(session.user.id, {
    gender: validGender,
    limit: 100,
  });

  // Always get totals per gender for the header counts
  const { page: allCandidates } = await getCandidates(session.user.id, {
    limit: 1000,
  });

  const firstName = session.user.name?.split(" ")[0] ?? "שלום";
  const totalCount = page.length;
  const inDateCount = allCandidates.filter((c) => c.status === "in_date").length;
  const femaleCount = allCandidates.filter((c) => c.gender === "female").length;
  const maleCount = allCandidates.filter((c) => c.gender === "male").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF",
        padding: "32px 56px 56px",
        direction: "rtl",
        fontFamily: "var(--font-heebo, 'Heebo', sans-serif)",
        color: "var(--mc-ink)",
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 28,
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "var(--mc-accent-deep)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}
          >
            המשודכים שלך · {allCandidates.length} פעילים
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: 0,
              color: "var(--mc-ink)",
            }}
          >
            ברוכה השבה, {firstName}
          </h1>
          {inDateCount > 0 && (
            <div
              style={{
                marginTop: 8,
                color: "var(--mc-ink-soft)",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              היום יש לך{" "}
              <b style={{ color: "var(--mc-ink)", fontWeight: 600 }}>
                {inDateCount} בירורים פתוחים
              </b>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href={`/${locale}/questionnaire`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--mc-ink)",
              border: "1px solid var(--mc-line)",
              borderRadius: 12,
              background: "#FFF",
              textDecoration: "none",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--mc-ink-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            לינק לשאלון
          </Link>
          <Link
            href={`/${locale}/questionnaire`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "#FFF",
              background: "var(--mc-ink)",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            משודך חדש
          </Link>
        </div>
      </div>

      {/* Search + filter bar */}
      <CandidatesHeader
        totalCount={totalCount}
        activeGenderCount={{ female: femaleCount, male: maleCount }}
      />

      {/* Grid */}
      {page.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--mc-ink-soft)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--mc-accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--mc-accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--mc-ink)",
              marginBottom: 8,
            }}
          >
            אין משודכים עדיין
          </div>
          <div style={{ fontSize: 15, color: "var(--mc-ink-soft)" }}>
            לחצי על &quot;משודך חדש&quot; כדי להוסיף את הראשון
          </div>
        </div>
      ) : (
        <CandidatesSection candidates={page} />
      )}
    </div>
  );
};

export default CandidatesPage;
