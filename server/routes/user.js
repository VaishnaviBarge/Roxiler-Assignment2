const express = require("express");
const pool = require("../database");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stores", authMiddleware, roleMiddleware("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        s.id AS store_id,
        s.name,
        s.address,
        COALESCE(ROUND(AVG(r.rating),1), 0) AS overall_rating,
        ur.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
      GROUP BY s.id, ur.rating
      ORDER BY s.name;
    `;

    const result = await pool.query(query, [userId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching stores:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Submit or update rating
 */
router.post("/rate", authMiddleware, roleMiddleware("user"), async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const query = `
    INSERT INTO ratings (store_id, user_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (store_id, user_id)
    DO UPDATE SET rating = EXCLUDED.rating
    RETURNING *;
    `;


    const result = await pool.query(query, [storeId, userId, rating]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error submitting rating:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
