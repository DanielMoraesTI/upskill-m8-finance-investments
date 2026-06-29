import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { TWallet } from "@/schemas/walletSchema";

// ==================================================================================
//                                       SELECTS
// ==================================================================================
// Esta função busca todas as carteiras de um usuário específico no banco de dados com base no ID do usuário fornecido, retornando um array de objetos representando cada carteira encontrada.
async function findAllWallets(userId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM wallet WHERE user_id = ?",
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Error in findAllWallets:", error);
    throw new Error("An error occurred while fetching wallet data");
  }
}
// Esta função busca uma carteira específica de um usuário no banco de dados com base no ID do usuário e no ID do ativo fornecidos, retornando um array de objetos representando a carteira encontrada.
async function findWalletByAssetId(
  userId: number,
  assetId: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM wallet WHERE user_id = ? AND asset_id = ? LIMIT 1",
      [userId, assetId],
    );
    return rows;
  } catch (error) {
    console.error("Error in findWalletByAssetId:", error);
    throw new Error("An error occurred while fetching wallet by asset ID");
  }
}
// ==================================================================================
//                                       INSERTS
// ==================================================================================
// Esta função cria uma nova entrada de carteira no banco de dados com base no ID do usuário e no ID do ativo fornecidos, retornando o resultado da operação de inserção.
async function createWalletEntry(
  userId: number,
  assetId: number,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO wallet (user_id, asset_id, quantity, average_price, total_invested, income, initial_date)
       VALUES (?, ?, 0, 0, 0, 0, NULL)
       ON DUPLICATE KEY UPDATE id = id`,
      [userId, assetId],
    );
    return result;
  } catch (error) {
    console.error("Error in createWalletEntry:", error);
    throw new Error("An error occurred while creating wallet entry");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza os dados de uma carteira específica no banco de dados com base no ID do usuário e nos dados da carteira fornecidos, retornando o resultado da operação de atualização.
async function updateWalletData(
  userId: number,
  walletData: TWallet,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE wallet
       SET quantity = ?,
            average_price = ?,
            total_invested = ?,
            income = ?,
            initial_date = ?,
            updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        walletData.quantity,
        walletData.average_price,
        walletData.total_invested,
        walletData.income,
        walletData.initial_date,
        walletData.id,
        userId,
      ],
    );
    return result;
  } catch (error) {
    console.error("Error in updateWalletData:", error);
    throw new Error("An error occurred while updating wallet entry");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza a renda de uma carteira específica no banco de dados com base no ID do usuário, no ID da carteira e na nova renda fornecidos, retornando o resultado da operação de atualização.
async function updateWalletIncome(
  userId: number,
  walletId: number,
  income: number,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE wallet SET income = ? WHERE id = ? AND user_id = ?`,
      [income, walletId, userId],
    );
    return result;
  } catch (error) {
    console.error("Error in updateWalletIncome:", error);
    throw new Error("An error occurred while updating wallet income");
  }
}

const walletRepository = {
  findAllWallets,
  findWalletByAssetId,
  createWalletEntry,
  updateWalletData,
  updateWalletIncome,
};
export default walletRepository;
