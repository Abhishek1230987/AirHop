import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import { mockConnection } from "./in-memory-db.js";
import aqiRoutes from "./Routes/aqiRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";

// Load environment from project root `.env.local` first (if present) so
// devs can store secrets there, then load backend/.env to allow overrides.
try {
  const rootEnv = path.resolve(process.cwd(), "..", ".env.local");
  dotenv.config({ path: rootEnv });
} catch (e) {
  // ignore
}
// load backend/.env
dotenv.config();
const app = express();
// Configure CORS: allow the frontend origin, and during development allow localhost:3000/3001
const FRONTEND_URL = process.env.FRONTEND_URL;
const devAllowed = ["http://localhost:3000", "http://localhost:3001"];
const allowedOrigins = [];
if (FRONTEND_URL) allowedOrigins.push(FRONTEND_URL);
if (process.env.NODE_ENV !== "production") allowedOrigins.push(...devAllowed);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like curl or server-to-server
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for origin: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect to MongoDB
// Accept multiple env var names to be tolerant of differing .env names
// Connect to MongoDB
// Prefer the root/explicit `MongoDB_URI` (often set in .env.local) then fall back to other names
const MONGO_ENV_ORDER = ["MongoDB_URI", "MONGODB_URI", "MONGO_URI"];
let MONGO = null;
let usedEnv = null;
for (const name of MONGO_ENV_ORDER) {
  if (process.env[name]) {
    MONGO = process.env[name];
    usedEnv = name;
    break;
  }
}
if (!MONGO) MONGO = "mongodb://localhost:27017/airhop";

// Log which env var is being used (redact the credential portion)
const redact = (uri) => {
  try {
    // attempt to hide user:pass by removing between :// and @
    // preserve the '://' so logs remain valid-looking
    return uri.replace(/:\/\/(.*)@/, "://<REDACTED>@");
  } catch (e) {
    return "<redacted>";
  }
};
console.log(
  `🔌 Connecting to MongoDB using env: ${usedEnv || "default localhost"}`
);
console.log(`🔍 Mongo URI (redacted): ${redact(MONGO)}`);
// Debug: report which process.env keys exist for Mongo
const debugExists = (n) => ({ name: n, present: !!process.env[n] });
console.log("🔎 Mongo env presence:", MONGO_ENV_ORDER.map(debugExists));
console.log("🔎 process.env.MongoDB_URI present:", !!process.env.MongoDB_URI);

// Set Node.js to accept legacy OpenSSL providers (helps with TLS issues)
process.env.NODE_OPTIONS = "--openssl-legacy-provider";

let mongoConnected = false;
let useMemoryDB = false;

// Determine connection options based on URI type
const isLocalMongo = MONGO.includes("localhost");
const connectionOptions = isLocalMongo
  ? {
      dbName: "airhop",
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
  : {
      dbName: "airhop",
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: false,
      authSource: "admin",
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      family: 4,
    };

const connectMongo = () => {
  mongoose
    .connect(MONGO, connectionOptions)
    .then(() => {
      mongoConnected = true;
      useMemoryDB = false;
      console.log("✅ Connected to MongoDB (Real)");
    })
    .catch((err) => {
      mongoConnected = false;
      console.error("❌ MongoDB connection error:", err.message);
      console.log("\n💾 Falling back to In-Memory Database (Development Mode)");
      useMemoryDB = true;

      // Initialize mock connection
      mockConnection.connect().then(() => {
        console.log("✅ In-Memory Database ready for development!");
        console.log("⚠️  Note: Data will be lost when server restarts");
        console.log(
          "📌 For production, install MongoDB or use MongoDB Atlas\n"
        );
      });
    });
};

connectMongo();

export const getMongoStatus = () => mongoConnected;
export const isUsingMemoryDB = () => useMemoryDB;

// API routes
app.use("/api/aqi", aqiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Test OpenWeather connection
  const testCity = "Delhi";
  try {
    const test = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${testCity}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    if (test.ok) {
      console.log("🌤️ Connected to OpenWeather API successfully!");
    } else {
      console.log("⚠️ OpenWeather API connection failed (check your API key).");
    }
  } catch (err) {
    console.log("❌ Failed to connect to OpenWeather API:", err.message);
  }
});
