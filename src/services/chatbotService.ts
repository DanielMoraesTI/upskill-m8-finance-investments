import { ConversationSummarySchema, ConversationSchema } from "@/schemas/chatbotSchema";
import type {
    TConversationSummary,
    TChatbotEvent, TConversation,
} from "@/schemas/chatbotSchema";
import { getUserToken } from "./api";

const url = `${process.env.NEXT_PUBLIC_API_URL}/portal/chatbot` || "http://localhost:3000/api/portal/chatbot";

const getConversationSummary = async (): Promise<TConversationSummary> => {
    const token = await getUserToken();
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': token },
    });

    if (!response.ok) throw new Error('Failed to fetch conversation summary');

    const data = await response.json();
    const parsed = ConversationSummarySchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('Invalid conversation summary data');
    }

    return parsed.data;
}

const getChatHistory = async (conversationId: number): Promise<TConversation> => {
    const token = await getUserToken();
    const response = await fetch(`${url}?id=${conversationId}`, {
        method: 'GET',
        headers: { 'Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to fetch chat history');

    const data = await response.json();
    const parsed = ConversationSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error('Invalid conversation data');
    }
    return parsed.data;
}


async function deleteConversation(conversationId: number): Promise<boolean> {
    const token = await getUserToken();
    const response = await fetch(`${url}?id=${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    return response.json();
}

async function startChat(prompt: string, onEvent: (event: TChatbotEvent) => void): Promise<void> {
    const token = await getUserToken();
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
    });

    if (!response.ok) throw new Error('Failed to start chat');
    if (!response.body) throw new Error('No response body');

    await handleStream(response.body, onEvent);
}

async function sendMessage(conversationId: number, prompt: string, onEvent: (event: TChatbotEvent) => void): Promise<void> {
    const token = await getUserToken();
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ conversationId, prompt }),
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
    });

    if (!response.ok) throw new Error('Failed to send message');
    if (!response.body) throw new Error('No response body');

    await handleStream(response.body, onEvent);
}

async function handleStream(body: ReadableStream<Uint8Array>, onEvent: (event: TChatbotEvent) => void): Promise<void> {
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
                    const event = JSON.parse(trimmedLine.slice(6)) as TChatbotEvent;
                    onEvent(event);
                } catch (e) {
                    console.error('Error parsing stream event', e);
                }
            }
        }
    }
}

const chatbotService = {
    getConversationSummary,
    getChatHistory,
    deleteConversation,
    startChat,
    sendMessage,
};
export default chatbotService;