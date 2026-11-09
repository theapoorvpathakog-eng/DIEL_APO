import { useEffect } from "react";
import { KIND_LABELS, NOT_AVAILABLE, formatNumber } from "../lib/format";
import { PropertyPanel, type FactRow } from "../components/PropertyPanel";
import { SourceCard } from "../components/SourceCard";
import { CATEGORY_LABELS, findMaterial, sourcesForMaterial } from "../lib/catalog";
import { MAX_COMPARE, useAppState } from "../state/AppStateContext";

export function DetailsScreen({ id }: { id: string }) {
  const material = findMaterial(id);
  const materialId = material?.id;
  const { favourites, compare, toggleFavourite, addToCompare, removeFromCompare, markViewed } = useAppState();

  useEffect(() => {
    if (materialId !== undefined) {
      markViewed(materialId);
    }
  }, [materialId, markViewed]);

  if (material === null) {
    return (
      <div className="empty-state">
        <h2>Material not found</h2>
        <p>This material is not in the dataset.</p>
        <a className="btn btn--outline" href="#/explore">
          Back to explorer
        </a>
      </div>
    );
  }

  const isFavourite = favourites.includes(material.id);
  const inComparison = compare.includes(material.id);
  const comparisonFull = compare.length >= MAX_COMPARE && !inComparison;
  const permittivity = material.relativePermittivity;

  const permittivityRows: FactRow[] = [];
  if (permittivity.kind !== null) {
    permittivityRows.push({ label: "Behaviour", value: KIND_LABELS[permittivity.kind] });
  }
  if (permittivity.highFrequency !== null) {
    permittivityRows.push({ label: "High-frequency value", value: formatNumber(permittivity.highFrequency) });
  }

  return (
    <>
      <a className="back-link" href="#/explore">
        Back to explorer
      </a>

      <header className="screen-header">
        <span className="category">{CATEGORY_LABELS[material.category]}</span>
        <h1>{material.name}</h1>
        <p className="muted">Grade or composition: {material.grade ?? "Not stated"}</p>
      </header>

      <div className="actions">
        <button
          type="button"
          className={`btn ${isFavourite ? "btn--secondary" : "btn--primary"}`}
          aria-pressed={isFavourite}
          onClick={() => toggleFavourite(material.id)}
        >
          {isFavourite ? "Remove from favourites" : "Add to favourites"}
        </button>
        <button
          type="button"
          className="btn btn--outline"
          disabled={comparisonFull}
          onClick={() => (inComparison ? removeFromCompare(material.id) : addToCompare(material.id))}
        >
          {inComparison ? "Remove from comparison" : comparisonFull ? `Comparison full (${MAX_COMPARE})` : "Add to comparison"}
        </button>
        {compare.length > 0 && (
          <a className="btn btn--ghost" href="#/compare">
            Open comparison ({compare.length})
          </a>
        )}
      </div>

      <section className="panel">
        <h2 className="section-title">Description</h2>
        <p>{material.description}</p>
        <h3 className="section-subtitle">Applications</h3>
        <ul className="bullet-list">
          {material.applications.map((application) => (
            <li key={application}>{application}</li>
          ))}
        </ul>
      </section>

      <div className="details-grid">
        <PropertyPanel
          title="Relative permittivity"
          symbol="εr"
          property={permittivity}
          footnote={null}
          extraRows={permittivityRows}
        />
        <PropertyPanel
          title="Dielectric loss tangent"
          symbol="tan δ"
          property={material.lossTangent}
          footnote={material.lossTangentNote}
        />
      </div>

      <section className="panel">
        <h2 className="section-title">Sources</h2>
        {material.sourceIds.length === 0 ? (
          <p className="muted">{NOT_AVAILABLE}</p>
        ) : (
          <div className="source-stack">
            {sourcesForMaterial(material).map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
