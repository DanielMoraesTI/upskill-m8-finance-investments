import {
    TCreateTransaction,
    TransactionSchema,
    TransactionListSchema, type TTransactionList, TTransaction, IfindAllTransactions
} from "@/schemas/transactionSchema";
import transactionRepository from "@/app/api/_repositories/transaction.repository";

// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getAllTransactions(): Promise<TTransactionList> {
    try {
        const rows = await transactionRepository.findAllTransactions();

        if (rows.length === 0) return [];

        const transactionList: TTransactionList = rows.map((row) => ({
            id: row.id,
            asset_id: row.asset_id,
            entry_type: row.entry_type,
            date: new Date(row.date).toISOString().slice(0, 10),
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
            total_value: Number(row.total_value),
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        const parsed = TransactionListSchema.safeParse(transactionList);
        if (!parsed.success) {
            console.log("Transaction List parsing error:", parsed.error);
            throw new Error("Invalid transaction data");
        }
        
        return parsed.data;
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        throw error;
    }
}

async function getTransactionById(
    id: number,
): Promise<TTransaction | null> {
    try {
        const rows = await transactionRepository.findTransactionById(id);

        if (rows.length === 0) return null;

        const row = rows[0];
        const transaction: unknown = {
            id: row?.id || null,
            asset_id: row?.asset_id || null,
            entry_type: row?.entry_type || null,
            date: new Date(row.date).toISOString().slice(0, 10),
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
            total_value: Number(row.total_value),
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        };

        const parsed = TransactionSchema.safeParse(transaction);
        if (!parsed.success) {
            throw new Error("Invalid transaction data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error in getTransactionById:", error);
        throw new Error("An error occurred while finding transaction entry");
    }
}

async function getAllTransactionsWithArgs(args: IfindAllTransactions): Promise<TTransactionList> {
    try {
        const rows = await transactionRepository.findAllTransactionsWithArgs(args);
        if (rows.length === 0) return [];

        const transactionList: TTransactionList = rows.map((row) => ({
            id: row.id,
            asset_id: row.asset_id,
            entry_type: row.entry_type,
            date: new Date(row.date).toISOString().slice(0, 10),
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
            total_value: Number(row.total_value),
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        const parsed = TransactionListSchema.safeParse(transactionList);
        if (!parsed.success) {
            console.log("Transaction List parsing error:", parsed.error);
            throw new Error("Invalid transaction list data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching transaction list:", error);
        throw error;
    }
}

async function getAllTransactionsByAssetId(assetId: number): Promise<TTransactionList> {
    try {
        const rows = await transactionRepository.findAllTransactionsByAssetId(assetId);
        if (rows.length === 0) return [];

        const transactionList: TTransactionList = rows.map((row) => ({
            id: row.id,
            asset_id: row.asset_id,
            entry_type: row.entry_type,
            date: new Date(row.date).toISOString().slice(0, 10),
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
            total_value: Number(row.total_value),
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        const parsed = TransactionListSchema.safeParse(transactionList);
        if (!parsed.success) {
            console.log("Transaction List parsing error:", parsed.error);
            throw new Error("Invalid transaction list data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching transactions by asset ID:", error);
        throw new Error("An error occurred while fetching transactions by asset ID");
    }
}

// ==================================================================================
//                              POST SERVICES
// ==================================================================================
async function createTransaction(
    userId: number,
    transactionData: TCreateTransaction,
): Promise<TTransaction> {
    try {
        const result = await transactionRepository.createTransactionEntry(userId, transactionData);
        if (!result || result.affectedRows === 0) {
            throw new Error("Failed to create transaction entry");
        }

        const transaction: TTransaction = {
            ...transactionData,
            id: result.insertId,
            created_at: new Date().toISOString().slice(0, 10),
            updated_at: new Date().toISOString().slice(0, 10),
        };

        const parsed = TransactionSchema.safeParse(transaction);
        if (!parsed.success) {
            console.log("Transaction parsing error:", parsed.error);
            throw new Error("Invalid transaction data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error in createTransactionEntry:", error);
        throw new Error("An error occurred while creating transaction entry");
    }
}


// ==================================================================================
//                              UPDATE SERVICES
// ==================================================================================
async function updateTransaction(
    transactionData: TTransaction,
): Promise<TTransaction> {
    try {
        const result = await transactionRepository.updateTransaction(transactionData);
        if (!result || result.affectedRows === 0) {
            throw new Error("Failed to update transaction entry");
        }

        const updatedTransaction: TTransaction = {
            ...transactionData,
            updated_at: new Date().toISOString().slice(0, 10), // Atualiza a data de atualização para o momento atual como ISO para não precisar buscar novamente
        };

        const parsed = TransactionSchema.safeParse(updatedTransaction);
        if (!parsed.success) {
            console.log("Transaction parsing error:", parsed.error);
            throw new Error("Invalid transaction data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error in updateTransaction:", error);
        throw new Error("An error occurred while updating transaction entry");
    }
}

// ==================================================================================
//                              DELETE SERVICES
// ==================================================================================
async function deleteTransaction(
    id: number,
): Promise<boolean> {
    try {
        const result = await transactionRepository.deleteTransaction(id);
        if (!result || result.affectedRows === 0) {
            throw new Error("Failed to delete transaction entry");
        }

        return true;
    } catch (error) {
        console.error("Error in deleteTransaction:", error);
        throw new Error("An error occurred while deleting transaction entry");
    }
}


const transactionService = {
    getAllTransactions,
    getTransactionById,
    getAllTransactionsWithArgs,
    getAllTransactionsByAssetId,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
export default transactionService;