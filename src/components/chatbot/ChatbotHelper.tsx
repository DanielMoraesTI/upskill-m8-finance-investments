"use client";
import { Bot, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function ChatbotHelper() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row items-center px-2 py-1 text-xs gap-2 rounded-md bg-background hover:bg-accent border w-fit self-center">
        Ajuda <HelpCircle size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Bot className="text-primary" /> Como usar este chat?
          </DialogTitle>
          <DialogDescription>
            <div className="py-4 space-y-4">
              <section>
                <h4 className="font-semibold text-sm uppercase text-base-content/60">
                  O que é este chat?
                </h4>
                <p className="text-sm">
                  Seu assistente financeiro impulsionado por inteligência
                  artificial. Ele ajuda você a analisar e entender os seus
                  investimentos.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-sm uppercase text-base-content/60">
                  O que posso perguntar?
                </h4>
                <p className="text-sm">
                  Você pode perguntar sobre suas carteira de ativos e
                  transações.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-sm uppercase text-base-content/60">
                  Exemplos
                </h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Quais ativos que mais comprei nos últimos 6 meses?</li>
                  <li>Qual ativo tenho comprado menos nos últimos 3 meses?</li>
                  <li>Compare a carteira atual com 3 meses atrás.</li>
                </ul>
              </section>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Fechar</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
