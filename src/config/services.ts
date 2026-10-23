// Data only, no imports: tests/services.test.mjs loads this file directly with Node.

export type Tone = "blue" | "green" | "amber" | "red" | "slate";

export type ServiceConfig = {
  slug: string;
  /** Icon tile colour on cards and the page title. */
  tone: "blue" | "green";
  /** Colour of the result-card badge. */
  badgeTone: Tone;
  /** "Boshqa xizmatlar" links, in display order. */
  related: string[];
};

// Homepage order from the design (AI Patogen removed).
export const services: ServiceConfig[] = [
  { slug: "sertifikat", tone: "blue", badgeTone: "blue", related: ["eksport", "import", "yorliq"] },
  { slug: "call-center", tone: "blue", badgeTone: "green", related: ["murojaatlar", "sertifikat", "reyting"] },
  { slug: "murojaatlar", tone: "blue", badgeTone: "red", related: ["call-center", "oshxona", "reyting"] },
  { slug: "fermer", tone: "green", badgeTone: "green", related: ["kuzatuv", "eksport", "sertifikat"] },
  { slug: "reyting", tone: "blue", badgeTone: "red", related: ["murojaatlar", "oshxona", "yorliq"] },
  { slug: "import", tone: "blue", badgeTone: "amber", related: ["eksport", "bozor", "kuzatuv"] },
  { slug: "eksport", tone: "blue", badgeTone: "amber", related: ["sertifikat", "yorliq", "import"] },
  { slug: "bozor", tone: "blue", badgeTone: "red", related: ["kuzatuv", "import", "yorliq"] },
  { slug: "yorliq", tone: "blue", badgeTone: "red", related: ["sertifikat", "import", "eksport"] },
  { slug: "hisobot", tone: "blue", badgeTone: "green", related: ["reyting", "murojaatlar", "bozor"] },
  { slug: "kuzatuv", tone: "blue", badgeTone: "green", related: ["bozor", "import", "fermer"] },
  { slug: "oshxona", tone: "blue", badgeTone: "amber", related: ["murojaatlar", "reyting"] },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): ServiceConfig | undefined {
  return services.find((s) => s.slug === slug);
}

// "Daladan dasturxongacha" stages; images live in public/images/journey/{key}.jpg.
export const journeyStages: {
  key: "dala" | "laboratoriya" | "chegara" | "bozor";
  slug: string;
  tone: "green" | "blue" | "amber" | "navy";
}[] = [
  { key: "dala", slug: "fermer", tone: "green" },
  { key: "laboratoriya", slug: "eksport", tone: "blue" },
  { key: "chegara", slug: "import", tone: "amber" },
  { key: "bozor", slug: "bozor", tone: "navy" },
];
