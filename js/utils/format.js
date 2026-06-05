export function formatSignal(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  if (typeof value === "number") {
    return `${value.toFixed(2)}${suffix}`;
  }

  return `${value}${suffix}`;
}