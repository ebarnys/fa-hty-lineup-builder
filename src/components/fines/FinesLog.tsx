"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Ui";
import { useStore } from "@/lib/store";
import { formatKc } from "@/lib/fines";
import { fullName, playerById } from "@/lib/players";

type Filter = "all" | "unpaid" | "paid";

/** Chronologický záznam všech udělených pokut. */
export function FinesLog() {
  const { data, updateFine, removeFine } = useStore();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    return data.fines
      .filter((f) =>
        filter === "all" ? true : filter === "paid" ? f.paid : !f.paid
      )
      .sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt
      );
  }, [data.fines, filter]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Vše" },
    { key: "unpaid", label: "Nezaplacené" },
    { key: "paid", label: "Zaplacené" },
  ];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold">Záznam pokut</h2>
        <div className="flex gap-1 rounded-lg border border-line bg-panel-2 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === t.key
                  ? "bg-gold text-ink"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500 py-6 text-center">
          Žádné pokuty k zobrazení.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-line">
                <th className="py-2 pr-3 font-medium">Datum</th>
                <th className="py-2 pr-3 font-medium">Hráč</th>
                <th className="py-2 pr-3 font-medium">Pokuta</th>
                <th className="py-2 pr-3 font-medium text-right">Částka</th>
                <th className="py-2 pr-3 font-medium text-center">Stav</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => {
                const p = playerById(data.players, f.playerId);
                return (
                  <tr key={f.id} className="border-b border-line/50">
                    <td className="py-2 pr-3 text-zinc-400 whitespace-nowrap">
                      {formatDate(f.date)}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {p ? fullName(p) : "—"}
                    </td>
                    <td className="py-2 pr-3">
                      <span>{f.label}</span>
                      {f.note && (
                        <span className="text-zinc-500"> · {f.note}</span>
                      )}
                    </td>
                    <td
                      className={`py-2 pr-3 text-right font-semibold whitespace-nowrap ${
                        f.paid ? "text-zinc-500 line-through" : "text-zinc-100"
                      }`}
                    >
                      {formatKc(f.amount)}
                    </td>
                    <td className="py-2 pr-3 text-center">
                      <button
                        onClick={() => updateFine(f.id, { paid: !f.paid })}
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                          f.paid
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                        title="Přepnout zaplaceno / dluží"
                      >
                        {f.paid ? "zaplaceno" : "dluží"}
                      </button>
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removeFine(f.id)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        aria-label="Smazat"
                        title="Smazat"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
