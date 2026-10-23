import { test } from "node:test";
import assert from "node:assert/strict";
import { loadMessages, locales, strings } from "./helpers.mjs";

const messages = Object.fromEntries(locales.map((l) => [l, loadMessages(l)]));

function kind(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function shapeDiffs(a, b, path = "") {
  const diffs = [];
  if (kind(a) !== kind(b)) return [`${path || "<root>"}: ${kind(a)} vs ${kind(b)}`];
  if (kind(a) === "array") {
    if (a.length !== b.length) diffs.push(`${path}: length ${a.length} vs ${b.length}`);
    a.slice(0, b.length).forEach((v, i) => diffs.push(...shapeDiffs(v, b[i], `${path}[${i}]`)));
  } else if (kind(a) === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in a)) diffs.push(`${p}: missing in first`);
      else if (!(key in b)) diffs.push(`${p}: missing in second`);
      else diffs.push(...shapeDiffs(a[key], b[key], p));
    }
  }
  return diffs;
}

test("locales have identical shape", () => {
  for (const locale of ["ru", "en"]) {
    assert.deepEqual(shapeDiffs(messages.uz, messages[locale]), [], `uz vs ${locale}`);
  }
});

test("enum values are identical across locales", () => {
  const enumKeys = new Set(["status", "tone", "level", "kind", "icon"]);
  const uzEnums = [...strings(messages.uz)].filter(([path]) =>
    enumKeys.has(path.split(".").at(-1).replace(/\[\d+\]$/, "")),
  );
  for (const locale of ["ru", "en"]) {
    const other = new Map(strings(messages[locale]));
    for (const [path, value] of uzEnums) {
      assert.equal(other.get(path), value, `${locale} ${path}`);
    }
  }
});

test("no Patogen service and no 13-service counts", () => {
  const countOf13 = /\b13\b\s*(ta|xizmat|AI|услуг|сервис|ИИ|services|AI services)/i;
  for (const locale of locales) {
    assert.equal(messages[locale].services?.items?.patogen, undefined, `${locale} patogen`);
    for (const [path, value] of strings(messages[locale])) {
      assert.doesNotMatch(value, countOf13, `${locale} ${path}`);
    }
  }
});

test("shell copy is present in every locale", () => {
  const required = [
    "site.brand", "site.committee", "site.emblemAlt",
    "nav.label", "nav.services", "nav.technologies", "nav.numbers", "nav.journey",
    "nav.login", "nav.menuOpen", "nav.menuClose",
    "notice.testMode", "notice.label",
    "footer.org", "footer.portal", "footer.hotline", "footer.lawsTitle",
    "footer.allLaws", "footer.socialLabel", "footer.copyright",
  ];
  for (const locale of locales) {
    const flat = new Map(strings(messages[locale]));
    for (const key of required) assert.ok(flat.get(key), `${locale} ${key}`);
    assert.equal(messages[locale].footer.laws.length, 4, `${locale} footer.laws`);
  }
});

test("homepage counts read 12", () => {
  for (const locale of locales) {
    const home = messages[locale].home;
    assert.equal(home.hero?.stats?.[1]?.value, "12", `${locale} hero stat`);
    assert.match(home.services?.title ?? "", /12/, `${locale} services title`);
  }
});

test("old coming-soon copy is gone", () => {
  for (const locale of locales) {
    assert.equal(messages[locale].home.legacy, undefined, `${locale} home.legacy`);
    for (const [path, value] of strings(messages[locale])) {
      assert.doesNotMatch(value, /Rasmiy veb-sayt|Platforma imkoniyatlari|Reyestrga a'zo/, `${locale} ${path}`);
    }
  }
});

test("journey has 4 stages and stage 2 has no Patogen", () => {
  for (const locale of locales) {
    const journey = messages[locale].home.journey;
    assert.equal(journey?.stages?.length, 4, `${locale} stages`);
    assert.doesNotMatch(journey.stages[1].link, /patogen/i, `${locale} stage 2 link`);
    for (const stage of journey.stages) assert.ok(stage.imageAlt, `${locale} imageAlt`);
  }
});
