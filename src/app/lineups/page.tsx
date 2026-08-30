"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { getFormation } from "@/lib/formations";
import { AdminOnly } from "@/components/AdminOnly";
import type { Lineup } from "@/lib/types";

export default function LineupsPage() {
  const { data, ready, duplicateLineup, removeLineup } = useStore();
  const router = useRouter();
  const [toDelete, setToDelete] = useState<Lineup | null>(null);

  const lineups = [...data.lineups].sort((a, b) => b.updatedAt - a.updatedAt);

  const onDuplicate = (id: string) => {
    const copy = duplicateLineup(id);
    if (copy) router.push(`/lineup?id=${copy.id}`);
  };

  return (
    <AdminOnly>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Uložené sestavy
          </h1>
          <p className="text-sm text-zinc-400">
            {ready ? `${lineups.length} uložených sestav` : "Načítám…"}
          </p>
        </div>
        <Link href="/lineup">
          <Button variant="primary">+ Nová sestava</Button>
        </Link>
      </div>

      {lineups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
          Zatím nemáš uloženou žádnou sestavu.{" "}
          <Link href="/lineup" className="text-gold hover:underline">
            Vytvoř první
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineups.map((l) => {
            const formation = getFormation(l.formationId);
            return (
              <Card key={l.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{l.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {l.opponent ? `vs ${l.opponent}` : "bez soupeře"}
                      {l.matchDate ? ` · ${formatDate(l.matchDate)}` : ""}
                      {" · "}
                      {l.isHome ? "domácí" : "venkovní"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs px-2 py-1 rounded-md bg-gold/15 text-gold border border-gold/25 font-medium">
                    {formation.name}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span>{l.onField.length}/11 na hřišti</span>
                  <span>{l.bench.length} náhradníků</span>
                  <span>upraveno {formatDate(dateOf(l.updatedAt))}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/lineup?id=${l.id}`} className="flex-1 min-w-[110px]">
                    <Button variant="primary" size="sm" className="w-full">
                      Otevřít
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDuplicate(l.id)}
                  >
                    Duplikovat
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setToDelete(l)}
                  >
                    Smazat
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Smazat sestavu"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-zinc-300">
          Opravdu smazat sestavu{" "}
          <span className="font-semibold text-zinc-100">{toDelete?.name}</span>?
          Tuto akci nelze vrátit zpět.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={() => setToDelete(null)}>
            Zrušit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (toDelete) removeLineup(toDelete.id);
              setToDelete(null);
            }}
          >
            Smazat
          </Button>
        </div>
      </Modal>
    </div>
    </AdminOnly>
  );
}

function dateOf(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
