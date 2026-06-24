import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { TWallet } from "@/schemas/walletSchema";

// ==================================================================================
//                                       SELECTS
// ==================================================================================
// Esta função assíncrona busca a lista de carteiras do sistema, fazendo uma requisição ao banco de dados para obter os dados da tabela "wallet". Ela trata erros de rede e valida a resposta usando o esquema WalletListSchema, retornando a lista de carteiras se a resposta for válida ou null se não houver carteiras ou em caso de erro.
async function findAllWallets(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM wallet");
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
       WHERE id = ?`,
      [
        walletData.quantity,
        walletData.average_price,
        walletData.total_invested,
        walletData.income,
        walletData.initial_date,
        walletData.id,
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
  walletId: number,
  income: number,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE wallet SET income = ? WHERE id = ?`,
      [income, walletId],
    );
    return result;
  } catch (error) {
    console.error("Error in updateWalletIncome:", error);
    throw new Error("An error occurred while updating wallet income");
  }
}

// type TTransactionRow = {
//   id: number;
//   entry_type: "buy" | "sell";
//   date: string;
//   quantity: number;
//   unit_price: number;
//   total_value: number;
// };

// function roundTo(value: number, decimals: number): number {
//   const factor = 10 ** decimals;
//   return Math.round(value * factor) / factor;
// }
// // Esta função assíncrona recalcula os dados de uma carteira específica, identificada pelo ID do usuário e do ativo, com base nas transações de compra e venda associadas a esse ativo. Ela processa as transações em ordem cronológica, atualizando a quantidade, o total investido e a renda da carteira conforme as operações de compra e venda. Se uma venda tentar reduzir a posição para um valor negativo, a função lança um erro. Se não houver mais transações para o ativo, a carteira é deletada. Caso contrário, os dados da carteira são atualizados ou uma nova carteira é criada se ainda não existir.
// export async function recalculateWalletByAsset(
//   userId: number,
//   assetId: number,
// ): Promise<void> {
//   const [assetRows] = await db.query<RowDataPacket[]>(
//     "SELECT id, asset_type_id FROM asset WHERE id = ? LIMIT 1",
//     [assetId],
//   );

//   if (assetRows.length === 0) {
//     throw new Error("Ativo não encontrado para recalcular carteira");
//   }

//   const assetTypeId = Number(assetRows[0].asset_type_id);

//   const [transactionRows] = await db.query<RowDataPacket[]>(
//     `SELECT id, entry_type, date, quantity, unit_price, total_value
//          FROM transaction
//          WHERE user_id = ? AND asset_id = ?
//          ORDER BY date ASC, id ASC`,
//     [userId, assetId],
//   );

//   const [walletRows] = await db.query<RowDataPacket[]>(
//     "SELECT id, income FROM wallet WHERE user_id = ? AND asset_id = ? LIMIT 1",
//     [userId, assetId],
//   );

//   if (transactionRows.length === 0) {
//     if (walletRows.length > 0) {
//       await db.query("DELETE FROM wallet WHERE id = ?", [walletRows[0].id]);
//     }
//     return;
//   }

//   const transactions: TTransactionRow[] = transactionRows.map((row) => ({
//     id: Number(row.id),
//     entry_type: row.entry_type,
//     date: new Date(row.date).toISOString().slice(0, 10),
//     quantity: Number(row.quantity),
//     unit_price: Number(row.unit_price),
//     total_value: Number(row.total_value),
//   }));

//   let quantity = 0;
//   let totalInvested = 0;
//   let buyQuantityTotal = 0;
//   let buyValueTotal = 0;
//   // O loop processa as transações em ordem cronológica, atualizando a quantidade e o total investido com base nas operações de compra e venda. Para vendas, ele calcula o preço médio das compras anteriores para garantir que o total investido seja ajustado corretamente, mesmo que as vendas ocorram em momentos diferentes das compras. Se uma venda tentar reduzir a posição para um valor negativo, a função lança um erro
//   for (const tx of transactions) {
//     if (tx.entry_type === "buy") {
//       quantity += tx.quantity;
//       totalInvested += tx.total_value;
//       // Preço médio deve refletir apenas o histórico de compras do ativo.
//       buyQuantityTotal += tx.quantity;
//       buyValueTotal += tx.total_value;
//       continue;
//     }

//     if (tx.quantity > quantity + 1e-8) {
//       throw new Error(
//         "Transação de venda inválida: quantidade maior que posição atual",
//       );
//     }

//     const averagePrice = quantity > 0 ? totalInvested / quantity : 0;
//     quantity -= tx.quantity;
//     totalInvested -= averagePrice * tx.quantity;

//     if (Math.abs(quantity) < 1e-8) {
//       quantity = 0;
//       totalInvested = 0;
//     }
//   }

//   if (quantity <= 0 || totalInvested <= 0) {
//     if (walletRows.length > 0) {
//       await db.query("DELETE FROM wallet WHERE id = ?", [walletRows[0].id]);
//     }
//     return;
//   }

//   const averagePriceFromBuys =
//     buyQuantityTotal > 0 ? buyValueTotal / buyQuantityTotal : 0;
//   const currentIncome =
//     walletRows.length > 0 ? Number(walletRows[0].income || 0) : 0;
//   const firstBuyDate =
//     transactions.find((tx) => tx.entry_type === "buy")?.date ?? null;

//   const walletPayload = {
//     quantity: roundTo(quantity, 8),
//     average_price: roundTo(averagePriceFromBuys, 4),
//     total_invested: roundTo(totalInvested, 2),
//     income: assetTypeId === 3 ? roundTo(currentIncome, 2) : 0,
//     initial_date: assetTypeId === 3 ? firstBuyDate : null,
//   };
//   // Se já existe carteira para este ativo, atualiza os dados. Caso contrário, cria uma nova carteira. A função é chamada tanto para recalcular carteiras existentes quanto para criar novas carteiras quando a primeira compra de um ativo é registrada.
//   if (walletRows.length > 0) {
//     await db.query(
//       `UPDATE wallet
//              SET quantity = ?, average_price = ?, total_invested = ?, income = ?, initial_date = ?
//              WHERE id = ?`,
//       [
//         walletPayload.quantity,
//         walletPayload.average_price,
//         walletPayload.total_invested,
//         walletPayload.income,
//         walletPayload.initial_date,
//         walletRows[0].id,
//       ],
//     );
//     return;
//   }
//   // Se não existe carteira para este ativo, cria uma nova. A função é chamada tanto para recalcular carteiras existentes quanto para criar novas carteiras quando a primeira compra de um ativo é registrada.
//   await db.query(
//     `INSERT INTO wallet (user_id, asset_id, quantity, average_price, total_invested, income, initial_date)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     [
//       userId,
//       assetId,
//       walletPayload.quantity,
//       walletPayload.average_price,
//       walletPayload.total_invested,
//       walletPayload.income,
//       walletPayload.initial_date,
//     ],
//   );
// }

const walletRepository = {
  findAllWallets,
  findWalletByAssetId,
  updateWalletData,
  updateWalletIncome
};
export default walletRepository;