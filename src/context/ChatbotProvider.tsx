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

  // fetch conversations with react-query
  const { data: conversationList } = useQuery({
    queryKey: ["conversationsList"],
    queryFn: chatbotService.getConversationSummary,
  });

  // fetch chat history with react-query
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
  }, [conversationList]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (error) {
      console.error("Error deleting conversation:", error);
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
      console.error("Error sending message:", error);
      dispatch({ type: "setThinking", value: false });
      dispatch({
        type: "setThinkingMessage",
        value: "Erro ao enviar mensagem.",
      });
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
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}
