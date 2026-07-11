# O AÇO E A VONTADE
## Sistema Modular de Combate com Armas de Aetherion

---

## 0. NOTA DE ESTUDO — O QUE O `magias.js` ME ENSINOU

Antes de desenhar qualquer peça nova, vale registrar por escrito o que a arquitetura de `magias.js` está *de fato* fazendo, porque é essa lógica — não o tema — que precisa se repetir aqui.

**O motor não guarda técnicas. Guarda peças que se multiplicam.**
`magias.js` nunca tem uma lista de "magias". Tem 15 Aspectos, 9 Verbos e ~12 Modificadores, e uma função (`gerarMagia`) que os combina em tempo real. A "magia" não existe como dado — existe como *resultado de uma consulta*. Isso é a decisão arquitetural mais importante do arquivo, e é a que mais importa copiar.

**Cada camada tem um job mecânico fixo, sempre o mesmo:**
- **Aspecto** = *identidade + traços de escala* (`tracos.escalaAlcance` etc., `dadoBase`, `recurso`). Responde "o que isso É".
- **Verbo** = *ação + peso* (`custoBase`, `multiplicadorDados`, `curvas.*`, `intencao`). Responde "o que isso FAZ".
- **Modificador** = *forma + ajuste* (`custoExtra`, `ajustes.aj*`, `ajusteSequela`). Responde "COMO isso se manifesta no espaço/tempo".
- **Manifestação** (camada opcional 4) = *geometria/textura extra*, empilha por cima sem quebrar as três primeiras.
- **Círculo** = o único número que o jogador gira; tudo escala a partir dele via `curvas{}`.

Nenhuma camada sabe fazer o trabalho da outra. O Aspecto nunca calcula custo. O Verbo nunca decide lore de divindade. Essa separação estrita é o que permite adicionar um 16º Aspecto sem tocar em nenhum Verbo.

**Custo nunca é armazenado — é sempre calculado.** `calcularCusto = (verbo.custoBase × círculo) + mod.custoExtra`, depois multiplicadores, depois `resolverPagamento` como camada independente por cima. Três chamadas de função puras e encadeáveis, cada uma testável isoladamente.

**Escala usa curvas matemáticas nomeadas (`curvas.linear`, `.raiz`, `.quadratica`...), não tabelas fixas por círculo.** Isso é o que permite 10 círculos sem escrever 10 linhas de tabela por Verbo — o Verbo só diz *qual curva* usar, a curva em si é definida uma vez e reaproveitada por todos.

**Existe uma "Camada de Elegibilidade" inteiramente separada do "Motor de Geração".** `resolverElegibilidade` decide SE uma combinação pode ser usada por aquele personagem; `gerarMagia` decide O QUE ACONTECE quando ela é usada. As duas nunca se misturam — isso é o que permite reequilibrar quem-pode-usar-o-quê sem tocar no motor de geração, e vice-versa.

**Toda combinação tem texto narrativo gerado, não escrito à mão por combinação.** `template[aspectoId]` dentro de cada Verbo, `mod.template` dentro de cada Modificador — a narrativa final é a concatenação desses fragmentos (`descricaoFinal: [...].join('\n\n')`), não um texto único por magia. 15 Aspectos × 9 Verbos não geram 135 textos escritos à mão — geram 15+9 fragmentos que se recombinam.

**Existe amortecimento estrutural contra quebras nas pontas da escala** (a "Escada de Dados à Prova de Quebras", Piso/Teto de Vidro). O sistema já sabe, de fábrica, o que fazer quando uma combinação tentaria ir abaixo de d4 ou acima de d12 — converte o excedente em outra coisa (bônus fixo) em vez de simplesmente travar ou quebrar.

**Nota de balanceamento como comentário de primeira classe.** O arquivo tem comentários do tipo *"nenhuma combinação deve ser barata E devastadora ao mesmo tempo"* — a preocupação de design fica documentada ao lado do código, não só na cabeça do autor.

O documento abaixo (**Combate com Armas**) segue exatamente esses oito princípios. O **Combate Desarmado** que você já escreveu (`Sistema_Combate_Desarmado.md`) já faz isso corretamente — Via/Impulso/Postura/Sopro mapeiam limpo em Aspecto/Verbo/Modificador/Círculo. Este documento formaliza os dois sistemas em pseudocódigo consistente e adiciona o sistema de Armas como uma **terceira família de peças**, que dialoga com as outras duas pelo mesmo recurso (Sopro) sem depender delas.

---

# PARTE I — ARQUITETURA COMPARTILHADA DOS TRÊS SISTEMAS

Antes de entrar em Armas, vale registrar o "esqueleto comum" que os três sistemas de Aetherion (Magia, Combate Desarmado, Combate com Armas) agora compartilham — para que o código-fonte final tenha a mesma cara nos três arquivos.

| Camada Estrutural | `magias.js` | Combate Desarmado | Combate com Armas |
|---|---|---|---|
| **Identidade/Filosofia** | Aspecto | Via | **Categoria de Arma** |
| **Ação Fundamental** | Verbo | Impulso | **Ação** |
| **Execução/Forma** | Modificador | Postura | **Postura** (compartilhada) |
| **Camada extra opcional** | Manifestação | — | **Especialização** |
| **Recurso de custo** | Círculo (Sopro/Mácula) | Sopro | Sopro |
| **Motor de escala** | `curvas{}` nomeadas | (a definir abaixo) | `curvas{}` reaproveitadas |
| **Função de geração** | `gerarMagia()` | `gerarTecnica()` | `gerarTecnicaArmada()` |

