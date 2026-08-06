import type { Player } from "./types";

/** Celé jméno „Jméno Příjmení". */
export function fullName(p: Player): string {
  return `${p.firstName} ${p.lastName}`.trim() || p.nickname || "Bez jména";
}

/** Krátký popisek pro kartičku na hřišti – přezdívka nebo příjmení. */
export function shortName(p: Player): string {
  return p.nickname.trim() || p.lastName.trim() || p.firstName.trim() || "?";
}

export function playerById(players: Player[], id: string | null): Player | null {
  if (!id) return null;
  return players.find((p) => p.id === id) ?? null;
}
