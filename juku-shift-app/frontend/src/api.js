export async function getShifts(month) {
  const r = await fetch(`/api/shifts?month=${encodeURIComponent(month)}`);
  if (!r.ok) throw new Error(await safeMsg(r));
  return r.json();
}

export async function createShift({ date, period, memo }) {
  const r = await fetch(`/api/shifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, period, memo })
  });

  if (r.status === 409) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || "duplicate shift");
  }
  if (!r.ok) throw new Error(await safeMsg(r));
  return r.json();
}

export async function deleteShift(id) {
  const r = await fetch(`/api/shifts/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await safeMsg(r));
  return r.json();
}

export async function getPayroll(month) {
  const r = await fetch(`/api/payroll?month=${encodeURIComponent(month)}`);
  if (!r.ok) throw new Error(await safeMsg(r));
  return r.json();
}

async function safeMsg(r) {
  try {
    const j = await r.json();
    return j?.error || r.statusText;
  } catch {
    return r.statusText;
  }
}