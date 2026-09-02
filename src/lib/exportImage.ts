import { toBlob, toPng } from "html-to-image";

/** Jak dopadl export (kvůli hlášce uživateli). */
export type ExportResult = "download" | "share" | "opened";

/**
 * Vyexportuje daný DOM uzel (sestavu) do PNG.
 * - Desktop: stáhne soubor.
 * - Mobil: nabídne systémové sdílení (share sheet → „Uložit obrázek"),
 *   protože přímé stažení na iOS/Androidu často nefunguje.
 */
export async function exportNodeToPng(
  node: HTMLElement,
  fileName: string
): Promise<ExportResult> {
  const name = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  const opts = { pixelRatio: 2, cacheBust: true, backgroundColor: "#0a0a0b" };

  const blob = await toBlob(node, opts);

  if (blob) {
    const file = new File([blob], name, { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
    };

    // Mobil / zařízení se sdílením: nabídni share sheet (uložit / poslat).
    if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: name });
        return "share";
      } catch (err) {
        // Uživatel sdílení zrušil – nepovažujeme za chybu.
        if (err instanceof Error && err.name === "AbortError") return "share";
        // jinak spadneme do stažení / otevření níže
      }
    }

    const url = URL.createObjectURL(blob);
    // Zkus klasické stažení (desktop).
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.rel = "noopener";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return "download";
  }

  // Nouzový fallback – data URL.
  const dataUrl = await toPng(node, opts);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = name;
  a.click();
  return "download";
}
