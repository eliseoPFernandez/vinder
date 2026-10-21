# Vinder (nome provisório)

Jogo mobile casual no estilo "Tinder do vinho". O jogador recebe cartas de vinho, uma por vez, e faz swipe para a direita (beber) ou para a esquerda (recusar). Vinho bom bebido = ponto e personagem feliz. Vinho ruim bebido = personagem passa mal, morre de forma tragicômica e o jogo acaba.

Regras completas em `GDD.md`. Etapas de construção em `BACKLOG.md`.

## Sobre quem está construindo — LEIA PRIMEIRO

O dono do projeto **não programa**. Você (Claude Code) escreve 100% do código. Portanto:

- Ao fim de cada tarefa, explique o que fez em linguagem simples, sem jargão técnico.
- Sempre diga **exatamente como testar**: o que rodar, o que abrir no celular, o que ele deve ver.
- Antes de mudanças grandes, descreva o plano em 3–5 linhas e peça confirmação.
- Faça um commit git ao final de cada etapa concluída, com mensagem descritiva.
- Se algo der erro, investigue e corrija você mesmo. Nunca peça para o usuário editar código.
- Se o usuário mandar um print de tela com problema, use-o como ponto de partida para investigar.
- Trabalhe **uma etapa do BACKLOG por vez**. Não adiante funcionalidades de etapas futuras.
- Não adicione bibliotecas novas sem explicar por quê.

## Stack

- **Phaser 3 + TypeScript (strict) + Vite**
- Sem backend. Dados de vinhos em JSON local; recorde e coleção salvos em `localStorage`.
- Alvo: navegador do celular, orientação retrato (portrait).
- Deploy: GitHub Pages, para testar pelo link no celular sem precisar de cabo nem rede local.

## Estrutura de pastas

```
src/
  main.ts                 # config do Phaser
  scenes/                 # BootScene, MenuScene, GameScene, GameOverScene, CellarScene
  objects/                # WineCard, Character
  systems/                # deck (baralho), score, storage (localStorage)
  data/
    wines.json            # todos os vinhos — única fonte de dados de vinho
    strings.ts            # todos os textos exibidos no jogo
public/assets/            # imagens e sons
```

## Convenções

- Código, variáveis e nomes de arquivo em inglês. Textos exibidos no jogo em português, centralizados em `src/data/strings.ts`.
- Dados de vinho nunca ficam fixos dentro das cenas: sempre vêm de `wines.json`.
- Resolução base 390x844, `Phaser.Scale.FIT`, centralizado.
- Toque primeiro. Setas ← → do teclado como atalho para testar no computador.
- Assets provisórios (formas geométricas e emojis) até a etapa de polish.
- Vinhos e marcas são **fictícios**. Não usar nomes de marcas reais.
- Tom: humor tragicômico, estilo cartoon. Nada gráfico ou realista.

## Comandos

- `npm run dev -- --host` — roda localmente, acessível no celular na mesma rede Wi-Fi
- `npm run build` — gera a versão final
- `npm run deploy` — publica no GitHub Pages

## Fora do escopo (não implementar no MVP)

Login, ranking online, monetização, anúncios, multiplayer, múltiplos idiomas, app nativo para lojas.
