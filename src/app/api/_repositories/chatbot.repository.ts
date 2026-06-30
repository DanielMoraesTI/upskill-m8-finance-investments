import type { TMessage } from "@/schemas/chatbotSchema";
import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ==================================================================================
//                                        SELECTS
// ==================================================================================
// Esta função busca todas as mensagens de uma conversa especí­fica no banco de dados com base no ID do usuário e no ID da conversa fornecidos, retornando um array de objetos representando cada mensagem encontrada.
async function findMessagesByConversationId(
  userId: number,
  conversationId: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id conversationId, c.title, c.created_at conversationCreatedAt,c.updated_at conversationUpdatedAt,
            m.id messageId, m.role, m.content, m.created_at messageCreatedAt
            FROM conversation c, message m
            WHERE c.id = m.conversation_id AND c.id = ? AND c.user_id = ? ORDER BY m.created_at DESC
        `,
      [conversationId, userId],
    );
    return rows;
  } catch (error) {
    console.error("Erro ao buscar mensagens por id da conversa:", error);
    throw error;
  }
}
// Esta função busca um resumo de todas as conversas de um usuário especí­fico no banco de dados com base no ID do usuário fornecido, retornando um array de objetos representando cada conversa encontrada.
async function findAllConversationSummary(
  userId: number,
): Promise<RowDataPacket[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id, c.title, c.updated_at
            FROM conversation c
            WHERE c.user_id = ?
            ORDER BY c.updated_at DESC
        `,
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Erro ao buscar resumo das conversas:", error);
    throw error;
  }
}

// ==================================================================================
//                                        INSERTS
// ==================================================================================
// Esta função cria uma nova conversa no banco de dados com base no ID do usuário e no tí­tulo fornecidos, retornando o resultado da operação de inserção.
async function createConversation(
  userId: number,
  title: string,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO conversation (title, user_id) VALUES (?, ?)`,
      [title, userId],
    );
    return result;
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    throw error;
  }
}
// Esta função cria uma nova mensagem no banco de dados com base no ID da conversa, no papel do remetente e no conteúdo da mensagem fornecidos, retornando o resultado da operação de inserção.
async function createMessage(
  args: Omit<TMessage, "id" | "createdAt">,
): Promise<ResultSetHeader> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO message (conversation_id, role, content) VALUES (?, ?, ?)`,
      [args.conversationId, args.role, args.content],
    );
    return result;
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    throw error;
  }
}

// ==================================================================================
//                                        UPDATES
// ==================================================================================
// Esta função atualiza o timestamp de atualização de uma conversa especí­fica no banco de dados com base no ID da conversa fornecido, retornando void.
async function updateConversationTimestamp(
  conversationId: number,
): Promise<void> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE conversation SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [conversationId],
    );
    if (result.affectedRows === 0) {
      throw new Error("Falha ao atualizar horario da conversa");
    }
  } catch (error) {
    console.error("Erro ao atualizar horário da conversa:", error);
    throw error;
  }
}

// ==================================================================================
//                                        DELETES
// ==================================================================================
// Esta função exclui uma conversa especí­fica do banco de dados com base no ID do usuário e no ID da conversa fornecidos, retornando um booleano indicando se a exclusão foi bem-sucedida.
async function deleteConversation(
  userId: number,
  conversationId: number,
): Promise<boolean> {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM conversation WHERE id = ? AND user_id = ?`,
      [conversationId, userId],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Erro ao excluir conversa:", error);
    throw error;
  }
}

const chatbotRepository = {
  findMessagesByConversationId,
  findAllConversationSummary,
  createConversation,
  createMessage,
  updateConversationTimestamp,
  deleteConversation,
};
export default chatbotRepository;
