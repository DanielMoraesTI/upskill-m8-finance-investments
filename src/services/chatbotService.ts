import { ChatbotEvent, Conversation, ConversationSummarySchema, ConversationSchema } from "@/schemas/chatbotSchema";
import type {
    ConversationSummary
} from "@/schemas/chatbotSchema";
const url = `${process.env.NEXT_PUBLIC_API_URL}/chatbot` || "http://localhost:3000/api/chatbot";

export const getConversationSummary = async (): Promise<ConversationSummary[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch conversation summary');

    const data = await response.json();
    const parsed = ConversationSummarySchema.array().safeParse(data);
    if (!parsed.success) {
        throw new Error('Invalid conversation summary data');
    }

    return parsed.data;
}

export const getChatHistory = async (conversationId: number): Promise<Conversation> => {
    const response = await fetch(`${url}?id=${conversationId}`);
    if (!response.ok) throw new Error('Failed to fetch chat history');

    const data = await response.json();
    const parsed = ConversationSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('Invalid conversation data');
    }
    return parsed.data;
}

export const chatbotApi = {
    async getConversations(): Promise<Conversation[]> {
        const response = await fetch('/api/chatbot');
        if (!response.ok) throw new Error('Failed to fetch conversations');
        return response.json();
    },

    async getChatHistory(conversationId: number): Promise<Conversation> {
        const response = await fetch(`/api/chatbot?id=${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch chat history');
        return response.json();
    },

    async startChat(prompt: string, onEvent: (event: ChatbotEvent) => void): Promise<void> {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to start chat');
        if (!response.body) throw new Error('No response body');

        await this.handleStream(response.body, onEvent);
    },

    async sendMessage(conversationId: number, prompt: string, onEvent: (event: ChatbotEvent) => void): Promise<void> {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            body: JSON.stringify({ conversationId, prompt }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to send message');
        if (!response.body) throw new Error('No response body');

        await this.handleStream(response.body, onEvent);
    },

    async handleStream(body: ReadableStream<Uint8Array>, onEvent: (event: ChatbotEvent) => void): Promise<void> {
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data: ')) {
                    try {
                        const event = JSON.parse(trimmedLine.slice(6)) as ChatbotEvent;
                        onEvent(event);
                    } catch (e) {
                        console.error('Error parsing stream event', e);
                    }
                }
            }
        }
    }
};