Os três sistemas **competem pelo mesmo Sopro**. Essa é a âncora cosmológica que já existe no seu documento de Combate Desarmado (§1) e que se estende naturalmente para Armas: empunhar uma espada com maestria ainda é gastar o mesmo sangue-de-Archëon que lançar uma Manifestação. Um personagem híbrido (guerreiro-mago) sente a mesma tensão de orçamento em qualquer das três "torneiras".

Isso tem uma consequência de design elegante: **não precisamos inventar um recurso novo por sistema.** Um único pool de Sopro por cena, três motores de gasto diferentes.

---

# PARTE II — COMBATE COM ARMAS

## 1. IDENTIDADE CONCEITUAL

Se a magia é poder emprestado de fora (Aspecto cósmico) e o combate desarmado é poder que já mora dentro do corpo (Via filosófica encarnada), o combate armado é a **terceira relação possível**: poder que vem de **fora do corpo, mas não do cosmos** — o objeto. A arma não é uma extensão neutra do braço nem um canal para o divino. Ela é uma **parceira com temperamento próprio**.

> *Uma espada não luta como um machado luta. Um machado não luta como uma lança luta. Isso não é sabor — é mecânica.*

Essa é a régua de design de todo este sistema: **nenhuma categoria de arma pode ser "uma espada com números diferentes".** Cada categoria precisa fazer algo que as outras estruturalmente não fazem tão bem, mesmo empunhada pelo mesmo personagem, na mesma Postura, com a mesma Ação.

Por isso o combate armado **não reaproveita as Vias do combate desarmado**. Uma Via é uma filosofia de *corpo*. Uma arma tem sua própria **Identidade Marcial** — mais restrita que uma Via, porque a própria arma já impõe limites físicos que o corpo desarmado não tem (alcance fixo, peso, ponto de equilíbrio). A tabela comparativa completa está na Parte I.

O que **é** compartilhado, de propósito, são as **Posturas** — as mesmas 8 Posturas do combate desarmado (Cheia, Vazia, Baixa, Alta, Curva, Reta, Silenciosa, Sacrificial) se aplicam a Armas sem alteração. Isso não é preguiça de design — é a mesma decisão pedagógica do `magias.js`: uma peça que o jogador já aprendeu (Postura) se reaproveita entre sistemas, para que dominar um sistema acelere o aprendizado do outro. A Postura é "como o corpo se comporta" — isso é universal, esteja o corpo armado ou não.

---

## 2. AS CATEGORIAS DE ARMA — Identidade Marcial

Cada Categoria de Arma é o equivalente estrutural do Aspecto: ela não executa a ação sozinha, mas define **quem ela é** e **como ela escala**. Cada Categoria carrega os mesmos "traços" estruturais que um Aspecto carrega (`tracos.escala*`), só que aplicados a variáveis de combate corpo-a-corpo em vez de variáveis de magia.

São **8 Categorias**, deliberadamente enxutas — o suficiente para cobrir a fantasia clássica de armamento sem duplicar identidade entre categorias vizinhas.

### 🗡️ Espadas — *Versatilidade Disciplinada*

**Filosofia:** a arma do meio-termo deliberado. Não é a mais forte em nenhum eixo, e essa é exatamente a vantagem — nunca há uma situação em que a espada seja a escolha estruturalmente errada.

**Forma de lutar:** equilíbrio entre corte e ponta, entre ataque e defesa. É a única categoria que não penaliza nenhuma Postura.

**Mecânica exclusiva — Fluidez de Guarda:** trocar de Postura em pleno combate (de Cheia para Vazia, por exemplo) não custa Sopro extra quando empunhando uma espada. Toda outra categoria paga uma pequena sobretaxa de Sopro para mudar de Postura no meio de uma troca de golpes — a espada não.

**Pontos fortes:** nenhum ponto fraco crítico; a Ação Desviar (parry) é mais barata com espada do que com qualquer outra categoria.

**Pontos fracos:** nunca tem o maior número em nada — dano bruto perde para Machados/Martelos, alcance perde para Lanças, velocidade perde para Adagas.

**Evolução natural:** do golpe único (Espada Curta) para o domínio de ritmo (Espada Longa) até a maestria de dois gumes lendo o oponente em tempo real (Espadas Gêmeas) — a progressão de uma espadachim é sempre sobre refinar o *timing*, nunca sobre aumentar a força bruta.

---

### 🪓 Machados — *Dano Comprometido*

**Filosofia:** o corte que não se importa em errar de novo, porque quando acerta, o combate muda de figura. Machados não negociam.

**Forma de lutar:** golpes largos, arcos completos, pouca preocupação com recuperação imediata da guarda.

**Mecânica exclusiva — Fio que Racha:** todo acerto crítico com Machado ignora uma camada de proteção/armadura do alvo (o excedente de dano "vaza" através da defesa) — nenhuma outra categoria tem esse efeito por padrão.

**Pontos fortes:** maior dado de dano-base entre armas de uma mão; Postura Cheia com Machado tem o maior teto de dano de todo o sistema de armas.

**Pontos fracos:** Postura Vazia (defensiva) é estruturalmente cara com Machado — a própria geometria do arco de balanço deixa brechas; Ação Desviar custa Sopro extra.

**Evolução natural:** de golpes isolados (Machado de Mão) para arcos sustentados que encadeiam múltiplos alvos (Machado de Batalha) até o comprometimento total de duas mãos onde não existe mais guarda, só ofensiva (Machado Grande).

---

### 🔨 Martelos — *Impacto e Ruptura*

**Filosofia:** não corta — esmaga. A diferença importa: Martelos ferem através da armadura, não apesar dela.

