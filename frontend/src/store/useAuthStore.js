import { create } from "zustand";
import axiosInstance from "../lib/axiox";
import { toast } from "react-hot-toast";
import { disconnect } from "mongoose";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:8000";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingin: false,
  isUpdatingProfile: false,
  isSigningUp: false,
  onlineusers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error in use Auth Store checkAuth", error.response.data);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signUp", data);
      set({ authUser: res.data });
      toast.success("SIGNUP DONE ...");
      get().connectSocket();
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logOut");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async (data) => {
    set({ isLoggingin: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      return false;
    } finally {
      set({ isLoggingin: false });
    }
  },
  updateProfile: async (formData) => {
    try {
      set({ isUpdatingProfile: true });

      const res = await axiosInstance.post("/auth/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data.updateduser });
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || !authUser._id) {
      console.warn("⛔️ No valid userId. Not connecting socket.");
      return;
    }

    if (get().socket?.connected) {
      console.log("Socket already connected:", get().socket.id);
      return;
    }

    const socket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      query: {
        userId: authUser._id, 
      },
    });

    socket.on("connect", () => {
      console.log(" Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log(" Updated online users:", userIds);
      set({ onlineusers: userIds });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
