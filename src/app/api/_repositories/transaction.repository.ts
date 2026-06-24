import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  TCreateTransaction,
  TTransaction,
  type IfindAllTransactions
} from "@/schemas/transactionSchema";

// ==================================================================================
//                                       SELECTS
// ==================================================================================
async function findAllTransactions(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM transaction");
    return rows;
  } catch (error) {
    console.error("Error in findAllTransactions:", error);
    throw new Error("An error occurred while fetching transactions");
  }
}

async function findTransactionById(
  id: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE id = ? LIMIT 1",
      [id],
    );
    return rows;
  } catch (error) {
    console.error("Error in findTransactionById:", error);
    throw new Error("An error occurred while fetching transaction by ID");
  }
}

async function findAllTransactionsWithArgs(args: IfindAllTransactions): Promise<RowDataPacket[]> {
  try {
    const { query, params } = buildfindAllTransactionsQuery(args);

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows;
  } catch (error) {
    console.error("Error fetching transaction list:", error);
    throw error;
  }
}

async function findAllTransactionsByAssetId(assetId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE asset_id = ? ORDER BY date ASC",
      [assetId],
    );
    return rows;
  } catch (error) {
    console.error("Error in findAllTransactionsByAssetId:", error);
    throw new Error("An error occurred while fetching transactions by asset ID");
  }
}

// ==================================================================================
//                                      INSERTS
// ==================================================================================
async function createTransactionEntry(
  userId: number,
  transactionData: TCreateTransaction,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO transaction (user_id, asset_id, entry_type, date, quantity, unit_price, total_value)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        transactionData.asset_id,
        transactionData.entry_type,
        transactionData.date,
        transactionData.quantity,
        transactionData.unit_price,
        transactionData.total_value,
      ],
    );

    return result;
  } catch (error) {
    console.error("Error in createTransactionEntry:", error);
    throw new Error("An error occurred while creating transaction entry");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
async function updateTransaction(
  transactionData: TTransaction,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE transaction SET
        asset_id = ?,
        entry_type = ?,
        date = ?,
        quantity = ?,
        unit_price = ?,
        total_value = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`, [
      transactionData.asset_id,
      transactionData.entry_type,
      transactionData.date,
      transactionData.quantity,
      transactionData.unit_price,
      transactionData.total_value,
      String(transactionData.id)
    ]);
    return result;
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    throw new Error("An error occurred while updating transaction entry");
  }
}

// ==================================================================================
//                                        DELETES
// ==================================================================================
async function deleteTransaction(id: number): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM transaction WHERE id = ?`, [id]);
    return result;
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    throw new Error("An error occurred while deleting transaction");
  }
}


const transactionRepository = {
  findAllTransactions,
  findTransactionById,
  findAllTransactionsWithArgs,
  findAllTransactionsByAssetId,
  createTransactionEntry,
  updateTransaction,
  deleteTransaction
};
export default transactionRepository;

// ===================================================================================
//                            Helper Functions
// ===================================================================================
function buildfindAllTransactionsQuery(args: IfindAllTransactions): { query: string; params: string[] } {
  const { startDate, endDate, entryType, assetTypeId } = args;

  // Seleciona apenas colunas de transaction para evitar conflito de nomes com o JOIN
  let query = "SELECT t.* FROM transaction t";

  const params: string[] = [];
  const whereClauses: string[] = [];

  // Se filtrar por tipo de ativo, precisa JOIN com asset
  if (assetTypeId) {
    query += " INNER JOIN asset a ON a.id = t.asset_id";
    whereClauses.push("a.asset_type_id = ?");
    params.push(assetTypeId);
  }

  // buy / sell filter
  if (entryType) {
    whereClauses.push("t.entry_type = ?");
    params.push(entryType);
  }

  // date range filter
  if (startDate) {
    whereClauses.push(`t.date >= ?`);
    params.push(startDate.toISOString().slice(0, 10));
  }

  if (endDate) {
    whereClauses.push(`t.date <= ?`);
    params.push(endDate.toISOString().slice(0, 10));
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  query += ` ORDER BY t.updated_at DESC`;

  return { query, params };
}