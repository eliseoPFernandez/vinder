# Vinder — Passagem para a fase de Design e Conteúdo

> Documento para levar a outra conversa com o Claude (ou a uma ferramenta de design).
> Resume o que já foi construído, o que é provisório e **em que formato** design e conteúdo
> precisam voltar para serem aplicados no jogo pelo Claude Code.

- **Jogo no ar:** https://eliseopfernandez.github.io/vinder/
- **Código:** https://github.com/eliseoPFernandez/vinder
- **Documentos de origem:** `CLAUDE.md`, `GDD.md`, `BACKLOG.md` (na mesma pasta)

---

## 1. Onde estamos

A mecânica está pronta e jogável no celular. Etapas do BACKLOG concluídas:

| Etapa | O que entrega | Status |
|---|---|---|
| E1 | Projeto publicado no GitHub Pages | ✅ |
| E2 | Carta com swipe (segue o dedo, inclina, voa ou volta) | ✅ |
| E3 | Vinhos vindos do `wines.json`, embaralhados | ✅ (só 6 vinhos, por escolha) |
| E4 | Pontos, paciência (3 corações), personagem com expressões | ✅ |
| E5 | Menu, Fim de Jogo, recorde salvo | ✅ |
| E6 | Morte animada, saída por paciência, sons e vibração | ✅ |
| E7 | Adega (coleção de vinhos descobertos) | ✅ |
| E8 | Dificuldade progressiva + mais vinhos | ⏸️ aguardando a base de vinhos |
| E9 | Instalável no celular (PWA) | ⏸️ não iniciada |

**Tudo o que se vê hoje é provisório:** emojis no lugar de desenhos, fonte do sistema, cores
improvisadas, sons sintetizados por código e apenas 6 vinhos de exemplo.

---

## 2. Como o jogo funciona hoje (resumo das regras implementadas)

- Aparece uma carta de vinho. **Direita = beber, esquerda = recusar.** Setas ← → no computador.
- **Beber bom:** +1 ponto, personagem feliz, som de gole + comemoração.
- **Beber ruim:** personagem treme, fica verde, cai; tela treme, celular vibra, "trombone triste";
  vai para o Fim de Jogo com a frase de morte do vinho.
- **Recusar ruim:** seguro, mensagem "Ufa! Era ruim".
- **Recusar bom:** perde 1 de 3 corações. Zerou: o personagem bufa, sai andando, e o Fim de Jogo
  mostra uma cadeira vazia.
- **Recorde** e **Adega** ficam salvos no próprio navegador do celular.
- Baralho reembaralha a cada partida; ao acabar, embaralha de novo sem repetir a última carta.

---

## 3. Telas e elementos que o design precisa cobrir

Tela base: **390 × 844 px, retrato** (o jogo escala para caber em qualquer celular, mantendo a
proporção; sobra faixa nas bordas se o celular for mais largo/estreito).

### 3.1 Menu
- Personagem (expressão neutra), título "Vinder 🍷", subtítulo "O Tinder do vinho"
- "Recorde: X pontos"
- Botão principal **Jogar**, botão secundário **Adega**
- Texto de instrução curto

### 3.2 Jogo
- Topo: **Pontos** (esquerda) e **3 corações** de paciência (direita), cheios/vazios
- **Personagem** grande no topo (hoje ~96 px)
- Mensagem rápida após cada swipe ("+1 🍷", "Ufa! Era ruim 💀", "Esse era bom! 😤")
- **Carta do vinho** no centro (hoje **300 × 420 px**), com:
  - ícone/ilustração do vinho
  - nome, uva · país, safra · preço, descrição entre aspas
  - **carimbos** "BEBER" (verde, canto superior esquerdo) e "RECUSAR" (vermelho, canto superior
    direito) que aparecem conforme a carta é arrastada

### 3.3 Fim de Jogo
- Personagem na pose final (caído/verde se morreu; cadeira vazia se foi embora)
- "FIM DE JOGO"
- **Frase da morte em destaque** (hoje num "bilhete" creme inclinado)
- Pontuação grande, recorde ou "🏆 Novo recorde!" pulsando
- Botões: **Beber de novo** (principal), **Adega**, **Menu**

### 3.4 Adega
- Título, contador "X de Y vinhos descobertos"
- Lista rolável de todos os vinhos: descobertos (nome, uva, país, safra; ruins com 💀) e
  não descobertos ("???", escuro, como silhueta)
- Botão **Voltar**

### 3.5 Personagem — estados e animações necessários
| Estado | Quando | Hoje |
|---|---|---|
| neutro | padrão | 🙂 |
| feliz | bebeu vinho bom | 😄 |
| impaciente | recusou vinho bom | 😤 |
| passando mal | começo da morte (treme e esverdeia) | 🤢 |
| morto / caído | fim da morte | 😵 deitado e verde |
| indo embora | perdeu toda a paciência (anda para fora da tela) | 🚶 |
| ausente | Fim de Jogo por paciência | 🪑 |

