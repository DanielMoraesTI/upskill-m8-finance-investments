import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FiiCategory {
  categoria: string;
  valorTotal: number;
}

interface FiisPorCategoriaProps {
  data?: FiiCategory[];
  titulo?: string;
}

const defaultData: FiiCategory[] = [
  { categoria: "Fundos de Papel", valorTotal: 20075.33 },
  { categoria: "Fundos de Tijolo", valorTotal: 32080.14 },
  { categoria: "Fundos Híbridos", valorTotal: 5766.27 },
];

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function AssetCategoryTable({
  data = defaultData,
  titulo = "FIIs por Categoria",
}: FiisPorCategoriaProps) {
  const total = data.reduce((acc, item) => acc + item.valorTotal, 0);

  const dataWithPercentages = data.map((item) => ({
    ...item,
    porcentagem:
      total > 0 ? `${((item.valorTotal / total) * 100).toFixed(2)}%` : "0%",
  }));

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg w-full max-w-md rounded-2xl">
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-base font-semibold text-foreground">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="w-[50%] text-muted-foreground/50 font-semibold text-xs uppercase tracking-widest pl-0">
                Categoria
              </TableHead>
              <TableHead className="w-[20%] text-muted-foreground/50 font-semibold text-xs uppercase tracking-widest text-right pr-2 whitespace-nowrap">
                %
              </TableHead>
              <TableHead className="w-[30%] text-muted-foreground/50 font-semibold text-xs uppercase tracking-widest text-right pr-0 whitespace-nowrap">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataWithPercentages.map((item) => (
              <TableRow
                key={item.categoria}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <TableCell className="text-foreground text-sm py-3 pl-0 pr-2">
                  {item.categoria}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm py-3 text-right pr-2 whitespace-nowrap">
                  {item.porcentagem}
                </TableCell>
                <TableCell className="text-foreground text-sm py-3 text-right pr-0 whitespace-nowrap font-semibold">
                  {formatBRL(item.valorTotal)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/20 hover:bg-muted/20 border-0 rounded-b-xl">
              <TableCell className="font-bold text-primary text-sm py-3 pl-0 rounded-bl-xl">
                TOTAL
              </TableCell>
              <TableCell className="font-bold text-foreground text-sm py-3 text-right pr-2 whitespace-nowrap">
                100%
              </TableCell>
              <TableCell className="font-bold text-primary text-sm py-3 text-right pr-0 rounded-br-xl whitespace-nowrap">
                {formatBRL(total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
