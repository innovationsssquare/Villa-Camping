import mongoose from "mongoose";
import dns from "dns";

const dbConnect = async () => {
  if (mongoose.connections[0].readyState) return;

  // Set explicit DNS servers to resolve MongoDB SRV records (fixes Node.js/Windows DNS issues)
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  } catch (err) {
    console.warn("Failed to set custom DNS servers:", err);
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

export default dbConnect;

