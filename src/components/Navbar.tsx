"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Přehled" },
  { href: "/players", label: "Hráči" },
  { href: "/lineup", label: "Sestava" },
  { href: "/lineups", label: "Uložené sestavy" },
  { href: "/settings", label: "Data" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-gold/15 text-gold"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-panel-2"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-zinc-300 hover:bg-panel-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line/70 px-4 py-2 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(l.href)
                  ? "bg-gold/15 text-gold"
                  : "text-zinc-300 hover:bg-panel-2"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
