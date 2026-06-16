import { z } from 'zod';

export const AssetTypeSchema = z.union([
    z.object({
        id: z.literal(1),
        asset_type: z.literal("Ação"),
    }),
    z.object({
        id: z.literal(2),
        asset_type: z.literal("FII"),
    }),
    z.object({
        id: z.literal(3),
        asset_type: z.literal("Renda Fixa"),
    }),
]);

const FiiCategorySchema = z.enum(["Fundo de Papel", "Fundo de Tijolo", "Fundo Híbrido"]);

const BaseSchema = z.object({
    id: z.number(),
    asset_type_id: z.number(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
})

export const StockSchema = BaseSchema.extend({
    ticker: z.string(),
    company: z.string(),
    current_price: z.number(),
})

export const FiiSchema = BaseSchema.extend({
    ticker: z.string(),
    category: FiiCategorySchema,
    current_price: z.number(),
})

export const RendaFixaSchema = BaseSchema.extend({
    company: z.string(),
})

export const AssetSchema = z.union([StockSchema, FiiSchema, RendaFixaSchema]);

export type TAssetType = z.infer<typeof AssetTypeSchema>;
export type TFiiCategory = z.infer<typeof FiiCategorySchema>;

export type TStock = z.infer<typeof StockSchema>;
export type TFii = z.infer<typeof FiiSchema>;
export type TRendaFixa = z.infer<typeof RendaFixaSchema>;

export type TAsset = z.infer<typeof AssetSchema>;


export const AssetTypeListSchema = z.array(AssetTypeSchema)
export const AssetListSchema = z.array(AssetSchema)

export type TAssetTypeList = z.infer<typeof AssetTypeListSchema>
export type TAssetList = z.infer<typeof AssetListSchema>

// ==============================================================================
//                                  API SCHEMAS
// ==============================================================================
export const AssetListResponseSchema = z.object({
    assetTypeList: AssetTypeListSchema,
    assetList: AssetListSchema,
});

export type TAssetListResponse = z.infer<typeof AssetListResponseSchema>;
