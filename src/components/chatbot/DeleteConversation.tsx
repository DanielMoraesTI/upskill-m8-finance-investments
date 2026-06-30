"use client";
import { useChatbot } from "@/context/ChatbotProvider";
import { Button } from "../ui/button";

export default function DeleteConversation() {
  const {
    currentConversation,
    dispatch,
    handleDeleteConversation,
    deletingConversation,
  } = useChatbot();

  if (!deletingConversation || !currentConversation) return null;
  return (
    <div className="absolute inset-0 w-full h-full bg-background/20 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-lg sm:text-xl font-bold wrap-break-word">
        {currentConversation.title}...
      </span>
      <span className="text-base sm:text-lg font-semibold">
        Tem certeza que deseja excluir esta conversa?
      </span>
      <span className="text-sm sm:text-md text-muted-foreground">
        Esta ação não pode ser desfeita.
      </span>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          onClick={() => {
            dispatch({ type: "setDeletingConversation", value: false });
            dispatch({ type: "setCurrentConversation", value: null });
          }}
        >
          Cancelar
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="destructive"
          onClick={() => handleDeleteConversation(currentConversation.id)}
        >
          Sim, excluir
        </Button>
      </div>
    </div>
  );
}
