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
    createdAt: z.iso.datetime(),
});

export type TMessage = z.infer<typeof MessageSchema>;

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
