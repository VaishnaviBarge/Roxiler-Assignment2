// routes/storeOwner.js
const express = require("express");
const pool = require("../database");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all stores for the logged-in owner with ratings and users who rated
router.get(
  "/my-stores",
  authMiddleware,
  roleMiddleware("store_owner"),
  async (req, res) => {
    try {
      const ownerId = req.user.id;

      // Fetch all stores of the owner
      const storesQuery = `
        SELECT 
          s.id AS store_id,
          s.name,
          s.address,
          COALESCE(ROUND(AVG(r.rating),1), 0) AS average_rating,
          COUNT(r.id) AS review_count
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = $1
        GROUP BY s.id
        ORDER BY s.name;
      `;
      const storesResult = await pool.query(storesQuery, [ownerId]);
      const stores = storesResult.rows;

      // For each store, fetch the users who rated it
      const storesWithRatings = await Promise.all(
        stores.map(async (store) => {
          const ratingsQuery = `
            SELECT u.name AS user_name, r.rating
            FROM ratings r
            JOIN users u ON u.id = r.user_id
            WHERE r.store_id = $1
          `;
          const ratingsResult = await pool.query(ratingsQuery, [store.store_id]);
          return {
            ...store,
            ratings: ratingsResult.rows,
          };
        })
      );

      res.json({ success: true, data: storesWithRatings });
    } catch (err) {
      console.error("Error fetching stores for owner:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = router;
