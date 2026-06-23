import db from "@/app/api/_lib/db";
import { RowDataPacket } from "mysql2";
import { TTransaction, TransactionSchema } from "@/schemas/transactionSchema";
import { z } from "zod";

export async function findAllTransactions(): Promise<TTransaction[] | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM transaction");

    if (rows.length === 0) return null;

    const transactionList: TTransaction[] = rows.map((row) => ({
      id: row.id,
      asset_id: row.asset_id,
      entry_type: row.entry_type,
      date: new Date(row.date).toISOString().slice(0, 10),
      quantity: row.quantity,
      unit_price: row.unit_price,
      total_value: row.total_value,
      created_at: new Date(row.created_at).toISOString().slice(0, 10),
      updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
    }));


    const parsed = z.array(TransactionSchema).safeParse(transactionList);
    if (!parsed.success) {
        console.log("Erros detalhados:", JSON.stringify(parsed.error.issues, null, 2));
      console.log("Transaction List parsing error:", parsed.error);
      throw new Error("Invalid transaction data");
    }
    return parsed.data;
  } catch (error) {
    console.error("Error in findAllTransactions:", error);
    return null;
  }
}

export async function updateTransactionEntry(
  id: number,
  transactionData: Partial<
    Omit<TTransaction, "id" | "created_at" | "updated_at">
  >,
): Promise<void> {
  try {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(transactionData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    await db.query(
      `UPDATE transaction SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  } catch (error) {
    console.error("Error in updateTransactionEntry:", error);
    throw new Error("An error occurred while updating transaction entry");
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  try {
    await db.query(`DELETE FROM transaction WHERE id = ?`, [id]);
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    throw new Error("An error occurred while deleting transaction");
  }
}
