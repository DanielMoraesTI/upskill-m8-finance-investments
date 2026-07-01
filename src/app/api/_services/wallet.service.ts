import {
  WalletListSchema,
  WalletSchema,
  type TWalletList,
  TWallet,
} from "@/schemas/walletSchema";
import { TTransactionList } from "@/schemas/transactionSchema";
import walletRepository from "@/app/api/_repositories/wallet.repository";
import assetRepository from "../_repositories/asset.repository";
import transactionService from "./transaction.service";

// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getAllWallets(userId: number): Promise<TWalletList> {
  try {
    const rows = await walletRepository.findAllWallets(userId);

    if (rows.length === 0) return [];

    const walletList: TWalletList = rows.map((row) => ({
      id: row.id,
      asset_id: row.asset_id,
      quantity: row.quantity,
      average_price: row.average_price,
      total_invested: row.total_invested,
      income: row.income !== null && row.income !== undefined ? row.income : 0,
      initial_date: row.initial_date
        ? new Date(row.initial_date).toISOString().slice(0, 10)
        : undefined,
      created_at: new Date(row.created_at).toISOString().slice(0, 10),
      updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
    }));

    const parsed = WalletListSchema.safeParse(walletList);
    if (!parsed.success) {
      console.log("Erro ao validar lista da carteira:", parsed.error);
      throw new Error("Dados da carteira inválidos");
    }
    return parsed.data;
  } catch (error) {
    console.error("Erro em findAllWallets:", error);
    throw new Error("Ocorreu um erro ao buscar dados da carteira");
  }
}

