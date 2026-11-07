export type MaterialCategory =
  | "polymer"
  | "ceramic"
  | "glass"
  | "natural"
  | "liquid"
  | "semiconductor";

export interface PropertyRange {
  typical: number;
  min: number;
  max: number;
}

export interface MeasurementConditions {
  frequencyHz: number;
  frequencyLabel: string;
  temperatureC: number;
  permittivityRegime: "static" | "frequency-dependent";
  notes: string;
}

export interface DielectricMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  applications: string[];
  relativePermittivity: PropertyRange;
  lossTangent: PropertyRange | null;
  lossTangentNote: string;
  measurement: MeasurementConditions;
  source: string;
  verificationStatus: "pending";
}

// Values are approximate literature values and have NOT been checked against the cited
// sources. "typical" is a representative value under the stated measurement conditions.
// "min" and "max" are editorial bounds for grade-to-grade spread, not taken from any source.
// A null lossTangent means no single value applies (conductivity-dependent); the
// lossTangentNote explains why. All values depend on frequency, temperature, purity,
// moisture and processing.
export const materials: DielectricMaterial[] = [
  {
    id: "polymer-ptfe",
    name: "Polytetrafluoroethylene (PTFE)",
    category: "polymer",
    description:
      "Fluoropolymer with very low dielectric loss and chemical inertness across a wide temperature range.",
    applications: [
      "High-frequency cable insulation",
      "RF and microwave circuit substrates",
      "Chemically resistant seals and liners",
    ],
    relativePermittivity: { typical: 2.1, min: 2.0, max: 2.1 },
    lossTangent: { typical: 0.0002, min: 0.0001, max: 0.0003 },
    lossTangentNote: "Very low loss; sensitive to filler content in composites.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 23,
      permittivityRegime: "frequency-dependent",
      notes: "Unfilled bulk sample.",
    },
    source:
      "Candidate reference (not checked): Callister & Rethwisch, Materials Science and Engineering (Wiley); CRC Handbook of Chemistry and Physics (CRC Press).",
    verificationStatus: "pending",
  },
  {
    id: "polymer-polyethylene",
    name: "Polyethylene (LDPE / HDPE)",
    category: "polymer",
    description:
      "Nonpolar thermoplastic with low permittivity and low loss, widely used as an insulator.",
    applications: [
      "Power and communication cable insulation",
      "Dielectric films",
      "Radome and window materials at microwave frequencies",
    ],
    relativePermittivity: { typical: 2.25, min: 2.2, max: 2.35 },
    lossTangent: { typical: 0.0002, min: 0.0001, max: 0.0005 },
    lossTangentNote: "Low loss; depends on impurity and oxidation content.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Grade and crystallinity affect values.",
    },
    source:
      "Candidate reference (not checked): Callister & Rethwisch, Materials Science and Engineering (Wiley); Kao, Dielectric Phenomena in Solids (Elsevier, 2004).",
    verificationStatus: "pending",
  },
  {
    id: "polymer-polystyrene",
    name: "Polystyrene",
    category: "polymer",
    description:
      "Amorphous thermoplastic with low loss and stable permittivity at radio frequencies.",
    applications: [
      "Film capacitor dielectrics (historical and specialty)",
      "RF insulating components",
      "Laboratory and calibration standards",
    ],
    relativePermittivity: { typical: 2.55, min: 2.4, max: 2.7 },
    lossTangent: { typical: 0.0002, min: 0.0001, max: 0.0005 },
    lossTangentNote: "Low loss at radio frequencies; loss rises near its glass transition.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Amorphous bulk sample.",
    },
    source:
      "Candidate reference (not checked): Kao, Dielectric Phenomena in Solids (Elsevier, 2004); CRC Handbook of Chemistry and Physics (CRC Press).",
    verificationStatus: "pending",
  },
  {
    id: "polymer-polyimide",
    name: "Polyimide (Kapton-type film)",
    category: "polymer",
    description:
      "High-temperature aromatic polymer film that retains its insulation properties over a wide temperature range.",
    applications: [
      "Flexible printed circuits",
      "Motor slot and winding insulation",
      "High-temperature tapes and films",
    ],
    relativePermittivity: { typical: 3.4, min: 3.2, max: 3.5 },
    lossTangent: { typical: 0.003, min: 0.002, max: 0.004 },
    lossTangentNote: "Loss rises with temperature and humidity.",
    measurement: {
      frequencyHz: 1e3,
      frequencyLabel: "1 kHz",
      temperatureC: 23,
      permittivityRegime: "frequency-dependent",
      notes: "Film grade and moisture content affect values.",
    },
    source:
      "Candidate reference (not checked): manufacturer datasheet for Kapton polyimide film (DuPont); Callister & Rethwisch, Materials Science and Engineering (Wiley).",
    verificationStatus: "pending",
  },
  {
    id: "polymer-epoxy",
    name: "Epoxy resin (unfilled)",
    category: "polymer",
    description:
      "Thermoset resin used for potting, encapsulation and laminates. Properties depend strongly on formulation.",
    applications: [
      "Potting and encapsulation of electronics",
      "Matrix for printed circuit board laminates",
      "Insulating coatings",
    ],
    relativePermittivity: { typical: 3.8, min: 3.5, max: 4.5 },
    lossTangent: { typical: 0.02, min: 0.005, max: 0.03 },
    lossTangentNote: "Highly formulation- and cure-dependent; absorbed moisture increases loss.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Cured unfilled resin; filled grades differ.",
    },
    source:
      "Candidate reference (not checked): Callister & Rethwisch, Materials Science and Engineering (Wiley); Kao, Dielectric Phenomena in Solids (Elsevier, 2004).",
    verificationStatus: "pending",
  },
  {
    id: "ceramic-alumina",
    name: "Alumina (96% Al2O3)",
    category: "ceramic",
    description:
      "Polycrystalline aluminum oxide ceramic with good mechanical strength and low loss at radio frequencies.",
    applications: [
      "Electronic substrates and packages",
      "High-voltage insulators",
      "RF and microwave components",
    ],
    relativePermittivity: { typical: 9.5, min: 9.0, max: 10.0 },
    lossTangent: { typical: 0.0003, min: 0.0001, max: 0.0005 },
    lossTangentNote: "Loss depends strongly on purity and grain boundary glassy phase.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Sintered 96% grade; higher purity grades differ.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Callister & Rethwisch, Materials Science and Engineering (Wiley).",
    verificationStatus: "pending",
  },
  {
    id: "ceramic-batio3",
    name: "Barium titanate (BaTiO3, polycrystalline)",
    category: "ceramic",
    description:
      "Ferroelectric ceramic with very high permittivity that peaks near its Curie temperature of about 120 °C.",
    applications: [
      "Multilayer ceramic capacitors",
      "Piezoelectric and ferroelectric transducers",
      "Positive temperature coefficient thermistors",
    ],
    relativePermittivity: { typical: 1500, min: 1000, max: 5000 },
    lossTangent: { typical: 0.015, min: 0.005, max: 0.03 },
    lossTangentNote: "Loss and permittivity vary strongly with temperature, DC bias field and dopants.",
    measurement: {
      frequencyHz: 1e3,
      frequencyLabel: "1 kHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes:
        "Well below the Curie temperature, which depends on composition; values change sharply near it. Commercial grades span a wide range, so the typical value is representative only.",
    },
    source:
      "Candidate reference (not checked): Kao, Dielectric Phenomena in Solids (Elsevier, 2004); CRC Handbook of Chemistry and Physics (CRC Press).",
    verificationStatus: "pending",
  },
  {
    id: "ceramic-steatite",
    name: "Steatite (magnesium silicate ceramic)",
    category: "ceramic",
    description:
      "Relatively low-loss talc-based ceramic historically used for radio-frequency insulators and components.",
    applications: [
      "RF connector insulators",
      "Resistor and coil formers",
      "Insulating supports for electronic assemblies",
    ],
    relativePermittivity: { typical: 6.0, min: 5.5, max: 6.5 },
    lossTangent: { typical: 0.0003, min: 0.0002, max: 0.0005 },
    lossTangentNote: "Manufacturer-dependent; loss rises with humidity and firing variation.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Commercial grade; composition varies by supplier.",
    },
    source:
      "Candidate reference (not checked): manufacturer datasheets for steatite grades; general ceramic dielectric references (to be identified).",
    verificationStatus: "pending",
  },
  {
    id: "glass-fused-silica",
    name: "Fused silica",
    category: "glass",
    description:
      "High-purity amorphous silicon dioxide with very low loss and a stable permittivity over a wide frequency range.",
    applications: [
      "Microwave and optical windows",
      "High-purity insulators and feedthroughs",
      "Laboratory glassware and optical fibre preforms",
    ],
    relativePermittivity: { typical: 3.8, min: 3.78, max: 3.82 },
    lossTangent: { typical: 0.0001, min: 0.00005, max: 0.0003 },
    lossTangentNote: "Very low loss; impurities, including OH groups, can raise loss.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "High-purity synthetic grade.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Kao, Dielectric Phenomena in Solids (Elsevier, 2004).",
    verificationStatus: "pending",
  },
  {
    id: "glass-soda-lime",
    name: "Soda-lime glass",
    category: "glass",
    description:
      "Common window and container glass with comparatively high permittivity and loss.",
    applications: [
      "Window and container glass",
      "Low-frequency insulating parts",
      "Reference material in dielectric education",
    ],
    relativePermittivity: { typical: 6.9, min: 6.5, max: 7.5 },
    lossTangent: { typical: 0.005, min: 0.002, max: 0.02 },
    lossTangentNote: "Loss increases strongly with temperature and alkali content.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Composition varies by manufacturer.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Kao, Dielectric Phenomena in Solids (Elsevier, 2004).",
    verificationStatus: "pending",
  },
  {
    id: "glass-borosilicate",
    name: "Borosilicate glass",
    category: "glass",
    description:
      "Low-expansion glass with moderate permittivity, used where thermal shock resistance matters.",
    applications: [
      "Laboratory glassware",
      "Sealed electrical feedthroughs",
      "Lamp envelopes",
    ],
    relativePermittivity: { typical: 4.7, min: 4.6, max: 5.0 },
    lossTangent: { typical: 0.004, min: 0.001, max: 0.01 },
    lossTangentNote: "Loss increases with temperature and alkali content.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Commercial borosilicate grade.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Callister & Rethwisch, Materials Science and Engineering (Wiley).",
    verificationStatus: "pending",
  },
  {
    id: "natural-muscovite-mica",
    name: "Muscovite mica",
    category: "natural",
    description:
      "Layered natural silicate that splits into thin, flexible, heat-stable sheets with good insulation.",
    applications: [
      "High-temperature capacitor and heater insulation",
      "Electrical sheet insulators",
      "Dielectric spacers in precision capacitors",
    ],
    relativePermittivity: { typical: 6.5, min: 5.4, max: 7.0 },
    lossTangent: { typical: 0.0004, min: 0.0001, max: 0.001 },
    lossTangentNote: "Depends on orientation to the cleavage plane and on impurities.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Natural sheet; orientation-dependent.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Kao, Dielectric Phenomena in Solids (Elsevier, 2004).",
    verificationStatus: "pending",
  },
  {
    id: "natural-quartz",
    name: "Quartz (crystalline SiO2)",
    category: "natural",
    description:
      "Crystalline silica with low loss and piezoelectric behaviour: it converts mechanical stress into voltage and back.",
    applications: [
      "Frequency-control crystal resonators",
      "Piezoelectric sensors",
      "Optical and insulating components",
    ],
    relativePermittivity: { typical: 4.5, min: 4.3, max: 4.6 },
    lossTangent: { typical: 0.0001, min: 0.00005, max: 0.0005 },
    lossTangentNote: "Very low loss; values depend on crystal axis and purity.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes: "Values quoted perpendicular to the c-axis; anisotropic.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press); Kittel, Introduction to Solid State Physics (Wiley).",
    verificationStatus: "pending",
  },
  {
    id: "natural-dry-pine-wood",
    name: "Pine wood (oven-dry)",
    category: "natural",
    description:
      "Organic natural material whose permittivity and loss are dominated by moisture content and grain direction.",
    applications: [
      "Teaching demonstrations of moisture effects on dielectrics",
      "Historical insulating parts in low-stress equipment",
    ],
    relativePermittivity: { typical: 2.5, min: 2.0, max: 3.5 },
    lossTangent: { typical: 0.02, min: 0.01, max: 0.05 },
    lossTangentNote: "Dominated by moisture; values rise sharply with humidity.",
    measurement: {
      frequencyHz: 1e6,
      frequencyLabel: "1 MHz",
      temperatureC: 20,
      permittivityRegime: "frequency-dependent",
      notes:
        "Oven-dried sample; values depend on grain direction and density. In service, moisture content changes values strongly.",
    },
    source:
      "Candidate reference (not checked): Kollmann and Cote, Principles of Wood Science and Technology (Springer); CRC Handbook of Chemistry and Physics (CRC Press).",
    verificationStatus: "pending",
  },
  {
    id: "liquid-mineral-oil",
    name: "Mineral insulating oil",
    category: "liquid",
    description:
      "Refined petroleum oil used to insulate and cool transformers and high-voltage equipment.",
    applications: [
      "Transformer insulation and cooling",
      "High-voltage cable and capacitor impregnation",
      "Switchgear insulation",
    ],
    relativePermittivity: { typical: 2.2, min: 2.1, max: 2.5 },
    lossTangent: { typical: 0.0005, min: 0.0001, max: 0.002 },
    lossTangentNote: "Loss rises rapidly with temperature and contamination or moisture.",
    measurement: {
      frequencyHz: 50,
      frequencyLabel: "50 Hz",
      temperatureC: 25,
      permittivityRegime: "frequency-dependent",
      notes:
        "Unaged oil; grade and water content matter. Oil testing is often specified at elevated temperature, so these values at 25 °C may not match test-standard results.",
    },
    source:
      "Candidate reference (not checked): IEC 60296 (unused mineral insulating oils for transformers and switchgear); CRC Handbook of Chemistry and Physics (CRC Press).",
    verificationStatus: "pending",
  },
  {
    id: "liquid-deionized-water",
    name: "Deionized water",
    category: "liquid",
    description:
      "Strongly polar liquid with a very high static permittivity that falls with frequency due to molecular relaxation.",
    applications: [
      "Reference liquid for dielectric spectroscopy",
      "Capacitive sensing of moisture and water content",
      "Dielectric heating and microwave absorption studies",
    ],
    relativePermittivity: { typical: 78.4, min: 78.0, max: 78.5 },
    lossTangent: null,
    lossTangentNote:
      "Not a single value: loss is dominated by ionic conductivity and depends on purity, frequency and temperature.",
    measurement: {
      frequencyHz: 0,
      frequencyLabel: "Static (low-frequency limit)",
      temperatureC: 25,
      permittivityRegime: "static",
      notes:
        "Low-frequency limit. Permittivity falls as frequency rises toward the microwave range and decreases as temperature rises.",
    },
    source:
      "Candidate reference (not checked): CRC Handbook of Chemistry and Physics (CRC Press), dielectric constant of water table.",
    verificationStatus: "pending",
  },
  {
    id: "semiconductor-silicon",
    name: "Silicon (intrinsic)",
    category: "semiconductor",
    description:
      "Elemental semiconductor whose dielectric response combines lattice and electronic contributions.",
    applications: [
      "Integrated circuit gate oxides and passivation layers",
      "Sensor and detector substrates",
      "Reference material for semiconductor permittivity",
    ],
    relativePermittivity: { typical: 11.7, min: 11.5, max: 12.0 },
    lossTangent: null,
    lossTangentNote:
      "Not a single value: loss depends on free-carrier density set by doping and temperature.",
    measurement: {
      frequencyHz: 0,
      frequencyLabel: "Static (DC)",
      temperatureC: 27,
      permittivityRegime: "static",
      notes: "Static (low-frequency) value near 300 K.",
    },
    source:
      "Candidate reference (not checked): Kittel, Introduction to Solid State Physics (Wiley); CRC Handbook of Chemistry and Physics (CRC Press), semiconductor tables.",
    verificationStatus: "pending",
  },
  {
    id: "semiconductor-germanium",
    name: "Germanium (intrinsic)",
    category: "semiconductor",
    description:
      "Elemental semiconductor with a higher permittivity than silicon, used in infrared optics and early transistors.",
    applications: [
      "Infrared optics and windows",
      "Radiation detectors",
      "High-frequency transistor research",
    ],
    relativePermittivity: { typical: 16.2, min: 16.0, max: 16.4 },
    lossTangent: null,
    lossTangentNote:
      "Not a single value: loss depends on free-carrier density set by doping and temperature.",
    measurement: {
      frequencyHz: 0,
      frequencyLabel: "Static (DC)",
      temperatureC: 27,
      permittivityRegime: "static",
      notes: "Static (low-frequency) value near 300 K.",
    },
    source:
      "Candidate reference (not checked): Kittel, Introduction to Solid State Physics (Wiley); CRC Handbook of Chemistry and Physics (CRC Press), semiconductor tables.",
    verificationStatus: "pending",
  },
  {
    id: "semiconductor-gallium-arsenide",
    name: "Gallium arsenide (GaAs)",
    category: "semiconductor",
    description:
      "Compound III-V semiconductor used where high electron mobility and direct bandgap are needed.",
    applications: [
      "Microwave and RF amplifiers",
      "Optoelectronic devices and LEDs",
      "Solar cells for space applications",
    ],
    relativePermittivity: { typical: 12.9, min: 12.5, max: 13.2 },
    lossTangent: null,
    lossTangentNote:
      "Not a single value: loss depends on free-carrier density, doping and frequency.",
    measurement: {
      frequencyHz: 0,
      frequencyLabel: "Static (DC)",
      temperatureC: 27,
      permittivityRegime: "static",
      notes: "Static (low-frequency) value near 300 K.",
    },
    source:
      "Candidate reference (not checked): Kittel, Introduction to Solid State Physics (Wiley); CRC Handbook of Chemistry and Physics (CRC Press), semiconductor tables.",
    verificationStatus: "pending",
  },
];
