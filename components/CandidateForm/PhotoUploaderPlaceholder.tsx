export const PhotoUploaderPlaceholder = () => (
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
