import { optimisticToggle } from "./wishlistSlice";
import { getSocket } from "@/lib/socket";

export const initWishlistSocket = (dispatch) => {
  const socket = getSocket();

  socket.on("connect", () => {
    console.log("🟢 Wishlist socket connected");
  });

  socket.on("wishlist:update", (payload) => {
    dispatch(optimisticToggle(payload));
  });

  socket.on("disconnect", () => {
    console.log("🔴 Wishlist socket disconnected");
  });
};
