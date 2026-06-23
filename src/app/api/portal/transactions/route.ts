import { NextResponse } from "next/server";
import { TransactionListResponseSchema } from "@/schemas/transactionSchema";
import { findAllTransactions } from "@/app/api/_repositories/transaction.repository";

export async function GET() {
    try {
        // validar o userID

        // fazer a query
        const transactionList = await findAllTransactions();
        // fazer o parse da response
        const transactionListResponse = TransactionListResponseSchema.safeParse({
            transactionList: transactionList || [],
        });
        if (!transactionListResponse.success) {
            return NextResponse.json({
                message: "Erro ao processar a resposta do sistema de transações"
            }, { status: 500 });
        }
        return NextResponse.json(transactionListResponse.data, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/transactions:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
         }, { status: 500 });
     }
}

