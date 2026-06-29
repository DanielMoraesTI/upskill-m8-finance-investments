// O arquivo db.ts é responsável por configurar e exportar uma conexão com o banco de dados MySQL usando o pacote mysql2/promise. Ele cria um pool de conexões com as credenciais fornecidas pelas variáveis de ambiente, permitindo que outras partes do aplicativo interajam com o banco de dados de forma eficiente.
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_NAME,
  connectionLimit: 10,
  typeCast: function (field, next) {
    if (field.type === "TINY" && field.length === 1) {
      return field.string() === "1";
    }
    return next();
  },
});

export default db;
