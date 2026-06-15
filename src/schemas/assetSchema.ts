import { z } from 'zod';

export type TAssetType = {
    id: 1;
    asset_type: "Ação";
} | {
    id: 2;
    asset_type: "FII";
} | {
    id: 3;
    asset_type: "Renda Fixa";
};

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
    category: z.enum(["Fundo de Papel", "Fundo de Tijolo", "Fundo Híbrido"]),
    current_price: z.number(),
})

export const RendaFixaSchema = BaseSchema.extend({
    company: z.string(),
})


export type TStock = z.infer<typeof StockSchema>;
export type TFii = z.infer<typeof FiiSchema>;
export type TRendaFixa = z.infer<typeof RendaFixaSchema>;

export type TAsset = TStock | TFii | TRendaFixa;