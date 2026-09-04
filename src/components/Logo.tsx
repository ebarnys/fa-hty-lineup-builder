import { LOGO_DATA_URL } from "@/lib/logoDataUrl";

/** Klubové logo FA Horšovský Týn (znak + název). Znak je vložený jako data URI,
 *  aby se korektně vykreslil i v exportu do PNG (html-to-image). */
export function Logo({
  size = 36,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DATA_URL}
        alt="FA Horšovský Týn"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover bg-white"
      />
      {showText && (
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-wide text-zinc-50">
            FA HORŠOVSKÝ TÝN
          </div>
          <div className="text-[10px] tracking-wide text-zinc-500">
            powered by{" "}
            <span className="font-semibold text-gold-soft">TMNK</span>
          </div>
        </div>
      )}
    </div>
  );
}
