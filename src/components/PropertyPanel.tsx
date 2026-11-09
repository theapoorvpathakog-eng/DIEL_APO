import type { PropertyRange } from "../data/materials";
import { NOT_AVAILABLE, formatFrequency, formatNumber, formatRange, formatTemperature } from "../lib/format";
import { StatusBadge } from "./StatusBadge";

export type FactRow = { label: string; value: string };

type PropertyPanelProps = {
  title: string;
  symbol: string;
  property: PropertyRange | null;
  footnote: string | null;
  extraRows?: FactRow[];
};

function Fact({ label, value, mono = false }: FactRow & { mono?: boolean }) {
  return (
    <div className="fact">
      <dt className="muted">{label}</dt>
      <dd className={mono ? "mono" : undefined}>{value}</dd>
    </div>
  );
}

export function PropertyPanel({ title, symbol, property, footnote, extraRows = [] }: PropertyPanelProps) {
  return (
    <section className="panel property-panel">
      <header className="property-panel__header">
        <div>
          <p className="eyebrow">{symbol}</p>
          <h2>{title}</h2>
        </div>
        {property !== null && <StatusBadge status={property.status} />}
      </header>

      {property === null ? (
        <p className="property-panel__empty mono">{NOT_AVAILABLE}</p>
      ) : (
        <dl className="facts">
          <Fact
            label="Typical value"
            value={property.typical !== null ? formatNumber(property.typical) : "No single typical value"}
            mono
          />
          <Fact label="Range" value={formatRange(property.min, property.max) ?? "Not stated"} mono />
          <Fact label="Frequency" value={formatFrequency(property.frequencyHz)} />
          <Fact label="Temperature" value={formatTemperature(property.temperatureC)} />
          {extraRows.map((row) => (
            <Fact key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      )}

      {property !== null && <p className="property-panel__note">{property.note}</p>}
      {footnote !== null && <p className="property-panel__note">{footnote}</p>}
    </section>
  );
}
