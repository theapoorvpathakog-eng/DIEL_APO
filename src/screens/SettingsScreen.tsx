import { useState } from "react";
import packageJson from "../../package.json";
import { AUDIT_STATUSES, STATUS_DESCRIPTIONS, STATUS_LABELS } from "../lib/format";
import { countStatuses } from "../lib/catalog";
import { StatusBadge } from "../components/StatusBadge";
import { useAppState } from "../state/AppStateContext";
import type { ThemePreference } from "../lib/storage";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function SettingsScreen() {
  const { theme, setTheme, resetPreferences } = useAppState();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const statusCounts = countStatuses();

  return (
    <>
      <header className="screen-header">
        <p className="eyebrow">More</p>
        <h1>Settings and about</h1>
      </header>

      <section className="panel">
        <h2 className="section-title">Appearance</h2>
        <fieldset className="segmented">
          <legend className="muted">Theme</legend>
          {THEME_OPTIONS.map((option) => (
            <label key={option.value} className={`segment${theme === option.value ? " is-active" : ""}`}>
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={() => setTheme(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="panel">
        <h2 className="section-title">Understanding the data</h2>
        <h3 className="section-subtitle">Relative permittivity (εr)</h3>
        <p>
          How strongly a material stores electrical energy in an electric field, compared with vacuum. It is
          dimensionless, and it depends on frequency, temperature, moisture and grade.
        </p>
        <h3 className="section-subtitle">Dielectric loss tangent (tan δ)</h3>
        <p>
          The fraction of stored energy lost as heat in each field cycle. It is dimensionless; smaller values mean lower
          loss. Small values are written in scientific notation, for example 2 × 10⁻⁴.
        </p>
        <h3 className="section-subtitle">Units and conditions</h3>
        <p>
          Frequencies are shown in Hz, kHz, MHz or GHz. Temperatures are in °C. "Not available" means no usable value
          exists in the sources. It never means zero.
        </p>
      </section>

      <section className="panel">
        <h2 className="section-title">Verification labels</h2>
        <p className="muted">Each property carries its own label. Counts are across all property values in the dataset.</p>
        <ul className="status-legend">
          {AUDIT_STATUSES.map((status) => (
            <li key={status}>
              <StatusBadge status={status} />
              <span>
                {STATUS_DESCRIPTIONS[status]} <span className="muted">({statusCounts[status]})</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="muted small">Labels: {AUDIT_STATUSES.map((status) => STATUS_LABELS[status]).join(", ")}.</p>
      </section>

      <section className="panel">
        <h2 className="section-title">About DIEL_APO</h2>
        <p>
          DIEL_APO is an offline dielectric materials reference for the DPH101 Engineering Physics assignment. All data is
          bundled with the app. No account or internet connection is needed.
        </p>
        <p className="muted">Version {packageJson.version}</p>
        <a className="btn btn--outline" href="#/references">
          Open scientific references
        </a>
      </section>

      <section className="panel">
        <h2 className="section-title">Reset preferences</h2>
        <p className="muted">Clears favourites, recently viewed materials, the comparison and the theme choice.</p>
        {confirmingReset ? (
          <div className="confirm-row">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                resetPreferences();
                setConfirmingReset(false);
              }}
            >
              Yes, reset
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn--outline" onClick={() => setConfirmingReset(true)}>
            Reset preferences
          </button>
        )}
      </section>
    </>
  );
}
