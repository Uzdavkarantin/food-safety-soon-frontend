import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const src = new URL("../src/", import.meta.url);
const css = readFileSync(new URL("app/globals.css", src), "utf8");

function tsxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
    if (entry.isDirectory()) return tsxFiles(url);
    return entry.name.endsWith(".tsx") ? [url] : [];
  });
}

// Body of the first `{ … }` block that follows `selector`, braces balanced.
function block(selector) {
  const start = css.indexOf(selector);
  assert.notEqual(start, -1, `${selector} not found in globals.css`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unbalanced block after ${selector}`);
}

const declared = (body) => new Set([...body.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

test("no hex colours in components", () => {
  for (const file of tsxFiles(src)) {
    const text = readFileSync(file, "utf8");
    assert.doesNotMatch(text, /#[0-9a-fA-F]{3,8}\b/, file.pathname);
  }
});

test("dark theme defines every light token", () => {
  const light = declared(block(":root {"));
  const dark = declared(block(".dark {"));
  assert.ok(light.has("--accent"), "light tokens include --accent");
  for (const name of light) assert.ok(dark.has(name), `.dark is missing ${name}`);
});

test("reduced motion stops every animated class", () => {
  const body = block("@media (prefers-reduced-motion: reduce)");
  for (const cls of [".marquee", ".logo-3d", ".ring", ".orbit", ".glow", ".cue",
    ".j-stage", ".j-media", ".j-text", ".j-node", ".j-line"]) {
    assert.ok(body.includes(cls), `reduced-motion block is missing ${cls}`);
  }
});

test("site-wide cursor overlay never blocks clicks", () => {
  for (const selector of [".cursor-glow {", ".cursor-dot {"]) {
    const body = block(selector);
    assert.match(body, /position:\s*fixed/, `${selector} is fixed to the viewport`);
    assert.match(body, /pointer-events:\s*none/, `${selector} lets clicks through`);
  }
});

test("journey scroll animations only run where view timelines are supported", () => {
  const supports = "@supports (animation-timeline: view())";
  const body = block(supports);
  for (const cls of [".j-stage", ".j-media", ".j-text", ".j-node", ".j-line"]) {
    assert.ok(body.includes(cls), `${cls} animated inside @supports`);
  }
  const start = css.indexOf(supports);
  const outside = css.slice(0, start) + css.slice(start + supports.length + body.length + 2);
  assert.doesNotMatch(outside, /animation-timeline/, "no view timeline outside @supports");
});
