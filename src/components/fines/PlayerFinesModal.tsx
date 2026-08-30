"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Ui";
import { useStore } from "@/lib/store";
import { formatKc, summarizePlayer } from "@/lib/fines";
import { fullName } from "@/lib/players";
import type { Player } from "@/lib/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Okno jednoho hráče: souhrn, naklikání pokut ze sazebníku a historie. */
export function PlayerFinesModal({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  const { data, addFine, updateFine, removeFine, isAdmin } = useStore();
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");

  const summary = summarizePlayer(data.fines, player.id);
  const entries = useMemo(
    () =>
      data.fines
        .filter((f) => f.playerId === player.id)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt)),
    [data.fines, player.id]
  );

  const add = (label: string, amount: number) => {
    addFine({
      playerId: player.id,
      label,
      amount,
      date: date || today(),
      paid: false,
      note: note.trim(),
    });
    setNote("");
  };

  return (
    <Modal open onClose={onClose} title={`Pokuty – ${fullName(player)}`} maxWidth="max-w-2xl">
      {/* Souhrn */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <SummaryTile label="Předepsáno" value={formatKc(summary.total)} tone="neutral" />
        <SummaryTile label="Zaplaceno" value={formatKc(summary.paid)} tone="ok" />
        <SummaryTile label="Dluh" value={formatKc(summary.owed)} tone={summary.owed > 0 ? "bad" : "ok"} />
      </div>

      {/* Přidání pokuty ze sazebníku – jen admin */}
      {isAdmin && (
      <div className="rounded-xl border border-line bg-panel-2 p-3 mb-5">
        <div className="flex items-end gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Datum</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-400 mb-1">Poznámka (volitelné)</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="např. zápas s Blížejovem" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 mb-2">Klikni na pokutu – hned se přičte hráči:</p>
        {data.fineTypes.length === 0 ? (
          <p className="text-xs text-zinc-500">
            Sazebník je prázdný. Přidej pokuty v sekci „Sazebník“ na stránce Pokuty.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.fineTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => add(t.label, t.amount)}
                className="flex items-center justify-between gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-left hover:border-gold/50 hover:bg-panel-2 transition-colors"
              >
                <span className="text-sm text-zinc-200 leading-tight">{t.label}</span>
                <span className="shrink-0 text-sm font-bold text-gold">{formatKc(t.amount)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Historie */}
      <div>
        <h3 className="text-sm font-semibold mb-2">
          Historie pokut <span className="text-zinc-500 font-normal">({entries.length})</span>
        </h3>
        {entries.length === 0 ? (
          <p className="text-sm text-zinc-500 py-3 text-center">Zatím žádné pokuty.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {entries.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-panel-2 px-3 py-2"
              >
                {isAdmin ? (
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={f.paid}
                      onChange={(e) => updateFine(f.id, { paid: e.target.checked })}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    <span className={`text-[11px] ${f.paid ? "text-emerald-400" : "text-amber-400"}`}>
                      {f.paid ? "zaplaceno" : "dluží"}
                    </span>
                  </label>
                ) : (
                  <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-md border ${f.paid ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-amber-500/15 text-amber-300 border-amber-500/30"}`}>
                    {f.paid ? "zaplaceno" : "dluží"}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{f.label}</div>
                  <div className="text-[11px] text-zinc-500">
                    {formatDate(f.date)}
                    {f.note ? ` · ${f.note}` : ""}
                  </div>
                </div>
                <span className={`text-sm font-semibold ${f.paid ? "text-zinc-400 line-through" : "text-zinc-100"}`}>
                  {formatKc(f.amount)}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => removeFine(f.id)}
                    className="shrink-0 text-zinc-500 hover:text-red-400 p-1"
                    aria-label="Smazat"
                    title="Smazat"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "ok" | "bad";
}) {
  const color =
    tone === "bad" ? "text-red-400" : tone === "ok" ? "text-emerald-400" : "text-zinc-100";
  return (
    <div className="rounded-lg border border-line bg-panel-2 p-3">
      <div className={`text-lg font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-zinc-400 mt-0.5">{label}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}
