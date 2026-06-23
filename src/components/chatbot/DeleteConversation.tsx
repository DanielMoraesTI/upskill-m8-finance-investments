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

  if (!deletingConversation ||!currentConversation) return null;
  return (
    <div className="absolute inset-0 w-full h-full bg-background/20 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4">
      <span className="text-xl font-bold">{currentConversation.title}...</span>
      <span className="text-lg font-semibold">
        Tem certeza que deseja excluir esta conversa?
      </span>
      <span className="text-md text-muted-foreground">
        Esta ação não pode ser desfeita.
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: "setDeletingConversation", value: false });
            dispatch({ type: "setCurrentConversation", value: null });
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteConversation(currentConversation.id)}
        >
          Sim, excluir
        </Button>
      </div>
    </div>
  );
}
