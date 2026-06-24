import { NextResponse } from "next/server";
import assetService from "@/app/api/_services/asset.service";
import { PatchCurrentPriceRequestSchema } from "@/schemas/assetSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";

export async function PATCH(request: Request, ctx: RouteContext<'/api/portal/assets/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const assetId = Number(id);

    const parsedBody = PatchCurrentPriceRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse("Novo preço inválido", 400);
    }

    await assetService.updateAssetCurrentPrice(assetId, parsedBody.data.current_price);

    return NextResponse.json(
      { message: "Preço atual do ativo atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PATCH /api/assets/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
