const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, "../data/db.json");

function lerDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf8");
  try { return JSON.parse(raw); } catch { return []; }
}

function salvarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

module.exports = { lerDB, salvarDB };