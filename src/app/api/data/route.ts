import { NextResponse } from "next/server";
import { isConfigured, readData, writeData } from "@/lib/serverStore";
import { normalize } from "@/lib/storage";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Vrátí sdílená data (nebo informaci, že úložiště není nakonfigurované). */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, data: null });
  }
  try {
    const data = await readData();
    return NextResponse.json(
      { configured: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { configured: true, data: null, error: String(err) },
      { status: 500 }
    );
  }
}

/** Uloží sdílená data. */
export async function PUT(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Sdílené úložiště není nakonfigurované." },
      { status: 501 }
    );
  }
  try {
    const body = (await req.json()) as Partial<AppData>;
    const data = normalize(body);
    await writeData(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
