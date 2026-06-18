export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(dateStr));
}

export function calcPct(value: number, total: number, decimals = 1): string {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(decimals)}% do total`;
}