"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Field, Input, Select } from "@/components/ui/Ui";
import { useStore } from "@/lib/store";
import { formatKc } from "@/lib/fines";
import { fullName } from "@/lib/players";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Hromadné přidání jedné pokuty vybraným hráčům. */
export function BulkFineModal({ onClose }: { onClose: () => void }) {
  const { data, addFines } = useStore();
  const [fineTypeId, setFineTypeId] = useState(data.fineTypes[0]?.id ?? "");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(data.players.map((p) => p.id))
  );

  const players = useMemo(
    () =>
      [...data.players].sort((a, b) =>
        fullName(a).localeCompare(fullName(b), "cs")
      ),
    [data.players]
  );
  const type = data.fineTypes.find((t) => t.id === fineTypeId);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const submit = () => {
    if (!type || selected.size === 0) return;
    addFines(
      [...selected].map((playerId) => ({
        playerId,
        label: type.label,
        amount: type.amount,
        date: date || today(),
        paid: false,
        note: note.trim(),
      }))
    );
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Hromadná pokuta" maxWidth="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Pokuta">
            <Select
              value={fineTypeId}
              onChange={(e) => setFineTypeId(e.target.value)}
            >
              {data.fineTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} — {t.amount} Kč
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Datum">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Poznámka (volitelné)">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="např. sezóna 2025/26"
          />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Hráči ({selected.size}/{players.length})
            </span>
            <div className="flex gap-3 text-xs">
              <button
                className="text-gold hover:underline"
                onClick={() => setSelected(new Set(players.map((p) => p.id)))}
              >
                Vybrat vše
              </button>
              <button
                className="text-zinc-400 hover:underline"
                onClick={() => setSelected(new Set())}
              >
                Zrušit výběr
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 pr-1">
            {players.map((p) => {
              const on = selected.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors ${
                    on
                      ? "border-gold/50 bg-gold/10 text-zinc-100"
                      : "border-line bg-panel-2 text-zinc-400"
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${
                      on ? "bg-gold border-gold text-ink" : "border-line"
                    }`}
                  >
                    {on && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">{fullName(p)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm text-zinc-400">
            {type && selected.size > 0
              ? `Celkem ${formatKc(type.amount * selected.size)} (${selected.size}× ${type.amount} Kč)`
              : "Vyber pokutu a hráče"}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Zrušit
            </Button>
            <Button
              variant="primary"
              onClick={submit}
              disabled={!type || selected.size === 0}
            >
              Přidat vybraným ({selected.size})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
