"use client";
import { useChatbot } from "@/context/ChatbotProvider";
import { Bot, ChevronDown, HelpCircle, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatbotHelper from "@/components/chatbot/ChatbotHelper";

const FAQ_STORAGE_KEY = "insights_faq_open";

const promptSuggestions = [
  "Quais ativos que mais comprei nos últimos 6 meses?",
  "Qual ativo tenho comprado menos nos últimos 3 meses?",
  "Compare a carteira atual com 3 meses atrás.",
];

export default function ConversationMessages() {
  const { currentConversation, dispatch, userPrompt, streamingMessage } =
    useChatbot();
  const [faqOpen, setFaqOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages, streamingMessage]);

  useEffect(() => {
    const savedState = sessionStorage.getItem(FAQ_STORAGE_KEY);
    if (savedState !== null) {
      setFaqOpen(savedState === "true");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(FAQ_STORAGE_KEY, String(faqOpen));
  }, [faqOpen]);

  if (!currentConversation && !streamingMessage) {
    return (
      <div className="flex-1 flex flex-col items-center h-full min-h-0 px-3 sm:px-6 text-center overflow-y-auto overscroll-y-contain py-3">
        <h2 className="text-base sm:text-xl font-semibold mb-2">
          Envie uma mensagem para começar
        </h2>

        {userPrompt.length === 0 && (
          <div className="w-full max-w-2xl border border-base-300/70 rounded-md bg-base-100 overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-between rounded-none h-8 sm:h-11 px-2 sm:px-3"
              onClick={() => setFaqOpen((prev) => !prev)}
            >
              <span className="text-[11px] sm:text-sm font-medium">
                Perguntas Frequentes
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform ${faqOpen ? "rotate-180" : "rotate-0"}`}
              />
            </Button>

            {faqOpen && (
              <div className="px-2 sm:px-3 pb-1.5 sm:pb-3 pt-1 opacity-70">
                <div className="flex flex-col items-stretch sm:items-center gap-1 sm:gap-3">
                  {promptSuggestions.map((rec, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full sm:w-auto justify-start text-left whitespace-nowrap overflow-hidden text-ellipsis h-auto py-1 px-2 text-[11px] sm:text-sm leading-tight"
                      onClick={() => {
                        dispatch({ type: "setUserPrompt", value: rec });
                        setFaqOpen(false);
                      }}
                    >
                      <Search size={10} className="hidden sm:inline shrink-0" />{" "}
                      {rec}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 mb-1">
          <ChatbotHelper />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full px-3 sm:px-4 overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold my-3 sm:my-4 wrap-break-word">
        {currentConversation?.title || "Nova Conversa"}
      </h2>

      <div className="divider mt-0.5 mb-2"></div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 scroll-smooth"
      >
        {currentConversation?.messages
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          .map((msg, i) => (
            <div
              key={i}
              className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <Bot size={20} className="text-primary mr-2" />
              )}
              <div
                className={`max-w-[85%] sm:max-w-[70%] ${msg.role === "user" ? "bg-accent text-info text-sm rounded-lg p-2" : "bg-base-200 text-base-content text-sm rounded-lg p-0"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {streamingMessage && (
          <div className="flex items-start justify-start">
            <Bot size={20} className="text-primary mr-2" />
            <div className="max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-lg bg-base-200 text-base-content">
              {streamingMessage}
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
