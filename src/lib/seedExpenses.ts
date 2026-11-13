import type { Expense } from "./types";

/** Výchozí faktury za tým (naimportuje admin jedním kliknutím). */
export const SEED_EXPENSES: Omit<Expense, "createdAt" | "updatedAt">[] = [
  {
    id: "ex-seed-1",
    title: "Týmové dresy a oblečení",
    category: "Oblečení",
    supplier: "Teamline s.r.o. (team-jako.cz)",
    date: "2026-11-02",
    amount: 49320,
    pdfUrl: "/vydaje/teamove-obleceni-2026.pdf",
    note: "Dodací list č. 66260297, ceny vč. DPH.",
    items: [
      { label: "TEAM dres krátký rukáv", qty: 23, total: 8050 },
      { label: "ONE triko s límečkem", qty: 20, total: 10800 },
      { label: "Sonic mikina krátký zip", qty: 23, total: 20470 },
      { label: "Šusťáková bunda s kapucí", qty: 1, total: 810 },
      { label: "ONE triko", qty: 1, total: 350 },
      { label: "Potisk – barevné logo", qty: 68, total: 4080 },
      { label: "Potisk – řezaný text", qty: 68, total: 4760 },
    ],
  },
  {
    id: "ex-seed-2",
    title: "Soupravy SET AREA",
    category: "Oblečení",
    supplier: "Oltisport (Oldřich Timura)",
    date: "2026-10-26",
    amount: 20825,
    pdfUrl: "/vydaje/faktura-oltisport-2026167.pdf",
    note: "Faktura č. 2026167, ceny vč. DPH.",
    items: [
      { label: "SET AREA BEIGE – souprava", qty: 25, total: 20825 },
    ],
  },
];