async function getWalletByAssetId(
  userId: number,
  assetId: number,
): Promise<TWallet> {
  try {
    const rows = await walletRepository.findWalletByAssetId(userId, assetId);
    if (rows.length === 0) {
      throw new Error(
        "Nenhuma carteira encontrada para o id do ativo informado",
      );
    }

    const row = rows[0];
    const wallet: TWallet = {
      id: row.id,
      asset_id: row.asset_id,
      quantity: row.quantity,
      average_price: row.average_price,
      total_invested: row.total_invested,
      created_at: new Date(row.created_at).toISOString().slice(0, 10),
      updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
    };
    if (row.income !== null && row.income !== undefined) {
      wallet.income = row.income;
    }

    if (row.initial_date !== null && row.initial_date !== undefined) {
      wallet.initial_date = new Date(row.initial_date)
        .toISOString()
        .slice(0, 10);
    }

    const parsed = WalletSchema.safeParse(wallet);
    if (!parsed.success) {
      console.log("Erro ao validar carteira:", parsed.error);
      throw new Error("Dados da carteira inválidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em getWalletById:", error);
    throw new Error("Ocorreu um erro ao buscar dados da carteira");
  }
}

async function ensureWalletByAsset(
  userId: number,
  assetId: number,
): Promise<TWallet> {
  const existingRows = await walletRepository.findWalletByAssetId(
    userId,
    assetId,
  );
  if (existingRows.length === 0) {
    await walletRepository.createWalletEntry(userId, assetId);
  }

  return getWalletByAssetId(userId, assetId);
}

// ==================================================================================
//                              UPDATE SERVICES
// ==================================================================================
// Atualiza todos os campos de uma carteira especí­fica
async function updateWalletData(
  userId: number,
  walletData: TWallet,
): Promise<TWallet> {
  try {
    const result = await walletRepository.updateWalletData(userId, walletData);
    if (!result || result.affectedRows === 0) {
      throw new Error(
        "Nenhum registro de carteira encontrado para o id informado",
      );
    }

    const updatedWallet: TWallet = {
      ...walletData,
      updated_at: new Date().toISOString().slice(0, 10),
    };

    const parsed = WalletSchema.safeParse(updatedWallet);
    if (!parsed.success) {
      console.log("Erro ao validar carteira atualizada:", parsed.error);
      throw new Error("Dados atualizados da carteira inválidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em updateWalletData:", error);
    throw new Error("Ocorreu um erro ao atualizar dados da carteira");
  }
}

// Atualiza apenas o Income para Renda Fixa
async function updateWalletIncome(
  userId: number,
  walletId: number,
  income: number,
): Promise<boolean> {
  try {
    const result = await walletRepository.updateWalletIncome(
      userId,
      walletId,
      income,
    );
    return result && result.affectedRows > 0;
  } catch (error) {
    console.error("Erro em updateWalletIncome:", error);
    throw new Error("Ocorreu um erro ao atualizar dados da carteira");
  }
}

async function recalculateWalletByAsset(
  userId: number,
  assetId: number,
): Promise<TWallet> {
  try {
    // Pegar a listagem de todas as transações ordenada por data da transação.
    const transactions = await transactionService.getAllTransactionsByAssetId(
      userId,
      assetId,
    );

    const assetType = await assetRepository.findAssetTypeByAssetId(assetId);
    if (!assetType || assetType.length === 0) {
      throw new Error("Nenhum tipo de ativo encontrado para o id informado");
    }

    const currentWallet = await ensureWalletByAsset(userId, assetId);

    const updatedWallet: TWallet =
      assetType[0].id === 3
        ? await recalculateFixedWallet(transactions, currentWallet)
        : await recalculateVariableWallet(transactions, currentWallet);

    const parsed = WalletSchema.safeParse(updatedWallet);
    if (!parsed.success) {
      console.log("Erro ao validar carteira recalculada:", parsed.error);
      throw new Error("Dados recalculados da carteira inválidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em recalculateWalletByAsset:", error);
    throw new Error("Ocorreu um erro ao recalcular dados da carteira");
  }
}

const walletService = {
  getAllWallets,
  updateWalletData,
  updateWalletIncome,
  ensureWalletByAsset,
  recalculateWalletByAsset,
};
export default walletService;

// =========================================================================================================
//                              HELPER FUNCTIONS
// ========================================================================================================
async function recalculateFixedWallet(
  transactions: TTransactionList,
  wallet: TWallet,
): Promise<TWallet> {
  const updatedWallet: TWallet = { ...wallet };

  let totalInvested = 0;
  let firstPurchaseDate: string | undefined;

  for (const transaction of transactions) {
    const transactionValue = Math.abs(Number(transaction.total_value));

    if (transaction.entry_type === "buy") {
      totalInvested += transactionValue;
      if (!firstPurchaseDate) {
        firstPurchaseDate = transaction.date;
      }
      continue;
    }

    totalInvested -= transactionValue;
  }

  updatedWallet.total_invested = Math.max(totalInvested, 0);
  updatedWallet.average_price = Math.max(totalInvested, 0);
  updatedWallet.initial_date = firstPurchaseDate;

  return updatedWallet;
}

async function recalculateVariableWallet(
  transactions: TTransactionList,
  wallet: TWallet,
): Promise<TWallet> {
  const updatedWallet: TWallet = { ...wallet };

  let currentQuantity = 0;
  let totalInvested = 0;

  let purchaseValueSum = 0;
  let purchaseQuantitySum = 0;

  for (const transaction of transactions) {
    const quantity = Math.abs(Number(transaction.quantity));
    const totalValue = Math.abs(Number(transaction.total_value));

    if (transaction.entry_type === "buy") {
      currentQuantity += quantity;
      totalInvested += totalValue;

      // Preço médio por compras: considera somente transações de compra.
      purchaseQuantitySum += quantity;
      purchaseValueSum += totalValue;
      continue;
    }

    if (currentQuantity <= 0) {
      continue;
    }

    const soldQuantity = Math.min(quantity, currentQuantity);
    const currentAverageCost = totalInvested / currentQuantity;

    currentQuantity -= soldQuantity;
    totalInvested -= currentAverageCost * soldQuantity;
  }

  if (currentQuantity <= 1e-8 || totalInvested <= 1e-8) {
    currentQuantity = 0;
    totalInvested = 0;
  }

  updatedWallet.quantity = Math.max(currentQuantity, 0);
  updatedWallet.total_invested = Math.max(totalInvested, 0);
  updatedWallet.average_price =
    purchaseQuantitySum > 0 ? purchaseValueSum / purchaseQuantitySum : 0;

  return updatedWallet;
}