Animações atuais (podem ser redesenhadas): tremer → ficar verde → cair com quique; bufar → sair
andando com passinhos. Se o novo personagem tiver mais quadros (ex.: animação de andar), ótimo.

---

## 4. Formato em que o DESIGN deve voltar

Para o Claude Code aplicar sem retrabalho:

1. **Paleta** em códigos hex (fundo, carta, texto, botão principal/secundário, verde "bom",
   vermelho "ruim", dourado do recorde).
2. **Fonte(s)** com licença livre (ex.: Google Fonts) — nome exato.
3. **Imagens** em **PNG com fundo transparente** (ou SVG), no **dobro do tamanho de exibição**
   para ficar nítido (ex.: carta 600 × 840 px; personagem ~200–300 px de altura):
   - personagem: um arquivo por estado da tabela 3.5 (ou uma folha de sprites, se animado)
   - fundo da carta / moldura; ícone ou rótulo de vinho (pode variar por tipo: tinto, branco,
     rosé, espumante)
   - corações cheio/vazio, carimbos BEBER/RECUSAR (opcional — pode ser texto estilizado)
   - fundo das telas (opcional)
   - ícone do app 512 × 512 px (para a E9)
4. **Mockups** das 4 telas (imagem ou link) para referência de posição e tamanho.
5. **Sons** (opcional): arquivos .mp3/.ogg com licença livre (CC0) e o link de onde vieram —
   gole, comemoração, morte, resmungo. Se não vier nada, mantemos os sons sintetizados.

Restrições do CLAUDE.md que continuam valendo: estilo **cartoon**, humor tragicômico, **nada
gráfico ou realista**, marcas e vinhos **fictícios**.

---

## 5. Formato em que o CONTEÚDO deve voltar

### 5.1 Vinhos
Cada vinho precisa destes campos (uma planilha, lista ou JSON — o Claude Code converte):

| Campo | Obrigatório | Exemplo |
|---|---|---|
| nome | sim | Château Garrafão |
| uva | sim | Merlot |
| país | sim | Argentina |
| safra | sim | 2031 |
| preço (R$) | sim | 59,90 |
| descrição | sim | Notas de frutas vermelhas e carvalho. |
| bom ou ruim | sim | ruim |
| frase da morte | só para ruins | Morreu abraçado ao garrafão. |
| dificuldade (1 a 3) | sim | 1 = pista óbvia · 2 = moderada · 3 = sutil |
| tipo (opcional) | não | tinto / branco / rosé / espumante — se o design usar ícones por tipo |

Regras do GDD: o jogo é de **dedução, não de sorte** — todo vinho ruim precisa de ao menos uma
pista perceptível na carta (safra impossível, preço absurdo, descrição alarmante, nome duvidoso,
cor/detalhe estranho). Quanto maior a dificuldade, mais sutil a pista.

Hoje no jogo (modelo): 3 bons (Quinta do Vovô, Monte Branco, Rosé da Tia Lurdes) e 3 ruins, cada
um com um tipo de pista — Château Garrafão (safra 2031), Reserva do Posto (R$ 4,99),
Tinto do Bueiro ("aroma de pneu").

### 5.2 Textos do jogo
Todos os textos ficam num único arquivo. Lista atual, para revisar/reescrever no tom desejado:

| Onde | Texto atual |
|---|---|
| Título | Vinder 🍷 |
| Subtítulo | O Tinder do vinho |
| Instrução | Arraste para a direita para beber, para a esquerda para recusar. |
| Botões | Jogar · Adega · Beber de novo · Menu · Voltar |
| Carimbos | BEBER · RECUSAR |
| Placar | Pontos: X · Recorde: X pontos |
| Após swipe | +1 🍷 · Ufa! Era ruim 💀 · Esse era bom! 😤 |
| Fim de jogo | FIM DE JOGO · 🏆 Novo recorde! |
| Morte padrão | Passou mal e não resistiu. |
| Saída por paciência | Cansou de esperar e foi embora. |
| Adega | Adega 🍷 · X de Y vinhos descobertos · ??? · Ainda não descoberto |

Sugestão: criar **várias frases** para "Esse era bom!", "Ufa!" e "Cansou de esperar" — o jogo pode
sortear uma a cada vez.

---

## 6. Decisões em aberto (do GDD)
- Nome definitivo do jogo
- Visual do personagem (quem é? idade, estilo, roupa)
- Critério final de bom/ruim
- Quantidade de vinhos na versão final
- Ainda faltam no backlog: E8 (progressão por dificuldade) e E9 (instalar como app)

---

## 7. Como voltar ao Claude Code
Abra o Claude Code na pasta `Vinder` e diga, por exemplo:

> "Etapa de polish. Aplique o novo design: [cole paleta, fontes e anexe as imagens].
> Mantenha a mecânica igual. Me mostre o plano antes."

> "Substitua os vinhos do wines.json por esta lista: [planilha/lista]. Depois faça a E8."
