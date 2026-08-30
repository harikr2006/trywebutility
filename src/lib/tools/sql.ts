import { format } from "sql-formatter";

export function formatSQL(
  input: string,
  dialect: "sql" | "mysql" | "postgresql" | "sqlite" = "sql"
): { output: string; error: string | null } {
  try {
    const output = format(input, { language: dialect, tabWidth: 2 });
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}

export function minifySQL(input: string): { output: string; error: string | null } {
  try {
    const output = input.replace(/\s+/g, " ").trim();
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}
