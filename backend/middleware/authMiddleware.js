const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Read token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2️⃣ If no token → not authorized
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    // 5️⃣ Move to next middleware / controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
