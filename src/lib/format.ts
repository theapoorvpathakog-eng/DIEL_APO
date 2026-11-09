import type { AuditStatus, PermittivityKind, PropertyRange } from "../data/materials";

export const NOT_AVAILABLE = "Not available";

export const AUDIT_STATUSES: AuditStatus[] = ["VERIFIED", "VERIFIED-RANGE", "CORRECT", "QUESTIONABLE", "UNVERIFIED"];

export const STATUS_LABELS: Record<AuditStatus, string> = {
  VERIFIED: "Verified",
  "VERIFIED-RANGE": "Verified range",
  CORRECT: "Corrected",
  QUESTIONABLE: "Questionable",
  UNVERIFIED: "Unverified",
};

export const STATUS_DESCRIPTIONS: Record<AuditStatus, string> = {
  VERIFIED: "Matches a retrieved source under the stated conditions.",
  "VERIFIED-RANGE": "Supported by sources, but the spread or grade dependence is large. Read the range.",
  CORRECT: "Replaces an earlier value that the sources do not support.",
  QUESTIONABLE: "Not supported as stated. Use with caution.",
  UNVERIFIED: "No usable source was retrieved. Values are unavailable or unconfirmed.",
};

export const KIND_LABELS: Record<PermittivityKind, string> = {
  static: "Static (low-frequency limit)",
  "frequency-dependent": "Frequency-dependent",
  anisotropic: "Anisotropic (direction-dependent)",
  "temperature-dependent": "Temperature-dependent",
};

const SUPERSCRIPT_DIGITS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

function toSuperscript(exponent: number): string {
  const sign = exponent < 0 ? "⁻" : "";
  const digits = String(Math.abs(exponent))
    .split("")
    .map((digit) => SUPERSCRIPT_DIGITS[Number(digit)] ?? digit)
    .join("");
  return sign + digits;
}

export function formatNumber(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 0.01 || magnitude >= 10000)) {
    const [mantissa, exponent] = value.toExponential().split("e");
    return `${mantissa} × 10${toSuperscript(Number(exponent))}`;
  }
  return String(value);
}

export function formatRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) {
    return min === max ? formatNumber(min) : `${formatNumber(min)} – ${formatNumber(max)}`;
  }
  if (min !== null) return `≥ ${formatNumber(min)}`;
  if (max !== null) return `≤ ${formatNumber(max)}`;
  return null;
}

export function displayValue(property: PropertyRange | null): { text: string; isRange: boolean } {
  if (property === null) return { text: NOT_AVAILABLE, isRange: false };
  if (property.typical !== null) return { text: formatNumber(property.typical), isRange: false };
  const range = formatRange(property.min, property.max);
  return range === null ? { text: NOT_AVAILABLE, isRange: false } : { text: range, isRange: true };
}

export function formatFrequency(hz: number | null): string {
  if (hz === null) return "Frequency not stated";
  if (hz >= 1e9) return `${hz / 1e9} GHz`;
  if (hz >= 1e6) return `${hz / 1e6} MHz`;
  if (hz >= 1e3) return `${hz / 1e3} kHz`;
  return `${hz} Hz`;
}

export function formatTemperature(celsius: number | null): string {
  return celsius === null ? "Temperature not stated" : `${celsius} °C`;
}
