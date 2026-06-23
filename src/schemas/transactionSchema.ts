import { z } from 'zod';
// ==============================================================================
//                                  FRONTEND SCHEMAS
// ==============================================================================
// Este esquema define a estrutura de um objeto Transaction, incluindo campos como id, asset_id, entry_type, date, quantity, unit_price, total_value, created_at e updated_at. Ele utiliza o Zod para validação de tipos e regras específicas, como garantir que quantity, unit_price e total_value sejam números positivos. O campo entry_type é definido como um enum com os valores 'buy' e 'sell', enquanto os campos date, created_at e updated_at devem ser datas ISO. O uso do coerce permite que valores de string sejam convertidos para números, facilitando a manipulação de dados provenientes de formulários ou APIs.
const TransactionEntryTypeSchema = z.enum(['buy', 'sell']);

const CreateTransactionSchema = z.object({
    asset_id: z.number(),
    entry_type: TransactionEntryTypeSchema,
    date: z.iso.date(),
    quantity: z.coerce.number().positive("A quantidade deve ser um número positivo"),
    unit_price: z.coerce.number().positive("O preço unitário deve ser um número positivo"),
    total_value: z.coerce.number().positive("O valor total deve ser um número positivo"),
});
// Este esquema define a estrutura de uma lista de transações (TransactionList), que é um array de objetos Transaction. Ele utiliza o Zod para garantir que cada item na lista siga a estrutura definida pelo TransactionSchema, permitindo validação e manipulação consistente dos dados relacionados às transações de investimento.
export const TransactionSchema = CreateTransactionSchema.extend({
    id: z.number(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
});
// ==============================================================================
//                                  FRONTEND TYPES
// ==============================================================================
// Estes tipos são inferidos a partir dos esquemas Zod definidos anteriormente, permitindo que sejam utilizados em todo o código para garantir a consistência dos dados relacionados às transações (transactions) e suas listas. O tipo TTransaction representa um objeto individual de transação, enquanto o tipo TCreateTransaction representa os dados necessários para criar uma nova transação, facilitando a tipagem e validação em funções e componentes que lidam com esses dados.
export type TTransaction = z.infer<typeof TransactionSchema>;
export type TCreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type TTransactionEntryType = z.infer<typeof TransactionEntryTypeSchema>;

export const TransactionListSchema = z.array(TransactionSchema);
export type TTransactionList = z.infer<typeof TransactionListSchema>;

// ==============================================================================
//                                  API SCHEMAS
// ==============================================================================

export const TransactionListResponseSchema = z.object({
    transactionList: z.array(TransactionSchema),
});

export type TTransactionListResponse = z.infer<typeof TransactionListResponseSchema>;