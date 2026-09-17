import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:8086";
const testUserId = "6833656360ed0e90157dd2e1";
const testPropertyId = "68f0d273d9c987a9a78b3a81";

async function runSocketTest() {
  console.log("==================================================");
  console.log("⚡ TESTING LIVE SOCKET.IO WISHLIST SYNCHRONIZATION");
  console.log("==================================================");

  const socket = io(BACKEND_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Socket connection timed out")), 5000);
    socket.on("connect", () => {
      clearTimeout(timeout);
      console.log(`✅ Connected to Socket.IO backend with socket id: ${socket.id}`);
      resolve();
    });
  });

  // Join user room
  socket.emit("join-user-room", testUserId);
  console.log(`📡 Emitted join-user-room for user: ${testUserId}`);

  // Wait a bit for room join
  await new Promise((r) => setTimeout(r, 600));

  // Set up event listener for wishlist:update
  let receivedEvent = null;
  const eventPromise = new Promise((resolve) => {
    socket.on("wishlist:update", (data) => {
      console.log("🔔 Received 'wishlist:update' socket event:", JSON.stringify(data));
      receivedEvent = data;
      resolve(data);
    });
  });

  // Trigger toggle via HTTP
  console.log("🔄 Triggering wishlist toggle via API...");
  const res = await fetch(`${BACKEND_URL}/api/v1/Wishlist/wishlist/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      propertyId: testPropertyId,
      propertyType: "villa",
      userId: testUserId,
    }),
  });
  const resJson = await res.json();
  console.log("API response:", resJson);

  // Wait for socket event with 5s timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout waiting for wishlist:update socket event")), 5000)
  );

  try {
    await Promise.race([eventPromise, timeoutPromise]);
    console.log("✅ [PASS] Real-time socket event received successfully!");
    console.log(`Payload validated: propertyId=${receivedEvent.propertyId}, wished=${receivedEvent.wished}`);

    // Cleanup: toggle back if needed
    if (resJson.wished) {
      await fetch(`${BACKEND_URL}/api/v1/Wishlist/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: testPropertyId,
          propertyType: "villa",
          userId: testUserId,
        }),
      });
      console.log("🧹 Cleaned up state (toggled back).");
    }

    socket.disconnect();
    console.log("\n==================================================");
    console.log("ALL REAL-TIME SOCKET TESTS PASSED! 🎉");
    console.log("==================================================");
    setTimeout(() => process.exit(0), 100);
  } catch (err) {
    console.error("❌ [FAIL] Socket test error:", err.message);
    socket.disconnect();
    process.exit(1);
  }
}

runSocketTest();
