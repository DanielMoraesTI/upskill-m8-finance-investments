import { NextRequest, NextResponse } from "next/server";
import { WalletListResponseSchema } from "@/schemas/walletSchema";
import { findAllWallets } from "@/app/api/_repositories/wallet.repository";

export async function GET() {
    try {
        // validar o userID

        // fazer a query
        const walletList = await findAllWallets();

        // fazer o parse da response
        const walletListResponse = WalletListResponseSchema.safeParse({
            walletList: walletList || [],
        });

        if (!walletListResponse.success) {
            return NextResponse.json({
                message: "Erro ao processar a resposta do sistema de carteira"
            }, { status: 500 });
        }

        return NextResponse.json(walletListResponse.data, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/wallet:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
         }, { status: 500 });
     }
}

export async function PUT(request: NextRequest) {
    try {
        // validar o userID
        // validar o body da requisição
        // atualizar a entrada na carteira

        return NextResponse.json({
            message: "Entrada de carteira atualizada com sucesso"
        }, { status: 200 });
    } catch (error) {
        console.error("Error in PUT /api/wallet:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
         }, { status: 500 });
     }
}
