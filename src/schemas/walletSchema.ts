import { z } from 'zod';

export const WalletSchema = z.object({
    id: z.number(),
    asset_id: z.number(),
    quantity: z.number(),
    average_price: z.number(),
    total_invested: z.number(),
    income: z.number().optional(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});

export type TWallet = z.infer<typeof WalletSchema>;
