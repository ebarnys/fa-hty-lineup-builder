/** Vygeneruje krátké unikátní id (bez závislosti na externí knihovně). */
export function newId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}
