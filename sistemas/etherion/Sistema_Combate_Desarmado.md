# AS VIAS DO CORPO
## Sistema Modular de Combate Desarmado de Aetherion

---

## 0. NOTA DE POSICIONAMENTO — O SEGUNDO PILAR

Este documento formaliza o combate desarmado como o **segundo pilar** do motor combinatório de Aetherion. O primeiro pilar (Magia, `magias.js`) foi o protótipo arquitetural; este sistema herda todos os seus oito princípios — peças que se multiplicam, camadas com job fixo, custo sempre calculado, escala por curvas nomeadas, elegibilidade separada de geração, texto narrativo montado por fragmentos, amortecimento estrutural nas pontas, e notas de balanceamento como comentário de primeira classe — e os aplica ao corpo humano em vez do cosmos divino.

O **terceiro pilar** (Combate com Armas, `Sistema_Combate_Armado.md`) dialoga diretamente com este: compartilha as mesmas 8 Posturas, os mesmos 5 Impulsos (renomeados Ações), e o mesmo recurso de Sopro. A tabela de correspondência entre os três sistemas é definida no documento de Armas, Parte I.

---

## 1. IDENTIDADE CONCEITUAL

O sistema de magia de Aetherion funciona de fora para dentro: o feiticeiro invoca Aspectos que não lhe pertencem, canalizando forças cósmicas através de Verbos e Modificadores dentro de um Círculo. O combate desarmado é o espelho oposto — **poder que vem de dentro para fora**.

Enquanto a magia manipula o sangue de Archëon que corre pelo mundo, o combate desarmado é sobre o sangue que corre *dentro do próprio corpo* do lutador. Não há canalização cósmica, não há Aspecto emprestado. Há apenas **corpo, intenção e disciplina**. É esse contraste que dá identidade ao sistema: o mago pede emprestado; o lutador desarmado *é* a fonte.

Ainda assim, os dois sistemas não são paralelos e isolados — eles **competem pelo mesmo recurso**: o Sopro. Isso ancora o combate desarmado diretamente na cosmologia do mundo, sem precisar de nenhuma explicação extra: o sopro da vida concedido por Archëon a tudo que possui consciência é literalmente o mesmo combustível usado tanto para lançar uma magia quanto para desferir um golpe decisivo.

A estrutura espelha a gramática da magia por design pedagógico (mesma lógica mental para o jogador), mas os nomes das peças são propositalmente diferentes, para que se *sinta* a diferença entre invocar e encarnar:

| Camada Estrutural | `magias.js` | Combate Desarmado | Papel |
|---|---|---|---|
| **Identidade/Filosofia** | Aspecto | **Via** | *O que isso É* — define traços de escala, dado base, identidade |
| **Ação Fundamental** | Verbo | **Impulso** | *O que isso FAZ* — peso base, custo, curvas de escala |
| **Execução/Forma** | Modificador | **Postura** | *COMO se manifesta* — ajustes de custo e propriedades |
| **Camada extra opcional** | Manifestação | *(ganchos futuros, §9)* | Refinamento que empilha sem quebrar as três primeiras |
| **Recurso de custo** | Círculo (Sopro/Mácula) | **Sopro** | Número único que o jogador gira; tudo escala a partir dele |
| **Motor de escala** | `curvas{}` nomeadas | `curvas{}` reaproveitadas | Mesmas funções matemáticas do motor de magia |
| **Função de geração** | `gerarMagia()` | `gerarTecnica()` | Monta a técnica em tempo real a partir das peças |

---

## 2. AS VIAS — as Escolas Filosóficas (equivalente a `aspectos{}`)

As Vias não são "estilos de luta" genéricos — são **filosofias de corpo**, cada uma com uma leitura própria de por que se luta e do que o corpo é capaz. São **6 Vias**, número deliberadamente enxuto: cada uma é ampla o suficiente para gerar dezenas de técnicas sozinha, e nenhuma Via é usada pura — ela sempre se combina com Impulso e Postura.

Cada Via carrega os mesmos "traços" estruturais que um Aspecto carrega (`tracos.escala*`), só que aplicados a variáveis de combate corpo-a-corpo em vez de variáveis de magia. A Via **nunca calcula custo** (esse é o job do Impulso e da Postura) — ela define *identidade* e *como as coisas escalam*.

> **Régua de design:** nenhuma Via pode ser "outra Via com números diferentes". Cada Via precisa fazer algo que as outras estruturalmente não fazem tão bem, mesmo executada pelo mesmo lutador, na mesma Postura, com o mesmo Impulso.

---

### 🩸 Via do Punho Vivo — *Força Bruta*

**Filosofia:** o corpo como martelo. A crença de que a carne, quando comprometida por inteiro, é a arma mais honesta que existe. Não há elegância no Punho Vivo — há certeza.

> *Mentalidade: "Eu não preciso ser mais rápido que você. Preciso apenas continuar de pé."*

**Forma de lutar:** golpes únicos e devastadores, comprometimento total do peso do corpo em cada movimento. O Punho Vivo não encadeia — ele termina.

**Mecânica exclusiva — Impacto Irresistível:** todo acerto crítico com a Via do Punho Vivo força o alvo a resistir deslocamento (empurrado, desequilibrado) mesmo que o golpe fosse direcionado apenas para causar dano — a massa de intenção investida é grande demais para o corpo do alvo absorver sem mover. Nenhuma outra Via gera esse efeito por padrão.

**Pontos fortes:** maior dado de dano-base entre todas as Vias; Postura Cheia com Punho Vivo tem o maior teto de dano de todo o sistema desarmado. A Via que mais se beneficia de Sopro Pleno — cada ponto de recurso gasto se converte diretamente em potência bruta.

**Pontos fracos:** Postura Silenciosa é estruturalmente cara — não se esconde intenção quando o corpo inteiro se compromete; Impulso Quebrar Ritmo custa Sopro extra (fintar exige sutileza que o Punho Vivo não premia). A Via mais punida por erros: falhar um golpe de Postura Cheia deixa o lutador completamente exposto.

**Evolução natural:** do golpe isolado e comprometido (socos e chutes frontais) para a capacidade de sustentar essa intensidade por mais de uma troca (resistência que acompanha a potência), até a maestria de canalizar toda a massa corporal em um único ponto de contato com eficiência letal — a progressão é sempre sobre *potência sustentável*, nunca sobre diversificar.

---

### 🩸 Via da Lâmina Curta — *Precisão Cirúrgica*

**Filosofia:** o corpo como bisturi. Não é sobre quanto dano se causa, é sobre *onde*. Golpes contam articulações, nervos, pontos de ruptura. Filosoficamente oposta ao Punho Vivo: crença de que força bruta é desperdício de energia contra um alvo que já está morto, só ainda não sabe.

