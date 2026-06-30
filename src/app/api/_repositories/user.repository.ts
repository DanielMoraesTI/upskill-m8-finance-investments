import db from "@/app/api/_lib/db";
import { RowDataPacket } from 'mysql2';
import { UserModelSchema, type TUserModel } from "@/schemas/userSchema";
import { ResultSetHeader } from 'mysql2';

// ==================================================================================
//                                       SELECTS
// ==================================================================================
// Esta função busca um usuário especí­fico no banco de dados com base no email fornecido, retornando um objeto representando o usuário encontrado ou null se não houver correspondência.
async function findByEmail(email: string): Promise<TUserModel | null> {
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM user WHERE email = ?", [
            email,
        ]);
        if (rows.length === 0) return null;

        const user: TUserModel = {
            id: rows[0].id,
            uuid: rows[0].uuid,
            email: rows[0].email,
            name: rows[0].name,
        };

        const parsed = UserModelSchema.safeParse(user);
        if (!parsed.success) {
            throw new Error("Dados de usuario invalidos no banco de dados");
        }

        return parsed.data;
    } catch (error) {
        console.error("Erro ao buscar usuario por email:", error);
        throw error;
    }
}
// ==================================================================================
//                                       INSERTS
// ==================================================================================
// Esta funçãoo insere um novo usuário no banco de dados com base nos dados fornecidos, retornando o objeto do usuário inserido.
async function insertNewUser(userData: Omit<TUserModel, "id">): Promise<TUserModel> {
    try {
        const [result] = await db.query<ResultSetHeader>("INSERT INTO user (uuid, email, name) VALUES (?, ?, ?)", [
            userData.uuid,
            userData.email,
            userData.name,
        ]);

        const insertedId = result.insertId;
        if (!insertedId || insertedId <= 0) {
            throw new Error("Erro ao criar o utilizador.");
        }

        const user: TUserModel = {
            id: insertedId,
            uuid: userData.uuid,
            email: userData.email,
            name: userData.name,
        };

        return user;
    } catch (error) {
        console.error("Erro ao inserir novo usuario:", error);
        throw error;
    };
}
// ==================================================================================
//                                       DELETES
// ==================================================================================
// Esta função exclui um usuário especí­fico do banco de dados com base no email fornecido.
async function deleteByEmail(email: string): Promise<void> {
    try {
        await db.query("DELETE FROM user WHERE email = ?", [email]);
    } catch (error) {
        console.error("Erro ao excluir usuario por email:", error);
        throw error;
    }
}

const userRepository = {
    findByEmail,
    insertNewUser,
    deleteByEmail,
};

export default userRepository;