# 🚀 UPskill - Módulo 08 Projeto Final

* [Visitar Repositório no GitHub.](https://github.com/DanielMoraesTI/upskill-m8-finance-investments)

## 👥 Autores
* **Daniel Moraes**: [@DanielMoraesTI](https://github.com/DanielMoraesTI)
* **Gabriel Panta**: [@devgabrielpanta](https://www.github.com/devgabrielpanta)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar e Instalar
```bash
git clone https://github.com/DanielMoraesTI/upskill-m8-finance-investments.git
cd upskill-m8-finance-investments
pnpm install
```


### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
#Conexão com o Banco de Dados:
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=finance_investments

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID="[SEU_PROJECT_ID]"
FIREBASE_ADMIN_CLIENT_EMAIL="[SEU_CLIENT_EMAIL]"
FIREBASE_ADMIN_PRIVATE_KEY="[SUA_PRIVATE_KEY]"

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="[SUA_API_KEY]"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="[SEU_AUTH_DOMAIN]"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="[SEU_PROJECT_ID]"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="[SEU_STORAGE_BUCKET]"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="[SEU_MESSAGING_SENDER_ID]"
NEXT_PUBLIC_FIREBASE_APP_ID="[SEU_APP_ID]"
```

### 3. Configurar e Popular o Banco de Dados
Certifique-se de que o seu Mysql está rodando e execute:
* Criação do Banco de Dados: database/finance_investments_mysql.sql
* Mockagem de dados: database/mock-data.sql

### 4. Rodar a Aplicação
```bash
pnpm dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.