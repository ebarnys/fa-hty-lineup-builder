"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Ui";
import { AVAILABILITIES } from "@/lib/positions";

export default function DashboardPage() {
  const { data, ready, isAdmin } = useStore();
  const router = useRouter();

  // Přehled je jen pro admina; tým přesměrujeme na Pokuty.
  useEffect(() => {
    if (ready && !isAdmin) router.replace("/pokuty");
  }, [ready, isAdmin, router]);

  if (ready && !isAdmin) return null;

  const availableCount = data.players.filter(
    (p) => p.availability === "available"
  ).length;

  const stats = [
    { label: "Hráčů celkem", value: data.players.length, href: "/players" },
    { label: "Dostupných", value: availableCount, href: "/players" },
    { label: "Uložených sestav", value: data.lineups.length, href: "/lineups" },
  ];

  const recent = [...data.lineups]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-line bg-gradient-to-br from-panel to-ink p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Vítej zpět 👋
        </h1>
        <p className="mt-2 text-zinc-400 max-w-2xl">
          Evidenci hráčů a skládání sestavy na další zápas máš na jednom místě.
          Všechna data zůstávají uložená přímo v tomto prohlížeči.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/lineup"
            className="rounded-lg bg-gold text-ink font-semibold px-4 py-2.5 text-sm hover:bg-gold-soft transition-colors"
          >
            Poskládat sestavu
          </Link>
          <Link
            href="/players"
            className="rounded-lg border border-line bg-panel-2 px-4 py-2.5 text-sm hover:bg-line transition-colors"
          >
            Spravovat hráče
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 hover:border-gold/50 transition-colors">
              <div className="text-3xl font-extrabold text-gold">
                {ready ? s.value : "–"}
              </div>
              <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="font-semibold mb-3">Dostupnost kádru</h2>
          <div className="space-y-2">
            {AVAILABILITIES.map((a) => {
              const count = data.players.filter(
                (p) => p.availability === a.value
              ).length;
              const pct = data.players.length
                ? Math.round((count / data.players.length) * 100)
                : 0;
              return (
                <div key={a.value} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
                  <span className="text-sm text-zinc-300 w-28">{a.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-panel-2 overflow-hidden">
                    <div
                      className={`h-full ${a.dot}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-zinc-400 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Poslední sestavy</h2>
            <Link href="/lineups" className="text-xs text-gold hover:underline">
              Zobrazit vše
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Zatím žádná uložená sestava. Vytvoř první v sekci{" "}
              <Link href="/lineup" className="text-gold hover:underline">
                Sestava
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-line/60">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/lineup?id=${l.id}`}
                    className="flex items-center justify-between py-2.5 hover:text-gold transition-colors"
                  >
                    <span className="text-sm font-medium">{l.name}</span>
                    <span className="text-xs text-zinc-500">
                      {l.opponent ? `vs ${l.opponent}` : l.formationId}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
