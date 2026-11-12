"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { AdminOnly } from "@/components/AdminOnly";
import { Button } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { computeAllStats, countAppearanceMatching, type PlayerStats } from "@/lib/stats";
import { fullName } from "@/lib/players";
import { SEED_MATCHES } from "@/lib/seedMatches";
import { MatchForm } from "@/components/stats/MatchForm";
import type { Player } from "@/lib/types";

type SortKey =
  | "name"
  | "apps"
  | "starts"
  | "minutes"
  | "avgMinutes"
  | "goals"
  | "yellow"
  | "red";

const COLS: { key: SortKey; label: string; help?: string; num: boolean }[] = [
  { key: "name", label: "Hráč", num: false },
  { key: "apps", label: "Z", help: "Zápasů", num: true },
  { key: "starts", label: "ZÁK", help: "V základu", num: true },
  { key: "minutes", label: "Min", help: "Odehrané minuty", num: true },
  { key: "avgMinutes", label: "Ø", help: "Průměr minut na zápas", num: true },
  { key: "goals", label: "G", help: "Góly", num: true },
  { key: "yellow", label: "ŽK", help: "Žluté karty", num: true },
  { key: "red", label: "ČK", help: "Červené karty", num: true },
];

export default function StatistikyPage() {
  const { data, ready, importMatches, removeMatch, isAdmin } = useStore();
  const [sortKey, setSortKey] = useState<SortKey>("minutes");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [matchesOpen, setMatchesOpen] = useState(false);

  const statsMap = useMemo(
    () => computeAllStats(data.players, data.matches),
    [data.players, data.matches]
  );

  const rows = useMemo(() => {
    const list: { player: Player; s: PlayerStats }[] = [];
    for (const p of data.players) {
      const s = statsMap.get(p.id);
      if (s && s.apps > 0) list.push({ player: p, s });
    }
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === "name")
        return fullName(a.player).localeCompare(fullName(b.player), "cs") * dir;
      return ((a.s[sortKey] as number) - (b.s[sortKey] as number)) * dir
        || fullName(a.player).localeCompare(fullName(b.player), "cs");
    });
    return list;
  }, [data.players, statsMap, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleImport = () => {
    const added = importMatches(SEED_MATCHES);
    showToast(
      added > 0
        ? `Naimportováno ${added} zápasů podzimní části.`
        : "Podzimní zápasy už jsou naimportované."
    );
  };

  const matches = useMemo(
    () => [...data.matches].sort((a, b) => (b.round ?? 0) - (a.round ?? 0)),
    [data.matches]
  );

  const unmatched = useMemo(
    () => countAppearanceMatching(data.players, data.matches),
    [data.matches, data.players]
  );

  return (
    <AdminOnly>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Statistiky</h1>
            <p className="text-sm text-zinc-400">
              {ready
                ? `${data.matches.length} zápasů · ${rows.length} hráčů se zápisem`
                : "Načítám…"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {data.matches.length === 0 && (
              <Button variant="primary" onClick={handleImport}>
                Importovat podzim 2026 (10 zápasů)
              </Button>
            )}
            <Button variant="secondary" onClick={() => setFormOpen(true)}>
              + Přidat zápas
            </Button>
          </div>
        </div>

        {data.matches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-400">
            Zatím žádné zápasy. Naimportuj podzimní část, nebo přidej zápas ručně.
          </div>
        ) : (
          <>
            {unmatched.unmatched > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
                {unmatched.unmatched} nastoupení se nepodařilo napárovat na hráče –
                doplň hráčům „ID člena“ v detailu (Hráči), ať se staty započítají.
              </div>
            )}

            {/* Tabulka statistik */}
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-line bg-panel/60 text-[11px] uppercase tracking-wide text-zinc-500">
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        title={c.help}
                        onClick={() => toggleSort(c.key)}
                        className={`cursor-pointer select-none px-3 py-2.5 font-semibold hover:text-zinc-200 ${
                          c.num ? "text-right" : "text-left"
                        } ${sortKey === c.key ? "text-gold" : ""}`}
                      >
                        {c.label}
                        {sortKey === c.key && (sortDir === "asc" ? " ↑" : " ↓")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ player, s }, i) => (
                    <tr
                      key={player.id}
                      className={`border-b border-line/50 ${
                        i % 2 ? "bg-panel/30" : ""
                      } hover:bg-panel-2/40`}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded bg-gold/15 text-xs font-bold text-gold">
                            {player.number ?? "–"}
                          </span>
                          <span className="font-medium">{fullName(player)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{s.apps}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{s.starts}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{s.minutes}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-zinc-400">
                        {s.avgMinutes}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">
                        {s.goals || ""}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-amber-300/90">
                        {s.yellow || ""}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-red-400">
                        {s.red || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Seznam zápasů */}
            <div className="rounded-xl border border-line">
              <button
                onClick={() => setMatchesOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold"
              >
                <span>Zápasy ({matches.length})</span>
                <span className="text-zinc-500">{matchesOpen ? "▲" : "▼"}</span>
              </button>
              {matchesOpen && (
                <div className="divide-y divide-line/50 border-t border-line">
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <span className="text-zinc-500">
                          {m.round ? `${m.round}. kolo · ` : ""}
                          {m.date}
                        </span>{" "}
                        <span className="font-medium">
                          {m.home ? "doma" : "venku"} vs {m.opponent}
                        </span>{" "}
                        <span
                          className={`font-bold ${
                            m.ourScore > m.oppScore
                              ? "text-emerald-400"
                              : m.ourScore < m.oppScore
                              ? "text-red-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {m.ourScore}:{m.oppScore}
                        </span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`Smazat zápas vs ${m.opponent}?`))
                              removeMatch(m.id);
                          }}
                          className="shrink-0 text-xs text-zinc-500 hover:text-red-300"
                        >
                          Smazat
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Přidat zápas"
          maxWidth="max-w-3xl"
        >
          <MatchForm
            onDone={(msg) => {
              setFormOpen(false);
              showToast(msg);
            }}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>

        {toast && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-panel-2 border border-line px-4 py-2.5 text-sm shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </AdminOnly>
  );
}
