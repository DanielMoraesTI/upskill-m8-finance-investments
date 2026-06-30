import { NextRequest, NextResponse } from 'next/server';
import { AssetListResponseSchema } from "@/schemas/assetSchema";
import assetService from "@/app/api/_services/asset.service";
import userService from '../../_services/user.service';
import { errorResponse } from "@/app/api/_utils/serverUtils";
// Esta função assí­ncrona busca a lista de tipos de ativos e a lista de ativos disponí­veis, enviando uma requisição GET para o endpoint "/api/portal/assets". Ela valida o ID do usuário autorizado, trata erros de rede e valida a resposta, retornando respostas apropriadas em caso de falha.
export async function GET(request: NextRequest) {
    try {
        // validar o userID
        const authorizedUser = await userService.requireAuth(request);
        if (!authorizedUser) {
            return errorResponse("NÃ£o autorizado", 401);
        }

        // fazer a query. Query é usada para buscar dados do banco de dados ou de um serviço externo, retornando os resultados da consulta.
        const assetTypeList = await assetService.getAssetTypes();
        const assetList = await assetService.getAllAssets();

        // fazer o parse da response. safeParse é usado para validar a resposta e garantir que ela esteja no formato esperado, evitando erros de tipo ou estrutura.
        const assetListResponse = AssetListResponseSchema.safeParse({
            assetTypeList: assetTypeList || [],
            assetList: assetList || [],
        });

        if (!assetListResponse.success) {
            return errorResponse("Erro ao processar a resposta do sistema de ativos", 500);
        }

        return NextResponse.json(assetListResponse.data, { status: 200 });

    } catch (error) {
        console.error("Erro em GET /api/portal/assets:", error);
        return errorResponse("Erro ao processar a solicitaÃ§Ã£o", 500);
    }
}

