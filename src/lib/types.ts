// Datové modely aplikace pro skládání fotbalové sestavy.

/** Kódy pozic na hřišti. */
export type PositionCode =
  | "GK" // brankář
  | "RB" // pravý obránce
  | "LB" // levý obránce
  | "CB" // stoper
  | "DM" // defenzivní záložník
  | "CM" // střední záložník
  | "AM" // ofenzivní záložník
  | "RW" // pravé křídlo
  | "LW" // levé křídlo
  | "ST"; // útočník

/** Preferovaná noha hráče. */
export type Foot = "right" | "left" | "both";

/** Dostupnost hráče pro aktuální zápas. */
export type Availability = "available" | "uncertain" | "unavailable" | "injured";

/** Jeden hráč v evidenci. */
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  birthYear: number | null;
  mainPosition: PositionCode;
  secondaryPositions: PositionCode[];
  foot: Foot;
  number: number | null;
  note: string;
  availability: Availability;
  /** ID člena (FAČR) – klíč pro párování statistik ze zápisů o utkání. */
  memberId: string;
}

/** Jeden hráč umístěný na hřišti (volná pozice v procentech). */
export interface FieldPlayer {
  playerId: string;
  /** Vodorovná pozice 0–100 (%) zleva doprava. */
  x: number;
  /** Svislá pozice 0–100 (%) shora dolů (0 = útok, 100 = vlastní branka). */
  y: number;
}

/** Předdefinovaná pozice v rozestavení. */
export interface FormationSlot {
  role: PositionCode;
  x: number;
  y: number;
}

/** Rozestavení = sada přednastavených pozic. */
export interface Formation {
  id: string;
  name: string;
  slots: FormationSlot[];
}

/** Jedno naplánované střídání (kdo za koho a v jaké minutě). */
export interface PlannedSub {
  id: string;
  /** Hráč, který jde ze hřiště (v základní sestavě). */
  outId: string;
  /** Hráč, který jde na hřiště (z lavičky). */
  inId: string;
  /** Plánovaná minuta střídání (nepovinné). */
  minute: number | null;
  note: string;
}

/** Kompletní sestava na jeden zápas. */
export interface Lineup {
  id: string;
  name: string;
  opponent: string;
  matchDate: string; // YYYY-MM-DD
  matchTime: string; // HH:MM
  venue: string;
  isHome: boolean;
  formationId: string;
  /** Zvolená varianta dresu (viz KITS v lib/kits). */
  kitId: string;
  captainId: string | null;
  goalkeeperId: string | null;
  coach: string;
  manager: string;
  note: string;
  onField: FieldPlayer[];
  bench: string[]; // id náhradníků
  /** Naplánovaná střídání (příprava před zápasem). */
  subs: PlannedSub[];
  createdAt: number;
  updatedAt: number;
}

/** Položka sazebníku pokut (druh pokuty a její výše v Kč). */
export interface FineType {
  id: string;
  label: string;
  amount: number;
}

/** Jeden záznam udělené pokuty konkrétnímu hráči. */
export interface FineEntry {
  id: string;
  playerId: string;
  /** Snímek názvu a částky v době udělení (aby pozdější úprava sazebníku
   *  nezměnila historické záznamy). */
  label: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paid: boolean;
  note: string;
  createdAt: number;
}

/** Struktura celého perzistentního úložiště. */
/** Nastoupení jednoho hráče v jednom zápase. */
export interface MatchAppearance {
  /** ID člena (FAČR) pro párování na hráče; jméno je záloha. */
  memberId: string;
  name: string;
  started: boolean;
  minutes: number;
  goals: number;
  yellow: number;
  red: number;
}

/** Odehraný zápas se statistikami hráčů. */
export interface MatchRecord {
  id: string;
  round: number | null;
  date: string; // YYYY-MM-DD
  competition: string;
  opponent: string;
  home: boolean;
  ourScore: number;
  oppScore: number;
  appearances: MatchAppearance[];
  createdAt: number;
  updatedAt: number;
}

export interface AppData {
  players: Player[];
  lineups: Lineup[];
  fineTypes: FineType[];
  fines: FineEntry[];
  matches: MatchRecord[];
  version: number;
}