**Forma de lutar:** transferência bruta de força cinética; menos sobre a lâmina, mais sobre o peso comprometido no golpe.

**Mecânica exclusiva — Onda de Choque:** dano de Martelo aplicado com Ação Romper tem chance de gerar um efeito de desequilíbrio no alvo (empurrar, derrubar, interromper uma ação em andamento) mesmo quando o golpe não teria dano suficiente para "quebrar" defesas convencionais — o impacto é a arma, não o fio.

**Pontos fortes:** o único tipo de arma cujo dano ignora parcialmente armadura *pesada* especificamente (diferente do Machado, que ignora proteção genérica no crítico); excelente contra Postura Baixa/enraizada do oponente, porque o impacto testa diretamente o equilíbrio.

**Pontos fracos:** o mais lento de todos em recuperação — Ação Quebrar Ritmo custa Sopro extra com Martelo (é fisicamente difícil fintar com um martelo de guerra); péssimo em Postura Alta (o peso puxa para baixo).

**Evolução natural:** de golpes de punição pontual (Maça) para o esmagamento de área com o corpo inteiro comprometido (Martelo de Guerra) até a arma cerimonial-destrutiva de duas mãos que redefine o campo de batalha por onde passa (Marreta de Guerra).

---

### 🔱 Lanças — *Controle de Distância*

**Filosofia:** vencer antes que o oponente chegue perto o suficiente para que a luta vire sobre força. A distância *é* a defesa.

**Forma de lutar:** alcance como arma primária; o corpo do lutador nunca precisa estar onde o corpo do oponente está.

**Mecânica exclusiva — Prioridade de Alcance:** contra qualquer oponente que precise se deslocar (Ação Deslocar) para alcançar o portador de Lança, a Lança "ataca primeiro" narrativamente/mecanicamente na mesma troca — o avanço do oponente é interrompido antes de completar.

**Pontos fortes:** a única categoria em que Ação Romper à distância não custa Sopro extra; devastadora contra grupos organizados em linha.

**Pontos fracos:** uma vez que o oponente fecha a distância (combate corpo a corpo real, "dentro" do alcance da lança), todas as Ações custam Sopro extra — a lança luta contra a própria natureza em espaço curto; péssima em Postura Curva (a haste rígida não redireciona bem).

**Evolução natural:** da lança simples de alcance fixo (Lança) para a versátil que também corta (Alabarda) até a glaiva/naginata que funde alcance com um arco de corte completo — cada passo da evolução tenta resolver o mesmo problema: o que fazer quando o inimigo, inevitavelmente, chega perto.

---

### 🗡️‍♀️ Adagas — *Velocidade e Precisão Letal*

**Filosofia:** a menor arma é a mais honesta sobre o que o combate realmente é — quem acerta primeiro o ponto certo, quem não precisa de segundo golpe.

**Forma de lutar:** golpes múltiplos e rápidos, ângulos que armas maiores não alcançam, luta próxima ao corpo do oponente por escolha, não por acidente.

**Mecânica exclusiva — Golpe Duplo:** Ação Romper com Adaga em Postura Vazia ou Silenciosa pode ser declarada como dois golpes de menor Sopro individual em vez de um golpe único — a única categoria que fragmenta uma Ação em múltiplas resoluções pelo mesmo custo total.

**Pontos fortes:** menor custo de Sopro por Ação de todo o sistema de armas; a única categoria com bônus embutido a ataques feitos a partir de furtividade/surpresa (sinergia natural com a Via do Eco e a Via do Vento Solto do combate desarmado, para builds híbridos armado/desarmado).

**Pontos fracos:** dano-base mais baixo do sistema; Postura Cheia é quase sempre uma escolha ruim (a adaga não tem massa suficiente para justificar o comprometimento total).

**Evolução natural:** da lâmina única de reação (Adaga) para o par sincronizado que ataca em ritmos diferentes ao mesmo tempo (Adagas Gêmeas) até o domínio de arremesso, onde a adaga deixa de precisar de alcance zero (Adagas de Arremesso).

---

### 🏹 Arcos — *Domínio à Distância*

**Filosofia:** a única categoria construída inteiramente ao redor de nunca deixar o combate virar corpo a corpo. Não é covardia — é a crença de que a distância bem administrada é a forma mais alta de controle.

**Forma de lutar:** posicionamento antes de tudo; o disparo em si é o momento final de uma sequência de decisões espaciais.

**Mecânica exclusiva — Tensão Acumulada:** manter a Postura Cheia por mais de uma troca antes de disparar (não disparar imediatamente) aumenta o dado de dano em um degrau na escada — a única categoria em que *esperar* ativamente melhora o resultado, em vez de apenas custar tempo.

**Pontos fortes:** a única categoria com Ação Romper efetiva em Alcance Longo por padrão; Postura Silenciosa com Arco reduz drasticamente a chance de o alvo perceber de onde veio o ataque.

**Pontos fracos:** o único tipo de arma que fica estruturalmente pior quando o oponente fecha distância — todas as Ações custam Sopro extra em combate corpo a corpo; não tem Ação Prender viável (fisicamente não faz sentido agarrar com um arco).

**Evolução natural:** do arco curto de disparo rápido e pouco alcance (Arco Curto) para o arco longo de guerra que prioriza penetração e distância (Arco Longo) até a besta, que troca velocidade de disparo por dano bruto e menos exigência de força física para sustentar a Postura Cheia.

---

### 🌾 Foices — *Fluxo e Colheita de Múltiplos Alvos*

**Filosofia:** o gume que não distingue entre um corpo e o próximo. A foice não é feita para duelos — é feita para linhas.

