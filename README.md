# FA Horšovský Týn – Lineup Builder

Jednoduchá webová aplikace pro **osobní** evidenci hráčů a skládání fotbalové
sestavy na další zápas. Bez přihlašování, bez databáze, bez placených služeb –
všechna data zůstávají uložená lokálně v prohlížeči (localStorage).

## Spuštění

```bash
npm install
npm run dev
```

Poté otevři [http://localhost:3000](http://localhost:3000).

Produkční build:

```bash
npm run build
npm run start
```

## Použité technologie

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **@dnd-kit** – drag & drop (funguje na desktopu i dotykových zařízeních)
- **html-to-image** – export sestavy do PNG
- Ukládání dat výhradně přes **localStorage** (žádný backend)

## Funkce

### Přehled (`/`)
Rychlý souhrn kádru, dostupnosti a posledních sestav.

### Hráči (`/players`)
- Přidávání, úprava a mazání hráčů.
- Evidence: jméno, příjmení, přezdívka, rok narození, hlavní a vedlejší pozice,
  preferovaná noha (pravá / levá / obě), číslo dresu, poznámka a dostupnost
  (dostupný / nejistý / nedostupný / zraněný).
- Filtrování podle pozice, dostupnosti a preferované nohy + vyhledávání podle jména.
- Základní validace formuláře.

### Sestava (`/lineup`)
- Grafické fotbalové hřiště, vedle něj seznam hráčů „mimo nominaci".
- **Drag & drop**: ze seznamu na hřiště, mezi pozicemi na hřišti, na lavičku i
  zpět do seznamu. Hráče lze na hřišti umístit **libovolně** (volné pozice).
- Maximálně 11 hráčů na hřišti.
- Sekce **Náhradníci** pod hřištěm.
- Volba **rozestavení** (4-4-2, 4-3-3, 4-2-3-1, 4-1-4-1, 3-5-2, 3-4-3, 5-3-2 a
  vlastní). Při změně rozestavení se zachovají již vložení hráči a upraví se jen
  jejich pozice. Tlačítko **Doplnit** automaticky obsadí volné pozice podle
  pozic hráčů.
- Detail zápasu: soupeř, datum, čas, místo, domácí/venkovní, kapitán (značka
  **C**), brankář (zeleně zvýrazněný) a poznámka.
- **Kontroly** (nebrání uložení, jen upozorňují): více než 11 hráčů, chybějící
  brankář, nedostupný/zraněný hráč v sestavě, hráč na více místech, neobsazené
  pozice.
- **Exportovat PNG** – stáhne obrázek sestavy (hřiště, hráči, náhradníci, soupeř,
  datum, rozestavení a logo/název klubu).
- Rozpracovaná sestava se průběžně ukládá, takže přežije obnovení stránky.

### Uložené sestavy (`/lineups`)
Uložení pod vlastním názvem, vytvoření nové, duplikování, úprava, mazání a
načtení sestavy zpět do editoru.

### Data (`/settings`)
- **Export** všech dat do JSON souboru (záloha).
- **Import** dat zpět z JSON souboru.
- Obnovení ukázkových **demo dat** nebo smazání všech dat.

## Demo data

Při prvním spuštění se automaticky vytvoří ukázkový kádr (14 hráčů), aby byla
aplikace ihned použitelná. Demo data lze kdykoliv obnovit nebo smazat v sekci
**Data**.

## Struktura projektu

```
src/
  app/                     # stránky (App Router)
    page.tsx               # přehled / dashboard
    players/page.tsx       # hráči
    lineup/page.tsx        # editor sestavy
    lineups/page.tsx       # uložené sestavy
    settings/page.tsx      # data / export
  components/
    ui/                    # sdílené prvky (Button, Input, Modal, …)
    players/               # karta a formulář hráče
    lineup/                # hřiště, kartičky, drag & drop, detail zápasu
    Navbar.tsx, Logo.tsx
  lib/
    types.ts               # TypeScript datové modely
    positions.ts           # pozice, nohy, dostupnost
    formations.ts          # rozestavení a jejich souřadnice
    lineupOps.ts           # operace nad sestavou (umístění, rozestavení, autofill)
    validation.ts          # kontroly sestavy
    storage.ts             # localStorage, export/import JSON
    store.tsx              # React context se stavem aplikace
    demoData.ts            # ukázkoví hráči
    exportImage.ts         # export do PNG
    players.ts, id.ts      # pomocné funkce
```

## Poznámky

- Aplikace je čistě klientská; není potřeba žádný server ani API.
- Data se ukládají pod klíčem `fa-hty-lineup-builder` v `localStorage`
  prohlížeče. Vymazáním dat prohlížeče se sestavy i hráči ztratí – pro zálohu
  použij export do JSON.
