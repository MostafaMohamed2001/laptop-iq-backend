const express = require("express");
const cors = require("cors");
const { getDb, initDb } = require("./database");
const { recommend } = require("./recommender");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Seed DB on startup
initDb();

// Helper: parse usage_tags JSON and return plain object
function rowToObj(row) {
  return { ...row, usage_tags: JSON.parse(row.usage_tags) };
}

// GET /laptops — list all with optional filters
app.get("/laptops", (req, res) => {
  const { brand, min_price, max_price, min_ram, usage } = req.query;

  let query = "SELECT * FROM laptops WHERE 1=1";
  const params = [];

  if (brand) {
    query += " AND brand = ?";
    params.push(brand);
  }
  if (min_price !== undefined) {
    query += " AND price >= ?";
    params.push(Number(min_price));
  }
  if (max_price !== undefined) {
    query += " AND price <= ?";
    params.push(Number(max_price));
  }
  if (min_ram !== undefined) {
    query += " AND ram >= ?";
    params.push(Number(min_ram));
  }
  if (usage) {
    query += ` AND usage_tags LIKE ?`;
    params.push(`%"${usage}"%`);
  }

  const db = getDb();
  const rows = db.prepare(query).all(...params);
  db.close();

  res.json(rows.map(rowToObj));
});

// GET /laptops/:id — single laptop detail
app.get("/laptops/:id", (req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM laptops WHERE id = ?").get(req.params.id);
  db.close();

  if (!row) return res.status(404).json({ detail: "Laptop not found" });
  res.json(rowToObj(row));
});

// POST /recommend — returns top 5 ranked laptops
app.post("/recommend", (req, res) => {
  const answers = {
    usage:          req.body.usage          || "general",
    budget:         req.body.budget         || "40k_60k",
    priority:       req.body.priority       || "balanced",
    screen_size:    req.body.screen_size    ?? 15.6,
    gpu_preference: req.body.gpu_preference || "no_preference",
    cpu_brand:      req.body.cpu_brand      || "no_preference",
    battery:        req.body.battery        || "medium",
    weight:         req.body.weight         || "normal",
    features:       req.body.features       || [],
  };

  const db = getDb();
  const rows = db.prepare("SELECT * FROM laptops").all();
  db.close();

  res.json(recommend(rows, answers));
});

app.listen(PORT, () => {
  console.log(`Laptop Selector API running at http://localhost:${PORT}`);
});
