import type { DielectricMaterial } from "../data/materials";
import { CATEGORY_LABELS } from "../lib/catalog";
import { displayValue } from "../lib/format";
import { StatusBadge } from "./StatusBadge";

export function MaterialCard({ material, isFavourite }: { material: DielectricMaterial; isFavourite: boolean }) {
  const permittivity = displayValue(material.relativePermittivity);

  return (
    <a className="material-card" href={`#/material/${material.id}`}>
      <div className="material-card__top">
        <span className="category">{CATEGORY_LABELS[material.category]}</span>
        {isFavourite && <span className="saved-tag">Saved</span>}
      </div>
      <h3>{material.name}</h3>
      <div className="material-card__value">
        <span className="muted">Relative permittivity</span>
        <span className="mono material-card__number">
          {permittivity.text}
          {permittivity.isRange && <span className="muted"> (range)</span>}
        </span>
      </div>
      <StatusBadge status={material.relativePermittivity.status} />
    </a>
  );
}
