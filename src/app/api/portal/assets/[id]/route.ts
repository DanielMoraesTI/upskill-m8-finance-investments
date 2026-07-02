import { NextRequest, NextResponse } from "next/server";
import assetService from "@/app/api/_services/asset.service";
import walletService from "@/app/api/_services/wallet.service";
import { PatchCurrentPriceRequestSchema } from "@/schemas/assetSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import userService from "@/app/api/_services/user.service";
// Esta função assíncrona atualiza o preço atual de um ativo específico, identificado pelo ID, enviando uma requisição PATCH para o endpoint "/api/portal/assets/[id]" com o novo preço. Ela valida o ID do usuário autorizado, o corpo da requisição e trata erros de rede, retornando respostas apropriadas em caso de falha.
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/assets/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const assetId = Number(id);

    const parsedBody = PatchCurrentPriceRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse("Novo preço inválido", 400);
    }

    await assetService.updateAssetCurrentPrice(
      assetId,
      parsedBody.data.current_price,
    );

    // Mantém o campo "Atualização" da carteira sincronizado ao editar preço atual.
    await walletService.touchWalletUpdatedAtByAssetId(
      authorizedUser.id,
      assetId,
    );

    return NextResponse.json(
      { message: "Preço atual do ativo atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro em PATCH /api/assets/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
