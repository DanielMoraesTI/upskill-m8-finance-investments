import { z } from 'zod';

const TransactionEntryTypeSchema = z.enum(['buy', 'sell']);

const CreateTransactionSchema = z.object({
    asset_id: z.number(),
    entry_type: TransactionEntryTypeSchema,
    date: z.iso.date(),
    quantity: z.coerce.number().positive("A quantidade deve ser um número positivo"),
    unit_price: z.coerce.number().positive("O preço unitário deve ser um número positivo"),
    total_value: z.coerce.number().positive("O valor total deve ser um número positivo"),
});

export const TransactionSchema = CreateTransactionSchema.extend({
    id: z.number(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});

export type TTransaction = z.infer<typeof TransactionSchema>;
export type TCreateTransaction = z.infer<typeof CreateTransactionSchema>;


// ==============================================================================
//                                  API SCHEMAS
// ==============================================================================

export const TransactionListResponseSchema = z.object({
    transactionList: z.array(TransactionSchema),
});

export type TTransactionListResponse = z.infer<typeof TransactionListResponseSchema>;