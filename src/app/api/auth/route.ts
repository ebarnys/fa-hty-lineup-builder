import { NextResponse } from "next/server";
import { adminConfigured } from "@/lib/serverStore";

export const dynamic = "force-dynamic";

/** Ověří admin heslo. Dokud není heslo nastavené, je vše otevřené. */
export async function POST(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    // Ochrana zatím není aktivní – přijmeme cokoliv (přechodný stav).
    return NextResponse.json({ ok: true, protected: false });
  }
  try {
    const { password } = (await req.json()) as { password?: string };
    if (password === pw) {
      return NextResponse.json({ ok: true, protected: true });
    }
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

/** Info, zda je ochrana aktivní (heslo nastavené). */
export function GET() {
  return NextResponse.json({ protected: adminConfigured() });
}