> *Mentalidade: "Todo corpo tem uma dobradiça. Eu apenas a encontro primeiro."*

**Forma de lutar:** golpes curtos, secos, direcionados a pontos anatômicos específicos. O corpo nunca se compromete mais do que o necessário — a menor distância, a menor exposição, o maior efeito.

**Mecânica exclusiva — Ponto Vital:** ao declarar Romper com Lâmina Curta, o jogador pode nomear um *ponto anatômico* (articulação, nervo, tendão). Se o golpe acertar, além do dano normal, aplica uma penalidade específica ao membro/função atingida (mão desarmada perde força de pegada, perna atingida perde velocidade de deslocamento, etc.) — nenhuma outra Via permite esse nível de escolha sobre *onde* o dano acontece.

**Pontos fortes:** a Via mais eficiente em Sopro por ponto de efeito útil — golpes baratos que geram consequências mecânicas além do dano numérico. Postura Silenciosa com Lâmina Curta é a combinação mais letal em furtividade de todo o sistema desarmado (sinergia natural com a Categoria Adagas do sistema armado, para builds híbridos).

**Pontos fracos:** dano bruto mais baixo do sistema — contra alvos que não têm "pontos vitais" claros (construtos, criaturas amorfas, elementais), a mecânica exclusiva simplesmente não se aplica; Postura Cheia é quase sempre uma escolha ruim (o comprometimento total desperdiça a filosofia de precisão).

**Evolução natural:** do golpe único ao ponto certo (dedo no nervo) para a leitura anatômica em tempo real (identificar o ponto vital durante o próprio combate, sem estudar antes), até a maestria de encadear pontos vitais em sequência — cada golpe desabilitando o próximo recurso do oponente, como quem desmonta uma máquina peça a peça.

---

### 🩸 Via do Eco — *Contra-ataque e Leitura*

**Filosofia:** o corpo como espelho. Atacar primeiro é uma aposta desnecessária — o oponente sempre revela sua intenção antes do golpe, e o verdadeiro lutador ataca o *erro*, não o corpo.

> *Mentalidade: "Você já me contou como vai me atingir. Só estou esperando você terminar de falar."*

**Forma de lutar:** reativa por design. O Eco espera, lê, e responde com precisão informada. Cada golpe do oponente é dados de inteligência; cada erro é uma abertura que o Eco já previu.

**Mecânica exclusiva — Leitura de Padrão:** após usar Desviar com sucesso contra um oponente, a próxima ação do Eco contra esse mesmo oponente na mesma troca recebe um bônus (o corpo "aprendeu" o padrão de ataque). Nenhuma outra Via transforma defesa bem-sucedida em bônus ofensivo — o Eco é a única Via em que *não atacar* melhora ativamente o próximo ataque.

**Pontos fortes:** a Via mais econômica em Sopro do sistema inteiro — usa a energia do oponente, não a própria; Postura Curva com Eco tem o menor custo possível para qualquer Impulso. Devastadora em duelos prolongados, onde a Leitura de Padrão se acumula.

**Pontos fracos:** contra oponentes que não atacam (que esperam, como outra Via do Eco), a mecânica exclusiva nunca ativa — dois espelhos frente a frente não refletem nada; Postura Sacrificial é filosoficamente contraditória (abrir mão da defesa destrói a leitura que é a alma da Via); inicia combate em desvantagem porque precisa *receber* antes de *devolver*.

**Evolução natural:** da leitura reativa (contra-atacar o erro óbvio) para a leitura preditiva (antecipar o erro antes dele acontecer), até a maestria de induzir o erro — o lutador não espera mais o oponente errar, ele *cria* o erro com provocações sutis e depois pune a abertura que ele mesmo desenhou.

---

### 🩸 Via do Vento Solto — *Mobilidade e Velocidade*

**Filosofia:** o corpo como corrente de ar — nunca onde deveria estar. Não busca vencer trocando golpes, busca vencer *não estando lá*.

> *Mentalidade: "Um golpe que não me toca já é uma vitória."*

**Forma de lutar:** deslocamento constante, ângulos inesperados, golpes que acontecem *durante* o movimento — nunca como uma ação separada. O Vento Solto não para para bater, bate enquanto passa.

**Mecânica exclusiva — Passo Fantasma:** ao usar Deslocar com Vento Solto, o lutador pode declarar o deslocamento como parte de outra ação (Romper enquanto se desloca, Desviar enquanto reposiciona) pelo custo combinado — nenhuma outra Via permite fundir duas ações em uma única resolução. O preço: o dano é reduzido (o corpo em movimento não transfere tanta força quanto o corpo plantado).

**Pontos fortes:** a única Via com ação favorecida em Deslocar — reposicionamento custa quase nada; Postura Alta com Vento Solto acessa verticalidade que nenhuma outra Via consegue usar efetivamente. Excelente contra múltiplos oponentes (nunca fica cercado).

**Pontos fracos:** dano por golpe individual é baixo — o Vento Solto precisa de múltiplas trocas para derrubar um oponente durável; Postura Baixa é estruturalmente cara (enraizar-se contradiz a filosofia de nunca estar parado); Impulso Prender custa Sopro extra (agarrar exige ficar no lugar, que é exatamente o que o Vento Solto evita).

**Evolução natural:** do deslocamento evasivo (sair do caminho) para o deslocamento ofensivo (golpear durante o movimento com Passo Fantasma), até a maestria de controlar o espaço inteiro do combate — o lutador decide onde cada participante está, a cada instante, e ninguém consegue forçá-lo a um lugar que ele não escolheu.

---

### 🩸 Via da Corrente — *Agarrões e Imobilização*

**Filosofia:** o corpo como corda e âncora. Filosofia de controle total — não busca ferir, busca *possuir* a luta, tirar do oponente a opção de decidir o que acontece a seguir.

> *Mentalidade: "Eu não preciso te quebrar. Só preciso que você entenda que já perdeu."*

**Forma de lutar:** contato constante, pegadas profundas, uso do peso do próprio corpo como instrumento de controle. O oponente entra na luta da Corrente e descobre que sair é mais difícil do que entrar.

**Mecânica exclusiva — Elo Inquebrantável:** enquanto Prender estiver mantido, qualquer tentativa do alvo de se libertar custa Sopro extra para *o alvo* (não para o lutador) — a Corrente transforma o recurso do oponente em custo de fuga. Nenhuma outra Via penaliza o *oponente* em Sopro por tentar agir.

