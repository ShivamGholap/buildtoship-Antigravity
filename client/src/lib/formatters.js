export function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatSimpleDate(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatLandSize(size, unit = "acre") {
  if (size == null) return "";
  const unitLabel = unit === "hectare" ? "Hectares" : "Acres";
  return `${size} ${unitLabel}`;
}

export function getUrgencyBadgeColor(urgency) {
  switch (urgency) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "moderate":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
    default:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
}

export function getSuitabilityScoreColor(score) {
  if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-300";
  if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-300";
  return "text-stone-700 bg-stone-50 border-stone-300";
}

export function capitalize(str) {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
