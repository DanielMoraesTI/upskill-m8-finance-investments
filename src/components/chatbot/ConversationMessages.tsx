"use client";
import { useChatbot } from "@/context/ChatbotProvider";
import { Bot, HelpCircle, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const promptSuggestions = [
  "Quais ativos valorizaram mais nos últimos 6 meses?",
  "Qual é o rendimento total de renda fixa?",
  "Compare a carteira atual com 3 meses atrás.",
];

export default function ConversationMessages() {
  const { currentConversation, dispatch, userPrompt, streamingMessage } =
    useChatbot();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages, streamingMessage]);

  if (!currentConversation && !streamingMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0">
        <h2 className="text-xl font-semibold mb-4">
          Envie uma mensagem para começar
        </h2>

        {userPrompt.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-4">
            Perguntas Frequentes:{" "}
            {promptSuggestions.map((rec, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => dispatch({ type: "setUserPrompt", value: rec })}
              >
                <Search size={10} /> {rec}
              </Button>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "toggleHelper", value: true })}
        >
          Ajuda <HelpCircle size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full px-4 overflow-hidden">
      <h2 className="text-lg font-semibold my-4">
        {currentConversation?.title || "Nova Conversa"}
      </h2>

      <div className="divider mt-0.5 mb-2"></div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {currentConversation?.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <Bot size={20} className="text-primary mr-2" />
            )}
            <div
              className={`max-w-[70%] p-4 rounded-lg ${msg.role === "user" ? "bg-neutral text-info" : "bg-base-200 text-base-content"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streamingMessage && (
          <div className="flex items-start justify-start">
            <Bot size={20} className="text-primary mr-2" />
            <div className="max-w-[70%] p-4 rounded-lg bg-base-200 text-base-content">
              {streamingMessage}
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
