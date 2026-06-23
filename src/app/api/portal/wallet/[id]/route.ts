import { patchWalletIncome } from '@/services/walletService';
import { NextResponse } from 'next/server';

interface RouteParams {
    id: string;
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { newIncome } = body;
        const walletId = Number(id);

        if (isNaN(walletId)) {
            return NextResponse.json({
                message: "ID de carteira inválido"
            }, { status: 400 });
        }

        await patchWalletIncome({ walletId, newIncome });

        return NextResponse.json({
            message: "Renda da carteira atualizada com sucesso"
        }, { status: 200 });
    } catch (error) {
        console.error("Error in PATCH /api/wallet/:id:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
         }, { status: 500 });
     }
}