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
// Este componente é o cartão de carteira (WalletCard), que exibe informações detalhadas sobre um ativo específico na carteira do usuário. Ele utiliza os dados do ativo e da carteira para calcular e exibir informações relevantes, como o valor investido, o rendimento, a quantidade de ativos e o valor atual. O WalletCard também inclui um menu de ações que permite aos usuários realizar operações como comprar, vender, resgatar ou editar as informações do ativo. Ele utiliza o hook useState para gerenciar o estado de edição e os valores editáveis, e o hook useEffect para sincronizar esses estados com os dados originais. O WalletCard é essencial para fornecer uma visão detalhada dos ativos na carteira do usuário, permitindo que eles gerenciem suas carteiras de forma eficiente e tenham acesso rápido às operações relacionadas a cada ativo, melhorando a experiência do usuário ao gerenciar seus investimentos financeiros. Ele também lida com a navegação para o histórico de transações do ativo, garantindo que os usuários possam acessar facilmente as informações relevantes sobre suas operações passadas. O WalletCard é uma parte fundamental da interface do usuário para a gestão de carteiras de investimento, proporcionando uma experiência intuitiva e eficiente para os usuários ao visualizar e gerenciar seus ativos financeiros.
export default function WalletCard({ walletItem }: { walletItem: TWallet }) {
  const { currentAssetType, assetList, currentPriceMutation } = useAsset();
  const { walletIncomeMutation } = useWallet();
  const assetType = currentAssetType?.asset_type || null;
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [activeSheet, setActiveSheet] = useState<CardAction | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Sincroniza os estados de edição com os dados originais quando o componente é montado ou quando o walletItem é atualizado
  useEffect(() => {
    const handlepriceChanges = () => {
      setNewPrice(currentPrice.toString());
      setNewIncome(income.toString());
    };
    handlepriceChanges();
  }, [currentPrice, income]);

  // Recalcula o actualAmount sempre que os valores editáveis mudarem
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
  // Este efeito é responsável por fechar o menu de ações quando o usuário clica fora do menu ou do botão que o abre. Ele adiciona um event listener para o evento "mousedown" quando o menu está aberto, e remove esse listener quando o menu é fechado ou quando o componente é desmontado. A função handleClickOutside verifica se o clique ocorreu fora do menu e do botão, e se for o caso, fecha o menu definindo menuOpen como false. Esse comportamento é essencial para garantir uma experiência de usuário intuitiva e eficiente, permitindo que os usuários fechem facilmente o menu de ações clicando fora dele, sem a necessidade de clicar em um botão específico para fechar, melhorando a usabilidade do componente WalletCard.
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
    setActiveSheet(action);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveEdit = () => {
    // Se for ação, mudar o current_price pelo AssetProvider
    if (assetType === "Ação" || assetType === "FII") {
      currentPriceMutation.mutate({
        assetId: walletItem.asset_id,
        current_price: parseFloat(newPrice) || 0,
      });
    }

    if (assetType === "Renda Fixa") {
      // Se for renda fixa, mudar o rendimento/income pelo WalletProvider
      walletIncomeMutation.mutate({
        walletId: walletItem.id,
        income: parseFloat(newIncome) || 0,
      });
    }

    setIsEditing(false);
    console.log("Salvar alterações:", { newPrice, newIncome });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPrice(currentPrice.toString());
    setNewIncome(income.toString());
  };

  // Função para lidar com o clique no botão "Histórico"
  const handleHistoryClick = () => {
    // Fechar o menu antes de navegar
    setMenuOpen(false);

    // Navegar para a página de histórico de transações do ativo selecionado
    router.push(`/portal/transaction?assetId=${walletItem.asset_id}`);
  };

  const openMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  };

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
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
                  className="mt-1 w-full text-sm font-semibold text-foreground bg-muted/60 border border-border rounded px-1 focus:outline-none focus:border-primary"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
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
                  className="mt-1 w-full text-sm font-semibold text-cyan-500 bg-muted/60 border border-border rounded px-1 focus:outline-none focus:border-cyan-500"
                  value={newIncome}
                  onChange={(e) => setNewIncome(e.target.value)}
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
            Valor Atualizado
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
            onClick={openMenu}
            aria-label="Ações do ativo"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}

        {menuOpen &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-9999 min-w-40 rounded-lg border border-border/50 bg-popover shadow-lg py-1"
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
                onClick={() => {
                  setMenuOpen(false);
                  handleEditClick();
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" /> Editar
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  handleHistoryClick();
                }}
              >
                <History className="h-4 w-4 text-muted-foreground" /> Histórico
              </button>
            </div>,
            document.body,
          )}

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
                assetId={walletItem.asset_id}
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
                assetId={walletItem.asset_id}
                onSuccess={() => setActiveSheet(null)}
              />
            </SheetContent>
          </Sheet>
        )}
      </CardContent>
    </Card>
  );
}
