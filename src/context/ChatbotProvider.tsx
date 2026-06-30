"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import type {
  TConversationSummary,
  TConversation,
} from "@/schemas/chatbotSchema";
import type { Dispatch } from "react";
import chatbotService from "@/services/chatbotService";
import { useQueryClient } from "@tanstack/react-query";
import { useApp } from "./AppProvider";
// ==============================================================================
//                                  CONTEXT
// ==============================================================================
// Esta interface define a estrutura do estado do chatbot (ChatbotState), que inclui a lista completa de conversas (conversationList), a lista filtrada de conversas (filteredConversations), a conversa atual (currentConversation), o prompt do usuário (userPrompt), o estado de pensamento (thinking), a mensagem de pensamento (thinkingMessage), a mensagem em streaming (streamingMessage), o estado de exclusão de conversa (deletingConversation) e a função para lidar com a exclusão de uma conversa (handleDeleteConversation).
interface ChatbotState {
  conversationList: TConversationSummary;
  filteredConversations: TConversationSummary;
  currentConversation: TConversation | null;
  userPrompt: string;
  thinking: boolean;
  thinkingMessage: string;
  streamingMessage: string;
  deletingConversation: boolean;
  handleDeleteConversation: (conversationId: number) => Promise<void>;
}

const initialState: ChatbotState = {
  conversationList: [],
  filteredConversations: [],
  currentConversation: null,
  userPrompt: "",
  thinking: false,
  thinkingMessage: "",
  streamingMessage: "",
  deletingConversation: false,
  handleDeleteConversation: async () => {},
};

type ChatbotStateAction =
  | { type: "setInitialData" }
  | { type: "setFilteredConversations"; value: TConversationSummary }
  | { type: "setCurrentConversation"; value: TConversation | null }
  | { type: "setUserPrompt"; value: string }
  | { type: "setThinking"; value: boolean }
  | { type: "setThinkingMessage"; value: string }
  | { type: "setStreamingMessage"; value: string }
  | { type: "appendStreamingMessage"; value: string }
  | { type: "setDeletingConversation"; value: boolean };
