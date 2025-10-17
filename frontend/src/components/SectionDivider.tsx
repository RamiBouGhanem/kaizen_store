// src/components/SectionDivider.tsx

export default function SectionDivider({
  height = "3.5rem",
  from = "rgba(56,189,248,0.12)",  // sky-400-ish
  to = "rgba(99,102,241,0.10)",    // indigo-500-ish
  angled = true,
}: {
  height?: string;
  from?: string;
  to?: string;
  angled?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height }}
      aria-hidden
    >
      <div
        className="absolute inset-0 animate-sheen"
        style={{
          background:
            `linear-gradient(90deg, ${from}, ${to})`,
          maskImage: angled
            ? "linear-gradient( to right, transparent 0%, black 10%, black 90%, transparent 100%)"
            : undefined,
          WebkitMaskImage: angled
            ? "linear-gradient( to right, transparent 0%, black 10%, black 90%, transparent 100%)"
            : undefined,
          opacity: 0.9,
        }}
      />
      {/* soft grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
    </div>
  );
}
