"use client";

import { useMemo } from "react";
import { Select } from "@/components/ui/Ui";
import { fullName, playerById } from "@/lib/players";
import { positionShort } from "@/lib/positions";
import { newId } from "@/lib/id";
import type { Lineup, PlannedSub, Player } from "@/lib/types";

const MAX_SUBS = 5; // v soutěži smí do hry 5 hráčů z lavičky

/**
 * Plán střídání – příprava, kdo půjde do hry za koho (a případně kdy).
 * 11 v základu, až 7 na lavičce, 5 z nich může nastoupit.
 */
export function SubPlanner({
  lineup,
  players,
  onChange,
}: {
  lineup: Lineup;
  players: Player[];
  /** Nahradí seznam naplánovaných střídání. */
  onChange: (subs: PlannedSub[]) => void;
}) {
  const starters = useMemo(
    () =>
      lineup.onField
        .map((f) => playerById(players, f.playerId))
        .filter((p): p is Player => !!p),
    [lineup.onField, players]
  );
  const bench = useMemo(
    () =>
      lineup.bench
        .map((id) => playerById(players, id))
        .filter((p): p is Player => !!p),
    [lineup.bench, players]
  );

  const subs = lineup.subs ?? [];
  const usedIn = new Set(subs.map((s) => s.inId).filter(Boolean));
  const usedOut = new Set(subs.map((s) => s.outId).filter(Boolean));

  const label = (p: Player | undefined) =>
    p ? `${p.number != null ? p.number + ". " : ""}${fullName(p)}` : "—";

  const addSub = () => {
    const freeIn = bench.find((p) => !usedIn.has(p.id));
    // Brankáře z automatického výběru vynecháme (střídá se zřídka).
    const freeOutPool = starters.filter(
      (p) =>
        !usedOut.has(p.id) &&
        p.mainPosition !== "GK" &&
        p.id !== lineup.goalkeeperId
    );
    // Vyber ven hráče na stejné pozici jako střídající (když to jde).
    const freeOut =
      (freeIn &&
        freeOutPool.find((p) => p.mainPosition === freeIn.mainPosition)) ||
      freeOutPool[0];
    const sub: PlannedSub = {
      id: newId("sub"),
      inId: freeIn?.id ?? "",
      outId: freeOut?.id ?? "",
      minute: null,
      note: "",
    };
    onChange([...subs, sub]);
  };

  const patch = (id: string, p: Partial<PlannedSub>) =>
    onChange(subs.map((s) => (s.id === id ? { ...s, ...p } : s)));

  const remove = (id: string) =>
    onChange(subs.filter((s) => s.id !== id));

  const count = subs.length;
  const canPlan = starters.length > 0 && bench.length > 0;

  return (
    <div className="rounded-xl border border-line bg-panel/70 p-4">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h2 className="font-semibold">Plán střídání</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            count > MAX_SUBS
              ? "bg-amber-500/15 text-amber-300"
              : "bg-gold/15 text-gold"
          }`}
        >
          {count}/{MAX_SUBS}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mb-3">
        Připrav si, kdo půjde do hry za koho. Základ 11, lavička až 7, nastoupit
        smí 5 hráčů.
      </p>

      {!canPlan ? (
        <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-zinc-500">
          Nejdřív dej hráče do základní sestavy a na lavičku, pak si můžeš
          naplánovat střídání.
        </div>
      ) : (
        <div className="space-y-2">
          {subs.map((s, i) => {
            const badInOnBench = !!s.inId && !lineup.bench.includes(s.inId);
            const badOutOnField =
              !!s.outId && !lineup.onField.some((f) => f.playerId === s.outId);
            return (
              <div
                key={s.id}
                className="rounded-lg border border-line bg-panel-2 p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-bold text-zinc-500 w-5 text-center">
                    {i + 1}.
                  </span>

                  {/* minuta */}
                  <div className="relative shrink-0">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      inputMode="numeric"
                      value={s.minute ?? ""}
                      onChange={(e) =>
                        patch(s.id, {
                          minute:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                      placeholder="min"
                      className="w-16 rounded-md border border-line bg-panel px-2 py-1.5 text-sm tabular-nums focus:border-gold focus:outline-none"
                    />
                    {s.minute != null && (
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                        ′
                      </span>
                    )}
                  </div>

                  {/* kdo jde na hřiště */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-400" title="Jde na hřiště">
                        ▲
                      </span>
                      <Select
                        value={s.inId}
                        onChange={(e) => patch(s.id, { inId: e.target.value })}
                        className={`py-1 text-sm ${
                          badInOnBench ? "border-amber-500/60" : ""
                        }`}
                      >
                        <option value="">– z lavičky –</option>
                        {bench.map((p) => (
                          <option key={p.id} value={p.id}>
                            {label(p)} · {positionShort(p.mainPosition)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs text-zinc-500">za</span>

                  {/* kdo jde ven */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-red-400" title="Jde ze hřiště">
                        ▼
                      </span>
                      <Select
                        value={s.outId}
                        onChange={(e) => patch(s.id, { outId: e.target.value })}
                        className={`py-1 text-sm ${
                          badOutOnField ? "border-amber-500/60" : ""
                        }`}
                      >
                        <option value="">– ze základu –</option>
                        {starters.map((p) => (
                          <option key={p.id} value={p.id}>
                            {label(p)} · {positionShort(p.mainPosition)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(s.id)}
                    className="shrink-0 rounded-md px-1.5 py-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
                    title="Smazat střídání"
                    aria-label="Smazat střídání"
                  >
                    ✕
                  </button>
                </div>

                {/* poznámka + varování */}
                <div className="mt-1.5 flex items-center gap-2 pl-7">
                  <input
                    value={s.note}
                    onChange={(e) => patch(s.id, { note: e.target.value })}
                    placeholder="poznámka (nepovinné)"
                    className="min-w-0 flex-1 rounded-md border border-line bg-panel px-2 py-1 text-xs focus:border-gold focus:outline-none"
                  />
                  {(badInOnBench || badOutOnField) && (
                    <span className="shrink-0 text-[11px] text-amber-400">
                      {badInOnBench ? "není na lavičce" : "není v základu"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={addSub}
              className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold hover:bg-gold/20"
            >
              + Přidat střídání
            </button>
            {count > MAX_SUBS && (
              <span className="text-xs text-amber-400">
                Pozor: do hry smí jen {MAX_SUBS} hráčů.
              </span>
            )}
          </div>

          {/* souhrn náhradníků, kteří ještě nejsou v plánu */}
          {bench.some((p) => !usedIn.has(p.id)) && (
            <p className="pt-1 text-[11px] text-zinc-500">
              Zatím bez střídání:{" "}
              {bench
                .filter((p) => !usedIn.has(p.id))
                .map((p) => fullName(p))
                .join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
