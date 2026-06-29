import {
  TCreateTransaction,
  TransactionSchema,
  TransactionListSchema,
  type TTransactionList,
  TTransaction,
  IfindAllTransactions,
} from "@/schemas/transactionSchema";
import transactionRepository from "@/app/api/_repositories/transaction.repository";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateOnlyString(value: unknown): string {
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (value.includes("T")) return value.split("T")[0] || "";
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function getTodayLocalDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getAllTransactions(userId: number): Promise<TTransactionList> {
  try {
    const rows = await transactionRepository.findAllTransactions(userId);

    if (rows.length === 0) return [];

    const transactionList: TTransactionList = rows.map((row) => ({
      id: row.id,
      asset_id: row.asset_id,
      entry_type: row.entry_type,
      date: toDateOnlyString(row.date),
      quantity: Number(row.quantity),
      unit_price: Number(row.unit_price),
      total_value: Number(row.total_value),
      created_at: toDateOnlyString(row.created_at),
      updated_at: toDateOnlyString(row.updated_at),
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
  userId: number,
  id: number,
): Promise<TTransaction | null> {
  try {
    const rows = await transactionRepository.findTransactionById(userId, id);

    if (rows.length === 0) return null;

    const row = rows[0];
    const transaction: unknown = {
      id: row?.id || null,
      asset_id: row?.asset_id || null,
      entry_type: row?.entry_type || null,
      date: toDateOnlyString(row.date),
      quantity: Number(row.quantity),
      unit_price: Number(row.unit_price),
      total_value: Number(row.total_value),
      created_at: toDateOnlyString(row.created_at),
      updated_at: toDateOnlyString(row.updated_at),
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

async function getAllTransactionsWithArgs(
  args: IfindAllTransactions,
): Promise<TTransactionList> {
  try {
    const rows = await transactionRepository.findAllTransactionsWithArgs(args);
    if (rows.length === 0) return [];

    const transactionList: TTransactionList = rows.map((row) => ({
      id: row.id,
      asset_id: row.asset_id,
      entry_type: row.entry_type,
      date: toDateOnlyString(row.date),
      quantity: Number(row.quantity),
      unit_price: Number(row.unit_price),
      total_value: Number(row.total_value),
      created_at: toDateOnlyString(row.created_at),
      updated_at: toDateOnlyString(row.updated_at),
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

async function getAllTransactionsByAssetId(
  userId: number,
  assetId: number,
): Promise<TTransactionList> {
  try {
    const rows = await transactionRepository.findAllTransactionsByAssetId(
      userId,
      assetId,
    );
    if (rows.length === 0) return [];

    const transactionList: TTransactionList = rows.map((row) => ({
      id: row.id,
      asset_id: row.asset_id,
      entry_type: row.entry_type,
      date: toDateOnlyString(row.date),
      quantity: Number(row.quantity),
      unit_price: Number(row.unit_price),
      total_value: Number(row.total_value),
      created_at: toDateOnlyString(row.created_at),
      updated_at: toDateOnlyString(row.updated_at),
    }));

    const parsed = TransactionListSchema.safeParse(transactionList);
    if (!parsed.success) {
      console.log("Transaction List parsing error:", parsed.error);
      throw new Error("Invalid transaction list data");
    }

    return parsed.data;
  } catch (error) {
    console.error("Error fetching transactions by asset ID:", error);
    throw new Error(
      "An error occurred while fetching transactions by asset ID",
    );
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
    const result = await transactionRepository.createTransactionEntry(
      userId,
      transactionData,
    );
    if (!result || result.affectedRows === 0) {
      throw new Error("Failed to create transaction entry");
    }

    const transaction: TTransaction = {
      ...transactionData,
      id: result.insertId,
      created_at: getTodayLocalDate(),
      updated_at: getTodayLocalDate(),
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
  userId: number,
  transactionData: TTransaction,
): Promise<TTransaction> {
  try {
    const result = await transactionRepository.updateTransaction(
      userId,
      transactionData,
    );
    if (!result || result.affectedRows === 0) {
      throw new Error("Failed to update transaction entry");
    }

    const updatedTransaction: TTransaction = {
      ...transactionData,
      updated_at: getTodayLocalDate(), // Atualiza a data de atualização para o momento atual sem deslocamento de timezone
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
async function deleteTransaction(userId: number, id: number): Promise<boolean> {
  try {
    const result = await transactionRepository.deleteTransaction(userId, id);
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
  deleteTransaction,
};
export default transactionService;
