import db from "@/app/api/_lib/db";
import { RowDataPacket } from 'mysql2';
import { AssetTypeListSchema, TAssetType, TAssetTypeList, TAssetList, AssetListSchema, TAsset, TFiiCategory } from "@/schemas/assetSchema";

export async function findAllAssetTypes(): Promise<TAssetTypeList | null> {
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT id, asset_type FROM asset_type");
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
                asset = { ...asset, ticker: row.ticker, company: row.company, current_price: Number(row.current_price) };
            }

            // FII
            if (row.asset_type_id === 2) {
                asset = { ...asset, ticker: row.ticker, category: String(row.category) as TFiiCategory, current_price: Number(row.current_price) };
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