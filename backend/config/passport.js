import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          let user = await User.findOne({ $or: [{ googleId }, { email }] });
          if (!user) {
            user = await User.create({
              googleId,
              email,
              name: profile.displayName,
            });
          } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

export default passport;
