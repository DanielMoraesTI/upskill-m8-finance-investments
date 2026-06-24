import { NextRequest, NextResponse } from "next/server";
import transactionService from "@/app/api/_services/transaction.service";
import { UpdateTransactionRequestSchema } from "@/schemas/transactionSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import walletService from "@/app/api/_services/wallet.service";
import userService from "@/app/api/_services/user.service";

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/portal/transactions/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    // Validar os dados da transação atual
    if (String(id) !== String(body.id)) {
      return errorResponse(
        "ID de transação no corpo da requisição não corresponde ao ID na URL",
        400
      );
    }

    const currentParsed = UpdateTransactionRequestSchema.safeParse(body);
    if (!currentParsed.success) {
      return errorResponse
        ("Dados de transação inválidos", 400);
    }

    // Chamar o serviço para atualizar os dados da transação no DB
    const updatedTransaction = await transactionService.updateTransaction(authorizedUser.id, currentParsed.data.transaction);

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(authorizedUser.id, currentParsed.data.transaction.asset_id);
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);



    return NextResponse.json(
      { transaction: updatedTransaction },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT /api/transactions/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}

export async function DELETE(request: NextRequest, ctx: RouteContext<'/api/portal/transactions/[id]'>) {
  try {
    const { id } = await ctx.params;

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const currentTransaction = await transactionService.getTransactionById(authorizedUser.id, Number(id));
    if (!currentTransaction) return errorResponse("Transação não encontrada", 404);

    const deleted = await transactionService.deleteTransaction(authorizedUser.id, currentTransaction.id);
    if (!deleted) return errorResponse("Transação não encontrada", 404);

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(authorizedUser.id, currentTransaction.asset_id);
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /api/transactions/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
