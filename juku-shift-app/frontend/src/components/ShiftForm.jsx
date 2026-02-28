import React, { useState } from "react";

export default function ShiftForm({ onCreate }) {
  const [form, setForm] = useState({ date: "", period: 1, memo: "" });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }//JavaScriptのルール：{...prev,date: "2026-02-25"}はコピー → 後ろの値で上書きの順で処理されます。

  function validate() {
    if (!form.date) return "日付を入力してください";
    if (![1, 2, 3, 4].includes(Number(form.period))) return "時限は1-4で入力してください";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();//formタグはページをリロードするが、それと一緒にReactのステートも初期化されてしまうためpreventDefaultでその動きを止めている
    const msg = validate();
    if (msg) return alert(msg);

    await onCreate({ ...form, period: Number(form.period) });
    setForm((prev) => ({ ...prev, memo: "" }));
  }

  return (
    <form onSubmit={handleSubmit} className="row gap wrap">
      <label className="label">
        日付
        <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
      </label>

      <label className="label">
        時限
        <select value={form.period} onChange={(e) => update("period", e.target.value)}>
          {[1, 2, 3, 4].map((p) => (
            <option key={p} value={p}>
              {p}限
            </option>
          ))}
        </select>
      </label>

      <label className="label grow">
        メモ（任意）
        <input
          value={form.memo}
          onChange={(e) => update("memo", e.target.value)}
          placeholder="例：中2英語"
        />
      </label>

      <button type="submit">追加</button>
    </form>
  );
}
