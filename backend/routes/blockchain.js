const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto");

function calculateHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM blockchain ORDER BY timestamp"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blockchain data:", err);
    res
      .status(500)
      .json({ message: "Error fetching blockchain data", error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { data } = req.body;
  try {
    const latestBlock = await db.query(
      "SELECT * FROM blockchain ORDER BY timestamp DESC LIMIT 1"
    );
    const previous_hash =
      latestBlock.rows.length > 0
        ? latestBlock.rows[0].hash
        : "0000000000000000000000000000000000000000000000000000000000000000";
    const timestamp = new Date().toISOString();
    const hash = calculateHash({ previous_hash, timestamp, data });

    const result = await db.query(
      "INSERT INTO blockchain (previous_hash, data, hash, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
      [previous_hash, JSON.stringify(data), hash, timestamp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding blockchain entry:", err);
    res
      .status(500)
      .json({ message: "Error adding blockchain entry", error: err.message });
  }
});

module.exports = router;
