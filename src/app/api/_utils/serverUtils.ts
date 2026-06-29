import { NextResponse } from "next/server";
// Esta função cria uma resposta de erro padronizada para ser retornada em caso de falha em uma requisição, recebendo uma mensagem de erro e um código de status HTTP como parâmetros. Ela retorna um objeto NextResponse contendo a estrutura de resposta JSON com os campos "ok" e "error", além do código de status especificado.
export const errorResponse = (
    message: string,
    statusCode: number
): NextResponse => {
    return NextResponse.json(
        {
            ok: false,
            error: message,
        },
        { status: statusCode }
    );
};
