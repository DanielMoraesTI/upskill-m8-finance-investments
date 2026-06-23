import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  TCreateTransaction,
  TTransaction,
  TransactionSchema,
} from "@/schemas/transactionSchema";
import { z } from "zod";

type TTransactionDBRow = TTransaction & { user_id: number };
// Esta função assíncrona busca os dados de uma transação específica, identificada pelo ID, fazendo uma requisição ao banco de dados para obter os dados da tabela "transaction". Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando os dados da transação se a resposta for válida ou null se a transação não for encontrada ou em caso de erro.
function mapRowToTransaction(row: RowDataPacket): TTransaction {
  return {
    id: row.id,
    asset_id: row.asset_id,
    entry_type: row.entry_type,
    date: new Date(row.date).toISOString().slice(0, 10),
    quantity: Number(row.quantity),
    unit_price: Number(row.unit_price),
    total_value: Number(row.total_value),
    created_at: new Date(row.created_at).toISOString().slice(0, 10),
    updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
  };
}
// Esta função assíncrona busca os dados de uma transação específica, identificada pelo ID, fazendo uma requisição ao banco de dados para obter os dados da tabela "transaction". Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando os dados da transação se a resposta for válida ou null se a transação não for encontrada ou em caso de erro.
export async function findAllTransactions(): Promise<TTransaction[] | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM transaction");

    if (rows.length === 0) return null;

    const transactionList: TTransaction[] = rows.map((row) =>
      mapRowToTransaction(row),
    );

    const parsed = z.array(TransactionSchema).safeParse(transactionList);
    if (!parsed.success) {
      console.log(
        "Erros detalhados:",
        JSON.stringify(parsed.error.issues, null, 2),
      );
      console.log("Transaction List parsing error:", parsed.error);
      throw new Error("Invalid transaction data");
    }
    return parsed.data;
  } catch (error) {
    console.error("Error in findAllTransactions:", error);
    return null;
  }
}
// Esta função assíncrona cria uma nova transação no banco de dados com base nos dados fornecidos. Ela insere os dados da transação na tabela "transaction" e retorna o ID da transação criada. Em caso de erros, ela captura e registra o erro, lançando um erro apropriado.
export async function createTransactionEntry(
  userId: number,
  transactionData: TCreateTransaction,
): Promise<number> {
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

    return result.insertId;
  } catch (error) {
    console.error("Error in createTransactionEntry:", error);
    throw new Error("An error occurred while creating transaction entry");
  }
}
// Esta função assíncrona busca os dados de uma transação específica, identificada pelo ID, fazendo uma requisição ao banco de dados para obter os dados da tabela "transaction". Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando os dados da transação se a resposta for válida ou null se a transação não for encontrada ou em caso de erro.
export async function findTransactionById(
  id: number,
): Promise<TTransactionDBRow | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const mapped = {
      ...mapRowToTransaction(row),
      user_id: Number(row.user_id),
    };

    const parsed = TransactionSchema.safeParse(mapped);
    if (!parsed.success) {
      throw new Error("Invalid transaction data");
    }

    return {
      ...parsed.data,
      user_id: mapped.user_id,
    };
  } catch (error) {
    console.error("Error in findTransactionById:", error);
    throw new Error("An error occurred while finding transaction entry");
  }
}
// Esta função assíncrona atualiza os dados de uma transação específica, identificada pelo ID, com base nos dados fornecidos. Ela constrói dinamicamente a consulta SQL para atualizar apenas os campos fornecidos e trata erros de rede, lançando erros apropriados em caso de falha.
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
// Esta função assíncrona deleta uma transação específica, identificada pelo ID, enviando uma requisição DELETE para o endpoint "/portal/transactions/{id}". Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function deleteTransaction(id: number): Promise<void> {
  try {
    await db.query(`DELETE FROM transaction WHERE id = ?`, [id]);
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    throw new Error("An error occurred while deleting transaction");
  }
}
