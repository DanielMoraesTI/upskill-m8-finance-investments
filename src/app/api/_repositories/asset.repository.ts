import db from "@/app/api/_lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  AssetTypeListSchema,
  TAssetType,
  TAssetTypeList,
  TAssetList,
  AssetListSchema,
  TAsset,
  TFiiCategory,
} from "@/schemas/assetSchema";
// Esta função assíncrona busca a lista de tipos de ativos do sistema, fazendo uma requisição ao banco de dados para obter os dados da tabela "asset_type". Ela trata erros de rede e valida a resposta usando o esquema AssetTypeListSchema, retornando a lista de tipos de ativos se a resposta for válida ou null se não houver tipos de ativos ou em caso de erro.
export async function findAllAssetTypes(): Promise<TAssetTypeList | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, asset_type FROM asset_type",
    );
    if (rows.length === 0) return null;

    const assetTypes: TAssetType[] = rows.map((row) => ({
      id: row.id,
      asset_type: row.asset_type,
    }));

    const parsed = AssetTypeListSchema.safeParse(assetTypes);
    if (!parsed.success) {
      console.log("Asset Types parsing error:", parsed.error);
      throw new Error("Invalid asset type data");
    }

    return parsed.data;
  } catch (error) {
    console.error("Error in findAllAssetTypes:", error);
    return null;
  }
}
// Esta função assíncrona busca a lista de ativos do sistema, fazendo uma requisição ao banco de dados para obter os dados da tabela "asset". Ela trata erros de rede e valida a resposta usando o esquema AssetListSchema, retornando a lista de ativos se a resposta for válida ou null se não houver ativos ou em caso de erro.
export async function findAllAssets(): Promise<TAssetList | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM asset");
    if (rows.length === 0) return null;

    const assetList: TAssetList = rows.map((row) => {
      let asset: Partial<TAsset> = {
        id: row.id,
        asset_type_id: row.asset_type_id,
        created_at: new Date(row.created_at).toISOString().slice(0, 10),
        updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
      };

      // ACAO
      if (row.asset_type_id === 1) {
        asset = {
          ...asset,
          ticker: row.ticker,
          company: row.company,
          current_price: Number(row.current_price),
        };
      }

      // FII
      if (row.asset_type_id === 2) {
        asset = {
          ...asset,
          ticker: row.ticker,
          category: String(row.category) as TFiiCategory,
          current_price: Number(row.current_price),
        };
      }

      // RENDA FIXA
      if (row.asset_type_id === 3) {
        asset = { ...asset, company: row.company };
      }

      return asset as TAsset;
    });

    const parsed = AssetListSchema.safeParse(assetList);
    if (!parsed.success) {
      console.log("Assets parsing error:", parsed.error);
      throw new Error("Invalid asset data");
    }

    return parsed.data;
  } catch (error) {
    console.error("Error in findAllAssets:", error);
    return null;
  }
}
// Esta função assíncrona atualiza o valor do preço atual de um ativo específico, identificado pelo ID, enviando uma requisição PATCH para o endpoint "/portal/assets/{id}" com o novo valor de preço. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function updateAssetCurrentPrice(
  assetId: number,
  newPrice: number,
): Promise<void> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE asset SET current_price = ? WHERE id = ?",
      [newPrice, assetId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Asset not found");
    }
  } catch (error) {
    console.error("Error in updateAssetCurrentPrice:", error);
    throw new Error("An error occurred while updating current asset price");
  }
}
// Esta função assíncrona busca os dados de uma transação específica, identificada pelo ID, fazendo uma requisição ao banco de dados para obter os dados da tabela "transaction". Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando os dados da transação se a resposta for válida ou null se a transação não for encontrada ou em caso de erro.
export async function findAssetByTypeAndTicker(
  assetTypeId: number,
  ticker: string,
): Promise<TAsset | null> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM asset WHERE asset_type_id = ? AND ticker = ? LIMIT 1",
      [assetTypeId, ticker],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const baseData = {
      id: Number(row.id),
      asset_type_id: Number(row.asset_type_id),
      created_at: new Date(row.created_at).toISOString().slice(0, 10),
      updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
    };

    let asset: Partial<TAsset> = baseData;

    if (row.asset_type_id === 1) {
      asset = {
        ...baseData,
        ticker: String(row.ticker),
        company: String(row.company || row.ticker),
        current_price: Number(row.current_price || 0),
      };
    }

    if (row.asset_type_id === 2) {
      asset = {
        ...baseData,
        ticker: String(row.ticker),
        category: String(row.category || "Fundo Híbrido") as TFiiCategory,
        current_price: Number(row.current_price || 0),
      };
    }

    if (row.asset_type_id === 3) {
      asset = {
        ...baseData,
        company: String(row.company),
      };
    }

    return asset as TAsset;
  } catch (error) {
    console.error("Error in findAssetByTypeAndTicker:", error);
    throw new Error("An error occurred while searching asset by ticker");
  }
}
// Esta função assíncrona cria uma nova transação no banco de dados com base nos dados fornecidos. Ela insere os dados da transação na tabela "transaction" e retorna o ID da transação criada. Em caso de erros, ela captura e registra o erro, lançando um erro apropriado.
export async function createAssetForTransaction(args: {
  asset_type_id: 1 | 2;
  ticker: string;
  company?: string;
  category?: TFiiCategory;
  current_price?: number;
}): Promise<number> {
  try {
    if (args.asset_type_id === 1) {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO asset (asset_type_id, ticker, company, current_price)
                 VALUES (?, ?, ?, ?)`,
        [
          args.asset_type_id,
          args.ticker,
          args.company || args.ticker,
          Number(args.current_price || 0),
        ],
      );

      return result.insertId;
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO asset (asset_type_id, ticker, category, current_price)
             VALUES (?, ?, ?, ?)`,
      [
        args.asset_type_id,
        args.ticker,
        args.category || "Fundo Híbrido",
        Number(args.current_price || 0),
      ],
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in createAssetForTransaction:", error);
    throw new Error("An error occurred while creating asset");
  }
}
