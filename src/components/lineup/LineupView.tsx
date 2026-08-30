"use client";

import { DndContext } from "@dnd-kit/core";
import { useMemo } from "react";
import { Pitch } from "./Pitch";
import { BoardHeader } from "./BoardHeader";
import { useStore } from "@/lib/store";
import { getFormation } from "@/lib/formations";
import { fullName, playerById } from "@/lib/players";

/** Read-only náhled aktuální (naposledy uložené) sestavy pro tým. */
export function LineupView() {
  const { data, ready } = useStore();

  const lineup = useMemo(() => {
    if (data.lineups.length === 0) return null;
    return [...data.lineups].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }, [data.lineups]);

  if (!ready) {
    return <div className="py-20 text-center text-zinc-500">Načítám…</div>;
  }
  if (!lineup) {
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
        Zatím není zveřejněná žádná sestava.
      </div>
    );
  }

  const bench = lineup.bench
    .map((id) => playerById(data.players, id))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const formation = getFormation(lineup.formationId);
  const dateStr = [lineup.matchDate, lineup.matchTime].filter(Boolean).join(" ");

  return (
    <DndContext>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="rounded-2xl border border-line bg-panel p-3 sm:p-4 space-y-3">
          <BoardHeader lineup={lineup} />
          <Pitch lineup={lineup} players={data.players} interactive={false} />
          <div className="rounded-xl border border-line bg-panel/70">
            <div className="px-3 py-2 border-b border-line/70 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Náhradníci</h3>
              <span className="text-xs text-zinc-500">{bench.length}</span>
            </div>
            <div className="p-2.5">
              {bench.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2 text-center">
                  Bez náhradníků.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bench.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 text-sm"
                    >
                      <span className="text-gold font-bold text-xs">
                        {p.number ?? "–"}
                      </span>
                      {fullName(p)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info o zápase (read-only) */}
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-panel/70 p-4">
            <h2 className="font-semibold mb-3">{lineup.name}</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Soupeř" value={lineup.opponent || "—"} />
              <Row label="Datum a čas" value={dateStr || "—"} />
              <Row label="Místo" value={lineup.venue || "—"} />
              <Row label="Prostředí" value={lineup.isHome ? "Domácí" : "Venkovní"} />
              <Row label="Rozestavení" value={formation.name} />
              <Row
                label="Kapitán"
                value={fullName(playerById(data.players, lineup.captainId) || ({} as never)) || "—"}
              />
            </dl>
            {lineup.note && (
              <p className="mt-3 text-sm text-zinc-400 border-t border-line/60 pt-3">
                {lineup.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-zinc-100 text-right font-medium">{value}</dd>
    </div>
  );
}
