"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card } from "@/components/ui/Ui";
import { Modal } from "@/components/ui/Modal";
import { exportToFile, importFromFile } from "@/lib/storage";

export default function SettingsPage() {
  const { data, ready, replaceData, resetDemo, clearAll } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "demo" | "clear">(null);

  const flash = (msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 2600);
  };

  const onExport = () => {
    exportToFile(data);
    flash("Data byla vyexportována do JSON souboru.");
  };

  const onImportFile = async (file: File) => {
    try {
      const imported = await importFromFile(file);
      replaceData(imported);
      flash(
        `Import dokončen: ${imported.players.length} hráčů, ${imported.lineups.length} sestav.`
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Import se nezdařil.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Data a nastavení</h1>
        <p className="text-sm text-zinc-400">
          Záloha, obnovení a správa lokálně uložených dat.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-gold">
          {message}
        </div>
      )}

      <Card className="p-5">
        <h2 className="font-semibold">Přehled dat</h2>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-panel-2 border border-line p-4">
            <div className="text-2xl font-extrabold text-gold">
              {ready ? data.players.length : "–"}
            </div>
            <div className="text-xs text-zinc-400 mt-1">hráčů</div>
          </div>
          <div className="rounded-lg bg-panel-2 border border-line p-4">
            <div className="text-2xl font-extrabold text-gold">
              {ready ? data.lineups.length : "–"}
            </div>
            <div className="text-xs text-zinc-400 mt-1">uložených sestav</div>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold">Export a import</h2>
        <p className="text-sm text-zinc-400">
          Vyexportuj všechna data (hráče i sestavy) do JSON souboru jako zálohu,
          nebo je z takového souboru obnov. Import nahradí aktuální data.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onExport}>
            Exportovat data (JSON)
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInput.current?.click()}
          >
            Importovat data (JSON)
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold">Ukázková a testovací data</h2>
        <p className="text-sm text-zinc-400">
          Obnov ukázkový kádr, nebo smaž úplně vše a začni s prázdným seznamem.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setConfirm("demo")}>
            Obnovit demo data
          </Button>
          <Button variant="danger" onClick={() => setConfirm("clear")}>
            Smazat všechna data
          </Button>
        </div>
      </Card>

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "demo" ? "Obnovit demo data" : "Smazat všechna data"}
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-zinc-300">
          {confirm === "demo"
            ? "Tímto nahradíš aktuální hráče i sestavy ukázkovými demo daty. Pokračovat?"
            : "Tímto trvale smažeš všechny hráče i sestavy. Tuto akci nelze vrátit zpět."}
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Zrušit
          </Button>
          <Button
            variant={confirm === "demo" ? "primary" : "danger"}
            onClick={() => {
              if (confirm === "demo") {
                resetDemo();
                flash("Demo data byla obnovena.");
              } else {
                clearAll();
                flash("Všechna data byla smazána.");
              }
              setConfirm(null);
            }}
          >
            {confirm === "demo" ? "Obnovit" : "Smazat vše"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
