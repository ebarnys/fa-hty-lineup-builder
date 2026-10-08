/** Barevná sada dresu (kit) pro vykreslení hráčů v sestavě. */
export interface Kit {
  id: string;
  name: string;
  /** Hlavní barva dresu (trup + rukávy). */
  body: string;
  /** Barva rukávů – obvykle stejná jako trup, může se lišit. */
  sleeve: string;
  /** Límec a manžety. */
  trim: string;
  /** Barva čísla na dresu. */
  number: string;
  /** Obrys dresu kvůli oddělení od zeleného hřiště. */
  outline: string;
}

/** Dostupné varianty dresů. „sky" je naše aktuální světle modrá. */
export const KITS: Kit[] = [
  {
    id: "sky",
    name: "Světle modrá",
    body: "#7cb9e3",
    sleeve: "#7cb9e3",
    trim: "#ffffff",
    number: "#0f3250",
    outline: "rgba(0,0,0,0.30)",
  },
  {
    id: "white",
    name: "Bílá",
    body: "#f4f5f7",
    sleeve: "#f4f5f7",
    trim: "#2566ab",
    number: "#1d4f87",
    outline: "rgba(0,0,0,0.28)",
  },
  {
    id: "navy",
    name: "Tmavě modrá",
    body: "#1f3d6e",
    sleeve: "#1f3d6e",
    trim: "#ffffff",
    number: "#ffffff",
    outline: "rgba(0,0,0,0.40)",
  },
  {
    id: "red",
    name: "Červená",
    body: "#d23b3b",
    sleeve: "#d23b3b",
    trim: "#ffffff",
    number: "#ffffff",
    outline: "rgba(0,0,0,0.33)",
  },
  {
    id: "black",
    name: "Černá / zlatá",
    body: "#1d1d20",
    sleeve: "#1d1d20",
    trim: "#d9a93c",
    number: "#d9a93c",
    outline: "rgba(255,255,255,0.18)",
  },
];

/** Dres brankáře – vždy výrazně odlišný od hráčů v poli. */
export const GK_KIT: Kit = {
  id: "gk",
  name: "Brankář",
  body: "#1f9d55",
  sleeve: "#1a8249",
  trim: "#06331c",
  number: "#ffffff",
  outline: "rgba(0,0,0,0.40)",
};

export const DEFAULT_KIT_ID = "sky";

export function getKit(id: string | undefined | null): Kit {
  return KITS.find((k) => k.id === id) ?? KITS[0];
}
