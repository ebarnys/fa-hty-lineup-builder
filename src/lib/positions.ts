import type { Availability, Foot, PositionCode } from "./types";

/** Všechny pozice v pořadí od obrany po útok, s českým názvem a zkratkou. */
export const POSITIONS: { code: PositionCode; label: string; short: string }[] = [
  { code: "GK", label: "Brankář", short: "BR" },
  { code: "RB", label: "Pravý obránce", short: "PO" },
  { code: "LB", label: "Levý obránce", short: "LO" },
  { code: "CB", label: "Stoper", short: "ST" },
  { code: "DM", label: "Defenzivní záložník", short: "DZ" },
  { code: "CM", label: "Střední záložník", short: "SZ" },
  { code: "AM", label: "Ofenzivní záložník", short: "OZ" },
  { code: "RW", label: "Pravé křídlo", short: "PK" },
  { code: "LW", label: "Levé křídlo", short: "LK" },
  { code: "ST", label: "Útočník", short: "Ú" },
];

const POSITION_MAP = new Map(POSITIONS.map((p) => [p.code, p]));

export function positionLabel(code: PositionCode): string {
  return POSITION_MAP.get(code)?.label ?? code;
}

export function positionShort(code: PositionCode): string {
  return POSITION_MAP.get(code)?.short ?? code;
}

export const FEET: { value: Foot; label: string }[] = [
  { value: "right", label: "Pravá" },
  { value: "left", label: "Levá" },
  { value: "both", label: "Obě" },
];

export function footLabel(foot: Foot): string {
  return FEET.find((f) => f.value === foot)?.label ?? foot;
}

export const AVAILABILITIES: {
  value: Availability;
  label: string;
  dot: string;
  badge: string;
}[] = [
  {
    value: "available",
    label: "Dostupný",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    value: "uncertain",
    label: "Nejistý",
    dot: "bg-amber-500",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    value: "unavailable",
    label: "Nedostupný",
    dot: "bg-zinc-500",
    badge: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  {
    value: "injured",
    label: "Zraněný",
    dot: "bg-red-500",
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
  },
];

export function availabilityMeta(a: Availability) {
  return AVAILABILITIES.find((x) => x.value === a) ?? AVAILABILITIES[0];
}
