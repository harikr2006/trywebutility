export interface ShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
  opacity: number;
}

export function generateBoxShadow(layers: ShadowLayer[]): string {
  if (!layers.length) return "none";
  return layers.map(l => {
    const hex = l.color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${(l.opacity / 100).toFixed(2)})`;
    return `${l.inset ? "inset " : ""}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${rgba}`;
  }).join(", ");
}

export function defaultLayer(): ShadowLayer {
  return { offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: "#000000", inset: false, opacity: 25 };
}
