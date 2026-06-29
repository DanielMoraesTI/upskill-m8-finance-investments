"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Pencil,
  History,
  Undo2,
  Check,
  X,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/dataTypeUtils";
import type { TWallet } from "@/schemas/walletSchema";
import { useAsset } from "@/context/AssetProvider";
import { useWallet } from "@/context/WalletProvider";
import { useRouter } from "next/navigation";
import TradeForm from "@/components/investmentsList/TradeForm";

type CardAction = "comprar" | "vender" | "resgatar" | "editar" | "historico";

export default function WalletCard({ walletItem }: { walletItem: TWallet }) {
  const { currentAssetType, assetList, currentPriceMutation } = useAsset();
  const { walletIncomeMutation } = useWallet();
  const assetType = currentAssetType?.asset_type || null;
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [activeSheet, setActiveSheet] = useState<CardAction | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para controlar o modal exclusivo do mobile
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const currentAsset = assetList.find(
    (asset) => asset.id === walletItem.asset_id,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const [newIncome, setNewIncome] = useState<string>("");
  const [actualAmount, setActualAmount] = useState<number>(0);

  const investedAmount = walletItem.total_invested;
  const income = walletItem?.income || 0;
  const quantity = walletItem.quantity;
  const currentPrice =
    currentAsset && "current_price" in currentAsset
      ? currentAsset.current_price || 0
      : 0;

  useEffect(() => {
    const handlepriceChanges = () => {
      setNewPrice(currentPrice.toString());
      setNewIncome(income.toString());
    };
    handlepriceChanges();
  }, [currentPrice, income]);

  useEffect(() => {
    const handleActualAmountChanges = () => {
      if (assetType === "Renda Fixa") {
        setActualAmount(investedAmount + (parseFloat(newIncome) || 0));
      } else {
        setActualAmount(quantity * (parseFloat(newPrice) || 0));
      }
    };
    handleActualAmountChanges();
  }, [assetType, investedAmount, newIncome, quantity, newPrice]);

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

  if (!currentAsset || !assetType) return null;

  const sigla = "ticker" in currentAsset ? currentAsset.ticker : "XPTO";
  const companyName =
    "company" in currentAsset ? currentAsset.company : undefined;
  const category =
    "category" in currentAsset ? currentAsset.category : undefined;
  const initialDate = walletItem?.initial_date || "";
  const averagePrice = walletItem.average_price;
  const assetLabel =
    assetType === "Renda Fixa" ? (companyName ?? sigla) : sigla;

  const handleMenuAction = (action: CardAction) => {
    setMenuOpen(false);
    setIsMobileModalOpen(false); // Fecha o modal mobile para abrir o Sheet correspondente
    setActiveSheet(action);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsMobileModalOpen(false); // Fecha o modal mobile se for editar de forma inline
  };

  const sanitizeUnsignedNumberInput = (value: string) =>
    value.replace(/[-+]/g, "");

  const handleSaveEdit = () => {
    if (assetType === "Ação" || assetType === "FII") {
      currentPriceMutation.mutate({
        assetId: walletItem.asset_id,
        current_price: parseFloat(newPrice) || 0,
      });
    }

    if (assetType === "Renda Fixa") {
      walletIncomeMutation.mutate({
        walletId: walletItem.id,
        income: parseFloat(newIncome) || 0,
      });
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPrice(currentPrice.toString());
    setNewIncome(income.toString());
  };

  const handleHistoryClick = () => {
    setMenuOpen(false);
    setIsMobileModalOpen(false);
    router.push(`/portal/transaction?assetId=${walletItem.asset_id}`);
  };

  const openMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    isMobile = false,
  ) => {
    e.stopPropagation(); // Evita re-trigger de cliques indesejados
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

  return (
    <>
      {/* 1. VISÃO DESKTOP (Inalterada, apenas escondida no mobile com md:flex) */}
      <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto hidden md:flex">
        <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max w-full">
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

          {(assetType === "Ação" || assetType === "FII") && (
            <>
              <div className="flex w-24 shrink-0 flex-col">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  Preço Médio
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground">
                  {formatCurrency(averagePrice)}
                </span>
              </div>
              <div className="h-8 w-px bg-border/50" />
            </>
          )}

          {(assetType === "Ação" || assetType === "FII") && (
            <>
              <div className="flex w-24 shrink-0 flex-col">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  Preço Atual
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    className="no-number-spinner mt-1 w-full text-sm font-semibold text-foreground bg-muted/60 border border-border rounded px-1 focus:outline-none focus:border-primary"
                    value={newPrice}
                    onChange={(e) =>
                      setNewPrice(sanitizeUnsignedNumberInput(e.target.value))
                    }
                    onKeyDown={(event) => {
                      if (["-", "+", "e", "E"].includes(event.key))
                        event.preventDefault();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(parseFloat(newPrice) || 0)}
                  </span>
                )}
              </div>
              <div className="h-8 w-px bg-border/50" />
            </>
          )}

          {assetType === "Renda Fixa" && (
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

          {assetType === "Renda Fixa" && (
            <>
              <div className="flex w-32 shrink-0 flex-col">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  Rendimento
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    className="no-number-spinner mt-1 w-full text-sm font-semibold text-cyan-500 bg-muted/60 border border-border rounded px-1 focus:outline-none focus:border-cyan-500"
                    value={newIncome}
                    onChange={(e) =>
                      setNewIncome(sanitizeUnsignedNumberInput(e.target.value))
                    }
                    onKeyDown={(event) => {
                      if (["-", "+", "e", "E"].includes(event.key))
                        event.preventDefault();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="mt-1 text-sm font-semibold text-cyan-500">
                    {formatCurrency(parseFloat(newIncome) || 0)}
                  </span>
                )}
              </div>
              <div className="h-8 w-px bg-border/50" />
            </>
          )}

          <div className="flex w-32 shrink-0 flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
              Valor Atual
            </span>
            <span
              className={`mt-1 text-sm font-bold ${actualAmount >= investedAmount ? "text-chart-1" : "text-chart-5"}`}
            >
              {formatCurrency(actualAmount)}
            </span>
          </div>

          <div className="h-8 w-px bg-border/50" />

          <div className="flex w-28 shrink-0 flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
              Atualização
            </span>
            <span className="mt-1 text-sm font-semibold text-foreground">
              {formatDate(walletItem?.updated_at || new Date().toISOString())}
            </span>
          </div>

          <div className="flex-1" />

          {isEditing ? (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                onClick={handleSaveEdit}
                aria-label="Confirmar edição"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                onClick={handleCancelEdit}
                aria-label="Cancelar edição"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 transition-all"
              onClick={(e) => openMenu(e, false)}
              aria-label="Ações do ativo"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 2. VISÃO CARD MOBILE (Apenas em md:hidden) */}
      <div
        className="md:hidden w-full"
        onClick={() => setIsMobileModalOpen(true)}
      >
        <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm active:bg-muted/30 transition-colors cursor-pointer">
          <CardContent className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col min-w-0 flex-1 pr-2">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                {assetType === "Renda Fixa" ? "Nome" : "Sigla"}
              </span>
              <span className="mt-0.5 truncate text-sm font-bold text-primary">
                {assetType === "Renda Fixa" ? companyName : sigla}
              </span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Valor
              </span>
              <span
                className={`mt-0.5 text-sm font-bold ${actualAmount >= investedAmount ? "text-chart-1" : "text-chart-5"}`}
              >
                {formatCurrency(actualAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MODAL COMPLEMENTAR MOBILE */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:hidden">
          <Card className="w-full max-w-sm bg-card border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Topo do Modal Mobile */}
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
                Detalhes do Ativo
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

            {/* Conteúdo com os dados empilhados para Mobile */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {(assetType === "Ação" || assetType === "FII") && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Sigla
                  </span>
                  <span className="text-base font-bold text-primary mt-0.5">
                    {sigla}
                  </span>
                </div>
              )}

              {assetType === "Ação" && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Empresa
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-secondary/60 border-border/40 text-xs text-ellipsis overflow-hidden max-w-full"
                    >
                      {companyName}
                    </Badge>
                  </div>
                </div>
              )}

              {assetType === "FII" && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Categoria
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-secondary/60 border-border/40 text-xs"
                    >
                      {category}
                    </Badge>
                  </div>
                </div>
              )}

              {assetType === "Renda Fixa" && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Nome
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {companyName}
                  </span>
                </div>
              )}

              {assetType === "Renda Fixa" && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Data Inicial
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-secondary/60 border-border/40 text-xs w-fit"
                    >
                      {formatDate(initialDate || new Date().toISOString())}
                    </Badge>
                  </div>
                </div>
              )}

              {(assetType === "Ação" || assetType === "FII") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Quantidade
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Preço Médio
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                      {formatCurrency(averagePrice)}
                    </span>
                  </div>
                </div>
              )}

              {(assetType === "Ação" || assetType === "FII") && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Preço Atual
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {formatCurrency(parseFloat(newPrice) || 0)}
                  </span>
                </div>
              )}

              {assetType === "Renda Fixa" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Valor Investido
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                      {formatCurrency(investedAmount)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Rendimento
                    </span>
                    <span className="text-sm font-semibold text-cyan-500 mt-0.5">
                      {formatCurrency(parseFloat(newIncome) || 0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Valor Atual
                  </span>
                  <span
                    className={`text-base font-bold mt-0.5 ${actualAmount >= investedAmount ? "text-chart-1" : "text-chart-5"}`}
                  >
                    {formatCurrency(actualAmount)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Atualização
                  </span>
                  <span className="text-xs font-semibold text-foreground mt-1">
                    {formatDate(
                      walletItem?.updated_at || new Date().toISOString(),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 4. PORTAL DROP MENU (Compartilhado e disparado dinamicamente pelas posições corretas) */}
      {menuOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] min-w-40 rounded-lg border border-border/50 bg-popover shadow-lg py-1"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            {(assetType === "Ação" || assetType === "FII") && (
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => handleMenuAction("comprar")}
              >
                <TrendingUp className="h-4 w-4 text-emerald-500" /> Comprar
              </button>
            )}
            {(assetType === "Ação" || assetType === "FII") && (
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => handleMenuAction("vender")}
              >
                <TrendingDown className="h-4 w-4 text-rose-500" /> Vender
              </button>
            )}
            {assetType === "Renda Fixa" && (
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => handleMenuAction("resgatar")}
              >
                <Undo2 className="h-4 w-4 text-rose-500" /> Resgatar
              </button>
            )}
            <div className="my-1 h-px bg-border/50" />
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" /> Editar
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              onClick={handleHistoryClick}
            >
              <History className="h-4 w-4 text-muted-foreground" /> Histórico
            </button>
          </div>,
          document.body,
        )}

      {/* 5. PORTAIS DE DIÁLOGOS/SHEETS (Mantidos idênticos sem mutação lógica) */}
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
            <TradeForm
              operacao="comprar"
              assetLabel={assetLabel}
              assetType={assetType}
              assetId={walletItem.asset_id}
              onSuccess={() => setActiveSheet(null)}
            />
          </SheetContent>
        </Sheet>
      )}

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
            <TradeForm
              operacao="vender"
              assetLabel={assetLabel}
              assetType={assetType}
              assetId={walletItem.asset_id}
              maxQuantity={walletItem.quantity}
              onSuccess={() => setActiveSheet(null)}
            />
          </SheetContent>
        </Sheet>
      )}

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
            <TradeForm
              operacao="resgatar"
              assetLabel={assetLabel}
              assetType={assetType}
              assetId={walletItem.asset_id}
              onSuccess={() => setActiveSheet(null)}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
