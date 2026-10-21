# GDD — Vinder (nome provisório)

## Pitch
Escolha vinhos pra tomar. Se o vinho for bom, o personagem fica feliz e ganha ponto. Se for ruim, ele passa mal, morre e o jogo acaba de forma trágica. É o "Tinder do vinho".

## Tom
Humor tragicômico, visual cartoon. As mortes são exageradas e engraçadas, nunca gráficas.

## Plataforma
Navegador do celular, modo retrato, partidas de 1 a 3 minutos.

## Controles
- **Swipe para a direita** → beber
- **Swipe para a esquerda** → recusar
- A carta acompanha o dedo e inclina levemente. Se o jogador soltar antes do limite, ela volta ao centro.
- No computador: setas ← → para testes.

## Core loop
1. Aparece uma carta de vinho.
2. O jogador lê as pistas e decide: beber ou recusar.
3. O personagem reage.
4. Próxima carta, até o game over.
5. Ao final, o jogador vê a pontuação e o recorde, e quer jogar de novo para bater o recorde e descobrir os vinhos que ainda não viu.

## Carta de vinho
Cada vinho em `wines.json` tem:

| Campo | Exemplo |
|---|---|
| `id` | `chateau-garrafao-2031` |
| `name` | Château Garrafão |
| `grape` | Merlot |
| `country` | "Argentina" |
| `vintage` | 2031 |
| `price` | 4.99 |
| `description` | "Notas de frutas vermelhas e leve aroma de pneu." |
| `isGood` | `false` |
| `deathMessage` | "Morreu abraçado ao garrafão." (só para vinhos ruins) |
| `difficulty` | 1 a 3 (quão sutil é a pista) |

## Bom vs. ruim — regra provisória
O jogo precisa ser de **dedução, não de sorte**: o jogador tem que conseguir perceber o vinho ruim pelas pistas da carta.

Vinhos ruins têm pelo menos uma pista suspeita:
- Safra no futuro (2031)
- Preço absurdo (R$ 4,99 ou R$ 9.999)
- Descrição alarmante ("aroma de pneu", "final metálico persistente")
- Nome duvidoso ("Château Garrafão", "Reserva do Posto")
- Cor ou detalhe estranho ("verde fluorescente", "rolha estufada")

Com a dificuldade subindo, as pistas ficam mais sutis.

## Pontuação e pressão
- Beber vinho bom: **+1 ponto**, personagem feliz.
- Beber vinho ruim: **game over** com morte tragicômica.
- Recusar vinho ruim: seguro, sem pontos.
- Recusar vinho bom: o personagem perde 1 de **paciência** (barra de 3). Se zerar, ele desiste e vai embora: game over alternativo, também cômico.

A barra de paciência existe para impedir a estratégia de recusar tudo.

## Dificuldade
- Começa com vinhos de dificuldade 1 (pistas óbvias).
- A cada 5 pontos, entram vinhos de dificuldade maior.
- Opcional, mais adiante: tempo limite por carta.

## Game over
- Animação de morte tragicômica, com a frase `deathMessage` do vinho.
- Tela com pontuação, recorde, botão "Beber de novo" e acesso à Adega.

## Adega (coleção)
- Todo vinho que já apareceu fica registrado.
- Tela "Adega" com os vinhos descobertos e silhuetas dos que faltam, mais um contador "X de Y vinhos".
- Responde ao objetivo de ver todas as bebidas do jogo.

## Telas
1. Menu: título, "Jogar", "Adega", recorde
2. Jogo: personagem no topo, carta no centro, pontuação e paciência
3. Game over
4. Adega

## Como saber se o MVP deu certo
- Dá vontade de jogar mais uma partida?
- As mortes fazem rir?
- Dá para perceber os vinhos ruins na maioria das vezes, mas não sempre?

## Questões em aberto
- Nome definitivo do jogo
- Visual do personagem
- Critério final de bom/ruim (a regra acima é provisória)
- Quantidade de vinhos na versão final