**Forma de lutar:** o corpo gira, o gume acompanha, um golpe raramente termina onde começou.

**Mecânica exclusiva — Arco de Colheita:** Ação Romper com Foice em Postura Curva pode atingir múltiplos alvos adjacentes na mesma resolução, ao custo de Sopro somado (não multiplicado) por alvo extra — a única categoria corpo a corpo com essa forma de multiplicação de alvo sem precisar de Modificador especial.

**Pontos fortes:** a categoria mais eficiente em Sopro contra grupos; excelente contra Postura Baixa do oponente (o arco baixo do golpe passa sob a guarda enraizada).

**Pontos fracos:** a pior categoria em duelo direto de alvo único — o design inteiro da arma "desperdiça" potencial contra um oponente sozinho; Postura Reta é quase contraditória com a identidade da Foice (perde o bônus de Arco de Colheita).

**Evolução natural:** da foice de combate compacta (Foice de Guerra) para a foice longa de arco amplo (Foice Longa) até a rara foice-dupla, empunhada com uma lâmina em cada mão para colher em ambas as direções do giro do corpo.

---

### ⛓️ Correntes — *Imprevisibilidade e Alcance Variável*

**Filosofia:** a única arma cuja forma muda a cada instante. Não tem alcance fixo, não tem ângulo fixo — e é exatamente por isso que é tão difícil de ler.

**Forma de lutar:** o oponente nunca sabe, olhando para a arma parada, qual será seu alcance no próximo golpe.

**Mecânica exclusiva — Alcance Fluido:** ao contrário de toda outra categoria (que tem Alcance fixo por Categoria), a Corrente declara seu Alcance *no momento da Ação*, escolhendo entre Curto e Médio a cada uso — nenhuma outra arma tem essa flexibilidade, e o preço é que a Corrente nunca acessa Alcance Longo, nem mesmo evoluída.

**Pontos fortes:** a única categoria com Ação Prender e Ação Romper igualmente eficientes (a maior parte das armas é claramente melhor em uma ou outra); imprevisibilidade natural dificulta a leitura de padrão do oponente (sinergia direta com a Via do Eco do combate desarmado — é a arma mais difícil de "ler" no jogo).

**Pontos fracos:** exige a maior curva de aprendizado narrativa — Postura Reta é quase impossível de justificar (a corrente não tem "caminho reto" natural); a categoria mais punida por erros: uma Ação que falha com Corrente frequentemente deixa a arma momentaneamente fora de posição para a réplica seguinte.

**Evolução natural:** da corrente curta de punho (Corrente de Mão) para a corrente longa com peso na ponta (Mangual) até a corrente dupla, uma em cada mão, tecendo um padrão de ameaça em duas direções simultâneas.

---

## 3. TABELA-RESUMO DE IDENTIDADE MARCIAL

Equivalente compacto de `tracos: { escalaAlcance, escalaArea, ... }` dos Aspectos — os "traços" que cada Categoria de Arma carrega e que o motor de geração vai consultar.

| Categoria | Dado Base | Alcance | Ação favorecida | Ação penalizada | Postura favorecida | Postura penalizada |
|---|---|---|---|---|---|---|
| **Espadas** | d8 | Curto | Desviar | *(nenhuma)* | *(todas — sem penalidade)* | *(nenhuma)* |
| **Machados** | d10 | Curto | Romper | Desviar | Cheia | Vazia |
| **Martelos** | d10 | Curto | Romper | Quebrar Ritmo | Baixa | Alta |
| **Lanças** | d8 | Médio/Longo | Romper (à distância) | *(todas, em espaço curto)* | Reta | Curva |
| **Adagas** | d6 | Toque/Curto | Romper (múltiplo) | Deslocar | Silenciosa | Cheia |
| **Arcos** | d8 | Longo | Romper (à distância) | *(todas, corpo a corpo)* | Cheia (com Tensão) | Baixa |
| **Foices** | d8 | Curto | Romper (área) | Prender | Curva | Reta |
| **Correntes** | d6 | Curto/Médio (variável) | Prender | *(nenhuma fixa — punida em falha)* | Curva | Reta |

---

## 4. AS AÇÕES — os Verbos do Combate Armado

O combate armado **reaproveita exatamente os mesmos 5 Impulsos** do combate desarmado, renomeados apenas para deixar claro que agora existe uma arma no meio — mesma lógica pedagógica de sempre. Não há motivo estrutural para inventar verbos novos: uma arma ainda só pode Romper, Desviar, Prender, Deslocar ou Quebrar Ritmo. O que muda é *como cada Categoria de Arma modula essas cinco ações* (tabela acima) — a identidade mora na interação, não em ações exclusivas.

| Ação | Definição | Peso Base (igual ao Impulso equivalente) |
|---|---|---|
| **Romper** | Golpear para causar dano direto com a arma | Médio |
| **Desviar** | Usar a arma (ou escudo) para negar o golpe do oponente | Leve |
| **Prender** | Restringir com a arma (algoz de corrente, guarda cruzada, cabo) | Pesado |
| **Deslocar** | Reposicionar-se ou empurrar o oponente usando alcance/peso da arma | Médio |
| **Quebrar Ritmo** | Fintar ou interromper usando a ameaça da arma | Leve |

> **Nota de design:** manter as Ações idênticas entre os dois sistemas de combate (só girando o rótulo de "Impulso" para "Ação" por clareza de contexto) é proposital — significa que `curvas{}`, `resolverEscala()` e a lógica de peso-base do Combate Desarmado podem ser **literalmente a mesma função reaproveitada** para Combate com Armas, mudando apenas qual tabela de Identidade (Via vs. Categoria) é consultada. Isso é o "poucas peças, muitas combinações" levado ao nível da própria arquitetura de código, não só do conteúdo.

