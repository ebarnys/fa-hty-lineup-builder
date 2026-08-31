"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { positionShort } from "@/lib/positions";
import { fullName } from "@/lib/players";
import type { Player, PositionCode } from "@/lib/types";

/** Kartička hráče na hřišti – kolečko s číslem + jméno a zkratka pozice. */
export function FieldChip({
  player,
  x,
  y,
  role,
  isCaptain,
  isGoalkeeper,
  draggable = true,
}: {
  player: Player;
  x: number;
  y: number;
  /** Role podle místa na hřišti (pozice rozestavení), ne z profilu hráče. */
  role: PositionCode;
  isCaptain: boolean;
  isGoalkeeper: boolean;
  draggable?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `field-${player.id}`,
      data: { playerId: player.id, from: "field" },
      disabled: !draggable,
    });

  const style: React.CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 10,
  };

  const ring = isGoalkeeper
    ? "border-emerald-400 bg-emerald-500"
    : "border-gold bg-gradient-to-b from-gold to-gold-soft";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center no-touch-action cursor-grab active:cursor-grabbing select-none"
      {...listeners}
      {...attributes}
    >
      <div className="relative">
        <div
          className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 ${ring} text-ink font-extrabold flex items-center justify-center shadow-lg shadow-black/40`}
        >
          <span className="text-base sm:text-lg leading-none">
            {player.number ?? positionShort(role)}
          </span>
        </div>
        {isCaptain && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-white text-ink text-[11px] font-black flex items-center justify-center border border-ink shadow">
            C
          </span>
        )}
      </div>
      <div className="mt-1 px-1.5 py-0.5 rounded bg-ink/85 border border-line/70 text-[9px] sm:text-[10px] font-semibold text-zinc-50 leading-[1.1] max-w-[104px] line-clamp-2 text-center shadow">
        {fullName(player)}
      </div>
      <div className="mt-0.5 text-[9px] text-gold/90 font-medium leading-none">
        {positionShort(role)}
      </div>
    </div>
  );
}
