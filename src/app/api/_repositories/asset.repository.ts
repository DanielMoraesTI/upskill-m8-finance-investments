import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ==================================================================================
//                                        SELECTS
// ==================================================================================
// Esta função busca todos os tipos de ativos disponí­veis no banco de dados e retorna um array de objetos representando cada tipo de ativo.
async function findAllAssetTypes(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, asset_type FROM asset_type",
    );
    return rows;
  } catch (error) {
    console.error("Erro em findAllAssetTypes:", error);
    throw new Error("Ocorreu um erro ao buscar tipos de ativos");
  }
}
// Esta função busca todos os ativos disponí­veis no banco de dados e retorna um array de objetos representando cada ativo.
async function findAllAssets(): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM asset");
    return rows;
  } catch (error) {
    console.error("Erro em findAllAssets:", error);
    throw new Error("Ocorreu um erro ao buscar ativos");
  }
}
// Esta função busca um ativo especí­fico no banco de dados com base no tipo de ativo e no ticker fornecidos, retornando um array de objetos representando o ativo encontrado.
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
    console.error("Erro em findAssetByTypeAndTicker:", error);
    throw new Error("Ocorreu um erro ao buscar ativo pelo ticker");
  }
}
// Esta função busca o tipo de ativo associado a um ativo especí­fico no banco de dados com base no ID do ativo fornecido, retornando um array de objetos representando o tipo de ativo encontrado.
async function findAssetTypeByAssetId(
  assetId: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT at.* FROM asset a, asset_type at WHERE a.asset_type_id = at.id AND a.id = ? LIMIT 1",
      [assetId],
    );
    return rows;
  } catch (error) {
    console.error("Erro em findAssetTypeByAssetId:", error);
    throw new Error("Ocorreu um erro ao buscar ativo por id");
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza o preço atual de um ativo especí­fico no banco de dados com base no ID do ativo e no novo preço fornecidos, retornando o resultado da operação de atualização.
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
    console.error("Erro em updateAssetCurrentPrice:", error);
    throw new Error("Ocorreu um erro ao atualizar preço atual do ativo");
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
