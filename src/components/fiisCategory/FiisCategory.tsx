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

export function FiisCategory({
  data = defaultData,
  titulo = "FIIs por Categoria",
}: FiisPorCategoriaProps) {
  const total = data.reduce((acc, item) => acc + item.valorTotal, 0);

  return (
    <Card className="bg-[#1a1d2e] border-[#2a2d3e] text-white w-full max-w-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-white">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2a2d3e] hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium text-sm pl-0">
                Categoria
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm text-right pr-0">
                Valor Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.categoria}
                className="border-b border-[#2a2d3e] hover:bg-[#23263a] transition-colors"
              >
                <TableCell className="text-white text-sm py-3 pl-0">
                  {item.categoria}
                </TableCell>
                <TableCell className="text-white text-sm py-3 text-right pr-0">
                  {formatBRL(item.valorTotal)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-[#23263a] hover:bg-[#23263a] border-0 rounded-b-xl">
              <TableCell className="font-bold text-white text-sm py-3 pl-0 rounded-bl-xl">
                TOTAL
              </TableCell>
              <TableCell className="font-bold text-white text-sm py-3 text-right pr-0 rounded-br-xl">
                {formatBRL(total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
