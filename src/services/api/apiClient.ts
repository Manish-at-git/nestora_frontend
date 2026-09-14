import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiErrorDetail } from "@/types/api";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL

export const API_BASE_URL = `${BACKEND_URL}/api`;

export const formatApiErrorDetail = (detail: ApiErrorDetail | any): string => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token if present in localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("nestora_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Automatically clear expired token on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const publicPaths = ["/", "/signin", "/verify", "/create-account"];
      const currentPath = window.location.pathname;
      const isPublicPath = publicPaths.includes(currentPath);

      if (localStorage.getItem("nestora_token")) {
        localStorage.removeItem("nestora_token");
        if (!isPublicPath) {
          window.location.href = "/signin";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

