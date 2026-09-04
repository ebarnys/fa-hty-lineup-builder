"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pitch } from "./Pitch";
import { DropZone } from "./DropZone";
import { PoolPlayer } from "./PoolPlayer";
import { BoardHeader } from "./BoardHeader";
import { MatchDetails } from "./MatchDetails";
import { WarningsPanel } from "./WarningsPanel";
import { Button, Input, Select } from "@/components/ui/Ui";
import { FORMATIONS, getFormation } from "@/lib/formations";
import { newLineup, useStore } from "@/lib/store";
import {
  applyFormation,
  autoFill,
  moveToBench,
  nearestFreeSlot,
  placeOnField,
  pruneLineup,
  removeFromLineup,
} from "@/lib/lineupOps";
import { checkLineup } from "@/lib/validation";
import { exportNodeToPng } from "@/lib/exportImage";
import { fullName, playerById } from "@/lib/players";
import type { Lineup, Player } from "@/lib/types";

const DRAFT_KEY = "fa-hty-draft";

export function LineupEditor() {
  const { data, ready, saveLineup } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const idParam = params.get("id");

  const [lineup, setLineup] = useState<Lineup>(() => newLineup());
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [poolSearch, setPoolSearch] = useState("");
  const [poolCollapsed, setPoolCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  // Počáteční načtení sestavy.
  // - `?id`: vždy čerstvá uložená verze ze serveru (ne starý lokální koncept).
  // - bez id: poslední uložená (sdílená) sestava; lokální koncept se použije
  //   jen když jde o rozpracovanou NEULOŽENOU sestavu.
  useEffect(() => {
    if (!ready || initialized) return;
    let next: Lineup | null = null;
    const rawDraft =
      typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    const draft = rawDraft ? (JSON.parse(rawDraft) as Lineup) : null;

    if (idParam) {
      const found = data.lineups.find((l) => l.id === idParam);
      next = found ? structuredClone(found) : null;
    } else {
      const latest =
        data.lineups.length > 0
          ? [...data.lineups].sort((a, b) => b.updatedAt - a.updatedAt)[0]
          : null;
      const draftIsUnsaved =
        draft && !data.lineups.some((l) => l.id === draft.id);
      if (draftIsUnsaved) next = draft; // rozpracovaná neuložená sestava
      else if (latest) next = structuredClone(latest); // sdílená poslední
      else if (draft) next = draft;
    }

    /* eslint-disable react-hooks/set-state-in-effect */
    // Ihned odstraníme odkazy na neexistující hráče (např. po smazání/importu).
    setLineup(pruneLineup(next ?? newLineup(), data.players));
    setInitialized(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ready, initialized, idParam, data.lineups, data.players]);

  // Průběžné pročištění: kdykoliv se změní seznam hráčů (smazání, import),
  // odstraníme ze sestavy hráče, kteří už neexistují.
  useEffect(() => {
    if (!initialized) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setLineup((l) => pruneLineup(l, data.players));
  }, [data.players, initialized]);

  // Průběžné ukládání rozpracované sestavy (přežije obnovení stránky).
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(lineup));
  }, [lineup, initialized]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const update = useCallback((patch: Partial<Lineup>) => {
    setLineup((l) => ({ ...l, ...patch }));
    setDirty(true);
  }, []);

  const mutate = useCallback((fn: (l: Lineup) => Lineup) => {
    setLineup((l) => fn(l));
    setDirty(true);
  }, []);

  // Rozdělení hráčů do skupin.
  const onFieldIds = useMemo(
    () => new Set(lineup.onField.map((f) => f.playerId)),
    [lineup.onField]
  );
  const benchPlayers = useMemo(
    () =>
      lineup.bench
        .map((id) => playerById(data.players, id))
        .filter((p): p is Player => !!p),
    [lineup.bench, data.players]
  );
  const poolPlayers = useMemo(() => {
    const q = poolSearch.trim().toLowerCase();
    return data.players
      .filter((p) => !onFieldIds.has(p.id) && !lineup.bench.includes(p.id))
      .filter((p) =>
        q ? `${p.firstName} ${p.lastName} ${p.nickname}`.toLowerCase().includes(q) : true
      )
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "cs"));
  }, [data.players, onFieldIds, lineup.bench, poolSearch]);

  const warnings = useMemo(
    () => checkLineup(lineup, data.players),
    [lineup, data.players]
  );

  // --- Drag & drop ---
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const onDragStart = (e: DragStartEvent) => {
    const pid = e.active.data.current?.playerId as string | undefined;
    setActivePlayer(pid ? playerById(data.players, pid) : null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActivePlayer(null);
    const { active, over } = e;
    if (!over) return;
    const playerId = active.data.current?.playerId as string;
    const zone = over.data.current?.zone as "pitch" | "bench" | "pool";
    if (!playerId || !zone) return;

    if (zone === "pitch") {
      const overRect = over.rect;
      const dragged = active.rect.current.translated;
      if (!dragged) return;
      const cx = dragged.left + dragged.width / 2;
      const cy = dragged.top + dragged.height / 2;
      const x = clamp(((cx - overRect.left) / overRect.width) * 100, 4, 96);
      const y = clamp(((cy - overRect.top) / overRect.height) * 100, 5, 95);
      const fromField = active.data.current?.from === "field";
      const before = lineup.onField.length;
      mutate((l) => {
        // Volné pozice bez taženého hráče (aby uvolnil svou vlastní pozici).
        const others = l.onField.filter((f) => f.playerId !== playerId);
        const slot = nearestFreeSlot(getFormation(l.formationId), others, x, y);
        // Hráče ze seznamu/lavičky vždy zacvakni do nejbližší volné pozice;
        // hráče už na hřišti jen když ho pustíš blízko placeholderu.
        const snap = slot && (!fromField || dist(slot.x, slot.y, x, y) <= 13);
        const tx = snap ? slot!.x : x;
        const ty = snap ? slot!.y : y;
        return placeOnField(l, playerId, tx, ty);
      });
      // Upozornění při dosažení limitu 11.
      if (!onFieldIds.has(playerId) && before >= 11) {
        showToast("Na hřišti už je 11 hráčů.");
      }
    } else if (zone === "bench") {
      mutate((l) => moveToBench(l, playerId));
    } else if (zone === "pool") {
      mutate((l) => removeFromLineup(l, playerId));
    }
  };

  // --- Akce ---
  const handleFormation = (formationId: string) =>
    mutate((l) => applyFormation(l, formationId));

  const handleAutoFill = () => {
    mutate((l) => autoFill(l, data.players));
    showToast("Volné pozice doplněny.");
  };

  const handleClearField = () =>
    mutate((l) => ({ ...l, onField: [], bench: [] }));

  const handleSave = () => {
    saveLineup(lineup);
    setDirty(false);
    if (idParam !== lineup.id) router.replace(`/lineup?id=${lineup.id}`);
    showToast("Sestava uložena.");
  };

  const handleNew = () => {
    const fresh = newLineup();
    setLineup(fresh);
    setDirty(false);
    router.replace("/lineup");
    showToast("Nová sestava připravena.");
  };

  const handleExport = async () => {
    if (!boardRef.current) return;
    setExporting(true);
    try {
      const safe = (lineup.opponent || lineup.name || "sestava")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .toLowerCase();
      const res = await exportNodeToPng(boardRef.current, `sestava-${safe}`);
      showToast(
        res === "share"
          ? "Vyber „Uložit obrázek“ ve sdílení."
          : "Obrázek sestavy stažen."
      );
    } catch (err) {
      console.error(err);
      showToast("Export se nezdařil.");
    } finally {
      setExporting(false);
    }
  };

  if (!ready || !initialized) {
    return (
      <div className="py-20 text-center text-zinc-500">Načítám editor…</div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-5">
        {/* Horní lišta */}
        <div className="flex flex-wrap items-center gap-2.5 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Input
              value={lineup.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-56 font-semibold"
              placeholder="Název sestavy"
            />
            {dirty && (
              <span className="text-xs text-amber-400 whitespace-nowrap">
                • neuloženo
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={handleNew}>
              Nová
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Exportuji…" : "Exportovat PNG"}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Uložit sestavu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
          {/* Hrací plocha + náhradníci (tato část se exportuje) */}
          <div>
            <div
              ref={boardRef}
              className="rounded-2xl border border-line bg-panel p-3 sm:p-4 space-y-3"
            >
              <BoardHeader lineup={lineup} />
              <Pitch
                lineup={lineup}
                players={data.players}
                dragging={!!activePlayer}
              />
              {benchPlayers.length > 0 && (
                <div className="px-1 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-gold mb-2">
                    Náhradníci
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {benchPlayers.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-2 rounded-full bg-panel-2 border border-line/80 pl-1 pr-3 py-1"
                      >
                        <span className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-b from-gold to-gold-soft text-ink text-xs font-extrabold flex items-center justify-center">
                          {p.number ?? "–"}
                        </span>
                        <span className="text-xs font-semibold text-zinc-100">
                          {fullName(p)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(lineup.coach || lineup.manager) && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 px-1 pt-1 text-xs">
                  {lineup.coach && (
                    <span className="text-zinc-400">
                      Trenér:{" "}
                      <span className="text-zinc-100 font-medium">
                        {lineup.coach}
                      </span>
                    </span>
                  )}
                  {lineup.manager && (
                    <span className="text-zinc-400">
                      Vedoucí mužstva:{" "}
                      <span className="text-zinc-100 font-medium">
                        {lineup.manager}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Táhni hráče ze seznamu na hřiště, mezi pozicemi, na lavičku, nebo
              zpět do seznamu. Na hřišti je lze umístit kamkoliv.
            </p>
          </div>

          {/* Boční panel: rozestavení + seznam hráčů (mimo nominaci) */}
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-panel/70 p-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Rozestavení
                </label>
                <Select
                  value={lineup.formationId}
                  onChange={(e) => handleFormation(e.target.value)}
                >
                  {FORMATIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">
                  Na hřišti: {lineup.onField.length}/11
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleAutoFill}
                    className="text-gold hover:underline"
                  >
                    Doplnit
                  </button>
                  <button
                    onClick={handleClearField}
                    className="text-zinc-400 hover:text-red-300"
                  >
                    Vyprázdnit
                  </button>
                </div>
              </div>
            </div>

            {/* Lavička – hned vedle hřiště */}
            <DropZone
              id="bench"
              zone="bench"
              title="Náhradníci (lavička)"
              count={benchPlayers.length}
              emptyText="Sem přetáhni náhradníky."
            >
              {benchPlayers.map((p) => (
                <PoolPlayer key={p.id} player={p} from="bench" />
              ))}
            </DropZone>

            {/* Mimo nominaci – sbalitelné */}
            <DropZone
              id="pool"
              zone="pool"
              title="Hráči – mimo nominaci"
              count={poolPlayers.length}
              emptyText="Všichni hráči jsou v nominaci."
              collapsible
              collapsed={poolCollapsed}
              onToggle={() => setPoolCollapsed((v) => !v)}
              className={
                poolCollapsed ? "" : "lg:max-h-[460px] lg:overflow-y-auto"
              }
            >
              <div className="mb-2">
                <Input
                  placeholder="Hledat hráče…"
                  value={poolSearch}
                  onChange={(e) => setPoolSearch(e.target.value)}
                  className="text-xs py-1.5"
                />
              </div>
              {poolPlayers.map((p) => (
                <PoolPlayer key={p.id} player={p} from="pool" />
              ))}
            </DropZone>
          </div>
        </div>

        {/* Detail zápasu + kontroly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-line bg-panel/70 p-4">
            <h2 className="font-semibold mb-3">Detail zápasu</h2>
            <MatchDetails
              lineup={lineup}
              players={data.players}
              onChange={update}
            />
          </div>
          <div className="space-y-4">
            <WarningsPanel warnings={warnings} />
          </div>
        </div>
      </div>

      {/* Náhled taženého hráče */}
      <DragOverlay dropAnimation={null}>
        {activePlayer ? (
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-gold to-gold-soft text-ink pl-1 pr-3 py-1 shadow-xl shadow-black/50 border-2 border-white/70">
            <span className="h-8 w-8 rounded-full bg-ink/15 flex items-center justify-center font-extrabold">
              {activePlayer.number ?? "?"}
            </span>
            <span className="text-sm font-bold whitespace-nowrap">
              {fullName(activePlayer)}
            </span>
          </div>
        ) : null}
      </DragOverlay>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-panel-2 border border-line px-4 py-2.5 text-sm shadow-xl">
          {toast}
        </div>
      )}
    </DndContext>
  );
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}
