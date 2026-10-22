// All player-facing text lives here (Portuguese).
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const STRINGS = {
  title: 'Vinder 🍷',
  stampDrink: 'BEBER',
  stampReject: 'RECUSAR',
  vintage: (year: number) => `Safra ${year}`,
  price: (value: number) => priceFormat.format(value),

  score: (points: number) => `Pontos: ${points}`,
  heartFull: '❤️',
  heartEmpty: '🖤',

  // Feedback right after a swipe
  scored: '+1 🍷',
  dodged: 'Ufa! Era ruim 💀',
  lostPatience: 'Esse era bom! 😤',

  // Game over (temporary text version; full screen comes in E5)
  gameOver: 'FIM DE JOGO',
  defaultDeath: 'Passou mal e não resistiu.',
  gaveUp: 'Cansou de esperar e foi embora.',
  finalScore: (points: number) => `Você fez ${points} ${points === 1 ? 'ponto' : 'pontos'}`,
  tapToRestart: 'Toque para jogar de novo',
} as const;
