"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Field, Input, Label, Textarea } from "@/components/ui/Ui";
import { formatKc } from "@/lib/fines";
import type { Expense, ExpenseItem } from "@/lib/types";

const CATEGORIES = ["Oblečení", "Dresy", "Vybavení", "Dokopné", "Ostatní"];

type Draft = {
  title: string;
  category: string;
  supplier: string;
  date: string;
  amount: string;
  pdfUrl: string;
  note: string;
  items: { label: string; qty: string; total: string }[];
};

function toDraft(e?: Expense): Draft {
  return {
    title: e?.title ?? "",
    category: e?.category ?? "Oblečení",
    supplier: e?.supplier ?? "",
    date: e?.date ?? new Date().toISOString().slice(0, 10),
    amount: e ? String(e.amount) : "",
    pdfUrl: e?.pdfUrl ?? "",
    note: e?.note ?? "",
    items: (e?.items ?? []).map((i) => ({
      label: i.label,
      qty: i.qty != null ? String(i.qty) : "",
      total: String(i.total),
    })),
  };
}

/** Formulář pro přidání/úpravu výdaje (jen admin). */
export function ExpenseForm({
  expense,
  onDone,
  onCancel,
}: {
  expense?: Expense;
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const { addExpense, updateExpense } = useStore();
  const [d, setD] = useState<Draft>(() => toDraft(expense));

  const set = (patch: Partial<Draft>) => setD((p) => ({ ...p, ...patch }));

  const setItem = (i: number, patch: Partial<Draft["items"][number]>) =>
    setD((p) => ({
      ...p,
      items: p.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setD((p) => ({ ...p, items: [...p.items, { label: "", qty: "", total: "" }] }));

  const removeItem = (i: number) =>
    setD((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  const itemsSum = d.items.reduce((s, it) => s + (Number(it.total) || 0), 0);

  const save = () => {
    const items: ExpenseItem[] = d.items
      .filter((it) => it.label.trim() || it.total)
      .map((it) => ({
        label: it.label.trim(),
        qty: it.qty === "" ? null : Number(it.qty),
        total: Number(it.total) || 0,
      }));
    const payload = {
      title: d.title.trim() || "Výdaj",
      category: d.category.trim() || "Ostatní",
      supplier: d.supplier.trim(),
      date: d.date,
      amount: Number(d.amount) || 0,
      items,
      pdfUrl: d.pdfUrl.trim(),
      note: d.note.trim(),
    };
    if (expense) {
      updateExpense(expense.id, payload);
      onDone("Výdaj upraven.");
    } else {
      addExpense(payload);
      onDone("Výdaj přidán.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Název" className="sm:col-span-2">
          <Input
            value={d.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Např. Dokopné – hospoda U Nádraží"
          />
        </Field>
        <div>
          <Label>Kategorie</Label>
          <Input
            list="expense-categories"
            value={d.category}
            onChange={(e) => set({ category: e.target.value })}
            placeholder="Oblečení"
          />
          <datalist id="expense-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <Field label="Dodavatel / komu">
          <Input
            value={d.supplier}
            onChange={(e) => set({ supplier: e.target.value })}
            placeholder="Např. Teamline s.r.o."
          />
        </Field>
        <Field label="Datum">
          <Input
            type="date"
            value={d.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </Field>
        <Field label="Částka celkem (Kč)">
          <Input
            type="number"
            inputMode="numeric"
            value={d.amount}
            onChange={(e) => set({ amount: e.target.value })}
            placeholder="0"
          />
        </Field>
        <Field label="Odkaz na doklad (PDF/foto) – nepovinné" className="sm:col-span-2">
          <Input
            value={d.pdfUrl}
            onChange={(e) => set({ pdfUrl: e.target.value })}
            placeholder="/vydaje/… nebo https://…"
          />
        </Field>
      </div>

      {/* Položky */}
      <div className="rounded-lg border border-line bg-panel-2/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <Label className="mb-0">Rozpis položek (nepovinné)</Label>
          {itemsSum > 0 && (
            <button
              type="button"
              onClick={() => set({ amount: String(itemsSum) })}
              className="text-xs text-gold hover:underline"
              title="Nastavit částku celkem podle součtu položek"
            >
              Součet: {formatKc(itemsSum)} → použít
            </button>
          )}
        </div>
        <div className="space-y-2">
          {d.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={it.label}
                onChange={(e) => setItem(i, { label: e.target.value })}
                placeholder="Položka (např. Dresy)"
                className="flex-1"
              />
              <Input
                type="number"
                value={it.qty}
                onChange={(e) => setItem(i, { qty: e.target.value })}
                placeholder="ks"
                className="w-16"
              />
              <Input
                type="number"
                value={it.total}
                onChange={(e) => setItem(i, { total: e.target.value })}
                placeholder="Kč"
                className="w-24"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="shrink-0 rounded-md px-2 py-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
                aria-label="Smazat položku"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-gold hover:underline"
          >
            + Přidat položku
          </button>
        </div>
      </div>

      <Field label="Poznámka – nepovinné">
        <Textarea
          value={d.note}
          onChange={(e) => set({ note: e.target.value })}
          rows={2}
          placeholder="Např. číslo faktury, variabilní symbol…"
        />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel}>
          Zrušit
        </Button>
        <Button variant="primary" onClick={save}>
          {expense ? "Uložit změny" : "Přidat výdaj"}
        </Button>
      </div>
    </div>
  );
}
