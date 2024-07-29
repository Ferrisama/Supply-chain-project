const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Create a new order
router.post("/", auth, async (req, res) => {
  const { product_id, quantity, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *",
      [product_id, quantity, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
});

module.exports = router;
