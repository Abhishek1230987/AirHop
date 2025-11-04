import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    console.log("[auth] signup attempt for", email);
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    console.log("[auth] created user", {
      id: user._id.toString(),
      email: user.email,
    });
    const token = signToken(user);
    // set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    console.log("[auth] login attempt for", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("[auth] user not found for", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.password) {
      console.log("[auth] user has no password (maybe OAuth-only) for", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log("[auth] password mismatch for", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken(user);
    console.log("[auth] login success for", email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Called by passport after successful Google auth (see passport config)
export const oauthCallback = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(500).json({ error: "Authentication failed" });
  const token = signToken(user);
  // set cookie and redirect to frontend success page
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  const redirectUrl =
    (process.env.FRONTEND_URL || "http://localhost:3000") + "/auth/success";
  return res.redirect(redirectUrl);
};

export const logout = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ ok: true });
};

export const me = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findById(userId).select("-password");
  res.json({ user });
};
