"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TFii, TRendaFixa, TStock } from "@/schemas/assetSchema";
import type { TTransaction } from "@/schemas/transactionSchema";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditTransactionForm from "@/components/investmentsList/EditTransactionForm";

// --- Types ---
export type TransactionType = "compra" | "venda";
export type TransactionAsset = "acoes" | "fundos-imobiliarios" | "renda-fixa";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Estados para o Dropdown Menu Portal
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ticker = "sigla" in data ? data.sigla : undefined;
  const quantity = "quantidade" in data ? data.quantidade : undefined;
  const unitValue = "valorUnitario" in data ? data.valorUnitario : undefined;
  const fixedIncomeName = "name" in data ? data.name : undefined;
  const assetLabel = fixedIncomeName ?? ticker ?? "Ativo Desconhecido";

  // Fecha o menu de ações ao clicar fora (Idêntico ao WalletCard)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        ((buttonRef.current && buttonRef.current.contains(e.target as Node)) ||
          (mobileButtonRef.current &&
            mobileButtonRef.current.contains(e.target as Node)))
      ) {
        return;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const openMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    isMobile = false,
  ) => {
    e.stopPropagation();
    const targetRef = isMobile ? mobileButtonRef : buttonRef;
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  };

  const handleMenuAction = (action: "editar" | "deletar") => {
    setMenuOpen(false);
    setIsMobileModalOpen(false);
    if (action === "editar") {
      setSheetOpen(true);
    } else if (action === "deletar") {
      onDelete?.(data.id);
    }
  };

  return (
    <>
      {/* 1. VISÃO DESKTOP (Inalterada) */}
      <div className="hidden md:block w-full">
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
                    ? "bg-emerald-200 text-black border-emerald-500"
                    : "bg-red-200 text-black border-red-500",
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

            <div className="flex-1" />

            {/* Botão de Menu Desktop */}
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 transition-all"
              onClick={(e) => openMenu(e, false)}
              aria-label="Ações da transação"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2. VISÃO CARD MOBILE (Corrigido para exibir o valor à direita) */}
      <div
        className="md:hidden w-full"
        onClick={() => setIsMobileModalOpen(true)}
      >
        <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm active:bg-muted/30 transition-colors cursor-pointer">
          <CardContent className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Tipo */}
              <div className="shrink-0">
                {isCompra ? (
                  <div className="p-1.5 rounded-full bg-emerald-200 text-black border border-emerald-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-full bg-red-200 text-black border border-red-500">
                    <TrendingDown className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              {/* Nome ou Sigla */}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  {isRendaFixa ? "Nome" : "Sigla"}
                </span>
                <span className="text-sm font-bold text-foreground truncate">
                  {isRendaFixa ? fixedIncomeName : ticker}
                </span>
              </div>
            </div>

            {/* Valor à direita adicionado com sucesso */}
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Valor
              </span>
              <span
                className={cn(
                  "text-sm font-bold mt-0.5",
                  isCompra ? "text-chart-1" : "text-chart-5",
                )}
              >
                {formatCurrency(data.valorTotal)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MODAL MOBILE COMPLETO (Com "X" à esquerda e "..." à direita) */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:hidden">
          <Card className="w-full max-w-sm bg-card border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Topo do Modal padronizado com o WalletCard */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Detalhes
              </span>
              <Button
                ref={mobileButtonRef}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => openMenu(e, true)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Conteúdo Detalhado Empilhado */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Tipo
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 w-fit text-xs font-semibold flex items-center gap-1 border px-2 py-0.5 rounded-full",
                      isCompra
                        ? "bg-emerald-200 text-black border-emerald-500"
                        : "bg-red-200 text-black border-red-500",
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
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Data
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-1">
                    {formatDate(data.data)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  {isRendaFixa ? "Nome do Ativo" : "Sigla"}
                </span>
                <span
                  className={cn(
                    "text-base font-bold mt-0.5",
                    isRendaFixa ? "text-foreground" : "text-primary",
                  )}
                >
                  {isRendaFixa ? fixedIncomeName : ticker}
                </span>
              </div>

              {!isRendaFixa && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Quantidade
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                      {quantity?.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Valor Unitário
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                      {unitValue ? formatCurrency(unitValue) : "--"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col pt-2 border-t border-border/40">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  Valor Total
                </span>
                <span
                  className={cn(
                    "text-lg font-bold mt-0.5",
                    isCompra ? "text-chart-1" : "text-chart-5",
                  )}
                >
                  {formatCurrency(data.valorTotal)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 4. PORTAL DROP MENU (Compartilhado globalmente via Portal) */}
      {menuOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-9999 min-w-40 rounded-lg border border-border/50 bg-popover shadow-lg py-1"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => handleMenuAction("editar")}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" /> Editar
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => handleMenuAction("deletar")}
            >
              <Trash2 className="h-4 w-4 text-destructive" /> Deletar
            </button>
          </div>,
          document.body,
        )}

      {/* 5. SHEET DE EDIÇÃO */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Editar Transação</SheetTitle>
          </SheetHeader>
          <EditTransactionForm
            transaction={transaction}
            assetLabel={assetLabel}
            isRendaFixa={isRendaFixa}
            onSuccess={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
