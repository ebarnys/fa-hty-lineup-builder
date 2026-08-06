import type { Formation, FormationSlot, PositionCode } from "./types";

/**
 * Rozmístí `n` hráčů do vodorovné linie na dané výšce `y`.
 * Role se přiřazují popořadě zleva doprava.
 */
function line(y: number, roles: PositionCode[]): FormationSlot[] {
  const n = roles.length;
  if (n === 1) return [{ role: roles[0], x: 50, y }];
  const left = 12;
  const right = 88;
  const step = (right - left) / (n - 1);
  return roles.map((role, i) => ({ role, x: left + i * step, y }));
}

const GK: FormationSlot = { role: "GK", x: 50, y: 91 };

/** Vestavěná rozestavení. `id` odpovídá počtu hráčů v jednotlivých řadách. */
export const FORMATIONS: Formation[] = [
  {
    id: "4-4-2",
    name: "4-4-2",
    // Role jsou zleva doprava (nízké x = levá strana hřiště).
    slots: [
      GK,
      ...line(72, ["LB", "CB", "CB", "RB"]),
      ...line(45, ["LW", "CM", "CM", "RW"]),
      ...line(18, ["ST", "ST"]),
    ],
  },
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: [
      GK,
      ...line(72, ["LB", "CB", "CB", "RB"]),
      ...line(48, ["CM", "CM", "CM"]),
      ...line(18, ["LW", "ST", "RW"]),
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: [
      GK,
      ...line(74, ["LB", "CB", "CB", "RB"]),
      ...line(56, ["DM", "DM"]),
      ...line(38, ["LW", "AM", "RW"]),
      ...line(16, ["ST"]),
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    slots: [
      GK,
      ...line(74, ["LB", "CB", "CB", "RB"]),
      ...line(58, ["DM"]),
      ...line(40, ["LW", "CM", "CM", "RW"]),
      ...line(16, ["ST"]),
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: [
      GK,
      ...line(73, ["CB", "CB", "CB"]),
      ...line(48, ["LW", "CM", "CM", "CM", "RW"]),
      ...line(18, ["ST", "ST"]),
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    slots: [
      GK,
      ...line(73, ["CB", "CB", "CB"]),
      ...line(48, ["LW", "CM", "CM", "RW"]),
      ...line(18, ["LW", "ST", "RW"]),
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    slots: [
      GK,
      ...line(73, ["LB", "CB", "CB", "CB", "RB"]),
      ...line(48, ["CM", "CM", "CM"]),
      ...line(18, ["ST", "ST"]),
    ],
  },
  {
    id: "custom",
    name: "Vlastní",
    // Vlastní rozestavení začíná rovnoměrným rozložením, které lze libovolně upravit.
    slots: [
      GK,
      ...line(72, ["LB", "CB", "CB", "RB"]),
      ...line(45, ["CM", "CM", "CM"]),
      ...line(18, ["LW", "ST", "RW"]),
    ],
  },
];

export const DEFAULT_FORMATION_ID = "4-3-3";

export function getFormation(id: string): Formation {
  return FORMATIONS.find((f) => f.id === id) ?? FORMATIONS[0];
}
