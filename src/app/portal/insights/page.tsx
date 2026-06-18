"use client";
import ChatHistory from "@/components/chatbot/ChatHistory";
import ConversationMessages from "@/components/chatbot/ConversationMessages";
import PromptArea from "@/components/chatbot/PromptArea";
import { useChatbot } from "@/context/ChatbotProvider";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Insights() {
  const { dispatch } = useChatbot();

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Cabeçalho da página */}
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Resumo e análise da carteira com Inteligência Artificial
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={() =>
              dispatch({ type: "setCurrentConversation", value: null })
            }
          >
            <Plus size={18} /> Novo Chat
          </Button>
        </div>
      </div>

      {/* Linha divisória */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

      <div className="flex-1 flex flex-col md:flex-row w-full h-full min-h-0 overflow-hidden bg-base-100">
        <ChatHistory />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full min-h-0 relative gap-4 overflow-x-hidden">
          <ConversationMessages />
          <PromptArea />
        </div>
      </div>
    </div>
  );
}
