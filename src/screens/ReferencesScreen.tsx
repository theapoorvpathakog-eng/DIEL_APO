import { useMemo, useState } from "react";
import { dielectricSources } from "../data/materials";
import { materialsForSource } from "../lib/catalog";
import { SourceCard } from "../components/SourceCard";

export function ReferencesScreen() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const types = useMemo(() => [...new Set(dielectricSources.map((source) => source.type))].sort(), []);
  const term = query.trim().toLowerCase();
  const results = dielectricSources.filter((source) => {
    if (type !== "all" && source.type !== type) return false;
    if (term === "") return true;
    return [source.id, source.title, source.organization, source.type, source.year ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  return (
    <>
      <header className="screen-header">
        <p className="eyebrow">Library</p>
        <h1>Scientific references</h1>
        <p className="muted">
          Showing {results.length} of {dielectricSources.length} sources. Source details are stored in the app. Links open
          in your browser when internet access is available.
        </p>
      </header>

      <section className="panel controls">
        <input
          type="search"
          className="input"
          placeholder="Search by ID, title or organization"
          aria-label="Search sources"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label className="field-label">
          Source type
          <select className="select" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All types</option>
            {types.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>No sources match</h2>
          <p>Try a different search term or source type.</p>
        </div>
      ) : (
        <div className="source-stack">
          {results.map((source) => (
            <SourceCard key={source.id} source={source} linkedMaterials={materialsForSource(source.id)} />
          ))}
        </div>
      )}
    </>
  );
}
