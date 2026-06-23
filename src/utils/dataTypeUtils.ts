// Esta função formata um número como moeda brasileira (BRL).
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}
// Esta função formata uma data no formato brasileiro (dd/mm/yyyy).
export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(dateStr));
}
// Esta função calcula a porcentagem de um valor em relação a um total e formata o resultado como uma string.
export function calcPct(value: number, total: number, decimals = 1): string {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(decimals)}% do total`;
}