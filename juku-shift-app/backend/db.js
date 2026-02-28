import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Use the current working directory (backend/) as base
const DB_PATH = path.join(process.cwd(), "app.db");
const SCHEMA_PATH = path.join(process.cwd(), "schema.sql");

export const db = new Database(DB_PATH);

// init schema
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

// Helpers
export function monthToRange(month /* YYYY-MM */) {
  // e.g. 2026-02 => [2026-02-01, 2026-03-01)
  const [y, m] = month.split("-").map((v) => Number(v));
  if (!y || !m || m < 1 || m > 12) throw new Error("Invalid month");
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  const toYMD = (d) => d.toISOString().slice(0, 10);
  return { start: toYMD(start), end: toYMD(end) };
}
