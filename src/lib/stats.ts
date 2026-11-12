import type { MatchAppearance, MatchRecord, Player } from "./types";

/** Sezónní statistika jednoho hráče. */
export interface PlayerStats {
  apps: number; // počet zápasů, kdy nastoupil
  starts: number; // v základní sestavě
  subIn: number; // naskočil z lavičky
  minutes: number; // odehrané minuty celkem
  avgMinutes: number; // průměr minut na zápas
  goals: number;
  yellow: number;
  red: number;
  /** Jednotlivé zápasy (nejnovější první). */
  perMatch: { match: MatchRecord; app: MatchAppearance }[];
}

function emptyStats(): PlayerStats {
  return {
    apps: 0,
    starts: 0,
    subIn: 0,
    minutes: 0,
    avgMinutes: 0,
    goals: 0,
    yellow: 0,
    red: 0,
    perMatch: [],
  };
}

/** Normalizace jména pro párování (bez diakritiky, set slov → pořadí nerozhoduje). */
function nameKey(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

/** Najde hráče odpovídajícího nastoupení (podle memberId, záloha podle jména). */
function matchPlayer(
  app: MatchAppearance,
  byMember: Map<string, Player>,
  byName: Map<string, Player>
): Player | null {
  if (app.memberId && byMember.has(app.memberId)) {
    return byMember.get(app.memberId)!;
  }
  const key = nameKey(app.name);
  return byName.get(key) ?? null;
}

/** Spočítá statistiky všech hráčů ze zápasů. Vrací mapu playerId → PlayerStats. */
export function computeAllStats(
  players: Player[],
  matches: MatchRecord[]
): Map<string, PlayerStats> {
  const byMember = new Map<string, Player>();
  const byName = new Map<string, Player>();
  for (const p of players) {
    if (p.memberId) byMember.set(p.memberId, p);
    byName.set(nameKey(`${p.firstName} ${p.lastName}`), p);
  }

  const result = new Map<string, PlayerStats>();
  const sorted = [...matches].sort(
    (a, b) => (b.round ?? 0) - (a.round ?? 0) || b.date.localeCompare(a.date)
  );

  for (const match of sorted) {
    for (const app of match.appearances) {
      const player = matchPlayer(app, byMember, byName);
      if (!player) continue;
      const s = result.get(player.id) ?? emptyStats();
      s.apps += 1;
      if (app.started) s.starts += 1;
      else s.subIn += 1;
      s.minutes += app.minutes;
      s.goals += app.goals;
      s.yellow += app.yellow;
      s.red += app.red;
      s.perMatch.push({ match, app });
      result.set(player.id, s);
    }
  }
  for (const s of result.values()) {
    s.avgMinutes = s.apps ? Math.round(s.minutes / s.apps) : 0;
  }
  return result;
}

/** Kolik nastoupení ze zápasů se (ne)podařilo napárovat na hráče. */
export function countAppearanceMatching(
  players: Player[],
  matches: MatchRecord[]
): { total: number; unmatched: number } {
  const byMember = new Map<string, Player>();
  const byName = new Map<string, Player>();
  for (const p of players) {
    if (p.memberId) byMember.set(p.memberId, p);
    byName.set(nameKey(`${p.firstName} ${p.lastName}`), p);
  }
  let total = 0;
  let unmatched = 0;
  for (const m of matches)
    for (const a of m.appearances) {
      total++;
      if (!matchPlayer(a, byMember, byName)) unmatched++;
    }
  return { total, unmatched };
}

/** Navrhne doplnění ID člena hráčům, kteří ho nemají – podle jména ze zápisů.
 *  Vrací dvojice {playerId, memberId} k nastavení. */
export function buildMemberIdBackfill(
  players: Player[],
  matches: MatchRecord[]
): { playerId: string; memberId: string }[] {
  const byName = new Map<string, string>(); // nameKey → memberId
  for (const m of matches)
    for (const a of m.appearances) {
      if (!a.memberId) continue;
      const k = nameKey(a.name);
      if (!byName.has(k)) byName.set(k, a.memberId);
    }
  const out: { playerId: string; memberId: string }[] = [];
  for (const p of players) {
    if (p.memberId) continue;
    const mid = byName.get(nameKey(`${p.firstName} ${p.lastName}`));
    if (mid) out.push({ playerId: p.id, memberId: mid });
  }
  return out;
}

/** Krátký staty-řádek pro použití u hráče (např. v sestavě). */
export function statLine(s: PlayerStats | undefined): string {
  if (!s || s.apps === 0) return "";
  const parts = [`${s.apps} záp`, `${s.minutes}′`];
  if (s.goals) parts.push(`${s.goals} g`);
  return parts.join(" · ");
}
