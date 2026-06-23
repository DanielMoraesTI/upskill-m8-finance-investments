"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TFii, TRendaFixa, TStock } from "@/schemas/assetSchema";
import type { TTransaction } from "@/schemas/transactionSchema";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditTransactionForm from "@/components/investmentsList/EditTransactionForm";

// --- Types ---
export type TransactionType = "compra" | "venda";
export type TransactionAsset = "acoes" | "fundos-imobiliarios" | "renda-fixa";
// Este componente é o cartão de transação (TransactionCard), que exibe as informações de uma transação específica, incluindo o tipo de transação (compra ou venda), o ativo envolvido, o valor total, a data e outras informações relevantes. Ele recebe os dados da transação como props e renderiza essas informações de forma clara e organizada, utilizando elementos visuais como badges para destacar o tipo de transação e cores para diferenciar entre compra e venda. O TransactionCard também inclui botões para editar ou deletar a transação, permitindo que os usuários gerenciem suas transações de forma eficiente. Ao clicar no botão de editar, um Sheet é aberto com um formulário pré-configurado para editar as informações da transação, enquanto o botão de deletar aciona uma função para remover a transação. O TransactionCard é essencial para fornecer uma visão clara e acessível das transações dos usuários, facilitando o acompanhamento e a gestão de suas operações financeiras dentro do portal de investimentos. Ele melhora a experiência do usuário ao permitir que eles visualizem facilmente os detalhes de cada transação e realizem ações de edição ou exclusão de forma rápida e intuitiva, contribuindo para uma gestão eficiente de suas transações financeiras. O TransactionCard é um componente fundamental para a interface do usuário do portal de investimentos, garantindo que as informações sejam apresentadas de maneira clara e que os usuários tenham controle total sobre suas transações, melhorando a usabilidade e a satisfação geral dos usuários ao interagir com o portal de investimentos. Ele é projetado para ser responsivo e se adaptar a diferentes tamanhos de tela, garantindo que os usuários possam acessar facilmente as informações de suas transações em dispositivos móveis e desktops.
type BaseTransactionCardData = {
  id: string;
  tipo: TransactionType;
  asset: TransactionAsset;
  valorTotal: TTransaction["total_value"];
  data: TTransaction["date"];
};

type VariableIncomeTransactionCardData = BaseTransactionCardData & {
  asset: "acoes" | "fundos-imobiliarios";
  sigla: TStock["ticker"] | TFii["ticker"];
  quantidade: TTransaction["quantity"];
  valorUnitario: TTransaction["unit_price"];
};

type FixedIncomeTransactionCardData = BaseTransactionCardData & {
  asset: "renda-fixa";
  name: TRendaFixa["company"];
};

export type TransactionCardData =
  | VariableIncomeTransactionCardData
  | FixedIncomeTransactionCardData;

interface TransactionCardProps {
  data: TransactionCardData;
  transaction: TTransaction;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// --- Component ---
export function TransactionCard({
  data,
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isRendaFixa = data.asset === "renda-fixa";
  const isCompra = data.tipo === "compra";
  const [ sheetOpen, setSheetOpen ] = useState(false);
  const ticker = "sigla" in data ? data.sigla : undefined;
  const quantity = "quantidade" in data ? data.quantidade : undefined;
  const unitValue = "valorUnitario" in data ? data.valorUnitario : undefined;
  const fixedIncomeName = "name" in data ? data.name : undefined;
  const assetLabel = fixedIncomeName ?? ticker ?? "Ativo Desconecido";

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
        {/* Tipo: Compra / Venda */}
        <div className="flex flex-col w-22 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Tipo
          </span>
          <Badge
            variant="outline"
            className={cn(
              "mt-1 w-fit text-xs font-semibold flex items-center gap-1 border px-2 py-0.5 rounded-full",
              isCompra
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/50"
                : "bg-rose-950/50 text-rose-400 border-rose-800/50",
            )}
          >
            {isCompra ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isCompra ? "Compra" : "Venda"}
          </Badge>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Sigla / Nome */}
        <div className="flex flex-col w-45 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {isRendaFixa ? "Nome" : "Sigla"}
          </span>
          <span
            className={`text-sm font-bold mt-1 truncate ${isRendaFixa ? "text-foreground" : "text-primary"}`}
            title={isRendaFixa ? fixedIncomeName : ticker}
          >
            {isRendaFixa ? fixedIncomeName : ticker}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Quantidade */}
        <div className="flex flex-col w-25 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {!isRendaFixa ? "Quantidade" : "\u00A0"}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa ? quantity?.toLocaleString("pt-BR") : "--"}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Unitário */}
        <div className="flex flex-col w-32.5 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {!isRendaFixa ? "Valor Unitário" : ""}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa && unitValue ? formatCurrency(unitValue) : "--"}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Total */}
        <div className="flex flex-col w-32.5 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Total
          </span>
          <span
            className={`text-sm font-bold mt-1 ${isCompra ? "text-chart-1" : "text-chart-5"}`}
          >
            {formatCurrency(data.valorTotal)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Data */}
        <div className="flex flex-col w-25 shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Data
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatDate(data.data)}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
      <div className="flex items-center gap-2">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Editar Transação</SheetTitle>
            </SheetHeader>
            <EditTransactionForm
              transaction={transaction}
              assetLabel={assetLabel}
              onSuccess={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(data.id)}
          className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Deletar
        </Button>
      </div>
      </CardContent>
    </Card>
  );
}
