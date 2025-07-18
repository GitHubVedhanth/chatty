import React, { useEffect } from "react";
import { chattStore } from "../store/chatStore";
import SidebarSkeleton from "./skeleton/Sidebar.Skeleton";
import { Users as UsersIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function SideBar() {
  const { users, selectedUser, setSelectedUser, getUsers, isuserLoading } =
    chattStore();

  const onlineUsers = useAuthStore(state => state.onlineusers || []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isuserLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {user.fullname}
                  <span
                    className={`
                            absolute bottom-0 right-0 
                            w-4 h-4 rounded-full 
                            ring-2 ring-white
                            ${onlineUsers.includes(user._id) ? "bg-green-500" : "bg-black opacity-50"}
                          `}
                  />
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
}

export default SideBar;
