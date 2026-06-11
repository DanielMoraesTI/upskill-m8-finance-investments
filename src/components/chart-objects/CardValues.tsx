import { LucideIcon } from "lucide-react"; // Importa o tipo do ícone
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardValuesProps = {
  title: string;
  value: string;
  icon: LucideIcon; // Adiciona o ícone nas Props esperando um componente do Lucide
};

// Desestrutura o "icon: Icon" (com 'I' maiúsculo para o React entender que é um componente)
export default function CardValues({ title, value, icon: Icon }: CardValuesProps) {
  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {/* Renderiza o ícone dinâmico aqui no Header (padrão de dashboard do shadcn) */}
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold tabular-nums text-zinc-900">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
