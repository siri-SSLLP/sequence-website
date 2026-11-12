import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ NEW

dotenv.config();
connectDB().catch(() => {}); // requests retry below if this first attempt fails

import mongoose from "mongoose";

mongoose.connection.once("open", async () => {
  try {
    await mongoose.connection.db
      .collection("orders")
      .dropIndex("orderNumber_1");

    console.log("✅ orderNumber index removed");
  } catch (err) {
    console.log("⚠️ Index may not exist:", err.message);
  }
});

const app = express(); // ✅ CREATE APP FIRST

// ✅ CORS AFTER APP
app.use(cors({
  origin: [
    "http://localhost:5175", "http://localhost:5173","http://localhost:5174",
    "https://sequence-site-new-616y.vercel.app","https://sequence-website-qvc99.vercel.app",
     "https://sequence-website-gray.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ HOME — this is an API with no website, so answer instead of "Cannot GET /"
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Sequence Surfaces API is running" });
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// ✅ DATABASE — reconnect if needed, and reply clearly instead of crashing
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({ message: "Database unavailable, please try again shortly" });
  }
});

// ✅ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes); // ✅ NEW — Razorpay

app.listen(5002, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5002");
});
 