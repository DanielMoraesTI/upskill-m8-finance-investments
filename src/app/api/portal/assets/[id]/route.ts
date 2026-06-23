import { NextResponse } from "next/server";
import { updateAssetCurrentPrice } from "@/app/api/_repositories/asset.repository";

type RouteContext = { params: Promise<{ id: string }> };
// Esta função assíncrona lida com requisições PATCH para o endpoint "/api/portal/assets/:id". Ela atualiza o preço atual de um ativo específico, identificado pelo ID, e retorna uma resposta JSON indicando o sucesso da operação. Em caso de erros, ela captura e registra o erro, retornando uma resposta JSON com uma mensagem de erro apropriada e um status HTTP 400 ou 500, dependendo do tipo de erro.
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const incomingPrice = body.current_price ?? body.newPrice;
    const assetId = Number(id);
    const newPrice = Number(incomingPrice);

    if (isNaN(assetId) || isNaN(newPrice) || newPrice < 0) {
      return NextResponse.json(
        { message: "ID de ativo inválido" },
        { status: 400 },
      );
    }

    await updateAssetCurrentPrice(assetId, newPrice);

    return NextResponse.json(
      { message: "Preço atual do ativo atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PATCH /api/assets/:id:", error);
    return NextResponse.json(
      { message: "Erro ao processar a solicitação" },
      { status: 500 },
    );
  }
}