---

## 5. POSTURAS — Compartilhadas com o Combate Desarmado

As 8 Posturas (Cheia, Vazia, Baixa, Alta, Curva, Reta, Silenciosa, Sacrificial) definidas em `Sistema_Combate_Desarmado.md` §4 se aplicam sem alteração. O que muda é a **matriz de fricção** — quais Posturas combinam bem ou mal com qual Categoria de Arma (ver Tabela-Resumo, §3, colunas "favorecida"/"penalizada"), assim como no combate desarmado a fricção Via×Postura já dava personalidade à técnica.

Uma sétima coluna de fricção (Categoria × Postura) empilha por cima da já existente (Via × Postura) apenas quando o personagem é um híbrido armado/desarmado — mas isso é um detalhe de implementação futura, não uma decisão que precisa ser tomada agora.

---

## 6. ESPECIALIZAÇÕES — a Camada Opcional (equivalente à Manifestação)

Assim como a Manifestação empilha *por cima* de Aspecto+Verbo+Modificador sem ser obrigatória, cada Categoria de Arma tem um pequeno conjunto de **Especializações** — refinamentos técnicos opcionais que ajustam a fórmula final sem alterar Categoria, Ação ou Postura escolhidas. A Especialização responde "qual **escola específica** dentro da Categoria o personagem estudou" — é o mesmo papel que a Manifestação `linha`/`cone`/`esfera` cumpre na magia (ajusteDegrau, ajusteArea, tags próprias).

Cada Categoria tem entre 2 e 3 Especializações. Elas não são obrigatórias — um personagem pode empunhar uma Espada sem nenhuma Especialização e ainda gerar uma Técnica válida (assim como uma magia sem Manifestação é perfeitamente válida em `gerarMagia`).

| Categoria | Especializações possíveis (exemplos, não lista fechada) |
|---|---|
| Espadas | Corte Fluido (+ eficiência em Postura Curva) · Ponta Precisa (+ eficiência contra Postura Silenciosa do oponente) |
| Machados | Arco Largo (Romper atinge um segundo alvo adjacente, custo somado) · Fio Pesado (crítico ignora ainda mais proteção) |
| Martelos | Golpe Sísmico (Onda de Choque afeta uma pequena área, não só o alvo) · Cabo Curto (reduz a penalidade de Quebrar Ritmo) |
| Lanças | Guarda de Ponta (Desviar ganha o bônus de "ataca primeiro" que hoje só existe pra Romper) · Alcance Estendido (empurra o teto de Alcance Longo) |
| Adagas | Golpe Gêmeo Avançado (Golpe Duplo passa a funcionar também em Postura Cheia) · Veneno de Fio (dano ganha um componente sustentado) |
| Arcos | Tiro Instintivo (remove a exigência de Tensão Acumulada em Postura Cheia) · Mira Perfurante (ignora parcialmente cobertura, como a Manifestação Linha da magia) |
| Foices | Colheita Ampla (Arco de Colheita atinge mais um alvo pelo mesmo custo somado) · Giro Contínuo (reduz custo de encadear Romper duas vezes seguidas) |
| Correntes | Laço Duplo (Prender passa a poder imobilizar dois pontos do corpo do alvo) · Chicote Longo (acessa Alcance Médio "puro", sem escolher entre Curto/Médio) |

**Nota de balanceamento** (mesmo princípio do `magias.js` §5): nenhuma Especialização deve ser um "upgrade estritamente melhor" sem custo — cada uma resolve *um* ponto fraco da Categoria à custa de reforçar sua identidade em outro eixo, nunca generaliza a arma para "boa em tudo". Uma Adaga com Golpe Gêmeo Avançado ainda não vira boa em dano bruto; ela só fica ainda mais rápida.

---

## 7. SOPRO — Custo Variável por Combinação (mesma arquitetura de 3 camadas)

Idêntico em espírito ao §5 do Combate Desarmado — e, por extensão, a `calcularCusto()` da magia — mas com uma camada a mais, porque agora existe uma peça física (a arma) com peso e alcance próprios que a Via nunca teve.

### Camada 1 — Peso Base da Ação
Reaproveita exatamente a tabela de peso dos Impulsos:

| Ação | Peso natural |
|---|---|
| Desviar | Leve |
| Quebrar Ritmo | Leve |
| Romper | Médio |
| Deslocar | Médio |
| Prender | Pesado |

### Camada 2 — Modulador de Postura
Reaproveita exatamente a tabela de modulação de Postura do combate desarmado (Vazia/Curva/Silenciosa reduzem; Reta/Baixa/Alta neutro; Cheia/Sacrificial aumentam).

### Camada 3 — Modulador de Categoria de Arma (equivalente ao Modulador de Via)
Cada Categoria empurra o custo conforme sua identidade:

- Categorias de **comprometimento total** (Machados, Martelos) tendem a ser mais caras em Postura Cheia — a física da arma exige mais Sopro para justificar o arco de balanço.
- Categorias de **controle e eficiência** (Espadas, Adagas) tendem a ser mais baratas — a própria Identidade Marcial já é sobre economia de movimento.
- Categorias de **alcance/distância** (Lanças, Arcos) são baratas *na sua zona ideal* de combate e caras fora dela — o único caso em que o Modulador de Categoria muda de sinal dependendo do contexto tático, não só da combinação estática de peças. Isso está documentado explicitamente em cada Categoria (§2) como Ponto Fraco.
- Correntes e Foices ficam no meio-termo, como Vias de "espaço" no combate desarmado — dependem muito de qual Ação estão modulando.

