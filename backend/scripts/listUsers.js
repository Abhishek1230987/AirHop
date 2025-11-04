import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import User from "../models/User.js";

// load root .env.local if present, then backend .env
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

const redact = (uri) => {
  try {
    return uri.replace(/:\/\/(.*)@/, "//<REDACTED>@");
  } catch (e) {
    return "<redacted>";
  }
};

console.log("Connecting to:", redact(MONGO));

async function main() {
  await mongoose.connect(MONGO, { dbName: "airhop" });
  const users = await User.find({}).select("_id email name googleId").lean();
  console.log(`Found ${users.length} users:`);
  users.forEach((u) => console.log(u));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
