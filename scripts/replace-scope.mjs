import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run");
const includeNova = args.has("--include-nova");

const ROOT = process.cwd();
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "dist-tarballs",
  ".angular",
  ".next",
  "coverage"
]);

const SKIP_BASENAMES = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "replace-scope.mjs"
]);

// Explicitly included text formats (.css, .md, .html, etc.)
const EXPLICIT_TEXT_EXTENSIONS = new Set([
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".md",
  ".mdx",
  ".html",
  ".htm",
  ".json",
  ".jsonc",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".vue",
  ".svelte",
  ".yaml",
  ".yml",
  ".toml",
  ".xml",
  ".svg",
  ".sh",
  ".bash",
  ".zsh",
  ".txt",
  ".env",
  ".example",
  ".conf",
  ".config",
  ".ini"
]);

const BINARY_EXTENSIONS = new Set([
  ".tgz",
  ".tar",
  ".gz",
  ".zip",
  ".7z",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".bmp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".mp3",
  ".mp4",
  ".mov",
  ".avi",
  ".pdf",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".bin",
  ".lockb"
]);

// Ordered from most specific to least specific so longer tokens match cleanly
const REPLACEMENTS = [
  ["@omni/", "@kvui/"],
  ["Omni", "Kvui"],
  ["omni", "kvui"]
];

if (includeNova) {
  REPLACEMENTS.push(
    ["nova-ui", "kvui"],
    ["Nova-ui", "Kvui"],
    ["Nova", "Kvui"],
    ["nova", "kvui"]
  );
}

function shouldSkipFile(filePath) {
  const base = path.basename(filePath);
  if (SKIP_BASENAMES.has(base)) return true;

  const ext = path.extname(base).toLowerCase();
  if (EXPLICIT_TEXT_EXTENSIONS.has(ext)) return false;
  if (BINARY_EXTENSIONS.has(ext)) return true;

  return false;
}

function isBinaryBuffer(buf) {
  const sampleLen = Math.min(buf.length, 8192);
  for (let i = 0; i < sampleLen; i++) {
    if (buf[i] === 0) return true;
  }
  return false;
}

function applyReplacements(content) {
  let updated = content;
  let totalHits = 0;

  for (const [needle, replacement] of REPLACEMENTS) {
    if (!needle) continue;
    const parts = updated.split(needle);
    if (parts.length > 1) {
      totalHits += parts.length - 1;
      updated = parts.join(replacement);
    }
  }

  return { updated, totalHits };
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), results);
      }
      continue;
    }

    if (!entry.isFile() && !entry.isSymbolicLink()) continue;

    const fullPath = path.join(dir, entry.name);
    if (shouldSkipFile(fullPath)) continue;

    let buf;
    try {
      buf = fs.readFileSync(fullPath);
    } catch {
      continue;
    }

    const ext = path.extname(fullPath).toLowerCase();
    if (!EXPLICIT_TEXT_EXTENSIONS.has(ext) && isBinaryBuffer(buf)) continue;

    const original = buf.toString("utf8");
    const { updated, totalHits } = applyReplacements(original);

    if (totalHits > 0 && updated !== original) {
      results.push({
        file: path.relative(ROOT, fullPath),
        hits: totalHits,
        updated
      });
    }
  }
  return results;
}

const matches = walk(ROOT);

if (matches.length === 0) {
  console.log("No matching occurrences found across the codebase.");
  process.exit(0);
}

let totalReplacements = 0;
for (const item of matches) {
  totalReplacements += item.hits;
  console.log(
    `${isDryRun ? "[dry-run] " : ""}${item.file} (${item.hits} replacement${item.hits === 1 ? "" : "s"})`
  );
  if (!isDryRun) {
    fs.writeFileSync(path.join(ROOT, item.file), item.updated, "utf8");
  }
}

console.log(
  `\n${isDryRun ? "Would update" : "Updated"} ${matches.length} file(s) with ${totalReplacements} total replacement(s).`
);