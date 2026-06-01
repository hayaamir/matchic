import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/dal/dashboard/getDashboardStats.dal";

type Props = {
  params: Promise<{ locale: string }>;
};

const DashboardPage = async ({ params }: Props) => {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const stats = await getDashboardStats(session.user.id);

  const totalActive = stats.total;
  const statusData = [
    { label: "ממתינה להצעה", value: stats.byStatus.active,      color: "#C88A8E", soft: "#FAEEED" },
    { label: "בפגישות",       value: stats.byStatus.in_date,     color: "#7C9577", soft: "#EAF0E8" },
    { label: "שידוך נסגר",    value: stats.byStatus.found_match, color: "#8E84A8", soft: "#EEEBF4" },
    { label: "בהפסקה",        value: stats.byStatus.on_hold,     color: "#A89690", soft: "#F2EEEC" },
  ];
  const totalDonut = statusData.reduce((s, d) => s + d.value, 0) || 1;

  const ageRows = Object.entries(stats.ageGroups).map(([range, count]) => ({ range, count }));
  const ageMax = Math.max(...ageRows.map((r) => r.count), 1);

  const barMax = Math.max(...stats.monthlyData.map((d) => d.count), 1);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        padding: "32px 48px 56px",
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
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "var(--mc-accent-deep)", fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>
            סטטיסטיקות · נכון להיום
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: 0,
              color: "var(--mc-ink)",
            }}
          >
            איך זה <span style={{ color: "var(--mc-accent-deep)" }}>הולך</span>
          </h1>
        </div>

        {/* Period toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#FFF",
            border: "1px solid var(--mc-line)",
            borderRadius: 999,
            padding: 4,
          }}
        >
          {["שבוע", "חודש", "רבעון", "שנה"].map((p, i) => (
            <div
              key={i}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: i === 1 ? 600 : 500,
                background: i === 1 ? "var(--mc-accent-soft)" : "transparent",
                color: i === 1 ? "var(--mc-accent-deep)" : "var(--mc-ink-soft)",
                cursor: "pointer",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="משודכים פעילים"
          value={String(totalActive)}
          change={`+${stats.newThisWeek.length} השבוע`}
          trend="up"
          tone="hero"
        />
        <StatCard
          label="בפגישות כרגע"
          value={String(stats.byStatus.in_date)}
          change="מתקדמים יפה"
          trend="up"
        />
        <StatCard
          label="שידוכים נסגרו"
          value={String(stats.byStatus.found_match)}
          change="מאז ההתחלה"
          trend="up"
          tone="tint"
        />
        <StatCard
          label="ממתינים להצעה"
          value={String(stats.byStatus.active)}
          change="מחפשים התאמה"
          trend="neutral"
        />
      </div>

      {/* Charts row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Donut — status distribution */}
        <ChartCard title="התפלגות לפי סטטוס" subtitle="כל המשודכים הפעילים">
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <DonutChart data={statusData} total={totalDonut} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {statusData.map((d, i) => {
                const pct = totalDonut > 0 ? Math.round((d.value / totalDonut) * 100) : 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: "var(--mc-ink-soft)" }}>{d.label}</span>
                    <span style={{ color: "var(--mc-ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.value}</span>
                    <span style={{ color: "var(--mc-ink-muted)", fontVariantNumeric: "tabular-nums", width: 36, textAlign: "left" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>

        {/* Bar — monthly activity */}
        <ChartCard title="פעילות חודשית" subtitle="משודכים שהוזנו · 6 חודשים אחרונים">
          <BarChart data={stats.monthlyData} barMax={barMax} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Age distribution */}
        <ChartCard title="פילוח לפי גיל" subtitle="לפי גיל המשודך/ת">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {ageRows.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--mc-ink-soft)", width: 44, fontVariantNumeric: "tabular-nums" }}>{b.range}</span>
                <div style={{ flex: 1, height: 10, background: "var(--mc-accent-soft)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(b.count / ageMax) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #E8B8BE, #C88A8E)",
                      borderRadius: 999,
                      transition: "width .3s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "var(--mc-ink)", fontWeight: 600, width: 24, fontVariantNumeric: "tabular-nums", textAlign: "left" }}>
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* New this week */}
        <ChartCard title="חדשים השבוע" subtitle={`${stats.newThisWeek.length} משודכים הצטרפו`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {stats.newThisWeek.length === 0 ? (
              <div style={{ color: "var(--mc-ink-muted)", fontSize: 14, textAlign: "center", padding: "16px 0" }}>
                אין חדשים השבוע
              </div>
            ) : (
              stats.newThisWeek.map((c, i) => {
                const TONES = ["rose", "warm", "sand", "dusk"] as const;
                const [gradA, gradB] = {
                  rose: ["#F8DDE0", "#E8B8BE"],
                  warm: ["#F4E8E0", "#E8D2C2"],
                  sand: ["#F0E8DA", "#D8C8AE"],
                  dusk: ["#E0DDE6", "#BFB8C8"],
                }[TONES[i % 4]];
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${gradA}, ${gradB})`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: "var(--mc-ink)", fontWeight: 600 }}>
                        {c.firstName} {c.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--mc-ink-muted)" }}>הצטרף/ה לאחרונה</div>
                    </div>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mc-ink-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ChartCard>

        {/* Summary card */}
        <ChartCard title="סיכום מהיר" subtitle="נכון לרגע זה">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {[
              { label: "סה״כ במערכת",     value: stats.total, highlight: false },
              { label: "ממתינים להצעה",   value: stats.byStatus.active, highlight: true },
              { label: "בתהליך פגישות",   value: stats.byStatus.in_date, highlight: false },
              { label: "שידוכים שנסגרו",  value: stats.byStatus.found_match, highlight: false },
              { label: "בהפסקה זמנית",    value: stats.byStatus.on_hold, highlight: false },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: row.highlight ? "var(--mc-accent-soft)" : "transparent",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                <span style={{ color: "var(--mc-ink)", fontWeight: row.highlight ? 600 : 500 }}>{row.label}</span>
                <span
                  style={{
                    color: row.highlight ? "var(--mc-accent-deep)" : "var(--mc-ink-soft)",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: row.highlight ? 600 : 400,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

/* ── Sub-components ────────────────────────────────────────────────────────── */

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "neutral";
  tone?: "hero" | "tint" | "plain";
};

const StatCard = ({ label, value, change, trend, tone = "plain" }: StatCardProps) => {
  const isHero = tone === "hero";
  const isTint = tone === "tint";

  const bg = isHero
    ? "linear-gradient(140deg, #C88A8E 0%, #A26269 100%)"
    : isTint
    ? "var(--mc-accent-soft)"
    : "#FFFFFF";

  return (
    <div
      style={{
        background: bg,
        border: isHero || isTint ? "none" : "1px solid var(--mc-line)",
        borderRadius: 18,
        padding: 22,
        position: "relative",
        overflow: "hidden",
        boxShadow: isHero ? "0 8px 24px rgba(200,138,142,0.25)" : "none",
      }}
    >
      {isHero && (
        <div
          style={{
            position: "absolute",
            top: -40,
            insetInlineEnd: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          fontSize: 12,
          color: isHero ? "rgba(255,255,255,0.78)" : isTint ? "var(--mc-accent-deep)" : "var(--mc-ink-muted)",
          fontWeight: 600,
          position: "relative",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          marginTop: 8,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          fontVariantNumeric: "tabular-nums",
          color: isHero ? "#FFFFFF" : "var(--mc-ink)",
          position: "relative",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: isHero ? "rgba(255,255,255,0.85)" : isTint ? "var(--mc-accent-deep)" : "var(--mc-ink-soft)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 500,
          position: "relative",
        }}
      >
        {trend === "up" && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isHero ? "#FFF" : "#7C9577"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        )}
        {change}
      </div>
    </div>
  );
};

type ChartCardProps = { title: string; subtitle?: string; children: React.ReactNode };

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => (
  <div
    style={{
      background: "#FFFFFF",
      border: "1px solid var(--mc-line)",
      borderRadius: 18,
      padding: 22,
    }}
  >
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--mc-ink)" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "var(--mc-ink-muted)", marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

type DonutDatum = { label: string; value: number; color: string; soft: string };

const DonutChart = ({ data, total }: { data: DonutDatum[]; total: number }) => {
  const r = 70;
  const cx = 90;
  const cy = 90;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
      <svg width={180} height={180} style={{ transform: "rotate(-90deg)" }}>
        {data.map((d, i) => {
          const pct = total > 0 ? d.value / total : 0;
          const dash = pct * C;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.value > 0 ? d.color : "transparent"}
              strokeWidth={22}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
        {total === 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--mc-line)" strokeWidth={22} />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "var(--mc-ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {total}
        </div>
        <div style={{ fontSize: 11, color: "var(--mc-ink-muted)", marginTop: 4 }}>סה״כ פעילים</div>
      </div>
    </div>
  );
};

type BarDatum = { month: string; count: number };

const BarChart = ({ data, barMax }: { data: BarDatum[]; barMax: number }) => (
  <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 14, padding: "0 4px" }}>
    {data.map((d, i) => {
      const h = barMax > 0 ? Math.max((d.count / barMax) * 160, 4) : 4;
      const isLast = i === data.length - 1;
      return (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontSize: 12,
              color: isLast ? "var(--mc-accent-deep)" : "var(--mc-ink-muted)",
              fontWeight: isLast ? 700 : 500,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {d.count}
          </div>
          <div
            style={{
              width: "100%",
              height: h,
              background: isLast
                ? "linear-gradient(180deg, #C88A8E, #A26269)"
                : "linear-gradient(180deg, var(--mc-accent-tint), #E8B8BE)",
              borderRadius: "10px 10px 4px 4px",
            }}
          />
          <div style={{ fontSize: 12, color: "var(--mc-ink-soft)", fontWeight: isLast ? 600 : 400 }}>{d.month}</div>
        </div>
      );
    })}
  </div>
);

export default DashboardPage;
