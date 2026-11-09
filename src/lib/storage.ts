export type ThemePreference = "system" | "light" | "dark";

export const STORAGE_KEYS = {
  favourites: "diel-apo:favourites",
  recent: "diel-apo:recent",
  compare: "diel-apo:compare",
  theme: "diel-apo:theme",
} as const;

const THEME_PREFERENCES: ThemePreference[] = ["system", "light", "dark"];

function readValue(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

function writeValue(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: preferences still work for this session.
  }
}

export function loadIds(key: string): string[] {
  const value = readValue(key);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function saveIds(key: string, ids: string[]): void {
  writeValue(key, ids);
}

export function loadTheme(): ThemePreference {
  const value = readValue(STORAGE_KEYS.theme);
  return THEME_PREFERENCES.find((theme) => theme === value) ?? "system";
}

export function saveTheme(theme: ThemePreference): void {
  writeValue(STORAGE_KEYS.theme, theme);
}
