import { ChatbotFunction } from "../_utils/chatbot.functions";
import { z } from "zod";
import { startOfDay, endOfDay, subWeeks, subMonths, subQuarters, subYears } from "date-fns";
import transactionRepository from "@/app/api/_repositories/transaction.repository";
import { TTransactionList } from "@/schemas/transactionSchema";

export default async function handleFunctionCall(fnName: ChatbotFunction, args: unknown) {
    switch (fnName) {
        case "get_investment_summary":
            return await getInvestmentSummary(args);

        default:
            throw new Error(`Função '${fnName}' não implementada.`);
    }
}

// ==================================================================================
//                            Tool: get_investment_summary
// ==================================================================================

async function getInvestmentSummary(args: unknown): Promise<TTransactionList> {
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

    const transactions = await transactionRepository.findAllTransactions({
        entryType: type === "all" ? null : type,
        assetTypeId: assetType === "all" ? null : assetType,
        startDate,
        endDate
    });

    return transactions;
}