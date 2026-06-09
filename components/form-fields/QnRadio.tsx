type QnRadioProps = {
  options: { id: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  hasError?: boolean;
};

export const QnRadio = ({ options, value, onChange, hasError }: QnRadioProps) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {options.map((o) => {
      const active = o.id === value;
      return (
        <div
          key={o.id}
          onClick={() => onChange?.(o.id)}
          style={{
            padding: "10px 20px",
            background: active ? "var(--mc-accent-soft)" : "#FFF",
            border: `1.5px solid ${
              hasError && !value
                ? "#BF4A4A"
                : active
                ? "var(--mc-accent)"
                : "var(--mc-line)"
            }`,
            color: active ? "var(--mc-accent-deep)" : "var(--mc-ink)",
            fontWeight: active ? 600 : 500,
            borderRadius: 999,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all .15s",
            userSelect: "none",
          }}
        >
          {o.label}
        </div>
      );
    })}
  </div>
);
