* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: radial-gradient(circle at top, #111827, #020617);
  color: #e5e7eb;
}

.header {
  padding: 28px 20px;
  border-bottom: 1px solid #1f2933;
}

.logo {
  font-size: 28px;
  font-weight: 800;
}

.logo span {
  color: #38bdf8;
}

.subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.container {
  max-width: 960px;
  margin: auto;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  background: linear-gradient(180deg, #020617, #020617) padding-box,
              linear-gradient(145deg, #1f2937, #0f172a) border-box;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 16px;
}

.card h3 {
  margin: 0;
  font-size: 18px;
}

.file {
  font-family: "JetBrains Mono";
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tag {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #93c5fd;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  background: #0ea5e9;
  border: none;
  color: #020617;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

button.secondary {
  background: #020617;
  color: #93c5fd;
  border: 1px solid #1e293b;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: none;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #020617;
  border-radius: 16px;
  max-width: 800px;
  width: 95%;
  padding: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

pre {
  background: #020617;
  border: 1px solid #1e293b;
  padding: 14px;
  border-radius: 12px;
  max-height: 60vh;
  overflow: auto;
  font-family: "JetBrains Mono";
  font-size: 13px;
}

.copy-btn {
  margin-top: 10px;
  width: 100%;
}