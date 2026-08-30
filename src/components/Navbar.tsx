"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Modal } from "./ui/Modal";
import { Button, Input } from "./ui/Ui";
import { useStore } from "@/lib/store";

const ADMIN_LINKS = [
  { href: "/", label: "Přehled" },
  { href: "/players", label: "Hráči" },
  { href: "/lineup", label: "Sestava" },
  { href: "/lineups", label: "Uložené sestavy" },
  { href: "/pokuty", label: "Pokuty" },
  { href: "/settings", label: "Data" },
];
const PUBLIC_LINKS = [
  { href: "/", label: "Přehled" },
  { href: "/lineup", label: "Sestava" },
  { href: "/pokuty", label: "Pokuty" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin, login, logout } = useStore();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const links = isAdmin ? ADMIN_LINKS : PUBLIC_LINKS;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const ok = await login(pw);
    setBusy(false);
    if (ok) {
      setLoginOpen(false);
      setPw("");
    } else {
      setErr(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
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
          {isAdmin ? (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-panel-2 flex items-center gap-1.5"
              title="Odhlásit z admin režimu"
            >
              <LockIcon open /> Odhlásit
            </button>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-gold hover:bg-gold/10 flex items-center gap-1.5"
              title="Přihlásit jako admin"
            >
              <LockIcon /> Admin
            </button>
          )}
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
          {links.map((l) => (
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
          {isAdmin ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-panel-2"
            >
              Odhlásit z admina
            </button>
          ) : (
            <button
              onClick={() => {
                setLoginOpen(true);
                setOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gold hover:bg-gold/10"
            >
              Přihlásit jako admin
            </button>
          )}
        </nav>
      )}

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Přihlášení admina"
        maxWidth="max-w-sm"
      >
        <form onSubmit={submit} className="space-y-3">
          <p className="text-sm text-zinc-400">
            Zadej admin heslo pro odemčení úprav (hráči, sestavy, pokuty).
          </p>
          <Input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr(false);
            }}
            placeholder="Heslo"
            autoFocus
          />
          {err && (
            <p className="text-xs text-red-400">Nesprávné heslo.</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLoginOpen(false)}
            >
              Zrušit
            </Button>
            <Button type="submit" variant="primary" disabled={busy || !pw}>
              {busy ? "Ověřuji…" : "Přihlásit"}
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
}

function LockIcon({ open = false }: { open?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="11"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d={
          open
            ? "M8 11V7a4 4 0 0 1 7.5-2"
            : "M8 11V7a4 4 0 0 1 8 0v4"
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
