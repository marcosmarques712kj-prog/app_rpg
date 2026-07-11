// =============================================================
// BANCO DE DADOS COMBINATÓRIO DE COMBATE DESARMADO — AETHERION
// =============================================================
// Sistema modular de 3 camadas:
//   Via (6) × Impulso (5) × Postura (8)
//
// Cada combinação gera uma técnica única de combate corpo-a-corpo.
// O tom narrativo reflete a fantasia sombria e a mitologia de Aetherion.
//
// Exporta o objeto `sistemaCombateDesarmado` com:
//   - vias{}        → 6 filosofias marciais
//   - impulsos{}    → 5 ações fundamentais de combate
//   - posturas{}    → 8 modificadores de execução (compartilhadas com combateArmado.js)
//   - niveisSopro{} → 3 níveis de comprometimento
//
// Arquitetura espelha 1:1 o padrão de magias.js:
//   Via = Aspecto (identidade + traços de escala)
//   Impulso = Verbo (ação + peso + custo base)
//   Postura = Modificador (forma + ajuste de custo)
//   Sopro = Círculo (recurso compartilhado com magia)
//
// O Sopro é o MESMO recurso da magia — os dois sistemas competem
// pela mesma fonte. Um personagem híbrido (lutador-mago) reparte
// um único pool de Sopro entre combate e feitiçaria na mesma cena.
//
// NOTA DE BALANCEAMENTO (princípio herdado de magias.js):
//   Nenhuma combinação Via+Impulso+Postura deve ser simultaneamente
//   barata em Sopro e devastadora em efeito. Se é barata, é sutil;
//   se é devastadora, é cara. Sem exceções.
// =============================================================

