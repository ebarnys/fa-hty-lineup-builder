"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Input, Select } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { PlayerRow } from "@/components/players/PlayerRow";
import { PlayerForm, type PlayerDraft } from "@/components/players/PlayerForm";
import { AVAILABILITIES, FEET, POSITIONS } from "@/lib/positions";
import { fullName } from "@/lib/players";
import { AdminOnly } from "@/components/AdminOnly";
import type { Player } from "@/lib/types";

/** Podle čeho se dá seznam seřadit. */
type SortKey = "number" | "firstName" | "lastName" | "mainPosition" | "availability";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "lastName", label: "Příjmení" },
  { key: "firstName", label: "Jméno" },
  { key: "number", label: "Číslo" },
  { key: "mainPosition", label: "Pozice" },
  { key: "availability", label: "Dostupnost" },
];

const POS_ORDER = new Map(POSITIONS.map((p, i) => [p.code, i]));
const AVAIL_ORDER = new Map(AVAILABILITIES.map((a, i) => [a.value, i]));

export default function PlayersPage() {
  const { data, ready, addPlayer, updatePlayer, removePlayer } = useStore();

  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [footFilter, setFootFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [toDelete, setToDelete] = useState<Player | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("lastName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dir = sortDir === "asc" ? 1 : -1;
    const cmp = (a: Player, b: Player): number => {
      switch (sortKey) {
        case "number": {
          // Prázdné číslo vždy na konec (bez ohledu na směr).
          const av = a.number ?? Infinity;
          const bv = b.number ?? Infinity;
          if (av === bv) return fullName(a).localeCompare(fullName(b), "cs");
          return (av - bv) * dir;
        }
        case "firstName":
          return (a.firstName || "￿").localeCompare(b.firstName || "￿", "cs") * dir;
        case "lastName":
          return (a.lastName || "￿").localeCompare(b.lastName || "￿", "cs") * dir;
        case "mainPosition":
          return ((POS_ORDER.get(a.mainPosition) ?? 99) - (POS_ORDER.get(b.mainPosition) ?? 99)) * dir
            || fullName(a).localeCompare(fullName(b), "cs");
        case "availability":
          return ((AVAIL_ORDER.get(a.availability) ?? 99) - (AVAIL_ORDER.get(b.availability) ?? 99)) * dir
            || fullName(a).localeCompare(fullName(b), "cs");
      }
    };
    return data.players
      .filter((p) => {
        if (posFilter !== "all") {
          if (
            p.mainPosition !== posFilter &&
            !p.secondaryPositions.includes(posFilter as Player["mainPosition"])
          )
            return false;
        }
        if (availFilter !== "all" && p.availability !== availFilter) return false;
        if (footFilter !== "all" && p.foot !== footFilter) return false;
        if (q) {
          const hay = `${p.firstName} ${p.lastName} ${p.nickname}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort(cmp);
  }, [data.players, search, posFilter, availFilter, footFilter, sortKey, sortDir]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Player) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = (draft: PlayerDraft) => {
    if (editing) updatePlayer(editing.id, draft);
    else addPlayer(draft);
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (toDelete) removePlayer(toDelete.id);
    setToDelete(null);
  };

  const resetFilters = () => {
    setSearch("");
    setPosFilter("all");
    setAvailFilter("all");
    setFootFilter("all");
  };

  const hasFilters =
    search || posFilter !== "all" || availFilter !== "all" || footFilter !== "all";

  return (
    <AdminOnly>
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Hráči</h1>
          <p className="text-sm text-zinc-400">
            {ready ? `${data.players.length} hráčů v kádru` : "Načítám…"}
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          + Přidat hráče
        </Button>
      </div>

      {/* Filtry a vyhledávání */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Hledat podle jména…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
          <option value="all">Všechny pozice</option>
          {POSITIONS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.label}
            </option>
          ))}
        </Select>
        <Select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value)}
        >
          <option value="all">Jakákoliv dostupnost</option>
          {AVAILABILITIES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </Select>
        <Select value={footFilter} onChange={(e) => setFootFilter(e.target.value)}>
          <option value="all">Jakákoliv noha</option>
          {FEET.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label} noha
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>
            Zobrazeno {filtered.length} z {data.players.length}
          </span>
          <button
            onClick={resetFilters}
            className="text-gold hover:underline"
          >
            Zrušit filtry
          </button>
        </div>
      )}

      {/* Řazení na mobilu */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-xs text-zinc-500">Seřadit:</span>
          <Select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-9 w-auto flex-1 py-1 text-xs"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </Select>
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="h-9 rounded-lg border border-line bg-panel-2 px-3 text-xs text-zinc-300 hover:bg-line"
            aria-label="Změnit směr řazení"
          >
            {sortDir === "asc" ? "A–Z ↑" : "Z–A ↓"}
          </button>
        </div>
      )}

      {/* Seznam hráčů */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
          {data.players.length === 0
            ? "Zatím žádní hráči. Přidej prvního hráče tlačítkem výše."
            : "Žádný hráč neodpovídá zvoleným filtrům."}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Záhlaví s řazením (jen desktop) */}
          <div className="hidden grid-cols-[3rem_8rem_8rem_minmax(7rem,1fr)_auto_auto] items-center gap-x-3 px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 md:grid">
            <SortHeader label="#" active={sortKey === "number"} dir={sortDir} onClick={() => toggleSort("number")} className="justify-center" />
            <SortHeader label="Jméno" active={sortKey === "firstName"} dir={sortDir} onClick={() => toggleSort("firstName")} />
            <SortHeader label="Příjmení" active={sortKey === "lastName"} dir={sortDir} onClick={() => toggleSort("lastName")} />
            <span>Přezdívka</span>
            <SortHeader label="Pozice" active={sortKey === "mainPosition"} dir={sortDir} onClick={() => toggleSort("mainPosition")} />
            <span className="justify-self-end">Akce</span>
          </div>

          {filtered.map((p) => (
            <PlayerRow
              key={p.id}
              player={p}
              onOpen={() => openEdit(p)}
              onDelete={() => setToDelete(p)}
              onPatch={(patch) => updatePlayer(p.id, patch)}
            />
          ))}
        </div>
      )}

      {/* Modal formuláře */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Upravit hráče" : "Přidat hráče"}
      >
        <PlayerForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      {/* Potvrzení smazání */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Smazat hráče"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-zinc-300">
          Opravdu chceš smazat hráče{" "}
          <span className="font-semibold text-zinc-100">
            {toDelete && fullName(toDelete)}
          </span>
          ? Bude odebrán i ze všech uložených sestav.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={() => setToDelete(null)}>
            Zrušit
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Smazat
          </Button>
        </div>
      </Modal>
    </div>
    </AdminOnly>
  );
}

/** Klikací záhlaví sloupce se šipkou podle aktuálního řazení. */
function SortHeader({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-left uppercase transition-colors hover:text-zinc-200 ${
        active ? "text-gold" : "text-zinc-500"
      } ${className}`}
    >
      {label}
      <span className={active ? "opacity-100" : "opacity-0"}>
        {dir === "asc" ? "↑" : "↓"}
      </span>
    </button>
  );
}
