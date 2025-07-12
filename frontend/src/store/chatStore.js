import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axiox";
import { useAuthStore } from "./useAuthStore";

export const chattStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isuserLoading: false,
  ismessageloading: false,

  getUsers: async () => {
    set({ isuserLoading: true });
    try {
      const users = await axiosInstance.get("/message/users");
      set({ users: users.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isuserLoading: false });
    }
  },

  getmessages: async (userId) => {
    if (!userId) {
    console.warn("⛔️ getmessages called with empty userId");
    return;
      }
    set({ ismessageloading: true });
    try {
      const messages_res = await axiosInstance.get(`/message/user/${userId}`);
      set({ messages: messages_res.data.messages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ ismessageloading: false });
    }
  },

  sendmessage: async ({ text, imageFile, receiverId }) => {
    if (!receiverId) {
    console.warn("⛔️ sendmessage called with empty receiverId");
    return;
  }
    try {
      const { messages } = get();

      const formData = new FormData();
      formData.append("text", text);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axiosInstance.post(
        `/message/send/${receiverId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      set({ messages: [...(messages || []), res.data] });
    } catch (error) {
      console.log("Send message error:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

 SubscribeTo: () => {
  const { selectedUser } = get();
  const socket = useAuthStore.getState().socket;

  if (!selectedUser || !socket) return;

  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const { selectedUser } = get();
    
    if (
      newMessage.senderId === selectedUser._id ||
      newMessage.receiverId === selectedUser._id
    ) {
      set({
        messages: [...get().messages, newMessage],
      });
    } 
  });
},

  Unsubscribe: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;
  socket.off("newMessage");
},


  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
