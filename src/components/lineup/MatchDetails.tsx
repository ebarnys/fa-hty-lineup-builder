"use client";

import { Field, Input, Select, Textarea } from "@/components/ui/Ui";
import { fullName } from "@/lib/players";
import type { Lineup, Player } from "@/lib/types";

/** Formulář s detaily zápasu a volbou kapitána/brankáře. */
export function MatchDetails({
  lineup,
  players,
  onChange,
}: {
  lineup: Lineup;
  players: Player[];
  onChange: (patch: Partial<Lineup>) => void;
}) {
  // Do rolí kapitána/brankáře nabízíme jen hráče, kteří jsou v nominaci.
  const nominated = [
    ...lineup.onField.map((f) => f.playerId),
    ...lineup.bench,
  ];
  const nominatedPlayers = players.filter((p) => nominated.includes(p.id));
  const goalkeepers = nominatedPlayers.filter(
    (p) => p.mainPosition === "GK" || lineup.goalkeeperId === p.id
  );
  const gkOptions = goalkeepers.length > 0 ? goalkeepers : nominatedPlayers;

  return (
    <div className="space-y-3">
      <Field label="Název sestavy">
        <Input
          value={lineup.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Sestava na sobotu"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Soupeř">
          <Input
            value={lineup.opponent}
            onChange={(e) => onChange({ opponent: e.target.value })}
            placeholder="Sokol Blížejov"
          />
        </Field>
        <Field label="Místo">
          <Input
            value={lineup.venue}
            onChange={(e) => onChange({ venue: e.target.value })}
            placeholder="Stadion HTý"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Datum">
          <Input
            type="date"
            value={lineup.matchDate}
            onChange={(e) => onChange({ matchDate: e.target.value })}
          />
        </Field>
        <Field label="Čas">
          <Input
            type="time"
            value={lineup.matchTime}
            onChange={(e) => onChange({ matchTime: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prostředí">
          <Select
            value={lineup.isHome ? "home" : "away"}
            onChange={(e) => onChange({ isHome: e.target.value === "home" })}
          >
            <option value="home">Domácí</option>
            <option value="away">Venkovní</option>
          </Select>
        </Field>
        <div />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Kapitán">
          <Select
            value={lineup.captainId ?? ""}
            onChange={(e) => onChange({ captainId: e.target.value || null })}
          >
            <option value="">— nevybráno —</option>
            {nominatedPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {fullName(p)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Brankář">
          <Select
            value={lineup.goalkeeperId ?? ""}
            onChange={(e) => onChange({ goalkeeperId: e.target.value || null })}
          >
            <option value="">— nevybráno —</option>
            {gkOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {fullName(p)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Poznámka k zápasu">
        <Textarea
          rows={2}
          value={lineup.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="Taktika, standardky, sledovaní hráči…"
        />
      </Field>
    </div>
  );
}
