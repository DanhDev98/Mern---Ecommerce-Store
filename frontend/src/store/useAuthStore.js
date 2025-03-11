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
      set({ user: res.data, isAdmin: res.data.user.role === "admin" });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, isAdmin: false });
      toast.success("Logout sucessfull");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
