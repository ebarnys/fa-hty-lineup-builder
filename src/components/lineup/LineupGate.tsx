"use client";

import { AdminOnly } from "@/components/AdminOnly";
import { LineupEditor } from "./LineupEditor";

/** Sestava je jen pro admina. */
export function LineupGate() {
  return (
    <AdminOnly>
      <LineupEditor />
    </AdminOnly>
  );
}
