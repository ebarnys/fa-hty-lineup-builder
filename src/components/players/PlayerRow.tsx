"use client";

import { useRef, useState } from "react";
import { availabilityMeta, positionShort } from "@/lib/positions";
import type { Player } from "@/lib/types";

/** Inline textové políčko – vypadá jako text, po kliknutí se dá editovat.
 *  Uloží se při opuštění (blur) nebo Enteru, Escape vrátí původní hodnotu. */
function InlineText({
  value,
  onCommit,
  placeholder,
  className = "",
  ariaLabel,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel: string;
}) {
  const [val, setVal] = useState(value);
  const [prev, setPrev] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  // Když se hodnota změní zvenčí (úprava jinde, přepnutí), srovnej lokální stav.
  if (prev !== value) {
    setPrev(value);
    setVal(value);
  }

  const commit = () => {
    const next = val.trim();
    if (next !== value) onCommit(next);
  };

  return (
    <input
      ref={ref}
      aria-label={ariaLabel}
      value={val}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          ref.current?.blur();
        } else if (e.key === "Escape") {
          setVal(value);
          requestAnimationFrame(() => ref.current?.blur());
        }
      }}
      className={`w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none hover:border-line hover:bg-panel-2/60 focus:border-gold/70 focus:bg-panel-2 focus:ring-1 focus:ring-gold/30 transition ${className}`}
    />
  );
}

/** Inline číslo dresu (1–99, nebo prázdné). */
function InlineNumber({
  value,
  onCommit,
  ariaLabel,
}: {
  value: number | null;
  onCommit: (next: number | null) => void;
  ariaLabel: string;
}) {
  const [val, setVal] = useState(value === null ? "" : String(value));
  const [prev, setPrev] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  if (prev !== value) {
    setPrev(value);
    setVal(value === null ? "" : String(value));
  }

  const commit = () => {
    const raw = val.trim();
    let next: number | null = raw === "" ? null : Number(raw);
    if (next !== null) {
      if (!Number.isFinite(next)) next = value; // neplatné → vrať původní
      else next = Math.max(1, Math.min(99, Math.round(next)));
    }
    if (next !== value) onCommit(next);
    setVal(next === null ? "" : String(next));
  };

  return (
    <input
      ref={ref}
      aria-label={ariaLabel}
      value={val}
      inputMode="numeric"
      placeholder="–"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ""))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          ref.current?.blur();
        } else if (e.key === "Escape") {
          setVal(value === null ? "" : String(value));
          requestAnimationFrame(() => ref.current?.blur());
        }
      }}
      className="h-9 w-11 shrink-0 rounded-md border border-gold/25 bg-gold/10 text-center text-sm font-extrabold text-gold outline-none hover:border-gold/50 focus:border-gold focus:ring-1 focus:ring-gold/40 transition"
    />
  );
}

/** Jeden řádek hráče v seznamu. Klik na řádek (mimo políčka a tlačítka)
 *  otevře detail; číslo, jméno a příjmení lze upravit přímo v řádku. */
export function PlayerRow({
  player,
  onOpen,
  onDelete,
  onPatch,
}: {
  player: Player;
  onOpen: () => void;
  onDelete: () => void;
  onPatch: (patch: Partial<Player>) => void;
}) {
  const av = availabilityMeta(player.availability);

  return (
    <div
      onClick={onOpen}
      className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-panel/70 px-3 py-2.5 transition-colors hover:border-gold/40 hover:bg-panel-2/50 md:grid-cols-[3rem_8rem_8rem_minmax(7rem,1fr)_auto_auto] md:gap-x-3 md:gap-y-3"
      title="Otevřít detail hráče"
    >
      {/* Číslo */}
      <div onClick={(e) => e.stopPropagation()} className="flex md:justify-center">
        <InlineNumber
          value={player.number}
          ariaLabel="Číslo dresu"
          onCommit={(n) => onPatch({ number: n })}
        />
      </div>

      {/* Jméno + příjmení (na mobilu pod sebou, na desktopu dva sloupce) */}
      <div className="col-span-2 flex min-w-0 flex-col gap-1 sm:flex-row md:col-span-1 md:contents">
        <div className="min-w-0 flex-1 md:col-start-2">
          <InlineText
            value={player.firstName}
            ariaLabel="Jméno"
            placeholder="Jméno"
            onCommit={(v) => onPatch({ firstName: v })}
          />
        </div>
        <div className="min-w-0 flex-1 md:col-start-3">
          <InlineText
            value={player.lastName}
            ariaLabel="Příjmení"
            placeholder="Příjmení"
            className="font-semibold"
            onCommit={(v) => onPatch({ lastName: v })}
          />
        </div>
      </div>

      {/* Přezdívka (skrytá na malých displejích) */}
      <div className="hidden min-w-0 md:block">
        <InlineText
          value={player.nickname}
          ariaLabel="Přezdívka"
          placeholder="Přezdívka"
          className="text-zinc-400"
          onCommit={(v) => onPatch({ nickname: v })}
        />
      </div>

      {/* Pozice + dostupnost */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="col-span-3 flex flex-wrap items-center gap-1.5 md:col-span-1 md:justify-start"
      >
        <span className="rounded-md border border-gold/25 bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">
          {positionShort(player.mainPosition)}
        </span>
        {player.secondaryPositions.map((c) => (
          <span
            key={c}
            className="rounded-md border border-line bg-panel-2 px-2 py-0.5 text-[11px] text-zinc-400"
          >
            {positionShort(c)}
          </span>
        ))}
        <span
          className={`ml-0.5 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${av.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${av.dot}`} />
          {av.label}
        </span>
      </div>

      {/* Akce */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="col-span-3 flex items-center justify-end gap-2 md:col-span-1"
      >
        <button
          onClick={onOpen}
          className="rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-line"
        >
          Detail
        </button>
        <button
          onClick={onDelete}
          aria-label="Smazat hráče"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/20"
        >
          Smazat
        </button>
      </div>
    </div>
  );
}
