import { NextRequest, NextResponse } from "next/server";
import transactionService from "@/app/api/_services/transaction.service";
import { UpdateTransactionRequestSchema } from "@/schemas/transactionSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import walletService from "@/app/api/_services/wallet.service";

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/portal/transactions/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

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
    const updatedTransaction = await transactionService.updateTransaction(currentParsed.data.transaction);

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(currentParsed.data.transaction.asset_id);
    await walletService.updateWalletData(updatedWalletData);



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

    const currentTransaction = await transactionService.getTransactionById(Number(id));
    if (!currentTransaction) return errorResponse("Transação não encontrada", 404);

    const deleted = await transactionService.deleteTransaction(currentTransaction.id);
    if (!deleted) return errorResponse("Transação não encontrada", 404);
 
    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(currentTransaction.asset_id);
    await walletService.updateWalletData(updatedWalletData);

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /api/transactions/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
