"use client";

import { Card } from "@/components/ui/Ui";
import { useStore } from "@/lib/store";
import { formatKc } from "@/lib/fines";

/** Read-only zobrazení sazebníku pokut (pro spoluhráče). */
export function FineScheduleView() {
  const { data } = useStore();

  if (data.fineTypes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
        Sazebník zatím není nastavený.
      </div>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <ul className="divide-y divide-line/60">
        {data.fineTypes.map((t, i) => (
          <li
            key={t.id}
            className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-panel-2/40 transition-colors"
          >
            <span className="w-8 shrink-0 text-lg font-extrabold text-gold text-right">
              {i + 1}.
            </span>
            <span className="flex-1 text-sm sm:text-base font-medium text-zinc-100 leading-snug">
              {t.label}
            </span>
            <span className="shrink-0 text-base sm:text-lg font-extrabold text-gold whitespace-nowrap">
              {formatKc(t.amount)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
