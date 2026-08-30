import { Redis } from "@upstash/redis";
import { normalize } from "./storage";
import type { AppData } from "./types";

// Jeden klíč = celý stav aplikace (hráči + sestavy) jako JSON.
const KEY = "fa-hty:appdata";

/** Vytvoří Redis klienta z proměnných prostředí (Vercel/Upstash), jinak null. */
function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/** Je nakonfigurované sdílené úložiště? (Jinak appka běží jen lokálně.) */
export function isConfigured(): boolean {
  return getRedis() !== null;
}

/** Je nastavené admin heslo? (Pokud ne, zápis je otevřený – přechodný stav.) */
export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

/** Ověří admin token. Bez nastaveného hesla je zápis povolený (open). */
export function checkAdmin(token: string | null): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return true;
  return token === pw;
}

/** Načte data ze sdíleného úložiště (null = zatím nic uloženo). */
export async function readData(): Promise<AppData | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = await redis.get(KEY);
  if (!raw) return null;
  const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
  return normalize(obj as Partial<AppData>);
}

/** Uloží data do sdíleného úložiště. */
export async function writeData(data: AppData): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Sdílené úložiště není nakonfigurované.");
  await redis.set(KEY, JSON.stringify(data));
}
