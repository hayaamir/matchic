type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  span?: 1 | 2;
  error?: string;
  children: React.ReactNode;
};

export const Field = ({ label, required, hint, span = 1, error, children }: FieldProps) => (
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
