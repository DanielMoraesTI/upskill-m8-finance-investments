import { NextResponse } from 'next/server';
import { AssetListResponseSchema } from "@/schemas/assetSchema";
import { findAllAssets, findAllAssetTypes } from "@/app/api/_repositories/asset.repository";

export async function GET() {
    try {
        // validar o userID

        // fazer a query
        const assetTypeList = await findAllAssetTypes();
        const assetList = await findAllAssets();

        // fazer o parse da response
        const assetListResponse = AssetListResponseSchema.safeParse({
            assetTypeList: assetTypeList || [],
            assetList: assetList || [],
        });

        if (!assetListResponse.success) {
            return NextResponse.json({
                message: "Erro ao processar a resposta do sistema de ativos"
            }, { status: 500 });
        }

        return NextResponse.json(assetListResponse.data, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/assets:", error);
        return NextResponse.json({
            message: "Erro ao processar a solicitação"
        }, { status: 500 });
    }
}

