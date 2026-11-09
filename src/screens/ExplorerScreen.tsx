import { useMemo, useState } from "react";
import { materials } from "../data/materials";
import type { MaterialCategory } from "../data/materials";
import { CATEGORY_LABELS, MATERIAL_CATEGORIES, SORT_OPTIONS, filterMaterials, type SortOrder } from "../lib/catalog";
import { MaterialCard } from "../components/MaterialCard";
import { useAppState } from "../state/AppStateContext";

const UNTYPICAL_COUNT = materials.filter((material) => material.relativePermittivity.typical === null).length;

export function ExplorerScreen({ initialQuery }: { initialQuery: string }) {
  const { favourites } = useAppState();
  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [sort, setSort] = useState<SortOrder>("name-asc");

  const results = useMemo(() => filterMaterials(query, categories, sort), [query, categories, sort]);
  const filtersActive = query.trim() !== "" || categories.length > 0 || sort !== "name-asc";

  const resetFilters = () => {
    setQuery("");
    setCategories([]);
    setSort("name-asc");
  };

  const toggleCategory = (category: MaterialCategory) => {
    setCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  };

  return (
    <>
      <header className="screen-header">
        <p className="eyebrow">Explorer</p>
        <h1>Dielectric materials</h1>
        <p className="muted">
          Showing {results.length} of {materials.length} materials
        </p>
      </header>

      <section className="panel controls">
        <input
          type="search"
          className="input"
          placeholder="Search by name, category or grade"
          aria-label="Search materials"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chip-row" role="group" aria-label="Filter by category">
          {MATERIAL_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={categories.includes(category)}
              onClick={() => toggleCategory(category)}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
        <div className="controls__row">
          <label className="field-label">
            Sort by
            <select className="select" value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn--outline" onClick={resetFilters} disabled={!filtersActive}>
            Clear filters
          </button>
        </div>
        <p className="muted small">
          Permittivity sorting uses the typical value only. {UNTYPICAL_COUNT} materials have no single typical value and
          are listed last.
        </p>
      </section>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>No materials match</h2>
          <p>Try a different search term or remove a category filter.</p>
          <button type="button" className="btn btn--outline" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {results.map((material) => (
            <MaterialCard key={material.id} material={material} isFavourite={favourites.includes(material.id)} />
          ))}
        </div>
      )}
    </>
  );
}