**Pontos fortes:** a única Via em que Prender é a ação favorecida (custo reduzido, dado aumentado); Postura Baixa com Corrente é a combinação de controle mais difícil de quebrar do sistema inteiro. Devastadora contra builds de mobilidade (Vento Solto, Adagas) — uma vez que a Corrente prende, a velocidade do oponente vira irrelevante.

**Pontos fracos:** a Via mais cara em Sopro quando não consegue manter o controle — Romper puro com Corrente é ineficiente (não foi feita para golpear, foi feita para segurar); Postura Alta custa Sopro extra (agarrar no ar não tem alavancagem); péssima contra múltiplos oponentes (a Corrente controla *um*, não vários).

**Evolução natural:** da pegada simples que restringe um membro (agarrar o braço) para o controle postural completo (derrubar e imobilizar no chão com peso distribuído), até a maestria de usar o corpo preso do oponente como escudo, arma, ou instrumento de projeção contra outros — a Corrente não larga o que prende, ela *usa* o que prende.

---

### 🩸 Via da Pedra Firme — *Equilíbrio e Disciplina*

**Filosofia:** o corpo como fundação. Não é ofensiva nem evasiva — é a Via da negação. Ganha ao não perder o centro, absorvendo e redirecionando até o colapso natural do adversário.

> *Mentalidade: "A montanha nunca ataca. A montanha apenas está — e tudo que a golpeia, se quebra."*

**Forma de lutar:** posição fixa, centro de gravidade baixo, cada golpe recebido é absorvido e devolvido como instabilidade para o oponente. A Pedra Firme não precisa vencer — ela precisa que o oponente perca sozinho.

**Mecânica exclusiva — Raiz Inabalável:** enquanto em Postura Baixa, o lutador da Via da Pedra Firme é imune a efeitos de deslocamento forçado (empurrão, projeção, derrubada). Adicionalmente, qualquer Impulso que normalmente moveria o lutador (Deslocar de oponente, efeitos colaterais de combate) simplesmente falha — a Pedra Firme não sai de onde escolheu estar. Nenhuma outra Via ignora forçamento de posição.

**Pontos fortes:** a Via mais resiliente do sistema — menor custo de Sopro em Desviar, que combina com a filosofia de absorver sem gastar; Postura Baixa com Pedra Firme é a posição defensiva mais eficiente em Sopro de todo o sistema. Excelente contra Vias de comprometimento (Punho Vivo, Corrente) — quanto mais o oponente gasta, mais a Pedra Firme lucra por não gastar.

**Pontos fracos:** dano ofensivo mais baixo do sistema quando inicia o ataque (foi construída para *receber*, não para *ir*); Postura Alta é estruturalmente contraditória (abandona o centro de gravidade baixo que é a alma da Via); Impulso Romper puro é ineficiente — a Pedra Firme pode ferir, mas nunca devastar no primeiro golpe. Contra oponentes que não atacam (outro Pedra Firme, ou qualquer um que simplesmente vá embora), a Via perde seu motor.

**Evolução natural:** da absorção passiva (aguentar golpes sem cair) para a devolução proporcional (redirecionar a força do oponente de volta como dano), até a maestria de criar uma "aura de estabilidade" ao redor — onde o lutador da Pedra Firme pisa, o chão se torna território dele, e qualquer combate naquele espaço joga pelas regras dele.

---

## 3. TABELA-RESUMO DE IDENTIDADE MARCIAL

Equivalente compacto de `tracos: { escalaAlcance, escalaArea, ... }` dos Aspectos — os "traços" que cada Via carrega e que o motor de geração vai consultar.

| Via | Dado Base | Alcance | Impulso favorecido | Impulso penalizado | Postura favorecida | Postura penalizada | Modulador de Custo |
|---|---|---|---|---|---|---|---|
| **Punho Vivo** | d10 | Toque | Romper | Quebrar Ritmo | Cheia | Silenciosa | Caro (+1) |
| **Lâmina Curta** | d6 | Toque | Romper (preciso) | Prender | Silenciosa | Cheia | Médio (0) |
| **Eco** | d8 | Toque | Desviar | Deslocar | Curva | Sacrificial | Econômico (-1) |
| **Vento Solto** | d6 | Curto | Deslocar | Prender | Alta | Baixa | Médio (0) |
| **Corrente** | d8 | Toque | Prender | Romper | Baixa | Alta | Caro (+1) |
| **Pedra Firme** | d8 | Toque | Desviar | Romper | Baixa | Alta | Econômico (-1) |

**Notas de design sobre a tabela:**

- **Dado base varia de d6 a d10**, não de d4 a d12 — o combate desarmado deliberadamente ocupa uma faixa menor que a magia na escada de dados, porque o corpo humano tem limites que os deuses não têm. A escada completa (d4-d12) ainda existe para os casos extremos (Piso/Teto de Vidro, Sopro Pleno, críticos).

- **Alcance é quase sempre Toque** — o combate desarmado é essencialmente corpo a corpo. A exceção é o Vento Solto, cuja mobilidade constante lhe dá efetivamente Alcance Curto (golpeia e se desloca num único movimento).

- **Modulador de Custo reflete a filosofia da Via:** Vias que impõem (Punho Vivo, Corrente) gastam mais Sopro — estão forçando a realidade a ceder. Vias que redirecionam (Eco, Pedra Firme) gastam menos — usam a energia do oponente. Vias de espaço (Lâmina Curta, Vento Solto) ficam no meio.

---

## 4. OS IMPULSOS — as Ações Marciais Fundamentais (equivalente a `verbos{}`)

Se a Via é o *porquê*, o Impulso é o *o quê*. São **5 Impulsos**, a base "verbal" universal do combate corporal — toda ação de luta, em qualquer cultura, se resume a uma variação destes cinco.

Cada Impulso carrega os mesmos "traços" estruturais que um Verbo carrega (`custoBase`, `multiplicadorDados`, `curvas{}`). O Impulso **nunca decide identidade** (esse é o job da Via) — ele define *o que está sendo feito* e *quanto pesa*.

> **Nota de design:** estes 5 Impulsos são **idênticos** às 5 Ações do Combate com Armas (§4 do documento de Armas). A diferença é apenas de rótulo ("Impulso" para o corpo, "Ação" para a arma) — as mesmas funções de motor (`curvas{}`, `resolverEscala()`) podem ser literalmente reaproveitadas entre os dois sistemas, mudando apenas qual tabela de Identidade (Via vs. Categoria de Arma) é consultada.

