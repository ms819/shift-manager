import express from "express";
import cors from "cors";
import { db, monthToRange } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// 月のシフト一覧
app.get("/shifts", (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: "month is required (YYYY-MM)" });

  let range;
  try {
    range = monthToRange(month);
  } catch {
    return res.status(400).json({ error: "invalid month format" });
  }

  const rows = db
    .prepare(
      `
      SELECT id, date, period, memo
      FROM shifts
      WHERE date >= ? AND date < ?
      ORDER BY date ASC, period ASC
      `
    )
    .all(range.start, range.end);

  res.json({ items: rows });
});

// シフト登録（重複は409）
app.post("/shifts", (req, res) => {
  const { date, period, memo = "" } = req.body ?? {};
  if (!date || !period) return res.status(400).json({ error: "date and period are required" });
  if (![1, 2, 3, 4].includes(Number(period))) return res.status(400).json({ error: "period must be 1..4" });

  // 任意: 月〜金だけ許可（必要ならON）
  // const day = new Date(date + "T00:00:00Z").getUTCDay(); // 0=Sun ... 6=Sat
  // if (day === 0 || day === 6) return res.status(400).json({ error: "only Mon-Fri allowed" });

  try {
    const stmt = db.prepare(`INSERT INTO shifts(date, period, memo) VALUES(?, ?, ?)`);
    const info = stmt.run(date, Number(period), String(memo));
    const created = db.prepare(`SELECT id, date, period, memo FROM shifts WHERE id=?`).get(info.lastInsertRowid);
    return res.status(201).json(created);
  } catch (e) {
    // UNIQUE(date, period) violation
    if (String(e?.message || "").includes("UNIQUE")) {
      return res.status(409).json({ error: "duplicate shift (same date & period already exists)" });
    }
    return res.status(500).json({ error: "server error" });
  }
});

// シフト削除
app.delete("/shifts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid id" });

  const info = db.prepare(`DELETE FROM shifts WHERE id=?`).run(id);
  if (info.changes === 0) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

// 給与（コマ数×1250）
app.get("/payroll", (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: "month is required (YYYY-MM)" });

  let range;
  try {
    range = monthToRange(month);
  } catch {
    return res.status(400).json({ error: "invalid month format" });
  }

  const row = db
    .prepare(
      `
      SELECT COUNT(*) AS totalPeriods
      FROM shifts
      WHERE date >= ? AND date < ?
      `
    )
    .get(range.start, range.end);

  const totalPeriods = Number(row?.totalPeriods ?? 0);
  const salary = totalPeriods * 1250;

  res.json({ month, totalPeriods, salary });
});

const PORT = 5000;
app.listen(PORT, () => console.log(` Backend running on http://localhost:${PORT}`));