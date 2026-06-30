# UPskill - Módulo 08 Projeto Final

[Visitar repositório no GitHub](https://github.com/DanielMoraesTI/upskill-m8-finance-investments)

## Objetivo do Projeto

Este projeto foi desenvolvido como entrega final do Módulo 08 do curso UPskill.

A proposta é construir uma aplicação web de gestão de investimentos, permitindo ao usuário:

- acompanhar carteira de ativos;
- registrar compras e vendas;
- visualizar indicadores e gráficos;
- obter insights com apoio de Inteligência Artificial.

O foco acadêmico foi praticar desenvolvimento full stack com integração entre frontend, backend, banco de dados e serviços externos.

## Autores

- Daniel Moraes: [@DanielMoraesTI](https://github.com/DanielMoraesTI)
- Gabriel Panta: [@devgabrielpanta](https://www.github.com/devgabrielpanta)

## Funcionalidades Implementadas

- Autenticação de usuários (login e cadastro) com Firebase Auth.
- Dashboard com resumo da carteira e distribuição por tipos de investimento.
- Página de carteira com listagem de ativos, ordenação e operações de compra.
- Histórico de transações com filtros por tipo e categoria, além de edição/exclusão.
- Módulo de Insights com chat para apoio na análise da carteira (IA).
- Interface responsiva para desktop e mobile.

## Tecnologias Utilizadas

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Base UI / componentes reutilizáveis
- Lucide React (ícones)
- Recharts (gráficos)

### Estado, validação e dados

- Context API
- TanStack React Query
- Zod

### Backend e banco

- Rotas de API com Next.js (App Router)
- MySQL
- mysql2

### Serviços externos

- Firebase Authentication (Client + Admin)
- Google Gemini API

## Escolhas Técnicas do Projeto

- Next.js App Router para concentrar frontend e API no mesmo projeto.
- TypeScript para aumentar segurança de tipos e reduzir erros de integração.
- React Query para controle de cache, loading e sincronização com API.
- Zod para validar dados de entrada e saída com mais confiabilidade.
- MySQL por ser um banco relacional consolidado e adequado ao domínio financeiro.
- Firebase Auth para simplificar autenticação e fluxo de sessão.

## Estrutura Geral

- src/app: páginas e rotas da aplicação.
- src/app/api: endpoints, services e repositories do backend.
- src/components: componentes reutilizáveis e componentes de domínio.
- src/context: provedores globais de estado.
- src/services: camada de consumo de API no frontend.
- src/schemas: contratos e validações com Zod.
- database: scripts SQL de criação e carga inicial.

## Como Executar o Projeto

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/DanielMoraesTI/upskill-m8-finance-investments.git
cd upskill-m8-finance-investments
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Conexao com banco de dados
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=finance_investments

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID="SEU_PROJECT_ID"
FIREBASE_ADMIN_CLIENT_EMAIL="SEU_CLIENT_EMAIL"
FIREBASE_ADMIN_PRIVATE_KEY="SUA_PRIVATE_KEY"

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"

# Gemini API
GEMINI_API_KEY=SUA_API_KEY
GEMINI_MODEL_NAME=MODELO_A_SER_USADO
```

Observação: se a chave privada do Firebase estiver em uma única linha, mantenha o formato aceito pelo SDK e respeite a quebra de linha conforme documentação.

### 3. Configurar e popular banco de dados

Com o MySQL em execução, aplique os scripts:

- database/finance_investments_mysql.sql
- database/mock-data.sql

### 4. Rodar aplicação em ambiente local

```bash
pnpm dev
```

Abra no navegador: [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

```bash
pnpm dev    # ambiente de desenvolvimento
pnpm build  # build de produção
pnpm start  # iniciar build de produção
pnpm lint   # análise estática com ESLint
```

## Resultados Acadêmicos

Durante o desenvolvimento deste projeto, foi possível praticar:

- organização de projeto full stack em camadas;
- integração de autenticação com serviço externo;
- manipulação de dados financeiros com foco em interface e usabilidade;
- criação de visualizações para apoio à tomada de decisão;
- uso de IA como recurso de análise no contexto da aplicação.

## Melhorias Futuras

Antes do roadmap, vale registrar o contexto atual do projeto:

- Projeto concebido para aprendizado e uso pessoal, a partir da identificação de um problema real e da proposta de uma solução prática.
- Este trabalho ainda não está pronto para produção. Em um cenário de uso comercial, serão necessários avanços técnicos em segurança, testes, observabilidade e escalabilidade.

Roadmap de evolução:

- cobertura de testes automatizados;
- paginação e busca avançada nas transações;
- relatórios de desempenho por período;
- melhorias contínuas na experiência do chat de insights.
