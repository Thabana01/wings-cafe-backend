const express = require("express");
const router = express.Router();
const fs = require("fs");
const DB_FILE = "db.json";

function readDB() {
  const data = fs.existsSync(DB_FILE) ? fs.readFileSync(DB_FILE, "utf-8") : '{"products":[],"customers":[],"sales":[]}';
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET all sales
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.sales || []);
});

// ADD sale
router.post("/", (req, res) => {
  const db = readDB();
  const newSale = { id: Date.now(), ...req.body };
  db.sales = db.sales || [];
  db.sales.push(newSale);

  // Reduce stock for sold product
  db.products = db.products.map(p => {
    if (p.id === newSale.productId) p.quantity -= newSale.quantity;
    return p;
  });

  writeDB(db);
  res.status(201).json(newSale);
});

module.exports = router;
