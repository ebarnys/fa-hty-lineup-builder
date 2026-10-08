import type { Kit } from "@/lib/kits";

/** Vektorový fotbalový dres s číslem – nahrazuje dřívější kolečko/obdélník.
 *  Barvy se berou z vybraného kitu; brankář má vlastní kit. */
export function Jersey({
  kit,
  number,
  className = "",
  style,
}: {
  kit: Kit;
  /** Text na dresu (číslo pro daný zápas, nebo zkratka pozice). */
  number: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Delší čísla trochu zmenšíme, ať se vejdou do širšího trupu.
  const len = number.length;
  const fontSize = len >= 3 ? 28 : len === 2 ? 34 : 42;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Trup + rukávy – širší, aby se číslo pohodlně vešlo */}
      <path
        d="M28 18 L38 18 Q50 27 62 18 L72 18 L94 30 L84 47 L74 39 L78 92 L22 92 L26 39 L16 47 L6 30 Z"
        fill={kit.body}
        stroke={kit.outline}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* Rukávy odlišeny jemným tmavším podtónem (volitelně stejné jako trup) */}
      {kit.sleeve !== kit.body && (
        <>
          <path d="M72 18 L94 30 L84 47 L74 39 Z" fill={kit.sleeve} />
          <path d="M28 18 L6 30 L16 47 L26 39 Z" fill={kit.sleeve} />
        </>
      )}
      {/* Manžety */}
      <path
        d="M94 30 L84 47"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M6 30 L16 47"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Límec */}
      <path
        d="M38 18 Q50 28 62 18"
        fill="none"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Číslo */}
      <text
        x="50"
        y="61"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={800}
        fill={kit.number}
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {number}
      </text>
    </svg>
  );
}
