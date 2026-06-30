import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  TCreateTransaction,
  TTransaction,
  type IfindAllTransactions,
} from "@/schemas/transactionSchema";

// ==================================================================================
//                                       SELECTS
// ==================================================================================
// Esta funÃ§Ã£o busca todas as transaÃ§Ãµes de um usuÃ¡rio especÃ­fico no banco de dados com base no ID do usuÃ¡rio fornecido, retornando um array de objetos representando cada transaÃ§Ã£o encontrada.
async function findAllTransactions(userId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE user_id = ? ORDER BY date DESC, id DESC",
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Erro em findAllTransactions:", error);
    throw new Error("Ocorreu um erro ao buscar transacoes");
  }
}
// Esta funÃ§Ã£o busca uma transaÃ§Ã£o especÃ­fica no banco de dados com base no ID do usuÃ¡rio e no ID da transaÃ§Ã£o fornecidos, retornando um array de objetos representando a transaÃ§Ã£o encontrada.
async function findTransactionById(
  userId: number,
  id: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId],
    );
    return rows;
  } catch (error) {
    console.error("Erro em findTransactionById:", error);
    throw new Error("Ocorreu um erro ao buscar transacao por id");
  }
}
// Esta funÃ§Ã£o busca todas as transaÃ§Ãµes de um usuÃ¡rio especÃ­fico no banco de dados com base nos argumentos fornecidos, retornando um array de objetos representando cada transaÃ§Ã£o encontrada. Os argumentos podem incluir o ID do usuÃ¡rio, a data de inÃ­cio, a data de tÃ©rmino, o tipo de entrada e o ID do tipo de ativo.
async function findAllTransactionsWithArgs(
  args: IfindAllTransactions,
): Promise<RowDataPacket[]> {
  try {
    const { query, params } = buildfindAllTransactionsQuery(args);

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar lista de transações:", error);
    throw error;
  }
}
// Esta função busca todas as transações de um usuário especí­fico no banco de dados com base no ID do usuário e no ID do ativo fornecidos, retornando um array de objetos representando cada transação encontrada.
async function findAllTransactionsByAssetId(
  userId: number,
  assetId: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transaction WHERE asset_id = ? AND user_id = ? ORDER BY date ASC",
      [assetId, userId],
    );
    return rows;
  } catch (error) {
    console.error("Erro em findAllTransactionsByAssetId:", error);
    throw new Error("Ocorreu um erro ao buscar transacoes por id do ativo");
  }
}

// ==================================================================================
//                                      INSERTS
// ==================================================================================
// Esta função cria uma nova entrada de transação no banco de dados com base no ID do usuário e nos dados da transação fornecidos, retornando o resultado da operação de inserção.
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
    console.error("Erro em createTransactionEntry:", error);
    throw new Error("Ocorreu um erro ao criar transacao entry");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza uma entrada de transação existente no banco de dados com base no ID do usuário e nos dados da transação fornecidos, retornando o resultado da operação de atualização.
async function updateTransaction(
  userId: number,
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
        WHERE id = ? AND user_id = ?`,
      [
        transactionData.asset_id,
        transactionData.entry_type,
        transactionData.date,
        transactionData.quantity,
        transactionData.unit_price,
        transactionData.total_value,
        transactionData.id,
        userId,
      ],
    );
    return result;
  } catch (error) {
    console.error("Erro em updateTransaction:", error);
    throw new Error("Ocorreu um erro ao atualizar transacao entry");
  }
}

// ==================================================================================
//                                        DELETES
// ==================================================================================
// Esta função exclui uma entrada de transação existente no banco de dados com base no ID do usuário e no ID da transação fornecidos, retornando o resultado da operação de exclusão.
async function deleteTransaction(
  userId: number,
  id: number,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM transaction WHERE id = ? AND user_id = ?`,
      [id, userId],
    );
    return result;
  } catch (error) {
    console.error("Erro em deleteTransaction:", error);
    throw new Error("Ocorreu um erro ao excluir transacao");
  }
}

const transactionRepository = {
  findAllTransactions,
  findTransactionById,
  findAllTransactionsWithArgs,
  findAllTransactionsByAssetId,
  createTransactionEntry,
  updateTransaction,
  deleteTransaction,
};
export default transactionRepository;

// ===================================================================================
//                            Helper Functions
// ===================================================================================
// Esta função constrói a consulta SQL e os parâmetros necessários para buscar transações com base nos argumentos fornecidos, retornando um objeto contendo a consulta e os parâmetros.
function buildfindAllTransactionsQuery(args: IfindAllTransactions): {
  query: string;
  params: string[];
} {
  const { userId, startDate, endDate, entryType, assetTypeId } = args;

  // Seleciona apenas colunas de transaction para evitar conflito de nomes com o JOIN
  let query = "SELECT t.* FROM transaction t";

  const params: string[] = [];
  const whereClauses: string[] = [];

  // Filtrar por userId é obrigatório para garantir que o usuário só veja suas próprias transações
  if (userId) {
    whereClauses.push("t.user_id = ?");
    params.push(userId.toString());
  }

  // Se filtrar por tipo de ativo, precisa JOIN com asset
  if (assetTypeId) {
    query += " INNER JOIN asset a ON a.id = t.asset_id";
    whereClauses.push("a.asset_type_id = ?");
    params.push(assetTypeId);
  }

  // filtro de compra ou venda (entryType)
  if (entryType) {
    whereClauses.push("t.entry_type = ?");
    params.push(entryType);
  }

  // filtro de data de iní­cio e fim, convertendo para string no formato YYYY-MM-DD
  if (startDate) {
    whereClauses.push(`t.date >= ?`);
    params.push(startDate.toISOString().slice(0, 10));
  }
  // filtro de data de fim, convertendo para string no formato YYYY-MM-DD
  if (endDate) {
    whereClauses.push(`t.date <= ?`);
    params.push(endDate.toISOString().slice(0, 10));
  }
  // Se houver cláusulas WHERE, adiciona à query
  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")} `;
  }

  query += ` ORDER BY t.date DESC, t.id DESC`;

  return { query, params };
}
