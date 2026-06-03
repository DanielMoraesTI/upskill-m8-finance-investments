import { NextRequest, NextResponse } from 'next/server';
import { CreateUserRequestSchema } from '@/schemas/userSchema';
import userService from '../_services/user.service';
import type { TUserModel } from '@/schemas/userSchema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = CreateUserRequestSchema.parse(body);
        if (!parsed) {
            return NextResponse.json({
                message: "Dados de usuário inválidos"
            }, { status: 400 });
        }

        const user: TUserModel = await userService.createUser(parsed.user);
        return NextResponse.json({
            message: "Usuário cadastrado com sucesso",
            user
        })
    } catch (err) {
        console.error("Error in POST /api/signup:", err);
        return NextResponse.json({
            message: "Erro ao processar a requisição"
        }, { status: 500 });
    }
}