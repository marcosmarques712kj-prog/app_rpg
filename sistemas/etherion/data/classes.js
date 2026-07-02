// classes.js — Aetherion RPG System
// 6 Classes Base | 54 Especializações | afinidadesRaciais: esqueleto pronto p/ preenchimento futuro

const classesRPG = {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. VANGUARDA
  // ─────────────────────────────────────────────────────────────────────────────
  vanguarda: {
    nome: 'Vanguarda',
    aliases: ['tank', 'guerreiro', 'lutador', 'protetor', 'linha de frente'],
    hpInicial: 12,
    hpPorNivel: 5,
    atributoFoco: 'for',
    atributosChave: ['for', 'cos'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): classe marcial pura — maior atraso, menor teto do grupo.
    atrasoNiveis: 15,
    circuloMaximo: 4,
    // Trava 3 (verbos permitidos): dano físico direto e defesa.
    verbosPermitidos: ['destruir', 'cortar', 'proteger'],
    // Trava 1 (aprendizado livre): marcial pura — sem vagas de escolha livre de aspecto.
    aspectosAprendizado: 0,
    habilidadesComuns: [
      {
        nome: 'Corpo de Aço',
        desc: 'A Vanguarda é forjada no sofrimento. Reduz em 1 todo dano físico recebido (mínimo 1).',
      },
      {
        nome: 'Intimidação de Combate',
        desc: 'Ao eliminar um inimigo, todos os oponentes adjacentes devem realizar um teste de Vontade (CD 13) ou ficam com a condição Abalado até o fim do próximo turno.',
      },
    ],
    especializacoes: {
      paladino_guardiao: {
        nome: 'Paladino Guardião',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['paladino', 'guardião', 'protetor sagrado'],
        citacao: 'Não existe martírio mais nobre do que ser o último escudo entre o abismo e os inocentes.',
        pericias: ['teologia', 'fortitude'],
        // Trava 1: força pura / escudo místico — bate com o conceito de "último escudo".
        aspectoPadrao: 'sopro_archeon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      lamina_voraz: {
        nome: 'Lâmina Voraz',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['guerreiro', 'lâmina implacável', 'tempestade de aço'],
        citacao: 'Não preciso entender por que minha lâmina corta fundo. Só preciso continuar avançando.',
        pericias: ['atletismo', 'tatica'],
        // Trava 1: fúria de combate direta — fogo que não perdoa, avanço implacável.
        aspectoPadrao: 'sol_pyrael',
        afinidadesRaciais: [],
        habilidades: [],
      },
      tecelao_da_lamina: {
        nome: 'Tecelão da Lâmina',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['tecelão', 'mago espadachim', 'lâmina arcana'],
        citacao: 'Eles esperavam encontrar um guerreiro ou um mago. Encontraram a fusão inevitável dos dois.',
        pericias: ['arcanismo', 'atletismo'],
        // Trava 1: aspecto mais claramente "arcano/livresco" — coerente com o override de círculo maior abaixo.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
        // Override da trava 2: especialização mais arcana da Vanguarda — atraso menor, teto maior que a classe base.
        atrasoNiveis: 8,
        circuloMaximo: 6,
      },
      comandante_da_ordem: {
        nome: 'Comandante da Ordem',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['comandante', 'líder', 'general', 'estrategista'],
        citacao: 'Uma batalha vencida pela força dura um dia; vencida pela mente, uma era.',
        pericias: ['tatica', 'diplomacia'],
        // Trava 1: nome da especialização cita a divindade da Ordem diretamente.
        aspectoPadrao: 'ordem_ordelyne',
        afinidadesRaciais: [],
        habilidades: [],
      },
      algoz_do_abismo: {
        nome: 'Algoz do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['algoz', 'carrasco abissal', 'verdugo'],
        citacao: 'Aprendi com as sombras que o medo é a única armadura que o inimigo nunca consegue remover.',
        pericias: ['intimidacao', 'fortitude'],
        // Trava 1: escuridão e dreno de sanidade — combina com o uso do medo como arma.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      flagelo_de_zyrhun: {
        nome: 'Flagelo de Zyrhûn',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['flagelo', 'servo de zyrhun', 'campeão corrompido'],
        citacao: 'Zyrhûn não me ofereceu poder — ele me mostrou o poder que sempre existiu sob a carne.',
        pericias: ['ocultismo', 'fortitude'],
        // Trava 1: citação nomeia a divindade diretamente — sem ambiguidade.
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      escudo_de_maelthra: {
        nome: 'Escudo de Maelthra',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['escudo vivo', 'muralha', 'tanque de terra'],
        citacao: 'A montanha não pede desculpas por estar no caminho — ela apenas está.',
        pericias: ['fortitude', 'vontade'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'terra_maelthra',
        afinidadesRaciais: [],
        habilidades: [],
      },
      furia_desmedida: {
        nome: 'Fúria Desmedida',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['berserker', 'fúria', 'guerreiro descontrolado'],
        citacao: 'Não controlo minha fúria. Apenas escolho onde ela vai bater primeiro.',
        // Assinatura do Vento Sul (Sahryx): fortitude + intimidação
        pericias: ['fortitude', 'intimidacao'],
        // Trava 1: energia bruta e impetuosa — trovão/ira combinam com berserker.
        aspectoPadrao: 'trovao_karyon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      bastiao_silencioso: {
        nome: 'Bastião Silencioso',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['bastião', 'guardião glacial', 'tanque de controle'],
        citacao: 'O inverno não grita antes de congelar um exército inteiro.',
        // Assinatura do Vento Norte (Morvhaël): percepção + furtividade
        pericias: ['percepcao', 'furtividade'],
        // Trava 1: tema gelado explícito + guardião silencioso bate com a lore de Nyvelis.
        aspectoPadrao: 'gelo_nyvelis',
        afinidadesRaciais: [],
        habilidades: [],
      },
      corpo_de_nythraxis: {
        nome: 'Corpo de Nythraxis',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['corpo abissal', 'tanque corrompido', 'carne mutada'],
        citacao: 'Ofereci minha carne ao Véu Trincado. Em troca, ela parou de poder ser cortada.',
        pericias: ['fortitude', 'ocultismo'],
        // Trava 1: mutação de carne é o tema central do Caos de Zyrhûn.
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PRECURSOR
  // ─────────────────────────────────────────────────────────────────────────────
  precursor: {
    nome: 'Precursor',
    aliases: ['assassino', 'espadachim', 'duelista', 'ágil', 'ladrão de combate'],
    hpInicial: 10,
    hpPorNivel: 4,
    atributoFoco: 'agi',
    atributosChave: ['agi', 'sab'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): marcial ágil, atraso considerável.
    atrasoNiveis: 10,
    circuloMaximo: 5,
    // Trava 3 (verbos permitidos): ataque furtivo, mobilidade, manipulação leve.
    verbosPermitidos: ['cortar', 'deslocar', 'alterar'],
    // Trava 1 (aprendizado livre): marcial ágil com ponta de arcanismo — 1 vaga.
    aspectosAprendizado: 1,
    habilidadesComuns: [
      {
        nome: 'Esquiva Reflexiva',
        desc: 'Uma vez por rodada, ao ser alvo de um ataque, pode gastar sua Reação para impor Desvantagem na rolagem de ataque do inimigo.',
      },
      {
        nome: 'Ataque Furtivo',
        desc: 'Quando o Precursor ataca um inimigo que não percebe sua presença ou que está adjacente a um aliado, soma 1d6 extra ao dano.',
      },
    ],
    especializacoes: {
      flecha_implacavel: {
        nome: 'Flecha Implacável',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['caçador', 'rastreador', 'atirador de elite'],
        citacao: 'A presa nunca vê o vento antes de sentir o corte.',
        pericias: ['percepcao', 'exploracao'],
        // Trava 1: vínculo com fauna e rastreio — não há aspecto de "vento" puro, Nyvelis encaixa melhor.
        aspectoPadrao: 'gelo_nyvelis',
        afinidadesRaciais: [],
        habilidades: [],
      },
      dervixe_da_mudanca: {
        nome: 'Dervixe da Mudança',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['dervixe', 'dançarino de batalha', 'acrobata'],
        citacao: 'Sou o olho do furacão — tudo ao meu redor é caos, mas eu sou o silêncio dentro dele.',
        pericias: ['acrobacia', 'furtividade'],
        // Trava 1: tempestade/imprevisibilidade mantendo Trilha Pura (caos_zyrhun seria Mácula).
        aspectoPadrao: 'trovao_karyon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      asceta_do_sopro: {
        nome: 'Asceta do Sopro',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['asceta', 'monge', 'lutador desarmado'],
        citacao: 'Depurando o corpo, encontrei o que os magos buscam por uma vida inteira em seus grimórios.',
        pericias: ['vontade', 'acrobacia'],
        // Trava 1: nome já cita "Sopro"; força pura canalizada pelo próprio corpo.
        aspectoPadrao: 'sopro_archeon',
        afinidadesRaciais: [],
        habilidades: [],
        // Override da trava 2: disciplina interna chega a um patamar mágico equivalente ao de um conjurador dedicado.
        atrasoNiveis: 5,
        circuloMaximo: 7,
      },
      esgrimista_audaz: {
        nome: 'Esgrimista Audaz',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['esgrimista', 'duelista', 'espadachim elegante'],
        citacao: 'Há uma arte em matar com estilo — e eu a pratiquei até se tornar indistinguível de uma dança.',
        pericias: ['acrobacia', 'diplomacia'],
        // Trava 1: elegância/dança mortal como estética de combate — tema de Lyrëa.
        aspectoPadrao: 'beleza_lyrea',
        afinidadesRaciais: [],
        habilidades: [],
      },
      assassino_do_veu: {
        nome: 'Assassino do Véu',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['assassino', 'sombra do véu', 'matador'],
        citacao: 'O Véu Trincado não é uma barreira — é uma porta pela qual entro sem ser convidado.',
        pericias: ['furtividade', 'ladinagem'],
        // Trava 1: escuridão/furtividade — move-se pelas sombras do Véu.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      gatuno_das_sombras: {
        nome: 'Gatuno das Sombras',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['gatuno', 'ladrão', 'infiltrador das sombras'],
        citacao: 'A noite não me esconde — somos velhos cúmplices, ela e eu.',
        pericias: ['ladinagem', 'enganacao'],
        // Trava 1: sombra/noite — mesmo tema de assassino_do_veu.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      punho_do_abismo: {
        nome: 'Punho do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['punho', 'lutador abissal', 'berserker ágil'],
        citacao: 'Nythraxis não me deu garras — me fez perceber que minhas mãos sempre foram suficientes.',
        pericias: ['intimidacao', 'atletismo'],
        // Trava 1: Nythraxis nasce do Caos de Zyrhûn (ver lore do próprio aspecto).
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      mestre_das_esporas: {
        nome: 'Mestre das Esporas',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['toxicomante', 'envenenador', 'alquimista das esporas'],
        citacao: 'Um cogumelo não avisa antes de matar. Eu aprendi a linguagem do silêncio dele.',
        pericias: ['artificio', 'exploracao'],
        // Trava 1: veneno como parte do ciclo biológico/natural, mantendo Trilha Pura (teia_mabryth seria Mácula).
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
      trapaceiro_do_bosque: {
        nome: 'Trapaceiro do Bosque',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['duende trapaceiro', 'ladino feérico', 'pregador de peças'],
        citacao: 'Troquei sua bota pela minha sombra. Você só vai perceber quando tentar correr.',
        pericias: ['furtividade', 'enganacao'],
        // Trava 1: sedução/ilusão feérica — travessuras e encantos.
        aspectoPadrao: 'beleza_lyrea',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. ESPECIALISTA
  // ─────────────────────────────────────────────────────────────────────────────
  especialista: {
    nome: 'Especialista',
    aliases: ['inventor', 'ladino', 'sabotador', 'técnico', 'manipulador'],
    hpInicial: 10,
    hpPorNivel: 4,
    atributoFoco: 'int',
    atributosChave: ['int', 'car'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): híbrida — não conjuradora primária, mas com ponta de arcanismo.
    atrasoNiveis: 8,
    circuloMaximo: 6,
    // Trava 3 (verbos permitidos): criação, ajuste de mecanismos, invocação de constructos/venenos.
    verbosPermitidos: ['manifestar', 'alterar', 'invocar'],
    // Trava 1 (aprendizado livre): híbrida, ponta de arcanismo — 1 vaga.
    aspectosAprendizado: 1,
    habilidadesComuns: [
      {
        nome: 'Análise Tática',
        desc: 'Ao observar um inimigo por um turno completo sem atacar, o Especialista identifica uma fraqueza. Os próximos 2 ataques contra aquele alvo ganham +2 de bônus.',
      },
      {
        nome: 'Adaptabilidade',
        desc: 'O Especialista pode usar qualquer item consumível encontrado sem teste, mesmo que seja de uma categoria não familiar.',
      },
    ],
    especializacoes: {
      cronista_da_tradicao: {
        nome: 'Cronista da Tradição',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['cronista', 'bardo', 'contador de histórias'],
        citacao: 'Os Feyrin me ensinaram que uma história mal contada mata mais devagar do que um veneno — mas com mais dor.',
        pericias: ['tradicao', 'diplomacia'],
        // Trava 1: tradição e conhecimento são o tema central de Aethrýs.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
      },
      engenheiro_de_sucata: {
        nome: 'Engenheiro de Sucata',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['engenheiro', 'inventor', 'mecânico'],
        citacao: 'Qualquer idiota destrói. Requer gênio — e um bom par de alicates — para reconstruir.',
        pericias: ['artificio', 'investigacao'],
        // Trava 1: artifício e construção física — perícia artificio já pertence ao próprio aspecto.
        aspectoPadrao: 'terra_maelthra',
        afinidadesRaciais: [],
        habilidades: [],
      },
      alquimista_volatil: {
        nome: 'Alquimista Volátil',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['alquimista', 'químico', 'boticário de guerra'],
        citacao: 'A diferença entre veneno e remédio é apenas a dose — e a minha intenção.',
        pericias: ['artificio', 'socorrismo'],
        // Trava 1: química biológica de dupla face, mantendo Trilha Pura.
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
      sabotador_cinico: {
        nome: 'Sabotador Cínico',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['sabotador', 'demolidor', 'agente duplo'],
        citacao: 'Não destruo por raiva nem por lucro. Destruo porque é a única linguagem que todos entendem.',
        pericias: ['investigacao', 'enganacao'],
        // Trava 1: destruição corrosiva e cínica — tema do Caos de Zyrhûn.
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      infiltrador_do_submundo: {
        nome: 'Infiltrador do Submundo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['infiltrador', 'espião', 'agente do submundo'],
        citacao: 'As pessoas protegem ouro e joias, mas nunca seus segredos — e segredos valem muito mais.',
        pericias: ['malandragem', 'enganacao'],
        // Trava 1: sombra e dreno de sanidade — espião que vive nos segredos do submundo.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      vigarista_do_veu_trincado: {
        nome: 'Vigarista do Véu Trincado',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['trapaceiro', 'apostador', 'vigarista'],
        citacao: 'O acaso não existe — existe apenas quem entende as regras e quem ainda não percebeu que as regras mudam.',
        pericias: ['malandragem', 'discernimento'],
        // Trava 1: fios de destino/manipulação sutil — quem "tece as regras" do jogo.
        aspectoPadrao: 'teia_mabryth',
        afinidadesRaciais: [],
        habilidades: [],
      },
      voz_de_aethervhal: {
        nome: 'Voz de Aethervhal',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['diplomata', 'negociador', 'face do grupo'],
        citacao: 'Três impérios se tornaram um só reino porque alguém, primeiro, soube ouvir.',
        pericias: ['diplomacia', 'discernimento'],
        // Trava 1: persuasão e carisma — encantamento sedutor como ferramenta diplomática.
        aspectoPadrao: 'beleza_lyrea',
        afinidadesRaciais: [],
        habilidades: [],
      },
      artifice_de_myrran: {
        nome: 'Artífice de Myrran',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['artífice', 'construtor de golens', 'engenheiro arcano'],
        citacao: 'Não dou vida às minhas criações. Só lembro à matéria que ela já esteve viva antes.',
        pericias: ['artificio', 'arcanismo'],
        // Trava 1: a lore do próprio Saber de Aethrýs cita os Myrran — coerência direta.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
        // Override da trava 2: especialização mais próxima de conjuração real dentro da Especialista.
        atrasoNiveis: 4,
        circuloMaximo: 8,
      },
      socorrista_de_aethervhal: {
        nome: 'Socorrista de Aethervhal',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['socorrista', 'médico de campo', 'curandeiro não-mágico'],
        citacao: 'Não preciso de um deus me observando para saber estancar um sangramento.',
        pericias: ['socorrismo', 'investigacao'],
        // Trava 1: cura biológica é o tema exato, mesmo numa abordagem "não-mágica".
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DEVOTO
  // ─────────────────────────────────────────────────────────────────────────────
  devoto: {
    nome: 'Devoto',
    aliases: ['clérigo', 'sacerdote', 'curandeiro', 'servo divino', 'inquisidor'],
    hpInicial: 8,
    hpPorNivel: 3,
    atributoFoco: 'sab',
    atributosChave: ['sab', 'car'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): conjurador divino, atraso pequeno, teto alto.
    atrasoNiveis: 3,
    circuloMaximo: 8,
    // Trava 3 (verbos permitidos): bênçãos, votos, barreiras sagradas.
    verbosPermitidos: ['proteger', 'selar', 'vincular'],
    // Trava 1 (aprendizado livre): conjurador divino — 2 vagas.
    aspectosAprendizado: 2,
    habilidadesComuns: [
      {
        nome: 'Canalização Sagrada',
        desc: 'Uma vez por Descanso Curto, o Devoto pode canalizar energia divina para curar 1d8 + Modificador de SAB PV em um aliado adjacente ou em si mesmo.',
      },
      {
        nome: 'Bênção Persistente',
        desc: 'O Devoto pode manter ativas um número de bênçãos simultâneas igual a 1 + Modificador de CAR (mínimo 1), conforme as regras de Chamados Divinos.',
      },
    ],
    especializacoes: {
      sacerdote_da_luz: {
        nome: 'Sacerdote da Luz',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['sacerdote', 'curandeiro', 'padre da luz'],
        citacao: 'A luz não pede permissão para iluminar — e nem eu peço para curar.',
        pericias: ['teologia', 'socorrismo'],
        // Trava 1: luz radiante é o tema explícito da especialização.
        aspectoPadrao: 'ordem_ordelyne',
        afinidadesRaciais: [],
        habilidades: [],
      },
      teurgo_do_legado: {
        nome: 'Teurgo do Legado',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['teurgo', 'estudioso divino', 'guardião do legado'],
        citacao: 'Os Primordiais não morreram — vivem em cada palavra antiga que alguém ainda se atreve a pronunciar.',
        pericias: ['legado', 'teologia'],
        // Trava 1: perícia legado já pertence ao próprio Tempo de Khaíros; tema histórico/temporal.
        aspectoPadrao: 'tempo_khairos',
        afinidadesRaciais: [],
        habilidades: [],
      },
      inquisidor_implacavel: {
        nome: 'Inquisidor Implacável',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['inquisidor', 'juiz', 'purificador'],
        citacao: 'A fé sem tribunal é piedade. A fé com tribunal é ordem.',
        pericias: ['intimidacao', 'teologia'],
        // Trava 1: Kharvion é o "Senhor das Punições" na própria lore — punição/julgamento severo.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      profeta_da_agonia: {
        nome: 'Profeta da Agonia',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['profeta', 'vidente da dor', 'oráculo corrompido'],
        citacao: 'Cada visão que recebo é uma cicatriz nova na alma — mas nenhuma delas mentiu até hoje.',
        pericias: ['ocultismo', 'discernimento'],
        // Trava 1: dreno de sanidade e visões sombrias, mantendo Trilha Corrompida.
        aspectoPadrao: 'trevas_kharvion',
        afinidadesRaciais: [],
        habilidades: [],
      },
      punho_de_pyrael: {
        nome: 'Punho de Pyraël',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['clérigo de guerra', 'cruzado solar', 'punho sagrado'],
        citacao: 'Pyraël não me deu um cajado. Me deu punhos e disse: "faça o sol nascer com eles".',
        pericias: ['fortitude', 'teologia'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'sol_pyrael',
        afinidadesRaciais: [],
        habilidades: [],
      },
      vidente_de_khairos: {
        nome: 'Vidente de Khaíros',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['oráculo', 'vidente', 'profeta do tempo'],
        citacao: 'Vejo o amanhã do mesmo jeito que vejo o ontem — como algo que já aconteceu.',
        pericias: ['teologia', 'discernimento'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'tempo_khairos',
        afinidadesRaciais: [],
        habilidades: [],
      },
      guardiao_da_ampulheta: {
        nome: 'Guardião da Ampulheta',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['guardião da morte', 'sacerdote funerário', 'guardião das almas'],
        citacao: 'Morvethra não teme a morte. Ela é a única que sabe exatamente quanto tempo cada um tem.',
        pericias: ['teologia', 'vontade'],
        // Trava 1: ampulheta = tempo de vida, mantendo Trilha Pura (morte_morvethra seria Mácula).
        aspectoPadrao: 'tempo_khairos',
        afinidadesRaciais: [],
        habilidades: [],
      },
      escriba_de_aethrys: {
        nome: 'Escriba de Aethrýs',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['escriba', 'sábio devoto', 'guardião da sabedoria'],
        citacao: 'Aethrýs me deu a língua universal. Eu apenas decidi que valia a pena usá-la para ensinar.',
        pericias: ['teologia', 'arcanismo'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TRANSCENDENTE
  // ─────────────────────────────────────────────────────────────────────────────
  transcendente: {
    nome: 'Transcendente',
    aliases: ['mago', 'feiticeiro', 'bruxo', 'arcanista', 'conjurador'],
    hpInicial: 6,
    hpPorNivel: 2,
    atributoFoco: 'car',
    atributosChave: ['int', 'sab'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): conjurador puro — sem atraso, teto máximo.
    atrasoNiveis: 0,
    circuloMaximo: 10,
    // Trava 3 (verbos permitidos): acesso amplo por definição de conjurador puro.
    verbosPermitidos: ['manifestar', 'alterar', 'vincular', 'selar', 'destruir', 'invocar', 'cortar', 'proteger', 'deslocar'],
    // Trava 1 (aprendizado livre): conjurador puro — maior número de vagas do jogo.
    aspectosAprendizado: 3,
    habilidadesComuns: [
      {
        nome: 'Erudição Arcana',
        desc: 'O Transcendente pode identificar qualquer magia ou runa ativa com um teste de Arcanismo (CD 12), sem gastar nenhum recurso.',
      },
      {
        nome: 'Fragilidade do Véu',
        desc: 'Devido à exposição constante ao Motor do Mundo, o Transcendente sofre 1 ponto extra de dano de qualquer fonte mágica corrompida.',
      },
    ],
    especializacoes: {
      mago_da_torre: {
        nome: 'Mago da Torre',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['mago', 'arcanista académico', 'estudioso da torre'],
        citacao: 'A Torre Mágica não forma magos — forma instrumentos capazes de suportar o peso do conhecimento sem quebrar.',
        pericias: ['arcanismo', 'investigacao'],
        // Trava 1: erudição e estudo rigoroso são o tema central de Aethrýs.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
      },
      feiticeiro_da_centelha: {
        nome: 'Feiticeiro da Centelha',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['feiticeiro', 'nascido com magia', 'centelha viva'],
        citacao: 'Nunca aprendi magia — ela sempre esteve aqui, esperando que eu parasse de ter medo dela.',
        pericias: ['sintonia', 'tradicao'],
        // Trava 1: a própria lore de Archëon fala em "centelha que antecede toda a criação".
        aspectoPadrao: 'sopro_archeon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      tecelao_de_miragens: {
        nome: 'Tecelão de Miragens',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['tecelão de ilusão', 'ilusionista', 'artífice de sonhos'],
        citacao: 'A verdade é apenas a miragem que mais pessoas concordaram em acreditar ao mesmo tempo.',
        pericias: ['arcanismo', 'enganacao'],
        // Trava 1: ilusão e espelhos são o tema central de Lyrëa.
        aspectoPadrao: 'beleza_lyrea',
        afinidadesRaciais: [],
        habilidades: [],
      },
      cronomante_de_khairos: {
        nome: 'Cronomante de Khairos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['cronomante', 'manipulador do tempo', 'viajante de khairos'],
        citacao: 'Khairos não me ensinou a prever o futuro — me ensinou que o passado ainda não terminou de acontecer.',
        pericias: ['arcanismo', 'percepcao'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'tempo_khairos',
        afinidadesRaciais: [],
        habilidades: [],
      },
      bruxo_do_sangue: {
        nome: 'Bruxo do Sangue',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['bruxo', 'sangromante', 'feiticeiro de sangue'],
        citacao: 'O sangue é o único contrato que Nythraxis aceita — e ele sempre cobra com juros.',
        pericias: ['ocultismo', 'fortitude'],
        // Trava 1: dreno de vida através do sangue é o tema mais próximo de Morvethra.
        aspectoPadrao: 'morte_morvethra',
        afinidadesRaciais: [],
        habilidades: [],
      },
      arcanista_da_deformacao: {
        nome: 'Arcanista da Deformação',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['arcanista corrompido', 'deformador', 'mutador arcano'],
        citacao: 'A carne é apenas o rascunho — e eu aprendi a reescrever.',
        pericias: ['ocultismo', 'atletismo'],
        // Trava 1: mutação instável é o tema central e explícito de Zyrhûn.
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      invocador_do_abismo: {
        nome: 'Invocador do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['invocador abissal', 'demonologista', 'convocador de nythraxis'],
        citacao: 'Não invoco demônios — firmo acordos com entidades que os demônios temem.',
        pericias: ['ocultismo', 'intimidacao'],
        // Trava 1: pactos e fios que conectam o Véu Trincado a ofertas de poder — tema de Mabryth.
        aspectoPadrao: 'teia_mabryth',
        afinidadesRaciais: [],
        habilidades: [],
      },
      punho_relampejante: {
        nome: 'Punho Relampejante',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['evocador', 'canalizador de raio', 'punho do trovão'],
        citacao: 'O trovão chega depois do raio. Eu prefiro ser a parte que ninguém vê vindo.',
        pericias: ['arcanismo', 'percepcao'],
        // Trava 1: eletricidade é o tema exato de Káryon Thraël.
        aspectoPadrao: 'trovao_karyon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      pactuante_de_lyrea: {
        nome: 'Pactuante de Lyrëa',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['pactuante feérico', 'invocador de fadas', 'convocador élfico'],
        citacao: 'Lyrëa não concede poder — empresta, e cobra em favores que só ela sabe pedir.',
        pericias: ['sintonia', 'diplomacia'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'beleza_lyrea',
        afinidadesRaciais: [],
        habilidades: [],
      },
      tecelao_de_pactos: {
        nome: 'Tecelão de Pactos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['enchanter', 'tecelão de bênçãos', 'suporte arcano'],
        citacao: 'Toda magia que lanço em um aliado é, na verdade, um acordo — e eu sempre cumpro minha parte.',
        pericias: ['arcanismo', 'sintonia'],
        // Trava 1: certeza de que todo ato tem consequência — cumprir o acordo é o tema de Ordelyne.
        aspectoPadrao: 'ordem_ordelyne',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. PRIMORDIAL
  // ─────────────────────────────────────────────────────────────────────────────
  primordial: {
    nome: 'Primordial',
    aliases: ['druida', 'xamã', 'guardião da natureza', 'filho do mundo', 'elemental'],
    hpInicial: 8,
    hpPorNivel: 3,
    atributoFoco: 'cos',
    atributosChave: ['cos', 'sab'],
    // Sem bônus passivo numérico de CA/Deslocamento nas habilidades comuns desta classe.
    bonusCA: 0,
    deslocamentoBonus: 0,
    // Trava 2 (progressão por nível): conjurador natural quase tão puro quanto o Transcendente.
    atrasoNiveis: 2,
    circuloMaximo: 9,
    // Trava 3 (verbos permitidos): criação de vida, invocação de bestas, transformação, força elemental.
    verbosPermitidos: ['manifestar', 'invocar', 'alterar', 'destruir'],
    // Trava 1 (aprendizado livre): conjurador natural amplo — 2 vagas.
    aspectosAprendizado: 2,
    habilidadesComuns: [
      {
        nome: 'Sangue do Mundo',
        desc: 'O Primordial possui resistência natural aos efeitos climáticos dos Quatro Ventos Dragônicos, realizando testes de Adaptação com Vantagem.',
      },
      {
        nome: 'Regeneração Primordial',
        desc: 'No início de cada turno, enquanto estiver em contato com terra natural (não pavimentada), recupera 1 PV automaticamente.',
      },
    ],
    especializacoes: {
      tecelao_de_archeon: {
        nome: 'Tecelão de Archëon',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['tecelão de archeon', 'criador', 'servo do motor'],
        citacao: 'Archëon não criou o mundo de uma vez — ele ainda o está criando, e eu sou parte desse processo.',
        pericias: ['sintonia', 'adaptacao'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'sopro_archeon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      invocador_de_bestas: {
        nome: 'Invocador de Bestas',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['invocador', 'senhor das feras', 'domador'],
        citacao: 'Os animais não precisam de palavras para dizer a verdade — e isso os torna mais honestos do que qualquer homem.',
        pericias: ['adestramento', 'exploracao'],
        // Trava 1: vínculo com a fauna é o tema exato de Nyvelis.
        aspectoPadrao: 'gelo_nyvelis',
        afinidadesRaciais: [],
        habilidades: [],
      },
      avatar_dos_quatro_ventos: {
        nome: 'Avatar dos Quatro Ventos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['avatar', 'filho dos ventos', 'elemental vivo'],
        citacao: 'Sou a tempestade que os Dragões Primordiais esqueceram de apagar — e isso foi um erro deles.',
        // Canaliza os 4 Ventos simultaneamente, então não herda a Assinatura de um Vento
        // específico (percepção+furtividade / fortitude+intimidação / acrobacia+arcanismo /
        // tradição+discernimento) — mantidas as perícias de sintonia ampla original.
        pericias: ['adaptacao', 'sintonia'],
        // Trava 1: tempestade/força elemental bruta — o mais amplo entre os aspectos de sopro natural.
        aspectoPadrao: 'trovao_karyon',
        afinidadesRaciais: [],
        habilidades: [],
      },
      senhor_das_catastrofes: {
        nome: 'Senhor das Catástrofes',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['senhor do caos', 'destruidor', 'catalisador'],
        citacao: 'Não trago o fim do mundo — trago o fim do mundo que vocês conhecem.',
        pericias: ['ocultismo', 'adaptacao'],
        // Trava 1: tema explícito de caos e destruição total.
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      calamidade_telurica: {
        nome: 'Calamidade Telúrica',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['calamidade', 'terremoto vivo', 'força geológica'],
        citacao: 'A terra tem memória mais longa do que qualquer civilização — e ela se lembra de cada injustiça.',
        pericias: ['ocultismo', 'atletismo'],
        // Trava 1: força destrutiva/corrosiva mantendo Trilha Corrompida (terra_maelthra seria Pura).
        aspectoPadrao: 'caos_zyrhun',
        afinidadesRaciais: [],
        habilidades: [],
      },
      seiva_de_verdarin: {
        nome: 'Seiva de Verdarin',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['druida curador', 'guardião verde', 'curandeira da floresta'],
        citacao: 'Uma ferida, pra mim, é só uma pergunta que a floresta ainda não respondeu.',
        pericias: ['socorrismo', 'sintonia'],
        // Trava 1: cura biológica é o tema exato de Elysséra.
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
      sangue_de_lihzahrd: {
        nome: 'Sangue de Lihzahrd',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['metamorfo', 'sangue dracônico', 'forma bestial'],
        citacao: 'Quatro dragões moldaram meus ancestrais. Eu ainda não decidi qual forma é a minha de verdade.',
        pericias: ['adaptacao', 'atletismo'],
        // Trava 1: metamorfose orgânica benéfica — não há aspecto dracônico dedicado nos 16 existentes.
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
      praga_de_nythraxis: {
        nome: 'Praga de Nythraxis',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['praga viva', 'pântano corrompido', 'doença ambulante'],
        citacao: 'Não trago a peste. Eu sou a pergunta que a terra faz quando já não aguenta mais ficar saudável.',
        pericias: ['ocultismo', 'exploracao'],
        // Trava 1: pragas místicas é tema explícito e literal de Mabryth.
        aspectoPadrao: 'teia_mabryth',
        afinidadesRaciais: [],
        habilidades: [],
      },
    },
  },

};

// Exportação condicional: compatível com script tag (global) e CommonJS (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = classesRPG;
}
// Garante visibilidade global quando carregado via <script> no browser
if (typeof window !== 'undefined') {
  window.classesRPG = classesRPG;
}
