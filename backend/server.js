require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messRoutes = require("./routes/messRoutes");

const app = express();
const server = http.createServer(app);

/* ===============================
   DATABASE
================================ */
connectDB();

/* ===============================
   CORS (PRODUCTION SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://mess-menu-app-three.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow Postman, Render health checks, server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: do NOT throw error
    return callback(null, false);
  },
  credentials: true,
};

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

/* ===============================
   SOCKET.IO
================================ */
const io = new Server(server, {
  cors: corsOptions,
  transports: ["polling", "websocket"], // Render-safe
});

/* make socket available in routes */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/messes", messRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("🚀 MessMenu Backend Running");
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
