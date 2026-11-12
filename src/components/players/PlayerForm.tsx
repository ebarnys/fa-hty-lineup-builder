"use client";

import { useState } from "react";
import { Button, Field, Input, Select, Textarea } from "@/components/ui/Ui";
import { AVAILABILITIES, FEET, POSITIONS } from "@/lib/positions";
import type { PlayerStats } from "@/lib/stats";
import type {
  Availability,
  Foot,
  Player,
  PositionCode,
} from "@/lib/types";

export type PlayerDraft = Omit<Player, "id">;

const EMPTY: PlayerDraft = {
  firstName: "",
  lastName: "",
  nickname: "",
  birthYear: null,
  mainPosition: "CM",
  secondaryPositions: [],
  foot: "right",
  number: null,
  note: "",
  availability: "available",
  memberId: "",
};

export function PlayerForm({
  initial,
  stats,
  onSubmit,
  onCancel,
}: {
  initial?: Player;
  stats?: PlayerStats;
  onSubmit: (draft: PlayerDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<PlayerDraft>(
    initial ? { ...initial } : EMPTY
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof PlayerDraft>(key: K, value: PlayerDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleSecondary = (code: PositionCode) =>
    setDraft((d) => ({
      ...d,
      secondaryPositions: d.secondaryPositions.includes(code)
        ? d.secondaryPositions.filter((c) => c !== code)
        : [...d.secondaryPositions, code],
    }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!draft.firstName.trim() && !draft.lastName.trim() && !draft.nickname.trim()) {
      e.name = "Vyplň alespoň jméno, příjmení nebo přezdívku.";
    }
    if (draft.number !== null && (draft.number < 1 || draft.number > 99)) {
      e.number = "Číslo dresu musí být 1–99.";
    }
    const year = draft.birthYear;
    if (year !== null && (year < 1920 || year > 2025)) {
      e.birthYear = "Zadej platný rok narození.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      nickname: draft.nickname.trim(),
      note: draft.note.trim(),
      // Vedlejší pozice nesmí obsahovat hlavní pozici.
      secondaryPositions: draft.secondaryPositions.filter(
        (c) => c !== draft.mainPosition
      ),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {stats && stats.apps > 0 && <StatsSummary stats={stats} />}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Jméno">
          <Input
            value={draft.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Tomáš"
          />
        </Field>
        <Field label="Příjmení">
          <Input
            value={draft.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Novák"
          />
        </Field>
      </div>
      {errors.name && <p className="text-xs text-red-400 -mt-2">{errors.name}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Přezdívka">
          <Input
            value={draft.nickname}
            onChange={(e) => set("nickname", e.target.value)}
            placeholder="Tom"
          />
        </Field>
        <Field label="Rok narození">
          <Input
            type="number"
            inputMode="numeric"
            value={draft.birthYear ?? ""}
            onChange={(e) =>
              set("birthYear", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="1996"
          />
        </Field>
      </div>
      {errors.birthYear && (
        <p className="text-xs text-red-400 -mt-2">{errors.birthYear}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Hlavní pozice">
          <Select
            value={draft.mainPosition}
            onChange={(e) => set("mainPosition", e.target.value as PositionCode)}
          >
            {POSITIONS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Číslo dresu">
          <Input
            type="number"
            inputMode="numeric"
            value={draft.number ?? ""}
            onChange={(e) =>
              set("number", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="9"
          />
        </Field>
      </div>
      {errors.number && (
        <p className="text-xs text-red-400 -mt-2">{errors.number}</p>
      )}

      <div>
        <p className="block text-xs font-medium text-zinc-400 mb-1.5">
          Vedlejší pozice
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POSITIONS.filter((p) => p.code !== draft.mainPosition).map((p) => {
            const active = draft.secondaryPositions.includes(p.code);
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => toggleSecondary(p.code)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  active
                    ? "bg-gold/20 border-gold/50 text-gold"
                    : "bg-panel-2 border-line text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Preferovaná noha">
          <Select
            value={draft.foot}
            onChange={(e) => set("foot", e.target.value as Foot)}
          >
            {FEET.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Dostupnost">
          <Select
            value={draft.availability}
            onChange={(e) =>
              set("availability", e.target.value as Availability)
            }
          >
            {AVAILABILITIES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="ID člena (FAČR)">
        <Input
          inputMode="numeric"
          value={draft.memberId}
          onChange={(e) => set("memberId", e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="např. 95071526 – páruje statistiky ze zápisů"
        />
      </Field>

      <Field label="Poznámka">
        <Textarea
          rows={2}
          value={draft.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Krátká poznámka k hráči…"
        />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Zrušit
        </Button>
        <Button type="submit" variant="primary">
          {initial ? "Uložit změny" : "Přidat hráče"}
        </Button>
      </div>
    </form>
  );
}

/** Sezónní statistiky hráče v detailu (jen pro čtení). */
function StatsSummary({ stats }: { stats: PlayerStats }) {
  const [open, setOpen] = useState(false);
  const items: [string, string | number][] = [
    ["Zápasů", stats.apps],
    ["V základu", stats.starts],
    ["Minut", stats.minutes],
    ["Ø min", stats.avgMinutes],
    ["Góly", stats.goals],
    ["ŽK / ČK", `${stats.yellow} / ${stats.red}`],
  ];
  return (
    <div className="rounded-lg border border-gold/25 bg-gold/5 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gold">
        Statistiky sezony
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {items.map(([label, val]) => (
          <div key={label} className="text-center">
            <div className="text-lg font-extrabold tabular-nums">{val}</div>
            <div className="text-[10px] text-zinc-400">{label}</div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 text-xs text-gold hover:underline"
      >
        {open ? "Skrýt zápasy" : "Zobrazit zápas po zápase"}
      </button>
      {open && (
        <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
          {stats.perMatch.map(({ match, app }) => (
            <div
              key={match.id}
              className="flex items-center justify-between gap-2 rounded bg-panel-2/50 px-2 py-1 text-xs"
            >
              <span className="min-w-0 truncate text-zinc-300">
                {match.round ? `${match.round}. k. ` : ""}
                {match.home ? "" : "@ "}
                {match.opponent}
              </span>
              <span className="shrink-0 text-zinc-400">
                {app.started ? "základ" : "stříd."} · {app.minutes}′
                {app.goals ? ` · ${app.goals}g` : ""}
                {app.yellow ? ` · ${app.yellow}ŽK` : ""}
                {app.red ? ` · ${app.red}ČK` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { EMPTY as EMPTY_PLAYER };
