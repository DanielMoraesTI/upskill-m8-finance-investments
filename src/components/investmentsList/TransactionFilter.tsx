"use client";

// Este componente é o filtro de transações (TransactionFilter), que permite aos usuários filtrar as transações exibidas com base em diferentes critérios, como tipo de operação (compra ou venda) e tipo de ativo (ações, fundos imobiliários, renda fixa). Ele recebe o filtro atual e uma função para atualizar o filtro como props, e renderiza uma série de botões para cada opção de filtro. O TransactionFilter é essencial para melhorar a experiência do usuário ao permitir que eles visualizem apenas as transações relevantes para suas necessidades, facilitando a análise e o gerenciamento de suas operações financeiras. Ele é projetado para ser responsivo e se adaptar a diferentes tamanhos de tela, garantindo que os usuários possam acessar facilmente os filtros em dispositivos móveis e desktops. O TransactionFilter é uma parte fundamental da interface do usuário do portal de investimentos, proporcionando uma maneira eficiente e intuitiva para os usuários personalizarem a exibição de suas transações e se concentrarem nas informações mais importantes para eles. Ele é implementado com uma abordagem flexível, permitindo que novos filtros sejam adicionados facilmente no futuro, garantindo que o componente possa evoluir junto com as necessidades dos usuários e as funcionalidades do aplicativo. O TransactionFilter é um componente chave para a usabilidade do portal de investimentos, melhorando a experiência geral do usuário ao
export type FilterType =
  | "all"
  | "compra"
  | "venda"
  | "acoes"
  | "fiis"
  | "renda_fixa";

interface TransactionFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}
// Este componente é o filtro de transações (TransactionFilter), que permite aos usuários filtrar as transações exibidas com base em diferentes critérios, como tipo de operação (compra ou venda) e tipo de ativo (ações, fundos imobiliários, renda fixa). Ele recebe o filtro atual e uma função para atualizar o filtro como props, e renderiza uma série de botões para cada opção de filtro. O TransactionFilter é essencial para melhorar a experiência do usuário ao permitir que eles visualizem apenas as transações relevantes para suas necessidades, facilitando a análise e o gerenciamento de suas operações financeiras. Ele é projetado para ser responsivo e se adaptar a diferentes tamanhos de tela, garantindo que os usuários possam acessar facilmente os filtros em dispositivos móveis e desktops. O TransactionFilter é uma parte fundamental da interface do usuário do portal de investimentos, proporcionando uma maneira eficiente e intuitiva para os usuários personalizarem a exibição de suas transações e se concentrarem nas informações mais importantes para eles. Ele é implementado com uma abordagem flexível, permitindo que novos filtros sejam adicionados facilmente no futuro, garantindo que o componente possa evoluir junto com as necessidades dos usuários e as funcionalidades do aplicativo. O TransactionFilter é um componente chave para a usabilidade do portal de investimentos, melhorando a experiência geral do usuário ao permitir que eles filtrem suas transações de forma eficiente e personalizada, facilitando a análise e o gerenciamento de suas operações financeiras. Ele é projetado para ser fácil de usar e acessível, garantindo que os usuários possam encontrar rapidamente as transações que desejam visualizar, melhorando a eficiência e a satisfação do usuário ao interagir com o portal de investimentos. O TransactionFilter é uma ferramenta essencial para os usuários do portal, permitindo que eles tenham controle total sobre a exibição de suas transações e possam se concentrar nas informações mais relevantes para suas necessidades financeiras. Ele é um componente fundamental para garantir que os usuários possam navegar e gerenciar suas transações de forma eficaz, proporcionando uma experiência de usuário personalizada e eficiente no portal de investimentos.
export function TransactionFilter({
  currentFilter,
  onFilterChange,
}: TransactionFilterProps) {
  // 2. Adicionamos os novos filtros aqui na lista
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "compra", label: "Compras" },
    { key: "venda", label: "Vendas" },
    { key: "acoes", label: "Ações" },
    { key: "fiis", label: "Fundos Imobiliários" },
    { key: "renda_fixa", label: "Renda Fixa" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2 justify-center">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.key;

        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer select-none transition-all duration-150
              border focus:outline-none active:scale-95
              ${
                isActive
                  ? filter.key === "compra"
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-sm"
                    : filter.key === "venda"
                      ? "bg-rose-950/80 text-rose-400 border-rose-800/60 shadow-sm"
                      : filter.key === "all"
                        ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                        : "bg-blue-950/80 text-blue-400 border-blue-800/60 shadow-sm"
                  : "bg-muted/30 text-muted-foreground/60 border-border/40 hover:bg-muted/50 hover:text-foreground hover:border-border/70"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
