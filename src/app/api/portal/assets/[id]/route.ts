import { NextResponse } from 'next/server';
import { patchCurrentPrice } from '@/services/assetService';

interface RouteParams {
    id: string;
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { newPrice } = body;
        const assetId = Number(id);

        if (isNaN(assetId)) {
            return NextResponse.json({
                message: "ID de ativo inválido"
            }, { status: 400 });
        }

        await patchCurrentPrice({ assetId, newPrice });

        return NextResponse.json({
            message: "Preço atual do ativo atualizado com sucesso"
        }, { status: 200 });
    } catch (error) {
        console.error("Error in PATCH /api/assets/:id:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
         }, { status: 500 });
     }
}

