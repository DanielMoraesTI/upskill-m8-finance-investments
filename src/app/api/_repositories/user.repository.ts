import db from "@/app/api/_lib/db";
import { RowDataPacket } from 'mysql2';
import { UserModelSchema, type TUserModel } from "@/schemas/userSchema";
import { ResultSetHeader } from 'mysql2';

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
            throw new Error("Invalid user data from database");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

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
        console.error("Error inserting new user:", error);
        throw error;
    };
}

async function deleteByEmail(email: string): Promise<void> {
    try {
        await db.query("DELETE FROM user WHERE email = ?", [email]);
    } catch (error) {
        console.error("Error deleting user by email:", error);
        throw error;
    }
}

const userRepository = {
    findByEmail,
    insertNewUser,
    deleteByEmail,
};

export default userRepository;