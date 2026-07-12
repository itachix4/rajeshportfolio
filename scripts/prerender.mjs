import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "../.ssr/entry-server.js";

const outputPath = resolve("dist/index.html");
const template = await readFile(outputPath, "utf8");
const appHtml = render();
const root = '<div id="root"></div>';

if (!template.includes(root)) {
  throw new Error("Unable to find the root element in the production HTML.");
}

await writeFile(
  outputPath,
  template.replace(root, `<div id="root">${appHtml}</div>`),
  "utf8",
);

console.log(`Prerendered ${appHtml.length.toLocaleString()} characters into dist/index.html`);
