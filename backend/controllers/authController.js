const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* ================== JWT GENERATOR ================== */
const generateToken = (id) => {
  console.log("🔑 Generating JWT for user id:", id);
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================== REGISTER ================== */
exports.registerUser = async (req, res) => {
  try {
    console.log("📩 REGISTER REQUEST BODY:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("⚠️ Missing fields:", { name, email, password });
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("🔍 Checking if user exists:", email);
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🛠️ Creating user...");
    const user = await User.create({
      name,
      email,
      password
    });

    console.log("✅ User created:", user._id);

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    console.log("🍪 JWT cookie set");

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error("❌ Register error STACK:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* ================== LOGIN ================== */
exports.loginUser = async (req, res) => {
  try {
    console.log("📩 LOGIN REQUEST BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("⚠️ Missing login fields:", { email, password });
      return res.status(400).json({ message: "Email and password required" });
    }

    console.log("🔍 Finding user:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      console.warn("❌ Wrong password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,

      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("🍪 JWT cookie set (login)");

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error("❌ Login error STACK:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/* ================== GET ME ================== */
exports.getMe = async (req, res) => {
  console.log("👤 GET ME called for user:", req.user?._id);

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
};

/* ================== LOGOUT ================== */
exports.logoutUser = (req, res) => {
  console.log("🚪 Logging out user");
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
