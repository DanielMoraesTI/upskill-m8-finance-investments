import { NextRequest, NextResponse } from "next/server";
import {
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

interface RouteParams {
  id: string;
}

export async function PUT(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { walletId, assetId, quantity, price, date } = body;
    const transactionId = Number(id);

    // Validar os dados de entrada
    if (isNaN(transactionId)) {
      return NextResponse.json(
        {
          message: "ID de transação inválido",
        },
        { status: 400 },
      );
    }
    if (isNaN(walletId) || isNaN(assetId) || isNaN(quantity) || isNaN(price)) {
      return NextResponse.json(
        {
          message: "Dados de transação inválidos",
        },
        { status: 400 },
      );
    }

    await updateTransaction(transactionId, {
      asset_id: assetId,
      quantity,
      unit_price: price,
      date,
    });

    return NextResponse.json(
      {
        message: "Transação atualizada com sucesso",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT /api/transactions/:id:", error);
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = params;
    const transactionId = Number(id);
    if (isNaN(transactionId)) {
      return NextResponse.json(
        {
          message: "ID de transação inválido",
        },
        { status: 400 },
      );
    }
    await deleteTransaction(transactionId);
    return NextResponse.json(
      {
        message: "Transação deletada com sucesso",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in DELETE /api/transactions/:id:", error);
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    );
  }
}