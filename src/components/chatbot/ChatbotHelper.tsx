"use client";

import { Bot } from "lucide-react";

interface ChatbotHelperProps {
  showHelp: boolean;
  setShowHelp: (value: boolean) => void;
}

export default function ChatbotHelper({
  showHelp,
  setShowHelp,
}: ChatbotHelperProps) {
  return (
    <dialog id="help_modal" className="modal" open={showHelp}>
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bot className="text-primary" /> Como usar este chat?
        </h3>
        <div className="py-4 space-y-4">
          <section>
            <h4 className="font-semibold text-sm uppercase text-base-content/60">
              O que é este chat?
            </h4>
            <p className="text-sm">
              Seu assistente financeiro impulsionado por inteligência
              artificial. Ele ajuda você a analisar gastos, acompanhar metas e
              entender seu fluxo de caixa.
            </p>
          </section>
          <section>
            <h4 className="font-semibold text-sm uppercase text-base-content/60">
              O que posso perguntar?
            </h4>
            <p className="text-sm">
              Você pode perguntar sobre suas transações, distribuição de
              categorias ou projeções futuras.
            </p>
          </section>
          <section>
            <h4 className="font-semibold text-sm uppercase text-base-content/60">
              Exemplos
            </h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Qual foi meu maior gasto no mês passado?</li>
              <li>Quanto vou gastar na próxima semana?</li>
              <li>Qual será o meu saldo no final do próximo mês?</li>
            </ul>
          </section>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={() => setShowHelp(false)}>
              Fechar
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
