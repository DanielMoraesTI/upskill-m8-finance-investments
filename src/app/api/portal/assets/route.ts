import { NextRequest, NextResponse } from 'next/server';
import { AssetListResponseSchema } from "@/schemas/assetSchema";
import assetService from "@/app/api/_services/asset.service";
import userService from '../../_services/user.service';
import { errorResponse } from "@/app/api/_utils/serverUtils";

export async function GET(request: NextRequest) {
    try {
        // validar o userID
        const authorizedUser = await userService.requireAuth(request);
        if (!authorizedUser) {
            return errorResponse("Não autorizado", 401);
        }

        // fazer a query
        const assetTypeList = await assetService.getAssetTypes();
        const assetList = await assetService.getAllAssets();

        // fazer o parse da response
        const assetListResponse = AssetListResponseSchema.safeParse({
            assetTypeList: assetTypeList || [],
            assetList: assetList || [],
        });

        if (!assetListResponse.success) {
            return errorResponse("Erro ao processar a resposta do sistema de ativos", 500);
        }

        return NextResponse.json(assetListResponse.data, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/portal/assets:", error);
        return errorResponse("Erro ao processar a solicitação", 500);
    }
}

