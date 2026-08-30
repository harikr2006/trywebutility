export type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "speed";

interface UnitDef { label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const units: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    mm:   { label: "Millimeter (mm)",  toBase: v => v / 1000, fromBase: v => v * 1000 },
    cm:   { label: "Centimeter (cm)",  toBase: v => v / 100,  fromBase: v => v * 100 },
    m:    { label: "Meter (m)",         toBase: v => v,         fromBase: v => v },
    km:   { label: "Kilometer (km)",   toBase: v => v * 1000,  fromBase: v => v / 1000 },
    inch: { label: "Inch (in)",         toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ft:   { label: "Foot (ft)",         toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    yd:   { label: "Yard (yd)",         toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    mi:   { label: "Mile (mi)",         toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
  },
  weight: {
    mg:  { label: "Milligram (mg)",  toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    g:   { label: "Gram (g)",         toBase: v => v / 1000, fromBase: v => v * 1000 },
    kg:  { label: "Kilogram (kg)",   toBase: v => v,         fromBase: v => v },
    t:   { label: "Metric Ton (t)",  toBase: v => v * 1000,  fromBase: v => v / 1000 },
    oz:  { label: "Ounce (oz)",       toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    lb:  { label: "Pound (lb)",       toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  },
  temperature: {
    c: { label: "Celsius (°C)",    toBase: v => v,                   fromBase: v => v },
    f: { label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5 / 9,  fromBase: v => v * 9 / 5 + 32 },
    k: { label: "Kelvin (K)",      toBase: v => v - 273.15,          fromBase: v => v + 273.15 },
  },
  area: {
    mm2: { label: "mm²",   toBase: v => v / 1e6,  fromBase: v => v * 1e6 },
    cm2: { label: "cm²",   toBase: v => v / 1e4,  fromBase: v => v * 1e4 },
    m2:  { label: "m²",    toBase: v => v,         fromBase: v => v },
    km2: { label: "km²",   toBase: v => v * 1e6,  fromBase: v => v / 1e6 },
    ft2: { label: "ft²",   toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    ac:  { label: "Acre",  toBase: v => v * 4046.86,  fromBase: v => v / 4046.86 },
    ha:  { label: "Hectare", toBase: v => v * 10000, fromBase: v => v / 10000 },
  },
  volume: {
    ml:  { label: "Milliliter (ml)",  toBase: v => v / 1000,  fromBase: v => v * 1000 },
    l:   { label: "Liter (L)",         toBase: v => v,           fromBase: v => v },
    m3:  { label: "Cubic Meter (m³)", toBase: v => v * 1000,   fromBase: v => v / 1000 },
    cup: { label: "Cup (US)",          toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    pt:  { label: "Pint (US)",         toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    qt:  { label: "Quart (US)",        toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    gal: { label: "Gallon (US)",       toBase: v => v * 3.78541,  fromBase: v => v / 3.78541 },
    floz:{ label: "Fl. Oz (US)",       toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
  },
  speed: {
    mps:  { label: "m/s",   toBase: v => v,          fromBase: v => v },
    kmh:  { label: "km/h",  toBase: v => v / 3.6,    fromBase: v => v * 3.6 },
    mph:  { label: "mph",   toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    knot: { label: "Knot",  toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    fps:  { label: "ft/s",  toBase: v => v * 0.3048,  fromBase: v => v / 0.3048 },
  },
};

export function getUnits(category: UnitCategory): { key: string; label: string }[] {
  return Object.entries(units[category]).map(([key, u]) => ({ key, label: u.label }));
}

export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  const cat = units[category];
  if (!cat[from] || !cat[to]) return NaN;
  const base = cat[from].toBase(value);
  return cat[to].fromBase(base);
}

export const categories: UnitCategory[] = ["length", "weight", "temperature", "area", "volume", "speed"];
