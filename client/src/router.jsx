import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";
import CreateExpertPage from "./pages/CreateExpertPage";
import ExpertDetailPage from "./pages/ExpertDetailPage";
import ExpertListingPage from "./pages/ExpertListingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ExpertListingPage />,
      },
      {
        path: "experts/:id",
        element: <ExpertDetailPage />,
      },
      {
        path: "booking/:expertId",
        element: <BookingPage />,
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "admin/create-expert",
        element: <CreateExpertPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
