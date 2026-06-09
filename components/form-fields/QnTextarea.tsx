type QnTextareaProps = {
  placeholder?: string;
  tone?: "default" | "note";
  minHeight?: number;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export const QnTextarea = ({
  placeholder,
  tone = "default",
  minHeight = 96,
  value,
  onChange,
}: QnTextareaProps) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      minHeight,
      padding: 16,
      border:
        tone === "note"
          ? "1.5px dashed var(--mc-accent-tint)"
          : "1.5px solid var(--mc-line)",
      background:
        tone === "note" ? "var(--mc-accent-soft)" : "#FFF",
      borderRadius: 12,
      fontFamily: "inherit",
      fontSize: 14,
      color: "var(--mc-ink)",
      outline: "none",
      resize: "vertical",
      lineHeight: 1.6,
      boxSizing: "border-box",
    }}
  />
);
