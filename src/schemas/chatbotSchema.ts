import { z } from "zod";
// ======================================================================================
//                                      Base Schemas
// ======================================================================================
// Este arquivo define os esquemas de validação para o chatbot, incluindo as estruturas de dados para mensagens, conversas e eventos relacionados à interação com o chatbot. Ele utiliza a biblioteca Zod para garantir que os dados estejam no formato correto e atendam aos requisitos esperados, facilitando a manipulação segura desses dados em funções e componentes que lidam com a comunicação com o chatbot.
export const RoleSchema = z.enum(["user", "model"]);
// Este esquema define a estrutura de uma mensagem (Message), que inclui campos como id, conversationId, role, content e createdAt. Ele utiliza o Zod para validação, garantindo que os dados relacionados às mensagens sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados às mensagens em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de mensagens.
export const MessageSchema = z.object({
    id: z.number(),
    conversationId: z.number(),
    role: RoleSchema,
    content: z.string(),
    createdAt: z.iso.datetime(),
});
// Este esquema define a estrutura de uma conversa (Conversation), que inclui campos como id, title, createdAt, updatedAt e messages. Ele utiliza o Zod para validação, garantindo que os dados relacionados às conversas sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados às conversas em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de conversas.
export type TMessage = z.infer<typeof MessageSchema>;
// Este esquema define a estrutura de uma conversa (Conversation), que inclui campos como id, title, createdAt, updatedAt e messages. Ele utiliza o Zod para validação, garantindo que os dados relacionados às conversas sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados às conversas em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de conversas.
export const ConversationSchema = z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    messages: z.array(MessageSchema.omit({ conversationId: true })),
});

export type TConversation = z.infer<typeof ConversationSchema>;

export const ConversationSummarySchema = z.array(ConversationSchema.pick({ id: true, title: true, updatedAt: true }));
export type TConversationSummary = z.infer<typeof ConversationSummarySchema>;


// ======================================================================================
//                              Client x Server Streaming
// ======================================================================================
// Este tipo define os diferentes tipos de eventos que podem ocorrer durante a interação com o chatbot, incluindo pensamentos, textos, erros e chamadas de função. Ele é utilizado para categorizar e tratar os eventos de forma adequada, permitindo que o aplicativo responda de maneira apropriada a cada tipo de evento gerado pelo chatbot.
export type TChatbotEventType = "thought" | "text" | "error" | "function_call";

export interface IChatbotOngoingEvent {
    done: false;
    type: "thought" | "text" | "function_call";
    content: string; // Current chunk or thought
}

export interface IChatbotSuccessEvent {
    done: true;
    type: "text";
    content: string; // Full content
    conversationId: number;
}

export interface IChatbotErrorEvent {
    done: true;
    type: "error";
    message: string;
}

export type TChatbotEvent =
    | IChatbotOngoingEvent
    | IChatbotSuccessEvent
    | IChatbotErrorEvent;
