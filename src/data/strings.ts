// All player-facing text lives here (Portuguese).
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const STRINGS = {
  title: 'Vinder 🍷',
  stampDrink: 'BEBER',
  stampReject: 'RECUSAR',
  drank: 'BEBEU',
  rejected: 'RECUSOU',
  vintage: (year: number) => `Safra ${year}`,
  price: (value: number) => priceFormat.format(value),
} as const;
