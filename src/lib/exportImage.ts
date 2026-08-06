import { toPng } from "html-to-image";

/** Vyexportuje daný DOM uzel (sestavu) do PNG a stáhne jej. */
export async function exportNodeToPng(
  node: HTMLElement,
  fileName: string
): Promise<void> {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#0a0a0b",
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  a.click();
}
