export const SmartPasteBanner = () => (
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
);
