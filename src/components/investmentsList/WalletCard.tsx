"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Pencil,
  History,
  Undo2,
} from "lucide-react";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TWallet } from "@/schemas/walletSchema";
import { useAsset } from "@/context/AssetProvider";

type CardAction = "comprar" | "vender" | "resgatar" | "editar" | "historico";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TradeForm({
  operacao,
  assetLabel,
}: {
  operacao: "comprar" | "vender" | "resgatar";
  assetLabel: string;
}) {
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");

  const total = useMemo(() => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor.replace(",", "."));
    return !isNaN(q) && !isNaN(v) ? q * v : 0;
  }, [quantidade, valor]);

  const isCompra = operacao === "comprar";
  const isResgatar = operacao === "resgatar";
  const canConfirm = quantidade !== "" && valor !== "";

  const colorClass = isCompra
    ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
    : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40";

  const title = isCompra ? "Comprar" : isResgatar ? "Resgatar" : "Vender";
  const subtitle = isCompra
    ? "Registre a compra de cotas"
    : isResgatar
      ? "Registre o resgate"
      : "Registre a venda de cotas";

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground/60">{subtitle}</p>
        <span className="mt-1 inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          {assetLabel}
        </span>
      </div>

      <div className="w-full h-px bg-border/40" />

      <FieldGroup className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel
            htmlFor="trade-quantidade"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Quantidade
          </FieldLabel>
          <Input
            id="trade-quantidade"
            type="number"
            min={1}
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>
        <Field>
          <FieldLabel
            htmlFor="trade-valor"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Valor Unitário (R$)
          </FieldLabel>
          <Input
            id="trade-valor"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel
            htmlFor="trade-total"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Total
          </FieldLabel>
          <Input
            id="trade-total"
            readOnly
            value={total > 0 ? formatBRL(total) : ""}
            placeholder="R$ 0,00"
            className="bg-muted/20 border-border/30 text-chart-1 font-bold cursor-default"
          />
        </Field>
      </FieldGroup>

      <Button
        className={`w-full font-semibold shadow-lg transition-all duration-200 ${colorClass}`}
        disabled={!canConfirm}
        onClick={() => console.log({ operacao, quantidade, valor, total })}
      >
        Confirmar {title}
      </Button>
    </div>
  );
}

