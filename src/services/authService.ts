import type {
    TCreateUser,
    TUserCredential,
    TCreateUserRequest,
} from "@/schemas/userSchema";
import { CreateUserSchema, UserCredentialSchema } from "@/schemas/userSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// Esta função assíncrona lida com o processo de cadastro de um novo usuário, validando os dados de entrada, estruturando a requisição para a API e tratando a resposta, lançando erros apropriados em caso de falha.
export async function handleSignup(userData: TCreateUser) {
    // Validar a estrutura de dados do usuário usando o Zod
    const parsed = CreateUserSchema.parse(userData);
    if (!parsed) {
        throw new Error("Dados de usuário inválidos");
    }

    // Garantir a estrutura correta do corpo da requisição para a API
    const requestBody: TCreateUserRequest = {
        user: parsed,
    };

    // Fazer a requisição para a API de cadastro
    const result = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    // Verificar se a resposta da API foi bem-sucedida para prosseguir com o fluxo
    if (!result.ok) {
        throw new Error("Erro ao cadastrar usuário");
    }
};
// Esta função assíncrona lida com o processo de login de um usuário, validando os dados de entrada, estruturando a requisição para a API e tratando a resposta, lançando erros apropriados em caso de falha.
export function userDataFromForm(formData: FormData): TUserCredential | TCreateUser {
    // Extrair os dados de email e senha do FormData e garantir que sejam do tipo string usando zod para validação. Se o campo "name" estiver presente, incluir esse dado na estrutura de criação de usuário, caso contrário, retornar apenas as credenciais para login.
    const userData: TUserCredential = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const name = formData.get("name");
    if (name) {
        const createUserData: TCreateUser = {
            ...userData,
            name: name as string,
        };

        return CreateUserSchema.parse(createUserData);

    }

    return UserCredentialSchema.parse(userData);
}