import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ==================================================================================
//                                        SELECTS
// ==================================================================================
// Está função busca todos os tipos de ativos disponíveis no banco de dados e retorna um array de objetos representando cada tipo de ativo.
async function findAllAssetTypes(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, asset_type FROM asset_type",
    );
    return rows;
  } catch (error) {
    console.error("Error in findAllAssetTypes:", error);
    throw new Error("An error occurred while fetching asset types");
  }
}
// Esta função busca todos os ativos disponíveis no banco de dados e retorna um array de objetos representando cada ativo.
async function findAllAssets(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM asset");
    return rows;
  } catch (error) {
    console.error("Error in findAllAssets:", error);
    throw new Error("An error occurred while fetching assets");
  }
}
// Esta função busca um ativo específico no banco de dados com base no tipo de ativo e no ticker fornecidos, retornando um array de objetos representando o ativo encontrado.
async function findAssetByTypeAndTicker(
  assetTypeId: number,
  ticker: string,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM asset WHERE asset_type_id = ? AND ticker = ? LIMIT 1",
      [assetTypeId, ticker],
    );
    return rows;
  } catch (error) {
    console.error("Error in findAssetByTypeAndTicker:", error);
    throw new Error("An error occurred while searching asset by ticker");
  }
}
// Esta função busca o tipo de ativo associado a um ativo específico no banco de dados com base no ID do ativo fornecido, retornando um array de objetos representando o tipo de ativo encontrado.
async function findAssetTypeByAssetId(assetId: number): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT at.* FROM asset a, asset_type at WHERE a.asset_type_id = at.id AND a.id = ? LIMIT 1",
      [assetId],
    );
    return rows;
  } catch (error) {
    console.error("Error in findAssetTypeByAssetId:", error);
    throw new Error("An error occurred while searching asset by id");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza o preço atual de um ativo específico no banco de dados com base no ID do ativo e no novo preço fornecidos, retornando o resultado da operação de atualização.
async function updateAssetCurrentPrice(
  assetId: number,
  newPrice: number,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE asset SET current_price = ? WHERE id = ?",
      [newPrice, assetId],
    );    
    return result;
  } catch (error) {
    console.error("Error in updateAssetCurrentPrice:", error);
    throw new Error("An error occurred while updating current asset price");
  }
}

const assetRepository = {
  findAllAssetTypes,
  findAllAssets,
  findAssetTypeByAssetId,
  updateAssetCurrentPrice,
  findAssetByTypeAndTicker,
};
export default assetRepository;