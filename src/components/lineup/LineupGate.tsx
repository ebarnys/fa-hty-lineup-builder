"use client";

import { useStore } from "@/lib/store";
import { LineupEditor } from "./LineupEditor";
import { LineupView } from "./LineupView";

/** Admin vidí editor, tým jen náhled sestavy. */
export function LineupGate() {
  const { isAdmin, ready } = useStore();
  if (!ready) {
    return <div className="py-20 text-center text-zinc-500">Načítám…</div>;
  }
  return isAdmin ? <LineupEditor /> : <LineupView />;
}
