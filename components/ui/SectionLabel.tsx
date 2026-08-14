interface SectionLabelProps {
  index: string;
  name: string;
  light?: boolean;
}

export default function SectionLabel({
  index,
  name,
  light,
}: SectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "48px",
      }}
    >
      <span
        className="label"
        style={{ color: light ? "var(--text-secondary)" : "var(--text-label)" }}
      >
        {index}
      </span>
      <div
        style={{
          width: "24px",
          height: "1px",
          background: "var(--divider-strong)",
        }}
      />
      <span
        className="label"
        style={{ color: light ? "var(--text-secondary)" : "var(--text-label)" }}
      >
        {name}
      </span>
    </div>
  );
}
