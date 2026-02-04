const Mess = require("../models/Mess");
const { cloudinary } = require("../config/cloudinary");
const { generateMenuAI } = require("../utils/ai");

/* ================= GET MESSES ================= */
exports.getMesses = async (req, res) => {
  try {
    const messes = await Mess.find({
      expiresAt: { $gt: Date.now() }
    }).sort({ uploadTime: -1 });

    res.json(messes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messes" });
  }
};

/* ================= CREATE MESS (WITH AI) ================= */
exports.createMess = async (req, res) => {
  try {
    const currentTime = Date.now();               // 🔴 FIX
    const expiresAt = currentTime + 5 * 60 * 60 * 1000;

    let aiSummary = "";
    let aiTags = [];

    try {
      const aiResult = await generateMenuAI(req.body.menuText);
      aiSummary = aiResult.summary || "";
      aiTags = aiResult.tags || [];
    } catch (err) {
      console.warn("⚠️ Gemini AI failed, continuing without it");
    }

    const mess = await Mess.create({
      owner: req.user._id,                        // 🔴 REQUIRED
      ...req.body,
      aiSummary,
      aiTags,
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : null,
      uploadTime: currentTime,
      expiresAt
    });

    req.io.emit("newMenuAdded", mess);
    res.status(201).json(mess);

  } catch (error) {
    console.error("❌ Create mess failed:", error);
    res.status(500).json({ message: "Failed to create mess" });
  }
};

/* ================= DELETE MESS ================= */
exports.deleteMess = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (mess.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this menu" });
    }

    if (mess.image?.publicId) {
      await cloudinary.uploader.destroy(mess.image.publicId);
    }

    await mess.deleteOne();
    req.io.emit("menuDeleted", { id: mess._id });

    res.json({ message: "Menu deleted" });

  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
