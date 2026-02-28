import React from "react";

export default function PayrollPanel({ payroll }) {
  const total = payroll?.totalPeriods ?? 0;
  const salary = payroll?.salary ?? 0;

  return (
    <div className="payroll">
      <div className="big">
        <div className="kpi">
          <div className="kpiLabel">勤務コマ数</div>
          <div className="kpiValue">{total}</div>
        </div>
        <div className="kpi">
          <div className="kpiLabel">給与（1コマ1250円）</div>
          <div className="kpiValue">{salary.toLocaleString("ja-JP")} 円</div>
        </div>
      </div>

      <div className="muted">計算式: 勤務コマ数 × 1250</div>
    </div>
  );
}
