import { z } from "zod";
import type { FunctionDeclaration } from "@google/genai";
import { Type } from "@google/genai";

export const ChatbotFunctionSchema = z.enum([
    "get_investment_summary",
    // adicionar mais se necessário aqui
]);

export type ChatbotFunction = z.infer<typeof ChatbotFunctionSchema>;

export const getInvestmentSummary: FunctionDeclaration = {
    name: "get_investment_summary",
    description: "Obtém uma lista com o histórico das transações (compra/venda) de investimentos financeiros (ações, fundos imobiliários ou renda fixa) para um período específico.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            period: {
                type: Type.STRING,
                enum: ["week", "month", "quarter", "semester", "year"],
                description: "O intervalo de tempo para o resumo.",
            },
            type: {
                type: Type.STRING,
                enum: ["buy", "sell", "all"],
                description: "O tipo de transação de investimento a ser incluído no resumo: compra (buy), venda (sell) ou todas (all).",
            },
            assetType: {
                type: Type.STRING,
                enum: ["1", "2", "3", "all"],
                description: "O tipo de ativo financeiro a ser incluído no resumo: ações (1), fundos imobiliários (2), renda fixa (3) ou todos (all).",
            },
        },
        required: ["period", "type", "assetType"],
    }
}

export const chatbotTools: FunctionDeclaration[] = [
    getInvestmentSummary,
];
