"use client";

import { useMemo, useState } from "react";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAsset } from "@/context/AssetProvider";
import { useWallet } from "@/context/WalletProvider";
import { getUserToken } from "@/services/api";

type OperationType = "compra" | "venda";
export type InvestmentType = "acoes" | "fiis" | "renda-fixa" | "";
// Este componente é responsável por renderizar a interface de registro de operações de compra e venda de investimentos. Ele permite que os usuários selecionem o tipo de investimento (ações, fundos imobiliários ou renda fixa), a operação (compra ou venda), o ativo específico, a quantidade, o valor unitário e o valor total para operações de renda fixa. O componente utiliza o hook useState para gerenciar os estados relacionados à operação, investimento, código do ativo selecionado, texto de busca, quantidade, valor e feedback para o usuário. Ele também utiliza o hook useMemo para calcular as opções disponíveis de ativos com base no tipo de investimento e operação selecionados, bem como para calcular o valor total da operação. O BusinessAction é essencial para permitir que os usuários registrem suas operações de investimento de forma fácil e eficiente, garantindo que as informações sejam validadas corretamente antes do envio e fornecendo feedback claro sobre o sucesso ou falha da operação. Ele se integra com o contexto de ativos e carteiras para garantir que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O BusinessAction é um componente central para a funcionalidade de registro de operações de investimento no aplicativo, proporcionando uma experiência de usuário intuitiva e eficiente para gerenciar suas operações financeiras.
interface BusinessActionProps {
  defaultInvestimento?: InvestmentType;
  defaultOperacao?: OperationType;
  lockInvestimento?: boolean;
  lockOperacao?: boolean;
  onSuccess?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// Esta função é uma função auxiliar que converte o tipo de investimento selecionado pelo usuário (ações, fundos imobiliários ou renda fixa) em um ID numérico correspondente, que é utilizado para filtrar os ativos disponíveis e registrar as operações de investimento corretamente. Ela recebe como parâmetro o tipo de investimento e retorna o ID correspondente (1 para ações, 2 para fundos imobiliários, 3 para renda fixa) ou null se o tipo de investimento não for reconhecido. A função toAssetTypeId é essencial para garantir que as operações de investimento sejam registradas com o tipo de ativo correto, permitindo que as consultas e filtros relacionados aos ativos funcionem corretamente em todo o aplicativo.
function toAssetTypeId(investimento: InvestmentType): 1 | 2 | 3 | null {
  if (investimento === "acoes") return 1;
  if (investimento === "fiis") return 2;
  if (investimento === "renda-fixa") return 3;
  return null;
}

function sanitizeUnsignedNumberInput(value: string): string {
  return value.replace(/[-+]/g, "");
}
// Este componente é o componente principal para registrar operações de compra e venda de investimentos (BusinessAction). Ele renderiza uma interface de usuário que permite aos usuários selecionar o tipo de investimento, a operação, o ativo específico, a quantidade, o valor unitário e o valor total para operações de renda fixa. O componente gerencia os estados relacionados à operação, investimento, código do ativo selecionado, texto de busca, quantidade, valor e feedback para o usuário. Ele utiliza funções auxiliares para converter o tipo de investimento em um ID numérico correspondente e para calcular as opções disponíveis de ativos com base no tipo de investimento e operação selecionados. O BusinessAction é essencial para permitir que os usuários registrem suas operações de investimento de forma fácil e eficiente, garantindo que as informações sejam validadas corretamente antes do envio e fornecendo feedback claro sobre o sucesso ou falha da operação. Ele se integra com o contexto de ativos e carteiras para garantir que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O BusinessAction é um componente central para a funcionalidade de registro de operações de investimento no aplicativo, proporcionando uma experiência de usuário intuitiva e eficiente para gerenciar suas operações financeiras.
export default function BusinessAction({
  defaultInvestimento = "",
  defaultOperacao = "compra",
  lockInvestimento = false,
  lockOperacao = false,
  onSuccess,
}: BusinessActionProps) {
  const queryClient = useQueryClient();
  const { assetList } = useAsset();
  const { walletList } = useWallet();

  const [operacao, setOperacao] = useState<OperationType>(defaultOperacao);
  const [investimento, setInvestimento] =
    useState<InvestmentType>(defaultInvestimento);
  const [selectedCode, setSelectedCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [totalRendaFixa, setTotalRendaFixa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isRendaFixa = investimento === "renda-fixa";
  // Este hook useMemo é utilizado para criar um conjunto de IDs de ativos presentes na carteira do usuário, com base na lista de carteiras (walletList) obtida do contexto de carteiras. Ele mapeia a lista de carteiras para extrair os IDs dos ativos e os armazena em um Set para permitir uma busca eficiente. O walletAssetIds é essencial para filtrar as opções de ativos disponíveis para compra ou venda, garantindo que apenas os ativos que o usuário possui em sua carteira sejam exibidos como opções válidas para venda, e que as opções de compra sejam limitadas aos ativos disponíveis no sistema. Ele é utilizado posteriormente para calcular as opções disponíveis de ativos com base no tipo de investimento e operação selecionados, garantindo que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema.
  const walletAssetIds = useMemo(
    () => new Set(walletList.map((walletItem) => walletItem.asset_id)),
    [walletList],
  );
  // Este hook useMemo é utilizado para calcular as opções disponíveis de ativos com base no tipo de investimento e operação selecionados pelo usuário. Ele verifica o tipo de investimento e a operação para determinar quais ativos devem ser exibidos como opções válidas para compra ou venda. Para operações de compra, ele filtra os ativos disponíveis no sistema com base no tipo de investimento (ações ou fundos imobiliários) e os mapeia para um formato adequado para exibição. Para operações de venda, ele filtra os ativos que o usuário possui em sua carteira com base no tipo de investimento e os mapeia para exibição, utilizando o ticker ou o nome da empresa quando disponível. O availableAssetOptions é essencial para garantir que os usuários possam selecionar apenas os ativos relevantes para a operação que estão realizando, proporcionando uma experiência de usuário intuitiva e eficiente ao registrar suas operações de investimento. Ele também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos.
  const availableAssetOptions = useMemo(() => {
    const assetTypeId = toAssetTypeId(investimento);
    if (!assetTypeId) return [];

    return assetList
      .filter((asset) => asset.asset_type_id === assetTypeId)
      .filter((asset) => operacao === "compra" || walletAssetIds.has(asset.id))
      .map((asset) => {
        const value = String(asset.id);

        if (assetTypeId === 3) {
          return {
            value,
            label: "company" in asset ? asset.company : `Ativo ${asset.id}`,
          };
        }

        return {
          value,
          label: "ticker" in asset ? asset.ticker : `Ativo ${asset.id}`,
        };
      });
  }, [assetList, investimento, operacao, walletAssetIds]);
  // Este hook useMemo é utilizado para filtrar as opções de ativos disponíveis com base no texto de busca digitado pelo usuário. Ele verifica se o texto de busca está vazio ou contém apenas espaços em branco e, nesse caso, retorna todas as opções disponíveis. Caso contrário, ele converte o texto de busca para minúsculas e filtra as opções disponíveis para incluir apenas aquelas cujo rótulo (label) contém o texto de busca, também convertido para minúsculas. O filteredAssetOptions é essencial para proporcionar uma experiência de usuário eficiente ao permitir que os usuários encontrem rapidamente o ativo desejado digitando parte do nome ou ticker, melhorando a usabilidade do componente de registro de operações de investimento. Ele garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O filtro de opções de ativos com base no texto de busca é uma funcionalidade importante para facilitar a navegação e seleção de ativos em um cenário onde o usuário pode ter uma grande variedade de opções disponíveis.
  const filteredAssetOptions = useMemo(() => {
    if (!searchText.trim()) return availableAssetOptions;

    const query = searchText.toLowerCase();
    return availableAssetOptions.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [availableAssetOptions, searchText]);
  // Este hook useMemo é utilizado para calcular o valor total da operação de compra ou venda de investimentos, com base na quantidade e no valor unitário digitados pelo usuário. Ele converte a quantidade e o valor unitário para números de ponto flutuante, substituindo vírgulas por pontos para garantir a formatação correta. Em seguida, ele verifica se ambos os valores são números válidos e, se forem, calcula o valor total multiplicando a quantidade pelo valor unitário. Caso contrário, ele retorna 0 como valor total. O totalVariavel é essencial para fornecer feedback em tempo real ao usuário sobre o valor total da operação que está registrando, permitindo que ele veja imediatamente o impacto financeiro da operação antes de confirmá-la. Ele também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O cálculo do valor total com base na quantidade e no valor unitário é uma funcionalidade importante para facilitar a compreensão do usuário sobre o impacto financeiro de suas operações de investimento, melhorando a experiência geral ao registrar suas operações financeiras.
  const totalVariavel = useMemo(() => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor.replace(",", "."));
    return !isNaN(q) && !isNaN(v) ? q * v : 0;
  }, [quantidade, valor]);

  const quantityNumber = parseFloat(quantidade);
  const unitPriceNumber = parseFloat(valor.replace(",", "."));

  const selectedWalletQuantity = useMemo(() => {
    if (isRendaFixa || operacao !== "venda") return Number.POSITIVE_INFINITY;
    const selectedAssetId = Number(selectedCode);
    if (!selectedAssetId) return 0;

    const walletItem = walletList.find(
      (item) => item.asset_id === selectedAssetId,
    );
    return Number(walletItem?.quantity || 0);
  }, [isRendaFixa, operacao, selectedCode, walletList]);
  // Este hook useMemo é utilizado para determinar se o botão de confirmação da operação deve estar habilitado ou desabilitado, com base na validação dos campos obrigatórios para a operação de compra ou venda de investimentos. Ele verifica se um código de ativo foi selecionado e, em seguida, valida os campos específicos para operações de renda fixa ou variáveis. Para operações de renda fixa, ele verifica se o campo de valor total não está vazio e é um número maior que zero. Para operações variáveis (ações ou fundos imobiliários), ele verifica se os campos de quantidade e valor unitário não estão vazios e se o valor total calculado é maior que zero. O canConfirm é essencial para garantir que os usuários só possam confirmar a operação quando todas as informações necessárias forem fornecidas e válidas, evitando erros no registro das operações de investimento e melhorando a experiência do usuário ao fornecer feedback claro sobre o estado da operação que estão registrando. Ele também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O estado de habilitação do botão de confirmação é uma funcionalidade importante para facilitar a compreensão do usuário sobre o que é necessário para concluir o registro de suas operações de investimento, melhorando a experiência geral ao gerenciar suas operações financeiras.
  const canConfirm = useMemo(() => {
    if (!selectedCode) return false;

    if (isRendaFixa) {
      return totalRendaFixa !== "" && parseFloat(totalRendaFixa) > 0;
    }

    if (!Number.isFinite(quantityNumber) || !Number.isFinite(unitPriceNumber)) {
      return false;
    }

    if (quantityNumber <= 0 || unitPriceNumber <= 0 || totalVariavel <= 0) {
      return false;
    }

    if (operacao === "venda" && quantityNumber > selectedWalletQuantity) {
      return false;
    }

    return quantidade !== "" && valor !== "";
  }, [
    isRendaFixa,
    quantityNumber,
    selectedWalletQuantity,
    operacao,
    quantidade,
    selectedCode,
    totalRendaFixa,
    totalVariavel,
    unitPriceNumber,
    valor,
  ]);
  // Esta função é responsável por resetar os campos do formulário de registro de operações de investimento para seus valores iniciais. Ela é chamada sempre que o tipo de operação ou o tipo de investimento é alterado, garantindo que os campos sejam limpos e prontos para receber novas informações relacionadas à nova seleção do usuário. A função resetFields é essencial para melhorar a experiência do usuário ao registrar suas operações de investimento, evitando que informações anteriores sejam mantidas nos campos quando o usuário muda o contexto da operação que está registrando. Ela também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O reset dos campos do formulário é uma funcionalidade importante para facilitar a compreensão do usuário sobre o estado atual da operação que estão registrando, melhorando a experiência geral ao gerenciar suas operações financeiras.
  function resetFields() {
    setSelectedCode("");
    setSearchText("");
    setQuantidade("");
    setValor("");
    setTotalRendaFixa("");
  }
  // Esta função é responsável por lidar com a mudança do tipo de operação (compra ou venda) selecionado pelo usuário. Ela atualiza o estado da operação com o novo valor selecionado e chama a função resetFields para limpar os campos do formulário, garantindo que as informações exibidas sejam consistentes com a nova seleção do usuário. A função handleOperacaoChange é essencial para melhorar a experiência do usuário ao registrar suas operações de investimento, permitindo que eles mudem facilmente entre os tipos de operação e garantindo que os campos do formulário sejam atualizados de acordo com a nova seleção, evitando confusão e erros no registro das operações. Ela também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O gerenciamento da mudança de tipo de operação é uma funcionalidade importante para facilitar a compreensão do usuário sobre o estado atual da operação que estão registrando, melhorando a experiência geral ao gerenciar suas operações financeiras.
  function handleOperacaoChange(value: string) {
    setOperacao(value as OperationType);
    resetFields();
  }
  // Esta função é responsável por lidar com a mudança do tipo de investimento (ações, fundos imobiliários ou renda fixa) selecionado pelo usuário. Ela verifica se o campo de investimento está bloqueado (lockInvestimento) e, se estiver, impede a mudança. Caso contrário, ela atualiza o estado do investimento com o novo valor selecionado e chama a função resetFields para limpar os campos do formulário, garantindo que as informações exibidas sejam consistentes com a nova seleção do usuário. A função handleInvestimentoChange é essencial para melhorar a experiência do usuário ao registrar suas operações de investimento, permitindo que eles mudem facilmente entre os tipos de investimento e garantindo que os campos do formulário sejam atualizados de acordo com a nova seleção, evitando confusão e erros no registro das operações. Ela também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O gerenciamento da mudança de tipo de investimento é uma funcionalidade importante para facilitar a compreensão do usuário sobre o estado atual da operação que estão registrando, melhorando a experiência geral ao gerenciar suas operações financeiras.
  function handleInvestimentoChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    if (lockInvestimento) return;
    setInvestimento(event.target.value as InvestmentType);
    resetFields();
  }
  // Esta função é responsável por enviar a transação de compra ou venda de investimento para a API. Ela recebe um payload contendo as informações da transação, como o ID do ativo, o tipo de entrada (compra ou venda), a data, a quantidade, o valor unitário e o valor total. A função submitTransaction gerencia o estado de submissão para fornecer feedback ao usuário sobre o processo de envio. Ela faz uma requisição POST para a API com o payload da transação e lida com a resposta para determinar se a operação foi registrada com sucesso ou se ocorreu um erro. Em caso de sucesso, ela exibe uma mensagem de sucesso, reseta os campos do formulário e invalida as consultas relevantes para atualizar os dados exibidos no aplicativo. Em caso de erro, ela exibe uma mensagem de erro apropriada. A função submitTransaction é essencial para garantir que as operações de investimento sejam registradas corretamente no sistema, proporcionando uma experiência de usuário eficiente e confiável ao gerenciar suas operações financeiras. Ela também garante que as informações exibidas sejam consistentes com os dados do usuário e que as operações sejam registradas corretamente no sistema, atualizando as consultas relevantes para refletir as mudanças nos dados de transações, carteiras e ativos. O envio da transação para a API é uma funcionalidade central para o registro de operações de investimento, permitindo que os usuários gerenciem suas operações financeiras de forma eficiente e confiável.
  async function submitTransaction(payload: Record<string, unknown>) {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const token = await getUserToken();
      const response = await fetch(`${API_URL}/portal/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ message: "Erro ao salvar operação" }));
        throw new Error(errorBody.message || "Erro ao salvar operação");
      }

      setFeedback({
        type: "success",
        message: "Operacao registrada com sucesso.",
      });
      resetFields();
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
      queryClient.invalidateQueries({ queryKey: ["assetList"] });
      onSuccess?.();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel salvar a operacao.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  // Esta função é responsável por lidar com a confirmação da operação de compra ou venda de investimento. Ela valida as informações fornecidas pelo usuário, constrói o payload da transação com base no tipo de investimento e operação selecionados, e chama a função submitTransaction para enviar a transação para a API.
  async function handleConfirmar() {
    const assetTypeId = toAssetTypeId(investimento);
    if (!assetTypeId) return;

    const entryType = operacao === "compra" ? "buy" : "sell";
    const now = new Date();
    const date = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);

    if (isRendaFixa) {
      const total = parseFloat(totalRendaFixa);
      const assetId = Number(selectedCode);
      if (!assetId) return;

      await submitTransaction({
        asset_id: assetId,
        entry_type: entryType,
        date,
        quantity: 1,
        unit_price: total,
        total_value: total,
      });
      return;
    }

    const quantity = parseFloat(quantidade);
    const unitPrice = parseFloat(valor.replace(",", "."));
    const assetId = Number(selectedCode);

    if (!assetId) return;

    if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
      return;
    }

    if (quantity <= 0 || unitPrice <= 0) {
      return;
    }

    if (operacao === "venda" && quantity > selectedWalletQuantity) {
      setFeedback({
        type: "error",
        message: "Quantidade de venda maior que a disponível.",
      });
      return;
    }

    if (operacao === "venda") {
      await submitTransaction({
        asset_id: assetId,
        entry_type: entryType,
        date,
        quantity,
        unit_price: unitPrice,
        total_value: totalVariavel,
      });
      return;
    }

    await submitTransaction({
      asset_id: assetId,
      entry_type: entryType,
      date,
      quantity,
      unit_price: unitPrice,
      total_value: totalVariavel,
    });
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 items-center">
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {operacao === "compra" ? "Comprar" : "Vender"}
        </h1>
        <p className="text-sm text-muted-foreground/60">
          {operacao === "compra"
            ? "Registre suas operacoes de compra"
            : "Registre suas operacoes de venda"}
        </p>
      </div>
      <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

      <Card className="w-full max-w-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="items-center text-center px-6 pt-6 pb-4">
          <CardTitle className="text-lg font-bold text-foreground">
            Operacao de Investimento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 px-6 pb-6">
          <Tabs
            value={operacao}
            onValueChange={handleOperacaoChange}
            className="w-full"
          >
            <TabsList
              className={`grid w-full bg-muted/40 border border-border/40 ${lockOperacao ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {(!lockOperacao || operacao === "compra") && (
                <TabsTrigger
                  value="compra"
                  className="data-[state=active]:bg-emerald-950/60 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-800/50"
                >
                  <TrendingUp className="mr-1.5 h-4 w-4" /> Compra
                </TabsTrigger>
              )}
              {(!lockOperacao || operacao === "venda") && (
                <TabsTrigger
                  value="venda"
                  className="data-[state=active]:bg-rose-950/60 data-[state=active]:text-rose-400 data-[state=active]:border data-[state=active]:border-rose-800/50"
                >
                  <TrendingDown className="mr-1.5 h-4 w-4" /> Venda
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>

          {!lockInvestimento && (
            <Field>
              <FieldLabel
                htmlFor="investimento"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                Tipo de Investimento
              </FieldLabel>
              <NativeSelect
                id="investimento"
                className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={investimento}
                onChange={handleInvestimentoChange}
              >
                <NativeSelectOption value="">
                  Selecione o investimento
                </NativeSelectOption>
                <NativeSelectOption value="acoes">Acoes</NativeSelectOption>
                <NativeSelectOption value="fiis">
                  Fundos Imobiliarios
                </NativeSelectOption>
                <NativeSelectOption value="renda-fixa">
                  Renda Fixa
                </NativeSelectOption>
              </NativeSelect>
            </Field>
          )}

          {lockInvestimento && investimento !== "" && (
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {investimento === "acoes" && "Acoes"}
                {investimento === "fiis" && "Fundos Imobiliarios"}
                {investimento === "renda-fixa" && "Renda Fixa"}
              </span>
            </div>
          )}

          {investimento !== "" && (
            <Field>
              <FieldLabel
                htmlFor="asset-code"
                className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
              >
                {isRendaFixa ? "Ativo de Renda Fixa" : "Ativo"}
              </FieldLabel>

              {!isRendaFixa && operacao === "compra" && (
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    placeholder="Buscar ativo na lista..."
                    className="pl-8 bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </div>
              )}

              <NativeSelect
                id="asset-code"
                className="w-full bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={selectedCode}
                onChange={(event) => setSelectedCode(event.target.value)}
              >
                <NativeSelectOption value="">
                  {filteredAssetOptions.length === 0
                    ? "Nenhum ativo encontrado"
                    : "Selecione o ativo"}
                </NativeSelectOption>
                {filteredAssetOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          )}

          {investimento !== "" && !isRendaFixa && (
            <FieldGroup className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="quantidade"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Quantidade
                </FieldLabel>
                <Input
                  id="quantidade"
                  type="number"
                  min={1}
                  placeholder="0"
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(
                      sanitizeUnsignedNumberInput(event.target.value),
                    )
                  }
                  onKeyDown={(event) => {
                    if (["-", "+", "e", "E"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  className="no-number-spinner bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="valor"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Valor Unitario (R$)
                </FieldLabel>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0,00"
                  value={valor}
                  onChange={(event) =>
                    setValor(sanitizeUnsignedNumberInput(event.target.value))
                  }
                  onKeyDown={(event) => {
                    if (["-", "+", "e", "E"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  className="no-number-spinner bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel
                  htmlFor="total-variavel"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Total
                </FieldLabel>
                <Input
                  id="total-variavel"
                  readOnly
                  value={totalVariavel > 0 ? totalVariavel.toFixed(2) : ""}
                  placeholder="0,00"
                  className="bg-muted/20 border-border/30 text-chart-1 font-bold cursor-default"
                />
              </Field>
            </FieldGroup>
          )}

          {investimento !== "" && isRendaFixa && (
            <FieldGroup className="grid w-full grid-cols-1 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="total-rf"
                  className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
                >
                  Valor Total (R$)
                </FieldLabel>
                <Input
                  id="total-rf"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0,00"
                  value={totalRendaFixa}
                  onChange={(event) =>
                    setTotalRendaFixa(
                      sanitizeUnsignedNumberInput(event.target.value),
                    )
                  }
                  onKeyDown={(event) => {
                    if (["-", "+", "e", "E"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  className="no-number-spinner bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                />
              </Field>
            </FieldGroup>
          )}

          {!isRendaFixa &&
            operacao === "venda" &&
            quantidade !== "" &&
            quantityNumber > selectedWalletQuantity && (
              <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">
                Quantidade disponível para venda: {selectedWalletQuantity}
              </div>
            )}

          <Button
            className={`w-full font-semibold shadow-lg transition-all duration-200 ${
              operacao === "compra"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
                : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40"
            }`}
            disabled={!canConfirm || isSubmitting}
            onClick={handleConfirmar}
          >
            {isSubmitting
              ? "Salvando..."
              : `Confirmar ${operacao === "compra" ? "Compra" : "Venda"}`}
          </Button>

          {feedback && (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-600"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
