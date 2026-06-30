"use client";

// Este componente é o filtro de transações (TransactionFilter), que permite aos usuários filtrar as transações exibidas com base em diferentes critérios, como tipo de operação (compra ou venda) e tipo de ativo (ações, fundos imobiliários, renda fixa).
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
