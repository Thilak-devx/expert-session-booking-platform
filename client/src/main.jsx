import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import { BookingProvider } from "./context/BookingContext";
import { router } from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BookingProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "16px",
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4500,
          },
        }}
      />
    </BookingProvider>
  </React.StrictMode>
);
