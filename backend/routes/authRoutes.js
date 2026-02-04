const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");

const {
  registerUser,
  loginUser,
  logoutUser
} = require("../controllers/authController");

/* ================= AUTH ROUTES ================= */

// Register mess owner
router.post("/register", registerUser);

// Login mess owner
router.post("/login", loginUser);

router.get("/me", protect, getMe);

// Logout mess owner
router.post("/logout", logoutUser);

module.exports = router;
