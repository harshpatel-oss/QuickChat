import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    username: { type: String, trim: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    status: { type: String, default: "Available" },
    lastSeen: { type: Date, default: Date.now },
    refreshTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken" }],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "dark" },
      privacy: { type: String, enum: ["public", "private"], default: "private" },
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, username: 1 });

const User = mongoose.model("User", userSchema);
export default User;