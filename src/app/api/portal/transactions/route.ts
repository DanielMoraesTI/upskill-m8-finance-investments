import { NextRequest, NextResponse } from "next/server";
import {
  TransactionListResponseSchema,
  CreateTransactionSchema,
  TTransactionListResponse,
} from "@/schemas/transactionSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import transactionService from "@/app/api/_services/transaction.service";
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
): Promise<number> {
  const transactionList = await transactionService.getAllTransactionsByAssetId(
    userId,
    assetId,
  );

  let availableQuantity = 0;
  for (const transaction of transactionList) {
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
// Esta função assíncrona processa as requisições GET para o endpoint "/api/portal/transactions", permitindo que o usuário autorizado obtenha a lista de todas as transações associadas à sua conta. Ela valida o ID do usuário, trata erros de rede e retorna respostas apropriadas em caso de falha.
export async function GET(request: NextRequest) {
  try {
    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const transactionList = await transactionService.getAllTransactions(
      authorizedUser.id,
    );
    const response: TTransactionListResponse = { transactionList };
    const parsed = TransactionListResponseSchema.safeParse(response);
    if (!parsed.success) {
      console.error("Transaction List Response parsing error:", parsed.error);
      return errorResponse("Erro ao processar a solicitação", 500);
    }

    return NextResponse.json(
      { transactionList: parsed.data.transactionList },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
// Esta função assíncrona processa as requisições POST para o endpoint "/api/portal/transactions", permitindo que o usuário autorizado crie uma nova transação associada à sua conta. Ela valida o ID do usuário, o corpo da requisição, verifica a quantidade disponível para venda de ativos variáveis e recalcula o saldo da carteira associada ao ativo da transação após a criação, retornando respostas apropriadas em caso de falha.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const parsed = CreateTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Dados de transação inválidos", 400);
    }

    const isSellOperation = parsed.data.entry_type === "sell";
    if (isSellOperation && (await isVariableAsset(parsed.data.asset_id))) {
      const availableQuantity = await getAvailableQuantityFromTransactions(
        authorizedUser.id,
        parsed.data.asset_id,
      );
      const sellQuantity = Math.abs(Number(parsed.data.quantity));

      if (sellQuantity > availableQuantity) {
        return errorResponse("Quantidade de venda maior que a disponível", 400);
      }
    }

    const createdTransaction = await transactionService.createTransaction(
      authorizedUser.id,
      parsed.data,
    );

    await updateCurrentPriceForVariableAsset(
      parsed.data.asset_id,
      Number(parsed.data.unit_price),
    );

    // Recalcular o saldo da carteira associada ao ativo da transação
    const updatedWalletData = await walletService.recalculateWalletByAsset(
      authorizedUser.id,
      parsed.data.asset_id,
    );
    await walletService.updateWalletData(authorizedUser.id, updatedWalletData);

    return NextResponse.json(
      { transaction: createdTransaction },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
