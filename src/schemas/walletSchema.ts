import { z } from "zod";
// ==============================================================================
//                                  FRONTEND SCHEMAS
// ==============================================================================
// Este esquema define a estrutura de um objeto Wallet, incluindo campos como id, asset_id, quantity, average_price, total_invested, income, initial_date, created_at e updated_at. Ele utiliza o Zod para validação de tipos e regras específicas, como garantir que quantity, average_price e total_invested sejam números positivos. Os campos income e initial_date são opcionais, enquanto os campos created_at e updated_at são obrigatórios e devem ser datas ISO. O uso do coerce permite que valores de string sejam convertidos para números, facilitando a manipulação de dados provenientes de formulários ou APIs.
export const WalletSchema = z.object({
  id: z.number(),
  asset_id: z.number(),
  quantity: z.coerce
    .number()
    .nonnegative("A quantidade deve ser um número não negativo"),
  average_price: z.coerce
    .number()
    .nonnegative("O preço médio deve ser um número não negativo"),
  total_invested: z.coerce
    .number()
    .nonnegative("O valor total investido deve ser um número não negativo"),
  income: z.coerce
    .number()
    .nonnegative("O rendimento deve ser um número não negativo")
    .default(0)
    .optional(),
  initial_date: z.iso.date().optional(),
  created_at: z.iso.date(),
  updated_at: z.iso.date(),
});
// Este esquema define a estrutura de uma lista de carteiras (WalletList), que é um array de objetos Wallet. Ele utiliza o Zod para garantir que cada item na lista siga a estrutura definida pelo WalletSchema, permitindo validação e manipulação consistente dos dados relacionados às carteiras de investimento.
export const WalletListSchema = z.array(WalletSchema);
// ==============================================================================
//                                  FRONTEND TYPES
// ==============================================================================
// Estes tipos são inferidos a partir dos esquemas Zod definidos anteriormente, permitindo que sejam utilizados em todo o código para garantir a consistência dos dados relacionados às carteiras (wallets) e suas listas. O tipo TWallet representa um objeto individual de carteira, enquanto o tipo TWalletList representa um array de objetos de carteira, facilitando a tipagem e validação em funções e componentes que lidam com esses dados.
export type TWallet = z.infer<typeof WalletSchema>;
export type TWalletList = z.infer<typeof WalletListSchema>;

// ==============================================================================
//                                  API SCHEMAS
// ==============================================================================
// Este esquema define a estrutura da resposta da API para a lista de carteiras, que inclui um campo walletList do tipo WalletListSchema. Ele utiliza o Zod para validação, garantindo que a resposta da API siga a estrutura esperada e permitindo a manipulação segura dos dados relacionados às carteiras de investimento.
export const WalletListResponseSchema = z.object({
  walletList: WalletListSchema,
});
// Este tipo é inferido a partir do esquema Zod WalletListResponseSchema, representando a estrutura da resposta da API que contém a lista de carteiras. Ele pode ser utilizado em funções e componentes que lidam com os dados retornados pela API, garantindo a consistência e segurança na manipulação desses dados.
export type TWalletListResponse = z.infer<typeof WalletListResponseSchema>;

export const UpdateWalletIncomeRequestSchema = z.object({
  walletId: z.number(),
  income: z.coerce
    .number()
    .nonnegative("O novo rendimento deve ser um número não negativo"),
});
export type TUpdateWalletIncomeRequest = z.infer<
  typeof UpdateWalletIncomeRequestSchema
>;
