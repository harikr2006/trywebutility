export interface PercentageResult {
  result: number;
  formula: string;
}

export function percentOf(percent: number, total: number): PercentageResult {
  const result = (percent / 100) * total;
  return { result, formula: `${percent}% of ${total} = ${result}` };
}

export function whatPercent(part: number, total: number): PercentageResult {
  if (total === 0) return { result: 0, formula: "Division by zero" };
  const result = (part / total) * 100;
  return { result, formula: `${part} is ${result.toFixed(4)}% of ${total}` };
}

export function percentChange(from: number, to: number): PercentageResult {
  if (from === 0) return { result: 0, formula: "Cannot calculate change from 0" };
  const result = ((to - from) / Math.abs(from)) * 100;
  const direction = result >= 0 ? "increase" : "decrease";
  return { result, formula: `${from} → ${to}: ${Math.abs(result).toFixed(4)}% ${direction}` };
}

export function addPercent(value: number, percent: number): PercentageResult {
  const result = value + (value * percent / 100);
  return { result, formula: `${value} + ${percent}% = ${result}` };
}

export function subtractPercent(value: number, percent: number): PercentageResult {
  const result = value - (value * percent / 100);
  return { result, formula: `${value} - ${percent}% = ${result}` };
}
