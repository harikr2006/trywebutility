import Papa from "papaparse";

export interface CSVData {
  headers: string[];
  rows: string[][];
  rowCount: number;
  colCount: number;
  error: string | null;
}

export function parseCSVForViewer(input: string): CSVData {
  try {
    const result = Papa.parse<string[]>(input.trim(), {
      skipEmptyLines: true,
    });
    if (result.errors.length > 0 && result.data.length === 0) {
      return { headers: [], rows: [], rowCount: 0, colCount: 0, error: result.errors[0].message };
    }
    const data = result.data as string[][];
    if (data.length === 0) return { headers: [], rows: [], rowCount: 0, colCount: 0, error: null };
    const headers = data[0];
    const rows = data.slice(1);
    return { headers, rows, rowCount: rows.length, colCount: headers.length, error: null };
  } catch (e) {
    return { headers: [], rows: [], rowCount: 0, colCount: 0, error: e instanceof Error ? e.message : "Parse error" };
  }
}
