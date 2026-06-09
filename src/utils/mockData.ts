// interface ItemCardData {
//     id: string;
//     name: string;
//     dataInicial: string; // ISO date string
//     valorInicial: number;
//     valorTotal: number;
//     dataAtualizacao: string; // ISO date string
// }

// // Registra o histórico
// interface ITransaction {
//     id: number;
//     asset: {
//         id: number;
//         name: string;
//         description: string;
//         type: string;
//     },
//     entry_type: 'buy' | 'sell';
//     date: string; // ISO date string
//     quantity: number;
//     unit_price: number;
//     total_value: number;
// }

// // Exibe os campos calculados




// // Renda Fixa
// const rendaFixa: ItemCardData[] = [
//   {
//     id: "1",
//     name: "Itaú Crédito Bancário Renda Fixa Crédito Privado",
//     dataInicial: "15/05/2024",
//     valorInicial: 30000.0,
//     valorAtual: 45000.0,
//     dataAtualizacao: "2024-05-28T10:30:00Z",
//   }
// ];

// // FIIs
// const fiis: ItemCardData[] = [
//   {
//     id: "1",
//     sigla: "CPTS11",
//     categoria: "Fundo de Papel",
//     quantidade: 150,
//     valorTotal: 45000.0,
//     dataAtualizacao: "2024-05-28T10:30:00Z",
//   }
// ];

// const acoes: ItemCardData[] = [
//   {
//     id: "1",
//     sigla: "ITSA3",
//     name: "ITAUSA S.A.",
//     quantidade: 150,
//     valorTotal: 45000.0,
//     dataAtualizacao: "2024-05-28T10:30:00Z",
//   }
// ];