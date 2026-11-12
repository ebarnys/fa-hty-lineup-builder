import type { MatchRecord } from "./types";

/** Podzimní část 2026 – 9. Domažlická FL (kola 1–10), FA Horšovský Týn.
 *  Vytěženo ze zápisů o utkání (FAČR). Páruje se na hráče přes ID člena
 *  (memberId), jako záloha podle jména. Časová razítka se doplní při importu. */
export const SEED_MATCHES: Omit<MatchRecord, "createdAt" | "updatedAt">[] = [
  {
    "id": "m-k1",
    "round": 1,
    "date": "2026-09-06",
    "competition": "9. Domažlická FL",
    "opponent": "Staňkov B",
    "home": true,
    "ourScore": 3,
    "oppScore": 5,
    "appearances": [
      {
        "memberId": "78091379",
        "name": "Dietz Daniel",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 82,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 81,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": true,
        "minutes": 46,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86090865",
        "name": "Písařík Jan",
        "started": false,
        "minutes": 44,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 9,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik",
        "started": false,
        "minutes": 23,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "05061940",
        "name": "Schweiner Václav",
        "started": false,
        "minutes": 8,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k2",
    "round": 2,
    "date": "2026-09-12",
    "competition": "9. Domažlická FL",
    "opponent": "Srby",
    "home": false,
    "ourScore": 3,
    "oppScore": 1,
    "appearances": [
      {
        "memberId": "94120454",
        "name": "Fiala Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": true,
        "minutes": 84,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 79,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 11,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": false,
        "minutes": 6,
        "goals": 1,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k3",
    "round": 3,
    "date": "2026-09-20",
    "competition": "9. Domažlická FL",
    "opponent": "Poběžovice",
    "home": true,
    "ourScore": 4,
    "oppScore": 0,
    "appearances": [
      {
        "memberId": "86090865",
        "name": "Písařík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 63,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 80,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 72,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 2,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 72,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 18,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 18,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": false,
        "minutes": 27,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "05061940",
        "name": "Schweiner Václav",
        "started": false,
        "minutes": 10,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k4",
    "round": 4,
    "date": "2026-09-27",
    "competition": "9. Domažlická FL",
    "opponent": "Bukovec",
    "home": true,
    "ourScore": 5,
    "oppScore": 0,
    "appearances": [
      {
        "memberId": "94120454",
        "name": "Fiala Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 62,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 62,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 46,
        "goals": 3,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 68,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 62,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 28,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": false,
        "minutes": 28,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": false,
        "minutes": 44,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": false,
        "minutes": 22,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": false,
        "minutes": 28,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k5",
    "round": 5,
    "date": "2026-10-03",
    "competition": "9. Domažlická FL",
    "opponent": "Meclov B",
    "home": false,
    "ourScore": 3,
    "oppScore": 5,
    "appearances": [
      {
        "memberId": "78091379",
        "name": "Dietz Daniel",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 75,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82071034",
        "name": "Nový Miroslav",
        "started": true,
        "minutes": 45,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "06041638",
        "name": "Štýs Adam",
        "started": true,
        "minutes": 45,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": true,
        "minutes": 45,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": true,
        "minutes": 55,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": false,
        "minutes": 45,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": false,
        "minutes": 45,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": false,
        "minutes": 45,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "05061940",
        "name": "Schweiner Václav",
        "started": false,
        "minutes": 15,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 35,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k6",
    "round": 6,
    "date": "2026-10-11",
    "competition": "9. Domažlická FL",
    "opponent": "Dynamo Horšovský Týn",
    "home": true,
    "ourScore": 3,
    "oppScore": 1,
    "appearances": [
      {
        "memberId": "94120454",
        "name": "Fiala Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 86,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 72,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 66,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "89100993",
        "name": "Rada Václav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 46,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik",
        "started": false,
        "minutes": 18,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": false,
        "minutes": 24,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": false,
        "minutes": 4,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "06041638",
        "name": "Štýs Adam",
        "started": false,
        "minutes": 44,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k7",
    "round": 7,
    "date": "2026-10-17",
    "competition": "9. Domažlická FL",
    "opponent": "Hostouň/Oplotec B",
    "home": false,
    "ourScore": 3,
    "oppScore": 1,
    "appearances": [
      {
        "memberId": "86090865",
        "name": "Písařík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 58,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82111315",
        "name": "Šefčík Přemysl",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": true,
        "minutes": 46,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "06041638",
        "name": "Štýs Adam",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 2,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "81121698",
        "name": "Novák Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": true,
        "minutes": 64,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 44,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": false,
        "minutes": 32,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 26,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k8",
    "round": 8,
    "date": "2026-10-25",
    "competition": "9. Domažlická FL",
    "opponent": "Poděvousy",
    "home": true,
    "ourScore": 8,
    "oppScore": 0,
    "appearances": [
      {
        "memberId": "78091379",
        "name": "Dietz Daniel",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94120454",
        "name": "Fiala Martin",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 72,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "82071034",
        "name": "Nový Miroslav",
        "started": true,
        "minutes": 46,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 3,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "06041638",
        "name": "Štýs Adam",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95090624",
        "name": "Černík Jan",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 2,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": true,
        "minutes": 67,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": true,
        "minutes": 54,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 23,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 36,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": false,
        "minutes": 44,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86090865",
        "name": "Písařík Jan",
        "started": false,
        "minutes": 18,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k9",
    "round": 9,
    "date": "2026-10-31",
    "competition": "9. Domažlická FL",
    "opponent": "Hlohová",
    "home": false,
    "ourScore": 6,
    "oppScore": 3,
    "appearances": [
      {
        "memberId": "86090865",
        "name": "Písařík Jan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 77,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "82071034",
        "name": "Nový Miroslav",
        "started": true,
        "minutes": 77,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 83,
        "goals": 2,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 78,
        "goals": 2,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "07030910",
        "name": "Radošický David",
        "started": false,
        "minutes": 13,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 13,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "81121698",
        "name": "Novák Jiří",
        "started": false,
        "minutes": 12,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "86020618",
        "name": "Hašek Jaroslav",
        "started": false,
        "minutes": 7,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  },
  {
    "id": "m-k10",
    "round": 10,
    "date": "2026-11-08",
    "competition": "9. Domažlická FL",
    "opponent": "Miřkov",
    "home": true,
    "ourScore": 1,
    "oppScore": 0,
    "appearances": [
      {
        "memberId": "94120454",
        "name": "Fiala Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95110545",
        "name": "Dietz Dominik",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "91062591",
        "name": "Koliesnik Bogdan",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "92010578",
        "name": "Jurko Jiří",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 1,
        "red": 0
      },
      {
        "memberId": "82071034",
        "name": "Nový Miroslav",
        "started": true,
        "minutes": 86,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "95071526",
        "name": "Novák Tomáš",
        "started": true,
        "minutes": 90,
        "goals": 1,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96060997",
        "name": "Konopík Martin",
        "started": true,
        "minutes": 72,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "99021120",
        "name": "Černý Lukáš",
        "started": true,
        "minutes": 66,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "00100829",
        "name": "Fischer David",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "83061191",
        "name": "Jandík Martin",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "94071087",
        "name": "Frček Vladislav",
        "started": true,
        "minutes": 90,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "96071432",
        "name": "Matulka Vít",
        "started": false,
        "minutes": 24,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "84041577",
        "name": "Sláma Zdeněk",
        "started": false,
        "minutes": 18,
        "goals": 0,
        "yellow": 0,
        "red": 0
      },
      {
        "memberId": "06041638",
        "name": "Štýs Adam",
        "started": false,
        "minutes": 4,
        "goals": 0,
        "yellow": 0,
        "red": 0
      }
    ]
  }
];
