import { ConversationSummarySchema, ConversationSchema } from "@/schemas/chatbotSchema";
import type {
    TConversationSummary,
    TChatbotEvent, TConversation,
} from "@/schemas/chatbotSchema";
import { getUserToken } from "./api";

const url = `${process.env.NEXT_PUBLIC_API_URL}/portal/chatbot` || "http://localhost:3000/api/portal/chatbot";
// Esta função obtém o resumo das conversas do usuário autenticado, retornando um array de objetos TConversationSummary. Ela utiliza a função getUserToken para obter o token de autenticação do usuário e faz uma requisição GET para a API do chatbot, validando a resposta com o esquema ConversationSummarySchema.
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
// Esta função obtém o histórico de mensagens de uma conversa específica do usuário autenticado, retornando um objeto TConversation. Ela utiliza a função getUserToken para obter o token de autenticação do usuário e faz uma requisição GET para a API do chatbot com o ID da conversa, validando a resposta com o esquema ConversationSchema.
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
// Esta função exclui uma conversa específica do usuário autenticado, retornando um booleano indicando se a exclusão foi bem-sucedida. Ela utiliza a função getUserToken para obter o token de autenticação do usuário e faz uma requisição DELETE para a API do chatbot com o ID da conversa.
async function deleteConversation(conversationId: number): Promise<boolean> {
    const token = await getUserToken();
    const response = await fetch(`${url}?id=${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token },
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    return response.json();
}
// Esta função inicia uma nova conversa com o chatbot, enviando um prompt inicial e recebendo eventos de resposta em tempo real. Ela utiliza a função getUserToken para obter o token de autenticação do usuário e faz uma requisição POST para a API do chatbot com o prompt fornecido. A função onEvent é chamada para cada evento recebido do chatbot, permitindo que o aplicativo processe as respostas em tempo real.
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
// Esta função envia uma mensagem para uma conversa existente com o chatbot, enviando o prompt fornecido e recebendo eventos de resposta em tempo real. Ela utiliza a função getUserToken para obter o token de autenticação do usuário e faz uma requisição POST para a API do chatbot com o ID da conversa e o prompt fornecido. A função onEvent é chamada para cada evento recebido do chatbot, permitindo que o aplicativo processe as respostas em tempo real.
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
// Esta função lida com o streaming de eventos do chatbot, processando os dados recebidos em tempo real e chamando a função onEvent para cada evento recebido. Ela utiliza um leitor de fluxo (ReadableStream) para ler os dados do corpo da resposta e decodifica os eventos JSON, garantindo que cada evento seja tratado corretamente.
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