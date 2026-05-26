import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute('SELECT 1 as connection_test');
        await connection.end();

        return NextResponse.json(
            {
                success: true,
                message: 'Conexão com o banco de dados bem-sucedida',
                data: rows,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Erro ao conectar ao banco de dados',
                erro: 'Erro ao conectar ao banco de dados',
            },
            { status: 500 }
        );
    }
}