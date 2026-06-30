import { ChatbotFunction } from "../_utils/chatbot.functions";
import type { TConversation, TMessage, TConversationSummary } from "@/schemas/chatbotSchema";
import { ConversationSchema, ConversationSummarySchema, MessageSchema } from "@/schemas/chatbotSchema";
import { z } from "zod";
import { startOfDay, endOfDay, subWeeks, subMonths, subQuarters, subYears } from "date-fns";
import transactionService from "@/app/api/_services/transaction.service";
import { TTransactionList } from "@/schemas/transactionSchema";
import chatbotRepository from "@/app/api/_repositories/chatbot.repository";


// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getConversationMessages(userId: number, conversationId: number): Promise<TConversation | null> {
    const rows = await chatbotRepository.findMessagesByConversationId(userId, conversationId);
    if (rows.length === 0) return null;

    const messages: Omit<TMessage, "conversationId">[] = rows.map((row) => ({
        id: row.messageId,
        role: row.role === "user" ? "user" : "model",
        content: row.content,
        createdAt: new Date(row.messageCreatedAt).toISOString(),
    }));

    const conversation: TConversation = {
        id: rows[0].conversationId,
        title: rows[0].title,
        createdAt: new Date(rows[0].conversationCreatedAt).toISOString(),
        updatedAt: new Date(rows[0].conversationUpdatedAt).toISOString(),
        messages,
    }

    const parsed = ConversationSchema.safeParse(conversation);
    if (!parsed.success) {
        console.log("Erro ao validar conversa:", parsed.error);
        throw new Error("Dados de conversa invalidos");
    }
    return parsed.data;
}

async function getAllConversationSummary(userId: number): Promise<TConversationSummary> {
    const rows = await chatbotRepository.findAllConversationSummary(userId);
    if (rows.length === 0) return [];

    const conversationSummary: TConversationSummary = rows.map((row) => ({
        id: row.id,
        title: row.title,
        updatedAt: new Date(row.updated_at).toISOString(),
    }));

    const parsed = ConversationSummarySchema.safeParse(conversationSummary);
    if (!parsed.success) {
        console.log("Erro ao validar resumo da conversa:", parsed.error);
        throw new Error("Dados de resumo da conversa invalidos");
    }
    return parsed.data;
}

// ==================================================================================
//                              DELETE SERVICES
// ==================================================================================
async function deleteConversation(userId: number, conversationId: number): Promise<boolean> {
    const deleted = await chatbotRepository.deleteConversation(userId, conversationId);
    return deleted;
}


// ==================================================================================
//                              POST SERVICES
// ==================================================================================

async function createConversation(userId: number, prompt: string): Promise<TConversation> {
    let formattedTitle = prompt.length > 30 ? prompt.slice(0, 30) + '...' : prompt;
    formattedTitle = formattedTitle.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    formattedTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
    
    const result = await chatbotRepository.createConversation(userId, formattedTitle);
    if (result.affectedRows === 0 || !result.insertId) {
        throw new Error("Falha ao criar conversa");
    }

    const conversation: TConversation = {
        id: result.insertId,
        title: formattedTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
    }

    const parsed = ConversationSchema.safeParse(conversation);
    if (!parsed.success) {
        console.log("Erro ao validar conversa:", parsed.error);
        throw new Error("Dados de conversa invalidos");
    }

    return parsed.data;
}

async function createMessage(args: Omit<TMessage, "id" | "createdAt">): Promise<TMessage> {
    const result = await chatbotRepository.createMessage(args);
    if (result.affectedRows === 0 || !result.insertId) {
        throw new Error("Falha ao criar mensagem");
    }

    const message: TMessage = {
        id: result.insertId,
        conversationId: args.conversationId,
        role: args.role,
        content: args.content,
        createdAt: new Date().toISOString(),
    }

    const parsed = MessageSchema.safeParse(message);
    if (!parsed.success) {
        console.log("Erro ao validar mensagem:", parsed.error);
        throw new Error("Dados de mensagem invalidos");
    }

    await chatbotRepository.updateConversationTimestamp(args.conversationId);

    return parsed.data;
}

async function handleFunctionCall(userId: number, fnName: ChatbotFunction, args: unknown) {
    switch (fnName) {
        case "get_investment_summary":
            return await getInvestmentSummary(userId, args);

        default:
            throw new Error(`FunÃ§Ã£o '${fnName}' nÃ£o implementada.`);
    }
}

const chatbotService = {
    getConversationMessages,
    getAllConversationSummary,
    deleteConversation,
    createConversation,
    createMessage,
    handleFunctionCall,
};
export default chatbotService

// ==================================================================================
//                            Tool: get_investment_summary
// ==================================================================================

async function getInvestmentSummary(userId: number, args: unknown): Promise<TTransactionList> {
    const { period, type, assetType } = z.object({
        period: z.enum(["week", "month", "quarter", "semester", "year"]),
        type: z.enum(["buy", "sell", "all"]),
        assetType: z.enum(["1", "2", "3", "all"])
    }).parse(args);

    const now = new Date();
    const endDate = endOfDay(now);
    let startDate: Date;

    switch (period) {
        case "week": startDate = startOfDay(subWeeks(now, 1)); break;
        case "month": startDate = startOfDay(subMonths(now, 1)); break;
        case "quarter": startDate = startOfDay(subQuarters(now, 1)); break;
        case "semester": startDate = startOfDay(subMonths(now, 6)); break;
        case "year": startDate = startOfDay(subYears(now, 1)); break;
    }

    const transactions = await transactionService.getAllTransactionsWithArgs({
        userId,
        entryType: type === "all" ? null : type,
        assetTypeId: assetType === "all" ? null : assetType,
        startDate,
        endDate
    });

    return transactions;
}