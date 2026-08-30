"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_FORMATION_ID } from "./formations";
import { newId } from "./id";
import { emptyData, loadData, saveData } from "./storage";
import type {
  AppData,
  FineEntry,
  FineType,
  Lineup,
  Player,
} from "./types";

interface StoreValue {
  data: AppData;
  ready: boolean;
  // Hráči
  addPlayer: (p: Omit<Player, "id">) => Player;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  // Sestavy
  saveLineup: (l: Lineup) => void;
  createLineup: (partial?: Partial<Lineup>) => Lineup;
  duplicateLineup: (id: string) => Lineup | null;
  removeLineup: (id: string) => void;
  // Pokuty
  addFine: (f: Omit<FineEntry, "id" | "createdAt">) => void;
  addFines: (list: Omit<FineEntry, "id" | "createdAt">[]) => void;
  updateFine: (id: string, patch: Partial<FineEntry>) => void;
  removeFine: (id: string) => void;
  // Sazebník pokut
  addFineType: (t: Omit<FineType, "id">) => void;
  updateFineType: (id: string, patch: Partial<FineType>) => void;
  removeFineType: (id: string) => void;
  // Přístup
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  // Data celkově
  replaceData: (d: AppData) => void;
  resetDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function newLineup(partial: Partial<Lineup> = {}): Lineup {
  const now = Date.now();
  return {
    id: newId("lu"),
    name: "Nová sestava",
    opponent: "",
    matchDate: "",
    matchTime: "",
    venue: "",
    isHome: true,
    formationId: DEFAULT_FORMATION_ID,
    captainId: null,
    goalkeeperId: null,
    note: "",
    onField: [],
    bench: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => emptyData(false));
  const [ready, setReady] = useState(false);
  // serverMode = data se synchronizují do sdíleného úložiště přes /api/data.
  const [serverMode, setServerMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminTokenRef = useRef<string | null>(null);
  const firstLoad = useRef(true);

  // Ověření uloženého admin tokenu při startu.
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("fa-hty-admin")
        : null;
    if (!stored) return;
    (async () => {
      try {
        const r = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: stored }),
        });
        if (r.ok) {
          adminTokenRef.current = stored;
          setIsAdmin(true);
        } else {
          localStorage.removeItem("fa-hty-admin");
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Načtení dat: nejdřív zkusíme sdílené úložiště (API), jinak localStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/data", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && json?.configured) {
          if (json.data) {
            setData(json.data as AppData);
          } else {
            // První spuštění se sdíleným úložištěm – naplníme demo daty.
            const seeded = emptyData(true);
            setData(seeded);
            void fetch("/api/data", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(seeded),
            });
          }
          setServerMode(true);
          setReady(true);
          return;
        }
      } catch {
        // API nedostupné → spadneme do lokálního režimu níže.
      }
      if (!cancelled) {
        setServerMode(false);
        setData(loadData());
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Perzistence při každé změně (kromě úvodního načtení).
  useEffect(() => {
    if (!ready) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    // Lokální kopie (rychlý start / offline).
    saveData(data);
    // Do sdíleného úložiště zapisuje jen admin.
    if (!serverMode || !isAdmin) return;
    const id = window.setTimeout(() => {
      fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminTokenRef.current || "",
        },
        body: JSON.stringify(data),
      }).then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("fa-hty-admin");
          adminTokenRef.current = null;
          setIsAdmin(false);
        }
      }).catch(() => {});
    }, 500);
    return () => window.clearTimeout(id);
  }, [data, ready, serverMode, isAdmin]);

  const addPlayer = useCallback((p: Omit<Player, "id">) => {
    const player: Player = { ...p, id: newId("pl") };
    setData((d) => ({ ...d, players: [...d.players, player] }));
    return player;
  }, []);

  const updatePlayer = useCallback((id: string, patch: Partial<Player>) => {
    setData((d) => ({
      ...d,
      players: d.players.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removePlayer = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      players: d.players.filter((p) => p.id !== id),
      // Odebraného hráče vyřadíme i ze všech sestav.
      lineups: d.lineups.map((l) => ({
        ...l,
        onField: l.onField.filter((f) => f.playerId !== id),
        bench: l.bench.filter((b) => b !== id),
        captainId: l.captainId === id ? null : l.captainId,
        goalkeeperId: l.goalkeeperId === id ? null : l.goalkeeperId,
      })),
      // …a smažeme jeho pokuty.
      fines: d.fines.filter((f) => f.playerId !== id),
    }));
  }, []);

  const saveLineup = useCallback((l: Lineup) => {
    const stamped = { ...l, updatedAt: Date.now() };
    setData((d) => {
      const exists = d.lineups.some((x) => x.id === l.id);
      return {
        ...d,
        lineups: exists
          ? d.lineups.map((x) => (x.id === l.id ? stamped : x))
          : [...d.lineups, stamped],
      };
    });
  }, []);

  const createLineup = useCallback((partial?: Partial<Lineup>) => {
    const l = newLineup(partial);
    setData((d) => ({ ...d, lineups: [...d.lineups, l] }));
    return l;
  }, []);

  const duplicateLineup = useCallback(
    (id: string): Lineup | null => {
      const src = data.lineups.find((l) => l.id === id);
      if (!src) return null;
      const copy = newLineup({
        ...src,
        id: undefined,
        name: `${src.name} (kopie)`,
      });
      setData((d) => ({ ...d, lineups: [...d.lineups, copy] }));
      return copy;
    },
    [data.lineups]
  );

  const removeLineup = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      lineups: d.lineups.filter((l) => l.id !== id),
    }));
  }, []);

  // --- Pokuty ---
  const addFine = useCallback((f: Omit<FineEntry, "id" | "createdAt">) => {
    const entry: FineEntry = { ...f, id: newId("fn"), createdAt: Date.now() };
    setData((d) => ({ ...d, fines: [...d.fines, entry] }));
  }, []);

  const addFines = useCallback(
    (list: Omit<FineEntry, "id" | "createdAt">[]) => {
      const now = Date.now();
      const entries: FineEntry[] = list.map((f, i) => ({
        ...f,
        id: newId("fn"),
        createdAt: now + i,
      }));
      setData((d) => ({ ...d, fines: [...d.fines, ...entries] }));
    },
    []
  );

  const updateFine = useCallback((id: string, patch: Partial<FineEntry>) => {
    setData((d) => ({
      ...d,
      fines: d.fines.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const removeFine = useCallback((id: string) => {
    setData((d) => ({ ...d, fines: d.fines.filter((f) => f.id !== id) }));
  }, []);

  // --- Sazebník pokut ---
  const addFineType = useCallback((t: Omit<FineType, "id">) => {
    const ft: FineType = { ...t, id: newId("ft") };
    setData((d) => ({ ...d, fineTypes: [...d.fineTypes, ft] }));
  }, []);

  const updateFineType = useCallback(
    (id: string, patch: Partial<FineType>) => {
      setData((d) => ({
        ...d,
        fineTypes: d.fineTypes.map((t) =>
          t.id === id ? { ...t, ...patch } : t
        ),
      }));
    },
    []
  );

  const removeFineType = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      fineTypes: d.fineTypes.filter((t) => t.id !== id),
    }));
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) return false;
      adminTokenRef.current = password;
      localStorage.setItem("fa-hty-admin", password);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    adminTokenRef.current = null;
    localStorage.removeItem("fa-hty-admin");
    setIsAdmin(false);
  }, []);

  const replaceData = useCallback((d: AppData) => setData(d), []);
  const resetDemo = useCallback(() => setData(emptyData(true)), []);
  const clearAll = useCallback(() => setData(emptyData(false)), []);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      ready,
      addPlayer,
      updatePlayer,
      removePlayer,
      saveLineup,
      createLineup,
      duplicateLineup,
      removeLineup,
      addFine,
      addFines,
      updateFine,
      removeFine,
      addFineType,
      updateFineType,
      removeFineType,
      isAdmin,
      login,
      logout,
      replaceData,
      resetDemo,
      clearAll,
    }),
    [
      data,
      ready,
      addPlayer,
      updatePlayer,
      removePlayer,
      saveLineup,
      createLineup,
      duplicateLineup,
      removeLineup,
      addFine,
      addFines,
      updateFine,
      removeFine,
      addFineType,
      updateFineType,
      removeFineType,
      isAdmin,
      login,
      logout,
      replaceData,
      resetDemo,
      clearAll,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore musí být uvnitř <StoreProvider>.");
  return ctx;
}
