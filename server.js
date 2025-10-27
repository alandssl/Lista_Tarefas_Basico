const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(express.static(__dirname));

function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { tasks: [] };
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.get('/api/tasks', (req, res) => {
  const db = readDb();
  res.json(db.tasks);
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });
  const db = readDb();
  const task = { id: Date.now().toString(), text: text.trim() };
  db.tasks.push(task);
  writeDb(db);
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const db = readDb();
  const idx = db.tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  db.tasks.splice(idx, 1);
  writeDb(db);
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
