const $ = (q) => document.querySelector(q);

let DB = null;
let activeTag = "all";
let q = "";
let RAW = "";

function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 1200);
}

function downloadJsFromRaw(filename, raw){
  const blob = new Blob([raw.trim() + "\n"], { type: "application/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename.endsWith(".js") ? filename : (filename + ".js");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function openRaw(item){
  if (!item?.hasRaw || !item?.raw) return toast("Belum ada handler.code ❌");
  RAW = item.raw;

  $("#mTitle").textContent = item.title;
  $("#mSub").textContent = `/${item.slug}  •  ${item.file}`;

  const codeEl = $("#codeBox");
  codeEl.textContent = item.raw;

  $("#modal").classList.add("show");

  if (window.Prism?.highlightElement) {
    requestAnimationFrame(() => Prism.highlightElement(codeEl));
  }
}

function closeModal(){ $("#modal").classList.remove("show"); }

function card(item){
  const el = document.createElement("div");
  el.className = "card";
  const pills = (item.tags||[]).slice(0, 8).map(t => `<span class="pill">${t}</span>`).join("");

  el.innerHTML = `
    <div class="row">
      <div class="icon">&lt;/&gt;</div>
      <div class="h">
        <div class="name">${item.title}</div>
        <div class="file">( ${item.file} )</div>
      </div>
    </div>
    <div class="desc">${item.desc || ""}</div>
    <div class="pills">${pills}</div>
    <div class="actions">
      <button class="btn" data-go="/${item.slug}">Open</button>
      <button class="btn" data-raw="1">Raw</button>
      <button class="btn ghost" data-dl="1">Download</button>
    </div>
  `;

  el.querySelector("[data-go]").onclick = () => navigate(`/${item.slug}`);
  el.querySelector("[data-raw]").onclick = () => navigate(`/${item.slug}/raw`);
  el.querySelector("[data-dl]").onclick  = () => navigate(`/${item.slug}/download`);

  return el;
}

function renderList(){
  const grid = $("#grid");
  grid.innerHTML = "";

  const items = DB.items
    .filter(it => {
      const text = `${it.title} ${it.file} ${(it.desc||"")} ${(it.tags||[]).join(" ")}`.toLowerCase();
      const okQ = !q || text.includes(q);
      const okTag = activeTag === "all" || (it.tags||[]).includes(activeTag);
      return okQ && okTag;
    })
    .sort((a,b)=>b.updatedAt-a.updatedAt);

  if (!items.length){
    grid.innerHTML = `<div class="card"><b>Tidak ada hasil.</b><div class="desc">Coba ganti keyword / tag.</div></div>`;
    return;
  }

  items.forEach(it => grid.appendChild(card(it)));
}

function renderTags(){
  const wrap = $("#tags");
  wrap.innerHTML = "";
  DB.tags.forEach(t => {
    const el = document.createElement("div");
    el.className = "tag" + (t === activeTag ? " active" : "");
    el.textContent = t;
    el.onclick = () => { activeTag = t; renderList(); renderTags(); navigate("/"); };
    wrap.appendChild(el);
  });
}

/* =======================
   ROUTER
   ======================= */

function getRoute(){
  const path = location.pathname.replace(/\/+$/,""); // hapus trailing /
  // / -> list
  if (!path || path === "") return { type:"home" };

  // /youtube/raw | /youtube/download | /youtube
  const parts = path.split("/").filter(Boolean);
  const slug = (parts[0] || "").toLowerCase();
  const action = (parts[1] || "").toLowerCase(); // raw/download/empty

  return { type:"plugin", slug, action };
}

function findBySlug(slug){
  return DB.items.find(it => it.slug === slug);
}

function navigate(path){
  history.pushState({}, "", path);
  route();
}

function route(){
  if (!DB) return;

  const r = getRoute();

  // kalau raw modal kebuka, tutup dulu
  closeModal();

  if (r.type === "home"){
    $("#q").value = "";
    q = "";
    renderList();
    return;
  }

  const item = findBySlug(r.slug);
  if (!item){
    toast("Plugin tidak ditemukan ❌");
    history.replaceState({}, "", "/");
    renderList();
    return;
  }

  if (r.action === "raw"){
    openRaw(item);
    return;
  }

  if (r.action === "download"){
    if (!item.hasRaw || !item.raw) return toast("Belum ada handler.code ❌");
    downloadJsFromRaw(item.file, item.raw);
    toast("Download .js ✅");
    return;
  }

  // default /youtube -> buka raw (atau bisa detail page)
  openRaw(item);
}

/* =======================
   EVENTS
   ======================= */

$("#closeModal").onclick = closeModal;
$("#modal").onclick = (e)=>{ if (e.target.id === "modal") closeModal(); };

$("#copyCode").onclick = async ()=>{
  try { await navigator.clipboard.writeText(RAW || ""); toast("Disalin ✅"); }
  catch { toast("Gagal ❌"); }
};

$("#q").addEventListener("input", (e)=>{
  q = e.target.value.trim().toLowerCase();
  renderList();
  history.replaceState({}, "", "/");
});

window.addEventListener("popstate", route);

async function init(){
  $("#year").textContent = new Date().getFullYear();

  const res = await fetch("./plugins.json", { cache: "no-store" });
  DB = await res.json();

  $("#countBox").textContent = `${DB.count} Codes`;
  renderTags();
  renderList();
  route(); // ✅ jalankan route saat load (kalau buka /youtube/raw)
}

init();