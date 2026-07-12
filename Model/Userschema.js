import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },
  fullName: { type: String },
  mobile: { type: String, unique: true, sparse: true },
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;