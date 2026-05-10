import axios from "axios";

const normalizedBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.userMessage = "The request timed out. Please try again.";
      return Promise.reject(error);
    }

    if (!error.response) {
      error.userMessage = "Unable to reach the server. Check that the backend is running and try again.";
      return Promise.reject(error);
    }

    error.userMessage = error.response.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(error);
  }
);

export default api;
