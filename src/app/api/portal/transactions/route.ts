import { NextResponse } from "next/server";
import {
  TransactionListResponseSchema,
  TransactionSchema,
} from "@/schemas/transactionSchema";
import {
  createTransactionEntry,
  deleteTransaction,
  findAllTransactions,
  findTransactionById,
} from "@/app/api/_repositories/transaction.repository";
import { recalculateWalletByAsset } from "@/app/api/_repositories/wallet.repository";
import {
  createAssetForTransaction,
  findAssetByTypeAndTicker,
} from "@/app/api/_repositories/asset.repository";
import { z } from "zod";
//
const DEFAULT_USER_ID = 1;
// Esta função assíncrona lida com requisições GET para o endpoint "/api/portal/transactions". Ela busca a lista de transações do sistema, valida a resposta usando o esquema TransactionListResponseSchema e retorna os dados em formato JSON. Em caso de erros, ela captura e registra o erro, retornando uma resposta JSON com uma mensagem de erro apropriada e um status HTTP 500.
export async function GET() {
  try {
    // validar o userID

    // fazer a query
    const transactionList = await findAllTransactions();
    // fazer o parse da response
    const transactionListResponse = TransactionListResponseSchema.safeParse({
      transactionList: transactionList || [],
    });
    if (!transactionListResponse.success) {
      return NextResponse.json(
        {
          message: "Erro ao processar a resposta do sistema de transações",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(transactionListResponse.data, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    );
  }
}
// Esta função assíncrona lida com requisições POST para o endpoint "/api/portal/transactions". Ela valida os dados de entrada usando o esquema TransactionSchema, cria uma nova transação no sistema, recalcula a carteira associada ao ativo da transação e retorna a transação criada em formato JSON. Em caso de erros, ela captura e registra o erro, retornando uma resposta JSON com uma mensagem de erro apropriada e um status HTTP 400 ou 500, dependendo do tipo de erro.
export async function POST(request: Request) {
  try {
    // validar o userID
    const userId = DEFAULT_USER_ID;
    const body = await request.json();

    const transactionBaseSchema = TransactionSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
      asset_id: true,
    });

    const standardSchema = transactionBaseSchema.extend({
      asset_id: z.number().int().positive(),
    });

    const createAssetSchema = transactionBaseSchema.extend({
      asset_type_id: z.union([z.literal(1), z.literal(2)]),
      ticker: z.string().min(3),
      company: z.string().optional(),
      category: z
        .enum(["Fundo de Papel", "Fundo de Tijolo", "Fundo Híbrido"])
        .optional(),
      current_price: z.number().nonnegative().optional(),
    });

    const transactionPayload = z
      .union([standardSchema, createAssetSchema])
      .safeParse(body);

    if (!transactionPayload.success) {
      return NextResponse.json(
        {
          message: "Dados de transação inválidos",
        },
        { status: 400 },
      );
    }

    let assetId = 0;

    if ("asset_id" in transactionPayload.data) {
      assetId = transactionPayload.data.asset_id;
    } else {
      const payload = transactionPayload.data;
      const existingAsset = await findAssetByTypeAndTicker(
        payload.asset_type_id,
        payload.ticker,
      );

      if (existingAsset) {
        assetId = existingAsset.id;
      } else {
        assetId = await createAssetForTransaction({
          asset_type_id: payload.asset_type_id,
          ticker: payload.ticker,
          company: payload.company,
          category: payload.category,
          current_price: payload.current_price ?? payload.unit_price,
        });
      }
    }

    const transactionData = {
      asset_id: assetId,
      entry_type: transactionPayload.data.entry_type,
      date: transactionPayload.data.date,
      quantity: transactionPayload.data.quantity,
      unit_price: transactionPayload.data.unit_price,
      total_value: transactionPayload.data.total_value,
    };

    const createdId = await createTransactionEntry(userId, transactionData);

    try {
      await recalculateWalletByAsset(userId, transactionData.asset_id);
    } catch (error) {
      // Em caso de violação de regra de negócio (ex.: venda maior que posição), desfaz inserção.
      await deleteTransaction(createdId);

      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível recalcular a carteira",
        },
        { status: 400 },
      );
    }

    const createdTransaction = await findTransactionById(createdId);

    if (!createdTransaction) {
      return NextResponse.json(
        { message: "Transação criada, mas não encontrada" },
        { status: 500 },
      );
    }

    return NextResponse.json(createdTransaction, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    );
  }
}
