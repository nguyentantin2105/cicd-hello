const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const file of fs.readdirSync(SRC)) {
  fs.copyFileSync(path.join(SRC, file), path.join(DIST, file));
}

const buildId =
  process.env.GITHUB_SHA?.slice(0, 7) ||
  new Date().toISOString().replace(/[:.]/g, "-");

const indexPath = path.join(DIST, "index.html");
const html = fs
  .readFileSync(indexPath, "utf8")
  .replace('<span id="build">dev</span>', `<span id="build">${buildId}</span>`);
fs.writeFileSync(indexPath, html);

console.log(`Built dist/ with build id: ${buildId}`);