| Impulso | Definição | Peso Base | Custo Base | Intenção |
|---|---|---|---|---|
| **Romper** | Golpear para causar dano direto (soco, chute, cotovelada, joelhada) | Médio | 2 | Ofensivo |
| **Desviar** | Negar o golpe do oponente (esquiva, defesa, redirecionamento) | Leve | 1 | Defensivo |
| **Prender** | Restringir o movimento do oponente (agarrão, chave, imobilização) | Pesado | 3 | Controle |
| **Deslocar** | Mover a si mesmo ou ao oponente no espaço (arrasto, projeção, avanço) | Médio | 2 | Utilidade |
| **Quebrar Ritmo** | Interromper a ação do oponente sem dano direto (finta, desequilíbrio) | Leve | 1 | Utilidade |

*Prender pesa mais porque exige sustentar controle contínuo sobre outro corpo — não é um golpe pontual, é esforço mantido.*

Cada Impulso carrega **templates narrativos por Via** (espelhando `verbo.template[aspectoId]` de `magias.js`), para que a mesma ação descrita por Vias diferentes tenha sabor narrativo distinto:

| Impulso | Punho Vivo | Lâmina Curta | Eco | Vento Solto | Corrente | Pedra Firme |
|---|---|---|---|---|---|---|
| **Romper** | Golpe frontal devastador, sem floreio — o corpo inteiro atrás do punho | Toque seco e cirúrgico numa articulação ou ponto nervoso específico | O contra-golpe que explora exatamente a abertura que o oponente acabou de criar | Golpe que acontece em pleno deslocamento — o corpo nunca para de se mover | Golpe curto de dentro da clinch, usando a proximidade como arma | Devolução de força absorvida — o golpe do oponente retorna como impulso contrário |
| **Desviar** | Absorve com a massa do corpo — não desvia, bloqueia | Desvio mínimo com o antebraço, o suficiente para o golpe passar raspando | Acompanha o golpe, redireciona a trajetória, lê a intenção para a resposta | Já não está onde o golpe chegou — esquiva por reposicionamento puro | Desvia enganchando o membro do oponente, transformando defesa em pegada | Recebe o golpe no centro do corpo, pés firmes no chão — o impacto se dissipa |
| **Prender** | Agarrão bruto, força contra força, pura superioridade física | Trava articular precisa — pressão no ponto exato que impede o movimento | Intercepta o braço estendido do oponente e reverte a pegada sobre ele mesmo | Agarrão de passagem — prende brevemente para redirecionar e solta em seguida | Envolvimento total do corpo do oponente — corda viva que aperta e não solta | Enraíza o oponente contra o chão, usando gravidade e peso como aliados |
| **Deslocar** | Avanço frontal, empurrão bruto — o corpo vira aríete | Reposicionamento lateral sutil, buscando ângulo de ataque não defendido | Giro que acompanha o avanço do oponente, usando o momentum dele para pivotar | Deslocamento contínuo e fluido — nunca uma linha reta, sempre ângulos | Arrasta o oponente para dentro do alcance de controle — puxa, não empurra | Absorve o empurrão e planta mais fundo — quando o oponente empurra, a Pedra endurece |
| **Quebrar Ritmo** | Grito, batida no peito, intimidação física — crueza que interrompe | Toque rápido no nervo que causa espasmo involuntário — o corpo trai o ritmo | Reproduz o início do golpe do oponente antes dele terminar — o espelho que confunde | Mudança abrupta de direção que rompe a leitura de trajetória do oponente | Puxa ou empurra inesperadamente durante a clinch — o equilíbrio se perde | Simplesmente não reage — a inação deliberada que quebra o ritmo de quem esperava resistência |

---

## 5. AS POSTURAS — os Modificadores do Corpo (equivalente a `modificadores{}`)

A Postura é *como* o corpo executa o Impulso — a granularidade tática do sistema, equivalente aos Modificadores da magia. São **8 Posturas**, combináveis com qualquer Impulso e qualquer Via.

Cada Postura carrega os mesmos "traços" estruturais que um Modificador carrega (`custoExtra`, `ajustes{}`). A Postura **nunca decide identidade nem ação** — ela define *a forma da execução* e *ajusta o custo final*.

> **Nota de design:** estas 8 Posturas são **compartilhadas sem alteração** com o Combate com Armas. A mesma Postura Cheia que um lutador desarmado usa é a mesma Postura Cheia que um espadachim usa — "como o corpo se comporta" é universal, esteja o corpo armado ou não. Isso não é preguiça de design — é a mesma decisão pedagógica do `magias.js`: uma peça que o jogador já aprendeu se reaproveita entre sistemas, para que dominar um sistema acelere o aprendizado do outro.

### ⚔ Cheia — *Comprometimento Total*
**Efeito:** máximo poder, mínima defesa — tudo no golpe.

**Ajustes:** `custoExtra: +2` · `ajDano: +2` · `ajDefesa: -2`

**Descrição narrativa (ofensivo):** O corpo abandona toda pretensão defensiva e despeja cada grama de peso, cada fibra de músculo, cada grão de Sopro numa única intenção. O golpe que nasce da Postura Cheia não é um golpe — é uma sentença. Se acertar, o combate pode terminar ali. Se errar, o lutador está nu.

**Descrição narrativa (defensivo):** A guarda se fecha como um portão de ferro — pesada, lenta de abrir, mas quase impossível de perfurar enquanto estiver mantida. Tudo sacrificado em troca de não ceder um centímetro.

---

### ⚔ Vazia — *Contenção Disciplinada*
**Efeito:** golpe controlado, mantém guarda e opção de recuo.

**Ajustes:** `custoExtra: -1` · `ajDano: -1` · `ajDefesa: +1`

**Descrição narrativa (ofensivo):** O golpe sai, mas a guarda não cai. O corpo oferece 70% do que poderia dar — os outros 30% são a promessa silenciosa de que haverá um próximo golpe, e que ele também vai doer. Ideal para quem combate como quem joga xadrez: cada peça mexida com cálculo.

**Descrição narrativa (defensivo):** A guarda relaxada engana — parece desprotegida, mas os braços e pernas estão em posição de reagir a qualquer direção. Eficiência sobre rigidez.

---

### ⚔ Baixa — *Enraizamento*
**Efeito:** prioriza estabilidade, ganha resistência a desequilíbrio.

**Ajustes:** `custoExtra: 0` · `ajDano: 0` · `ajDefesa: +1` · `ajEquilibrio: +2`

**Descrição narrativa (ofensivo):** O centro de gravidade desce e planta raízes. Os golpes vêm de baixo para cima, com toda a alavancagem do chão contra o céu. Quem tenta derrubar um lutador em Postura Baixa precisa primeiro mover o chão em que ele pisa.

