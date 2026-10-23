import mongoose from "mongoose";
import dns from "dns";

const dbConnect = async () => {
  if (mongoose.connections[0]?.readyState) return;

  // Set explicit DNS servers to resolve MongoDB SRV records (fixes Node.js/Windows DNS issues)
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  } catch (err) {
    console.warn("Failed to set custom DNS servers:", err);
  }

  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI;
  if (!uri) return;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.warn("dbConnect warning:", err.message);
  }
};

export default dbConnect;

