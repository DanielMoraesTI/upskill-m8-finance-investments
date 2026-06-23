import { NextResponse } from "next/server";
import {
  updateTransactionEntry,
  deleteTransaction,
  findTransactionById,
} from "@/app/api/_repositories/transaction.repository";
import { recalculateWalletByAsset } from "@/app/api/_repositories/wallet.repository";

type RouteContext = { params: Promise<{ id: string }> };
// Esta função assíncrona lida com requisições PUT para o endpoint "/api/portal/transactions/:id". Ela atualiza os dados de uma transação específica, identificada pelo ID, e recalcula a carteira associada ao ativo da transação. Em caso de erros, ela captura e registra o erro, retornando uma resposta JSON com uma mensagem de erro apropriada e um status HTTP 400 ou 500, dependendo do tipo de erro.
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { entry_type, quantity, unit_price, total_value, date } = body;
    const transactionId = Number(id);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { message: "ID de transação inválido" },
        { status: 400 },
      );
    }

    const oldTransaction = await findTransactionById(transactionId);
    if (!oldTransaction) {
      return NextResponse.json(
        { message: "Transação não encontrada" },
        { status: 404 },
      );
    }

    await updateTransactionEntry(transactionId, {
      entry_type,
      quantity,
      unit_price,
      total_value,
      date,
    });

    try {
      await recalculateWalletByAsset(
        oldTransaction.user_id,
        oldTransaction.asset_id,
      );
    } catch (error) {
      // Restaura o estado antigo da transação se o recálculo violar regra de negócio.
      await updateTransactionEntry(transactionId, {
        entry_type: oldTransaction.entry_type,
        quantity: oldTransaction.quantity,
        unit_price: oldTransaction.unit_price,
        total_value: oldTransaction.total_value,
        date: oldTransaction.date,
      });
      await recalculateWalletByAsset(
        oldTransaction.user_id,
        oldTransaction.asset_id,
      );

      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível atualizar a transação",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Transação atualizada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT /api/transactions/:id:", error);
    return NextResponse.json(
      { message: "Erro ao processar a solicitação" },
      { status: 500 },
    );
  }
}
// Esta função assíncrona lida com requisições DELETE para o endpoint "/api/portal/transactions/:id". Ela deleta uma transação específica, identificada pelo ID, e recalcula a carteira associada ao ativo da transação. Em caso de erros, ela captura e registra o erro, retornando uma resposta JSON com uma mensagem de erro apropriada e um status HTTP 400 ou 500, dependendo do tipo de erro.
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const transactionId = Number(id);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { message: "ID de transação inválido" },
        { status: 400 },
      );
    }

    const currentTransaction = await findTransactionById(transactionId);
    if (!currentTransaction) {
      return NextResponse.json(
        { message: "Transação não encontrada" },
        { status: 404 },
      );
    }

    await deleteTransaction(transactionId);
    await recalculateWalletByAsset(
      currentTransaction.user_id,
      currentTransaction.asset_id,
    );

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /api/transactions/:id:", error);
    return NextResponse.json(
      { message: "Erro ao processar a solicitação" },
      { status: 500 },
    );
  }
}
