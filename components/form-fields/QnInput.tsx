type QnInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  suffix?: string;
  suffixAccent?: boolean;
  hasError?: boolean;
};

export const QnInput = ({ suffix, suffixAccent, hasError, ...props }: QnInputProps) => (
  <div
    className="mc-qn-input-wrapper"
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
