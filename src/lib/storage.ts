import { createDemoPlayers } from "./demoData";
import type { AppData, Lineup, Player } from "./types";

const STORAGE_KEY = "fa-hty-lineup-builder";
const CURRENT_VERSION = 1;

export function emptyData(withDemo = true): AppData {
  return {
    players: withDemo ? createDemoPlayers() : [],
    lineups: [],
    version: CURRENT_VERSION,
  };
}

/** Načte data z localStorage. Při první návštěvě vytvoří demo data. */
export function loadData(): AppData {
  if (typeof window === "undefined") return emptyData(false);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = emptyData(true);
      saveData(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return normalize(parsed);
  } catch (err) {
    console.error("Nepodařilo se načíst data:", err);
    return emptyData(false);
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Nepodařilo se uložit data:", err);
  }
}

/** Ověří a doplní chybějící pole (kvůli kompatibilitě starších dat). */
export function normalize(input: Partial<AppData>): AppData {
  const players: Player[] = Array.isArray(input.players)
    ? input.players.map(sanitizePlayer)
    : [];
  const lineups: Lineup[] = Array.isArray(input.lineups)
    ? input.lineups.map(sanitizeLineup)
    : [];
  return { players, lineups, version: CURRENT_VERSION };
}

function sanitizePlayer(p: Partial<Player>): Player {
  return {
    id: String(p.id ?? ""),
    firstName: String(p.firstName ?? ""),
    lastName: String(p.lastName ?? ""),
    nickname: String(p.nickname ?? ""),
    birthYear: typeof p.birthYear === "number" ? p.birthYear : null,
    mainPosition: p.mainPosition ?? "CM",
    secondaryPositions: Array.isArray(p.secondaryPositions)
      ? p.secondaryPositions
      : [],
    foot: p.foot ?? "right",
    number: typeof p.number === "number" ? p.number : null,
    note: String(p.note ?? ""),
    availability: p.availability ?? "available",
  };
}

function sanitizeLineup(l: Partial<Lineup>): Lineup {
  return {
    id: String(l.id ?? ""),
    name: String(l.name ?? "Sestava"),
    opponent: String(l.opponent ?? ""),
    matchDate: String(l.matchDate ?? ""),
    matchTime: String(l.matchTime ?? ""),
    venue: String(l.venue ?? ""),
    isHome: Boolean(l.isHome ?? true),
    formationId: String(l.formationId ?? "4-3-3"),
    captainId: l.captainId ?? null,
    goalkeeperId: l.goalkeeperId ?? null,
    note: String(l.note ?? ""),
    onField: Array.isArray(l.onField) ? l.onField : [],
    bench: Array.isArray(l.bench) ? l.bench : [],
    createdAt: typeof l.createdAt === "number" ? l.createdAt : Date.now(),
    updatedAt: typeof l.updatedAt === "number" ? l.updatedAt : Date.now(),
  };
}

/** Vyexportuje data jako stažitelný JSON soubor. */
export function exportToFile(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `fa-hty-data-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Načte data z nahraného JSON souboru. */
export function importFromFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        resolve(normalize(parsed));
      } catch {
        reject(new Error("Soubor není platný JSON."));
      }
    };
    reader.onerror = () => reject(new Error("Soubor se nepodařilo přečíst."));
    reader.readAsText(file);
  });
}