// Esta interface define a estrutura do contexto do chatbot (ChatbotContextProps), que estende o estado do chatbot (ChatbotState) e inclui a lista completa de conversas (conversationList), a função de despacho (dispatch), a função para abrir uma conversa especí­fica (handleOpenConversation) e a função para enviar uma mensagem (handleSendMessage).
interface ChatbotContextProps extends Omit<ChatbotState, "conversationList"> {
  conversationList: TConversationSummary | undefined;
  dispatch: Dispatch<ChatbotStateAction>;
  handleOpenConversation: (conversationId: number) => Promise<void>;
  handleSendMessage: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextProps | null>(null);

function chatbotReducer(
  state: ChatbotState,
  action: ChatbotStateAction,
): ChatbotState {
  switch (action.type) {
    case "setInitialData":
      return { ...initialState };
    case "setFilteredConversations":
      return { ...state, filteredConversations: action.value };
    case "setCurrentConversation":
      return { ...state, currentConversation: action.value };
    case "setDeletingConversation":
      return { ...state, deletingConversation: action.value };
    case "setUserPrompt":
      return { ...state, userPrompt: action.value };
    case "setThinking":
      return { ...state, thinking: action.value };
    case "setThinkingMessage":
      return { ...state, thinkingMessage: action.value };
    case "setStreamingMessage":
      return { ...state, streamingMessage: action.value };
    case "appendStreamingMessage":
      return {
        ...state,
        streamingMessage: state.streamingMessage + action.value,
      };
    default:
      return state;
  }
}
// Este componente é o provedor do contexto do chatbot (ChatbotProvider), que envolve os componentes filhos e fornece o contexto do chatbot para eles. Ele utiliza o hook useReducer para gerenciar o estado do chatbot, o hook useState para gerenciar o ID da conversa aberta, o hook useQuery para buscar a lista de conversas e o histórico de mensagens da conversa atual, e o hook useMutation para criar uma mutação que permite excluir uma conversa. O useEffect é utilizado para filtrar a lista de conversas com base na data de atualização, garantindo que as conversas mais recentes sejam exibidas primeiro. O ChatbotProvider é responsável por fornecer os dados relacionados ao chatbot para os componentes filhos, permitindo que eles acessem as informações necessárias e possam realizar as operações de envio de mensagens e exclusão de conversas de forma segura e eficiente.
export default function ChatbotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);
  const [openConversationId, setOpenConversationId] = useState<number | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { notifyResult } = useApp();

  // O Fetching da lista de conversas é feito utilizando o hook useQuery do React Query, que busca os dados da API e atualiza o estado do contexto do chatbot com a lista de conversas.
  const { data: conversationList } = useQuery({
    queryKey: ["conversationsList"],
    queryFn: chatbotService.getConversationSummary,
  });

  // O Fetching do histórico de mensagens da conversa atual é feito utilizando o hook useQuery do React Query, que busca os dados da API com base no ID da conversa aberta e atualiza o estado do contexto do chatbot com o histórico de mensagens.
  const { data: chatHistory } = useQuery({
    queryKey: ["chatHistory", openConversationId],
    queryFn: () => chatbotService.getChatHistory(openConversationId!),
    enabled: openConversationId !== null,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (chatHistory) {
      dispatch({ type: "setCurrentConversation", value: chatHistory });
    }
  }, [chatHistory]);

  const handleSortConversations = () => {
    const sorted = [...(conversationList || [])].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    dispatch({ type: "setFilteredConversations", value: sorted });
  };

  useEffect(() => {
    if (conversationList) {
      handleSortConversations();
    }
  }, [conversationList]);

  const handleOpenConversation = async (conversationId: number) => {
    setOpenConversationId(conversationId);
  };

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: number) =>
      chatbotService.deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversationsList"] });
      queryClient.invalidateQueries({
        queryKey: ["chatHistory", conversationId],
      });
    },
  });

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await deleteConversationMutation.mutateAsync(conversationId);
      dispatch({ type: "setDeletingConversation", value: false });
      dispatch({ type: "setCurrentConversation", value: null });
      notifyResult("success", "Conversa excluÃ­da com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir conversa:", error);
      notifyResult("error", "NÃ£o foi possÃ­vel excluir a conversa.");
    }
  };

  const handleSendMessage = async () => {
    if (!state.userPrompt.trim()) return;

    const prompt = state.userPrompt;
    dispatch({ type: "setUserPrompt", value: "" });
    dispatch({ type: "setThinking", value: true });
    dispatch({ type: "setThinkingMessage", value: "Analisando..." });
    dispatch({ type: "setStreamingMessage", value: "" });

    try {
      await chatbotService.sendMessage(
        state.currentConversation?.id || 0,
        prompt,
        (event) => {
          if (event.type === "thought" || event.type === "function_call") {
            dispatch({ type: "setThinkingMessage", value: event.content });
          } else if (event.type === "text") {
            if (event.done) {
              dispatch({ type: "setThinking", value: false });
              dispatch({ type: "setStreamingMessage", value: "" });

              if (event.conversationId) {
                setOpenConversationId(event.conversationId);
                queryClient.invalidateQueries({
                  queryKey: ["conversationsList"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["chatHistory", event.conversationId],
                });
              }
            } else {
              dispatch({
                type: "appendStreamingMessage",
                value: event.content,
              });
            }
          } else if (event.type === "error") {
            dispatch({ type: "setThinking", value: false });
            dispatch({ type: "setThinkingMessage", value: event.message });
          }
        },
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      dispatch({ type: "setThinking", value: false });
      dispatch({
        type: "setThinkingMessage",
        value: "Erro ao enviar mensagem.",
      });
      notifyResult("error", "NÃ£o foi possÃ­vel enviar a mensagem no chatbot.");
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        ...state,
        conversationList,
        dispatch,
        handleOpenConversation,
        handleSendMessage,
        handleDeleteConversation,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot deve ser usado dentro de um ChatbotProvider");
  }
  return context;
}
