import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf_token="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

// Track refresh token calls to prevent multiple simultaneous calls
let isRefreshing = false;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds

let failedQueue: Array<{
  resolve: (value?: AxiosResponse | void) => void;
  reject: (error?: AxiosError | unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  _token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    // Don't retry refresh endpoint or if already retried
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Don't try to refresh if we're already on login/signup pages
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/signup"
      ) {
        return Promise.reject(error);
      }

      // Check cooldown period
      const now = Date.now();
      if (now - lastRefreshAttempt < REFRESH_COOLDOWN) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      lastRefreshAttempt = now;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        // Redirect to login if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  signup: (email: string, password: string) =>
    api.post("/auth/signup", { email, password }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

export const todoAPI = {
  getAll: () => api.get("/todos"),
  getStats: () => api.get("/todos/stats"),
  create: (data: {
    title: string;
    description?: string;
    color?: string;
    category?: string;
  }) => api.post("/todos", data),
  update: (
    id: number,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
      color?: string;
      category?: string;
    }
  ) => api.patch(`/todos/${id}`, data),
  delete: (id: number) => api.delete(`/todos/${id}`),
};