import { NextRequest } from "next/dist/server/web/spec-extension/request";
import admin from "../_lib/firebaseAdmin";
import userRepository from "../_repositories/user.repository";
import type { TCreateUser, TUserModel } from "@/schemas/userSchema";

async function createUser(userData: TCreateUser): Promise<TUserModel> {
  // 1. Verificar se o utilizador já existe no banco de dados.
  const existingUser = await userRepository.findByEmail(userData.email);
  if (Array.isArray(existingUser) && existingUser.length > 0) {
    throw new Error("Esse utilizador jÃ¡ existe.");
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
    console.log("Erro ao criar usuário no Firebase:", err);
    const code = (err as admin.FirebaseError).code;
    if (code === "auth/email-already-exists") {
      throw new Error("Esse utilizador jÃ¡ existe.");
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
    console.log("Erro ao criar usuário no banco de dados:", err);
    // Rollback: deleta o user criado no Firebase, já que falhou a criação no DB.
    await admin.auth().deleteUser(firebaseUser.uid);
    await userRepository.deleteByEmail(userData.email);
    throw new Error("Erro ao registar o utilizador.");
  }
}

async function requireAuth(request: NextRequest): Promise<TUserModel | null> {
  try {
    const token = request.headers.get("Authorization");
    if (!token) return null;

    const idToken = token.split("Bearer ")[1];

    // 1. Validação no Firebase (Garante que a pessoa é quem diz ser)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken || !decodedToken.email) return null;

    // 2. Busca no Banco de Dados (Garante que o utilizador existe sistema)
    const dbUser = await userRepository.findByEmail(decodedToken.email);
    if (!dbUser) return null;

    return dbUser;
  } catch (error) {
    console.error("Erro em requireAuth:", error);
    throw error;
  }
}

const userService = {
  createUser,
  requireAuth,
};
export default userService;
