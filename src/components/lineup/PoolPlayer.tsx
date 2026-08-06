"use client";

import { useDraggable } from "@dnd-kit/core";
import { availabilityMeta, positionShort } from "@/lib/positions";
import { fullName } from "@/lib/players";
import type { Player } from "@/lib/types";

/** Přetahovatelná řádka hráče v seznamu (mimo nominaci / náhradníci). */
export function PoolPlayer({
  player,
  from,
}: {
  player: Player;
  from: "pool" | "bench";
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${from}-${player.id}`,
    data: { playerId: player.id, from },
  });
  const av = availabilityMeta(player.availability);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`no-touch-action cursor-grab active:cursor-grabbing select-none flex items-center gap-2.5 rounded-lg border border-line bg-panel-2 px-2.5 py-2 hover:border-gold/40 transition-colors ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="shrink-0 h-8 w-8 rounded-md bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
        {player.number ?? "–"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{fullName(player)}</div>
        <div className="text-[11px] text-zinc-500 truncate">
          {positionShort(player.mainPosition)}
          {player.secondaryPositions.length > 0 &&
            ` · ${player.secondaryPositions.map(positionShort).join(", ")}`}
        </div>
      </div>
      <span
        className={`shrink-0 h-2.5 w-2.5 rounded-full ${av.dot}`}
        title={av.label}
      />
    </div>
  );
}
