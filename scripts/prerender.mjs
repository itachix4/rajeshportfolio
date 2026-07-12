import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "../.ssr/entry-server.js";

const outputPath = resolve("dist/index.html");
const template = await readFile(outputPath, "utf8");
const root = '<div id="root"></div>';

if (!template.includes(root)) {
  throw new Error("Unable to find the root element in the production HTML.");
}

const injectApp = (pageTemplate, appHtml) =>
  pageTemplate.replace(root, `<div id="root">${appHtml}</div>`);

const portfolioHtml = render("/");
await writeFile(outputPath, injectApp(template, portfolioHtml), "utf8");

const labTemplate = template
  .replaceAll(
    "Parth Parwani — Full-Stack Developer, Designer & Founder",
    "Compute Lab — Parth Parwani",
  )
  .replace(
    "Parth Parwani is a 17-year-old full-stack developer, designer, entrepreneur, and founder of ForgeLane.",
    "Live WebGL experiments by Parth Parwani: raymarching, 100,000 GPU particles and reaction-diffusion simulation.",
  )
  .replace('href="https://parthparwani.com/"', 'href="https://parthparwani.com/lab"')
  .replace(
    '<meta property="og:url" content="https://parthparwani.com/" />',
    '<meta property="og:url" content="https://parthparwani.com/lab" />',
  )
  .replace(
    "Premium websites, brand identities and modern digital products—designed and built by Parth Parwani.",
    "Three live GPU experiments in raymarching, particle flow and reaction-diffusion by Parth Parwani.",
  );
const labHtml = render("/lab");
const labDirectory = resolve("dist/lab");
await mkdir(labDirectory, { recursive: true });
await writeFile(resolve(labDirectory, "index.html"), injectApp(labTemplate, labHtml), "utf8");

console.log(
  `Prerendered portfolio (${portfolioHtml.length.toLocaleString()} chars) and lab (${labHtml.length.toLocaleString()} chars)`,
);
