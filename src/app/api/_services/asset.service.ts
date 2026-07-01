import {
  AssetTypeListSchema,
  TAssetType,
  TAssetTypeList,
  TAssetList,
  AssetListSchema,
  TAsset,
  TFiiCategory,
  AssetSchema,
} from "@/schemas/assetSchema";
import assetRepository from "@/app/api/_repositories/asset.repository";

// ==================================================================================
//                              GET SERVICES
// ==================================================================================
async function getAssetTypes(): Promise<TAssetTypeList | null> {
  try {
    const rows = await assetRepository.findAllAssetTypes();
    if (rows.length === 0) return null;

    const assetTypes: TAssetType[] = rows.map((row) => ({
      id: row.id,
      asset_type: row.asset_type,
    }));

    const parsed = AssetTypeListSchema.safeParse(assetTypes);
    if (!parsed.success) {
      console.log("Erro ao validar tipos de ativos:", parsed.error);
      throw new Error("Dados de tipo de ativo inválidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em findAllAssetTypes:", error);
    return null;
  }
}

async function getAllAssets(): Promise<TAssetList | null> {
  try {
    const rows = await assetRepository.findAllAssets();
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
      console.log("Erro ao validar ativos:", parsed.error);
      throw new Error("Dados de ativo invalidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em findAllAssets:", error);
    return null;
  }
}

async function getAssetByTypeAndTicker(
  assetTypeId: number,
  ticker: string,
): Promise<TAsset | null> {
  try {
    const rows = await assetRepository.findAssetByTypeAndTicker(
      assetTypeId,
      ticker,
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
        category: String(row.category || "Fundo Hi­brido") as TFiiCategory,
        current_price: Number(row.current_price || 0),
      };
    }

    if (row.asset_type_id === 3) {
      asset = {
        ...baseData,
        company: String(row.company),
      };
    }

    const parsed = AssetSchema.safeParse(asset);
    if (!parsed.success) {
      console.log("Erro ao validar ativo:", parsed.error);
      throw new Error("Dados de ativo invalidos");
    }

    return parsed.data;
  } catch (error) {
    console.error("Erro em findAssetByTypeAndTicker:", error);
    throw new Error("Ocorreu um erro ao buscar ativo pelo ticker");
  }
}

// ==================================================================================
//                              UPDATE SERVICES
// ==================================================================================
async function updateAssetCurrentPrice(
  assetId: number,
  newPrice: number,
): Promise<void> {
  try {
    const result = await assetRepository.updateAssetCurrentPrice(
      assetId,
      newPrice,
    );
    if (result.affectedRows === 0) {
      throw new Error("Ativo não encontrado");
    }
  } catch (error) {
    console.error("Erro em updateAssetCurrentPrice:", error);
    throw new Error("Ocorreu um erro ao atualizar preco atual do ativo");
  }
}

const assetService = {
  getAssetTypes,
  getAllAssets,
  getAssetByTypeAndTicker,
  updateAssetCurrentPrice,
};
export default assetService;
