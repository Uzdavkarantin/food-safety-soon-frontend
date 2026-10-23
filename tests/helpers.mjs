import { readFileSync } from "node:fs";

export const locales = ["uz", "ru", "en"];

const root = new URL("../src/messages/", import.meta.url);

function readJson(locale, file) {
  return JSON.parse(readFileSync(new URL(`${locale}/${file}.json`, root), "utf8"));
}

// Same merge as src/i18n/request.ts
export function loadMessages(locale) {
  return {
    ...readJson(locale, "common"),
    home: readJson(locale, "home"),
    services: readJson(locale, "services"),
  };
}

// Yields [path, value] for every leaf string in a message tree.
export function* strings(node, path = "") {
  if (typeof node === "string") yield [path, node];
  else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      yield* strings(value, path ? `${path}.${key}` : key);
    }
  }
}
