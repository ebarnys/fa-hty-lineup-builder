"use client";

import type { LineupWarning } from "@/lib/validation";

/** Zobrazí kontrolní upozornění k sestavě (nebrání uložení). */
export function WarningsPanel({ warnings }: { warnings: LineupWarning[] }) {
  if (warnings.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-300 flex items-center gap-2">
        <Dot className="text-emerald-400" />
        Sestava je v pořádku, žádná upozornění.
      </div>
    );
  }

  const errors = warnings.filter((w) => w.level === "error");
  const warns = warnings.filter((w) => w.level === "warning");

  return (
    <div className="rounded-xl border border-line bg-panel/70 p-3.5">
      <h3 className="text-sm font-semibold mb-2">
        Kontroly{" "}
        <span className="text-zinc-500 font-normal">
          ({warnings.length})
        </span>
      </h3>
      <ul className="space-y-1.5">
        {errors.map((w, i) => (
          <li
            key={`e${i}`}
            className="flex items-start gap-2 text-sm text-red-300"
          >
            <Dot className="text-red-400 mt-1.5" />
            {w.message}
          </li>
        ))}
        {warns.map((w, i) => (
          <li
            key={`w${i}`}
            className="flex items-start gap-2 text-sm text-amber-300"
          >
            <Dot className="text-amber-400 mt-1.5" />
            {w.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`shrink-0 h-1.5 w-1.5 rounded-full bg-current ${className}`}
    />
  );
}
