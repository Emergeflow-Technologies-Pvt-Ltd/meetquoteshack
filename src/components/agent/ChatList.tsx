"use client"

interface Conversation {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface ChatListProps {
  conversations: Conversation[]
  selectedUserId: string | null
  onSelectConversation: (userId: string) => void
}

export default function ChatList({
  conversations,
  selectedUserId,
  onSelectConversation,
}: ChatListProps) {

  const getInitials = (name: string | null) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="border-b p-4">
        <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.userId}
              onClick={() => onSelectConversation(conv.userId)}
              className={`flex cursor-pointer items-start gap-3 border-b p-4 transition hover:bg-gray-50 ${
                selectedUserId === conv.userId ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-200 text-sm font-semibold text-purple-700">
                {getInitials(conv.userName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-semibold text-gray-800">
                    {conv.userName || "Unknown User"}
                  </h3>
                </div>
                <p className="truncate text-sm text-gray-500">
                  {conv.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
