import axios from "axios";
import { API_URL, INTERNAL_API_KEY } from "@/config/env";
import { routing } from "@/i18n/routing";
import { ROUTES } from "@/routes/routes";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    if (INTERNAL_API_KEY) config.headers["x-internal-key"] = INTERNAL_API_KEY;
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AUTH_ENDPOINTS = ["/signin", "/signup", "/me"];

const getCurrentLocale = () => {
  const firstSegment = window.location.pathname.split("/")[1];
  const isKnownLocale = routing.locales.some(
    (locale) => locale === firstSegment,
  );
  return isKnownLocale ? firstSegment : routing.defaultLocale;
};

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
      window.location.href = `/${getCurrentLocale()}${ROUTES.signin}`;
    }

    return Promise.reject(error);
  },
);

export default api;
