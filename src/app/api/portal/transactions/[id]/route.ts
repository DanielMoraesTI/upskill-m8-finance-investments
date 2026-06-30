import { NextRequest, NextResponse } from "next/server";
import transactionService from "@/app/api/_services/transaction.service";
import { UpdateTransactionRequestSchema } from "@/schemas/transactionSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import walletService from "@/app/api/_services/wallet.service";
import userService from "@/app/api/_services/user.service";
import assetRepository from "@/app/api/_repositories/asset.repository";
// Esta função assíncrona obtém o ID do tipo de ativo para um ativo específico, consultando o banco de dados. Ela recebe o ID do ativo como parâmetro e retorna o ID do tipo de ativo correspondente como um número.
async function getAssetTypeId(assetId: number): Promise<number> {
  const assetType = await assetRepository.findAssetTypeByAssetId(assetId);
  return Number(assetType?.[0]?.id || 0);
}
// Esta função assíncrona verifica se um ativo específico, identificado pelo ID, é do tipo variável (ações ou fundos imobiliários) consultando o tipo de ativo no banco de dados. Ela retorna um valor booleano indicando se o ativo é variável ou não.
async function isVariableAsset(assetId: number): Promise<boolean> {
  const assetTypeId = await getAssetTypeId(assetId);
  return assetTypeId === 1 || assetTypeId === 2;
}
// Esta função assíncrona calcula a quantidade disponível de um ativo específico para um usuário, considerando todas as transações realizadas, exceto uma transação específica a ser ignorada (caso fornecida). Ela retorna a quantidade disponível como um número, garantindo que não seja negativa.
async function getAvailableQuantityFromTransactions(
  userId: number,
  assetId: number,
  ignoreTransactionId?: number,
): Promise<number> {
  const transactionList = await transactionService.getAllTransactionsByAssetId(
    userId,
    assetId,
  );

  let availableQuantity = 0;
  for (const transaction of transactionList) {
    if (ignoreTransactionId && transaction.id === ignoreTransactionId) {
      continue;
    }

    const quantity = Math.abs(Number(transaction.quantity));
    if (transaction.entry_type === "buy") {
      availableQuantity += quantity;
      continue;
    }

    availableQuantity -= quantity;
  }

  return Math.max(availableQuantity, 0);
}
// Esta função assíncrona atualiza o preço atual de um ativo variável (ações ou fundos imobiliários) no banco de dados, caso o ativo seja do tipo variável. Ela recebe o ID do ativo e o novo preço unitário como parâmetros e realiza a atualização apenas se o ativo for do tipo variável.
async function updateCurrentPriceForVariableAsset(
  assetId: number,
  unitPrice: number,
) {
  const assetTypeId = await getAssetTypeId(assetId);

  if (assetTypeId === 1 || assetTypeId === 2) {
    await assetRepository.updateAssetCurrentPrice(assetId, unitPrice);
  }
}
// Esta função assíncrona processa as requisições PUT para o endpoint "/api/portal/transactions/[id]", permitindo que o usuário autorizado atualize os dados de uma transação específica com base no ID fornecido. Ela valida o ID do usuário, o corpo da requisição, verifica a quantidade disponível para venda de ativos variáveis e recalcula o saldo da carteira associada ao ativo da transação após a atualização, retornando respostas apropriadas em caso de falha.
export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/transactions/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const transactionId = Number(id);

    if (Number.isNaN(transactionId)) {
      return errorResponse("ID de transação inválido", 400);
    }

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const currentParsed = UpdateTransactionRequestSchema.safeParse(body);
    if (!currentParsed.success) {
      return errorResponse("Dados de transação inválidos", 400);
    }

    const transactionToUpdate = {
      ...currentParsed.data.transaction,
      id: transactionId,
    };

    const currentTransaction = await transactionService.getTransactionById(
      authorizedUser.id,
      transactionId,
    );
    if (!currentTransaction) {
      return errorResponse("Transação não encontrada", 404);
    }

    const isVariable = await isVariableAsset(transactionToUpdate.asset_id);
    const isSellOperation = transactionToUpdate.entry_type === "sell";
    if (isVariable && isSellOperation) {
      const availableQuantity = await getAvailableQuantityFromTransactions(
        authorizedUser.id,
        transactionToUpdate.asset_id,
        currentTransaction.asset_id === transactionToUpdate.asset_id
          ? currentTransaction.id
          : undefined,
      );

      const sellQuantity = Math.abs(Number(transactionToUpdate.quantity));
      if (sellQuantity > availableQuantity) {
        return errorResponse("Quantidade de venda maior que a disponível", 400);
      }
    }

    // Chamar o serviço para atualizar os dados da transação no DB
    const updatedTransaction = await transactionService.updateTransaction(
      authorizedUser.id,
      transactionToUpdate,
    );

    await updateCurrentPriceForVariableAsset(
      transactionToUpdate.asset_id,
      Number(transactionToUpdate.unit_price),
    );

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(
      authorizedUser.id,
      transactionToUpdate.asset_id,
    );
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);

    return NextResponse.json(
      { transaction: updatedTransaction },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro em PUT /api/transactions/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
// Esta função assíncrona processa as requisições DELETE para o endpoint "/api/portal/transactions/[id]", permitindo que o usuário autorizado exclua uma transação específica com base no ID fornecido. Ela valida o ID do usuário, trata erros de rede e retorna respostas apropriadas em caso de falha.
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/transactions/[id]">,
) {
  try {
    const { id } = await ctx.params;

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const currentTransaction = await transactionService.getTransactionById(
      authorizedUser.id,
      Number(id),
    );
    if (!currentTransaction)
      return errorResponse("Transação não encontrada", 404);

    const deleted = await transactionService.deleteTransaction(
      authorizedUser.id,
      currentTransaction.id,
    );
    if (!deleted) return errorResponse("Transação não encontrada", 404);

    const updatedWalletData = await walletService.recalculateWalletByAsset(
      authorizedUser.id,
      currentTransaction.asset_id,
    );
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro em DELETE /api/transactions/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
