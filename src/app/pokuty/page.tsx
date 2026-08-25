"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Card, Input } from "@/components/ui/Ui";
import { PlayerFinesModal } from "@/components/fines/PlayerFinesModal";
import { FinesLog } from "@/components/fines/FinesLog";
import { FineSchedule } from "@/components/fines/FineSchedule";
import { formatKc, summarizePlayer, summarizeTeam } from "@/lib/fines";
import { fullName } from "@/lib/players";
import type { Player } from "@/lib/types";

export default function PokutyPage() {
  const { data, ready } = useStore();
  const [selected, setSelected] = useState<Player | null>(null);
  const [search, setSearch] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const team = summarizeTeam(data.fines);

  const players = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.players
      .map((p) => ({ player: p, sum: summarizePlayer(data.fines, p.id) }))
      .filter(({ player }) =>
        q
          ? `${player.firstName} ${player.lastName} ${player.nickname}`
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => {
        // Nejdřív dlužníci (podle dluhu), pak podle jména.
        if (b.sum.owed !== a.sum.owed) return b.sum.owed - a.sum.owed;
        return fullName(a.player).localeCompare(fullName(b.player), "cs");
      });
  }, [data.players, data.fines, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Pokuty</h1>
        <p className="text-sm text-zinc-400">
          Pokladna týmu – naklikej hráčům pokuty a sleduj, kdo kolik dluží.
        </p>
      </div>

      {/* Souhrn týmu */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-3xl font-extrabold text-gold">
            {ready ? formatKc(team.total) : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">Předepsáno celkem</div>
        </Card>
        <Card className="p-5">
          <div className="text-3xl font-extrabold text-emerald-400">
            {ready ? formatKc(team.paid) : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">Zaplaceno</div>
        </Card>
        <Card className="p-5">
          <div
            className={`text-3xl font-extrabold ${
              team.owed > 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {ready ? formatKc(team.owed) : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">Zbývá vybrat</div>
        </Card>
        <Card className="p-5">
          <div className="text-3xl font-extrabold text-zinc-100">
            {ready ? team.count : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">Počet pokut</div>
        </Card>
      </section>

      {/* Hráči */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Hráči</h2>
          <Input
            placeholder="Hledat hráče…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>

        {data.players.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
            Zatím žádní hráči. Přidej je v sekci Hráči.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map(({ player, sum }) => (
              <button
                key={player.id}
                onClick={() => setSelected(player)}
                className="text-left rounded-xl border border-line bg-panel/80 p-4 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold truncate">
                    {fullName(player)}
                  </span>
                  {sum.owed > 0 ? (
                    <span className="shrink-0 text-sm font-bold text-red-400">
                      {formatKc(sum.owed)}
                    </span>
                  ) : sum.total > 0 ? (
                    <span className="shrink-0 text-xs font-medium text-emerald-400">
                      vyrovnáno
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-zinc-600">—</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {sum.count} pokut · zaplaceno {formatKc(sum.paid)} z{" "}
                  {formatKc(sum.total)}
                </div>
                {/* Ukazatel splacení */}
                <div className="mt-2 h-1.5 rounded-full bg-panel-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        sum.total > 0 ? (sum.paid / sum.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-gold">+ přidat / zobrazit</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Záznam pokut */}
      <FinesLog />

      {/* Sazebník (sbalitelný) */}
      <section>
        <button
          onClick={() => setShowSchedule((s) => !s)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-gold mb-3"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform ${showSchedule ? "rotate-90" : ""}`}
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {showSchedule ? "Skrýt sazebník" : "Upravit sazebník pokut"}
        </button>
        {showSchedule && <FineSchedule />}
      </section>

      {selected && (
        <PlayerFinesModal
          player={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
