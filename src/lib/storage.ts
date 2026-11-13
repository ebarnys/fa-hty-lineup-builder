import { createDemoPlayers } from "./demoData";
import { defaultFineTypes } from "./fines";
import type {
  AppData,
  Expense,
  ExpenseItem,
  FineEntry,
  FineType,
  Lineup,
  MatchAppearance,
  MatchRecord,
  PlannedSub,
  Player,
} from "./types";

const STORAGE_KEY = "fa-hty-lineup-builder";
const CURRENT_VERSION = 1;

export function emptyData(withDemo = true): AppData {
  return {
    players: withDemo ? createDemoPlayers() : [],
    lineups: [],
    // Sazebník pokut je výchozí konfigurace, seedujeme ho vždy.
    fineTypes: defaultFineTypes(),
    fines: [],
    matches: [],
    expenses: [],
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
  // Sazebník: pokud chybí (starší data), doplníme výchozí; prázdné pole
  // (uživatel si vše smazal) respektujeme.
  const fineTypes: FineType[] = Array.isArray(input.fineTypes)
    ? input.fineTypes.map(sanitizeFineType)
    : defaultFineTypes();
  const fines: FineEntry[] = Array.isArray(input.fines)
    ? input.fines.map(sanitizeFineEntry)
    : [];
  const matches: MatchRecord[] = Array.isArray(input.matches)
    ? input.matches.map(sanitizeMatch)
    : [];
  const expenses: Expense[] = Array.isArray(input.expenses)
    ? input.expenses.map(sanitizeExpense)
    : [];
  return {
    players,
    lineups,
    fineTypes,
    fines,
    matches,
    expenses,
    version: CURRENT_VERSION,
  };
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function sanitizeAppearance(a: Partial<MatchAppearance>): MatchAppearance {
  return {
    memberId: String(a.memberId ?? ""),
    name: String(a.name ?? ""),
    started: Boolean(a.started),
    minutes: num(a.minutes),
    goals: num(a.goals),
    yellow: num(a.yellow),
    red: num(a.red),
  };
}

function sanitizeMatch(m: Partial<MatchRecord>): MatchRecord {
  return {
    id: String(m.id ?? ""),
    round: typeof m.round === "number" ? m.round : null,
    date: String(m.date ?? ""),
    competition: String(m.competition ?? ""),
    opponent: String(m.opponent ?? ""),
    home: Boolean(m.home ?? true),
    ourScore: num(m.ourScore),
    oppScore: num(m.oppScore),
    appearances: Array.isArray(m.appearances)
      ? m.appearances.map(sanitizeAppearance)
      : [],
    createdAt: typeof m.createdAt === "number" ? m.createdAt : Date.now(),
    updatedAt: typeof m.updatedAt === "number" ? m.updatedAt : Date.now(),
  };
}

function sanitizeExpenseItem(i: Partial<ExpenseItem>): ExpenseItem {
  return {
    label: String(i.label ?? ""),
    qty: typeof i.qty === "number" ? i.qty : null,
    total: num(i.total),
  };
}

function sanitizeExpense(e: Partial<Expense>): Expense {
  return {
    id: String(e.id ?? ""),
    title: String(e.title ?? "Výdaj"),
    category: String(e.category ?? "Ostatní"),
    supplier: String(e.supplier ?? ""),
    date: String(e.date ?? ""),
    amount: num(e.amount),
    items: Array.isArray(e.items) ? e.items.map(sanitizeExpenseItem) : [],
    pdfUrl: String(e.pdfUrl ?? ""),
    note: String(e.note ?? ""),
    createdAt: typeof e.createdAt === "number" ? e.createdAt : Date.now(),
    updatedAt: typeof e.updatedAt === "number" ? e.updatedAt : Date.now(),
  };
}

function sanitizeFineType(t: Partial<FineType>): FineType {
  return {
    id: String(t.id ?? ""),
    label: String(t.label ?? "Pokuta"),
    amount: typeof t.amount === "number" ? t.amount : 0,
  };
}

function sanitizeFineEntry(f: Partial<FineEntry>): FineEntry {
  return {
    id: String(f.id ?? ""),
    playerId: String(f.playerId ?? ""),
    label: String(f.label ?? "Pokuta"),
    amount: typeof f.amount === "number" ? f.amount : 0,
    date: String(f.date ?? ""),
    paid: Boolean(f.paid),
    note: String(f.note ?? ""),
    createdAt: typeof f.createdAt === "number" ? f.createdAt : Date.now(),
  };
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
    memberId: extractMemberId(p),
  };
}

/** Vezme memberId, nebo ho zkusí vytáhnout z poznámky („ID člena: 12345678"). */
function extractMemberId(p: Partial<Player>): string {
  if (p.memberId) return String(p.memberId).trim();
  const note = String(p.note ?? "");
  const labeled = note.match(/ID\s*člena[:\s]*([0-9]{6,10})/i);
  if (labeled) return labeled[1];
  const any = note.match(/\b([0-9]{6,10})\b/);
  return any ? any[1] : "";
}

function sanitizeSub(s: Partial<PlannedSub>): PlannedSub {
  return {
    id: String(s.id ?? ""),
    outId: String(s.outId ?? ""),
    inId: String(s.inId ?? ""),
    minute: typeof s.minute === "number" ? s.minute : null,
    note: String(s.note ?? ""),
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
    kitId: String(l.kitId ?? "sky"),
    captainId: l.captainId ?? null,
    goalkeeperId: l.goalkeeperId ?? null,
    coach: String(l.coach ?? ""),
    manager: String(l.manager ?? ""),
    note: String(l.note ?? ""),
    onField: Array.isArray(l.onField) ? l.onField : [],
    bench: Array.isArray(l.bench) ? l.bench : [],
    subs: Array.isArray(l.subs) ? l.subs.map(sanitizeSub) : [],
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
