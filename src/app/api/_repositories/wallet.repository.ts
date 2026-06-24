import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { TWallet } from "@/schemas/walletSchema";

// ==================================================================================
//                                       SELECTS
// ==================================================================================
// Esta função assíncrona busca a lista de carteiras do sistema, fazendo uma requisição ao banco de dados para obter os dados da tabela "wallet". Ela trata erros de rede e valida a resposta usando o esquema WalletListSchema, retornando a lista de carteiras se a resposta for válida ou null se não houver carteiras ou em caso de erro.
async function findAllWallets(userId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM wallet WHERE user_id = ?", [userId]);
    return rows;
  } catch (error) {
    console.error("Error in findAllWallets:", error);
    throw new Error("An error occurred while fetching wallet data");
  }
}

async function findWalletByAssetId(assetId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM wallet WHERE asset_id = ? LIMIT 1",
      [assetId],
    );
    return rows;
  } catch (error) {
    console.error("Error in findWalletByAssetId:", error);
    throw new Error("An error occurred while fetching wallet by asset ID");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
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

// Esta função assíncrona atualiza o valor final da Renda Fixa de uma carteira específica, identificada pelo ID, enviando uma requisição PATCH para o endpoint "/portal/wallet/{id}" com o novo valor de renda. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
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
  updateWalletData,
  updateWalletIncome
};
export default walletRepository;