const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");

const { protect } = require("../middleware/authMiddleware");
const {
  getMesses,
  createMess,
  deleteMess
} = require("../controllers/messController");

router.get("/", getMesses);

router.post(
  "/",
  protect,
  upload.single("image"),
  createMess
);

router.delete("/:id", protect, deleteMess);

module.exports = router;
