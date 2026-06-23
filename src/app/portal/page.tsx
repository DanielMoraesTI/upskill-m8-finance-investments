"use client";

import ChartBarMultiple from "@/components/chart-objects/ChartBarMultiple";
import CardValues from "@/components/chart-objects/CardValues";
import { Vault, Building2, Landmark, Wallet } from "lucide-react";
import PieLegends from "@/components/chart-objects/PieLegends";
import InvestorProfileSlider from "@/components/chart-objects/InvestorProfileSlider";
import { useAsset } from "@/context/AssetProvider";
import { useWallet } from "@/context/WalletProvider";
import { useTransaction } from "@/context/TransactionProvider";
import { calcPct, formatCurrency } from "@/utils/dataTypeUtils";
import {
  buildMonthlyClassSeries,
  buildPortfolioSummary,
} from "@/utils/portfolioMetrics";

export default function DashboardPage() {
  const { assetList } = useAsset();
  const { walletList } = useWallet();
  const { transactionList } = useTransaction();

  const summary = buildPortfolioSummary({
    walletList,
    assetList,
  });

  const monthlySeries = buildMonthlyClassSeries({
    transactionList,
    assetList,
    lastMonths: 6,
  });

  return (
    <div className="flex flex-col w-full items-center justify-start px-4 sm:px-6 lg:px-8 py-4 pb-8 gap-4 max-w-screen-2xl mx-auto">
      {/* SECAO DE INTRODUCAO */}
      <section className="flex w-full flex-col items-center gap-3">
        <InvestorProfileSlider />
        <div className="text-center max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Resumo dos Investimentos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Centralize a gestao dos seus ativos e acompanhe a evolucao do seu
            capital para tomar decisoes informadas e estrategicas.
          </p>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
      </section>

      <section className="grid w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch">
        <div className="grid grid-cols-2 gap-4">
          <CardValues
            title="Valor Total Investido"
            value={formatCurrency(summary.totalUpdated)}
            icon={Vault}
            highlight
          />
          <CardValues
            title="Ações"
            value={formatCurrency(summary.byTypeUpdated.stock)}
            percentage={calcPct(
              summary.byTypeUpdated.stock,
              summary.totalUpdated,
            )}
            icon={Wallet}
          />
          <CardValues
            title="Fundos Imobiliários"
            value={formatCurrency(summary.byTypeUpdated.fii)}
            percentage={calcPct(
              summary.byTypeUpdated.fii,
              summary.totalUpdated,
            )}
            icon={Building2}
          />
          <CardValues
            title="Renda Fixa"
            value={formatCurrency(summary.byTypeUpdated.fixedIncome)}
            percentage={calcPct(
              summary.byTypeUpdated.fixedIncome,
              summary.totalUpdated,
            )}
            icon={Landmark}
          />
        </div>

        <div className="flex w-full h-full min-h-70">
          <PieLegends
            title="Distribuição de Fundos Imobiliários"
            description="Valor atualizado por categoria e percentual sobre o total de FIIs"
            legendColumnsClass="*:basis-1/3"
            data={summary.fiiByCategory.map((item) => ({
              key: item.key,
              label: `${item.label} (${item.percent.toFixed(1)}%)`,
              value: item.value,
            }))}
          />
        </div>
      </section>

      <div className="w-full">
        <ChartBarMultiple data={monthlySeries} />
      </div>
    </div>
  );
}
