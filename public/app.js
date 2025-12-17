fetch("plugins.json")
  .then(r=>r.json())
  .then(db=>{
    const list = document.getElementById("list");
    db.items.forEach(it=>{
      const div = document.createElement("div");
      div.className="card";
      div.innerHTML = `
        <b>${it.title}</b><br>
        <small>${it.file}</small><br><br>
        <a href="plugins/${it.file}" download>
          <button>Download .js</button>
        </a>
      `;
      list.appendChild(div);
    });
  });