"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { formatKc } from "@/lib/fines";
import { SEED_EXPENSES } from "@/lib/seedExpenses";
import type { Expense } from "@/lib/types";

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${Number(d)}. ${Number(m)}. ${y}`;
}

export default function VydajePage() {
  const { data, ready, isAdmin, importExpenses, removeExpense } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  };

  const expenses = useMemo(
    () => [...data.expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [data.expenses]
  );

  const total = useMemo(
    () => data.expenses.reduce((s, e) => s + e.amount, 0),
    [data.expenses]
  );

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (e: Expense) => {
    setEditing(e);
    setFormOpen(true);
  };

  const handleImport = () => {
    const added = importExpenses(SEED_EXPENSES);
    showToast(
      added > 0 ? `Naimportováno ${added} faktur.` : "Faktury už byly přidané."
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Výdaje</h1>
          <p className="text-sm text-zinc-400">
            Transparentní přehled plateb za tým – dresy, oblečení, vybavení,
            dokopné. Doklady jsou k nahlédnutí všem.
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            {data.expenses.length === 0 && (
              <Button variant="secondary" onClick={handleImport}>
                Importovat faktury ({SEED_EXPENSES.length})
              </Button>
            )}
            <Button variant="primary" onClick={openNew}>
              + Přidat výdaj
            </Button>
          </div>
        )}
      </div>

      {/* Souhrn */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 sm:col-span-2">
          <div className="text-3xl font-extrabold text-gold">
            {ready ? formatKc(total) : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">
            Celkem zaplaceno za tým
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-3xl font-extrabold text-zinc-100">
            {ready ? data.expenses.length : "–"}
          </div>
          <div className="mt-1 text-sm text-zinc-400">Počet dokladů</div>
        </Card>
      </section>

      {/* Seznam výdajů */}
      {data.expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
          {isAdmin
            ? "Zatím žádné výdaje. Naimportuj faktury nebo přidej výdaj ručně."
            : "Zatím tu nejsou žádné doklady."}
        </div>
      ) : (
        <section className="space-y-4">
          {expenses.map((e) => (
            <Card key={e.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                      {e.category}
                    </span>
                    <h2 className="font-bold text-lg">{e.title}</h2>
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {e.supplier && <span>{e.supplier}</span>}
                    {e.supplier && e.date && <span> · </span>}
                    {e.date && <span>{formatDate(e.date)}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-zinc-100">
                    {formatKc(e.amount)}
                  </div>
                </div>
              </div>

              {/* Rozpis položek */}
              {e.items.length > 0 && (
                <div className="mt-4 overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-sm">
                    <tbody>
                      {e.items.map((it, i) => (
                        <tr
                          key={i}
                          className={`border-b border-line/50 last:border-0 ${
                            i % 2 ? "bg-panel/40" : ""
                          }`}
                        >
                          <td className="px-3 py-2">{it.label}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-zinc-400 w-20">
                            {it.qty != null ? `${it.qty} ks` : ""}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium w-28">
                            {formatKc(it.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {e.note && (
                <p className="mt-3 text-xs text-zinc-500">{e.note}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {e.pdfUrl && (
                  <a
                    href={e.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm font-medium text-zinc-100 hover:border-gold/50"
                  >
                    <PdfIcon /> Zobrazit doklad
                  </a>
                )}
                {isAdmin && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(e)}>
                      Upravit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Smazat výdaj „${e.title}"?`))
                          removeExpense(e.id);
                      }}
                    >
                      Smazat
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </section>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Upravit výdaj" : "Přidat výdaj"}
        maxWidth="max-w-2xl"
      >
        <ExpenseForm
          expense={editing ?? undefined}
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
  );
}

function PdfIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
