const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PLUGINS = path.join(ROOT, "plugins");
const PUBLIC = path.join(ROOT, "public");
const PUB_PLUGINS = path.join(PUBLIC, "plugins");
const OUT = path.join(PUBLIC, "plugins.json");

fs.mkdirSync(PUBLIC, { recursive: true });
fs.mkdirSync(PUB_PLUGINS, { recursive: true });

const pick = (code, key) => {
  const re = new RegExp(`handler\\.${key}\\s*=\\s*(['"\`])([\\s\\S]*?)\\1`, "m");
  const m = code.match(re);
  return m ? m[2].trim() : null;
};

const pickArr = (code, key) => {
  const re = new RegExp(`handler\\.${key}\\s*=\\s*\\[([\\s\\S]*?)\\]`, "m");
  const m = code.match(re);
  if (!m) return [];
  return m[1].split(",").map(x => x.replace(/['"\`]/g,"").trim()).filter(Boolean);
};

const items = [];

for (const file of fs.readdirSync(PLUGINS).filter(f=>f.endsWith(".js"))) {
  const src = path.join(PLUGINS, file);
  const code = fs.readFileSync(src, "utf8");

  const title = pick(code,"alias") || file;
  const category = pick(code,"category") || "misc";
  const tags = pickArr(code,"tags");

  fs.copyFileSync(src, path.join(PUB_PLUGINS, file));

  items.push({
    file,
    title,
    category,
    tags: [...new Set([category, ...tags])],
    updatedAt: fs.statSync(src).mtimeMs
  });
}

fs.writeFileSync(
  OUT,
  JSON.stringify({ brand:"ShuraDev3", count:items.length, items }, null, 2)
);

console.log("✔ ShuraDev3 build selesai");
