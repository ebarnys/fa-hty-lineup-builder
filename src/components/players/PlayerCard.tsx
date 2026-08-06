"use client";

import { Card } from "@/components/ui/Ui";
import { availabilityMeta, footLabel, positionLabel, positionShort } from "@/lib/positions";
import { fullName } from "@/lib/players";
import type { Player } from "@/lib/types";

export function PlayerCard({
  player,
  onEdit,
  onDelete,
}: {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const av = availabilityMeta(player.availability);

  return (
    <Card className="p-4 flex flex-col gap-3 hover:border-gold/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 h-11 w-11 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
          <span className="text-gold font-extrabold">
            {player.number ?? "–"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{fullName(player)}</h3>
            <span
              className={`shrink-0 h-2 w-2 rounded-full ${av.dot}`}
              title={av.label}
            />
          </div>
          <p className="text-xs text-zinc-400 truncate">
            {player.nickname ? `„${player.nickname}" · ` : ""}
            {positionLabel(player.mainPosition)}
            {player.birthYear ? ` · ${player.birthYear}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="px-2 py-0.5 rounded-md bg-gold/15 text-gold border border-gold/25 font-medium">
          {positionShort(player.mainPosition)}
        </span>
        {player.secondaryPositions.map((c) => (
          <span
            key={c}
            className="px-2 py-0.5 rounded-md bg-panel-2 text-zinc-400 border border-line"
          >
            {positionShort(c)}
          </span>
        ))}
        <span className="px-2 py-0.5 rounded-md bg-panel-2 text-zinc-400 border border-line">
          {footLabel(player.foot)} noha
        </span>
        <span className={`px-2 py-0.5 rounded-md border font-medium ${av.badge}`}>
          {av.label}
        </span>
      </div>

      {player.note && (
        <p className="text-xs text-zinc-500 line-clamp-2">{player.note}</p>
      )}

      <div className="flex gap-2 pt-1 mt-auto">
        <button
          onClick={onEdit}
          className="flex-1 text-xs rounded-lg border border-line bg-panel-2 py-1.5 hover:bg-line transition-colors"
        >
          Upravit
        </button>
        <button
          onClick={onDelete}
          className="text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-1.5 hover:bg-red-500/20 transition-colors"
        >
          Smazat
        </button>
      </div>
    </Card>
  );
}
