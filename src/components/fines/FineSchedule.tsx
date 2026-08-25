"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui/Ui";
import { useStore } from "@/lib/store";
import { formatKc } from "@/lib/fines";

/** Editor sazebníku pokut – druhy a jejich výše. */
export function FineSchedule() {
  const { data, addFineType, updateFineType, removeFineType } = useStore();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const add = () => {
    const l = label.trim();
    const a = Number(amount);
    if (!l || !Number.isFinite(a) || a < 0) return;
    addFineType({ label: l, amount: a });
    setLabel("");
    setAmount("");
  };

  return (
    <Card className="p-5">
      <h2 className="font-semibold mb-1">Sazebník pokut</h2>
      <p className="text-sm text-zinc-400 mb-4">
        Uprav názvy a částky, přidej nebo odeber druhy pokut. Změny se projeví
        jen u nově udělených pokut – historické záznamy zůstanou beze změny.
      </p>

      <div className="space-y-2">
        {data.fineTypes.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <Input
              value={t.label}
              onChange={(e) => updateFineType(t.id, { label: e.target.value })}
              className="flex-1"
            />
            <div className="relative w-32 shrink-0">
              <Input
                type="number"
                inputMode="numeric"
                value={t.amount}
                onChange={(e) =>
                  updateFineType(t.id, { amount: Number(e.target.value) || 0 })
                }
                className="pr-9 text-right"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                Kč
              </span>
            </div>
            <button
              onClick={() => removeFineType(t.id)}
              className="shrink-0 text-zinc-500 hover:text-red-400 p-2"
              aria-label="Smazat druh pokuty"
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
          </div>
        ))}
      </div>

      {/* Přidání nového druhu */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-line">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nová pokuta (název)"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <div className="relative w-32 shrink-0">
          <Input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="pr-9 text-right"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
            Kč
          </span>
        </div>
        <Button variant="primary" onClick={add} className="shrink-0">
          Přidat
        </Button>
      </div>

      {data.fineTypes.length > 0 && (
        <p className="text-xs text-zinc-500 mt-3">
          Celkem {data.fineTypes.length} druhů pokut ·{" "}
          {formatKc(
            data.fineTypes.reduce((s, t) => s + t.amount, 0)
          )}{" "}
          součet sazeb
        </p>
      )}
    </Card>
  );
}
