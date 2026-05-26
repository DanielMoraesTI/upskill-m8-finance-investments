### Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto segunido o modelo abaixo:

```env
#Conexão com o Banco de Dados:

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=finance_investments
```

# Plano de Execução: Dashboard de Inteligência Financeira

Este documento define a ordem de desenvolvimento da plataforma, focando em uma progressão lógica de aprendizado e construção de interface.

---

## 🚩 Milestone 1: Definição de Escopo e Valor de Negócio (CONCLUÍDO)
- **Status:** Concluído.
- **Resultado:** User Stories organizadas por pastas em `/docs`.

## 🚩 Milestone 2: Modelagem de Dados Unificada (O Alicerce)
- **Objetivo:** Criar a estrutura única de banco de dados e popular com dados iniciais.
- **Entregáveis:**
    - Geração do `schema.prisma` com uma tabela central de transações.
    - Script de **Seed** para gerar dados mockados (permitindo visualizar o sistema sem precisar cadastrar nada primeiro).
- **Tecnologia:** Prisma ORM + MySQL.

## 🚩 Milestone 3: Layout e Rotas (Navegação)
- **Objetivo:** Criar a "casca" da aplicação e a lógica de navegação.
- **Entregáveis:**
    - Header global com navegação entre páginas.
    - Controlador de Tema (Dark/Light mode) persistido.
    - Estrutura de rotas no Next.js App Router.
- **Aprendizado:** Context API e LocalStorage.

## 🚩 Milestone 4: Sistema de Login/Signup
- **Objetivo:** O utilizador pode criar uma conta e acessar recursos protegidos da aplicação.
- **Entregáveis:**
    - Controlador de Acesso.
    - Sistema de Signup.
    - Sistema de Login.
- **Aprendizado:** Firebase / NextAuth, JWT, Segurançam Autorização, Autenticação.

## 🚩 Milestone 5: Tabela de Movimentações (Visualização)
- **Objetivo:** Exibir os dados que foram gerados no Seed em uma tabela rica.
- **Entregáveis:**
    - Listagem de todas as transações.
    - Controladores de dados: Filtros (Classe, Tipo, Data) e Ordenação.
- **Aprendizado:** React Query (Fetching) e manipulação de arrays.

## 🚩 Milestone 6: CRUD - Modal de Compra e Venda (Entrada)
- **Objetivo:** Permitir que o usuário adicione novas transações através de uma interface amigável.
- **Entregáveis:**
    - Modal contendo o formulário único de transação.
    - Lógica de salvar no banco e atualizar a tabela.
- **Aprendizado:** Redux (Gerenciamento de estado global do modal/form).

## 🚩 Milestone 7: Dashboard (Área de Gráficos)
- **Objetivo:** Transformar os dados da tabela em visões visuais e gráficas.
- **Entregáveis:**
    - Gráfico de Alocação de Ativos.
    - Cards com resumo do patrimônio total.
    - Termômetro de risco.

## 🚩 Milestone 8: Chatbot de Insights (Inteligência)
- **Objetivo:** Interface de conversação para análise da carteira.
- **Entregáveis:**
    - Interface de chat lateral ou dedicada.
    - Integração com LLM para responder perguntas sobre o histórico.

## 🚩 Milestone 9: Copilot (Extração por Texto)
- **Objetivo:** Facilitar a entrada de dados via processamento de linguagem natural.
- **Entregáveis:**
    - Campo de texto no modal que preenche o formulário automaticamente ao identificar os dados em um parágrafo colado.