import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  ísAdmin: false,
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (confirmPassword !== password) {
      set({ loading: false });
      return toast.error("Password do not match");
    }
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({
        user: res.data,
        loading: false,
        isAdmin: res.data.user.role === "admin",
      });
      toast.success("Register Account successfull");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      set({
        user: res.data,
        loading: false,
        isAdmin: res.data.user.role === "admin",
      });
      toast.success("Login successfull");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ user: res.data.user, isAdmin: res.data.user.role === "admin", isCheckingAuth: false });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
      toast.error(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, isAdmin: false });
      toast.success("Logout sucessfull");
    } catch (error) {
      console.log(error.message)
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().isCheckingAuth) return;

    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh-token");
      set({ isCheckingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      throw error;
    }
  },
}));


// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useAuthStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

