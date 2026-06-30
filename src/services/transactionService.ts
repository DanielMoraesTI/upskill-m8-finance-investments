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
// Esta funçã£o assí­ncrona busca a lista de transações do sistema, fazendo uma requisição GET para o endpoint "/portal/transactions". Ela trata erros de rede e valida a resposta usando o esquema TransactionListResponseSchema, retornando a lista de transações se a resposta for válida.
export async function getTransactionList(): Promise<TTransactionList> {
  try {
    const token = await getUserToken();

    const response = await fetch(`${API_URL}/portal/transactions`, {
      method: "GET",
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Falha ao buscar dados de transação");

    const data = await response.json();
    const parsed = TransactionListResponseSchema.safeParse(data);
    if (!parsed.success) throw new Error("Dados de transação inválidos");

    return parsed.data.transactionList;
  } catch (error) {
    console.error(error);
    throw new Error("Ocorreu um erro ao buscar dados de transação");
  }
}
// Esta função assí­ncrona cria uma nova transação, enviando uma requisição POST para o endpoint "/portal/transactions" com os dados da transação a ser criada. Ela trata erros de rede e valida a resposta usando o esquema TransactionSchema, retornando a transação criada se a resposta for válida.
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
      throw new Error(errorData.message || "Falha ao criar transação");
    }

    const data = await response.json();
    const parsed = TransactionSchema.safeParse(data?.transaction ?? data);
    if (!parsed.success) throw new Error("Dados de transação inválidos");

    return parsed.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ocorreu um erro ao criar transação");
  }
}

// Esta função assí­ncrona atualiza os dados de uma transação especí­fica, identificada pelo ID, enviando uma requisição PUT para o endpoint "/portal/transactions/{id}" com os dados da transação a serem atualizados. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
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
      throw new Error("Dados de transação invalidos");
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
      throw new Error(errorData.message || "Falha ao atualizar transacao");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Ocorreu um erro ao atualizar transação");
  }
}
// Esta função assí­ncrona deleta uma transação especí­fica, identificada pelo ID, enviando uma requisição DELETE para o endpoint "/portal/transactions/{id}". Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function deleteTransaction(id: number): Promise<void> {
  try {
    const token = await getUserToken();
    const response = await fetch(`${API_URL}/portal/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Falha ao excluir transação");
  } catch (error) {
    console.error(error);
    throw new Error("Ocorreu um erro ao excluir transação");
  }
}