**Descrição narrativa (defensivo):** Joelhos flexionados, pés largos, o peso do corpo distribuído como alicerce. Cada golpe recebido se dissipa pela estrutura inteira — é preciso mais do que um golpe para desplantar o que se enraizou de propósito.

---

### ⚔ Alta — *Verticalidade e Alcance*
**Efeito:** prioriza alcance e verticalidade, perde estabilidade.

**Ajustes:** `custoExtra: 0` · `ajDano: 0` · `ajDefesa: -1` · `ajAlcance: +1`

**Descrição narrativa (ofensivo):** O corpo se estende, ganha centímetros de alcance. Chutes altos, cotoveladas descendentes, joelhadas que sobem verticalmente — o eixo do combate vira vertical. Elegante e letal à distância certa, mas quem se ergue tanto tem mais longe para cair.

**Descrição narrativa (defensivo):** A guarda alta cobre cabeça e tronco superior com prioridade, pagando o preço de expor as pernas e o centro de equilíbrio.

---

### ⚔ Curva — *Fluidez e Redirecionamento*
**Efeito:** segue o movimento do oponente, ideal para redirecionar força.

**Ajustes:** `custoExtra: -1` · `ajDano: 0` · `ajDefesa: 0` · `ajRedirecionamento: +2`

**Descrição narrativa (ofensivo):** O corpo não resiste à força do oponente — ele a acolhe, gira, e devolve. Os golpes são arcos e espirais, não linhas retas. A força do oponente vira combustível: quanto mais duro ele ataca, mais a Postura Curva tem com o que trabalhar.

**Descrição narrativa (defensivo):** A guarda flui como água — nunca rígida, nunca no mesmo lugar por mais de um instante. Golpes que deveriam conectar escorregam pela superfície curva do movimento.

---

### ⚔ Reta — *Linha Direta*
**Efeito:** caminho mais curto entre os dois corpos — mais previsível, mais rápida.

**Ajustes:** `custoExtra: 0` · `ajDano: +1` · `ajDefesa: 0`

**Descrição narrativa (ofensivo):** Sem floreio, sem arco, sem giro. O punho sai da guarda e viaja a menor distância possível até o alvo. O que a Postura Reta perde em surpresa, ganha em velocidade pura — o oponente pode ver o golpe vindo, mas ver e reagir a tempo são coisas diferentes.

**Descrição narrativa (defensivo):** A defesa encontra o ataque de frente, no mesmo eixo. Bloquear ou bater — a Postura Reta não perde tempo decidindo, faz as duas coisas na mesma linha.

---

### ⚔ Silenciosa — *Intenção Escondida*
**Efeito:** esconde a intenção real do movimento — favorece finta e leitura.

**Ajustes:** `custoExtra: -1` · `ajDano: -1` · `ajDefesa: 0` · `ajSurpresa: +2`

**Descrição narrativa (ofensivo):** O golpe não anuncia sua vinda. O corpo não contrai antes de expandir, não telegrata a direção, não puxa o braço antes de desferir. O oponente sente o impacto antes de ver o movimento — e aí já é memória, não antecipação.

**Descrição narrativa (defensivo):** A guarda não revela o que protege. Braços aparentemente relaxados escondem uma intenção defensiva já calculada — quando o golpe chega, a defesa já estava lá, esperando.

---

### ⚔ Sacrificial — *Abertura Deliberada*
**Efeito:** abre mão da própria defesa para garantir o efeito do golpe.

**Ajustes:** `custoExtra: +2` · `ajDano: +3` · `ajDefesa: -3`

**Descrição narrativa (ofensivo):** A guarda cai. De propósito. O corpo se oferece ao golpe do oponente em troca de uma certeza: que o próprio golpe vai conectar. É a jogada desesperada ou calculada friamente — o lutador aceita sangrar para garantir que o oponente sangre mais. Os melhores lutadores do mundo usam Postura Sacrificial uma vez por cena. Os que usam duas vezes... são os que não precisam de uma terceira.

**Descrição narrativa (defensivo):** Não existe defesa Sacrificial em sentido estrito — é o corpo que se interpõe entre o golpe e outra pessoa, aceitando receber o que o aliado não poderia aguentar. Proteção pelo preço mais alto.

---

### Tabela-Resumo de Posturas

| Postura | custoExtra | ajDano | ajDefesa | Especial | Grupo de Custo |
|---|---|---|---|---|---|
| **Cheia** | +2 | +2 | -2 | — | Aumenta |
| **Vazia** | -1 | -1 | +1 | — | Reduz |
| **Baixa** | 0 | 0 | +1 | `ajEquilibrio: +2` | Neutro |
| **Alta** | 0 | 0 | -1 | `ajAlcance: +1` | Neutro |
| **Curva** | -1 | 0 | 0 | `ajRedirecionamento: +2` | Reduz |
| **Reta** | 0 | +1 | 0 | — | Neutro |
| **Silenciosa** | -1 | -1 | 0 | `ajSurpresa: +2` | Reduz |
| **Sacrificial** | +2 | +3 | -3 | — | Aumenta |

---

## 6. SOPRO — Custo Variável por Combinação

O Sopro é o mesmo recurso que já alimenta o Círculo da magia — o combate desarmado não cria um medidor novo, ele **compete pela mesma fonte**. Isso gera tensão tática real para personagens híbridos: gastar Sopro em combate corporal reduz o que resta disponível para magia na mesma cena, e vice-versa.

O custo de Sopro de uma técnica **não é fixo** — ele emerge da combinação de Via + Impulso + Postura, assim como o custo de uma magia emerge de Aspecto + Verbo + Modificador. Três camadas de custo se somam:

### Camada 1 — Peso Base do Impulso
Cada Impulso tem um peso natural, porque nem toda ação corporal exige o mesmo esforço:

| Impulso | Peso natural | Custo Base |
|---|---|---|
| Desviar | Leve | 1 |
| Quebrar Ritmo | Leve | 1 |
| Romper | Médio | 2 |
| Deslocar | Médio | 2 |
| Prender | Pesado | 3 |

### Camada 2 — Modulador de Postura
A Postura ajusta esse peso base para cima ou para baixo (via `custoExtra`):

| Grupo | Posturas | Efeito no custo |
|---|---|---|
| **Reduz** | Vazia (-1), Curva (-1), Silenciosa (-1) | Eficiência, controle, economia de movimento |
| **Neutro** | Reta (0), Baixa (0), Alta (0) | Execução direta |
| **Aumenta** | Cheia (+2), Sacrificial (+2) | Comprometimento total |

### Camada 3 — Modulador de Via
A filosofia da Via também pesa (via `moduladorCusto` da tabela §3):

