"use client";

import { Logo } from "@/components/Logo";
import { getFormation } from "@/lib/formations";
import type { Lineup } from "@/lib/types";

/** Hlavička hrací plochy – zobrazuje se i v exportovaném obrázku. */
export function BoardHeader({ lineup }: { lineup: Lineup }) {
  const formation = getFormation(lineup.formationId);
  const dateStr = formatMatchDate(lineup.matchDate, lineup.matchTime);

  return (
    <div className="flex items-center justify-between gap-3">
      <Logo size={34} />
      <div className="text-right">
        <div className="text-sm font-bold text-zinc-50">
          {lineup.opponent
            ? `${lineup.isHome ? "" : "@ "}vs ${lineup.opponent}`
            : lineup.name}
        </div>
        <div className="text-[11px] text-zinc-400">
          {[dateStr, `Rozestavení ${formation.name}`]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>
    </div>
  );
}

function formatMatchDate(date: string, time: string): string {
  if (!date) return "";
  try {
    const d = new Date(`${date}T${time || "00:00"}`);
    const datePart = d.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    return time ? `${datePart} ${time}` : datePart;
  } catch {
    return date;
  }
}
