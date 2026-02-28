import React, { useEffect, useState } from "react";
import { getShifts, createShift, deleteShift, getPayroll } from "./api.js";
import ShiftForm from "./components/ShiftForm.jsx";
import ShiftTable from "./components/ShiftTable.jsx";
import PayrollPanel from "./components/PayrollPanel.jsx";
//ymNow関数は、現在の年月を"YYYY-MM"形式で返す関数です。これを初期値としてmonth状態を設定しています。
function ymNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function App() {
  const [month, setMonth] = useState(ymNow());
  //monthは値、setMonthは更新関数。初期値はymNow()で、現在の年月を"YYYY-MM"形式で返す関数。
  const [items, setItems] = useState([]);
  const [payroll, setPayroll] = useState({ totalPeriods: 0, salary: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
//targetMonth = monthは、refresh関数の引数で、呼び出し元から渡されない場合は現在のmonth状態を使用することを意味します。これにより、refresh関数は特定の月を指定してデータを更新することも、現在選択されている月を使用して更新することもできます。
  async function refresh(targetMonth = month) {
    setLoading(true);
    setError("");
    try {
      const [s, p] = await Promise.all([getShifts(targetMonth), getPayroll(targetMonth)]);
      setItems(s.items);
      setPayroll(p);
    } catch (e) {
      setError(e?.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [month]);

  async function onCreate(payload) {
    const monthFromDate = payload?.date?.slice(0, 7);
    try {
      await createShift(payload);
      if (monthFromDate && monthFromDate !== month) {
        setMonth(monthFromDate); // month change will trigger refresh via useEffect
        await refresh(monthFromDate);
      } else {
        await refresh();
      }
    } catch (e) {
      setError(e?.message || "エラーが発生しました");
    }
  }

  async function onDelete(id) {
    try {
      await deleteShift(id);
      await refresh();
    } catch (e) {
      setError(e?.message || "エラーが発生しました");
    }
  }

  return (
    <div className="container">
      <header className="row">
        <h1>塾シフト管理 {month}</h1>

        <div className="row gap">
          <label className="label">
            月 (YYYY-MM)
            <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="2026-02" />
          </label>
          <button onClick={() => refresh()} disabled={loading}>
            更新
          </button>
        </div>
      </header>

      {error && <div className="error">エラー: {error}</div>}

      <div className="grid">
        <section className="card">
          <h2>シフト登録</h2>
          <ShiftForm onCreate={onCreate} />
          <p className="hint">※ 月-土の1-4限（1コマ90分、同日同時限は重複登録不可）</p>
        </section>

        <section className="card">
          <h2>給与 {month}</h2>
          <PayrollPanel payroll={payroll} />
        </section>
      </div>

      <section className="card">
        <h2>シフト一覧（テーブル）</h2>
        <ShiftTable items={items} onDelete={onDelete} loading={loading} />
      </section>
    </div>
  );
}