export default function WalletCard({ walletItem }: { walletItem: TWallet }) {
  const { currentAssetType, assetList } = useAsset();
  const assetType = currentAssetType?.asset_type || null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [activeSheet, setActiveSheet] = useState<CardAction | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const currentAsset = assetList.find(
    (asset) => asset.id === walletItem.asset_id,
  );

  if (!currentAsset) return null;

  const sigla = "ticker" in currentAsset ? currentAsset.ticker : "XPTO";
  const quantity = walletItem.quantity;
  const companyName =
    "company" in currentAsset ? currentAsset.company : undefined;
  const category =
    "category" in currentAsset ? currentAsset.category : undefined;
  const initialDate = walletItem?.initial_date || "";
  const investedAmount = walletItem.total_invested;
  const actualAmount = (walletItem?.income || 0) + investedAmount;

  const assetLabel =
    assetType === "Renda Fixa" ? (companyName ?? sigla) : sigla;

  const handleMenuAction = (action: CardAction) => {
    setMenuOpen(false);
    setActiveSheet(action);
  };

  const handleEditClick = () => {};
  const handleHistoryClick = () => {};

  if (!assetType) return null;

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
        {/* Sigla — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
          <>
            <div className="flex w-20 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Sigla
              </span>
              <span
                className="mt-1 truncate text-sm font-bold text-primary"
                title={sigla}
              >
                {sigla}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Empresa — acoes */}
        {assetType === "Ação" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Empresa
              </span>
              <Badge
                variant="secondary"
                className="mt-1 inline-flex max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs bg-secondary/60 border-border/40"
                title={companyName}
              >
                {companyName}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Categoria — fundos-imobiliarios */}
        {assetType === "FII" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Categoria
              </span>
              <Badge
                variant="secondary"
                className="mt-1 inline-flex max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs bg-secondary/60 border-border/40"
                title={category}
              >
                {category}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Nome — renda-fixa */}
        {assetType === "Renda Fixa" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Nome
              </span>
              <span
                className="mt-1 truncate text-sm font-semibold text-foreground"
                title={companyName}
              >
                {companyName}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Data Inicial — renda-fixa */}
        {assetType === "Renda Fixa" && (
          <>
            <div className="flex w-28 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Data Inicial
              </span>
              <Badge
                variant="secondary"
                className="mt-1 w-fit text-xs bg-secondary/60 border-border/40"
              >
                {formatDate(initialDate || new Date().toISOString())}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Quantidade — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
          <>
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Quantidade
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {quantity}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Preço Médio — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
          <>
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Preço Médio
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {formatCurrency(investedAmount)}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Preço Atual — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
          <>
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Preço Atual
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {formatCurrency(investedAmount)}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Valor Investido — renda-fixa */}
        {(assetType === "Renda Fixa") && (
        <>
        <div className="flex w-32 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Investido
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground">
            {formatCurrency(investedAmount)}
          </span>
        </div>
        <div className="h-8 w-px bg-border/50" />
        </>
        )}

        {/* Valor Atual */}
        <div className="flex w-32 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Atualizado
          </span>
          <span
            className={`mt-1 text-sm font-bold ${actualAmount >= investedAmount ? "text-chart-1" : "text-chart-5"}`}
          >
            {formatCurrency(actualAmount)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Data Atualização */}
        <div className="flex w-28 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Atualização
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground">
            {formatDate(walletItem?.updated_at || new Date().toISOString())}
          </span>
        </div>

        {/* Espaçamento */}
        <div className="flex-1" />

        {/* Botão "..." */}
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 transition-all"
          onClick={openMenu}
          aria-label="Ações do ativo"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {/* Dropdown via Portal — evita clipping do overflow-x-auto */}
        {menuOpen &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-9999 min-w-40 rounded-lg border border-border/50 bg-popover shadow-lg py-1"
              style={{ top: menuPos.top, right: menuPos.right }}
            >
              {/* Comprar — apenas Ação e FII */}
              {(assetType === "Ação" || assetType === "FII") && (
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => handleMenuAction("comprar")}
                >
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Comprar
                </button>
              )}

              {/* Vender — Ação e FII */}
              {(assetType === "Ação" || assetType === "FII") && (
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => handleMenuAction("vender")}
                >
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                  Vender
                </button>
              )}

              {/* Resgatar — Renda Fixa */}
              {assetType === "Renda Fixa" && (
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => handleMenuAction("resgatar")}
                >
                  <Undo2 className="h-4 w-4 text-rose-500" />
                  Resgatar
                </button>
              )}

              <div className="my-1 h-px bg-border/50" />

              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  handleEditClick();
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Editar
              </button>

              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  handleHistoryClick();
                }}
              >
                <History className="h-4 w-4 text-muted-foreground" />
                Histórico
              </button>
            </div>,
            document.body,
          )}

        {/* Sheet — Comprar */}
        {(assetType === "Ação" || assetType === "FII") && (
          <Sheet
            open={activeSheet === "comprar"}
            onOpenChange={(open) => !open && setActiveSheet(null)}
          >
            <SheetTrigger className="hidden" />
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg overflow-y-auto p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Comprar {assetLabel}</SheetTitle>
              </SheetHeader>
              <TradeForm operacao="comprar" assetLabel={assetLabel} />
            </SheetContent>
          </Sheet>
        )}

        {/* Sheet — Vender */}
        {(assetType === "Ação" || assetType === "FII") && (
          <Sheet
            open={activeSheet === "vender"}
            onOpenChange={(open) => !open && setActiveSheet(null)}
          >
            <SheetTrigger className="hidden" />
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg overflow-y-auto p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Vender {assetLabel}</SheetTitle>
              </SheetHeader>
              <TradeForm operacao="vender" assetLabel={assetLabel} />
            </SheetContent>
          </Sheet>
        )}

        {/* Sheet — Resgatar */}
        {assetType === "Renda Fixa" && (
          <Sheet
            open={activeSheet === "resgatar"}
            onOpenChange={(open) => !open && setActiveSheet(null)}
          >
            <SheetTrigger className="hidden" />
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg overflow-y-auto p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Resgatar {assetLabel}</SheetTitle>
              </SheetHeader>
              <TradeForm operacao="resgatar" assetLabel={assetLabel} />
            </SheetContent>
          </Sheet>
        )}
      </CardContent>
    </Card>
  );
}
