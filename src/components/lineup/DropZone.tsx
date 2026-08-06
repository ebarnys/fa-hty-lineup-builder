"use client";

import { useDroppable } from "@dnd-kit/core";

/** Obecná zóna, na kterou lze upustit hráče (náhradníci / mimo nominaci). */
export function DropZone({
  id,
  zone,
  title,
  count,
  children,
  emptyText,
  className = "",
}: {
  id: string;
  zone: "bench" | "pool";
  title: string;
  count: number;
  children: React.ReactNode;
  emptyText: string;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { zone } });

  return (
    <div
      className={`rounded-xl border bg-panel/70 transition-colors ${
        isOver ? "border-gold ring-1 ring-gold/40" : "border-line"
      } ${className}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-line/70">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-zinc-500">{count}</span>
      </div>
      <div ref={setNodeRef} className="p-2.5 min-h-[72px]">
        {count === 0 ? (
          <p className="text-xs text-zinc-500 py-3 text-center">{emptyText}</p>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
      </div>
    </div>
  );
}
