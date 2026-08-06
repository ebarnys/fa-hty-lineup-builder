import { Suspense } from "react";
import { LineupEditor } from "@/components/lineup/LineupEditor";

export default function LineupPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Sestava</h1>
        <p className="text-sm text-zinc-400">
          Poskládej sestavu na další zápas přetahováním hráčů.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="py-20 text-center text-zinc-500">Načítám…</div>
        }
      >
        <LineupEditor />
      </Suspense>
    </div>
  );
}
