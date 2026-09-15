import axios from "axios";
import { API_URL } from "@/config/env";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AUTH_ENDPOINTS = ["/signin", "/signup", "/me"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      error.config?.url?.includes(endpoint),
    );

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !isAuthEndpoint
    ) {
      localStorage.removeItem("token");
      import("@/services/socket").then(({ default: socket }) =>
        socket.disconnect(),
      );
      import("@/app/hooks/auth/useAuthStore").then(({ useAuthStore }) =>
        useAuthStore.getState().signOut(),
      );
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default api;
