import type { ReactNode } from "react";
import { materials } from "../data/materials";
import type { DielectricMaterial, PropertyRange } from "../data/materials";
import { CATEGORY_LABELS, comparisonWarnings, materialsByIds } from "../lib/catalog";
import { formatFrequency, formatNumber, formatRange, formatTemperature, NOT_AVAILABLE } from "../lib/format";
import { StatusBadge } from "../components/StatusBadge";
import { MAX_COMPARE, useAppState } from "../state/AppStateContext";

type ComparisonRow = { label: string; cell: (material: DielectricMaterial) => ReactNode };

function propertyRows(symbol: string, getProperty: (material: DielectricMaterial) => PropertyRange | null): ComparisonRow[] {
  const cell = (render: (property: PropertyRange) => ReactNode) => (material: DielectricMaterial): ReactNode => {
    const property = getProperty(material);
    return property === null ? NOT_AVAILABLE : render(property);
  };
  return [
    {
      label: `${symbol} typical`,
      cell: cell((p) => (p.typical === null ? "No single value" : formatNumber(p.typical))),
    },
    { label: `${symbol} range`, cell: cell((p) => formatRange(p.min, p.max) ?? NOT_AVAILABLE) },
    { label: `${symbol} frequency`, cell: cell((p) => formatFrequency(p.frequencyHz)) },
    { label: `${symbol} temperature`, cell: cell((p) => formatTemperature(p.temperatureC)) },
    {
      label: `${symbol} status`,
      cell: (material) => {
        const property = getProperty(material);
        return property === null ? NOT_AVAILABLE : <StatusBadge status={property.status} />;
      },
    },
  ];
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Category", cell: (material) => CATEGORY_LABELS[material.category] },
  { label: "Grade", cell: (material) => material.grade ?? "Not stated" },
  ...propertyRows("εr", (material) => material.relativePermittivity),
  ...propertyRows("tan δ", (material) => material.lossTangent),
];

export function CompareScreen() {
  const { compare, addToCompare, removeFromCompare, replaceInCompare, clearCompare } = useAppState();

  const selected = materialsByIds(compare);
  const available = materials.filter((material) => !compare.includes(material.id));
  const warnings = comparisonWarnings(selected);

  return (
    <>
      <header className="screen-header">
        <p className="eyebrow">Comparison</p>
        <h1>Compare materials</h1>
        <p className="muted">Select two or three materials. Values measured under different conditions are flagged.</p>
      </header>

      <section className="panel controls">
        <div className="chip-row">
          {selected.map((material) => (
            <div className="compare-chip" key={material.id}>
              <span className="compare-chip__name">{material.name}</span>
              <select
                className="select select--small"
                aria-label={`Replace ${material.name}`}
                value=""
                disabled={available.length === 0}
                onChange={(event) => {
                  if (event.target.value !== "") {
                    replaceInCompare(material.id, event.target.value);
                  }
                }}
              >
                <option value="">Replace with...</option>
                {available.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => removeFromCompare(material.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {selected.length < MAX_COMPARE && available.length > 0 && (
          <label className="field-label">
            Add material
            <select
              className="select"
              value=""
              onChange={(event) => {
                if (event.target.value !== "") addToCompare(event.target.value);
              }}
            >
              <option value="">Choose a material</option>
              {available.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {selected.length > 0 && (
          <button type="button" className="btn btn--ghost" onClick={clearCompare}>
            Clear comparison
          </button>
        )}
      </section>

      {selected.length < 2 ? (
        <div className="empty-state">
          <h2>Select at least two materials</h2>
          <p>Open a material and choose Add to comparison, or pick materials above.</p>
          <a className="btn btn--primary" href="#/explore">
            Browse materials
          </a>
        </div>
      ) : (
        <>
          {warnings.length > 0 && (
            <section className="warning-panel">
              <h2>Before you compare</h2>
              <ul>
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          )}
          <div className="table-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  {selected.map((material) => (
                    <th scope="col" key={material.id}>
                      {material.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {selected.map((material) => (
                      <td key={material.id}>{row.cell(material)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
