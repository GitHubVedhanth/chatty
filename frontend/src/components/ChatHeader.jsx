import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { chattStore } from "../store/chatStore";

import avatar from "../assets/avatar1.jpg";
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chattStore();
  const {onlineusers} = useAuthStore()
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || avatar}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <p className="font-medium text-base">{selectedUser.fullname}</p>
            <p
              className={`text-sm ${
                onlineusers.includes(selectedUser._id)
                  ? "text-green-500"
                  : "text-zinc-400"
              }`}
            >
              {onlineusers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
