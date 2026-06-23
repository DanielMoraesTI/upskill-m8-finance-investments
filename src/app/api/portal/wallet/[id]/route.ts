import { NextResponse } from "next/server";
import { updateWalletIncome } from "@/app/api/_repositories/wallet.repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const walletId = Number(id);
    const newIncome = Number(body.newIncome);

    if (isNaN(walletId) || isNaN(newIncome)) {
      return NextResponse.json(
        { message: "ID da carteira ou rendimento inválido" },
        { status: 400 },
      );
    }

    await updateWalletIncome(walletId, newIncome);

    return NextResponse.json(
      { message: "Rendimento atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PATCH /api/wallet/:id:", error);
    return NextResponse.json(
      { message: "Erro ao processar a solicitação" },
      { status: 500 },
    );
  }
}
