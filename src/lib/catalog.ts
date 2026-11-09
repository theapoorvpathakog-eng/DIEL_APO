import { dielectricSources, materials } from "../data/materials";
import type { AuditStatus, DielectricMaterial, DielectricSource, MaterialCategory, PropertyRange } from "../data/materials";

export const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  polymer: "Polymer",
  ceramic: "Ceramic",
  glass: "Glass",
  natural: "Natural",
  liquid: "Liquid",
  semiconductor: "Semiconductor",
};

export const MATERIAL_CATEGORIES: MaterialCategory[] = ["polymer", "ceramic", "glass", "natural", "liquid", "semiconductor"];

export type SortOrder = "name-asc" | "name-desc" | "permittivity-asc" | "permittivity-desc";

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "name-asc", label: "Name (A to Z)" },
  { value: "name-desc", label: "Name (Z to A)" },
  { value: "permittivity-asc", label: "Permittivity (low to high)" },
  { value: "permittivity-desc", label: "Permittivity (high to low)" },
];

export const DATASET_STATS = {
  materials: materials.length,
  categories: new Set(materials.map((material) => material.category)).size,
  sources: dielectricSources.length,
};

const materialIndex = new Map(materials.map((material) => [material.id, material]));
const sourceIndex = new Map(dielectricSources.map((source) => [source.id, source]));

export function findMaterial(id: string): DielectricMaterial | null {
  return materialIndex.get(id) ?? null;
}

export function materialsByIds(ids: string[]): DielectricMaterial[] {
  return ids.flatMap((id) => {
    const material = findMaterial(id);
    return material === null ? [] : [material];
  });
}

export function sourcesForMaterial(material: DielectricMaterial): DielectricSource[] {
  return material.sourceIds.flatMap((id) => {
    const source = sourceIndex.get(id);
    return source === undefined ? [] : [source];
  });
}

export function materialsForSource(sourceId: string): DielectricMaterial[] {
  return materials.filter((material) => material.sourceIds.includes(sourceId));
}

function compareMaterials(order: SortOrder) {
  return (a: DielectricMaterial, b: DielectricMaterial): number => {
    if (order === "name-asc") return a.name.localeCompare(b.name);
    if (order === "name-desc") return b.name.localeCompare(a.name);

    const aValue = a.relativePermittivity.typical;
    const bValue = b.relativePermittivity.typical;
    if (aValue === null && bValue === null) return a.name.localeCompare(b.name);
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    return order === "permittivity-asc" ? aValue - bValue : bValue - aValue;
  };
}

export function filterMaterials(query: string, categories: MaterialCategory[], order: SortOrder): DielectricMaterial[] {
  const term = query.trim().toLowerCase();
  return materials
    .filter((material) => categories.length === 0 || categories.includes(material.category))
    .filter((material) => {
      if (term === "") return true;
      const searchable = [material.name, CATEGORY_LABELS[material.category], material.grade ?? ""].join(" ");
      return searchable.toLowerCase().includes(term);
    })
    .sort(compareMaterials(order));
}

export function countStatuses(): Record<AuditStatus, number> {
  const counts: Record<AuditStatus, number> = {
    VERIFIED: 0,
    "VERIFIED-RANGE": 0,
    CORRECT: 0,
    QUESTIONABLE: 0,
    UNVERIFIED: 0,
  };
  for (const material of materials) {
    counts[material.relativePermittivity.status] += 1;
    if (material.lossTangent !== null) counts[material.lossTangent.status] += 1;
  }
  return counts;
}

type PropertyEntry = { name: string; range: PropertyRange | null };

function hasValue(range: PropertyRange): boolean {
  return range.typical !== null || range.min !== null || range.max !== null;
}

function conditionKey(range: PropertyRange): string {
  return `${range.frequencyHz ?? "unstated"} Hz at ${range.temperatureC ?? "unstated"} °C`;
}

function propertyWarnings(label: string, entries: PropertyEntry[]): string[] {
  const warnings: string[] = [];
  const unavailable = entries
    .filter((entry) => entry.range === null || !hasValue(entry.range))
    .map((entry) => entry.name);
  if (unavailable.length > 0) {
    warnings.push(`${label} is not available for ${unavailable.join(", ")}.`);
  }

  const measured = entries.flatMap((entry) =>
    entry.range !== null && hasValue(entry.range) ? [{ name: entry.name, range: entry.range }] : [],
  );
  const conditions = new Set(measured.map((entry) => conditionKey(entry.range)));
  if (conditions.size > 1) {
    warnings.push(`${label} values were measured under different conditions. They are not directly comparable.`);
  } else if (measured.some((entry) => entry.range.frequencyHz === null || entry.range.temperatureC === null)) {
    warnings.push(`${label}: measurement frequency or temperature is not stated for at least one material.`);
  }
  return warnings;
}

export function comparisonWarnings(selected: DielectricMaterial[]): string[] {
  if (selected.length < 2) return [];
  const grades = new Set(selected.map((material) => material.grade ?? "unspecified"));
  const gradeWarnings =
    grades.size > 1 ? ["Material grades differ. Properties of different grades are not directly comparable."] : [];
  return [
    ...gradeWarnings,
    ...propertyWarnings(
      "Relative permittivity",
      selected.map((material) => ({ name: material.name, range: material.relativePermittivity })),
    ),
    ...propertyWarnings(
      "Loss tangent",
      selected.map((material) => ({ name: material.name, range: material.lossTangent })),
    ),
  ];
}
