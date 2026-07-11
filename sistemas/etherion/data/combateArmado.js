// =============================================================
// BANCO DE DADOS COMBINATÓRIO DE COMBATE COM ARMAS — AETHERION
// =============================================================
// Sistema modular de 4 camadas:
//   Categoria (8) × Ação (5) × Postura (8) × Especialização (16, opcional)
//
// Cada combinação gera uma técnica armada única. O tom narrativo
// reflete a fantasia sombria e a mitologia de Aetherion.
//
// Exporta o objeto `sistemaCombateArmado` com:
//   - categorias{}       → 8 identidades marciais de arma
//   - acoes{}            → 5 ações fundamentais (= Impulsos do desarmado)
//   - posturas{}         → 8 posturas (importadas de combateDesarmado.js)
//   - especializacoes{}  → 16 refinamentos opcionais (2 por categoria)
//   - niveisSopro{}      → 3 níveis de comprometimento
//
// Arquitetura espelha 1:1 o padrão de magias.js:
//   Categoria = Aspecto (identidade + traços de escala)
//   Ação = Verbo (ação + peso + custo base)
//   Postura = Modificador (forma + ajuste de custo) — COMPARTILHADA
//   Especialização = Manifestação (refinamento opcional)
//   Sopro = Círculo (recurso compartilhado com magia E desarmado)
//
// O Sopro é o MESMO recurso da magia e do combate desarmado.
// Os três sistemas competem pela mesma fonte num único pool por cena.
//
// NOTA DE BALANCEAMENTO:
//   "Nenhuma combinação deve ser barata E devastadora ao mesmo tempo."
//   Uma espada não é um machado com números diferentes.
//   Cada categoria faz algo que as outras estruturalmente não fazem.
// =============================================================

