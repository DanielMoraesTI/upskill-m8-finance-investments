import type { TAsset, TAssetList } from "@/schemas/assetSchema";
import type { TTransaction } from "@/schemas/transactionSchema";
import type { TWallet, TWalletList } from "@/schemas/walletSchema";

// Esta função arredonda um número para um número específico de casas decimais que for passada no segundo parâmetro (decimals).
function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// Esta função retorna o tipo do ativo (stock, fii ou fixedIncome) com base no asset_type_id do ativo no arquivo assetSchema. Se o ativo for undefined, retorna 0.
function getAssetTypeId(asset: TAsset | undefined): number {
  return asset?.asset_type_id ?? 0;
}

// Esta função calcula o valor atualizado de um item da carteira (walletItem) com base no tipo do ativo e seu preço atual. Para renda fixa, considera o total investido mais o rendimento salvo na carteira. Para ações e FIIs, multiplica a quantidade pelo preço atual do ativo. Se o ativo for undefined, retorna 0.
export function getWalletUpdatedValue(
  walletItem: TWallet,
  asset: TAsset | undefined,
): number {
  if (!asset) return 0;

  // Renda fixa considera principal + rendimento salvo na wallet.
  if (asset.asset_type_id === 3) {
    return walletItem.total_invested + Number(walletItem.income || 0);
  }
  // Ações e FIIs consideram quantidade * preço atual.
  const currentPrice =
    "current_price" in asset ? Number(asset.current_price || 0) : 0;
  return walletItem.quantity * currentPrice;
}

// Esta função retorna o valor total investido em um item da carteira (walletItem). Se o valor total investido for undefined, retorna 0.
export function getWalletInvestedValue(walletItem: TWallet): number {
  return Number(walletItem.total_invested || 0);
}

// Este tipo define a estrutura do resumo da carteira, incluindo o valor total atualizado, valores por tipo de ativo e a distribuição dos FIIs por categoria.
export type TPortfolioSummary = {
  totalUpdated: number;
  byTypeUpdated: {
    stock: number;
    fii: number;
    fixedIncome: number;
  };
  byTypeInvested: {
    stock: number;
    fii: number;
    fixedIncome: number;
  };
  fiiByCategory: Array<{
    key: string;
    label: string;
    value: number;
    percent: number;
  }>;
};

// Este objeto mapeia categorias de FIIs para rótulos mais amigáveis. Se uma categoria não estiver presente, o rótulo será o próprio nome da categoria.
const FII_CATEGORY_LABELS: Record<string, string> = {
  "Fundo de Papel": "Fundos de Papel",
  "Fundo de Tijolo": "Fundos de Tijolo",
  "Fundo Híbrido": "Fundos Híbridos",
};