### Camada 4 (nova, exclusiva de Armas) — Modulador de Especialização
Quando uma Especialização está ativa, ela pode aplicar um pequeno ajuste de custo adicional (positivo ou negativo) — mesma lógica de `mod.custoExtra`, só que na camada de Especialização em vez de Postura. Especializações que resolvem um Ponto Fraco geralmente adicionam um pequeno custo extra; Especializações que aprofundam um Ponto Forte já existente tendem a ser custo-neutras.

### O Nível de Sopro como Teto de Intenção
Idêntico ao Combate Desarmado — Sopro Curto / Sustentado / Pleno funcionam exatamente da mesma forma, como teto declarado antes do cálculo real emergir da combinação.

**Nota de balanceamento:** a mesma regra de ouro do `magias.js` e do Combate Desarmado se aplica aqui sem exceção — nenhuma combinação Categoria+Ação+Postura+Especialização deve ser simultaneamente barata em Sopro e devastadora em efeito.

---

## 8. A FÓRMULA COMPLETA

**Categoria de Arma** (identidade marcial + modulador de custo + Alcance/Dado Base) **+ Ação** (verbo + peso base) **+ Postura** (execução + modulador de custo, compartilhada com o Combate Desarmado) **+ Especialização** *(opcional — refinamento + pequeno ajuste)* **+ Sopro** (teto de intenção, custo final emergente) **= Técnica única**

Com 8 Categorias × 5 Ações × 8 Posturas × 3 níveis de Sopro (sem contar Especializações, que são opcionais e multiplicariam ainda mais), o motor já gera **960 combinações-base possíveis** — antes mesmo de contar as ~20 Especializações espalhadas pelas 8 Categorias, que multiplicam esse número ainda mais para quem quiser ir fundo em uma única arma.

O ponto crucial, herdado diretamente do §6 do Combate Desarmado: **a Categoria de Arma não é um pacote de golpes prontos — é uma lente física.** O jogador não escolhe "técnica #9 da lista Machados". Ele escolhe a arma e narra, junto com a Ação e a Postura, o que aquilo significa nas mãos do seu personagem. Dois lutadores com o mesmo Machado nunca lutam igual.

---

## 9. EXEMPLOS DE TÉCNICAS GERADAS

**Espadas + Romper + Postura Reta + Sopro Sustentado**
> *"Corte de Linha Clara"* — um golpe direto, sem floreio, no caminho mais curto entre a lâmina e o alvo. Nenhuma penalidade de Categoria, nenhum bônus especial: a espada faz exatamente o que promete, sempre. Custo previsível, efeito previsível — a assinatura da Via do meio-termo.

**Machados + Romper + Postura Cheia + Sopro Pleno**
> *"Fio que Racha"* — o lutador compromete o corpo inteiro no arco do machado. Se o golpe for crítico, a proteção do alvo simplesmente não segura — o excedente de dano vaza através dela. Ação médio + Postura que aumenta custo + Categoria que penaliza comprometimento total = **custo alto de Sopro**. Errar deixa o lutador com a guarda aberta por um instante inteiro.

**Martelos + Romper + Postura Baixa + Sopro Sustentado**
> *"Onda de Choque"* — o golpe não busca cortar, busca transferir força. Mesmo sem penetrar armadura, o impacto ameaça derrubar o alvo ou interromper o que ele estava prestes a fazer. Excelente contra oponentes em Postura Baixa/enraizada — é precisamente o equilíbrio deles que o Martelo testa.

**Lanças + Romper + Postura Reta + Sopro Curto (à distância)**
> *"Ponta que Chega Primeiro"* — o oponente inicia o avanço; a lança já estava lá. Ação favorecida + Categoria em sua zona ideal = **custo mínimo, quase gratuito**. A mesma combinação, se o oponente já estiver dentro do alcance curto da lança, custaria Sopro extra — a mesma técnica muda de preço conforme a distância real da cena.

**Adagas + Romper + Postura Silenciosa + Sopro Curto**
> *"Duas Vezes Antes do Grito"* — Golpe Duplo: a Ação Romper se fragmenta em dois golpes rápidos pelo mesmo custo total. Postura Silenciosa reduz custo ainda mais, e a Categoria já é a mais barata do sistema — **o menor custo de Sopro possível em combate armado**, ideal para repetir várias vezes numa cena.

**Arcos + Romper + Postura Cheia (com Tensão Acumulada) + Sopro Pleno**
> *"Flecha que Esperou"* — o arqueiro mantém a Postura Cheia por mais de uma troca antes de soltar a corda. O dado de dano sobe um degrau na escada. Alcance Longo, o único cenário em que essa Categoria brilha sem nenhuma penalidade — mas exige paciência tática real, não é um botão a apertar sem custo narrativo.

**Foices + Romper + Postura Curva + Sopro Sustentado**
> *"Arco de Colheita"* — o giro do corpo carrega o gume por um arco amplo, atingindo o alvo principal e um segundo alvo adjacente pelo custo somado (não multiplicado). Contra um único duelista isolado, essa mesma técnica "desperdiça" metade do seu potencial — a Foice foi desenhada para linhas, não para duelos.

**Correntes + Prender + Postura Curva + Sopro Sustentado**
> *"Laço que Não Se Anuncia"* — a corrente declara Alcance Curto no momento do golpe, mudando de forma diante do oponente que só a viu parada um instante antes. Ação favorecida + Postura favorecida = eficiência real, mas se a Ação falhar, a corrente fica momentaneamente fora de posição — o preço de ser a arma mais difícil de ler do sistema.

---

