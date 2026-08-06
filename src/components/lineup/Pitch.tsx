"use client";

import { useDroppable } from "@dnd-kit/core";
import { FieldChip } from "./FieldChip";
import { getFormation } from "@/lib/formations";
import { ghostSlots, slotRoleAt } from "@/lib/lineupOps";
import { playerById } from "@/lib/players";
import { positionShort } from "@/lib/positions";
import type { FieldPlayer, FormationSlot, Lineup, Player } from "@/lib/types";

/** Grafické fotbalové hřiště se stopkami hráčů umístěnými na volných pozicích. */
export function Pitch({
  lineup,
  players,
  interactive = true,
  dragging = false,
}: {
  lineup: Lineup;
  players: Player[];
  interactive?: boolean;
  /** Zvýrazní volné pozice, když právě probíhá přetahování. */
  dragging?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "pitch",
    data: { zone: "pitch" },
    disabled: !interactive,
  });

  // Placeholdery volných pozic aktuálního rozestavení (jen v editoru).
  // Počítáme jen z reálně existujících hráčů, aby „duchové" po smazání hráče
  // neblokovali zobrazení volných pozic.
  const formation = getFormation(lineup.formationId);
  const validOnField = lineup.onField.filter((f) =>
    players.some((p) => p.id === f.playerId)
  );
  const ghosts = interactive ? ghostSlots(formation, validOnField) : [];

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden border-2 transition-colors ${
        isOver ? "border-gold" : "border-line"
      }`}
      style={{
        background:
          "repeating-linear-gradient(180deg,#15803d 0,#15803d 8%,#166534 8%,#166534 16%)",
      }}
    >
      {/* Čáry hřiště */}
      <FieldLines />

      {/* Prázdné pozice rozestavení */}
      {ghosts.map((slot, i) => (
        <GhostSlot key={`ghost-${i}`} slot={slot} active={dragging} />
      ))}

      {/* Hráči */}
      {lineup.onField.map((f: FieldPlayer) => {
        const player = playerById(players, f.playerId);
        if (!player) return null;
        return (
          <FieldChip
            key={f.playerId}
            player={player}
            x={f.x}
            y={f.y}
            role={slotRoleAt(formation, f.x, f.y)}
            isCaptain={lineup.captainId === f.playerId}
            isGoalkeeper={lineup.goalkeeperId === f.playerId}
            draggable={interactive}
          />
        );
      })}
    </div>
  );
}

/** Placeholder volné pozice – obrys dresu se zkratkou pozice. */
function GhostSlot({ slot, active }: { slot: FormationSlot; active: boolean }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <div
        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${
          active
            ? "border-gold bg-gold/15 text-gold animate-pulse"
            : "border-white/45 bg-white/5 text-white/70"
        }`}
      >
        <JerseyIcon className="h-6 w-6 sm:h-7 sm:w-7 opacity-80" />
      </div>
      <div
        className={`mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold leading-none ${
          active ? "bg-gold/20 text-gold" : "bg-black/40 text-white/70"
        }`}
      >
        {positionShort(slot.role)}
      </div>
    </div>
  );
}

/** Jednoduchý obrys dresu. */
function JerseyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 3 L4 6 L6 9 L8 8 V21 H16 V8 L18 9 L20 6 L16 3 C15 4.5 13.5 5.2 12 5.2 C10.5 5.2 9 4.5 8 3 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Statické vykreslení čar hřiště (SVG). */
function FieldLines() {
  return (
    <svg
      viewBox="0 0 100 130"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full pointer-events-none"
    >
      <g
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.4"
        vectorEffect="non-scaling-stroke"
      >
        {/* Obvod */}
        <rect x="3" y="3" width="94" height="124" />
        {/* Půlící čára */}
        <line x1="3" y1="65" x2="97" y2="65" />
        <circle cx="50" cy="65" r="9" />
        <circle cx="50" cy="65" r="0.8" fill="rgba(255,255,255,0.55)" />
        {/* Dolní (naše) branka */}
        <rect x="28" y="110" width="44" height="17" />
        <rect x="40" y="122" width="20" height="5" />
        <circle cx="50" cy="105" r="0.8" fill="rgba(255,255,255,0.55)" />
        {/* Horní (soupeřova) branka */}
        <rect x="28" y="3" width="44" height="17" />
        <rect x="40" y="3" width="20" height="5" />
        <circle cx="50" cy="25" r="0.8" fill="rgba(255,255,255,0.55)" />
      </g>
    </svg>
  );
}
