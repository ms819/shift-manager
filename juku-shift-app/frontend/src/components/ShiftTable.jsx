import React from "react";

export default function ShiftTable({ items, onDelete, loading }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>時限</th>
            <th>メモ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">
                {loading ? "読み込み中..." : "まだシフトがありません"}
              </td>
            </tr>
          )}

          {items.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.period}限</td>
              <td>{s.memo || ""}</td>
              <td style={{ textAlign: "right" }}>
                <button className="danger" onClick={() => onDelete(s.id)}>
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
