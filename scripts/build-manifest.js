const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PLUGINS_DIR = path.join(ROOT, "plugins");
const PUBLIC_DIR = path.join(ROOT, "public");
const PUBLIC_PLUGINS_DIR = path.join(PUBLIC_DIR, "plugins");
const OUT_JSON = path.join(PUBLIC_DIR, "plugins.json");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function uniq(arr) {
  return [...new Set(arr)];
}

function toSlug(filename) {
  return filename
    .replace(/\.js$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, ""); // aman utk URL
}

// handler.key = "..."
function pickString(code, key) {
  const re = new RegExp(`handler\\.${key}\\s*=\\s*(['"\`])([\\s\\S]*?)\\1`, "m");
  const m = code.match(re);
  return m ? String(m[2]).trim() : null;
}

// handler.tags = ["a","b"]
function pickArray(code, key) {
  const re = new RegExp(`handler\\.${key}\\s*=\\s*\\[([\\s\\S]*?)\\]`, "m");
  const m = code.match(re);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .map((s) => s.replace(/^['"`]|['"`]$/g, ""))
    .filter(Boolean);
}

// handler.code = ` ... `
function pickBacktickBlock(code, key) {
  const re = new RegExp(`handler\\.${key}\\s*=\\s*\\\`([\\s\\S]*?)\\\``, "m");
  const m = code.match(re);
  return m ? String(m[1]).trim() : null;
}

function normalizeTag(t) {
  return String(t || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function main() {
  ensureDir(PUBLIC_DIR);
  ensureDir(PUBLIC_PLUGINS_DIR);

  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error("❌ Folder plugins/ tidak ditemukan.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(PLUGINS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".js"))
    .sort((a, b) => a.localeCompare(b));

  const items = [];

  for (const file of files) {
    const abs = path.join(PLUGINS_DIR, file);
    const src = fs.readFileSync(abs, "utf8");

    const slug = toSlug(file);

    const alias = pickString(src, "alias");
    const title = alias || slug;

    const category = normalizeTag(pickString(src, "category") || "misc");
    const desc = pickString(src, "desc") || "";

    const tagsFromTags = pickArray(src, "tags").map(normalizeTag);
    const tagSingle = pickString(src, "tag");
    const tags = uniq(
      [category, ...(tagSingle ? [normalizeTag(tagSingle)] : []), ...tagsFromTags]
        .map(normalizeTag)
        .filter(Boolean)
    ).sort();

    const raw = pickBacktickBlock(src, "code") || "";
    const hasRaw = Boolean(raw && raw.trim().length);

    // Copy plugin asli ke public/plugins (opsional, tapi berguna buat debug)
    fs.copyFileSync(abs, path.join(PUBLIC_PLUGINS_DIR, file));

    items.push({
      id: file,
      slug,           // ✅ untuk route /slug
      title,
      file,
      category,
      tags,
      desc,
      raw,            // ✅ hanya handler.code (tanpa metadata)
      hasRaw,
      updatedAt: fs.statSync(abs).mtimeMs
    });
  }

  const allTags = uniq(items.flatMap((x) => x.tags)).sort();
  const out = {
    brand: "ShuraDev3",
    count: items.length,
    tags: ["all", ...allTags],
    items
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");
  console.log(`✅ Generated ${path.relative(ROOT, OUT_JSON)} (${items.length} items)`);
}

main();