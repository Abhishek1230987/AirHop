import dotenv from "dotenv";
import path from "path";
import axios from "axios";

// load env
try {
  const rootEnv = path.resolve(process.cwd(), "..", ".env.local");
  dotenv.config({ path: rootEnv });
} catch (e) {}
dotenv.config();

const base = `http://localhost:${process.env.PORT || 5000}`;

async function run() {
  try {
    console.log("Testing login with nonexistent user...");
    await axios.post(`${base}/api/auth/login`, {
      email: "noone@example.com",
      password: "wrong",
    });
  } catch (err) {
    if (err.response) {
      console.log("Login response status:", err.response.status);
      console.log("Login response data:", err.response.data);
    } else {
      console.error("Login request failed:", err.message);
    }
  }

  try {
    console.log("Creating new user via signup...");
    const res = await axios.post(`${base}/api/auth/signup`, {
      email: "testuser1@example.com",
      password: "TestPass123",
      name: "Test User",
    });
    console.log("Signup status:", res.status);
    console.log("Signup data:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Signup response status:", err.response.status);
      console.log("Signup response data:", err.response.data);
    } else {
      console.error("Signup request failed:", err.message);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
