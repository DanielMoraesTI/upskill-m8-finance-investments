import { z } from 'zod';
// ==============================================================================
//                                  ASSET SCHEMAS
// ==============================================================================
// Este esquema define a estrutura de um tipo de ativo (AssetType), que inclui um id e um asset_type. Ele utiliza o Zod para validação, garantindo que os dados relacionados aos tipos de ativos sejam consistentes e sigam as regras definidas para cada tipo específico, como "Ação", "FII" e "Renda Fixa". O uso do Zod permite a validação consistente dos dados relacionados aos tipos de ativos em todo o código.
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
// Este esquema define a estrutura de uma categoria de FII (FiiCategory), que é um enum com os valores "Fundo de Papel", "Fundo de Tijolo" e "Fundo Híbrido". Ele utiliza o Zod para validação, garantindo que os dados relacionados às categorias de FII sejam consistentes e sigam as regras definidas para cada categoria específica. O uso do Zod permite a validação consistente dos dados relacionados às categorias de FII em todo o código.
const FiiCategorySchema = z.enum(["Fundo de Papel", "Fundo de Tijolo", "Fundo Híbrido"]);
// Este esquema define a estrutura de um ativo (Asset), que pode ser do tipo Ação, FII ou Renda Fixa. Ele utiliza o Zod para validação, garantindo que os dados relacionados aos ativos sejam consistentes e sigam as regras definidas para cada tipo específico. O uso do Zod permite a validação consistente dos dados relacionados aos ativos em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de ativos.
const BaseSchema = z.object({
    id: z.number(),
    asset_type_id: z.number(),
    created_at: z.iso.date(),
    updated_at: z.iso.date(),
})
// Este esquema define a estrutura de um ativo do tipo Ação, que inclui campos como ticker, company e current_price. Ele estende o BaseSchema para incluir os campos específicos de uma ação, utilizando o Zod para validação e garantindo que os dados relacionados às ações sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados às ações em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de ativos do tipo Ação.
export const StockSchema = BaseSchema.extend({
    ticker: z.string(),
    company: z.string(),
    current_price: z.number(),
})
// Este esquema define a estrutura de um ativo do tipo FII, que inclui campos como ticker, category e current_price. Ele estende o BaseSchema para incluir os campos específicos de um FII, utilizando o Zod para validação e garantindo que os dados relacionados aos FIIs sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados aos FIIs em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de ativos do tipo FII.
export const FiiSchema = BaseSchema.extend({
    ticker: z.string(),
    category: FiiCategorySchema,
    current_price: z.number(),
})
// Este esquema define a estrutura de um ativo do tipo Renda Fixa, que inclui o campo company. Ele estende o BaseSchema para incluir os campos específicos de um ativo de renda fixa, utilizando o Zod para validação e garantindo que os dados relacionados aos ativos de renda fixa sejam consistentes e sigam as regras definidas para cada campo específico. O uso do Zod permite a validação consistente dos dados relacionados aos ativos de renda fixa em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de ativos do tipo Renda Fixa.
export const RendaFixaSchema = BaseSchema.extend({
    company: z.string(),
})
// Este esquema define a estrutura de um ativo (Asset), que pode ser do tipo Ação, FII ou Renda Fixa. Ele utiliza o Zod para validação, garantindo que os dados relacionados aos ativos sejam consistentes e sigam as regras definidas para cada tipo específico. O uso do Zod permite a validação consistente dos dados relacionados aos ativos em todo o código, facilitando a manipulação segura desses dados em funções e componentes que lidam com informações de ativos. O AssetSchema é definido como uma união dos esquemas específicos de cada tipo de ativo, permitindo que um objeto do tipo Asset possa ser validado contra qualquer um dos tipos de ativos definidos (Ação, FII ou Renda Fixa).
export const AssetSchema = z.union([StockSchema, FiiSchema, RendaFixaSchema]);
// ==============================================================================
//                                  FRONTEND TYPES
// ==============================================================================
// Estes tipos são inferidos a partir dos esquemas Zod definidos anteriormente, permitindo que sejam utilizados em todo o código para garantir a consistência dos dados relacionados aos ativos (assets) e seus tipos. O tipo TAssetType representa um tipo de ativo específico, o tipo TFiiCategory representa uma categoria de FII, os tipos TStock, TFii e TRendaFixa representam os diferentes tipos de ativos, e o tipo TAsset representa um ativo genérico que pode ser de qualquer um dos tipos definidos. O uso desses tipos facilita a tipagem e validação em funções e componentes que lidam com dados de ativos, garantindo a segurança e consistência dos dados em todo o aplicativo.
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
