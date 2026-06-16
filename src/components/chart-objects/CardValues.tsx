import { LucideIcon } from "lucide-react"; // Importa o tipo do ícone
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardValuesProps = {
  title: string;
  value: string;
  icon: LucideIcon; // Adiciona o ícone nas Props esperando um componente do Lucide
};

// Desestrutura o "icon: Icon" (com 'I' maiúsculo para o React entender que é um componente)
export default function CardValues({
  title,
  value,
  icon: Icon,
}: CardValuesProps) {
  return (
    <Card className="w-full max-w-sm border-border/50 bg-card/80 backdrop-blur-sm shadow-lg card-hover cursor-default group relative overflow-hidden">
      {/* Glow sutil no hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-primary/5 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
          {title}
        </CardTitle>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="text-2xl font-bold tabular-nums text-foreground tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
