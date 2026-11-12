import { getFormation } from "./formations";
import { fullName } from "./players";
import type { Lineup, Player } from "./types";

export type WarningLevel = "error" | "warning";

export interface LineupWarning {
  level: WarningLevel;
  message: string;
}

/**
 * Vrátí seznam upozornění pro sestavu. Upozornění nebrání uložení,
 * pouze informují o možných problémech.
 */
export function checkLineup(lineup: Lineup, players: Player[]): LineupWarning[] {
  const warnings: LineupWarning[] = [];
  const byId = new Map(players.map((p) => [p.id, p]));
  const onFieldIds = lineup.onField.map((f) => f.playerId);
  const formation = getFormation(lineup.formationId);

  // Více než 11 hráčů na hřišti.
  if (onFieldIds.length > 11) {
    warnings.push({
      level: "error",
      message: `V sestavě je ${onFieldIds.length} hráčů – maximum je 11.`,
    });
  }

  // Neobsazená pozice (méně hráčů než počítá rozestavení).
  if (onFieldIds.length < formation.slots.length) {
    warnings.push({
      level: "warning",
      message: `Sestava není kompletní – na hřišti je ${onFieldIds.length} z ${formation.slots.length} hráčů.`,
    });
  }

  // Brankář není vybraný.
  if (!lineup.goalkeeperId) {
    warnings.push({ level: "warning", message: "Není vybraný brankář." });
  } else if (!onFieldIds.includes(lineup.goalkeeperId)) {
    warnings.push({
      level: "warning",
      message: "Vybraný brankář není v základní sestavě na hřišti.",
    });
  }

  // Jeden hráč vložený na více místech (na hřišti i na lavičce).
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of [...onFieldIds, ...lineup.bench]) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  for (const id of duplicates) {
    const p = byId.get(id);
    warnings.push({
      level: "error",
      message: `Hráč ${p ? fullName(p) : id} je v sestavě vícekrát.`,
    });
  }

  // Lavička – v soutěži smí být max 7 náhradníků.
  if (lineup.bench.length > 7) {
    warnings.push({
      level: "warning",
      message: `Na lavičce je ${lineup.bench.length} náhradníků – pravidla povolují max 7.`,
    });
  }

  // Plán střídání – max 5 střídajících hráčů.
  const onFieldSet = new Set(onFieldIds);
  const benchSet = new Set(lineup.bench);
  const subs = lineup.subs ?? [];
  if (subs.length > 5) {
    warnings.push({
      level: "warning",
      message: `Naplánováno ${subs.length} střídání – do hry smí jen 5 hráčů z lavičky.`,
    });
  }
  const inSeen = new Set<string>();
  const outSeen = new Set<string>();
  for (const s of subs) {
    const inP = byId.get(s.inId);
    const outP = byId.get(s.outId);
    if (s.inId && !benchSet.has(s.inId)) {
      warnings.push({
        level: "warning",
        message: `${inP ? fullName(inP) : "Hráč"} má jít na hřiště, ale není na lavičce.`,
      });
    }
    if (s.outId && !onFieldSet.has(s.outId)) {
      warnings.push({
        level: "warning",
        message: `${outP ? fullName(outP) : "Hráč"} má jít střídat ven, ale není v základní sestavě.`,
      });
    }
    if (s.inId && inSeen.has(s.inId)) {
      warnings.push({
        level: "warning",
        message: `${inP ? fullName(inP) : "Hráč"} je v plánu střídání dvakrát.`,
      });
    }
    if (s.outId && outSeen.has(s.outId)) {
      warnings.push({
        level: "warning",
        message: `Za ${outP ? fullName(outP) : "hráče"} se střídá vícekrát.`,
      });
    }
    if (s.inId) inSeen.add(s.inId);
    if (s.outId) outSeen.add(s.outId);
  }

  // Nedostupní nebo zranění hráči v základní sestavě.
  for (const id of onFieldIds) {
    const p = byId.get(id);
    if (!p) continue;
    if (p.availability === "injured") {
      warnings.push({
        level: "warning",
        message: `${fullName(p)} je zraněný, ale je v základní sestavě.`,
      });
    } else if (p.availability === "unavailable") {
      warnings.push({
        level: "warning",
        message: `${fullName(p)} je nedostupný, ale je v základní sestavě.`,
      });
    }
  }

  return warnings;
}
