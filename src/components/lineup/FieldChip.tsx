"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Jersey } from "./Jersey";
import { positionShort } from "@/lib/positions";
import { fullName } from "@/lib/players";
import { getKit, GK_KIT } from "@/lib/kits";
import type { Player, PositionCode } from "@/lib/types";

/** Kartička hráče na hřišti – dres s číslem + jméno a zkratka pozice. */
export function FieldChip({
  player,
  x,
  y,
  role,
  kitId,
  isCaptain,
  isGoalkeeper,
  draggable = true,
}: {
  player: Player;
  x: number;
  y: number;
  /** Role podle místa na hřišti (pozice rozestavení), ne z profilu hráče. */
  role: PositionCode;
  /** Zvolený dres sestavy. */
  kitId: string;
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

  const kit = isGoalkeeper ? GK_KIT : getKit(kitId);
  const label =
    player.number != null ? String(player.number) : positionShort(role);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center no-touch-action cursor-grab active:cursor-grabbing select-none"
      {...listeners}
      {...attributes}
    >
      <div className="relative">
        <Jersey
          kit={kit}
          number={label}
          className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_3px_4px_rgba(0,0,0,0.4)]"
        />
        {isCaptain && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-ink text-[11px] font-black flex items-center justify-center border border-ink shadow">
            C
          </span>
        )}
      </div>
      <div className="mt-1 px-1.5 py-0.5 rounded bg-ink/85 border border-line/70 text-[9px] sm:text-[10px] font-semibold text-zinc-50 leading-[1.1] max-w-[104px] line-clamp-2 text-center">
        {fullName(player)}
      </div>
      <div className="mt-0.5 text-[9px] text-gold/90 font-medium leading-none">
        {positionShort(role)}
      </div>
    </div>
  );
}
