# BACKLOG — Vinder

Uma etapa por vez. Ao fim de cada uma: testar no celular → aprovar → commit → próxima.
Cada etapa traz o **prompt** para colar no Claude Code e o **critério de aceite**, que é o que você confere antes de aprovar.

---

## E0 — Preparação (você faz, uma vez só)
1. Crie uma conta no GitHub, se ainda não tiver.
2. Instale o Claude Code (desktop ou terminal) e faça login.
3. Crie uma pasta vazia, por exemplo `vinder`, e coloque dentro dela `CLAUDE.md`, `GDD.md` e `BACKLOG.md`.
4. Abra o Claude Code nessa pasta.

**Prompt:**
> Leia CLAUDE.md, GDD.md e BACKLOG.md. Não programe nada ainda. Me diga em linguagem simples o que você entendeu do jogo, o que eu preciso ter instalado no computador e me guie para instalar o que faltar.

**Aceite:** ele resumiu o jogo corretamente e o seu computador está pronto.

---

## E1 — Projeto rodando no celular
**Prompt:**
> Vamos fazer a etapa E1 do BACKLOG. Crie o projeto com a stack do CLAUDE.md, com uma tela simples escrito "Vinder 🍷". Configure o git, um repositório no meu GitHub e o deploy no GitHub Pages. Me guie em qualquer passo que eu precise fazer no navegador. No fim, me dê o link para abrir no celular.

**Aceite:** você abre um link no celular e vê "Vinder 🍷" na tela, em modo retrato.

---

## E2 — Carta com swipe
**Prompt:**
> Etapa E2. Crie uma carta no centro da tela, por enquanto só um retângulo com texto "Vinho de teste". Ela deve seguir o dedo e inclinar. Se eu soltar depois de um certo ponto, ela voa para o lado e aparece uma nova carta. Se eu soltar antes, ela volta ao centro. Setas do teclado fazem o mesmo. Mostre um texto "BEBEU" ou "RECUSOU" ao soltar. Faça o deploy no fim.

**Aceite:** o swipe é gostoso de usar no celular, sem travar. Isso é o coração do jogo, então vale insistir até ficar bom.

---

## E3 — Vinhos de verdade
**Prompt:**
> Etapa E3. Crie o wines.json com 20 vinhos fictícios e engraçados seguindo o GDD: 12 bons e 8 ruins, quase todos de dificuldade 1, com pistas claras nos ruins. Mostre na carta o nome, a uva, o país, a safra, o preço e a descrição. Embaralhe as cartas a cada partida. Me mostre a lista dos 20 vinhos antes de seguir, para eu aprovar os nomes e as piadas.

**Aceite:** os textos dos vinhos te fazem rir e dá para perceber os ruins.

---

## E4 — Regras do jogo
**Prompt:**
> Etapa E4. Implemente as regras de pontuação e pressão do GDD: +1 ponto ao beber vinho bom, game over ao beber vinho ruim, e a barra de paciência com 3 corações que perde 1 ao recusar vinho bom. Coloque um personagem simples no topo (pode ser um emoji grande) que muda de expressão: neutro, feliz ao beber vinho bom, impaciente ao perder paciência. Por enquanto, o game over pode ser só um texto na tela.

**Aceite:** dá para jogar uma partida completa do início ao game over, e recusar tudo não funciona como estratégia.

---

## E5 — Telas e recorde
**Prompt:**
> Etapa E5. Crie as telas de Menu e Game Over descritas no GDD. Salve o recorde no localStorage. Game Over mostra a pontuação, o recorde (com destaque se for novo) e o botão "Beber de novo".

**Aceite:** o fluxo menu → jogo → game over → jogar de novo funciona, e o recorde continua salvo depois de fechar o navegador.

---

## E6 — Mortes trágicas e feedback
**Prompt:**
> Etapa E6. Deixe o game over dramático e engraçado: animação do personagem passando mal e caindo (tremer, ficar verde, cair), a deathMessage do vinho em destaque, vibração do celular e sons simples (gole, comemoração, morte). Para a morte por paciência, crie uma animação diferente do personagem indo embora. Use sons gratuitos (CC0) e me diga de onde vieram.

**Aceite:** a morte te faz rir.

---

## E7 — Adega (coleção)
**Prompt:**
> Etapa E7. Implemente a Adega do GDD: salve no localStorage cada vinho que já apareceu e crie a tela Adega, acessível pelo Menu e pelo Game Over, com os vinhos descobertos, silhuetas dos que faltam e o contador "X de 20". Vinhos ruins descobertos aparecem com uma caveira 💀.

**Aceite:** dá vontade de completar a Adega.

---

## E8 — Dificuldade e mais conteúdo
**Prompt:**
> Etapa E8. Aumente para 40 vinhos, com dificuldades 1, 2 e 3 (pistas cada vez mais sutis), e implemente a progressão do GDD: a cada 5 pontos entram vinhos mais difíceis. Me mostre os vinhos novos antes de implementar.

**Aceite:** as partidas ficam mais tensas com o tempo.

---

## E9 — Instalável no celular (PWA)
**Prompt:**
> Etapa E9. Transforme o jogo em PWA: ícone, nome, tela cheia sem a barra do navegador e funcionamento offline. Me explique como instalar no iPhone e no Android.

**Aceite:** o jogo tem ícone na tela inicial do celular e abre como um app.

---

## Quando algo der errado
Frases úteis para usar no Claude Code:
- "Deu esse problema: [descreva o que viu]. [cole um print]. Investigue e corrija."
- "Isso piorou. Volte para o último commit que funcionava."
- "Antes de mudar qualquer coisa, me explique o que você acha que está causando isso."
- "Está ficando complicado. Simplifique mantendo o mesmo comportamento."
