import { useMemo, useSyncExternalStore } from "react";

export type Route =
  | { name: "home" }
  | { name: "explore"; query: string }
  | { name: "material"; id: string }
  | { name: "compare" }
  | { name: "references" }
  | { name: "settings" }
  | { name: "notFound" };

export function parseHash(hash: string): Route {
  const [rawPath = "", rawQuery = ""] = hash.replace(/^#/, "").split("?");
  const [section, id] = rawPath.split("/").filter(Boolean);

  switch (section) {
    case undefined:
      return { name: "home" };
    case "explore":
      return { name: "explore", query: new URLSearchParams(rawQuery).get("q") ?? "" };
    case "material":
      return id ? { name: "material", id } : { name: "notFound" };
    case "compare":
      return { name: "compare" };
    case "references":
      return { name: "references" };
    case "settings":
      return { name: "settings" };
    default:
      return { name: "notFound" };
  }
}

function subscribeToHash(callback: () => void): () => void {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  return useMemo(() => parseHash(hash), [hash]);
}
