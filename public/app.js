let RAW = "";

fetch("plugins.json")
  .then(r => r.json())
  .then(db => {
    const list = document.getElementById("list");

    db.items.forEach(it => {
      const card = document.createElement("div");
      card.className = "card";

      const tags = (it.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

      card.innerHTML = `
        <h3>${it.title}</h3>
        <div class="file">${it.file}</div>
        <div class="tags">${tags}</div>
        <div class="actions">
          <button onclick="download('${it.file}')">Download</button>
          <button class="secondary" onclick="openRaw('${it.file}','${it.title}')">Raw</button>
        </div>
      `;
      list.appendChild(card);
    });
  });

function stripMeta(code) {
  return code.replace(
    /^\s*handler\.(alias|category|tags|desc|command|help)[\s\S]*?;$/gm,
    ""
  ).trim();
}

function download(file) {
  fetch(`plugins/${file}`)
    .then(r => r.text())
    .then(code => {
      code = stripMeta(code);
      const blob = new Blob([code], { type: "text/javascript" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file;
      a.click();
    });
}

function openRaw(file, title) {
  fetch(`plugins/${file}`)
    .then(r => r.text())
    .then(code => {
      RAW = code;
      document.getElementById("rawCode").textContent = code;
      document.getElementById("modalTitle").textContent = title;
      document.getElementById("modal").style.display = "flex";
    });
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function copyCode() {
  navigator.clipboard.writeText(RAW);
}