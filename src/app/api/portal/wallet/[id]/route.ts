import { NextRequest, NextResponse } from "next/server";
import walletService from "@/app/api/_services/wallet.service";
import { UpdateWalletIncomeRequestSchema, WalletSchema } from "@/schemas/walletSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/portal/wallet/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const walletId = Number(id);

    const parsedIncome = UpdateWalletIncomeRequestSchema.safeParse(body);

    if (!parsedIncome.success) {
      return errorResponse("Rendimento inválido", 400);
    }

    await walletService.updateWalletIncome(walletId, parsedIncome.data.income);

    return NextResponse.json(
      { message: "Rendimento atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PATCH /api/wallet/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/portal/wallet/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const walletId = Number(id);

    if (id === undefined || isNaN(walletId)) {
      return errorResponse("ID da carteira inválido", 400);
    }

    const parsedWallet = WalletSchema.safeParse(body);

    if (!parsedWallet.success) {
      return errorResponse("Dados da carteira inválidos", 400);
    }

    const updatedWallet = await walletService.updateWalletData(parsedWallet.data);

    return NextResponse.json(
      { updatedWallet },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT /api/wallet/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}