import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    googleId: { type: String, index: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
