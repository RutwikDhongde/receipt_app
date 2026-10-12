// npm run phone: keeps the page rebuilt from data/ and src/, and starts the
// Expo dev server for the iPhone app in mobile/. Scan the QR code it prints
// with the iPhone camera to open the app in Expo Go.
import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { watchAll } from "./build.mjs";

const mobile = join(resolve(dirname(fileURLToPath(import.meta.url)), ".."), "mobile");

if (!existsSync(join(mobile, "node_modules"))) {
  console.log("Installing the iPhone app's packages (first run only, takes a minute)...");
  const r = spawnSync("npm", ["install"], { cwd: mobile, stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

await watchAll();

// Extra arguments pass through, e.g. `npm run phone -- --tunnel` when the
// phone cannot reach this computer over Wi-Fi.
const expo = spawn("npx", ["expo", "start", ...process.argv.slice(2)], { cwd: mobile, stdio: "inherit", shell: true });
expo.on("exit", (code) => process.exit(code ?? 0));
