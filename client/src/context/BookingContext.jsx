import { createContext, useContext, useEffect, useState } from "react";

const BookingContext = createContext(null);

function readStoredEmail() {
  return window.localStorage.getItem("bookingEmail") || "";
}

export function BookingProvider({ children }) {
  const [bookingEmail, setBookingEmail] = useState(readStoredEmail);

  useEffect(() => {
    if (bookingEmail) {
      window.localStorage.setItem("bookingEmail", bookingEmail);
      return;
    }

    window.localStorage.removeItem("bookingEmail");
  }, [bookingEmail]);

  return (
    <BookingContext.Provider value={{ bookingEmail, setBookingEmail }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }

  return context;
}