| Grupo | Vias | Modulador | Justificativa |
|---|---|---|---|
| **Econômicas** | Eco (-1), Pedra Firme (-1) | Reduz custo | Usam a energia do oponente, não a própria |
| **Neutras** | Lâmina Curta (0), Vento Solto (0) | Sem ajuste | Equilíbrio entre imposição e economia |
| **Caras** | Punho Vivo (+1), Corrente (+1) | Aumenta custo | Gastam Sopro para superar resistência do oponente |

### Fórmula de custo
```
custoFinal = impulso.custoBase + postura.custoExtra + via.moduladorCusto
```

Piso mínimo: **0** (nenhuma combinação tem custo negativo — há sempre algum gasto de Sopro, mesmo que mínimo). Quando o cálculo resulta em 0 ou menos, o custo é travado em 0 (ação "gratuita" — a filosofia da Via, a economia da Postura e a leveza do Impulso se alinham tão bem que o corpo executa quase sem esforço consciente).

### O Nível de Sopro como Teto de Intenção

Ao declarar uma técnica, o jogador escolhe um nível de comprometimento pretendido:

| Nível de Sopro | Significado | Multiplicador de Custo | Multiplicador de Efeito |
|---|---|---|---|
| **Sopro Curto** | Ação rápida, baixo risco, baixo retorno — testar o oponente sem se expor | ×1 | ×1 |
| **Sopro Sustentado** | Ação padrão, risco e retorno equilibrados | ×1.5 (arredondado para cima) | ×1.5 |
| **Sopro Pleno** | Comprometimento total — maior efeito, exposição real se falhar | ×2 | ×2 |

Esse nível funciona como multiplicador: a combinação final de Via + Impulso + Postura determina o custo base, e o nível de Sopro escolhido multiplica tanto o custo quanto o efeito. Sopro Pleno sempre custa o dobro — mas o dado de dano, a duração do controle, ou a intensidade da defesa também dobram.

**Nota de balanceamento:** nenhuma combinação deve ser barata em Sopro E devastadora em efeito ao mesmo tempo — o mesmo cuidado que a magia já precisa ter para que nenhuma combinação vire "óbvia demais" de sempre escolher. A regra de ouro se expressa matematicamente: combinações com custo base baixo (Eco + Desviar + Curva = 0) nunca acessam dano devastador, mesmo em Sopro Pleno — o multiplicador ×2 sobre 0 ainda é 0 de custo, mas o dado base do Eco (d8) na ação Desviar (defensiva, sem dano) garante que o efeito é defensivo, nunca ofensivo-devastador.

---

## 7. A FÓRMULA COMPLETA

**Via** (filosofia + modulador de custo + dado base) **+ Impulso** (ação + peso base) **+ Postura** (execução + modulador de custo, compartilhada com o Combate com Armas) **+ Sopro** (teto de intenção, custo final emergente) **= Técnica única**

Com 6 Vias × 5 Impulsos × 8 Posturas × 3 níveis de Sopro (22 peças de design no total), o sistema gera **720 combinações possíveis** — poucas peças, muitas combinações, no mesmo espírito do motor combinatório da magia.

O ponto crucial: **a Via não é um pacote de golpes prontos — é uma lente**. O jogador não escolhe "técnica #14 da lista Punho Vivo". Ele escolhe a filosofia e narra, junto com o Impulso e a Postura, o que aquilo significa em seu personagem. Dois lutadores da mesma Via nunca lutam igual.

---

## 8. EXEMPLOS DE TÉCNICAS GERADAS

**Via do Punho Vivo + Romper + Postura Cheia + Sopro Pleno**
> *"Golpe do Último Fôlego"* — o lutador avança sem qualquer preocupação defensiva, colocando todo o peso do corpo em um único golpe. Impulso médio (2) + Postura que aumenta custo (+2) + Via cara (+1) = **custo base 5, × 2 (Pleno) = 10 de Sopro**. Se acertar, dado d10 com ajDano +2 (Postura) e efeito ×2 (Pleno) — devastador. Se errar ou for interrompido, o lutador fica com ajDefesa -2 e completamente exposto.

**Via da Lâmina Curta + Romper + Postura Silenciosa + Sopro Curto**
> *"Corte de Véu"* — um golpe curto e quase imperceptível, disfarçado dentro de outro movimento, direcionado a uma articulação específica. Impulso médio (2) + Postura que reduz custo (-1) + Via neutra (0) = **custo base 1, × 1 (Curto) = 1 de Sopro**. Dano baixo (d6, ajDano -1), mas ativa Ponto Vital: a articulação atingida perde função. Ideal para repetir ao longo de uma cena.

**Via do Eco + Desviar + Postura Curva + Sopro Sustentado**
> *"Resposta do Espelho"* — o lutador não bloqueia o golpe, ele o acompanha, redirecionando a força do oponente de volta contra o próprio equilíbrio dele. Impulso leve (1) + Postura que reduz custo (-1) + Via econômica (-1) = **custo base 0 (piso), × 1.5 (Sustentado) = 0 de Sopro** (o piso trava antes do multiplicador para combinações que já são 0). Ativa Leitura de Padrão: o próximo golpe contra este oponente ganha bônus. Narrativamente coerente: usar a força do oponente não deveria drenar quase nada do próprio corpo.

**Via do Vento Solto + Deslocar + Postura Alta + Sopro Curto**
> *"Passo Que Não Pisa"* — o lutador se desloca de forma quase aérea, saindo da linha de ataque antes mesmo do golpe ser concluído, reposicionando-se em vantagem. Impulso médio (2) + Postura neutra (0) + Via neutra (0) = **custo base 2, × 1 (Curto) = 2 de Sopro**. Ativa Passo Fantasma: pode fundir este Deslocar com a próxima ação numa resolução única.

**Via da Corrente + Prender + Postura Sacrificial + Sopro Pleno**
> *"Abraço do Fim"* — o lutador abre mão completamente da própria defesa para capturar o oponente em uma imobilização da qual é quase impossível escapar. Impulso pesado (3) + Postura que aumenta custo (+2) + Via cara (+1) = **custo base 6, × 2 (Pleno) = 12 de Sopro**. O custo mais alto possível no sistema — técnica de momento decisivo, não algo que se repete à vontade. Ativa Elo Inquebrantável: tentativas de fuga custam Sopro extra para o oponente. Se falhar, ajDefesa -3 — a exposição é máxima.

