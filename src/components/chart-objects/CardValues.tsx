import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardValuesProps = {
  title: string;
  value: string;
  percentage?: string;
  icon: LucideIcon;
  highlight?: boolean;
};

export default function CardValues({
  title,
  value,
  percentage,
  icon: Icon,
  highlight = false,
}: CardValuesProps) {
  return (
    <Card className={`
      w-full max-w-sm border-border/50 backdrop-blur-sm shadow-lg card-hover cursor-default group relative overflow-hidden
      ${highlight
        ? "bg-emerald-950/60 border-emerald-700/40"
        : "bg-card/80"
      }
    `}>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-primary/5 to-transparent" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5">
        <CardTitle className={`text-xs font-semibold uppercase tracking-widest ${
          highlight ? "text-emerald-400/80" : "text-muted-foreground/70"
        }`}>
          {title}
        </CardTitle>
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
          highlight
            ? "bg-emerald-500/15 border-emerald-500/30 group-hover:bg-emerald-500/25"
            : "bg-primary/10 border-primary/20 group-hover:bg-primary/15"
        }`}>
          <Icon className={`h-4 w-4 ${highlight ? "text-emerald-400" : "text-primary"}`} />
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className={`text-2xl font-bold tabular-nums tracking-tight ${
          highlight ? "text-emerald-300" : "text-foreground"
        }`}>
          {value}
        </div>
        {percentage && (
          <p className={`text-xs mt-1 tabular-nums ${
            highlight ? "text-emerald-500/70" : "text-muted-foreground/50"
          }`}>
            {percentage} do total
          </p>
        )}
      </CardContent>
    </Card>
  );
}
