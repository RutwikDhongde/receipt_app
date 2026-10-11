// Builds the POC into self-contained HTML pages.
//   npm run build   -> dist/index.html (open locally) + dist/artifact.html (published page)
//   npm run check   -> only validates data/app-data.json
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { validate } from "../src/model.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const dist = join(root, "dist");

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };

function fail(lines) {
  console.error("\nData problems in data/app-data.json:\n" + lines.map((l) => "  - " + l).join("\n") + "\n");
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(join(dataDir, "app-data.json"), "utf8"));
} catch (e) {
  fail(["Not valid JSON: " + e.message]);
}
const errors = validate(data);
if (errors.length) fail(errors);

// Image fields may name a file under data/ (e.g. "images/wings.jpg"); it is
// embedded so the page needs no image hosting.
const imageErrors = [];
function embed(value, where) {
  if (!value || /^data:/.test(value)) return value;
  const file = join(dataDir, value);
  const type = MIME[extname(file).toLowerCase()];
  if (!type) { imageErrors.push(`${where}: "${value}" is not a png, jpg, webp, gif or svg file.`); return null; }
  if (!existsSync(file)) { imageErrors.push(`${where}: data/${value} does not exist.`); return null; }
  return `data:${type};base64,${readFileSync(file).toString("base64")}`;
}
data.profile.avatar = embed(data.profile.avatar, "profile.avatar");
data.images = Object.fromEntries(Object.entries(data.images || {}).map(([k, v]) => [k, embed(v, `images.${k}`)]));
data.orders.forEach((o, i) => { o.banner = embed(o.banner, `orders[${i}].banner`); });
if (imageErrors.length) fail(imageErrors);

const counts = `${data.orders.length} orders, ${data.payments.length} payment methods`;
if (process.argv.includes("--check")) {
  console.log(`Data OK: ${counts}.`);
  process.exit(0);
}

const out = await build({
  entryPoints: [join(root, "src/app.jsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  target: "es2019",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  loader: { ".js": "jsx" },
});
const js = out.outputFiles[0].text;
const css = readFileSync(join(root, "src/styles.css"), "utf8");
const json = JSON.stringify(data).replace(/</g, "\\u003c");

const head = `<title>Pronto Receipts</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap">
<style>
${css}
</style>`;
const body = `<div id="root"></div>
<script id="app-data" type="application/json">${json}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
${js}</script>`;

mkdirSync(dist, { recursive: true });
// The artifact host supplies doctype, <head> and <body> itself.
writeFileSync(join(dist, "artifact.html"), `${head}\n${body}\n`);
writeFileSync(join(dist, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
</body>
</html>
`);
console.log(`Built dist/index.html and dist/artifact.html (${counts}).`);
