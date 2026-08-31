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
  collapsible = false,
  collapsed = false,
  onToggle,
}: {
  id: string;
  zone: "bench" | "pool";
  title: string;
  count: number;
  children: React.ReactNode;
  emptyText: string;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { zone } });

  return (
    <div
      className={`rounded-xl border bg-panel/70 transition-colors ${
        isOver ? "border-gold ring-1 ring-gold/40" : "border-line"
      } ${className}`}
    >
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        className={`w-full flex items-center justify-between px-3 py-2 border-b border-line/70 ${
          collapsible ? "cursor-pointer hover:bg-panel-2/50" : "cursor-default"
        }`}
      >
        <span className="flex items-center gap-2">
          {collapsible && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform ${collapsed ? "" : "rotate-90"}`}
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <h3 className="text-sm font-semibold">{title}</h3>
        </span>
        <span className="text-xs text-zinc-500">{count}</span>
      </button>
      <div ref={setNodeRef} className={collapsed ? "p-2" : "p-2.5 min-h-[72px]"}>
        {collapsed ? (
          <p className="text-[11px] text-zinc-500 text-center py-1">
            Sbaleno – rozbal kliknutím, nebo sem přetáhni hráče
          </p>
        ) : count === 0 ? (
          <p className="text-xs text-zinc-500 py-3 text-center">{emptyText}</p>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
      </div>
    </div>
  );
}
