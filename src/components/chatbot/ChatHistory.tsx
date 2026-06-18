import React from "react";
import { useChatbot } from "@/context/ChatbotProvider";
import { HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatHistory() {
  const { filteredConversations, currentConversation, handleOpenConversation, dispatch } =
    useChatbot();

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-base-200 border-r border-base-300 py-2">
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex flex-row items-center justify-between px-3 py-2 text-xs font-semibold text-base-content/50 uppercase">
          Chats Recentes
        </div>

        {Array.isArray(filteredConversations) &&
        filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={
                currentConversation?.id === conversation.id
                  ? "secondary"
                  : "ghost"
              }
              onClick={() => handleOpenConversation(conversation.id)}
            >
              <MessageSquare size={16} />
              <span className="truncate">{conversation.title}</span>
            </Button>
          ))
        ) : (
          <div className="text-sm text-base-content/50 px-3 py-2">
            Nenhum chat recente
          </div>
        )}
      </div>

      {/* Help Indicator Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-fit self-center"
        onClick={() => dispatch({ type: "toggleHelper", value: true })}
      >
        Ajuda <HelpCircle size={16} />
      </Button>
    </div>
  );
}
