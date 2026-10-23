import { test } from "node:test";
import assert from "node:assert/strict";
import { journeyStages, serviceSlugs, services } from "../src/config/services.ts";
import { existsSync } from "node:fs";
import { loadMessages, locales } from "./helpers.mjs";

const messages = Object.fromEntries(locales.map((l) => [l, loadMessages(l)]));

const ORDER = [
  "sertifikat", "call-center", "murojaatlar", "fermer", "reyting", "import",
  "eksport", "bozor", "yorliq", "hisobot", "kuzatuv", "oshxona",
];

test("12 services in design order", () => {
  assert.deepEqual(serviceSlugs, ORDER);
  assert.equal(new Set(serviceSlugs).size, 12);
});

test("related and journey slugs exist", () => {
  for (const { slug, related } of services) {
    assert.ok(related.length > 0, `${slug} has related services`);
    for (const r of related) {
      assert.ok(serviceSlugs.includes(r), `${slug} → ${r} exists`);
      assert.notEqual(r, slug, `${slug} does not relate to itself`);
    }
  }
  assert.deepEqual(journeyStages.map((s) => s.key), ["dala", "laboratoriya", "chegara", "bozor"]);
  for (const { slug } of journeyStages) assert.ok(serviceSlugs.includes(slug), slug);
});

test("every service has card copy in every locale", () => {
  for (const locale of locales) {
    for (const slug of serviceSlugs) {
      const item = messages[locale].services.items[slug];
      assert.ok(item?.name, `${locale} ${slug}.name`);
      assert.ok(item?.card, `${locale} ${slug}.card`);
    }
  }
});

const FIELD_TYPES = ["textarea", "text", "number", "select", "file"];

test("every service page has complete copy", () => {
  for (const locale of locales) {
    for (const slug of serviceSlugs) {
      const item = messages[locale].services.items[slug];
      const at = `${locale} ${slug}`;
      for (const key of ["lead", "forWho", "basis"]) assert.ok(item[key], `${at}.${key}`);
      assert.ok(item.result?.title, `${at}.result.title`);
      assert.ok(item.result?.badge, `${at}.result.badge`);
      assert.equal(item.steps?.length, 3, `${at}.steps`);
      for (const key of ["title", "submit", "reset"]) assert.ok(item.form?.[key], `${at}.form.${key}`);
      assert.ok(item.form.fields.length >= 2, `${at}.form.fields`);
      const ids = item.form.fields.map((f) => f.id);
      assert.equal(new Set(ids).size, ids.length, `${at} field ids unique`);
      for (const field of item.form.fields) {
        assert.ok(field.label, `${at} ${field.id}.label`);
        assert.ok(FIELD_TYPES.includes(field.type), `${at} ${field.id}.type`);
        if (field.type === "select") assert.ok(field.options.length >= 2, `${at} ${field.id}.options`);
        if (field.type === "file") assert.ok(field.hint, `${at} ${field.id}.hint`);
      }
    }
  }
});

test("service common copy says 12", () => {
  for (const locale of locales) {
    assert.match(messages[locale].services.common.allServices, /12/, locale);
    assert.ok(messages[locale].services.common.disclaimer, `${locale} disclaimer`);
  }
});

const BLOCK_KINDS = [
  "text", "note", "tags", "pills", "stats", "bars", "chat", "score", "signal", "progress",
  "timeline", "action", "cameras", "live",
];

// Services whose result body (beyond title + badge) is built; grows task by task.
const resultSlugs = [
  "sertifikat", "call-center", "murojaatlar", "fermer", "reyting",
  "import", "eksport", "bozor", "yorliq", "hisobot", "kuzatuv", "oshxona",
];

test("every service has a result body", () => {
  assert.deepEqual([...resultSlugs].sort(), [...serviceSlugs].sort());
});

test("built services have result body data", () => {
  for (const locale of locales) {
    for (const slug of resultSlugs) {
      const blocks = messages[locale].services.items[slug].result.blocks;
      assert.ok(blocks?.length > 0, `${locale} ${slug} result.blocks`);
      for (const block of blocks) assert.ok(BLOCK_KINDS.includes(block.kind), `${locale} ${slug} ${block.kind}`);
    }
  }
});

test("oshxona opens with a live camera whose video and poster exist", () => {
  for (const locale of locales) {
    const [first] = messages[locale].services.items.oshxona.result.blocks;
    assert.equal(first.kind, "live", `${locale} first block`);
    assert.ok(first.boxes.length >= 3, `${locale} detection boxes`);
    for (const box of first.boxes) assert.ok(["green", "red"].includes(box.level), `${locale} box level`);
  }
  for (const file of ["oshxona-live.mp4", "oshxona-live.jpg"]) {
    assert.ok(existsSync(new URL(`../public/videos/${file}`, import.meta.url)), file);
  }
});
