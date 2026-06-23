import { z } from 'zod';
// ==============================================================================
//                                  USER SCHEMAS
// ==============================================================================
// Este esquema define a estrutura de um objeto UserModel, incluindo campos como uuid, email e name. Ele utiliza o Zod para validação de tipos e regras específicas, como garantir que o email seja válido e que o nome seja uma string não vazia com um limite máximo de caracteres. O uso do Zod permite a validação consistente dos dados relacionados aos usuários em todo o código.
const UserEmailSchema = z.email("Email inválido");
const UserNameSchema = z.string().min(1, "O nome é obrigatório").max(50, "O nome deve conter no máximo 100 caracteres");

export const UserModelSchema = z.object({
    uuid: z.string(),
    email: UserEmailSchema,
    name: UserNameSchema,
});
// ==============================================================================
//                                  USER TYPES
// ==============================================================================
// Estes tipos são inferidos a partir dos esquemas Zod definidos anteriormente, permitindo que sejam utilizados em todo o código para garantir a consistência dos dados relacionados aos usuários. O tipo TUserCredential representa as credenciais de um usuário para autenticação, enquanto o tipo TCreateUser representa os dados necessários para criar um novo usuário. O tipo TCreateUserRequest representa a estrutura da requisição para criar um usuário, e o tipo TUserModel representa a estrutura de um objeto de usuário completo. O uso desses tipos facilita a tipagem e validação em funções e componentes que lidam com dados de usuários, garantindo a segurança e consistência dos dados em todo o aplicativo.
export const UserCredentialSchema = z.object({
    email: UserEmailSchema,
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres").max(100, "A senha deve conter no máximo 100 caracteres"),
});
// Este esquema estende o UserCredentialSchema para incluir o campo name, que é necessário para criar um novo usuário. Ele utiliza o Zod para validação, garantindo que os dados de criação de usuário sejam consistentes e sigam as regras definidas para email, senha e nome.
export const CreateUserSchema = UserCredentialSchema.extend({
    name: UserNameSchema
});
// Este esquema define a estrutura da requisição para criar um novo usuário, que inclui um campo user do tipo CreateUserSchema. Ele utiliza o Zod para validação, garantindo que a requisição de criação de usuário siga a estrutura esperada e permita a manipulação segura dos dados relacionados aos usuários.
export const CreateUserRequestSchema = z.object({
    user: CreateUserSchema
});
// Estes tipos são inferidos a partir dos esquemas Zod definidos anteriormente, representando as estruturas de dados relacionadas aos usuários. O tipo TUserCredential representa as credenciais de um usuário para autenticação, o tipo TCreateUser representa os dados necessários para criar um novo usuário, o tipo TCreateUserRequest representa a estrutura da requisição para criar um usuário, e o tipo TUserModel representa a estrutura de um objeto de usuário completo. O uso desses tipos facilita a tipagem e validação em funções e componentes que lidam com dados de usuários, garantindo a segurança e consistência dos dados em todo o aplicativo.
export type TUserCredential = z.infer<typeof UserCredentialSchema>;
export type TCreateUser = z.infer<typeof CreateUserSchema>;
export type TCreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type TUserModel = z.infer<typeof UserModelSchema>;