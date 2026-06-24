import { NextResponse } from "next/server";
import { TWalletListResponse } from "@/schemas/walletSchema";
import walletService from "@/app/api/_services/wallet.service";
import { errorResponse } from "@/app/api/_utils/serverUtils";


export async function GET() {
    try {
        // validar o userID

        const walletList = await walletService.getAllWallets();

        const response: TWalletListResponse = {
            walletList: walletList,
        }
    
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/wallet:", error);
        return errorResponse("Erro ao processar a solicitação", 500);
     }
}

