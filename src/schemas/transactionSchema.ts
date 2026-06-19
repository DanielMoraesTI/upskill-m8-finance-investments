import { z } from 'zod';

const TransactionEntryTypeSchema = z.enum(['buy', 'sell']);

const CreateTransactionSchema = z.object({
    asset_id: z.number(),
    entry_type: TransactionEntryTypeSchema,
    date: z.iso.date(),
    quantity: z.number().positive("A quantidade deve ser um número positivo"),
    unit_price: z.number().positive("O preço unitário deve ser um número positivo"),
    total_value: z.number().positive("O valor total deve ser um número positivo"),
});

export const TransactionSchema = CreateTransactionSchema.extend({
    id: z.number(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});

export type TTransaction = z.infer<typeof TransactionSchema>;
export type TCreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type TTransactionEntryType = z.infer<typeof TransactionEntryTypeSchema>;

export const TransactionListSchema = z.array(TransactionSchema);
export type TTransactionList = z.infer<typeof TransactionListSchema>;
