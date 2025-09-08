const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  mobile: { type: String },
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;