**Via da Pedra Firme + Quebrar Ritmo + Postura Baixa + Sopro Sustentado**
> *"Silêncio da Montanha"* — sem atacar ou recuar, o lutador nega o espaço, absorvendo o ímpeto do oponente e quebrando o ritmo do combate até que o adversário se desequilibre por conta própria. Impulso leve (1) + Postura neutra (0) + Via econômica (-1) = **custo base 0 (piso), × 1.5 = 0 de Sopro**. Ativa Raiz Inabalável (em Postura Baixa): imune a deslocamento forçado. O custo mais baixo possível — a Pedra Firme gasta nada e espera o oponente gastar tudo.

**Via do Eco + Prender + Postura Reta + Sopro Curto**
> *"Contra-Chave Instantânea"* — no exato momento em que o oponente tenta agarrar, o lutador intercepta o próprio braço dele e reverte a pegada, prendendo quem tentava prender. Impulso pesado (3) + Postura neutra (0) + Via econômica (-1) = **custo base 2, × 1 = 2 de Sopro**. Leitura de Padrão não ativa (não usou Desviar), mas o custo baixo para um Prender compensa.

**Via do Vento Solto + Romper + Postura Curva + Sopro Sustentado**
> *"Golpe de Passagem"* — o lutador nunca para de se mover; o golpe acontece *durante* o deslocamento, não como uma ação separada, dificultando qualquer antecipação. Impulso médio (2) + Postura que reduz custo (-1) + Via neutra (0) = **custo base 1, × 1.5 = 2 de Sopro** (arredondado para cima). Dano d6 (dado base baixo do Vento Solto) — não é devastador, mas é barato e difícil de antecipar.

---

## 9. GANCHOS OPCIONAIS DE APROFUNDAMENTO

Sementes para lapidação futura — nenhuma implica decisão tomada, apenas pontos de partida para quando fizer sentido revisitar:

- **Vias como heranças culturais.** Assim como os Grotans se dividem por estilo de guerra e patrono divino, cada Via poderia ter uma ou duas culturas de Aetherion associadas por padrão (sem travar a escolha do jogador) — Durkan puxando para Punho Vivo/Pedra Firme, Elvarin Errantes para Eco/Vento Solto, Grotans da Ordem para Pedra Firme, e assim por diante.

- **Uma sétima Via "proibida".** Ecoando o Véu Trincado e Nythraxis, uma Via ligada à corrupção poderia existir futuramente — um estilo que rompe as próprias regras do sistema (Posturas "impossíveis", Impulsos fora da lista de 5), reservada a criaturas corrompidas ou NPCs, nunca a builds normais de jogador. Equivalente ao gancho de "nona Categoria exótica" do Combate com Armas.

- **Camada 4 opcional — Aprofundamentos de Via.** Equivalente direto das Especializações do Combate com Armas e das Manifestações da magia. Cada Via poderia ter 2-3 refinamentos opcionais que ajustam a fórmula sem alterar Via, Impulso ou Postura. Exemplos possíveis:
  - Punho Vivo: *Golpe de Terra* (+bônus contra Postura Alta) · *Punho que Não Para* (segundo Romper no mesmo turno custa menos)
  - Lâmina Curta: *Mapa Anatômico* (Ponto Vital afeta dois pontos em vez de um) · *Corte Silencioso* (Romper em Postura Silenciosa não revela posição)
  - Eco: *Espelho Duplo* (Leitura de Padrão acumula até 2 bônus) · *Eco Antecipado* (Leitura de Padrão ativa mesmo com Quebrar Ritmo, não só Desviar)
  - Vento Solto: *Vento em Todas as Direções* (Passo Fantasma funciona com Prender, não só Romper/Desviar) · *Passo Vertical* (Postura Alta elimina a penalidade de instabilidade)
  - Corrente: *Laço Vivo* (Elo Inquebrantável afeta dois membros em vez de um) · *Queda Controlada* (Prender pode derrubar como efeito adicional)
  - Pedra Firme: *Montanha que Anda* (Raiz Inabalável funciona em Postura Reta, não só Baixa) · *Reflexo da Pedra* (dano recebido em Desviar é parcialmente devolvido)

  **Mesmo aviso de balanceamento das Especializações de Armas:** nenhum Aprofundamento deve ser upgrade estritamente melhor sem custo. A decisão de implementar esta camada fica para quando o código for escrito.

- **Combos entre Via e Categoria de Arma.** Um personagem que pratica a Via do Eco (combate desarmado) e empunha Correntes (combate armado) tem sinergia narrativa óbvia — a arma mais difícil de ler + a Via que lê o oponente. Uma tabela de fricção positiva/negativa Via×Categoria para builds verdadeiramente híbridos, no mesmo espírito da matriz Via×Postura, é um gancho futuro natural.

---

## 10. RESUMO DE REFERÊNCIA RÁPIDA

**6 Vias:** Punho Vivo (força bruta, d10) · Lâmina Curta (precisão, d6) · Eco (contra-ataque, d8) · Vento Solto (mobilidade, d6) · Corrente (agarrões, d8) · Pedra Firme (equilíbrio, d8)

**5 Impulsos:** Romper (médio, 2) · Desviar (leve, 1) · Prender (pesado, 3) · Deslocar (médio, 2) · Quebrar Ritmo (leve, 1) — *idênticos às 5 Ações do combate armado*

**8 Posturas:** Cheia (+2) · Vazia (-1) · Baixa (0) · Alta (0) · Curva (-1) · Reta (0) · Silenciosa (-1) · Sacrificial (+2) — *compartilhadas, sem alteração, com o combate armado*

**3 Níveis de Sopro:** Curto (×1) · Sustentado (×1.5) · Pleno (×2) — *custo final sempre emergente da combinação, nunca fixo*

**Fórmula:** Via + Impulso + Postura + Sopro = Técnica única

**Custo:** `(impulso.custoBase + postura.custoExtra + via.moduladorCusto) × sopro.multiplicador` — piso mínimo 0

---

## 11. ESQUELETO DE IMPLEMENTAÇÃO (PSEUDOCÓDIGO)

Esta parte não é o código final — é o mapeamento estrutural para quando o `combateDesarmado.js` for de fato escrito, no mesmo formato de objeto único exportável que `magias.js` já usa.

