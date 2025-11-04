import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateJWT = async (req, res, next) => {
  try {
    // Try to get token from multiple sources
    let token = null;

    // 1. Try Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Try httpOnly cookie (named 'token')
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. Try query parameter
    if (!token && req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      console.warn("🔴 No token found in request");
      return res.status(401).json({ error: "No token provided" });
    }

    console.log("🔐 Token found, verifying...");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      console.warn("🔴 User not found for token");
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: user._id, email: user.email, name: user.name };
    console.log("✅ Authenticated user:", req.user.email);
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res
      .status(401)
      .json({ error: "Unauthorized", details: err.message });
  }
};

export default authenticateJWT;
