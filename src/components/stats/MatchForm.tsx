"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Field, Input, Select } from "@/components/ui/Ui";
import { fullName } from "@/lib/players";
import type { MatchAppearance } from "@/lib/types";

type Status = "out" | "start" | "sub";
type Row = { status: Status; minutes: number; goals: number; yellow: number; red: number };

const DEFAULT_ROW: Row = { status: "out", minutes: 0, goals: 0, yellow: 0, red: 0 };

export function MatchForm({
  onDone,
  onCancel,
}: {
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const { data, addMatch } = useStore();

  const today = new Date().toISOString().slice(0, 10);
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState(today);
  const [home, setHome] = useState(true);
  const [competition, setCompetition] = useState("9. Domažlická FL");
  const [round, setRound] = useState("");
  const [ourScore, setOurScore] = useState("0");
  const [oppScore, setOppScore] = useState("0");
  const [prefillId, setPrefillId] = useState("");

  const players = useMemo(
    () => [...data.players].sort((a, b) => fullName(a).localeCompare(fullName(b), "cs")),
    [data.players]
  );

  const [rows, setRows] = useState<Record<string, Row>>({});
  const getRow = (id: string): Row => rows[id] ?? DEFAULT_ROW;
  const setRow = (id: string, patch: Partial<Row>) =>
    setRows((r) => ({ ...r, [id]: { ...getRow(id), ...patch } }));

  const setStatus = (id: string, status: Status) => {
    const cur = getRow(id);
    const minutes =
      status === "start" ? (cur.minutes || 90) : status === "out" ? 0 : cur.minutes;
    setRow(id, { status, minutes });
  };

  // Předvyplnění z uložené sestavy: základ = hráči na hřišti, střídal = lavička.
  const applyPrefill = (lineupId: string) => {
    setPrefillId(lineupId);
    const lu = data.lineups.find((l) => l.id === lineupId);
    if (!lu) return;
    const next: Record<string, Row> = {};
    for (const f of lu.onField)
      next[f.playerId] = { ...DEFAULT_ROW, status: "start", minutes: 90 };
    for (const id of lu.bench)
      next[id] = { ...DEFAULT_ROW, status: "sub", minutes: 0 };
    setRows(next);
  };

  const playing = Object.values(rows).filter((r) => r.status !== "out").length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) {
      alert("Vyplň soupeře.");
      return;
    }
    const appearances: MatchAppearance[] = [];
    for (const p of data.players) {
      const r = rows[p.id];
      if (!r || r.status === "out") continue;
      appearances.push({
        memberId: p.memberId,
        name: `${p.lastName} ${p.firstName}`.trim() || p.nickname,
        started: r.status === "start",
        minutes: Math.max(0, Math.min(120, r.minutes)),
        goals: Math.max(0, r.goals),
        yellow: Math.max(0, r.yellow),
        red: Math.max(0, r.red),
      });
    }
    addMatch({
      round: round ? Number(round) : null,
      date,
      competition: competition.trim(),
      opponent: opponent.trim(),
      home,
      ourScore: Number(ourScore) || 0,
      oppScore: Number(oppScore) || 0,
      appearances,
    });
    onDone(`Zápas vs ${opponent.trim()} uložen (${appearances.length} hráčů).`);
  };

  const numCell =
    "w-12 rounded-md border border-line bg-panel-2 px-1.5 py-1 text-center text-sm text-zinc-100 outline-none focus:border-gold/70";

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Metadata zápasu */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Soupeř" className="col-span-2">
          <Input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Miřkov" />
        </Field>
        <Field label="Datum">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Kolo">
          <Input
            inputMode="numeric"
            value={round}
            onChange={(e) => setRound(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="11"
          />
        </Field>
        <Field label="Místo">
          <Select value={home ? "home" : "away"} onChange={(e) => setHome(e.target.value === "home")}>
            <option value="home">Doma</option>
            <option value="away">Venku</option>
          </Select>
        </Field>
        <Field label="Naše skóre">
          <Input inputMode="numeric" value={ourScore} onChange={(e) => setOurScore(e.target.value.replace(/[^0-9]/g, ""))} />
        </Field>
        <Field label="Soupeř skóre">
          <Input inputMode="numeric" value={oppScore} onChange={(e) => setOppScore(e.target.value.replace(/[^0-9]/g, ""))} />
        </Field>
        <Field label="Soutěž">
          <Input value={competition} onChange={(e) => setCompetition(e.target.value)} />
        </Field>
      </div>

      {data.lineups.length > 0 && (
        <Field label="Předvyplnit z uložené sestavy (nepovinné)">
          <Select value={prefillId} onChange={(e) => applyPrefill(e.target.value)}>
            <option value="">— nevybráno —</option>
            {data.lineups.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {/* Hráči */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">
            Hráči ({playing} nastoupilo)
          </span>
          <span className="text-[11px] text-zinc-500">min · G · ŽK · ČK</span>
        </div>
        <div className="max-h-[42vh] space-y-1 overflow-y-auto rounded-lg border border-line p-2">
          {players.map((p) => {
            const r = getRow(p.id);
            const active = r.status !== "out";
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  active ? "bg-panel-2/60" : ""
                }`}
              >
                <span className="w-6 shrink-0 text-xs font-bold text-gold">
                  {p.number ?? "–"}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{fullName(p)}</span>
                <select
                  value={r.status}
                  onChange={(e) => setStatus(p.id, e.target.value as Status)}
                  className="shrink-0 rounded-md border border-line bg-panel-2 px-1.5 py-1 text-xs text-zinc-100 outline-none focus:border-gold/70"
                >
                  <option value="out">Nehrál</option>
                  <option value="start">Základ</option>
                  <option value="sub">Střídal</option>
                </select>
                <input
                  aria-label="Minuty"
                  inputMode="numeric"
                  disabled={!active}
                  value={active ? String(r.minutes) : ""}
                  onChange={(e) =>
                    setRow(p.id, { minutes: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })
                  }
                  className={`${numCell} disabled:opacity-30`}
                  placeholder="min"
                />
                <input
                  aria-label="Góly"
                  inputMode="numeric"
                  disabled={!active}
                  value={active && r.goals ? String(r.goals) : ""}
                  onChange={(e) =>
                    setRow(p.id, { goals: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })
                  }
                  className={`${numCell} disabled:opacity-30`}
                  placeholder="0"
                />
                <input
                  aria-label="Žluté karty"
                  inputMode="numeric"
                  disabled={!active}
                  value={active && r.yellow ? String(r.yellow) : ""}
                  onChange={(e) =>
                    setRow(p.id, { yellow: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })
                  }
                  className={`${numCell} disabled:opacity-30`}
                  placeholder="0"
                />
                <input
                  aria-label="Červené karty"
                  inputMode="numeric"
                  disabled={!active}
                  value={active && r.red ? String(r.red) : ""}
                  onChange={(e) =>
                    setRow(p.id, { red: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })
                  }
                  className={`${numCell} disabled:opacity-30`}
                  placeholder="0"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Zrušit
        </Button>
        <Button type="submit" variant="primary">
          Uložit zápas
        </Button>
      </div>
    </form>
  );
}
