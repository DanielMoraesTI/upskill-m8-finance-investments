import { z } from 'zod';

export const WalletSchema = z.object({
    id: z.number(),
    asset_id: z.number(),
    quantity: z.coerce.number(),
    average_price: z.coerce.number(),
    total_invested: z.coerce.number(),
    income: z.coerce.number().optional(),
    initial_date: z.iso.date().optional(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});

export const WalletListSchema = z.array(WalletSchema)

export type TWallet = z.infer<typeof WalletSchema>;
export type TWalletList = z.infer<typeof WalletListSchema>;

// ==============================================================================
//                                  API SCHEMAS
// ==============================================================================

export const WalletListResponseSchema = z.object({
    walletList: WalletListSchema,
});

export type TWalletListResponse = z.infer<typeof WalletListResponseSchema>;