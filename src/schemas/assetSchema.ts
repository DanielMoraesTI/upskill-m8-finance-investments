import { z } from 'zod';

export type TAssetType = {
    id: 1;
    asset_type: "Renda Fixa";
} | {
    id: 2;
    asset_type: "FII";
} | {
    id: 3;
    asset_type: "Ação";
};

// AssetSchema não terá CreateSchema pois serão inseridos manualmente no DB
export const AssetSchema = z.object({
    id: z.number(),
    asset_type_id: z.number(),
    name: z.string().min(1, "O nome do ativo é obrigatório").max(75, "O nome do ativo deve conter no máximo 75 caracteres"),
    description: z.string().max(150, "A descrição do ativo deve conter no máximo 150 caracteres").nullable(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});

export type TAsset = z.infer<typeof AssetSchema>;