const sistemaCombateArmado = {

  // ===========================================================
  // MOTOR DE CURVAS — Reaproveitado 1:1 de sistemaMagia.curvas
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
  // ===========================================================
  escadaDados: ['d4', 'd6', 'd8', 'd10', 'd12'],

  ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal = 0) {
    const indiceBruto = indiceBase + alteracao;
    let bonusFixo = bonusFixoOriginal;
    let bonusFlatExtra = 0;

    if (indiceBruto < 0) {
      bonusFixo = Math.floor(bonusFixoOriginal / 2);
      return { dado: this.escadaDados[0], indiceFinal: 0, bonusFixo, bonusFlatExtra };
    }

    if (indiceBruto > this.escadaDados.length - 1) {
      const excedente = indiceBruto - (this.escadaDados.length - 1);
      bonusFlatExtra = excedente * 2;
      return { dado: this.escadaDados[this.escadaDados.length - 1], indiceFinal: this.escadaDados.length - 1, bonusFixo, bonusFlatExtra };
    }

    return { dado: this.escadaDados[indiceBruto], indiceFinal: indiceBruto, bonusFixo, bonusFlatExtra };
  },

  // ===========================================================
  // ETIQUETAS QUALITATIVAS
  // ===========================================================
  etiquetas: {
    alcance:       ['Toque', 'Curto', 'Médio', 'Longo'],
    intensidade:   ['Leve', 'Moderada', 'Forte', 'Devastadora', 'Letal'],
    custoRelativo: ['Gratuito', 'Barato', 'Moderado', 'Caro', 'Proibitivo'],
    desgaste:      ['Nenhum', 'Leve', 'Moderado', 'Severo'],
  },

  resolverEtiqueta(tipo, valorBruto) {
    const tabela = this.etiquetas[tipo];
    if (!tabela) return 'Desconhecido';
    const index = Math.min(Math.floor(valorBruto / 2.5), tabela.length - 1);
    return tabela[Math.max(0, index)];
  },

  // ===========================================================
  // NÍVEIS DE SOPRO — idênticos ao combate desarmado
  // ===========================================================
  niveisSopro: {
    curto: {
      nome: 'Sopro Curto',
      descricao: 'Ação rápida, baixo risco — testar o oponente sem se expor.',
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
      descricao: 'Comprometimento total — maior efeito, exposição real se falhar.',
      multiplicadorCusto: 2,
      multiplicadorEfeito: 2,
    },
  },


  // ===========================================================
  // CAMADA 1 — AS 8 CATEGORIAS DE ARMA (equivalente a aspectos{})
  // ===========================================================
  // Cada Categoria define:
  //   nome / filosofia / icone    → identidade visual e temática
  //   dadoBase / alcance          → traços mecânicos fundamentais
  //   acaoFavorecida / penalizada → fricção Categoria×Ação
  //   posturaFavorecida / penalizada → fricção Categoria×Postura
  //   moduladorCusto             → ajuste fixo de Sopro por identidade
  //   mecanicaExclusiva          → efeito que NENHUMA outra Categoria reproduz
  //   evolucao[]                 → progressão narrativa da arma
  //   descricao                  → texto de lore
  //   template{}                 → fragmentos narrativos por Ação
  //
  // Régua de design: nenhuma categoria pode ser "outra com números
  // diferentes". Espadas não são Machados leves. Machados não são
  // Martelos cortantes.
  // ===========================================================
  categorias: {

    // ─────────────────────────────────────────────────
    // 1. ESPADAS — Versatilidade Disciplinada
    // ─────────────────────────────────────────────────
    espadas: {
      nome: 'Espadas',
      filosofia: 'Versatilidade Disciplinada',
      icone: '🗡️',
      dadoBase: 'd8',
      alcance: 'curto',
      acaoFavorecida: 'desviar',
      acaoPenalizada: null,          // nenhuma — sem penalidade
      posturaFavorecida: null,       // todas — sem penalidade em nenhuma
      posturaPenalizada: null,
      moduladorCusto: 0,             // econômica
      mecanicaExclusiva: {
        id: 'fluidezDeGuarda',
        nome: 'Fluidez de Guarda',
        descricao: 'Trocar de Postura em pleno combate não custa Sopro extra. ' +
          'Toda outra categoria paga sobretaxa para mudar de Postura no meio de ' +
          'uma troca de golpes — a espada não.',
        gatilho: 'trocaPostura',
        efeito: { custoTrocaPostura: 0 },
      },
      evolucao: [
        { nome: 'Espada Curta', tier: 1, descricao: 'Golpe único, resposta rápida.' },
        { nome: 'Espada Longa', tier: 2, descricao: 'Domínio de ritmo e distância.' },
        { nome: 'Espadas Gêmeas', tier: 3, descricao: 'Dois gumes lendo o oponente em tempo real.' },
      ],
      descricao:
        'A arma do meio-termo deliberado. Não é a mais forte em nenhum eixo, e essa é ' +
        'exatamente a vantagem — nunca há uma situação em que a espada seja a escolha ' +
        'estruturalmente errada. A lâmina equilibra corte e ponta, ataque e defesa, ' +
        'velocidade e peso. Os mestres de espada não dominam uma técnica — dominam a ' +
        'transição entre todas. A progressão de uma espadachim é sempre sobre refinar ' +
        'o timing, nunca sobre aumentar a força bruta.',
      template: {
        romper:
          'A lâmina descreve um arco limpo — nem largo demais como o machado, nem curto ' +
          'demais como a adaga. O golpe de espada é a promessa de competência: não é o ' +
          'mais devastador, mas é o que chega onde deveria chegar, quando deveria chegar.',
        desviar:
          'A guarda se ergue e a lâmina encontra a lâmina com o estalo metálico que é ' +
          'a assinatura da espada. O desvio é natural, quase instintivo — a geometria ' +
          'da espada foi desenhada para isto tanto quanto para atacar. Nenhuma outra ' +
          'arma desvia tão barato.',
        prender:
          'A guarda cruzada captura a lâmina do oponente, ou o cabo se engancha no braço ' +
          'estendido. Não é o agarrão da corrente nem a trava da lança — é um momento ' +
          'de controle oportunista que a versatilidade da espada permite improvisar.',
        deslocar:
          'Avanço controlado com a ponta ameaçando o espaço à frente — o oponente recua ' +
          'não pelo golpe, mas pela promessa do golpe. A espada compra espaço com ' +
          'credibilidade, não com massa.',
        quebrarRitmo:
          'Uma finta com o pulso — a lâmina insinua um corte alto e desvia para baixo ' +
          'no último instante. A versatilidade da espada torna cada finta plausível: o ' +
          'oponente não pode ignorar nenhuma, porque qualquer uma poderia ser real.',
      },
    },

    // ─────────────────────────────────────────────────
    // 2. MACHADOS — Dano Comprometido
    // ─────────────────────────────────────────────────
    machados: {
      nome: 'Machados',
      filosofia: 'Dano Comprometido',
      icone: '🪓',
      dadoBase: 'd10',
      alcance: 'curto',
      acaoFavorecida: 'romper',
      acaoPenalizada: 'desviar',
      posturaFavorecida: 'cheia',
      posturaPenalizada: 'vazia',
      moduladorCusto: +1,            // comprometimento total — caro
      mecanicaExclusiva: {
        id: 'fioQueRacha',
        nome: 'Fio que Racha',
        descricao: 'Todo acerto crítico com Machado ignora uma camada de proteção/armadura ' +
          'do alvo — o excedente de dano vaza através da defesa.',
        gatilho: 'acertoCritico',
        efeito: { ignoraProtecao: 1 },
      },
      evolucao: [
        { nome: 'Machado de Mão', tier: 1, descricao: 'Golpes isolados e comprometidos.' },
        { nome: 'Machado de Batalha', tier: 2, descricao: 'Arcos sustentados, múltiplos alvos.' },
        { nome: 'Machado Grande', tier: 3, descricao: 'Duas mãos, sem guarda, só ofensiva.' },
      ],
      descricao:
        'O corte que não se importa em errar de novo, porque quando acerta, o combate ' +
        'muda de figura. Machados não negociam. Golpes largos, arcos completos, pouca ' +
        'preocupação com recuperação imediata da guarda. A geometria do arco de balanço ' +
        'deixa brechas — e o machado sabe disso, e não se importa. O Durkan do Norte ' +
        'que empunha um machado não está pedindo uma luta justa; está declarando que a ' +
        'próxima coisa a cair é a defesa do oponente ou a dele própria.',
      template: {
        romper:
          'O machado descreve um arco completo — o corpo inteiro gira com a arma, os pés ' +
          'se plantam, e o fio encontra o alvo com o peso de todo o comprometimento. Onde ' +
          'a espada corta com precisão, o machado racha com convicção. Se for crítico, a ' +
          'armadura simplesmente não segura.',
        desviar:
          'A haste do machado se interpõe — desajeitada, pesada, tarde demais para ser ' +
          'elegante. O desvio funciona, mas cobra o preço da geometria: o arco de retorno ' +
          'é lento, a guarda fica aberta por um instante que dura mais do que deveria.',
        prender:
          'O gancho do machado — a curva do fio captura o braço ou a arma do oponente ' +
          'e puxa. Não é o controle refinado da espada; é a alavancagem bruta de quem ' +
          'tem peso e ângulo a seu favor.',
        deslocar:
          'Avanço com o machado girado ao lado — a ameaça do arco largo empurra o ' +
          'oponente para trás por instinto. Ninguém quer estar no caminho de um machado ' +
          'que está ganhando velocidade angular.',
        quebrarRitmo:
          'O machado para no meio do arco — a interrupção abrupta de toda aquela inércia ' +
          'é tão inesperada que o oponente que se preparava para o impacto se desequilibra ' +
          'contra o vazio. Fintar com machado é raro, e por isso funciona.',
      },
    },

    // ─────────────────────────────────────────────────
    // 3. MARTELOS — Impacto e Ruptura
    // ─────────────────────────────────────────────────
    martelos: {
      nome: 'Martelos',
      filosofia: 'Impacto e Ruptura',
      icone: '🔨',
      dadoBase: 'd10',
      alcance: 'curto',
      acaoFavorecida: 'romper',
      acaoPenalizada: 'quebrarRitmo',
      posturaFavorecida: 'baixa',
      posturaPenalizada: 'alta',
      moduladorCusto: +1,
      mecanicaExclusiva: {
        id: 'ondaDeChoque',
        nome: 'Onda de Choque',
        descricao: 'Romper com Martelo tem chance de gerar desequilíbrio no alvo (empurrar, ' +
          'derrubar, interromper ação) mesmo quando o dano não bastaria para "quebrar" ' +
          'defesas — o impacto é a arma, não o fio.',
        gatilho: 'romper',
        acaoRequerida: 'romper',
        efeito: { chanceDesequilibrio: true, ignoraArmaduraPesada: true },
      },
      evolucao: [
        { nome: 'Maça', tier: 1, descricao: 'Punição pontual concentrada.' },
        { nome: 'Martelo de Guerra', tier: 2, descricao: 'Esmagamento com corpo comprometido.' },
        { nome: 'Marreta de Guerra', tier: 3, descricao: 'Duas mãos, redefine o campo de batalha.' },
      ],
      descricao:
        'Não corta — esmaga. A diferença importa: Martelos ferem através da armadura, não ' +
        'apesar dela. Transferência bruta de força cinética — menos sobre a lâmina, mais ' +
        'sobre o peso comprometido no golpe. O Martelo testa diretamente o equilíbrio do ' +
        'alvo, e armaduras pesadas que parariam uma lâmina transmitem cada grama de impacto ' +
        'para os ossos que protegem. É a arma que lembra ao cavaleiro dentro da armadura ' +
        'que metal não absorve inércia — só a transfere.',
      template: {
        romper:
          'O martelo desce com a inevitabilidade da gravidade multiplicada pela vontade — ' +
          'não busca cortar, busca transferir toda a energia cinética acumulada através de ' +
          'qualquer coisa que esteja entre a cabeça de ferro e o chão. Armadura, escudo, ' +
          'osso — tudo é meio, não obstáculo.',
        desviar:
          'A haste pesada se interpõe com esforço visível — o peso que é vantagem no ataque ' +
          'vira inércia no desvio. Funciona, mas o corpo paga o preço de reposicionar todo ' +
          'aquele ferro no tempo errado.',
        prender:
          'O cabo do martelo se engancha sob o braço ou ao redor do pescoço — prender com ' +
          'martelo é mais alavancagem bruta do que técnica. O peso da cabeça serve de ' +
          'contrapeso, e o oponente descobre que lutar contra a física é mais difícil do ' +
          'que lutar contra o lutador.',
        deslocar:
          'O martelo gira em arco horizontal baixo, varrendo o espaço à frente como ' +
          'pêndulo de demolição. Não é preciso acertar — a ameaça do impacto é suficiente ' +
          'para que qualquer corpo com instinto de sobrevivência se desloque.',
        quebrarRitmo:
          'Fintar com um martelo é como fintar com uma bigorna — fisicamente difícil, ' +
          'esforçadamente inelegante. Mas quando funciona, a surpresa é proporcional à ' +
          'improbabilidade. Custa mais Sopro porque o corpo luta contra a inércia da ' +
          'própria arma para mudar de direção.',
      },
    },

    // ─────────────────────────────────────────────────
    // 4. LANÇAS — Controle de Distância
    // ─────────────────────────────────────────────────
    lancas: {
      nome: 'Lanças',
      filosofia: 'Controle de Distância',
      icone: '🔱',
      dadoBase: 'd8',
      alcance: 'medio',             // alcance natural maior
      acaoFavorecida: 'romper',      // à distância, sem custo extra
      acaoPenalizada: null,          // TODAS penalizadas em espaço curto (ver mecanica)
      posturaFavorecida: 'reta',
      posturaPenalizada: 'curva',
      moduladorCusto: 0,             // barata na zona ideal, cara fora
      mecanicaExclusiva: {
        id: 'prioridadeDeAlcance',
        nome: 'Prioridade de Alcance',
        descricao: 'Contra oponente que precisa se deslocar para alcançar o portador, a Lança ' +
          '"ataca primeiro" — o avanço do oponente é interrompido antes de completar. ' +
          'Se o oponente já está dentro do alcance curto, TODAS as ações custam +1 Sopro extra.',
        gatilho: 'oponenteSeDeslocando',
        efeito: { atacaPrimeiro: true, penalEspacoCurto: +1 },
      },
      evolucao: [
        { nome: 'Lança', tier: 1, descricao: 'Alcance fixo, ponta direta.' },
        { nome: 'Alabarda', tier: 2, descricao: 'Versatilidade — também corta.' },
        { nome: 'Glaive', tier: 3, descricao: 'Funde alcance com arco de corte completo.' },
      ],
      descricao:
        'Vencer antes que o oponente chegue perto o suficiente para que a luta vire sobre ' +
        'força. A distância é a defesa. O corpo do lutador nunca precisa estar onde o corpo ' +
        'do oponente está — e cada passo que o inimigo dá para fechar essa distância é um ' +
        'passo dado sob a ameaça da ponta. Quando o oponente finalmente chega perto, a ' +
        'lança sofre: a haste rígida se torna desvantagem em espaço curto, e o que era ' +
        'controle absoluto vira luta contra a própria natureza da arma.',
      template: {
        romper:
          'A ponta viaja em linha reta — o caminho mais curto entre a posição do lutador ' +
          'e o corpo do oponente que está metros adiante. Não há arco, não há giro: é a ' +
          'geometria pura do alcance transformada em ameaça perfurante. Se o oponente ' +
          'estava avançando, a lança o encontrou antes de ele chegar.',
        desviar:
          'A haste se interpõe horizontalmente, usando o comprimento como barreira — o ' +
          'oponente não pode alcançar o corpo do lanceiro sem primeiro passar pela vara. ' +
          'Em espaço aberto, é eficiente. Em espaço curto, a haste longa se torna ' +
          'desajeitada.',
        prender:
          'A haste cruza sob o braço ou ao redor da perna do oponente — prender com ' +
          'lança é mais alavancagem de comprimento do que força bruta. O oponente fica ' +
          'preso entre dois pontos da haste como entre grades de uma cela improvisada.',
        deslocar:
          'Recuo calculado com a ponta mantida em ameaça — cada passo para trás é um ' +
          'metro de distância restaurado, e cada metro é vantagem retomada. A lança não ' +
          'avança; ela restabelece o espaço que o oponente tentou roubar.',
        quebrarRitmo:
          'A ponta oscila entre alvos — ameaça o rosto, depois desce para a perna, ' +
          'depois volta ao tronco. O oponente que tenta ler o padrão de uma lança ' +
          'oscilante está lendo um livro que muda de idioma a cada página.',
      },
    },

    // ─────────────────────────────────────────────────
    // 5. ADAGAS — Velocidade e Precisão Letal
    // ─────────────────────────────────────────────────
    adagas: {
      nome: 'Adagas',
      filosofia: 'Velocidade e Precisão Letal',
      icone: '🗡️',
      dadoBase: 'd6',               // o menor dano base
      alcance: 'toque',             // precisa estar colada
      acaoFavorecida: 'romper',      // múltiplo via Golpe Duplo
      acaoPenalizada: 'deslocar',
      posturaFavorecida: 'silenciosa',
      posturaPenalizada: 'cheia',
      moduladorCusto: -1,            // a mais barata do sistema
      mecanicaExclusiva: {
        id: 'golpeDuplo',
        nome: 'Golpe Duplo',
        descricao: 'Romper com Adaga em Postura Vazia ou Silenciosa pode ser declarado ' +
          'como dois golpes de menor dado individual em vez de um golpe único — a única ' +
          'categoria que fragmenta uma Ação em múltiplas resoluções pelo mesmo custo total.',
        gatilho: 'declaracao',
        acaoRequerida: 'romper',
        posturasValidas: ['vazia', 'silenciosa'],
        efeito: { golpesDuplos: true, dadoPorGolpe: -1 },
      },
      evolucao: [
        { nome: 'Adaga', tier: 1, descricao: 'Lâmina única de reação.' },
        { nome: 'Adagas Gêmeas', tier: 2, descricao: 'Par sincronizado, ritmos diferentes.' },
        { nome: 'Adagas de Arremesso', tier: 3, descricao: 'Deixam de precisar de alcance zero.' },
      ],
      descricao:
        'A menor arma é a mais honesta sobre o que o combate realmente é — quem acerta ' +
        'primeiro o ponto certo. Golpes múltiplos e rápidos, ângulos que armas maiores não ' +
        'alcançam, luta próxima ao corpo do oponente por escolha, não por acidente. A adaga ' +
        'não tem massa suficiente para devastar com um único golpe, e não finge ter — o que ' +
        'ela tem é a velocidade para fazer dois golpes no tempo que o machado faz um, e a ' +
        'precisão para colocá-los onde doem mais.',
      template: {
        romper:
          'Dois movimentos onde outras armas fariam um — o primeiro abre a guarda, o segundo ' +
          'entra. Ou os dois entram ao mesmo tempo em ângulos que o oponente não consegue ' +
          'cobrir simultaneamente. A adaga não devastra; ela desconstrói.',
        desviar:
          'A lâmina curta desvia com a economia de um bisturi — o menor movimento possível ' +
          'que redireciona o golpe para longe, sem gastar energia que não tem. É o desvio ' +
          'mais barato do sistema depois da espada.',
        prender:
          'A adaga não prende por massa — prende por ameaça. A lâmina encosta na garganta, ' +
          'na artéria do pulso, no tendão de Aquiles, e o oponente para de se mover não ' +
          'porque está imobilizado, mas porque mover-se significaria se cortar.',
        deslocar:
          'A adaga não compra espaço — ela opera dentro do espaço que já existe. O lutador ' +
          'se desloca como quem atravessa uma multidão: de lado, por baixo, por ângulos ' +
          'que armas maiores sequer considerariam.',
        quebrarRitmo:
          'A mão que segura a adaga desaparece — por um instante o oponente não sabe se o ' +
          'golpe virá da esquerda, da direita, de baixo ou de cima. A velocidade da adaga ' +
          'transforma cada posição de mão em três fintas plausíveis.',
      },
    },

    // ─────────────────────────────────────────────────
    // 6. ARCOS — Domínio à Distância
    // ─────────────────────────────────────────────────
    arcos: {
      nome: 'Arcos',
      filosofia: 'Domínio à Distância',
      icone: '🏹',
      dadoBase: 'd8',
      alcance: 'longo',             // único com alcance longo padrão
      acaoFavorecida: 'romper',      // à distância
      acaoPenalizada: null,          // TODAS penalizadas corpo a corpo (ver mecanica)
      posturaFavorecida: 'cheia',    // com Tensão Acumulada
      posturaPenalizada: 'baixa',
      moduladorCusto: 0,
      mecanicaExclusiva: {
        id: 'tensaoAcumulada',
        nome: 'Tensão Acumulada',
        descricao: 'Manter Postura Cheia por mais de uma troca antes de disparar aumenta o ' +
          'dado de dano em +1 degrau. Única categoria em que esperar melhora o resultado. ' +
          'Em corpo a corpo, TODAS as ações custam +2 Sopro extra.',
        gatilho: 'posturaCheiaMantida',
        efeito: { degrauExtra: +1, penalCorpoACorpo: +2 },
      },
      evolucao: [
        { nome: 'Arco Curto', tier: 1, descricao: 'Disparo rápido, pouco alcance.' },
        { nome: 'Arco Longo', tier: 2, descricao: 'Penetração e distância de guerra.' },
        { nome: 'Besta', tier: 3, descricao: 'Dano bruto, menos exigência de força.' },
      ],
      descricao:
        'A única categoria construída inteiramente ao redor de nunca deixar o combate virar ' +
        'corpo a corpo. Posicionamento antes de tudo: o disparo em si é o momento final de ' +
        'uma sequência de decisões espaciais. O arqueiro que precisa sacar uma adaga já ' +
        'perdeu — não o combate, mas a premissa inteira da sua arte. Onde o espadachim vê ' +
        'um oponente, o arqueiro vê uma distância. E enquanto a distância existir, o arco ' +
        'é soberano.',
      template: {
        romper:
          'A corda estica até o limite — os dedos sentem a tensão acumulada de toda a ' +
          'energia potencial que está prestes a se converter em velocidade. A flecha parte ' +
          'com um estalo seco e o ar se divide ao longo do caminho mais reto que a ' +
          'física permite entre dois pontos do campo de batalha.',
        desviar:
          'Não há desvio elegante com um arco — é recuo, reposicionamento, a promessa de ' +
          'que a próxima flecha virá de um ângulo que o oponente não esperava. Desviar com ' +
          'arco é desviar com os pés, não com a arma.',
        prender:
          'Prender com arco não faz sentido físico — a arma não permite contato sustentado. ' +
          'Se o arqueiro está perto o suficiente para prender, algo deu muito errado.',
        deslocar:
          'Recuo tático com a flecha apontada — cada passo para trás restabelece a ' +
          'distância que é a razão de existir do arco. O oponente avança e o arqueiro ' +
          'se dissolve, como miragem que se refaz sempre mais longe.',
        quebrarRitmo:
          'A flecha aponta para o rosto, depois desce para a perna, depois retorna ao ' +
          'peito. O oponente que tenta avançar precisa decidir se a ameaça é real a cada ' +
          'mudança de ângulo — e cada hesitação é mais um segundo de alcance mantido.',
      },
    },

    // ─────────────────────────────────────────────────
    // 7. FOICES — Fluxo e Colheita de Múltiplos Alvos
    // ─────────────────────────────────────────────────
    foices: {
      nome: 'Foices',
      filosofia: 'Fluxo e Colheita',
      icone: '🌾',
      dadoBase: 'd8',
      alcance: 'curto',
      acaoFavorecida: 'romper',      // com Arco de Colheita
      acaoPenalizada: 'prender',
      posturaFavorecida: 'curva',
      posturaPenalizada: 'reta',
      moduladorCusto: 0,
      mecanicaExclusiva: {
        id: 'arcoDeColheita',
        nome: 'Arco de Colheita',
        descricao: 'Romper com Foice em Postura Curva pode atingir múltiplos alvos adjacentes ' +
          'na mesma resolução, ao custo de Sopro somado (não multiplicado) por alvo extra.',
        gatilho: 'declaracao',
        acaoRequerida: 'romper',
        posturaRequerida: 'curva',
        efeito: { alvosMultiplos: true, custoSomadoPorAlvo: true },
      },
      evolucao: [
        { nome: 'Foice de Guerra', tier: 1, descricao: 'Compacta, arco controlado.' },
        { nome: 'Foice Longa', tier: 2, descricao: 'Arco amplo, mais alcance no giro.' },
        { nome: 'Foice Dupla', tier: 3, descricao: 'Uma lâmina em cada mão, colheita bidirecional.' },
      ],
      descricao:
        'O gume que não distingue entre um corpo e o próximo. A foice não é feita para ' +
        'duelos — é feita para linhas. O corpo gira, o gume acompanha, e um golpe ' +
        'raramente termina onde começou. Contra um único duelista isolado, a Foice ' +
        '"desperdiça" metade do seu potencial — a arma foi desenhada para ceifar fileiras, ' +
        'não para trocar estocadas. Mas quando há dois, três oponentes lado a lado, ' +
        'nenhuma outra arma corpo a corpo resolve a equação com tanta eficiência.',
      template: {
        romper:
          'O corpo gira e o gume acompanha num arco que não foi feito para parar num ' +
          'único corpo — a lâmina curva passa através do primeiro alvo e continua, ' +
          'buscando o próximo com a inércia do giro. Cada corpo atingido é uma nota ' +
          'na mesma frase de aço.',
        desviar:
          'A haste curva se interpõe — o gancho da foice captura a arma do oponente e ' +
          'redireciona o golpe seguindo a curvatura natural da lâmina. É desvio que parece ' +
          'dança: fluido, circular, nunca rígido.',
        prender:
          'O gancho da foice se enrosca no braço ou pescoço — prende, mas a geometria ' +
          'curva torna a pegada instável. A foice não foi feita para segurar; foi feita ' +
          'para passar.',
        deslocar:
          'O giro do corpo carrega a foice num círculo de ameaça — o oponente recua não ' +
          'pelo golpe, mas pelo arco que a lâmina descreve. O espaço se abre como campo ' +
          'de trigo diante da ceifadeira.',
        quebrarRitmo:
          'A foice muda de direção no meio do arco — o golpe que vinha horizontal de ' +
          'repente sobe, ou desce, ou inverte. A curvatura da lâmina esconde o ângulo ' +
          'real até o último instante.',
      },
    },

    // ─────────────────────────────────────────────────
    // 8. CORRENTES — Imprevisibilidade e Alcance Variável
    // ─────────────────────────────────────────────────
    correntes: {
      nome: 'Correntes',
      filosofia: 'Imprevisibilidade e Alcance Variável',
      icone: '⛓️',
      dadoBase: 'd6',
      alcance: 'variavel',          // declara Curto ou Médio no momento da Ação
      acaoFavorecida: 'prender',
      acaoPenalizada: null,          // punida em falha, não em tipo de ação
      posturaFavorecida: 'curva',
      posturaPenalizada: 'reta',
      moduladorCusto: 0,
      mecanicaExclusiva: {
        id: 'alcanceFluido',
        nome: 'Alcance Fluido',
        descricao: 'A Corrente declara seu Alcance (Curto ou Médio) no momento da Ação — ' +
          'nenhuma outra arma tem essa flexibilidade. Nunca acessa Alcance Longo. Se a ' +
          'Ação falhar, a corrente fica fora de posição: próxima ação custa +1 Sopro extra.',
        gatilho: 'declaracao',
        efeito: { alcanceEscolhido: ['curto', 'medio'], penalFalha: +1 },
      },
      evolucao: [
        { nome: 'Corrente de Mão', tier: 1, descricao: 'Curta, punho a punho.' },
        { nome: 'Mangual', tier: 2, descricao: 'Peso na ponta, alcance ampliado.' },
        { nome: 'Corrente Dupla', tier: 3, descricao: 'Uma em cada mão, ameaça bidirecional.' },
      ],
      descricao:
        'A única arma cuja forma muda a cada instante. Não tem alcance fixo, não tem ' +
        'ângulo fixo — e é exatamente por isso que é tão difícil de ler. O oponente que ' +
        'olha para uma corrente parada não sabe se o próximo golpe virá de perto ou de ' +
        'longe, de cima ou de baixo, reto ou curvo. A imprevisibilidade é a própria arma. ' +
        'O preço: errar com corrente é pior do que errar com qualquer outra arma — os elos ' +
        'ficam fora de posição, e o instante de recolher é o instante em que o oponente ' +
        'ataca.',
      template: {
        romper:
          'A corrente dispara — os elos se esticam no ar desenhando um arco que ninguém ' +
          'previu porque o alcance só foi decidido no momento do golpe. O impacto estala ' +
          'metal contra carne, e os elos se recolhem como língua de serpente que já deu o ' +
          'bote.',
        desviar:
          'A corrente gira num escudo de elos em movimento — não uma barreira fixa, mas ' +
          'um véu cinético que deflecte o que se aproxima por pura inércia rotacional. ' +
          'É o desvio mais visual do sistema: o oponente vê a teia de metal girar e ' +
          'hesita em atravessá-la.',
        prender:
          'Os elos se enroscam — ao redor do braço, da perna, do pescoço, da arma do ' +
          'oponente. A corrente prende como cobra prende: enrolando, apertando, cada elo ' +
          'um dente que se crava na posição capturada. A corrente e a Via da Corrente do ' +
          'desarmado são sinergias narrativas óbvias.',
        deslocar:
          'A corrente varre o espaço em arco horizontal — os elos zunindo no ar criam uma ' +
          'zona de ameaça que empurra o oponente para trás por puro instinto de ' +
          'sobrevivência. O alcance é imprevisível: o oponente recua dois metros e descobre ' +
          'que a corrente alcança dois metros e meio.',
        quebrarRitmo:
          'A corrente muda de forma — estava balançando à direita, de repente se recolhe e ' +
          'dispara à esquerda. Estava longa, de repente é curta. O oponente que tentava ' +
          'ler o padrão descobre que correntes não têm padrão, têm caos controlado.',
      },
    },
  },


  // ===========================================================
  // CAMADA 2 — AS 5 AÇÕES (equivalente a verbos{} de magias.js)
  // ===========================================================
  // Idênticas aos 5 Impulsos do combate desarmado.
  // Renomeadas de "Impulso" para "Ação" apenas por clareza de
  // contexto — a mesma lógica, as mesmas funções de motor.
  // ===========================================================
  acoes: {

    romper: {
      nome: 'Romper',
      pesoBase: 'medio',
      custoBase: 2,
      intencao: 'ofensivo',
      multiplicadorDados: 1.0,
      descricao:
        'Golpear para causar dano direto com a arma — corte, estocada, esmagamento, ' +
        'disparo. A ação mais instintiva do combate armado: a arma existe para isto.',
    },

    desviar: {
      nome: 'Desviar',
      pesoBase: 'leve',
      custoBase: 1,
      intencao: 'defensivo',
      multiplicadorDados: 0,
      descricao:
        'Usar a arma ou escudo para negar o golpe do oponente — parry, bloqueio, ' +
        'deflexão. O peso da arma importa: desviar com espada é mais barato que ' +
        'desviar com machado.',
    },

    prender: {
      nome: 'Prender',
      pesoBase: 'pesado',
      custoBase: 3,
      intencao: 'controle',
      multiplicadorDados: 0.5,
      descricao:
        'Restringir com a arma — guarda cruzada, cabo enroscado, elos de corrente. ' +
        'O Impulso mais caro porque sustenta controle sobre outra arma ou corpo ' +
        'através de um intermediário físico.',
    },

    deslocar: {
      nome: 'Deslocar',
      pesoBase: 'medio',
      custoBase: 2,
      intencao: 'utilidade',
      multiplicadorDados: 0,
      descricao:
        'Reposicionar-se ou empurrar o oponente usando alcance e peso da arma — ' +
        'avanço com ameaça, recuo tático, varrida de espaço.',
    },

    quebrarRitmo: {
      nome: 'Quebrar Ritmo',
      pesoBase: 'leve',
      custoBase: 1,
      intencao: 'utilidade',
      multiplicadorDados: 0,
      descricao:
        'Fintar ou interromper usando a ameaça da arma — o oponente não pode ignorar ' +
        'uma finta plausível quando há aço envolvido.',
    },
  },


  // ===========================================================
  // CAMADA 3 — AS 8 POSTURAS (compartilhadas com combateDesarmado)
  // ===========================================================
  // Importação direta. Se combateDesarmado.js estiver carregado
  // no mesmo contexto, usar:
  //   posturas: sistemaCombateDesarmado.posturas
  //
  // Para independência de módulo, as Posturas são definidas aqui
  // como cópia idêntica. Fonte única de verdade: Sistema_Combate_Desarmado.md §5.
  //
  // TODO: quando motor-compartilhado.js for criado, extrair para lá.
  // ===========================================================
  posturas: {
    cheia:       { nome: 'Cheia',       custoExtra: +2, ajustes: { ajDano: +2, ajDefesa: -2 },
      descricao: { ofensivo: 'Comprometimento total — tudo no golpe.', defensivo: 'Guarda de ferro — impenetrável, imóvel.' },
      template: 'O corpo se compromete por inteiro — não há reserva, não há segunda opção.' },

    vazia:       { nome: 'Vazia',       custoExtra: -1, ajustes: { ajDano: -1, ajDefesa: +1 },
      descricao: { ofensivo: 'Golpe controlado, guarda mantida.', defensivo: 'Guarda relaxada — eficiência sobre rigidez.' },
      template: 'Contenção disciplinada — reserva para o que vier depois.' },

    baixa:       { nome: 'Baixa',       custoExtra:  0, ajustes: { ajDano: 0, ajDefesa: +1, ajEquilibrio: +2 },
      descricao: { ofensivo: 'Centro de gravidade baixo — golpes de baixo para cima.', defensivo: 'Enraizamento — base impossível de deslocar.' },
      template: 'O corpo desce e se enraíza — tudo se dissipa na estrutura.' },

    alta:        { nome: 'Alta',        custoExtra:  0, ajustes: { ajDano: 0, ajDefesa: -1, ajAlcance: +1 },
      descricao: { ofensivo: 'Verticalidade e alcance — elegância letal.', defensivo: 'Guarda alta — cobre tronco, expõe pernas.' },
      template: 'O corpo se ergue — alcance e verticalidade num mesmo gesto.' },

    curva:       { nome: 'Curva',       custoExtra: -1, ajustes: { ajDano: 0, ajDefesa: 0, ajRedirecionamento: +2 },
      descricao: { ofensivo: 'Arcos e espirais — a força do oponente como combustível.', defensivo: 'Guarda fluida — nunca no mesmo lugar.' },
      template: 'Arcos e espirais — a força alheia vira combustível.' },

    reta:        { nome: 'Reta',        custoExtra:  0, ajustes: { ajDano: +1, ajDefesa: 0 },
      descricao: { ofensivo: 'Caminho mais curto — previsível mas rápido.', defensivo: 'Defesa e ataque no mesmo eixo.' },
      template: 'Linha reta, caminho mais curto — velocidade sobre surpresa.' },

    silenciosa:  { nome: 'Silenciosa',  custoExtra: -1, ajustes: { ajDano: -1, ajDefesa: 0, ajSurpresa: +2 },
      descricao: { ofensivo: 'Intenção escondida — o golpe chega antes de ser visto.', defensivo: 'Guarda que não se revela.' },
      template: 'Intenção escondida — o corpo mente sobre o que fará.' },

    sacrificial: { nome: 'Sacrificial', custoExtra: +2, ajustes: { ajDano: +3, ajDefesa: -3 },
      descricao: { ofensivo: 'Guarda aberta de propósito — garantir o golpe a qualquer custo.', defensivo: 'Corpo interposto — proteção pelo preço mais alto.' },
      template: 'Abertura deliberada — sangrar para garantir que o outro sangre mais.' },
  },


  // ===========================================================
  // CAMADA 4 (OPCIONAL) — ESPECIALIZAÇÕES (equivalente a manifestacoes{})
  // ===========================================================
  // 2 por Categoria = 16 total. Não obrigatórias.
  // Um personagem sem Especialização gera técnica válida.
  //
  // NOTA DE BALANCEAMENTO: nenhuma Especialização é "upgrade
  // estritamente melhor". Cada uma resolve UM ponto fraco à
  // custa de aprofundar a identidade em OUTRO eixo.
  // ===========================================================
  especializacoes: {

    // ── Espadas ──
    corteFluido: {
      nome: 'Corte Fluido',
      categoria: 'espadas',
      ajusteCusto: 0,
      tags: ['+Eficiência em Postura Curva'],
      efeito: { bonusPosturaCurva: +1 },
      descricao: 'A lâmina acompanha os arcos do corpo — a Postura Curva ganha bônus de ' +
        'redirecionamento com espada. Não melhora o dano bruto; melhora a fluidez.',
      template: 'A lâmina descreve arcos que acompanham o giro do corpo como extensão natural.',
    },
    pontaPrecisa: {
      nome: 'Ponta Precisa',
      categoria: 'espadas',
      ajusteCusto: +1,
      tags: ['+Eficiência contra Postura Silenciosa do oponente'],
      efeito: { contraPosturaSilenciosa: +2 },
      descricao: 'Estocadas que perfuram a guarda escondida — eficaz contra quem esconde ' +
        'a intenção. Custa um pouco mais de Sopro pela concentração extra.',
      template: 'A ponta busca o espaço que a guarda silenciosa deixou — sutil contra sutil.',
    },

    // ── Machados ──
    arcoLargo: {
      nome: 'Arco Largo',
      categoria: 'machados',
      ajusteCusto: +2,
      tags: ['Romper atinge 2º alvo adjacente', 'Custo somado'],
      efeito: { alvosExtras: 1, custoSomado: true },
      descricao: 'O arco do machado não para no primeiro corpo — continua. Um segundo alvo ' +
        'adjacente é atingido pelo mesmo giro, ao custo somado.',
      template: 'O machado não para — o arco continua através do primeiro corpo e busca o próximo.',
    },
    fioPesado: {
      nome: 'Fio Pesado',
      categoria: 'machados',
      ajusteCusto: +1,
      tags: ['Crítico ignora +1 camada de proteção'],
      efeito: { ignoraProtecaoExtra: +1 },
      descricao: 'O fio foi forjado mais grosso, mais pesado. Acertos críticos ignoram uma ' +
        'camada adicional de proteção além do Fio que Racha base.',
      template: 'O fio mais pesado racha o que o fio normal apenas cortaria.',
    },

    // ── Martelos ──
    golpeSismico: {
      nome: 'Golpe Sísmico',
      categoria: 'martelos',
      ajusteCusto: +2,
      tags: ['Onda de Choque afeta pequena área'],
      efeito: { ondaDeChoqueArea: true },
      descricao: 'O impacto não fica no alvo — se espalha. A Onda de Choque afeta alvos ' +
        'adjacentes ao ponto de impacto.',
      template: 'O chão treme. O impacto se propaga como onda sísmica a partir do ponto de contato.',
    },
    caboCurto: {
      nome: 'Cabo Curto',
      categoria: 'martelos',
      ajusteCusto: 0,
      tags: ['Reduz penalidade de Quebrar Ritmo'],
      efeito: { reducaoPenalQuebrarRitmo: -1 },
      descricao: 'Cabo mais curto permite fintas que o martelo longo não faria. Reduz a ' +
        'penalidade de Quebrar Ritmo com Martelo.',
      template: 'O cabo curto gira no pulso — fintas impossíveis com o martelo longo.',
    },

    // ── Lanças ──
    guardaDePonta: {
      nome: 'Guarda de Ponta',
      categoria: 'lancas',
      ajusteCusto: +1,
      tags: ['Desviar ganha Prioridade de Alcance'],
      efeito: { desviarAtacaPrimeiro: true },
      descricao: 'A ponta não é só ofensiva — Desviar com Guarda de Ponta também ganha o ' +
        'bônus de "ataca primeiro" que normalmente só existe para Romper.',
      template: 'A ponta se interpõe antes do golpe chegar — defesa que é ameaça.',
    },
    alcanceEstendido: {
      nome: 'Alcance Estendido',
      categoria: 'lancas',
      ajusteCusto: +1,
      tags: ['Empurra teto de Alcance Longo'],
      efeito: { alcanceMaximo: 'longo' },
      descricao: 'Haste mais longa empurra o teto de alcance — Romper efetivo em distância ' +
        'que outras lanças não alcançam.',
      template: 'A haste se estende além do que parecia possível — mais um metro de vantagem.',
    },

    // ── Adagas ──
    golpeGemeoAvancado: {
      nome: 'Golpe Gêmeo Avançado',
      categoria: 'adagas',
      ajusteCusto: +1,
      tags: ['Golpe Duplo funciona em Postura Cheia'],
      efeito: { golpeDuploPosturaCheia: true },
      descricao: 'O Golpe Duplo, normalmente restrito a Postura Vazia ou Silenciosa, passa a ' +
        'funcionar também em Postura Cheia. A adaga ainda não vira boa em dano bruto — ' +
        'fica ainda mais rápida.',
      template: 'Duas lâminas, comprometimento total — velocidade duplicada na entrega máxima.',
    },
    venenoDeFio: {
      nome: 'Veneno de Fio',
      categoria: 'adagas',
      ajusteCusto: +1,
      tags: ['Dano ganha componente sustentado'],
      efeito: { danoSustentado: true, duracaoTurnos: 2 },
      descricao: 'A lâmina carrega substância que persiste — o dano não termina quando o golpe ' +
        'termina. Componente sustentado por 2 turnos.',
      template: 'O corte é fino, quase imperceptível — o que arde é o que a lâmina deixou para trás.',
    },

    // ── Arcos ──
    tiroInstintivo: {
      nome: 'Tiro Instintivo',
      categoria: 'arcos',
      ajusteCusto: 0,
      tags: ['Remove exigência de Tensão Acumulada em Postura Cheia'],
      efeito: { removeTensaoAcumulada: true },
      descricao: 'O disparo não precisa de pausa — a Postura Cheia não exige manter a tensão ' +
        'por mais de uma troca para ter efeito. Perde o bônus de +1 degrau.',
      template: 'A flecha parte no instante em que a corda chega ao máximo — sem espera.',
    },
    miraPerfurante: {
      nome: 'Mira Perfurante',
      categoria: 'arcos',
      ajusteCusto: +1,
      tags: ['Ignora parcialmente cobertura'],
      efeito: { ignoraCobertura: 0.5 },
      descricao: 'A mira compensa a cobertura — alvos parcialmente protegidos recebem ' +
        'metade da proteção normal. Como a Manifestação Linha da magia.',
      template: 'A flecha encontra o vão na cobertura que o oponente achava suficiente.',
    },

    // ── Foices ──
    colheitaAmpla: {
      nome: 'Colheita Ampla',
      categoria: 'foices',
      ajusteCusto: +1,
      tags: ['Arco de Colheita +1 alvo extra'],
      efeito: { alvosExtraColheita: +1 },
      descricao: 'O arco da foice alcança mais um corpo além do normal — a colheita se ' +
        'amplia pelo mesmo custo somado.',
      template: 'O giro não para no segundo corpo — continua, ceifando o terceiro.',
    },
    giroContinuo: {
      nome: 'Giro Contínuo',
      categoria: 'foices',
      ajusteCusto: 0,
      tags: ['Reduz custo de encadear Romper duas vezes'],
      efeito: { descontoSegundoRomper: -1 },
      descricao: 'O segundo Romper no mesmo turno custa 1 Sopro a menos — o giro do ' +
        'corpo mantém a inércia da foice girando.',
      template: 'O corpo não para de girar — o segundo golpe nasce da inércia do primeiro.',
    },

    // ── Correntes ──
    lacoDuplo: {
      nome: 'Laço Duplo',
      categoria: 'correntes',
      ajusteCusto: +1,
      tags: ['Prender imobiliza dois pontos do corpo'],
      efeito: { pontosPresos: 2 },
      descricao: 'A corrente se enrosca em dois pontos simultaneamente — braço e perna, ' +
        'pescoço e arma. Fuga fica proporcionalmente mais difícil.',
      template: 'Os elos se dividem e cada metade prende um ponto diferente — fuga dobrada.',
    },
    chicoteLongo: {
      nome: 'Chicote Longo',
      categoria: 'correntes',
      ajusteCusto: 0,
      tags: ['Acessa Alcance Médio "puro"'],
      efeito: { alcanceMedioPuro: true },
      descricao: 'A corrente acessa Alcance Médio sem precisar escolher entre Curto e ' +
        'Médio — o Alcance Fluido se fixa em Médio quando desejado.',
      template: 'A corrente se estende ao máximo — alcance fixo onde antes havia escolha.',
    },
  },


  // ===========================================================
  // MOTOR — calcularCusto()
  // ===========================================================
  // Quatro camadas encadeáveis:
  //   1. Peso base da Ação (custoBase)
  //   2. Modulador de Postura (custoExtra)
  //   3. Modulador de Categoria (moduladorCusto)
  //   4. Modulador de Especialização (ajusteCusto, quando ativa)
  //   × Multiplicador de nível de Sopro
  //
  // Camada extra vs desarmado: a Especialização.
  // ===========================================================
  calcularCusto(categoriaId, acaoId, posturaId, especializacaoId = null, nivelSopro = 'sustentado') {
    const categoria = this.categorias[categoriaId];
    const acao = this.acoes[acaoId];
    const postura = this.posturas[posturaId];
    const sopro = this.niveisSopro[nivelSopro];
    if (!categoria || !acao || !postura || !sopro) return 0;

    // Camada 1: peso base da Ação
    let custoBase = acao.custoBase;

    // Camada 2: modulador de Postura
    custoBase += postura.custoExtra;

    // Camada 3: modulador de Categoria
    custoBase += categoria.moduladorCusto;

    // Camada 4: modulador de Especialização (quando ativa)
    if (especializacaoId) {
      const esp = this.especializacoes[especializacaoId];
      if (esp && esp.categoria === categoriaId) {
        custoBase += (esp.ajusteCusto || 0);
      }
    }

    // Piso mínimo: 0
    custoBase = Math.max(0, custoBase);

    // Multiplicador de Sopro
    return Math.ceil(custoBase * sopro.multiplicadorCusto);
  },


  // ===========================================================
  // MOTOR — resolverDado()
  // ===========================================================
  resolverDado(categoriaId, acaoId, posturaId, especializacaoId = null) {
    const categoria = this.categorias[categoriaId];
    const acao = this.acoes[acaoId];
    const postura = this.posturas[posturaId];
    if (!categoria || !acao || !postura) return null;

    // Ações sem dado de dano
    if (acao.multiplicadorDados === 0) {
      return { dado: null, indiceFinal: null, bonusFixo: 0, bonusFlatExtra: 0, semDano: true };
    }

    const indiceBase = this.escadaDados.indexOf(categoria.dadoBase);
    if (indiceBase === -1) return null;

    // Ajuste pelo ajDano da Postura (cada +2 ajDano = +1 degrau)
    let ajusteDegrau = Math.floor((postura.ajustes.ajDano || 0) / 2);

    // Ajuste de Especialização (se houver efeito de degrau)
    if (especializacaoId) {
      const esp = this.especializacoes[especializacaoId];
      if (esp && esp.efeito && esp.efeito.degrauExtra) {
        ajusteDegrau += esp.efeito.degrauExtra;
      }
    }

    return this.ajustarDegrau(indiceBase, ajusteDegrau);
  },


  // ===========================================================
  // MOTOR — resolverFriccao()
  // ===========================================================
  resolverFriccao(categoriaId, acaoId, posturaId) {
    const categoria = this.categorias[categoriaId];
    const postura = this.posturas[posturaId];
    if (!categoria || !postura) return { friccaoCategoriaAcao: 'neutra', friccaoCategoriaPostura: 'neutra', tags: [] };

    const tags = [];

    // Fricção Categoria × Ação
    let friccaoCategoriaAcao = 'neutra';
    if (categoria.acaoFavorecida === acaoId) {
      friccaoCategoriaAcao = 'favoravel';
      tags.push(`${categoria.nome}: ${this.acoes[acaoId].nome} é ação favorecida (+1 dado bônus)`);
    } else if (categoria.acaoPenalizada === acaoId) {
      friccaoCategoriaAcao = 'desfavoravel';
      tags.push(`${categoria.nome}: ${this.acoes[acaoId].nome} é ação penalizada (+1 Sopro extra)`);
    }

    // Fricção Categoria × Postura
    let friccaoCategoriaPostura = 'neutra';
    if (categoria.posturaFavorecida === posturaId) {
      friccaoCategoriaPostura = 'favoravel';
      tags.push(`${categoria.nome}: Postura ${postura.nome} é favorecida (efeito aprimorado)`);
    } else if (categoria.posturaPenalizada === posturaId) {
      friccaoCategoriaPostura = 'desfavoravel';
      tags.push(`${categoria.nome}: Postura ${postura.nome} é penalizada (+1 Sopro extra)`);
    }

    return { friccaoCategoriaAcao, friccaoCategoriaPostura, tags };
  },


  // ===========================================================
  // MOTOR — resolverMecanicaExclusiva()
  // ===========================================================
  resolverMecanicaExclusiva(categoriaId, acaoId, posturaId, contexto = {}) {
    const categoria = this.categorias[categoriaId];
    if (!categoria || !categoria.mecanicaExclusiva) return null;

    const mec = categoria.mecanicaExclusiva;

    // Verificar ação requerida
    if (mec.acaoRequerida && mec.acaoRequerida !== acaoId) return null;

    // Verificar postura requerida
    if (mec.posturaRequerida && mec.posturaRequerida !== posturaId) return null;

    // Verificar posturas válidas (para mecânicas com lista, como Golpe Duplo)
    if (mec.posturasValidas && !mec.posturasValidas.includes(posturaId)) return null;

    switch (mec.gatilho) {
      case 'acertoCritico':
        return {
          ativo: true, condicional: true,
          condicao: 'Ativa em acerto crítico',
          nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
        };

      case 'trocaPostura':
        return {
          ativo: true, condicional: false,
          nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
        };

      case 'oponenteSeDeslocando':
        return {
          ativo: true, condicional: true,
          condicao: 'Ativa quando oponente se desloca para alcançar o portador',
          nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
        };

      case 'posturaCheiaMantida':
        if (posturaId === 'cheia') {
          return {
            ativo: true, condicional: true,
            condicao: 'Bônus de +1 degrau se Postura Cheia mantida por mais de uma troca',
            nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
          };
        }
        return null;

      case 'romper':
        if (acaoId === 'romper') {
          return {
            ativo: true, condicional: false,
            nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
          };
        }
        return null;

      case 'declaracao':
        return {
          ativo: true, condicional: false,
          nome: mec.nome, descricao: mec.descricao, efeito: mec.efeito,
        };

      default:
        return null;
    }
  },


  // ===========================================================
  // FUNÇÃO DE GERAÇÃO FINAL — gerarTecnicaArmada()
  // ===========================================================
  gerarTecnicaArmada(categoriaId, acaoId, posturaId, especializacaoId = null, nivelSopro = 'sustentado', options = {}) {

    // ── 1. Validação e lookup ──────────────────────────────────
    const categoria = this.categorias[categoriaId];
    const acao = this.acoes[acaoId];
    const postura = this.posturas[posturaId];
    const sopro = this.niveisSopro[nivelSopro];
    const especializacao = especializacaoId ? this.especializacoes[especializacaoId] : null;

    if (!categoria || !acao || !postura || !sopro) {
      return {
        erro: 'Combinação inválida: categoria, ação ou postura não encontrada.',
        tags: [],
      };
    }

    // Validar que a Especialização pertence à Categoria
    if (especializacao && especializacao.categoria !== categoriaId) {
      return {
        erro: `Especialização "${especializacao.nome}" não pertence à categoria "${categoria.nome}".`,
        tags: [],
      };
    }

    // ── 2. Resolução de custo ──────────────────────────────────
    const custoBase = this.calcularCusto(categoriaId, acaoId, posturaId, especializacaoId, nivelSopro);

    const friccao = this.resolverFriccao(categoriaId, acaoId, posturaId);
    let custoFinal = custoBase;
    if (friccao.friccaoCategoriaAcao === 'desfavoravel') custoFinal += 1;
    if (friccao.friccaoCategoriaPostura === 'desfavoravel') custoFinal += 1;

    // ── 3. Resolução de dado ───────────────────────────────────
    const dadoFinal = this.resolverDado(categoriaId, acaoId, posturaId, especializacaoId);

    let quantidadeDados = null;
    if (dadoFinal && !dadoFinal.semDano) {
      const qtdBase = Math.max(1, Math.round(acao.multiplicadorDados * sopro.multiplicadorEfeito));
      quantidadeDados = friccao.friccaoCategoriaAcao === 'favoravel' ? qtdBase + 1 : qtdBase;
    }

    // ── 4. Resolução de mecânica exclusiva ─────────────────────
    const mecanica = this.resolverMecanicaExclusiva(categoriaId, acaoId, posturaId, options);

    // ── 5. Resolução de intenção ───────────────────────────────
    const intencao = acao.intencao || 'ofensivo';
    const descricaoPostura =
      (typeof postura.descricao === 'object' && postura.descricao !== null)
        ? (postura.descricao[intencao] || postura.descricao.ofensivo || '')
        : (postura.descricao || '');

    // ── 6. Montagem de tags ────────────────────────────────────
    const tagsBase = [
      categoria.filosofia,
      acao.nome,
      postura.nome,
      `Custo: ${custoFinal} Sopro`,
      `Nível: ${sopro.nome}`,
      `Alcance: ${categoria.alcance === 'variavel' ? 'Curto/Médio (declarado)' : categoria.alcance}`,
    ];

    const tagsDado = [];
    if (dadoFinal && !dadoFinal.semDano && quantidadeDados) {
      let descricaoDado = `Dado: ${quantidadeDados}${dadoFinal.dado}`;
      if (dadoFinal.bonusFixo) descricaoDado += ` +${dadoFinal.bonusFixo}`;
      if (dadoFinal.bonusFlatExtra) {
        descricaoDado += ` (+${dadoFinal.bonusFlatExtra} Dano Fixo/Teto de Vidro)`;
      }
      tagsDado.push(descricaoDado);
    }

    const tagsMecanicos = [];
    if (postura.ajustes.ajDefesa) {
      const sinal = postura.ajustes.ajDefesa > 0 ? '+' : '';
      tagsMecanicos.push(`Defesa: ${sinal}${postura.ajustes.ajDefesa}`);
    }

    const tagsMecanica = [];
    if (mecanica) {
      const tagMec = mecanica.condicional
        ? `${mecanica.nome} (${mecanica.condicao})`
        : mecanica.nome;
      tagsMecanica.push(tagMec);
    }

    const tagsEspecializacao = [];
    if (especializacao) {
      tagsEspecializacao.push(`Especialização: ${especializacao.nome}`);
      tagsEspecializacao.push(...especializacao.tags);
    }

    const tags = [
      ...tagsBase,
      ...tagsDado,
      ...tagsMecanicos,
      ...friccao.tags,
      ...tagsMecanica,
      ...tagsEspecializacao,
    ].filter(Boolean);

    // ── 7. Montagem de template narrativo ──────────────────────
    const templateCategoria = categoria.template[acaoId] || '';
    const templatePostura = postura.template || '';
    const templateMecanica = mecanica ? mecanica.descricao : '';
    const templateEspecializacao = especializacao ? especializacao.template : '';

    const descricaoFinal = [templateCategoria, templatePostura, templateMecanica, templateEspecializacao]
      .filter(Boolean)
      .join('\n\n');

    // ── 8. Retorno do objeto de técnica completo ───────────────
    return {
      // Identificação
      nomeCategoria:    categoria.nome,
      nomeAcao:         acao.nome,
      nomePostura:      postura.nome,
      filosofia:        categoria.filosofia,
      icone:            categoria.icone,

      // Mecânica
      nivelSopro:         sopro.nome,
      custoFinal,
      intencaoAcao:       intencao,
      alcance:            categoria.alcance,
      tags,

      // Dado resolvido
      dadoResolvido:      dadoFinal && !dadoFinal.semDano ? dadoFinal.dado : null,
      bonusFixoDado:      dadoFinal ? (dadoFinal.bonusFixo || 0) : 0,
      bonusFlatPorTeto:   dadoFinal ? (dadoFinal.bonusFlatExtra || 0) : 0,
      quantidadeDados,
      tipoRolagem:        (() => {
        if (!dadoFinal || dadoFinal.semDano || !quantidadeDados) return null;
        return intencao === 'defensivo' ? 'absorção' : 'dano';
      })(),

      // Fricção
      friccaoCategoriaAcao:    friccao.friccaoCategoriaAcao,
      friccaoCategoriaPostura: friccao.friccaoCategoriaPostura,

      // Mecânica exclusiva
      mecanicaExclusiva: mecanica ? {
        nome: mecanica.nome,
        ativo: mecanica.ativo,
        condicional: mecanica.condicional,
        condicao: mecanica.condicao || null,
        efeito: mecanica.efeito,
      } : null,

      // Especialização
      especializacao: especializacao ? {
        nome: especializacao.nome,
        tags: especializacao.tags,
        efeito: especializacao.efeito,
      } : null,

      // Ajustes da Postura
      ajustes: { ...postura.ajustes },

      // Evolução da arma
      evolucao: categoria.evolucao,

      // Lore
      descricaoCategoria:   categoria.descricao,
      descricaoAcao:        acao.descricao,
      descricaoPostura:     descricaoPostura,
      descricaoEspecializacao: especializacao ? especializacao.descricao : null,

      // Texto final combinado
      descricaoFinal,
    };
  },


  // ===========================================================
  // ALIAS DE RETROCOMPATIBILIDADE
  // ===========================================================
  gerarTecnicaArmadaSegura(categoriaId, acaoId, posturaId, especializacaoId, nivelSopro, options = {}) {
    return this.gerarTecnicaArmada(categoriaId, acaoId, posturaId, especializacaoId, nivelSopro, options);
  },

};

// Exportação
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sistemaCombateArmado;
}