## 10. DIÁLOGO ENTRE OS TRÊS SISTEMAS (Magia / Desarmado / Armado)

Um único ponto de design vale nomear explicitamente, porque é a razão de os três sistemas dividirem o mesmo Sopro: **um personagem híbrido não "soma" poder ao combinar sistemas — ele reparte um orçamento único entre eles na mesma cena.** Um guerreiro-mago que abre a cena com uma Manifestação de Círculo alto tem estruturalmente menos Sopro sobrando para um "Fio que Racha" de Machado no mesmo turno. Isso não é uma penalidade escondida — é a mesma tensão tática que já existia dentro da própria magia (gastar tudo em uma magia grande vs. várias pequenas), agora estendida para todo o combate.

Essa é também a âncora que evita que "Combate com Armas" precise inventar sua própria cosmologia de recurso: ele já nasce integrado ao mundo através da mesma fonte (o sopro da vida concedido por Archëon) que a magia e o combate desarmado já usam — nenhuma explicação extra é necessária, exatamente como o Combate Desarmado já havia estabelecido em seu §1.

---

## 11. GANCHOS OPCIONAIS DE APROFUNDAMENTO

Sementes para lapidação futura — nenhuma implica decisão tomada, apenas pontos de partida, no mesmo espírito do §8 do Combate Desarmado:

- **Escudos como "não-categoria".** Um Escudo não gera Técnicas próprias da mesma forma que as 8 Categorias — ele modula as Ações de *outra* arma empunhada junto (reduz custo de Desviar, por exemplo). Pode valer a pena tratá-lo como um "meta-modificador" que se aplica por cima da fórmula, não como uma nona Categoria de pleno direito — mas isso é uma decisão de balanceamento a testar, não a decretar aqui.
- **Armas como heranças culturais**, espelhando o gancho equivalente do Combate Desarmado — Durkan puxando para Machados/Martelos, Elvarin Errantes para Arcos/Adagas, Grotans para Machados/Correntes, e assim por diante. Mesmo aviso: sem travar a escolha do jogador.
- **Uma nona Categoria "proibida" ou "exótica"**, ecoando o gancho equivalente do Combate Desarmado (Via ligada à corrupção) — uma arma que rompe as próprias regras estruturais do sistema (Alcance que muda por vontade própria além do que Correntes já fazem, Ação fora da lista de 5), reservada a criaturas corrompidas ou NPCs.
- **Números finais de custo.** Assim como o Combate Desarmado deixou os valores exatos de Sopro para uma fase futura de tabela espelhando `magias.js`, o mesmo vale aqui — as três camadas de modulação (Ação, Postura, Categoria) e a quarta (Especialização) estão descritas qualitativamente; os valores numéricos exatos ficam para quando o código for de fato escrito, seguindo a mesma lógica de `calcularCusto()`.
- **Combos entre Categoria e Via.** Um personagem que empunha uma Adaga (Categoria) enquanto pratica a Via do Eco (combate desarmado) tem uma sinergia narrativa óbvia — vale considerar, no futuro, uma pequena tabela de fricção positiva/negativa Categoria×Via para builds verdadeiramente híbridas, no mesmo espírito da matriz Via×Postura que já existe.

---

## 12. RESUMO DE REFERÊNCIA RÁPIDA

**8 Categorias:** Espadas (versatilidade) · Machados (dano comprometido) · Martelos (impacto/ruptura) · Lanças (controle de distância) · Adagas (velocidade/precisão) · Arcos (domínio à distância) · Foices (fluxo/múltiplos alvos) · Correntes (imprevisibilidade/alcance variável)

**5 Ações:** Romper · Desviar · Prender · Deslocar · Quebrar Ritmo *(idênticas aos 5 Impulsos do combate desarmado)*

**8 Posturas:** Cheia · Vazia · Baixa · Alta · Curva · Reta · Silenciosa · Sacrificial *(compartilhadas, sem alteração, com o combate desarmado)*

**Especializações:** 2–3 por Categoria, opcionais, camada equivalente à Manifestação da magia

**3 Níveis de Sopro:** Curto · Sustentado · Pleno *(custo final sempre emergente da combinação, nunca fixo — idêntico aos outros dois sistemas)*

**Fórmula:** Categoria + Ação + Postura + Especialização *(opcional)* + Sopro = Técnica única

---

# PARTE III — ESQUELETO DE IMPLEMENTAÇÃO (PSEUDOCÓDIGO)

Esta parte não é o código final — é o mapeamento estrutural para quando você (ou eu, numa sessão futura) for de fato escrever `combateDesarmado.js` e `combateArmado.js`, no mesmo formato de objeto único exportável que `magias.js` já usa. Documento aqui para que a transição de design → código não exija redecidir a arquitetura, só preenchê-la.