const sistemaCombateDesarmado = {

  // ===========================================================
  // MOTOR DE CURVAS — Funções matemáticas de escalonamento
  // Reaproveitado 1:1 de sistemaMagia.curvas
  // ===========================================================
  curvas: {
    constante:    (c) => 1,
    linear:       (c) => c,
    lenta:        (c) => Math.ceil(c * 0.6),
    raiz:         (c) => Math.round(Math.sqrt(c) * 2.5),
    quadratica:   (c) => Math.round((c * c) / 4),
    logaritmica:  (c) => Math.round(Math.log2(c + 1) * 2.5),
    exponencial:  (c) => Math.round(Math.pow(1.4, c)),
  },

  // ===========================================================
  // ESCADA DE DADOS À PROVA DE QUEBRAS
  // Reaproveitado 1:1 de sistemaMagia.escadaDados + ajustarDegrau()
  // ===========================================================
  escadaDados: ['d4', 'd6', 'd8', 'd10', 'd12'],

  ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal = 0) {
    const indiceBruto = indiceBase + alteracao;
    let bonusFixo = bonusFixoOriginal;
    let bonusFlatExtra = 0;

    if (indiceBruto < 0) {
      // Piso de Vidro: não há "d2". Corta o bônus fixo pela metade.
      bonusFixo = Math.floor(bonusFixoOriginal / 2);
      return { dado: this.escadaDados[0], indiceFinal: 0, bonusFixo, bonusFlatExtra };
    }

    if (indiceBruto > this.escadaDados.length - 1) {
      // Teto de Vidro: não há acima de d12. Converte excedente em dano fixo.
      const excedente = indiceBruto - (this.escadaDados.length - 1);
      bonusFlatExtra = excedente * 2;
      return { dado: this.escadaDados[this.escadaDados.length - 1], indiceFinal: this.escadaDados.length - 1, bonusFixo, bonusFlatExtra };
    }

    return { dado: this.escadaDados[indiceBruto], indiceFinal: indiceBruto, bonusFixo, bonusFlatExtra };
  },

  // ===========================================================
  // ETIQUETAS QUALITATIVAS — Conversão valor bruto → rótulo
  // Adaptado de sistemaMagia.etiquetas para contexto de combate
  // ===========================================================
  etiquetas: {
    alcance:      ['Toque', 'Curto', 'Médio'],
    intensidade:  ['Leve', 'Moderada', 'Forte', 'Devastadora', 'Letal'],
    custoRelativo:['Gratuito', 'Barato', 'Moderado', 'Caro', 'Proibitivo'],
    desgaste:     ['Nenhum', 'Leve', 'Moderado', 'Severo'],
  },

  resolverEtiqueta(tipo, valorBruto) {
    const tabela = this.etiquetas[tipo];
    if (!tabela) return 'Desconhecido';
    const index = Math.min(Math.floor(valorBruto / 2.5), tabela.length - 1);
    return tabela[Math.max(0, index)];
  },

  // ===========================================================
  // NÍVEIS DE SOPRO — Teto de intenção do lutador
  // ===========================================================
  // O jogador declara quanto do corpo quer comprometer ANTES de
  // saber o custo final real. O nível funciona como multiplicador.
  // ===========================================================
  niveisSopro: {
    curto: {
      nome: 'Sopro Curto',
      descricao: 'Ação rápida, baixo risco, baixo retorno — testar o oponente sem se expor.',
      multiplicadorCusto: 1,
      multiplicadorEfeito: 1,
    },
    sustentado: {
      nome: 'Sopro Sustentado',
      descricao: 'Ação padrão, risco e retorno equilibrados.',
      multiplicadorCusto: 1.5,
      multiplicadorEfeito: 1.5,
    },
    pleno: {
      nome: 'Sopro Pleno',
      descricao: 'Comprometimento total do corpo — maior efeito, exposição real se falhar.',
      multiplicadorCusto: 2,
      multiplicadorEfeito: 2,
    },
  },


  // ===========================================================
  // CAMADA 1 — AS 6 VIAS (equivalente a aspectos{} de magias.js)
  // ===========================================================
  // Cada Via define:
  //   nome        → nome de exibição
  //   filosofia   → subtítulo temático
  //   icone       → emoji representativo
  //   dadoBase    → dado de dano/efeito fundamental
  //   alcance     → alcance natural da Via
  //   impulsoFavorecido / impulsoPenalizado → fricção Via×Impulso
  //   posturaFavorecida / posturaPenalizada → fricção Via×Postura
  //   moduladorCusto → ajuste fixo de Sopro por identidade (+1/0/-1)
  //   mecanicaExclusiva → efeito que NENHUMA outra Via reproduz
  //   descricao   → texto de lore narrativo
  //   template    → fragmentos narrativos por Impulso
  //
  // NENHUMA Via sabe calcular custo (job do Impulso+Postura).
  // NENHUM Impulso sabe definir identidade (job da Via).
  // ===========================================================
  vias: {

    // ─────────────────────────────────────────────────
    // 1. VIA DO PUNHO VIVO — Força Bruta
    // ─────────────────────────────────────────────────
    punhoVivo: {
      nome: 'Via do Punho Vivo',
      filosofia: 'Força Bruta',
      icone: '👊',
      dadoBase: 'd10',        // índice 3 na escadaDados — o maior do sistema desarmado
      alcance: 'toque',
      impulsoFavorecido: 'romper',
      impulsoPenalizado: 'quebrarRitmo',
      posturaFavorecida: 'cheia',
      posturaPenalizada: 'silenciosa',
      moduladorCusto: +1,     // Via que impõe — cara
      mecanicaExclusiva: {
        id: 'impactoIrresistivel',
        nome: 'Impacto Irresistível',
        descricao: 'Todo acerto crítico com Romper força o alvo a resistir deslocamento ' +
          '(empurrão, desequilíbrio) mesmo que o golpe fosse apenas para causar dano.',
        gatilho: 'acertoCritico',
        impulsoRequerido: 'romper',
        efeito: { forcaDeslocamento: true },
      },
      descricao:
        'O corpo como martelo. A filosofia de que a carne, quando comprometida por ' +
        'inteiro, é a arma mais honesta que existe. O Punho Vivo não busca elegância, ' +
        'não busca eficiência, não busca economia — busca certeza. Cada golpe carrega ' +
        'o peso de um corpo que decidiu que este instante vale todo o Sopro que resta. ' +
        'Os Durkan do Norte praticam variações desta Via há gerações, e suas cicatrizes ' +
        'contam mais histórias do que qualquer tratado de esgrima. Não é a Via dos ' +
        'espertos — é a Via dos que continuam de pé quando os espertos já caíram.',
      template: {
        romper:
          'O lutador avança sem floreio — o peso do corpo inteiro se concentra no ponto ' +
          'de impacto. Os músculos contraem em uníssono, os pés empurram o chão como se ' +
          'quisessem rachá-lo, e o golpe sai com a inevitabilidade de uma avalanche que ' +
          'já começou a descer.',
        desviar:
          'Não desvia — absorve. O braço se interpõe como tronco de carvalho, recebendo ' +
          'o golpe no antebraço endurecido. O impacto estala, mas o corpo não se move. ' +
          'Quem golpeou sente as próprias articulações vibrarem com a força devolvida ' +
          'pela massa inerte do bloqueio.',
        prender:
          'Agarrão bruto e direto — as mãos fecham como mandíbulas de ferro ao redor do ' +
          'braço, torso ou pescoço do oponente. Não há técnica refinada, há superioridade ' +
          'física pura: músculos que apertam até o outro corpo parar de resistir ou parar ' +
          'de funcionar.',
        deslocar:
          'Avanço frontal como aríete — o corpo inteiro empurra, os ombros à frente, os ' +
          'pés martelos no chão. Quem está no caminho decide entre sair ou ser levado ' +
          'junto. O Punho Vivo não pede passagem — ele abre.',
        quebrarRitmo:
          'Um grito que sai do fundo do peito, uma batida no próprio tórax que ecoa como ' +
          'tambor de guerra. Não é sutil — é intimidação bruta. O oponente hesita não por ' +
          'confusão tática, mas pelo instinto primitivo que reconhece um predador quando o ' +
          'vê se anunciar.',
      },
    },

    // ─────────────────────────────────────────────────
    // 2. VIA DA LÂMINA CURTA — Precisão Cirúrgica
    // ─────────────────────────────────────────────────
    laminaCurta: {
      nome: 'Via da Lâmina Curta',
      filosofia: 'Precisão Cirúrgica',
      icone: '🗡️',
      dadoBase: 'd6',         // índice 1 — baixo dano, alto efeito colateral
      alcance: 'toque',
      impulsoFavorecido: 'romper',
      impulsoPenalizado: 'prender',
      posturaFavorecida: 'silenciosa',
      posturaPenalizada: 'cheia',
      moduladorCusto: 0,      // Via neutra
      mecanicaExclusiva: {
        id: 'pontoVital',
        nome: 'Ponto Vital',
        descricao: 'Ao usar Romper, o jogador pode nomear um ponto anatômico específico. ' +
          'Se acertar, além do dano, aplica penalidade à função do membro/órgão atingido.',
        gatilho: 'declaracao',
        impulsoRequerido: 'romper',
        efeito: { penalFuncaoLocal: true },
      },
      descricao:
        'O corpo como bisturi. Não é sobre quanto dano se causa, é sobre onde. A Via da ' +
        'Lâmina Curta conta articulações, mede nervos, mapeia pontos de ruptura enquanto o ' +
        'oponente ainda está se preparando para o primeiro golpe. Filosoficamente oposta ao ' +
        'Punho Vivo: a crença de que força bruta é desperdício de energia contra um alvo ' +
        'que já está morto — só ainda não sabe. Os Elvarin Errantes da floresta usam ' +
        'variações desta Via para caçar criaturas três vezes maiores que eles, e nunca ' +
        'precisam de um segundo golpe no mesmo ponto. Todo corpo tem uma dobradiça.',
      template: {
        romper:
          'Um toque seco e quase imperceptível — a mão estende dois dedos ou o punho se ' +
          'fecha num ângulo preciso, e o golpe viaja a menor distância possível até o ponto ' +
          'exato onde o nervo se cruza com o tendão. O oponente sente antes de ver: uma dor ' +
          'aguda, cirúrgica, que apaga a função do membro atingido como quem desliga um ' +
          'interruptor.',
        desviar:
          'Desvio mínimo — o antebraço se desloca centímetros, não metros. O golpe do ' +
          'oponente passa raspando, quase tocando a pele, e a diferença entre acertar e ' +
          'errar é tão fina que parece sorte. Não é. É cálculo de distância que a Lâmina ' +
          'Curta faz por instinto.',
        prender:
          'Trava articular precisa — não força bruta, mas pressão no ponto exato que ' +
          'impede a rotação natural da articulação. O oponente sente que poderia se soltar ' +
          'se apenas girasse o braço um pouco mais... mas esse pouco mais é onde o osso ' +
          'quebra.',
        deslocar:
          'Reposicionamento lateral sutil — um passo que parece casual, mas coloca o ' +
          'lutador no ângulo morto da guarda do oponente. A Lâmina Curta não avança de ' +
          'frente; ela contorna, encontra o flanco, e o próximo golpe já tem destino antes ' +
          'do pé terminar de pisar.',
        quebrarRitmo:
          'Um toque rápido no nervo que causa espasmo involuntário — o braço do oponente ' +
          'treme, o pé pisa fora de compasso, e o ritmo do combate se parte como corda ' +
          'de violino mal afinada. O corpo traiu o próprio dono.',
      },
    },

    // ─────────────────────────────────────────────────
    // 3. VIA DO ECO — Contra-ataque e Leitura
    // ─────────────────────────────────────────────────
    eco: {
      nome: 'Via do Eco',
      filosofia: 'Contra-ataque e Leitura',
      icone: '🪞',
      dadoBase: 'd8',         // índice 2 — equilibrado
      alcance: 'toque',
      impulsoFavorecido: 'desviar',
      impulsoPenalizado: 'deslocar',
      posturaFavorecida: 'curva',
      posturaPenalizada: 'sacrificial',
      moduladorCusto: -1,     // Via que redireciona — econômica
      mecanicaExclusiva: {
        id: 'leituraDePadrao',
        nome: 'Leitura de Padrão',
        descricao: 'Após usar Desviar com sucesso, a próxima ação contra o mesmo oponente ' +
          'na mesma troca recebe bônus (+1 degrau no dado ou +2 de ajuste fixo). ' +
          'Defender bem melhora o próximo ataque.',
        gatilho: 'desviarBemSucedido',
        impulsoRequerido: 'desviar',
        efeito: { bonusProximaAcao: { degrau: +1, ajusteFixo: +2 } },
      },
      descricao:
        'O corpo como espelho. Atacar primeiro é uma aposta desnecessária — o oponente ' +
        'sempre revela sua intenção antes do golpe, e o verdadeiro lutador ataca o erro, ' +
        'não o corpo. A Via do Eco é paciência transformada em arma: cada golpe recebido ' +
        'é informação, cada finta desmascarada é vantagem acumulada, cada troca sem revidar ' +
        'é um investimento no golpe perfeito que virá quando o oponente finalmente mostrar ' +
        'mais do que queria. Dizem que os mestres da Via do Eco não vencem lutas — eles ' +
        'esperam até que o oponente se derrote sozinho.',
      template: {
        romper:
          'O contra-golpe que ninguém viu sendo preparado — o Eco não ataca, ele responde. ' +
          'O punho viaja pelo caminho exato que o braço do oponente acabou de abrir ao se ' +
          'estender demais, e o impacto carrega a certeza de quem já sabia onde o buraco ' +
          'estava antes do golpe começar.',
        desviar:
          'O corpo acompanha o golpe como água que se abre para a pedra — não resiste, não ' +
          'bloqueia, apenas redireciona. A força do oponente passa pelo lugar onde o Eco ' +
          'estava um instante antes, e o momentum desperdiçado agora é dado de inteligência ' +
          'para o que vem a seguir.',
        prender:
          'Interceptação pura: o oponente estende o braço para golpear, e o Eco captura ' +
          'exatamente aquele braço, no exato momento em que está mais vulnerável — estendido, ' +
          'exposto, sem guarda. A pegada não é bruta; é cirúrgica no timing, revertendo a ' +
          'intenção ofensiva do oponente contra ele mesmo.',
        deslocar:
          'Um giro que acompanha o avanço do oponente — quando ele empurra, o Eco pivota ' +
          'ao redor do ponto de contato, usando o momentum alheio como motor de ' +
          'reposicionamento. O oponente avança para onde o Eco estava; o Eco já está atrás ' +
          'dele.',
        quebrarRitmo:
          'A imitação desconcertante — o Eco reproduz o início exato do golpe do oponente, ' +
          'um espelho tão perfeito que o adversário hesita, confuso sobre se está vendo a ' +
          'si mesmo ou ao inimigo. Nessa fração de segundo de dúvida, o ritmo se perde.',
      },
    },

    // ─────────────────────────────────────────────────
    // 4. VIA DO VENTO SOLTO — Mobilidade e Velocidade
    // ─────────────────────────────────────────────────
    ventoSolto: {
      nome: 'Via do Vento Solto',
      filosofia: 'Mobilidade e Velocidade',
      icone: '💨',
      dadoBase: 'd6',         // índice 1 — velocidade sobre potência
      alcance: 'curto',       // único com alcance além de toque — mobilidade dá range
      impulsoFavorecido: 'deslocar',
      impulsoPenalizado: 'prender',
      posturaFavorecida: 'alta',
      posturaPenalizada: 'baixa',
      moduladorCusto: 0,      // Via neutra
      mecanicaExclusiva: {
        id: 'passoFantasma',
        nome: 'Passo Fantasma',
        descricao: 'Ao usar Deslocar, pode fundir o deslocamento com outra ação ' +
          '(Romper enquanto se desloca, Desviar enquanto reposiciona) pelo custo ' +
          'combinado. O dano é reduzido (-1 degrau). Única Via que funde duas ações.',
        gatilho: 'declaracao',
        impulsoRequerido: 'deslocar',
        efeito: { fundirAcoes: true, penalDano: -1 },
      },
      descricao:
        'O corpo como corrente de ar — nunca onde deveria estar. A Via do Vento Solto ' +
        'não busca vencer trocando golpes, busca vencer não estando lá quando o golpe ' +
        'chega. O lutador se desloca constantemente, os pés tocam o chão como se pedissem ' +
        'desculpa por incomodar, e os golpes acontecem durante o movimento — nunca como ' +
        'ação separada. Os Elvarin das planícies dizem que lutar contra o Vento Solto é ' +
        'como tentar socar a chuva: cada gota escapa, e a próxima já está em outro lugar.',
      template: {
        romper:
          'O golpe acontece em pleno deslocamento — o corpo nunca para, nunca planta os ' +
          'pés, e o impacto nasce do momentum da passagem em vez da contração muscular ' +
          'estática. É mais rápido que qualquer soco de quem está parado, mas carrega menos ' +
          'peso — a troca de potência por velocidade que define o Vento Solto.',
        desviar:
          'Não desvia — já não está lá. O corpo se move antes do golpe chegar, não como ' +
          'reação, mas como antecipação pura. O oponente golpeia o espaço vazio e se ' +
          'desequilibra contra a própria inércia, enquanto o Vento Solto já está a dois ' +
          'passos na direção que ninguém esperava.',
        prender:
          'Agarrão de passagem — as mãos fecham brevemente ao redor do braço ou ombro do ' +
          'oponente, puxam, redirecionam, e soltam. Não é imobilização sustentada; é o ' +
          'segundo em que o Vento toca o adversário e o envia na direção errada antes de ' +
          'desaparecer novamente.',
        deslocar:
          'Deslocamento contínuo e fluido — nunca uma linha reta, sempre ângulos, curvas, ' +
          'mudanças de direção que fazem o oponente girar a cabeça tentando acompanhar. O ' +
          'Vento Solto não vai de A a B; ele vai de A a C passando por onde ninguém olhava.',
        quebrarRitmo:
          'Mudança abrupta de velocidade — o corpo que se movia como brisa de repente ' +
          'para. Ou o corpo parado de repente explode em direção inesperada. O contraste ' +
          'brutal entre velocidades rompe qualquer padrão que o oponente estivesse tentando ' +
          'ler.',
      },
    },

    // ─────────────────────────────────────────────────
    // 5. VIA DA CORRENTE — Agarrões e Imobilização
    // ─────────────────────────────────────────────────
    corrente: {
      nome: 'Via da Corrente',
      filosofia: 'Agarrões e Imobilização',
      icone: '⛓️',
      dadoBase: 'd8',         // índice 2 — equilibrado
      alcance: 'toque',
      impulsoFavorecido: 'prender',
      impulsoPenalizado: 'romper',
      posturaFavorecida: 'baixa',
      posturaPenalizada: 'alta',
      moduladorCusto: +1,     // Via que impõe — cara
      mecanicaExclusiva: {
        id: 'eloInquebravel',
        nome: 'Elo Inquebrantável',
        descricao: 'Enquanto Prender estiver mantido, qualquer tentativa do alvo de se ' +
          'libertar custa Sopro extra para O ALVO (não para o lutador). A Corrente ' +
          'transforma o recurso do oponente em custo de fuga.',
        gatilho: 'prenderMantido',
        impulsoRequerido: 'prender',
        efeito: { custoFugaExtra: +2 },
      },
      descricao:
        'O corpo como corda e âncora. A Via da Corrente não busca ferir, busca possuir ' +
        'a luta — tirar do oponente a opção de decidir o que acontece a seguir. Cada ' +
        'pegada é um elo, cada elo é mais difícil de romper do que o anterior, e o ' +
        'oponente descobre que entrou na luta da Corrente sem perceber — e que sair é ' +
        'mais caro do que continuar. Os Grotans do leste praticam esta Via nas minas, ' +
        'onde a luta sempre acontece em espaço estreito e derrubar o oponente é mais ' +
        'útil do que feri-lo.',
      template: {
        romper:
          'Golpe curto de dentro da clinch — o espaço entre os dois corpos é tão pequeno ' +
          'que a potência vem da rotação do quadril, não da extensão do braço. A Corrente ' +
          'golpeia de perto, usando a proximidade como arma — onde outro lutador precisaria ' +
          'de distância, a Corrente precisa de contato.',
        desviar:
          'Desvia enganchando — o braço do oponente é capturado no arco da defesa, e o ' +
          'bloqueio se transforma em pegada no mesmo movimento. O que começa como proteção ' +
          'termina como armadilha. A diferença entre desviar e prender, na Via da Corrente, ' +
          'é apenas questão de intenção.',
        prender:
          'Envolvimento total — os braços se enroscam ao redor do torso, das pernas, do ' +
          'pescoço do oponente como cobra constritora. Cada tentativa de fuga aperta o ' +
          'laço, cada segundo de resistência gasta o Sopro do adversário. A Corrente não ' +
          'precisa machucar — precisa que o oponente entenda que já perdeu.',
        deslocar:
          'Arrasta para dentro — o oponente que tentava manter distância é puxado, não ' +
          'empurrado. A Corrente quer proximidade, precisa de contato, e cada Deslocar é ' +
          'uma redução do espaço entre os dois corpos até que não haja espaço nenhum.',
        quebrarRitmo:
          'Puxão ou empurrão inesperado durante a clinch — o equilíbrio do oponente se ' +
          'parte quando o corpo que o segurava de repente muda de direção. Não é uma finta ' +
          'visual; é uma finta tátil, sentida nos músculos e tendões antes de ser ' +
          'compreendida pela mente.',
      },
    },

    // ─────────────────────────────────────────────────
    // 6. VIA DA PEDRA FIRME — Equilíbrio e Disciplina
    // ─────────────────────────────────────────────────
    pedraFirme: {
      nome: 'Via da Pedra Firme',
      filosofia: 'Equilíbrio e Disciplina',
      icone: '🪨',
      dadoBase: 'd8',         // índice 2 — equilibrado
      alcance: 'toque',
      impulsoFavorecido: 'desviar',
      impulsoPenalizado: 'romper',
      posturaFavorecida: 'baixa',
      posturaPenalizada: 'alta',
      moduladorCusto: -1,     // Via que redireciona — econômica
      mecanicaExclusiva: {
        id: 'raizInabalavel',
        nome: 'Raiz Inabalável',
        descricao: 'Em Postura Baixa, imune a efeitos de deslocamento forçado (empurrão, ' +
          'projeção, derrubada). A Pedra Firme não sai de onde escolheu estar.',
        gatilho: 'posturaBaixa',
        posturaRequerida: 'baixa',
        efeito: { imuneDeslocamento: true },
      },
      descricao:
        'O corpo como fundação. A Via da Pedra Firme não é ofensiva nem evasiva — é a ' +
        'Via da negação. Ganha ao não perder o centro, absorvendo cada golpe como rocha ' +
        'absorve a chuva, e redirecionando a energia acumulada até o colapso natural do ' +
        'adversário. A montanha nunca ataca — a montanha apenas está, e tudo que a golpeia ' +
        'se quebra. Os Durkan da Ordem Interna praticam esta Via como meditação de ' +
        'combate, e seus mestres dizem que a vitória não é um evento — é uma condição ' +
        'que já existia antes da luta começar.',
      template: {
        romper:
          'Devolução de força absorvida — o golpe não nasce da vontade do lutador, nasce ' +
          'da energia que o oponente depositou nele ao longo da troca. É como devolver ' +
          'uma bola arremessada: a Pedra não precisa gerar momentum próprio quando o ' +
          'adversário já forneceu tanto.',
        desviar:
          'Recebe o golpe no centro do corpo, pés firmes no chão como raízes que ' +
          'perfuraram a pedra. O impacto estala, reverberando pelo torso e se dissipando ' +
          'pelos quadris até as solas dos pés que o devolvem ao chão. O lutador não se ' +
          'moveu. Nem pretende.',
        prender:
          'Enraíza o oponente contra o chão — não com força bruta, mas com gravidade e ' +
          'peso posicional. A Pedra Firme prende descendo, não apertando: derruba e se ' +
          'posiciona por cima com o centro de gravidade tão baixo que levantar o lutador ' +
          'seria como tentar erguer o chão.',
        deslocar:
          'Quando o oponente empurra, a Pedra endurece. Quando puxa, a Pedra avança com ' +
          'peso inercial que não pode ser detido por pura força muscular. O Deslocar da ' +
          'Pedra Firme não é rápido — é inevitável.',
        quebrarRitmo:
          'Simplesmente não reage. O oponente ataca, e a Pedra olha. O oponente finta, e ' +
          'a Pedra olha. A inação deliberada quebra o ritmo de quem esperava resistência — ' +
          'lutar contra quem não luta é como socar o vazio, e o vazio nunca se cansa.',
      },
    },
  },


  // ===========================================================
  // CAMADA 2 — OS 5 IMPULSOS (equivalente a verbos{} de magias.js)
  // ===========================================================
  // Cada Impulso define:
  //   nome        → nome de exibição
  //   pesoBase    → 'leve' | 'medio' | 'pesado'
  //   custoBase   → valor numérico base de Sopro
  //   intencao    → 'ofensivo' | 'defensivo' | 'controle' | 'utilidade'
  //   multiplicadorDados → escala quantidade de dados por nível de Sopro
  //   descricao   → texto de lore
  //
  // Os templates narrativos por Via estão dentro de cada Via
  // (via.template[impulsoId]), espelhando o padrão de magias.js
  // onde verbo.template[aspectoId] fica dentro de cada Verbo.
  //
  // NENHUM Impulso decide identidade (job da Via).
  // NENHUM Impulso decide forma (job da Postura).
  // ===========================================================
  impulsos: {

    romper: {
      nome: 'Romper',
      pesoBase: 'medio',
      custoBase: 2,
      intencao: 'ofensivo',
      multiplicadorDados: 1.0,
      descricao:
        'Golpear para causar dano direto — soco, chute, cotovelada, joelhada, cabeçada. ' +
        'O Impulso mais instintivo: o corpo que decide que o outro corpo precisa parar de ' +
        'funcionar. Não importa a Via, não importa a Postura — quando o lutador declara ' +
        'Romper, ele está dizendo ao universo que a dor é a mensagem.',
    },

    desviar: {
      nome: 'Desviar',
      pesoBase: 'leve',
      custoBase: 1,
      intencao: 'defensivo',
      multiplicadorDados: 0,     // Desviar não rola dado de dano
      descricao:
        'Negar o golpe do oponente — esquiva, bloqueio, redirecionamento. O Impulso mais ' +
        'econômico do sistema, porque gastar menos energia para anular o golpe do que o ' +
        'oponente gastou para desferí-lo é a forma mais pura de vitória por atrito.',
    },

    prender: {
      nome: 'Prender',
      pesoBase: 'pesado',
      custoBase: 3,
      intencao: 'controle',
      multiplicadorDados: 0.5,   // dados representam intensidade do controle, não dano
      descricao:
        'Restringir o movimento do oponente — agarrão, chave, imobilização. O Impulso ' +
        'mais caro porque exige sustentar controle contínuo sobre outro corpo, não um ' +
        'golpe pontual. Prender não termina quando o lutador solta — termina quando o ' +
        'oponente aceita.',
    },

    deslocar: {
      nome: 'Deslocar',
      pesoBase: 'medio',
      custoBase: 2,
      intencao: 'utilidade',
      multiplicadorDados: 0,     // Deslocar não causa dano direto
      descricao:
        'Mover a si mesmo ou ao oponente no espaço — arrasto, projeção, avanço, ' +
        'reposicionamento. O Impulso do tabuleiro: não muda o HP de ninguém, mas muda ' +
        'onde cada peça está. Em combate real, posição frequentemente importa mais que ' +
        'dano.',
    },

    quebrarRitmo: {
      nome: 'Quebrar Ritmo',
      pesoBase: 'leve',
      custoBase: 1,
      intencao: 'utilidade',
      multiplicadorDados: 0,     // sem dano direto
      descricao:
        'Interromper a ação do oponente sem dano direto — finta, interrupção, ' +
        'desequilíbrio psicológico. O Impulso mais sutil: não machuca o corpo, ' +
        'machuca o plano. O oponente que perde o ritmo precisa gastar um instante ' +
        'para recalcular, e nesse instante qualquer coisa pode acontecer.',
    },
  },


  // ===========================================================
  // CAMADA 3 — AS 8 POSTURAS (equivalente a modificadores{} de magias.js)
  // ===========================================================
  // Compartilhadas sem alteração com o Combate com Armas.
  // combateArmado.js referencia esta tabela diretamente:
  //   posturas: sistemaCombateDesarmado.posturas
  //
  // Cada Postura define:
  //   nome       → nome de exibição
  //   custoExtra → ajuste fixo de custo (Sopro)
  //   ajustes    → modificadores mecânicos (ajDano, ajDefesa, etc.)
  //   descricao  → texto narrativo por intenção
  //   template   → fragmento narrativo para montagem da técnica
  //
  // NENHUMA Postura decide identidade (job da Via).
  // NENHUMA Postura decide ação (job do Impulso).
  // ===========================================================
  posturas: {

    cheia: {
      nome: 'Cheia',
      custoExtra: +2,
      ajustes: { ajDano: +2, ajDefesa: -2 },
      descricao: {
        ofensivo:
          'O corpo abandona toda pretensão defensiva e despeja cada grama de peso, cada ' +
          'fibra de músculo, cada grão de Sopro numa única intenção. Se acertar, o combate ' +
          'pode terminar ali. Se errar, o lutador está nu.',
        defensivo:
          'A guarda se fecha como portão de ferro — pesada, lenta de abrir, mas quase ' +
          'impossível de perfurar enquanto estiver mantida. Tudo sacrificado em troca de ' +
          'não ceder um centímetro.',
      },
      template:
        'O corpo se compromete por inteiro — não há reserva, não há segunda opção. ' +
        'Cada músculo contraído é uma promessa de que este instante vale todo o custo.',
    },

    vazia: {
      nome: 'Vazia',
      custoExtra: -1,
      ajustes: { ajDano: -1, ajDefesa: +1 },
      descricao: {
        ofensivo:
          'O golpe sai, mas a guarda não cai. O corpo oferece setenta por cento do que ' +
          'poderia dar — os outros trinta são a promessa silenciosa de que haverá um ' +
          'próximo golpe.',
        defensivo:
          'A guarda relaxada engana — parece desprotegida, mas os braços e pernas estão ' +
          'em posição de reagir a qualquer direção. Eficiência sobre rigidez.',
      },
      template:
        'Contenção disciplinada — o corpo se retém de propósito, guardando reserva ' +
        'para o que vier depois. Quem luta em Postura Vazia luta pensando no golpe ' +
        'seguinte, não no atual.',
    },

    baixa: {
      nome: 'Baixa',
      custoExtra: 0,
      ajustes: { ajDano: 0, ajDefesa: +1, ajEquilibrio: +2 },
      descricao: {
        ofensivo:
          'O centro de gravidade desce e planta raízes. Os golpes vêm de baixo para cima ' +
          'com toda a alavancagem do chão. Quem tenta derrubar um lutador em Postura Baixa ' +
          'precisa primeiro mover o chão em que ele pisa.',
        defensivo:
          'Joelhos flexionados, pés largos, peso distribuído como alicerce. Cada golpe ' +
          'recebido se dissipa pela estrutura inteira.',
      },
      template:
        'O corpo desce, se enraíza, se torna fundação. Tudo que vem de cima se ' +
        'dissipa na estrutura; tudo que vem de lado encontra uma base larga demais ' +
        'para deslocar.',
    },

    alta: {
      nome: 'Alta',
      custoExtra: 0,
      ajustes: { ajDano: 0, ajDefesa: -1, ajAlcance: +1 },
      descricao: {
        ofensivo:
          'O corpo se estende, ganha centímetros de alcance. Chutes altos, cotoveladas ' +
          'descendentes, joelhadas que sobem verticalmente — o eixo do combate vira ' +
          'vertical. Elegante e letal, mas quem se ergue tanto tem mais longe para cair.',
        defensivo:
          'A guarda alta cobre cabeça e tronco superior, pagando o preço de expor as ' +
          'pernas e o centro de equilíbrio.',
      },
      template:
        'O corpo se ergue, ganha alcance e verticalidade — o eixo do combate deixa ' +
        'de ser horizontal. Elegância e perigo coexistem no mesmo movimento.',
    },

    curva: {
      nome: 'Curva',
      custoExtra: -1,
      ajustes: { ajDano: 0, ajDefesa: 0, ajRedirecionamento: +2 },
      descricao: {
        ofensivo:
          'O corpo não resiste à força do oponente — ele a acolhe, gira, e devolve. ' +
          'Quanto mais duro o oponente ataca, mais a Postura Curva tem com o que ' +
          'trabalhar.',
        defensivo:
          'A guarda flui como água — nunca rígida, nunca no mesmo lugar por mais de ' +
          'um instante. Golpes que deveriam conectar escorregam pela superfície curva ' +
          'do movimento.',
      },
      template:
        'O corpo segue arcos e espirais — nunca linhas retas. A força do oponente ' +
        'não é resistida, é absorvida e devolvida por um caminho que ele não esperava.',
    },

    reta: {
      nome: 'Reta',
      custoExtra: 0,
      ajustes: { ajDano: +1, ajDefesa: 0 },
      descricao: {
        ofensivo:
          'Sem floreio, sem arco, sem giro. O caminho mais curto entre os dois corpos. ' +
          'O que a Postura Reta perde em surpresa, ganha em velocidade pura.',
        defensivo:
          'A defesa encontra o ataque de frente, no mesmo eixo. Bloquear e bater — a ' +
          'Postura Reta faz as duas coisas na mesma linha.',
      },
      template:
        'Linha reta, caminho mais curto. O oponente pode ver o golpe vindo, mas ver ' +
        'e reagir a tempo são coisas diferentes.',
    },

    silenciosa: {
      nome: 'Silenciosa',
      custoExtra: -1,
      ajustes: { ajDano: -1, ajDefesa: 0, ajSurpresa: +2 },
      descricao: {
        ofensivo:
          'O golpe não anuncia sua vinda. O corpo não contrai antes de expandir, não ' +
          'telegrata a direção. O oponente sente o impacto antes de ver o movimento.',
        defensivo:
          'A guarda não revela o que protege. Braços aparentemente relaxados escondem ' +
          'uma intenção defensiva já calculada.',
      },
      template:
        'Intenção escondida — o corpo mente sobre o que está prestes a fazer. Quando ' +
        'o oponente descobre, já é memória.',
    },

    sacrificial: {
      nome: 'Sacrificial',
      custoExtra: +2,
      ajustes: { ajDano: +3, ajDefesa: -3 },
      descricao: {
        ofensivo:
          'A guarda cai. De propósito. O corpo se oferece ao golpe do oponente em troca ' +
          'de uma certeza: que o próprio golpe vai conectar. Os melhores lutadores usam ' +
          'Postura Sacrificial uma vez por cena. Os que usam duas vezes não precisam de ' +
          'uma terceira.',
        defensivo:
          'O corpo se interpõe entre o golpe e outra pessoa, aceitando receber o que ' +
          'o aliado não poderia aguentar. Proteção pelo preço mais alto.',
      },
      template:
        'Abertura deliberada — a guarda cai como cortina que se abre para o ato final. ' +
        'O que está por trás da cortina é a certeza do golpe que não pode ser parado, ' +
        'mesmo que o preço seja sangrar primeiro.',
    },
  },


  // ===========================================================
  // MOTOR — calcularCusto()
  // ===========================================================
  // Três camadas encadeáveis (espelha calcularCusto de magias.js):
  //   1. Peso base do Impulso (custoBase)
  //   2. Modulador de Postura (custoExtra)
  //   3. Modulador de Via (moduladorCusto)
  //   × Multiplicador de nível de Sopro
  //
  // Piso mínimo: 0 (nenhuma combinação tem custo negativo).
  //
  // Nota de balanceamento: as combinações mais baratas (custo 0)
  // são sempre defensivas/utilitárias, nunca ofensivas+devastadoras.
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
  // MOTOR — resolverDado()
  // ===========================================================
  // Determina o dado final da técnica, considerando:
  //   - dadoBase da Via (identidade)
  //   - ajDano da Postura (forma)
  //   - Piso/Teto de Vidro (amortecimento nas pontas)
  //
  // Espelha resolverDadoManifestacao() de magias.js.
  // ===========================================================
  resolverDado(viaId, impulsoId, posturaId) {
    const via = this.vias[viaId];
    const impulso = this.impulsos[impulsoId];
    const postura = this.posturas[posturaId];
    if (!via || !impulso || !postura) return null;

    // Impulsos sem dado de dano (Desviar, Deslocar, Quebrar Ritmo)
    if (impulso.multiplicadorDados === 0) {
      return { dado: null, indiceFinal: null, bonusFixo: 0, bonusFlatExtra: 0, semDano: true };
    }

    // Encontrar índice do dado base da Via na escada
    const indiceBase = this.escadaDados.indexOf(via.dadoBase);
    if (indiceBase === -1) return null;

    // Ajuste pelo ajDano da Postura (convertido em degraus: cada +2 = +1 degrau)
    const ajusteDegrau = Math.floor((postura.ajustes.ajDano || 0) / 2);

    // Aplicar ajuste com proteção Piso/Teto de Vidro
    return this.ajustarDegrau(indiceBase, ajusteDegrau);
  },


  // ===========================================================
  // MOTOR — resolverFriccao()
  // ===========================================================
  // Calcula a fricção entre Via, Impulso e Postura.
  // Fricção positiva = sinergia (bônus narrativo/mecânico)
  // Fricção negativa = atrito (penalidade/custo extra)
  //
  // Espelha a interação Aspecto×Verbo×Modificador de magias.js.
  // ===========================================================
  resolverFriccao(viaId, impulsoId, posturaId) {
    const via = this.vias[viaId];
    const postura = this.posturas[posturaId];
    if (!via || !postura) return { friccaoViaImpulso: 'neutra', friccaoViaPostura: 'neutra', tags: [] };

    const tags = [];

    // Fricção Via × Impulso
    let friccaoViaImpulso = 'neutra';
    if (via.impulsoFavorecido === impulsoId) {
      friccaoViaImpulso = 'favoravel';
      tags.push(`${via.nome}: ${this.impulsos[impulsoId].nome} é impulso favorecido (+1 dado bônus)`);
    } else if (via.impulsoPenalizado === impulsoId) {
      friccaoViaImpulso = 'desfavoravel';
      tags.push(`${via.nome}: ${this.impulsos[impulsoId].nome} é impulso penalizado (+1 Sopro extra)`);
    }

    // Fricção Via × Postura
    let friccaoViaPostura = 'neutra';
    if (via.posturaFavorecida === posturaId) {
      friccaoViaPostura = 'favoravel';
      tags.push(`${via.nome}: Postura ${postura.nome} é favorecida (efeito aprimorado)`);
    } else if (via.posturaPenalizada === posturaId) {
      friccaoViaPostura = 'desfavoravel';
      tags.push(`${via.nome}: Postura ${postura.nome} é penalizada (+1 Sopro extra)`);
    }

    return { friccaoViaImpulso, friccaoViaPostura, tags };
  },


  // ===========================================================
  // MOTOR — resolverMecanicaExclusiva()
  // ===========================================================
  // Verifica se a combinação ativa a mecânica exclusiva da Via.
  // Retorna o efeito se ativo, null se não.
  //
  // Camada de elegibilidade separada do motor de geração
  // (mesmo princípio de resolverElegibilidade de magias.js).
  // ===========================================================
  resolverMecanicaExclusiva(viaId, impulsoId, posturaId, contexto = {}) {
    const via = this.vias[viaId];
    if (!via || !via.mecanicaExclusiva) return null;

    const mec = via.mecanicaExclusiva;

    // Verificar se o impulso requerido é o que está sendo usado
    if (mec.impulsoRequerido && mec.impulsoRequerido !== impulsoId) return null;

    // Verificar se a postura requerida é a que está sendo usada
    if (mec.posturaRequerida && mec.posturaRequerida !== posturaId) return null;

    // Verificar gatilhos contextuais
    switch (mec.gatilho) {
      case 'acertoCritico':
        // Só ativa em acerto crítico — sinalizado pelo contexto da cena
        return {
          ativo: true,
          condicional: true,
          condicao: 'Ativa em acerto crítico',
          nome: mec.nome,
          descricao: mec.descricao,
          efeito: mec.efeito,
        };

      case 'desviarBemSucedido':
        // Só ativa após Desviar com sucesso — sinalizado pelo contexto
        return {
          ativo: true,
          condicional: true,
          condicao: 'Ativa após Desviar com sucesso contra este oponente',
          nome: mec.nome,
          descricao: mec.descricao,
          efeito: mec.efeito,
        };

      case 'prenderMantido':
        // Ativa enquanto Prender estiver sendo mantido
        return {
          ativo: true,
          condicional: true,
          condicao: 'Ativa enquanto Prender estiver mantido',
          nome: mec.nome,
          descricao: mec.descricao,
          efeito: mec.efeito,
        };

      case 'posturaBaixa':
        // Ativa quando a postura é Baixa
        if (posturaId === 'baixa') {
          return {
            ativo: true,
            condicional: false,
            nome: mec.nome,
            descricao: mec.descricao,
            efeito: mec.efeito,
          };
        }
        return null;

      case 'declaracao':
        // Sempre disponível — o jogador declara na hora
        return {
          ativo: true,
          condicional: false,
          nome: mec.nome,
          descricao: mec.descricao,
          efeito: mec.efeito,
        };

      default:
        return null;
    }
  },


  // ===========================================================
  // FUNÇÃO DE GERAÇÃO FINAL — gerarTecnica()
  // ===========================================================
  // Espelha 1:1 a estrutura de gerarMagia() de magias.js.
  //
  // Passos:
  //   1. Validação e lookup
  //   2. Resolução de custo (3 camadas + Sopro)
  //   3. Resolução de dado (Via base + ajuste de Postura + Piso/Teto)
  //   4. Resolução de fricção (Via×Impulso, Via×Postura)
  //   5. Resolução de mecânica exclusiva
  //   6. Montagem de tags
  //   7. Montagem de template narrativo (concatenação de fragmentos)
  //   8. Retorno do objeto de técnica completo
  // ===========================================================
  gerarTecnica(viaId, impulsoId, posturaId, nivelSopro = 'sustentado', options = {}) {

    // ── 1. Validação e lookup ──────────────────────────────────────────────
    const via = this.vias[viaId];
    const impulso = this.impulsos[impulsoId];
    const postura = this.posturas[posturaId];
    const sopro = this.niveisSopro[nivelSopro];

    if (!via || !impulso || !postura || !sopro) {
      return {
        erro: 'Combinação inválida: via, impulso ou postura não encontrado.',
        tags: [],
      };
    }

    // ── 2. Resolução de custo ──────────────────────────────────────────────
    const custoBase = this.calcularCusto(viaId, impulsoId, posturaId, nivelSopro);

    // Ajuste de fricção no custo (penalizações adicionam +1 Sopro cada)
    const friccao = this.resolverFriccao(viaId, impulsoId, posturaId);
    let custoFinal = custoBase;
    if (friccao.friccaoViaImpulso === 'desfavoravel') custoFinal += 1;
    if (friccao.friccaoViaPostura === 'desfavoravel') custoFinal += 1;

    // ── 3. Resolução de dado ───────────────────────────────────────────────
    const dadoFinal = this.resolverDado(viaId, impulsoId, posturaId);

    // Quantidade de dados (baseado no multiplicador do Impulso × nível Sopro)
    let quantidadeDados = null;
    if (dadoFinal && !dadoFinal.semDano) {
      const qtdBase = Math.max(1, Math.round(impulso.multiplicadorDados * sopro.multiplicadorEfeito));
      // Bônus de fricção favorável Via×Impulso: +1 dado
      quantidadeDados = friccao.friccaoViaImpulso === 'favoravel' ? qtdBase + 1 : qtdBase;
    }

    // ── 4. Resolução de mecânica exclusiva ─────────────────────────────────
    const mecanica = this.resolverMecanicaExclusiva(viaId, impulsoId, posturaId, options);

    // ── 5. Resolução de intenção ───────────────────────────────────────────
    const intencao = impulso.intencao || 'ofensivo';
    const descricaoPostura =
      (typeof postura.descricao === 'object' && postura.descricao !== null)
        ? (postura.descricao[intencao] || postura.descricao.ofensivo || '')
        : (postura.descricao || '');

    // ── 6. Montagem de tags ────────────────────────────────────────────────
    const tagsBase = [
      via.filosofia,
      impulso.nome,
      postura.nome,
      `Custo: ${custoFinal} Sopro`,
      `Nível: ${sopro.nome}`,
    ];

    // Tag de dado
    const tagsDado = [];
    if (dadoFinal && !dadoFinal.semDano && quantidadeDados) {
      let descricaoDado = `Dado: ${quantidadeDados}${dadoFinal.dado}`;
      if (dadoFinal.bonusFixo) descricaoDado += ` +${dadoFinal.bonusFixo}`;
      if (dadoFinal.bonusFlatExtra) {
        descricaoDado += ` (+${dadoFinal.bonusFlatExtra} Dano Fixo/Teto de Vidro)`;
      }
      tagsDado.push(descricaoDado);
    }

    // Tags de ajustes mecânicos
    const tagsMecanicos = [];
    if (postura.ajustes.ajDefesa) {
      const sinal = postura.ajustes.ajDefesa > 0 ? '+' : '';
      tagsMecanicos.push(`Defesa: ${sinal}${postura.ajustes.ajDefesa}`);
    }
    if (postura.ajustes.ajEquilibrio) {
      tagsMecanicos.push(`Equilíbrio: +${postura.ajustes.ajEquilibrio}`);
    }
    if (postura.ajustes.ajAlcance) {
      tagsMecanicos.push(`Alcance: +${postura.ajustes.ajAlcance}`);
    }
    if (postura.ajustes.ajRedirecionamento) {
      tagsMecanicos.push(`Redirecionamento: +${postura.ajustes.ajRedirecionamento}`);
    }
    if (postura.ajustes.ajSurpresa) {
      tagsMecanicos.push(`Surpresa: +${postura.ajustes.ajSurpresa}`);
    }

    // Tags de mecânica exclusiva
    const tagsMecanica = [];
    if (mecanica) {
      const tagMec = mecanica.condicional
        ? `${mecanica.nome} (${mecanica.condicao})`
        : mecanica.nome;
      tagsMecanica.push(tagMec);
    }

    const tags = [
      ...tagsBase,
      ...tagsDado,
      ...tagsMecanicos,
      ...friccao.tags,
      ...tagsMecanica,
    ].filter(Boolean);

    // ── 7. Montagem de template narrativo ──────────────────────────────────
    // Concatenação de fragmentos, como descricaoFinal em gerarMagia —
    // nunca texto único por combinação. Fragmentos:
    //   1. Template da Via para este Impulso
    //   2. Template da Postura
    //   3. Descrição da mecânica exclusiva (se ativa)
    const templateVia = via.template[impulsoId] || '';
    const templatePostura = postura.template || '';
    const templateMecanica = mecanica ? mecanica.descricao : '';

    const descricaoFinal = [templateVia, templatePostura, templateMecanica]
      .filter(Boolean)
      .join('\n\n');

    // ── 8. Retorno do objeto de técnica completo ───────────────────────────
    return {
      // Identificação
      nomeVia:        via.nome,
      nomeImpulso:    impulso.nome,
      nomePostura:    postura.nome,
      filosofia:      via.filosofia,
      icone:          via.icone,

      // Mecânica
      nivelSopro:       sopro.nome,
      custoFinal,
      intencaoImpulso:  intencao,
      tags,

      // Dado resolvido
      dadoResolvido:    dadoFinal && !dadoFinal.semDano ? dadoFinal.dado : null,
      bonusFixoDado:    dadoFinal ? (dadoFinal.bonusFixo || 0) : 0,
      bonusFlatPorTeto: dadoFinal ? (dadoFinal.bonusFlatExtra || 0) : 0,
      quantidadeDados,
      tipoRolagem:      (() => {
        if (!dadoFinal || dadoFinal.semDano || !quantidadeDados) return null;
        return intencao === 'defensivo' ? 'absorção' : 'dano';
      })(),

      // Fricção
      friccaoViaImpulso: friccao.friccaoViaImpulso,
      friccaoViaPostura: friccao.friccaoViaPostura,

      // Mecânica exclusiva
      mecanicaExclusiva: mecanica ? {
        nome: mecanica.nome,
        ativo: mecanica.ativo,
        condicional: mecanica.condicional,
        condicao: mecanica.condicao || null,
        efeito: mecanica.efeito,
      } : null,

      // Ajustes da Postura (para resolução na mesa)
      ajustes: { ...postura.ajustes },

      // Lore
      descricaoVia:      via.descricao,
      descricaoImpulso:  impulso.descricao,
      descricaoPostura:  descricaoPostura,

      // Texto final combinado (fragmentos concatenados, como gerarMagia)
      descricaoFinal,
    };
  },


  // ===========================================================
  // ALIASES DE RETROCOMPATIBILIDADE
  // ===========================================================
  gerarTecnicaSegura(viaId, impulsoId, posturaId, nivelSopro, options = {}) {
    return this.gerarTecnica(viaId, impulsoId, posturaId, nivelSopro, options);
  },

};

// Exportação para uso em módulos ES6 e compatibilidade com scripts tradicionais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sistemaCombateDesarmado;
}
