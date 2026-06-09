type QnSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
};

export const QnSelect = ({
  placeholder,
  options,
  hasError,
  ...props
}: QnSelectProps) => (
  <select
    {...props}
    className="mc-qn-select"
    style={{
      height: 50,
      border: `1.5px solid ${hasError ? "#BF4A4A" : "var(--mc-line)"}`,
      borderRadius: 12,
      padding: "0 16px",
      fontSize: 15,
      fontFamily: "inherit",
      background: "#FFF",
      color: props.value ? "var(--mc-ink)" : "var(--mc-ink-muted)",
      width: "100%",
      boxSizing: "border-box",
      outline: "none",
      cursor: "pointer",
    }}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
