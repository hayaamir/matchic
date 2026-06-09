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

export const FormSection = ({
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
