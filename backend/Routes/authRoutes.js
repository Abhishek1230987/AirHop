import express from "express";
import passport from "../config/passport.js";
import {
  signup,
  login,
  oauthCallback,
  me,
  logout,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local auth
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  oauthCallback
);

router.get("/me", authenticateJWT, me);
router.post("/logout", logout);

export default router;
