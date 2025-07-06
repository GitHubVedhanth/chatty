const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          {/* Header */}
          <div className="chat-header mb-1">
            <div className="skeleton h-3 w-20" />
          </div>

          {/* Bubble */}
          <div className="chat-bubble p-0 bg-transparent shadow-none">
            <div className="skeleton h-16 w-[200px]">
              &nbsp;
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton
