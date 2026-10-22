// All player-facing text lives here (Portuguese).
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const points = (n: number) => `${n} ${n === 1 ? 'ponto' : 'pontos'}`;

export const STRINGS = {
  title: 'Vinder 🍷',
  stampDrink: 'BEBER',
  stampReject: 'RECUSAR',
  vintage: (year: number) => `Safra ${year}`,
  price: (value: number) => priceFormat.format(value),

  // Menu
  tagline: 'O Tinder do vinho',
  play: 'Jogar',
  howToPlay: 'Arraste para a direita para beber,\npara a esquerda para recusar.',

  // In-game HUD
  score: (n: number) => `Pontos: ${n}`,
  heartFull: '❤️',
  heartEmpty: '🖤',

  // Feedback right after a swipe
  scored: '+1 🍷',
  dodged: 'Ufa! Era ruim 💀',
  lostPatience: 'Esse era bom! 😤',

  // Game over
  gameOver: 'FIM DE JOGO',
  defaultDeath: 'Passou mal e não resistiu.',
  gaveUp: 'Cansou de esperar e foi embora.',
  finalScore: (n: number) => points(n),
  bestScore: (n: number) => `Recorde: ${points(n)}`,
  newRecord: '🏆 Novo recorde!',
  playAgain: 'Beber de novo',
  backToMenu: 'Menu',

  // Cellar (collection)
  cellar: 'Adega',
  cellarTitle: 'Adega 🍷',
  cellarCount: (found: number, total: number) => `${found} de ${total} vinhos descobertos`,
  unknownWine: '???',
  unknownWineHint: 'Ainda não descoberto',
  back: 'Voltar',
} as const;
