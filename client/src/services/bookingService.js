import api from "./api";

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);
  return response.data.data;
};

export const getBookingsByEmail = async (email) => {
  const response = await api.get("/bookings", {
    params: { email },
  });
  return response.data.data.bookings;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data.data;
};
