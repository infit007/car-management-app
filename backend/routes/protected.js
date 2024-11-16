const express = require("express");
const authMiddleware = require("../middleware/authenticateToken"); // Middleware for JWT validation
const router = express.Router();

// Protected route that requires authentication (GET /protected-endpoint)
router.get("/protected-endpoint", authMiddleware, (req, res) => {
  try {
    res.json({
      message: "You are authorized to access this data!",
      user: req.user, // Decoded user info from the JWT token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
