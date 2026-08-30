"use client";

import { useStore } from "@/lib/store";
import { FineSchedule } from "@/components/fines/FineSchedule";
import { FineScheduleView } from "@/components/fines/FineScheduleView";

export default function SazebnikPage() {
  const { isAdmin, ready } = useStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Sazebník pokut</h1>
        <p className="text-sm text-zinc-400">
          FA Horšovský Týn · muži A
          {ready && isAdmin
            ? " · můžeš upravovat názvy i částky"
            : " · přehled platných pokut"}
        </p>
      </div>

      {!ready ? (
        <div className="py-16 text-center text-zinc-500">Načítám…</div>
      ) : isAdmin ? (
        <FineSchedule />
      ) : (
        <FineScheduleView />
      )}
    </div>
  );
}
