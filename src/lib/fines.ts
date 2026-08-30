import { newId } from "./id";
import type { FineEntry, FineType } from "./types";

/** Výchozí sazebník pokut – finální verze (FA Horšovský Týn, muži A). */
export function defaultFineTypes(): FineType[] {
  const base: Omit<FineType, "id">[] = [
    { label: "Zápisné", amount: 300 },
    { label: "Kapitánská páska – první zápas", amount: 200 },
    { label: "První gól za FA Horšovský Týn", amount: 200 },
    { label: "Nevyplněná účast v EOS (7 dní před zápasem)", amount: 100 },
    { label: "Neomluvený pozdní příchod na trénink / zápas", amount: 50 },
    { label: "Neomluvený trénink / zápas", amount: 200 },
    { label: "Zapomenutá věc v šatně nebo na tréninku", amount: 50 },
    { label: "Žlutá karta za nesportovní chování", amount: 100 },
    { label: "Červená karta", amount: 300 },
    { label: "Dovolená v sezóně (v době zápasu)", amount: 300 },
    { label: "Alkohol nebo cigareta v dresu", amount: 200 },
  ];
  return base.map((t) => ({ ...t, id: newId("ft") }));
}

/** Formát částky v korunách, např. „1 200 Kč". */
export function formatKc(amount: number): string {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}

export interface PlayerFineSummary {
  count: number;
  total: number; // celkem předepsáno
  paid: number; // zaplaceno
  owed: number; // dluh (nezaplaceno)
}

/** Souhrn pokut jednoho hráče. */
export function summarizePlayer(
  fines: FineEntry[],
  playerId: string
): PlayerFineSummary {
  const mine = fines.filter((f) => f.playerId === playerId);
  const total = mine.reduce((s, f) => s + f.amount, 0);
  const paid = mine.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0);
  return { count: mine.length, total, paid, owed: total - paid };
}

/** Souhrn za celý tým. */
export function summarizeTeam(fines: FineEntry[]): PlayerFineSummary {
  const total = fines.reduce((s, f) => s + f.amount, 0);
  const paid = fines.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0);
  return { count: fines.length, total, paid, owed: total - paid };
}