// Esta função constrói um resumo da carteira com base na lista de carteiras (walletList) e na lista de ativos (assetList). Ela calcula o valor atualizado e investido por tipo de ativo, bem como a distribuição dos FIIs por categoria.
export function buildPortfolioSummary(args: {
  walletList: TWalletList;
  assetList: TAssetList;
}): TPortfolioSummary {
  // Desestruturação dos argumentos para obter as listas de carteiras e ativos.
  const { walletList, assetList } = args;
  // Inicialização de objetos para acumular os valores atualizados e investidos por tipo de ativo.
  const byTypeUpdated = {
    stock: 0,
    fii: 0,
    fixedIncome: 0,
  };
  // Mapa para acumular o valor atualizado dos FIIs por categoria.
  const byTypeInvested = {
    stock: 0,
    fii: 0,
    fixedIncome: 0,
  };
  // Mapa para acumular o valor atualizado dos FIIs por categoria.
  const fiiCategoryMap = new Map<string, number>();
  // Iteração sobre cada item da carteira para calcular os valores atualizados e investidos.
  for (const walletItem of walletList) {
    const asset = assetList.find(
      (assetItem) => assetItem.id === walletItem.asset_id,
    );
    if (!asset) continue;
    // Cálculo do valor atualizado e investido para o item da carteira atual.
    const updatedValue = getWalletUpdatedValue(walletItem, asset);
    const investedValue = getWalletInvestedValue(walletItem);
    // Para ações, acumula o valor atualizado e investido no tipo "stock".
    if (asset.asset_type_id === 1) {
      byTypeUpdated.stock += updatedValue;
      byTypeInvested.stock += investedValue;
      continue;
    }
    // Para FIIs, além de acumular o valor atualizado e investido, também acumula o valor atualizado por categoria.
    if (asset.asset_type_id === 2) {
      byTypeUpdated.fii += updatedValue;
      byTypeInvested.fii += investedValue;

      const category = "category" in asset ? asset.category : "Outros";
      fiiCategoryMap.set(
        category,
        (fiiCategoryMap.get(category) || 0) + updatedValue,
      );
      continue;
    }
    // Para renda fixa, acumula o valor atualizado e investido no tipo "fixedIncome".
    if (asset.asset_type_id === 3) {
      byTypeUpdated.fixedIncome += updatedValue;
      byTypeInvested.fixedIncome += investedValue;
    }
  }
  // Cálculo da distribuição dos FIIs por categoria, incluindo o percentual em relação ao total de FIIs.
  const fiiTotal = byTypeUpdated.fii;
  const fiiByCategory = Array.from(fiiCategoryMap.entries()).map(
    ([category, value]) => {
      const label = FII_CATEGORY_LABELS[category] || category;
      const key = category.toLowerCase().replace(/\s+/g, "-");
      const percent = fiiTotal > 0 ? (value / fiiTotal) * 100 : 0;

      return {
        key,
        label,
        value: roundTo(value, 2),
        percent: roundTo(percent, 1),
      };
    },
  );

  return {
    totalUpdated: roundTo(
      byTypeUpdated.stock + byTypeUpdated.fii + byTypeUpdated.fixedIncome,
      2,
    ),
    byTypeUpdated: {
      stock: roundTo(byTypeUpdated.stock, 2),
      fii: roundTo(byTypeUpdated.fii, 2),
      fixedIncome: roundTo(byTypeUpdated.fixedIncome, 2),
    },
    byTypeInvested: {
      stock: roundTo(byTypeInvested.stock, 2),
      fii: roundTo(byTypeInvested.fii, 2),
      fixedIncome: roundTo(byTypeInvested.fixedIncome, 2),
    },
    fiiByCategory,
  };
}
// Este tipo define a estrutura dos pontos de dados para a série temporal de valor atualizado por tipo de ativo ao longo dos meses.
export type TMonthlyClassPoint = {
  month: string;
  acoes: number;
  fiis: number;
  rendaFixa: number;
};
// Esta função constrói uma série temporal de valor atualizado por tipo de ativo (ações, FIIs e renda fixa) ao longo dos meses, com base na lista de transações (transactionList) e na lista de ativos (assetList). Ela considera apenas os últimos meses especificados no argumento lastMonths.
export function buildMonthlyClassSeries(args: {
  transactionList: TTransaction[];
  assetList: TAssetList;
  lastMonths?: number;
}): TMonthlyClassPoint[] {
  const { transactionList, assetList, lastMonths = 6 } = args;
  // Geração de âncoras mensais para os últimos meses, começando do mês atual e retrocedendo até o número de meses especificado.
  const now = new Date();
  const monthAnchors: Date[] = [];
  for (let index = lastMonths - 1; index >= 0; index -= 1) {
    monthAnchors.push(new Date(now.getFullYear(), now.getMonth() - index, 1));
  }
  // Ordenação das transações por data e, em caso de empate, por ID para garantir uma ordem consistente.
  const sortedTx = [...transactionList].sort((a, b) => {
    if (a.date === b.date) return a.id - b.id;
    return a.date.localeCompare(b.date);
  });
  // Mapa para acompanhar a posição atual por ativo, incluindo quantidade, total investido e tipo do ativo.
  const positionByAsset = new Map<
    number,
    { quantity: number; totalInvested: number; assetTypeId: number }
  >();
  const points: TMonthlyClassPoint[] = [];
  let txIndex = 0;
  // Iteração sobre cada âncora mensal para calcular o valor atualizado por tipo de ativo até o final de cada mês.
  for (const anchor of monthAnchors) {
    const monthEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
    const monthEndKey = monthEnd.toISOString().slice(0, 10);
    // Processamento das transações até o final do mês atual, atualizando a posição por ativo com base nas transações de compra e venda.
    while (txIndex < sortedTx.length && sortedTx[txIndex].date <= monthEndKey) {
      const tx = sortedTx[txIndex];
      const asset = assetList.find((assetItem) => assetItem.id === tx.asset_id);
      const assetTypeId = getAssetTypeId(asset);
      const current = positionByAsset.get(tx.asset_id) || {
        quantity: 0,
        totalInvested: 0,
        assetTypeId,
      };

      if (tx.entry_type === "buy") {
        current.quantity += tx.quantity;
        current.totalInvested += tx.total_value;
      } else {
        const safeQuantity = Math.max(current.quantity, 0);
        if (safeQuantity > 0) {
          const averagePrice = current.totalInvested / safeQuantity;
          const soldQuantity = Math.min(tx.quantity, safeQuantity);
          current.quantity -= soldQuantity;
          current.totalInvested -= averagePrice * soldQuantity;
        }

        if (current.quantity <= 1e-8 || current.totalInvested <= 1e-8) {
          current.quantity = 0;
          current.totalInvested = 0;
        }
      }

      current.assetTypeId = assetTypeId;
      positionByAsset.set(tx.asset_id, current);
      txIndex += 1;
    }

    let acoes = 0;
    let fiis = 0;
    let rendaFixa = 0;
    // Cálculo do valor atualizado por tipo de ativo com base na posição atual até o final do mês. Para cada ativo, o valor atualizado é acumulado no tipo correspondente (ações, FIIs ou renda fixa).
    for (const [, position] of positionByAsset) {
      if (position.totalInvested <= 0) continue;

      if (position.assetTypeId === 1) acoes += position.totalInvested;
      if (position.assetTypeId === 2) fiis += position.totalInvested;
      if (position.assetTypeId === 3) rendaFixa += position.totalInvested;
    }
    // Adição do ponto de dados para o mês atual, incluindo o valor atualizado por tipo de ativo. Os valores são arredondados para 2 casas decimais e garantidos para serem não negativos.
    points.push({
      month: anchor.toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
      acoes: roundTo(Math.max(acoes, 0), 2),
      fiis: roundTo(Math.max(fiis, 0), 2),
      rendaFixa: roundTo(Math.max(rendaFixa, 0), 2),
    });
  }

  return points;
}
