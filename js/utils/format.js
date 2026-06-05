export function formatSignal(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  if (typeof value === "number") {
    return `${value.toFixed(3)}${suffix}`;
  }

  return `${value}${suffix}`;
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.round(value * 100)}%`;
}

export function formatDelta(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Δ —";
  }

  const sign = value > 0 ? "+" : "";

  return `Δ ${sign}${value.toFixed(3)}${suffix}`;
}