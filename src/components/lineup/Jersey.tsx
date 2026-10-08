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
  // Delší čísla trochu zmenšíme, ať se vejdou.
  const len = number.length;
  const fontSize = len >= 3 ? 30 : len === 2 ? 38 : 42;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Trup + rukávy */}
      <path
        d="M30 19 L40 19 Q50 28 60 19 L70 19 L92 33 L82 49 L70 41 L72 93 L28 93 L30 41 L18 49 L8 33 Z"
        fill={kit.body}
        stroke={kit.outline}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* Rukávy odlišeny jemným tmavším podtónem (volitelně stejné jako trup) */}
      {kit.sleeve !== kit.body && (
        <>
          <path d="M70 19 L92 33 L82 49 L70 41 Z" fill={kit.sleeve} />
          <path d="M30 19 L8 33 L18 49 L30 41 Z" fill={kit.sleeve} />
        </>
      )}
      {/* Manžety */}
      <path
        d="M92 33 L82 49"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M8 33 L18 49"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Límec */}
      <path
        d="M40 19 Q50 29 60 19"
        fill="none"
        stroke={kit.trim}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Číslo */}
      <text
        x="50"
        y="63"
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
