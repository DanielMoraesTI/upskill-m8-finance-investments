import { NextRequest, NextResponse } from "next/server";
import { TWalletListResponse } from "@/schemas/walletSchema";
import walletService from "@/app/api/_services/wallet.service";
import { errorResponse } from "@/app/api/_utils/serverUtils";
import userService from "@/app/api/_services/user.service";

export async function GET(request: NextRequest) {
    try {
        // validar o userID
        const authorizedUser = await userService.requireAuth(request);
        if (!authorizedUser) {
            return errorResponse("Não autorizado", 401);
        }

        const walletList = await walletService.getAllWallets(authorizedUser.id);

        const response: TWalletListResponse = {
            walletList: walletList,
        }
    
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/wallet:", error);
        return errorResponse("Erro ao processar a solicitação", 500);
     }
}

