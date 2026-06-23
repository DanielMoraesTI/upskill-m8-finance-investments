import { NextResponse } from "next/server";

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
