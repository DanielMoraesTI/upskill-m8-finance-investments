import {
  TUpdateTransactionRequest,
  TTransaction,
  TCreateTransaction,
  TransactionSchema,
  TransactionListResponseSchema,
  TTransactionList,
  UpdateTransactionRequestSchema,
} from "../schemas/transactionSchema";
import { getUserToken } from "@/services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// Esta função assíncrona busca a lista de transações do sistema, fazendo uma requisição GET para o endpoint "/portal/transactions". Ela trata erros de rede e valida a resposta usando o esquema TransactionListResponseSchema, retornando a lista de transações se a resposta for válida.
export async function getTransactionList(): Promise<TTransactionList> {
  try {
    const token = await getUserToken();

    const response = await fetch(`${API_URL}/portal/transactions`, {
      method: "GET",
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Failed to fetch transaction data");

    const data = await response.json();
    const parsed = TransactionListResponseSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid transaction data");

    return parsed.data.transactionList;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching transaction data");
  }
}
// Esta função assíncrona cria uma nova transação, enviando uma requisição POST para o endpoint "/portal/transactions" com os dados da transação a ser criada. Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando a transação criada se a resposta for válida.
export async function createTransaction(
  transactionData: TCreateTransaction,
): Promise<TTransaction> {
  try {
    const token = await getUserToken();
    const response = await fetch(`${API_URL}/portal/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create transaction");
    }

    const data = await response.json();
    const parsed = TransactionSchema.safeParse(data?.transaction ?? data);
    if (!parsed.success) throw new Error("Invalid transaction data");

    return parsed.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while creating transaction");
  }
}

// Esta função assíncrona atualiza os dados de uma transação específica, identificada pelo ID, enviando uma requisição PUT para o endpoint "/portal/transactions/{id}" com os dados da transação a serem atualizados. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function updateTransaction(
  id: number,
  transactionData: TTransaction,
): Promise<void> {
  try {
    const body = {
      id,
      transaction: transactionData,
    };

    const parsed = UpdateTransactionRequestSchema.safeParse({
      transaction: body.transaction,
    });
    if (!parsed.success) {
      throw new Error("Invalid transaction data");
    }

    const token = await getUserToken();
    const response = await fetch(`${API_URL}/portal/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        id: body.id,
        transaction: parsed.data.transaction,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update transaction");
    }
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while updating transaction");
  }
}
// Esta função assíncrona deleta uma transação específica, identificada pelo ID, enviando uma requisição DELETE para o endpoint "/portal/transactions/{id}". Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function deleteTransaction(id: number): Promise<void> {
  try {
    const token = await getUserToken();
    const response = await fetch(`${API_URL}/portal/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while deleting transaction");
  }
}
