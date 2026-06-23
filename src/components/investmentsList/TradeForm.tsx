"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTransaction } from "@/context/TransactionProvider";
import { useMemo } from "react";

type TradeOperacao = "comprar" | "vender" | "resgatar";
// Este componente é o formulário de negociação (TradeForm), que é utilizado para registrar operações de compra, venda ou resgate de ativos. Ele recebe props como a operação a ser realizada (comprar, vender ou resgatar), o rótulo do ativo, o ID do ativo e uma função de callback para ser chamada após uma operação bem-sucedida. O TradeForm utiliza estados locais para gerenciar os valores de quantidade, valor unitário e feedback para o usuário. Ele calcula o valor total da operação com base na quantidade e no valor unitário, e formata esse valor para exibição em reais (BRL). O formulário inclui campos de entrada para a quantidade e o valor unitário, um campo somente leitura para o total calculado, e um botão para confirmar a operação. Ao enviar o formulário, ele chama a função createMutation do contexto de transações para registrar a operação, e exibe feedback de sucesso ou erro com base no resultado da operação. O TradeForm é essencial para fornecer uma interface de usuário clara e eficiente para os usuários registrarem suas operações de investimento, garantindo que eles possam inserir as informações necessárias de forma fácil e receber feedback imediato sobre o status da operação. Ele melhora a experiência do usuário ao simplificar o processo de registro de operações de compra, venda e resgate, permitindo que os usuários gerenciem suas transações financeiras de forma eficiente e com confiança, sabendo que receberão feedback claro sobre o sucesso ou falha de suas operações. O TradeForm é um componente fundamental para a funcionalidade do portal de investimentos, garantindo que os usuários possam interagir facilmente com o sistema para registrar suas operações de investimento, contribuindo para uma experiência geral positiva ao usar o portal de investimentos. Ele é projetado para ser responsivo e se adaptar a diferentes tamanhos de tela, garantindo que os usuários possam acessar e usar o formulário de negociação em dispositivos móveis e desktops, melhorando a acessibilidade e a conveniência para os usuários ao gerenciar suas operações financeiras. O TradeForm é uma parte crucial da interface do usuário do portal de investimentos, proporcionando uma maneira eficiente e intuitiva para os usuários registrarem suas operações de compra, venda e resgate, melhorando a usabilidade e a satisfação geral dos usuários ao interagir com o portal de investimentos. Ele é implementado com uma abordagem flexível, permitindo que novos tipos de operações ou campos sejam adicionados facilmente no futuro, garantindo que o componente possa evoluir junto com as necessidades dos usuários e as funcionalidades do aplicativo. O TradeForm é um componente chave para a experiência do usuário no portal de investimentos, garantindo que os usuários possam gerenciar suas operações financeiras de forma eficiente e com confiança, sabendo que o processo de registro de operações é simples, claro e fornece feedback imediato sobre o status de suas transações, contribuindo para uma experiência geral positiva ao usar o portal de investimentos. Ele é projetado para ser fácil de usar e acessível, garantindo que os usuários possam registrar suas operações de investimento sem dificuldades, melhorando a eficiência e a satisfação do usuário ao interagir com o portal de investimentos. O TradeForm é um componente essencial para os usuários do portal, permitindo que eles tenham controle total sobre o registro de suas operações de compra, venda e resgate, garantindo que as informações sejam registradas corretamente no sistema e que os usuários recebam feedback claro sobre o status de suas operações, melhorando a experiência geral do usuário ao gerenciar suas transações financeiras no portal de investimentos. Ele é um componente fundamental para garantir que os usuários possam navegar e gerenciar suas operações de forma eficaz, proporcionando uma experiência de usuário personalizada e eficiente no portal de investimentos.
interface TradeFormProps {
  operacao: TradeOperacao;
  assetLabel: string;
  assetId?: number;
  onSuccess?: () => void;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcTotal(quantidade: string, valor: string): number {
  const q = parseFloat(quantidade);
  const v = parseFloat(valor.replace(",", "."));
  return !isNaN(q) && !isNaN(v) ? q * v : 0;
}

export default function TradeForm({
  operacao,
  assetLabel,
  assetId,
  onSuccess,
}: TradeFormProps) {
  const { createMutation } = useTransaction();
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isCompra = operacao === "comprar";
  const isResgatar = operacao === "resgatar";
  const total = useMemo(
    () => calcTotal(quantidade, valor),
    [quantidade, valor],
  );
  const canConfirm = quantidade !== "" && valor !== "" && !!assetId;

  const title = isCompra ? "Comprar" : isResgatar ? "Resgatar" : "Vender";
  const subtitle = isCompra
    ? "Registre a compra de cotas"
    : isResgatar
      ? "Registre o resgate"
      : "Registre a venda de cotas";

  const colorClass = isCompra
    ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
    : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40";

  function handleSubmit() {
    if (!assetId) return;

    setFeedback(null);

    createMutation.mutate(
      {
        asset_id: assetId,
        entry_type: operacao === "comprar" ? "buy" : "sell",
        date: new Date().toISOString().slice(0, 10),
        quantity: parseFloat(quantidade),
        unit_price: parseFloat(valor.replace(",", ".")),
        total_value: total,
      },
      {
        onSuccess: () => {
          setFeedback({
            type: "success",
            message: `${title} registrada com sucesso.`,
          });
          setQuantidade("");
          setValor("");
          onSuccess?.();
        },
        onError: (error) => {
          setFeedback({
            type: "error",
            message: error.message || "Nao foi possivel salvar a operacao.",
          });
        },
      },
    );
  }

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
        disabled={!canConfirm || createMutation.isPending}
        onClick={handleSubmit}
      >
        {createMutation.isPending ? "Salvando..." : `Confirmar ${title}`}
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
    </div>
  );
}