```javascript
// =============================================================
// ESQUELETO — combateArmado.js (espelha a arquitetura de magias.js)
// =============================================================

const sistemaCombateArmado = {

  // Reaproveitado 1:1 de sistemaMagia.curvas — mesmo motor de escala
  curvas: { /* ...idêntico a sistemaMagia.curvas... */ },

  // Reaproveitado 1:1 de sistemaMagia.escadaDados + ajustarDegrau()
  escadaDados: ['d4', 'd6', 'd8', 'd10', 'd12'],
  ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal = 0) { /* idêntico */ },

  // ===========================================================
  // CAMADA 1 — AS 8 CATEGORIAS DE ARMA (equivalente a aspectos{})
  // ===========================================================
  categorias: {
    espadas: {
      nome: 'Espadas',
      filosofia: 'Versatilidade Disciplinada',
      dadoBase: 'd8',
      alcance: 'curto',
      acaoFavorecida: 'desviar',
      acaoPenalizada: null,
      posturaFavorecida: null,      // nenhuma — sem penalidade em nenhuma
      posturaPenalizada: null,
      moduladorCusto: 'economico',  // barata, como Eco/Pedra Firme no desarmado
      mecanicaExclusiva: 'fluidezDeGuarda', // troca de Postura sem custo extra
      descricao: '...',
      // template narrativo por Ação, espelhando verbo.template[aspectoId]
      template: { romper: '...', desviar: '...', prender: '...', deslocar: '...', quebrarRitmo: '...' }
    },
    machados: {
      nome: 'Machados',
      filosofia: 'Dano Comprometido',
      dadoBase: 'd10',
      alcance: 'curto',
      acaoFavorecida: 'romper',
      acaoPenalizada: 'desviar',
      posturaFavorecida: 'cheia',
      posturaPenalizada: 'vazia',
      moduladorCusto: 'caro',       // como Punho Vivo/Corrente no desarmado
      mecanicaExclusiva: 'fioQueRacha', // crítico ignora camada de proteção
      descricao: '...',
      template: { /* ... */ }
    },
    martelos:  { /* mesma forma — impacto, onda de choque */ },
    lancas:    { /* mesma forma — alcance/prioridade */ },
    adagas:    { /* mesma forma — golpe duplo */ },
    arcos:     { /* mesma forma — tensão acumulada */ },
    foices:    { /* mesma forma — arco de colheita */ },
    correntes: { /* mesma forma — alcance fluido */ },
  },

  // ===========================================================
  // CAMADA 2 — AS 5 AÇÕES (equivalente a verbos{})
  // Reaproveita literalmente a mesma tabela de peso que os
  // Impulsos do combate desarmado — ver combateDesarmado.js
  // ===========================================================
  acoes: {
    romper:       { nome: 'Romper',       pesoBase: 'medio',  custoBase: 2 },
    desviar:      { nome: 'Desviar',      pesoBase: 'leve',   custoBase: 1 },
    prender:      { nome: 'Prender',      pesoBase: 'pesado', custoBase: 3 },
    deslocar:     { nome: 'Deslocar',     pesoBase: 'medio',  custoBase: 2 },
    quebrarRitmo: { nome: 'Quebrar Ritmo',pesoBase: 'leve',   custoBase: 1 },
  },

  // ===========================================================
  // CAMADA 3 — AS 8 POSTURAS (import direto de combateDesarmado.js)
  // Não duplicar esta tabela aqui — mesma decisão que magias.js já
  // toma com progressaoReferencia: fonte única, reaproveitada.
  // ===========================================================
  posturas: sistemaCombateDesarmado.posturas, // reaproveitamento direto

  // ===========================================================
  // CAMADA 4 (opcional) — ESPECIALIZAÇÕES (equivalente a manifestacoes{})
  // ===========================================================
  especializacoes: {
    corteFluido:      { categoria: 'espadas',   ajusteCusto: 0,  efeito: '...' },
    pontaPrecisa:      { categoria: 'espadas',   ajusteCusto: +1, efeito: '...' },
    arcoLargo:         { categoria: 'machados',  ajusteCusto: +2, efeito: '...' },
    // ...demais Especializações da §6...
  },

  // ===========================================================
  // MOTOR — calcularCusto (espelha calcularCusto de magias.js)
  // ===========================================================
  calcularCusto(categoriaId, acaoId, posturaId, especializacaoId = null, nivelSopro = 'sustentado') {
    const categoria = this.categorias[categoriaId];
    const acao = this.acoes[acaoId];
    const postura = this.posturas[posturaId];
    if (!categoria || !acao || !postura) return 0;

    let custo = acao.custoBase; // Camada 1: peso base da Ação
    custo = this.aplicarModuladorPostura(custo, postura);       // Camada 2
    custo = this.aplicarModuladorCategoria(custo, categoria, acao); // Camada 3

    if (especializacaoId) {
      const esp = this.especializacoes[especializacaoId];
      if (esp) custo += (esp.ajusteCusto || 0);                 // Camada 4
    }

    return this.aplicarTetoSopro(custo, nivelSopro); // teto de intenção
  },

  // ===========================================================
  // FUNÇÃO DE GERAÇÃO FINAL (espelha gerarMagia)
  // ===========================================================
  gerarTecnicaArmada(categoriaId, acaoId, posturaId, especializacaoId = null, options = {}) {
    // 1. Validação (idêntica em espírito ao passo 1 de gerarMagia)
    // 2. Resolução de custo (calcularCusto acima)
    // 3. Resolução de escala (reaproveitar resolverEscala com curvas próprias)
    // 4. Resolução de dado (reaproveitar ajustarDegrau + escadaDados)
    // 5. Montagem de template narrativo (concatenar fragmentos, como
    //    descricaoFinal em gerarMagia — nunca texto único por combinação)
    // 6. Retorno do objeto de técnica completo
  },

};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = sistemaCombateArmado;
}
```

**Por que este esqueleto importa mais do que parece:** ele prova, em código, a promessa central deste documento — que os três sistemas (`magias.js`, `combateDesarmado.js`, `combateArmado.js`) podem compartilhar literalmente as mesmas funções de motor (`curvas`, `ajustarDegrau`, `escadaDados`) e até a mesma tabela de Posturas por importação direta, sem duplicar uma linha de lógica. A única coisa que cada arquivo contribui de fato é a **camada de identidade** (Aspectos / Vias / Categorias) e a **camada de ação** (Verbos / Impulsos / Ações) — que são pequenas, editáveis isoladamente, e nunca tocam no motor matemático compartilhado.
