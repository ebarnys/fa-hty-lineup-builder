"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

/** Obalí obsah přístupný jen adminovi. Pro tým zobrazí informaci. */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin, ready } = useStore();
  if (!ready) return null;
  if (isAdmin) return <>{children}</>;
  return (
    <div className="rounded-2xl border border-line bg-panel/70 p-10 text-center max-w-xl mx-auto mt-8">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold">Jen pro admina</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Tato sekce je přístupná jen správci. Přihlas se přes tlačítko{" "}
        <span className="text-gold font-medium">Admin</span> nahoře. Tým má
        přístup k{" "}
        <Link href="/pokuty" className="text-gold hover:underline">
          Pokutám
        </Link>{" "}
        a{" "}
        <Link href="/sazebnik" className="text-gold hover:underline">
          Sazebníku
        </Link>
        .
      </p>
    </div>
  );
}
