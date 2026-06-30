"use client";
import ChatHistory from "@/components/chatbot/ChatHistory";
import ConversationMessages from "@/components/chatbot/ConversationMessages";
import PromptArea from "@/components/chatbot/PromptArea";
import DeleteConversation from "@/components/chatbot/DeleteConversation";
import { useChatbot } from "@/context/ChatbotProvider";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const MOBILE_HISTORY_STORAGE_KEY = "insights_mobile_history_open";
// Esta função de componente React renderiza a página de Insights, que fornece um resumo e análise da carteira de investimentos do usuário utilizando Inteligência Artificial.
export default function Insights() {
  const { dispatch, currentConversation } = useChatbot();
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  useEffect(() => {
    const savedState = sessionStorage.getItem(MOBILE_HISTORY_STORAGE_KEY);
    if (savedState !== null) {
      setMobileHistoryOpen(savedState === "true");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      MOBILE_HISTORY_STORAGE_KEY,
      String(mobileHistoryOpen),
    );
  }, [mobileHistoryOpen]);

  return (
    <div className="flex-1 flex flex-col w-full min-h-0 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6 md:h-full md:overflow-hidden">
      {/* Cabeçalho da página */}
      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Resumo e análise da carteira com Inteligência Artificial
          </p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button
            className="w-full sm:w-auto"
            variant="default"
            onClick={() => {
              setMobileHistoryOpen(false);
              dispatch({ type: "setCurrentConversation", value: null });
            }}
          >
            <Plus size={18} /> Novo Chat
          </Button>
        </div>
      </div>

      {/* Linha divisória */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

      <div className="flex-1 flex flex-col md:flex-row w-full min-h-[70dvh] md:h-full md:min-h-0 overflow-hidden bg-base-100 rounded-lg border border-base-300/60">
        <div className="md:hidden w-full border-b border-base-300/80">
          <Button
            variant="ghost"
            className="w-full justify-between rounded-none h-11 px-3"
            onClick={() => setMobileHistoryOpen((prev) => !prev)}
          >
            <span className="min-w-0 truncate text-sm font-medium text-left">
              {currentConversation?.title || "Chats recentes"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${mobileHistoryOpen ? "rotate-180" : "rotate-0"}`}
            />
          </Button>
        </div>

        <div
          className={`${mobileHistoryOpen ? "block" : "hidden"} md:block overflow-hidden max-h-[45dvh] md:max-h-none`}
        >
          <ChatHistory
            onConversationAction={() => setMobileHistoryOpen(false)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-x-hidden">
          <ConversationMessages />
          <PromptArea />
          <DeleteConversation />
        </div>
      </div>
    </div>
  );
}
