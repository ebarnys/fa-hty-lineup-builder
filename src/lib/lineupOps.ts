import { getFormation } from "./formations";
import type {
  FieldPlayer,
  Formation,
  FormationSlot,
  Lineup,
  Player,
  PositionCode,
} from "./types";

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

/**
 * Přiřadí každého hráče na hřišti k nejbližší pozici rozestavení (greedy).
 * Vrací indexy obsazených pozic.
 */
function occupiedSlotIndices(
  slots: FormationSlot[],
  onField: FieldPlayer[]
): Set<number> {
  const assigned = new Set<number>();
  for (const p of onField) {
    let best = -1;
    let bestD = Infinity;
    slots.forEach((s, i) => {
      if (assigned.has(i)) return;
      const d = dist(s.x, s.y, p.x, p.y);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (best >= 0) assigned.add(best);
  }
  return assigned;
}

/** Volné pozice rozestavení (placeholdery), které zatím nemají hráče. */
export function ghostSlots(
  formation: Formation,
  onField: FieldPlayer[]
): FormationSlot[] {
  const occ = occupiedSlotIndices(formation.slots, onField);
  return formation.slots.filter((_, i) => !occ.has(i));
}

/** Nejbližší volná pozice rozestavení k danému bodu. */
export function nearestFreeSlot(
  formation: Formation,
  onField: FieldPlayer[],
  x: number,
  y: number
): FormationSlot | null {
  let best: FormationSlot | null = null;
  let bestD = Infinity;
  for (const g of ghostSlots(formation, onField)) {
    const d = dist(g.x, g.y, x, y);
    if (d < bestD) {
      bestD = d;
      best = g;
    }
  }
  return best;
}

/**
 * Role odpovídající místu na hřišti – nejbližší pozice rozestavení k danému
 * bodu. Kartička hráče se řídí touto rolí, ne pozicí z jeho profilu.
 */
export function slotRoleAt(
  formation: Formation,
  x: number,
  y: number
): PositionCode {
  let best = formation.slots[0];
  let bestD = Infinity;
  for (const s of formation.slots) {
    const d = dist(s.x, s.y, x, y);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best.role;
}

/**
 * Změní rozestavení a pokusí se zachovat již vložené hráče –
 * pouze jim přiřadí nové přednastavené pozice.
 */
export function applyFormation(lineup: Lineup, formationId: string): Lineup {
  const formation = getFormation(formationId);
  const onField: FieldPlayer[] = lineup.onField.map((f, i) => {
    const slot = formation.slots[i];
    return slot ? { playerId: f.playerId, x: slot.x, y: slot.y } : f;
  });
  return { ...lineup, formationId, onField };
}

/**
 * Doplní volné pozice rozestavení nejvhodnějšími dostupnými hráči.
 * Hráči se nejprve přiřazují podle hlavní pozice, poté podle vedlejší.
 */
export function autoFill(lineup: Lineup, players: Player[]): Lineup {
  const formation = getFormation(lineup.formationId);
  const used = new Set([
    ...lineup.onField.map((f) => f.playerId),
    ...lineup.bench,
  ]);

  const pool = players.filter(
    (p) =>
      !used.has(p.id) &&
      p.availability !== "unavailable" &&
      p.availability !== "injured"
  );

  const onField = [...lineup.onField];
  let goalkeeperId = lineup.goalkeeperId;

  for (let i = onField.length; i < formation.slots.length; i++) {
    const slot = formation.slots[i];
    // 1) přesná shoda hlavní pozice, 2) vedlejší pozice, 3) kdokoliv
    let idx = pool.findIndex((p) => p.mainPosition === slot.role);
    if (idx === -1)
      idx = pool.findIndex((p) => p.secondaryPositions.includes(slot.role));
    if (idx === -1) idx = 0;
    if (idx < 0 || pool.length === 0) break;

    const [picked] = pool.splice(idx, 1);
    onField.push({ playerId: picked.id, x: slot.x, y: slot.y });
    if (slot.role === "GK" && !goalkeeperId) goalkeeperId = picked.id;
  }

  return { ...lineup, onField, goalkeeperId };
}

/** Umístí / přesune hráče na hřiště na dané souřadnice (max. 11 hráčů). */
export function placeOnField(
  lineup: Lineup,
  playerId: string,
  x: number,
  y: number
): Lineup {
  const already = lineup.onField.some((f) => f.playerId === playerId);
  if (!already && lineup.onField.length >= 11) return lineup; // tvrdý limit 11

  const onField = already
    ? lineup.onField.map((f) => (f.playerId === playerId ? { ...f, x, y } : f))
    : [...lineup.onField, { playerId, x, y }];

  return {
    ...lineup,
    onField,
    bench: lineup.bench.filter((b) => b !== playerId),
  };
}

/** Přesune hráče mezi náhradníky. */
export function moveToBench(lineup: Lineup, playerId: string): Lineup {
  return {
    ...lineup,
    onField: lineup.onField.filter((f) => f.playerId !== playerId),
    bench: lineup.bench.includes(playerId)
      ? lineup.bench
      : [...lineup.bench, playerId],
  };
}

/** Vyřadí hráče ze sestavy (zpět mezi „mimo nominaci"). */
export function removeFromLineup(lineup: Lineup, playerId: string): Lineup {
  return {
    ...lineup,
    onField: lineup.onField.filter((f) => f.playerId !== playerId),
    bench: lineup.bench.filter((b) => b !== playerId),
    captainId: lineup.captainId === playerId ? null : lineup.captainId,
    goalkeeperId:
      lineup.goalkeeperId === playerId ? null : lineup.goalkeeperId,
  };
}

/**
 * Odstraní ze sestavy odkazy na hráče, kteří už neexistují (např. po smazání
 * hráče nebo importu jiných dat). Vrací stejný objekt, pokud není co čistit.
 */
export function pruneLineup(lineup: Lineup, players: Player[]): Lineup {
  const ids = new Set(players.map((p) => p.id));
  const onField = lineup.onField.filter((f) => ids.has(f.playerId));
  const bench = lineup.bench.filter((b) => ids.has(b));
  const captainId =
    lineup.captainId && ids.has(lineup.captainId) ? lineup.captainId : null;
  const goalkeeperId =
    lineup.goalkeeperId && ids.has(lineup.goalkeeperId)
      ? lineup.goalkeeperId
      : null;

  const unchanged =
    onField.length === lineup.onField.length &&
    bench.length === lineup.bench.length &&
    captainId === lineup.captainId &&
    goalkeeperId === lineup.goalkeeperId;

  return unchanged
    ? lineup
    : { ...lineup, onField, bench, captainId, goalkeeperId };
}
