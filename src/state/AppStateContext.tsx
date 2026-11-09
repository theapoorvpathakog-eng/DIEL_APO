import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { materials } from "../data/materials";
import { loadIds, loadTheme, saveIds, saveTheme, STORAGE_KEYS, type ThemePreference } from "../lib/storage";

export const MAX_RECENT = 6;
export const MAX_COMPARE = 3;

const KNOWN_IDS = new Set(materials.map((material) => material.id));

function knownIds(ids: string[]): string[] {
  return [...new Set(ids)].filter((id) => KNOWN_IDS.has(id));
}

type AppStateValue = {
  favourites: string[];
  recent: string[];
  compare: string[];
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  toggleFavourite: (id: string) => void;
  markViewed: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  replaceInCompare: (oldId: string, newId: string) => void;
  clearCompare: () => void;
  setTheme: (theme: ThemePreference) => void;
  resetPreferences: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>(() => knownIds(loadIds(STORAGE_KEYS.favourites)));
  const [recent, setRecent] = useState<string[]>(() =>
    knownIds(loadIds(STORAGE_KEYS.recent)).slice(0, MAX_RECENT),
  );
  const [compare, setCompare] = useState<string[]>(() =>
    knownIds(loadIds(STORAGE_KEYS.compare)).slice(0, MAX_COMPARE),
  );
  const [theme, setTheme] = useState<ThemePreference>(loadTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    saveIds(STORAGE_KEYS.favourites, favourites);
  }, [favourites]);

  useEffect(() => {
    saveIds(STORAGE_KEYS.recent, recent);
  }, [recent]);

  useEffect(() => {
    saveIds(STORAGE_KEYS.compare, compare);
  }, [compare]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current],
    );
  }, []);

  const markViewed = useCallback((id: string) => {
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, MAX_RECENT));
  }, []);

  const addToCompare = useCallback((id: string) => {
    setCompare((current) =>
      current.includes(id) || current.length >= MAX_COMPARE ? current : [...current, id],
    );
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompare((current) => current.filter((item) => item !== id));
  }, []);

  const replaceInCompare = useCallback((oldId: string, newId: string) => {
    setCompare((current) =>
      current.includes(newId) ? current : current.map((item) => (item === oldId ? newId : item)),
    );
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const resetPreferences = useCallback(() => {
    setFavourites([]);
    setRecent([]);
    setCompare([]);
    setTheme("system");
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      favourites,
      recent,
      compare,
      theme,
      resolvedTheme,
      toggleFavourite,
      markViewed,
      addToCompare,
      removeFromCompare,
      replaceInCompare,
      clearCompare,
      setTheme,
      resetPreferences,
    }),
    [
      favourites,
      recent,
      compare,
      theme,
      resolvedTheme,
      toggleFavourite,
      markViewed,
      addToCompare,
      removeFromCompare,
      replaceInCompare,
      clearCompare,
      resetPreferences,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (value === null) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
