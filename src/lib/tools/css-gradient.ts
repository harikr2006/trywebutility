export type GradientType = "linear" | "radial";
export type ColorStop = { color: string; position: number };

export function generateGradientCSS(
  type: GradientType,
  angle: number,
  stops: ColorStop[],
  property: "background" | "background-image" = "background"
): string {
  if (stops.length < 2) return "";
  const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(", ");
  const gradientFn = type === "linear"
    ? `linear-gradient(${angle}deg, ${stopStr})`
    : `radial-gradient(circle, ${stopStr})`;
  return `${property}: ${gradientFn};`;
}

export function defaultStops(): ColorStop[] {
  return [{ color: "#6366f1", position: 0 }, { color: "#ec4899", position: 100 }];
}
