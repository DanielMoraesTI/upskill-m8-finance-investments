import { NextRequest, NextResponse } from "next/server";
import {
  TransactionListResponseSchema,
  TransactionSchema,
  TTransactionListResponse,
} from "@/schemas/transactionSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import transactionService from "@/app/api/_services/transaction.service";
import walletService from "@/app/api/_services/wallet.service";
import userService from "@/app/api/_services/user.service";

export async function GET(request: NextRequest) {
  try {
    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const transactionList = await transactionService.getAllTransactions(authorizedUser.id);
    const response: TTransactionListResponse = { transactionList };
    const parsed = TransactionListResponseSchema.safeParse(response);
    if (!parsed.success) {
      console.error("Transaction List Response parsing error:", parsed.error);
      return errorResponse("Erro ao processar a solicitação", 500);
    }

    return NextResponse.json({ transactionList: parsed.data.transactionList }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const parsed = TransactionSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Dados de transação inválidos", 400);
    }

    const createdTransaction = await transactionService.createTransaction(authorizedUser.id, parsed.data);

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(authorizedUser.id, parsed.data.asset_id);
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);

    return NextResponse.json({ transaction: createdTransaction }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
