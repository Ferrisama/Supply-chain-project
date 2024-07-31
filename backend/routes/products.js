const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// Get all products (accessible to all authenticated users)
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add a new product (accessible only to admin and manager roles)
router.post("/", auth, roleAuth(["admin", "manager"]), async (req, res) => {
  const { name, description, sku } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, description, sku) VALUES ($1, $2, $3) RETURNING *",
      [name, description, sku]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding product" });
  }
});

module.exports = router;
