import { WalletListSchema, WalletSchema, type TWalletList, TWallet } from "@/schemas/walletSchema";
import { TTransactionList } from "@/schemas/transactionSchema";
import walletRepository from "@/app/api/_repositories/wallet.repository";
import assetRepository from "../_repositories/asset.repository";
import transactionService from "./transaction.service";

// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getAllWallets(): Promise<TWalletList> {
    try {
        const rows = await walletRepository.findAllWallets();

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
            console.log("Wallet List parsing error:", parsed.error);
            throw new Error("Invalid wallet data");
        }
        return parsed.data;
    } catch (error) {
        console.error("Error in findAllWallets:", error);
        throw new Error("An error occurred while fetching wallet data");
    }
}

async function getWalletByAssetId(assetId: number): Promise<TWallet> {
    try {
        const rows = await walletRepository.findWalletByAssetId(assetId);
        if (rows.length === 0) {
            throw new Error("No wallet found for the given asset id");
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
            wallet.initial_date = new Date(row.initial_date).toISOString().slice(0, 10);
        }

        const parsed = WalletSchema.safeParse(wallet);
        if (!parsed.success) {
            console.log("Wallet parsing error:", parsed.error);
            throw new Error("Invalid wallet data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error in getWalletById:", error);
        throw new Error("An error occurred while fetching wallet data");
    }
}

// ==================================================================================
//                              UPDATE SERVICES
// ==================================================================================
// Atualiza todos os campos de uma carteira específica
async function updateWalletData(walletData: TWallet): Promise<TWallet> {
    try {
        const result = await walletRepository.updateWalletData(walletData);
        if (!result || result.affectedRows === 0) {
            throw new Error("No wallet entry found for the given id");
        }

        const updatedWallet: TWallet = {
            ...walletData,
            updated_at: new Date().toISOString().slice(0, 10),
        }

        const parsed = WalletSchema.safeParse(updatedWallet);
        if (!parsed.success) {
            console.log("Updated Wallet parsing error:", parsed.error);
            throw new Error("Invalid updated wallet data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error in updateWalletData:", error);
        throw new Error("An error occurred while updating wallet data");
    }
}

// Atualiza apenas o Income para Renda Fixa
async function updateWalletIncome(walletId: number, income: number): Promise<boolean> {
    try {
        const result = await walletRepository.updateWalletIncome(walletId, income);
        return result && result.affectedRows > 0;
    } catch (error) {
        console.error("Error in updateWalletIncome:", error);
        throw new Error("An error occurred while updating wallet data");
    }
}

async function recalculateWalletByAsset(assetId: number): Promise<TWallet> {
    try {
        // Pegar a listagem de todas as transações ordenada por data da transação.
        const transactions = await transactionService.getAllTransactionsByAssetId(assetId);

        const assetType = await assetRepository.findAssetTypeByAssetId(assetId);
        if (!assetType || assetType.length === 0) {
            throw new Error("No asset type found for the given asset id");
        }

        const currentWallet = await getWalletByAssetId(assetId);

        const updatedWallet: TWallet = assetType[0].id === 3
            ? await recalculateFixedWallet(transactions, currentWallet)
            : await recalculateVariableWallet(transactions, currentWallet);

        const parsed = WalletSchema.safeParse(updatedWallet);
        if (!parsed.success) {
            console.log("Recalculated Wallet parsing error:", parsed.error);
            throw new Error("Invalid recalculated wallet data");
        }

        return parsed.data;

    } catch (error) {
        console.error("Error in recalculateWalletByAsset:", error);
        throw new Error("An error occurred while recalculating wallet data");
    }
}


const walletService = {
    getAllWallets,
    updateWalletData,
    updateWalletIncome,
    recalculateWalletByAsset
};
export default walletService;

// =========================================================================================================
//                              HELPER FUNCTIONS
// ========================================================================================================
async function recalculateFixedWallet(transactions: TTransactionList, wallet: TWallet): Promise<TWallet> {

    const updatedWallet: TWallet = { ...wallet };

    for (const transaction of transactions) {
        const transactionValue = transaction.total_value;
        if (transaction.entry_type === "buy") {
            updatedWallet.average_price += transactionValue;
            updatedWallet.total_invested += transactionValue;
        } else if (transaction.entry_type === "sell") {
            updatedWallet.average_price -= transactionValue;
            updatedWallet.total_invested -= transactionValue;
        }
    }

    const firstPurchase = transactions.find(t => t.entry_type === "buy");
    if (firstPurchase) {
        updatedWallet.initial_date = firstPurchase.date;
    }

    return updatedWallet;
}

async function recalculateVariableWallet(transactions: TTransactionList, wallet: TWallet): Promise<TWallet> {
    const updatedWallet: TWallet = { ...wallet };

    let purchaseValueSum: number = 0;
    let purchaseQuantitySum: number = 0;

    let avgPrice: number = 0;

    for (const transaction of transactions) {

        const total_value = transaction.total_value;

        // Atualizar a quantidade e o preco médio
        if (transaction.entry_type === "buy") {
            updatedWallet.quantity += transaction.quantity;

            purchaseValueSum += total_value;
            purchaseQuantitySum += transaction.quantity;
            avgPrice = purchaseValueSum / purchaseQuantitySum;

        } else if (transaction.entry_type === "sell") {
            updatedWallet.quantity -= transaction.quantity;
        }

        // Calcular o novo total investido
        updatedWallet.total_invested = updatedWallet.quantity * avgPrice;
    }

    return updatedWallet;
}

