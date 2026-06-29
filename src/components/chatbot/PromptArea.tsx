"use client";
import { Send } from "lucide-react";
import { useChatbot } from "@/context/ChatbotProvider";
import { Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PromptArea() {
  const { userPrompt, dispatch, thinking, thinkingMessage, handleSendMessage } =
    useChatbot();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative p-4 bg-base-100 border-t border-base-300 z-1">
      <div className="relative">
        <Textarea
          placeholder="Pergunte algo sobre seus investimentos..."
          className="resize-none pr-10"
          rows={1}
          value={userPrompt}
          onChange={(e) =>
            dispatch({ type: "setUserPrompt", value: e.target.value })
          }
          onKeyDown={handleKeyDown}
          disabled={thinking}
        ></Textarea>
        <Button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
          variant="ghost"
          size="icon"
          onClick={handleSendMessage}
          disabled={thinking || !userPrompt.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
      <div className="text-xs text-center mt-2 opacity-50">
        Conteúdo de caráter educativo gerado de forma automatizada por IA. Não constitui recomendação, indicação ou assessoria de investimento (CVM). Os dados simulados podem divergir da realidade. Decisões de alocação são de inteira responsabilidade do usuário. <br />
      </div>

      {thinking && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-sm font-bold mt-4 text-primary w-full justify-center">
            <Bot size={14} className={`animate-bounce text-primary`} />
            <span className={`text-sm font-bold`}>{thinkingMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
