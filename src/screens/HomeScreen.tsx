import { useState, type FormEvent } from "react";
import type { DielectricMaterial } from "../data/materials";
import { DATASET_STATS, materialsByIds, findMaterial } from "../lib/catalog";
import { MaterialCard } from "../components/MaterialCard";
import { useAppState } from "../state/AppStateContext";

const FEATURED_ID = "ceramic-alumina";

function MaterialList({ materials, emptyText }: { materials: DielectricMaterial[]; emptyText: string }) {
  if (materials.length === 0) {
    return <p className="muted">{emptyText}</p>;
  }
  return (
    <ul className="link-list">
      {materials.map((material) => (
        <li key={material.id}>
          <a href={`#/material/${material.id}`}>{material.name}</a>
        </li>
      ))}
    </ul>
  );
}

export function HomeScreen() {
  const { favourites, recent } = useAppState();
  const [term, setTerm] = useState("");
  const featured = findMaterial(FEATURED_ID);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.hash = `#/explore?q=${encodeURIComponent(term.trim())}`;
  };

  return (
    <>
      <section className="hero">
        <p className="eyebrow eyebrow--light">DPH101 Engineering Physics</p>
        <h1>DIEL_APO</h1>
        <p className="hero__lead">
          An offline reference for dielectric materials. Compare relative permittivity and loss tangent together with
          their measurement conditions, grades and sources.
        </p>
        <form className="hero__search" role="search" onSubmit={handleSearch}>
          <input
            type="search"
            className="input"
            placeholder="Search materials, e.g. alumina"
            aria-label="Search materials"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <button type="submit" className="btn btn--accent">
            Search
          </button>
        </form>
      </section>

      <section className="stats" aria-label="Dataset statistics">
        <div className="stat">
          <span className="stat__value">{DATASET_STATS.materials}</span>
          <span className="muted">Materials</span>
        </div>
        <div className="stat">
          <span className="stat__value">{DATASET_STATS.categories}</span>
          <span className="muted">Categories</span>
        </div>
        <div className="stat">
          <span className="stat__value">{DATASET_STATS.sources}</span>
          <span className="muted">Sources</span>
        </div>
      </section>

      <section className="quick-links">
        <a className="panel quick-link" href="#/explore">
          <h2>Explore</h2>
          <p className="muted">Search and filter all materials.</p>
        </a>
        <a className="panel quick-link" href="#/compare">
          <h2>Compare</h2>
          <p className="muted">Put two or three materials side by side.</p>
        </a>
        <a className="panel quick-link" href="#/references">
          <h2>References</h2>
          <p className="muted">Browse the scientific source library.</p>
        </a>
      </section>

      {featured !== null && (
        <section>
          <h2 className="section-title">Featured material</h2>
          <MaterialCard material={featured} isFavourite={favourites.includes(featured.id)} />
        </section>
      )}

      <section className="two-column">
        <div className="panel">
          <h2 className="section-title">Recently viewed</h2>
          <MaterialList materials={materialsByIds(recent)} emptyText="Materials you open will appear here." />
        </div>
        <div className="panel">
          <h2 className="section-title">Favourites</h2>
          <MaterialList materials={materialsByIds(favourites)} emptyText="Save materials to find them quickly here." />
        </div>
      </section>

      <section className="panel intro">
        <h2 className="section-title">About dielectric materials</h2>
        <p>
          A dielectric is an insulating material that stores electrical energy in an electric field. Its relative
          permittivity (εr) measures how strongly it does this compared with vacuum.
        </p>
        <p>
          The dielectric loss tangent (tan δ) measures how much of that energy is lost as heat. Both values depend on
          frequency, temperature, moisture and grade, so they are only meaningful with their stated conditions.
        </p>
      </section>
    </>
  );
}
