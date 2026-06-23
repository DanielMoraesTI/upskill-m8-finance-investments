import React from "react";
import { useChatbot } from "@/context/ChatbotProvider";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatbotHelper from "@/components/chatbot/ChatbotHelper";

export default function ChatHistory() {
  const { filteredConversations, currentConversation, handleOpenConversation, dispatch } =
    useChatbot();

  return (
    <div className="w-full md:w-60 h-full flex flex-col bg-base-200 border-r border-base-300 py-2">
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex flex-row items-center justify-between px-3 py-2 text-xs font-semibold text-base-content/50 uppercase">
          Chats Recentes
        </div>

        {Array.isArray(filteredConversations) &&
        filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-md w-full"
            >
              <Button
                className="w-full min-w-0 shrink justify-start overflow-hidden"
                variant={
                  currentConversation?.id === conversation.id
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => {
                  dispatch({ type: "setDeletingConversation", value: false });
                  handleOpenConversation(conversation.id);
                }}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-left">
                  {conversation.title}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  dispatch({ type: "setDeletingConversation", value: true });
                  handleOpenConversation(conversation.id);
                }}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-sm text-base-content/50 px-3 py-2">
            Nenhum chat recente
          </div>
        )}
      </div>
      <ChatbotHelper />
    </div>
  );
}
