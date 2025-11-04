import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// load env from repo root then backend
try {
  const rootEnv = path.resolve(process.cwd(), "..", ".env.local");
  dotenv.config({ path: rootEnv });
} catch (e) {}
dotenv.config();

const MONGO =
  process.env.MongoDB_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/airhop";
const DB_NAME = process.env.DB_NAME || "airhop";

const redact = (uri) => {
  try {
    return uri.replace(/:\/\/(.*)@/, "//<REDACTED>@");
  } catch (e) {
    return "<redacted>";
  }
};

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node createUser.js <email> <password> [name]");
    process.exit(1);
  }
  const [email, password, name = "Test User"] = args;

  console.log("Connecting to:", redact(MONGO));
  await mongoose.connect(MONGO, { dbName: DB_NAME });

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("User already exists:", {
      id: existing._id.toString(),
      email: existing.email,
    });
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  console.log("Created user:", { id: user._id.toString(), email: user.email });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
