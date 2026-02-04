const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  location: { type: String, required: true },
  aiSummary: String,
  aiTags: [String],
  phone: { type: String, required: true },
  menuType: { type: String, enum: ["veg", "non-veg", "budget"], default: null },
  menuText: { type: String, required: true },
  price: String,
  image: {
    url: String,
    publicId: String
  },
  date: String,
  uploadTime: Number,
  expiresAt: Number
}, { timestamps: true });

module.exports = mongoose.model("Mess", messSchema);
