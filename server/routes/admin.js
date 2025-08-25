const express = require("express");
const pool = require("../database");
const bcrypt = require("bcryptjs"); 
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// =======================
// 1. Admin Dashboard API
// =======================
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users");
      const totalStoresResult = await pool.query("SELECT COUNT(*) FROM stores");
      const totalRatingsResult = await pool.query("SELECT COUNT(*) FROM ratings");

      const totalUsers = totalUsersResult.rows[0].count;
      const totalStores = totalStoresResult.rows[0].count;
      const totalRatings = totalRatingsResult.rows[0].count;

      res.json({
        success: true,
        data: { totalUsers, totalStores, totalRatings },
      });
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// =======================
// 2. Add Store Owner
// =======================
router.post(
  "/add-store-owner",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { name, email, password, address } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1, $2, $3, $4, 'store_owner') RETURNING id, name, email, role`,
        [name, email, hashedPassword, address]
      );

      res.json({
        success: true,
        message: "Store owner created successfully",
        owner: result.rows[0],
      });
    } catch (err) {
      console.error("Error creating store owner:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// ======================================
// 3. Get All Store Owners (for dropdown)
// ======================================
router.get(
  "/owners",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, name, email FROM users WHERE role = 'store_owner'"
      );
      res.json({
        success: true,
        owners: result.rows,
      });
    } catch (err) {
      console.error("Error fetching store owners:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// =======================
// 4. Add Store
// =======================
router.post(
  "/add-store",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { name, email, address, owner_id } = req.body;

      const result = await pool.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, address, owner_id]
      );

      res.json({
        success: true,
        message: "Store added successfully",
        store: result.rows[0],
      });
    } catch (err) {
      console.error("Error adding store:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// ==============================
// 5. Get All Stores with Ratings
// ==============================
router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const query = `
        SELECT 
        s.id AS store_id,
        s.name,
        s.email,
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

      res.json({
        success: true,
        stores: result.rows,
      });

    } catch (err) {
      console.error("Error fetching stores:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);




// Get all users with filters (including avg_rating for store owners)
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
        CASE 
          WHEN u.role = 'store_owner' THEN COALESCE(ROUND(AVG(r.rating),1), 0)
          ELSE NULL
        END as avg_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (name) {
      query += ` AND u.name ILIKE $${paramIndex++}`;
      params.push(`%${name}%`);
    }
    if (email) {
      query += ` AND u.email ILIKE $${paramIndex++}`;
      params.push(`%${email}%`);
    }
    if (address) {
      query += ` AND u.address ILIKE $${paramIndex++}`;
      params.push(`%${address}%`);
    }
    if (role) {
      query += ` AND u.role = $${paramIndex++}`;
      params.push(role);
    }

    query += ` GROUP BY u.id, u.name, u.email, u.address, u.role`;

    const result = await pool.query(query, params);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});



// Create new user
router.post("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, address, role]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;
