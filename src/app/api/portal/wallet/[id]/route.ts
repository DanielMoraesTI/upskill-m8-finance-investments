import { NextRequest, NextResponse } from "next/server";
import walletService from "@/app/api/_services/wallet.service";
import {
  UpdateWalletIncomeRequestSchema,
  WalletSchema,
} from "@/schemas/walletSchema";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import userService from "@/app/api/_services/user.service";
// Esta função assíncrona processa as requisições PATCH para o endpoint "/api/portal/wallet/[id]", permitindo que o usuário autorizado atualize o rendimento de uma carteira específica com base no ID fornecido. Ela valida o ID do usuário, o corpo da requisição e trata erros de rede, retornando respostas apropriadas em caso de falha.
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/wallet/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const walletId = Number(id);

    const parsedIncome = UpdateWalletIncomeRequestSchema.safeParse(body);

    if (!parsedIncome.success) {
      return errorResponse("Rendimento inválido", 400);
    }

    await walletService.updateWalletIncome(
      authorizedUser.id,
      walletId,
      parsedIncome.data.income,
    );

    return NextResponse.json(
      { message: "Rendimento atualizado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro em PATCH /api/wallet/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
// Esta função assíncrona processa as requisições PUT para o endpoint "/api/portal/wallet/[id]", permitindo que o usuário autorizado atualize os dados de uma carteira específica com base no ID fornecido. Ela valida o ID do usuário, o corpo da requisição e trata erros de rede, retornando respostas apropriadas em caso de falha.
export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/portal/wallet/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    // validar o userID
    const authorizedUser = await userService.requireAuth(request);
    if (!authorizedUser) {
      return errorResponse("Não autorizado", 401);
    }

    const walletId = Number(id);

    if (id === undefined || isNaN(walletId)) {
      return errorResponse("ID da carteira inválido", 400);
    }

    const parsedWallet = WalletSchema.safeParse(body);

    if (!parsedWallet.success) {
      return errorResponse("Dados da carteira inválidos", 400);
    }

    const updatedWallet = await walletService.updateWalletData(
      authorizedUser.id,
      parsedWallet.data,
    );

    return NextResponse.json({ updatedWallet }, { status: 200 });
  } catch (error) {
    console.error("Erro em PUT /api/wallet/:id:", error);
    return errorResponse("Erro ao processar a solicitação", 500);
  }
}
