import { z } from 'zod';

const UserEmailSchema = z.email("Email inválido");
const UserNameSchema = z.string().min(1, "O nome é obrigatório").max(50, "O nome deve conter no máximo 100 caracteres");

export const UserModelSchema = z.object({
    uuid: z.string(),
    email: UserEmailSchema,
    name: UserNameSchema,
});

export const UserCredentialSchema = z.object({
    email: UserEmailSchema,
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres").max(100, "A senha deve conter no máximo 100 caracteres"),
});

export const CreateUserSchema = UserCredentialSchema.extend({
    name: UserNameSchema
});

export const CreateUserRequestSchema = z.object({
    user: CreateUserSchema
});

export type TUserCredential = z.infer<typeof UserCredentialSchema>;
export type TCreateUser = z.infer<typeof CreateUserSchema>;
export type TCreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type TUserModel = z.infer<typeof UserModelSchema>;