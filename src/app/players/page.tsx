"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Input, Select } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { PlayerCard } from "@/components/players/PlayerCard";
import { PlayerForm, type PlayerDraft } from "@/components/players/PlayerForm";
import { AVAILABILITIES, FEET, POSITIONS } from "@/lib/positions";
import { fullName } from "@/lib/players";
import type { Player } from "@/lib/types";

export default function PlayersPage() {
  const { data, ready, addPlayer, updatePlayer, removePlayer } = useStore();

  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [footFilter, setFootFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [toDelete, setToDelete] = useState<Player | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
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
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "cs"));
  }, [data.players, search, posFilter, availFilter, footFilter]);

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

      {/* Seznam hráčů */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center text-zinc-500">
          {data.players.length === 0
            ? "Zatím žádní hráči. Přidej prvního hráče tlačítkem výše."
            : "Žádný hráč neodpovídá zvoleným filtrům."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              onEdit={() => openEdit(p)}
              onDelete={() => setToDelete(p)}
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
  );
}
