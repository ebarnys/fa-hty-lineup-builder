/** Jednoduché klubové logo FA Horšovský Týn (znak + název). */
export function Logo({
  size = 36,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M24 2 L44 9 V24 C44 36 35 44 24 47 C13 44 4 36 4 24 V9 Z"
          fill="#0a0a0b"
          stroke="#f5c518"
          strokeWidth="2.5"
        />
        <path
          d="M24 12 L28.5 21 L38 22 L31 29 L33 39 L24 34 L15 39 L17 29 L10 22 L19.5 21 Z"
          fill="#f5c518"
        />
      </svg>
      {showText && (
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-wide text-zinc-50">
            FA HORŠOVSKÝ TÝN
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gold-soft">
            Lineup Builder
          </div>
        </div>
      )}
    </div>
  );
}
