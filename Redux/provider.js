'use client';
import { Provider } from "react-redux";
import { store } from "./Store";
import { useEffect } from "react";
import { hydrateBooking } from "./Slices/bookingSlice";

const BOOKING_SESSION_KEY = "thevilla_booking_state";

function BookingPersist() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          store.dispatch(hydrateBooking(parsed));
        }
      }
    } catch {
      // Ignore invalid persisted booking state
    }

    const unsubscribe = store.subscribe(() => {
      try {
        sessionStorage.setItem(
          BOOKING_SESSION_KEY,
          JSON.stringify(store.getState().booking)
        );
      } catch {
        // Quota or private-mode failures should not break checkout
      }
    });

    return unsubscribe;
  }, []);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <BookingPersist />
      {children}
    </Provider>
  );
}
