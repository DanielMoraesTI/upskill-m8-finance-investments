import { z } from "zod";
// ======================================================================================
//                                      Base Schemas
// ======================================================================================
export const RoleSchema = z.enum(["user", "model"]);

export const MessageSchema = z.object({
    id: z.number(),
    conversationId: z.number(),
    role: RoleSchema,
    content: z.string(),
    createdAt: z.date().or(z.string()),
});

export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.date().or(z.string()),
    updatedAt: z.date().or(z.string()),
    messages: z.array(MessageSchema.omit({ conversationId: true })),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const ConversationSummarySchema = z.object({
    id: z.number(),
    title: z.string(),
    updatedAt: z.date().or(z.string()),
});
export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;

// ======================================================================================
//                              Client x Server Streaming
// ======================================================================================
export type ChatbotEventType = "thought" | "text" | "error" | "function_call";

export interface ChatbotOngoingEvent {
    done: false;
    type: "thought" | "text" | "function_call";
    content: string; // Current chunk or thought
}

export interface ChatbotSuccessEvent {
    done: true;
    type: "text";
    content: string; // Full content
    conversationId: number;
}

export interface ChatbotErrorEvent {
    done: true;
    type: "error";
    message: string;
}

export type ChatbotEvent =
    | ChatbotOngoingEvent
    | ChatbotSuccessEvent
    | ChatbotErrorEvent;