```javascript
// =============================================================
// ESQUELETO — combateDesarmado.js (espelha a arquitetura de magias.js)
// =============================================================

const sistemaCombateDesarmado = {

  // Reaproveitado 1:1 de sistemaMagia.curvas — mesmo motor de escala
  curvas: { /* ...idêntico a sistemaMagia.curvas... */ },

  // Reaproveitado 1:1 de sistemaMagia.escadaDados + ajustarDegrau()
  escadaDados: ['d4', 'd6', 'd8', 'd10', 'd12'],
  ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal = 0) { /* idêntico */ },

  // ===========================================================
  // NÍVEIS DE SOPRO — multiplicadores de custo e efeito
  // ===========================================================
  niveisSopro: {
    curto:      { nome: 'Sopro Curto',     multiplicadorCusto: 1,   multiplicadorEfeito: 1   },
    sustentado: { nome: 'Sopro Sustentado', multiplicadorCusto: 1.5, multiplicadorEfeito: 1.5 },
    pleno:      { nome: 'Sopro Pleno',      multiplicadorCusto: 2,   multiplicadorEfeito: 2   },
  },

  // ===========================================================
  // CAMADA 1 — AS 6 VIAS (equivalente a aspectos{})
  // ===========================================================
  vias: {
    punhoVivo: {
      nome: 'Via do Punho Vivo',
      filosofia: 'Força Bruta',
      icone: '🩸',
      dadoBase: 'd10',
      alcance: 'toque',
      impulsoFavorecido: 'romper',
      impulsoPenalizado: 'quebrarRitmo',
      posturaFavorecida: 'cheia',
      posturaPenalizada: 'silenciosa',
      moduladorCusto: +1,
      mecanicaExclusiva: {
        id: 'impactoIrresistivel',
        nome: 'Impacto Irresistível',
        descricao: 'Acerto crítico força deslocamento/desequilíbrio no alvo.',
      },
      descricao: '...',
      template: {
        romper: '...', desviar: '...', prender: '...',
        deslocar: '...', quebrarRitmo: '...'
      }
    },
    laminaCurta: {
      nome: 'Via da Lâmina Curta',
      filosofia: 'Precisão Cirúrgica',
      icone: '🩸',
      dadoBase: 'd6',
      alcance: 'toque',
      impulsoFavorecido: 'romper',
      impulsoPenalizado: 'prender',
      posturaFavorecida: 'silenciosa',
      posturaPenalizada: 'cheia',
      moduladorCusto: 0,
      mecanicaExclusiva: {
        id: 'pontoVital',
        nome: 'Ponto Vital',
        descricao: 'Romper pode nomear ponto anatômico — penalidade à função atingida.',
      },
      descricao: '...',
      template: { /* ... */ }
    },
    eco:         { /* Leitura de Padrão */ },
    ventoSolto:  { /* Passo Fantasma */ },
    corrente:    { /* Elo Inquebrantável */ },
    pedraFirme:  { /* Raiz Inabalável */ },
  },

  // ===========================================================
  // CAMADA 2 — OS 5 IMPULSOS (equivalente a verbos{})
  // ===========================================================
  impulsos: {
    romper:       { nome: 'Romper',        pesoBase: 'medio',  custoBase: 2, intencao: 'ofensivo'  },
    desviar:      { nome: 'Desviar',       pesoBase: 'leve',   custoBase: 1, intencao: 'defensivo' },
    prender:      { nome: 'Prender',       pesoBase: 'pesado', custoBase: 3, intencao: 'controle'  },
    deslocar:     { nome: 'Deslocar',      pesoBase: 'medio',  custoBase: 2, intencao: 'utilidade' },
    quebrarRitmo: { nome: 'Quebrar Ritmo', pesoBase: 'leve',   custoBase: 1, intencao: 'utilidade' },
  },

  // ===========================================================
  // CAMADA 3 — AS 8 POSTURAS (equivalente a modificadores{})
  // Exportadas para reaproveitamento por combateArmado.js
  // ===========================================================
  posturas: {
    cheia:       { nome: 'Cheia',       custoExtra: +2, ajustes: { ajDano: +2, ajDefesa: -2 } },
    vazia:       { nome: 'Vazia',       custoExtra: -1, ajustes: { ajDano: -1, ajDefesa: +1 } },
    baixa:       { nome: 'Baixa',       custoExtra:  0, ajustes: { ajDano:  0, ajDefesa: +1, ajEquilibrio: +2 } },
    alta:        { nome: 'Alta',        custoExtra:  0, ajustes: { ajDano:  0, ajDefesa: -1, ajAlcance: +1 } },
    curva:       { nome: 'Curva',       custoExtra: -1, ajustes: { ajDano:  0, ajDefesa:  0, ajRedirecionamento: +2 } },
    reta:        { nome: 'Reta',        custoExtra:  0, ajustes: { ajDano: +1, ajDefesa:  0 } },
    silenciosa:  { nome: 'Silenciosa',  custoExtra: -1, ajustes: { ajDano: -1, ajDefesa:  0, ajSurpresa: +2 } },
    sacrificial: { nome: 'Sacrificial', custoExtra: +2, ajustes: { ajDano: +3, ajDefesa: -3 } },
  },

  // ===========================================================
  // MOTOR — calcularCusto (espelha calcularCusto de magias.js)
  // ===========================================================
  calcularCusto(viaId, impulsoId, posturaId, nivelSopro = 'sustentado') {
    const via = this.vias[viaId];
    const impulso = this.impulsos[impulsoId];
    const postura = this.posturas[posturaId];
    const sopro = this.niveisSopro[nivelSopro];
    if (!via || !impulso || !postura || !sopro) return 0;

    // Camada 1: peso base do Impulso
    let custoBase = impulso.custoBase;
    // Camada 2: modulador de Postura
    custoBase += postura.custoExtra;
    // Camada 3: modulador de Via
    custoBase += via.moduladorCusto;

    // Piso mínimo: 0
    custoBase = Math.max(0, custoBase);

    // Multiplicador de Sopro
    return Math.ceil(custoBase * sopro.multiplicadorCusto);
  },

  // ===========================================================
  // FUNÇÃO DE GERAÇÃO FINAL (espelha gerarMagia)
  // ===========================================================
  gerarTecnica(viaId, impulsoId, posturaId, nivelSopro = 'sustentado', options = {}) {
    // 1. Validação (idêntica em espírito ao passo 1 de gerarMagia)
    // 2. Resolução de custo (calcularCusto acima)
    // 3. Resolução de dado (reaproveitar ajustarDegrau + escadaDados)
    // 4. Resolução de mecânica exclusiva (via.mecanicaExclusiva)
    // 5. Resolução de fricção Via×Postura (favorecida/penalizada)
    // 6. Montagem de template narrativo (concatenar fragmentos)
    // 7. Retorno do objeto de técnica completo
  },

};

// Exportação
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sistemaCombateDesarmado;
}
```

**Por que as Posturas vivem aqui e não em módulo separado:** enquanto o projeto não tiver um `motor-compartilhado.js`, as Posturas são definidas neste arquivo e referenciadas por `combateArmado.js` via `sistemaCombateDesarmado.posturas`. Se no futuro um módulo compartilhado for criado, a migração é uma única linha de importação — zero lógica a reescrever.
