import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../lib/axiox";
import { chattStore } from "../store/chatStore";
import NoChatSelected from "../components/NoChatSelected";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";

function HomePage() {
  const AuthUser = useAuthStore();
  const [users, setusers] = useState();
  const { selectedUser } = chattStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">

            <SideBar/>
            {!selectedUser?<NoChatSelected/>:<ChatContainer/>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
