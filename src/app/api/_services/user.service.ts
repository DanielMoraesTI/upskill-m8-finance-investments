import admin from "../_lib/firebaseAdmin";
import userRepository from "../_repositories/user.repository";
import type { TCreateUser, TUserModel } from "@/schemas/userSchema";

async function createUser(userData: TCreateUser): Promise<TUserModel> {
    // 1. Verificar se o utilizador já existe no banco de dados.
    const existingUser = await userRepository.findByEmail(userData.email);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
        throw new Error("Esse utilizador já existe.");
    }

    // 2. Adiciona o utilizador no Firebase e obtém UUID.
    let firebaseUser: admin.auth.UserRecord;

    try {
        firebaseUser = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
        });
    } catch (err) {
        console.log("Error creating user in Firebase:", err);
        const code = (err as admin.FirebaseError).code;
        if (code === "auth/email-already-exists") {
            throw new Error("Esse utilizador já existe.");
        }
        throw new Error("Erro ao criar a conta no Firebase.");
    }

    // 3. Criar o user no banco de dados com o UUID do Firebase.
    try {
        const user = await userRepository.insertNewUser({
            uuid: firebaseUser.uid,
            email: userData.email,
            name: userData.name,
        });


        return user;
    } catch (err) {
        console.log("Error creating user in DB:", err);
        // Rollback: deleta o user criado no Firebase, já que falhou a criação no DB.
        await admin.auth().deleteUser(firebaseUser.uid);
        await userRepository.deleteByEmail(userData.email);
        throw new Error("Erro ao registar o utilizador.");
    }
}

const userService = {
    createUser,
};
export default userService;
