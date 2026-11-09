import type { DielectricMaterial, DielectricSource } from "../data/materials";

type SourceCardProps = {
  source: DielectricSource;
  linkedMaterials?: DielectricMaterial[];
};

export function SourceCard({ source, linkedMaterials = [] }: SourceCardProps) {
  return (
    <article className="panel source-card">
      <div className="source-card__head">
        <span className="source-id mono">{source.id}</span>
        <span className="muted">{source.type}</span>
      </div>
      <h3>{source.title}</h3>
      <p className="muted">
        {source.organization} · {source.year ?? "Year not recorded"}
      </p>
      {source.url !== null ? (
        <a className="source-link" href={source.url} target="_blank" rel="noopener noreferrer">
          Open source link
        </a>
      ) : (
        <p className="muted">No link recorded</p>
      )}
      {linkedMaterials.length > 0 && (
        <p className="source-card__materials">
          <span className="muted">Used for: </span>
          {linkedMaterials.map((material, index) => (
            <span key={material.id}>
              {index > 0 && ", "}
              <a href={`#/material/${material.id}`}>{material.name}</a>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
