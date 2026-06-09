export const Grid = ({
  cols = 2,
  children,
}: {
  cols?: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 18,
    }}
  >
    {children}
  </div>
);
