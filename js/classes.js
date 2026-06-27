// classes.js — Aetherion RPG System
// 6 Classes Base | 35 Especializações | Gerado conforme instrucoes_claude_classes.md

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
        habilidades: [],
      },
      guerreiro_dos_ventos: {
        nome: 'Guerreiro dos Ventos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['guerreiro', 'soldado dos ventos', 'tempestade de aço'],
        citacao: 'Os Quatro Ventos Dragônicos me ensinaram que a única direção que importa é para frente.',
        pericias: ['atletismo', 'tatica'],
        habilidades: [],
      },
      tecelao_da_lamina: {
        nome: 'Tecelão da Lâmina',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['tecelão', 'mago espadachim', 'lâmina arcana'],
        citacao: 'Eles esperavam encontrar um guerreiro ou um mago. Encontraram a fusão inevitável dos dois.',
        pericias: ['arcanismo', 'atletismo'],
        habilidades: [],
      },
      comandante_da_ordem: {
        nome: 'Comandante da Ordem',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['comandante', 'líder', 'general', 'estrategista'],
        citacao: 'Uma batalha vencida pela força dura um dia; vencida pela mente, uma era.',
        pericias: ['tatica', 'diplomacia'],
        habilidades: [],
      },
      algoz_do_abismo: {
        nome: 'Algoz do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['algoz', 'carrasco abissal', 'verdugo'],
        citacao: 'Aprendi com as sombras que o medo é a única armadura que o inimigo nunca consegue remover.',
        pericias: ['intimidacao', 'fortitude'],
        habilidades: [],
      },
      flagelo_de_zyrhun: {
        nome: 'Flagelo de Zyrhûn',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['flagelo', 'servo de zyrhun', 'campeão corrompido'],
        citacao: 'Zyrhûn não me ofereceu poder — ele me mostrou o poder que sempre existiu sob a carne.',
        pericias: ['ocultismo', 'fortitude'],
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
      cacador_dos_ventos: {
        nome: 'Caçador dos Ventos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['caçador', 'rastreador', 'atirador'],
        citacao: 'A presa nunca vê o vento antes de sentir o corte.',
        pericias: ['percepcao', 'exploracao'],
        habilidades: [],
      },
      dervixe_da_mudanca: {
        nome: 'Dervixe da Mudança',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['dervixe', 'dançarino de batalha', 'acrobata'],
        citacao: 'Sou o olho do furacão — tudo ao meu redor é caos, mas eu sou o silêncio dentro dele.',
        pericias: ['acrobacia', 'furtividade'],
        habilidades: [],
      },
      asceta_do_sopro: {
        nome: 'Asceta do Sopro',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['asceta', 'monge', 'lutador desarmado'],
        citacao: 'Depurando o corpo, encontrei o que os magos buscam por uma vida inteira em seus grimórios.',
        pericias: ['vontade', 'acrobacia'],
        habilidades: [],
      },
      esgrimista_audaz: {
        nome: 'Esgrimista Audaz',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['esgrimista', 'duelista', 'espadachim elegante'],
        citacao: 'Há uma arte em matar com estilo — e eu a pratiquei até se tornar indistinguível de uma dança.',
        pericias: ['acrobacia', 'diplomacia'],
        habilidades: [],
      },
      assassino_do_veu: {
        nome: 'Assassino do Véu',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['assassino', 'sombra do véu', 'matador'],
        citacao: 'O Véu Trincado não é uma barreira — é uma porta pela qual entro sem ser convidado.',
        pericias: ['furtividade', 'ladinagem'],
        habilidades: [],
      },
      gatuno_das_sombras: {
        nome: 'Gatuno das Sombras',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['gatuno', 'ladrão', 'infiltrador das sombras'],
        citacao: 'A noite não me esconde — somos velhos cúmplices, ela e eu.',
        pericias: ['ladinagem', 'enganacao'],
        habilidades: [],
      },
      punho_do_abismo: {
        nome: 'Punho do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['punho', 'lutador abissal', 'berserker ágil'],
        citacao: 'Nythraxis não me deu garras — me fez perceber que minhas mãos sempre foram suficientes.',
        pericias: ['intimidacao', 'atletismo'],
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
        habilidades: [],
      },
      engenheiro_de_sucata: {
        nome: 'Engenheiro de Sucata',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['engenheiro', 'inventor', 'mecânico'],
        citacao: 'Qualquer idiota destrói. Requer gênio — e um bom par de alicates — para reconstruir.',
        pericias: ['artificio', 'investigacao'],
        habilidades: [],
      },
      alquimista_volatil: {
        nome: 'Alquimista Volátil',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['alquimista', 'químico', 'boticário de guerra'],
        citacao: 'A diferença entre veneno e remédio é apenas a dose — e a minha intenção.',
        pericias: ['artificio', 'socorrismo'],
        habilidades: [],
      },
      sabotador_cinico: {
        nome: 'Sabotador Cínico',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['sabotador', 'demolidor', 'agente duplo'],
        citacao: 'Não destruo por raiva nem por lucro. Destruo porque é a única linguagem que todos entendem.',
        pericias: ['investigacao', 'enganacao'],
        habilidades: [],
      },
      infiltrador_do_submundo: {
        nome: 'Infiltrador do Submundo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['infiltrador', 'espião', 'agente do submundo'],
        citacao: 'As pessoas protegem ouro e joias, mas nunca seus segredos — e segredos valem muito mais.',
        pericias: ['malandragem', 'enganacao'],
        habilidades: [],
      },
      trapaceiro_do_acaso: {
        nome: 'Trapaceiro do Acaso',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['trapaceiro', 'apostador', 'vigarista'],
        citacao: 'O acaso não existe — existe apenas quem entende as regras e quem ainda não percebeu que as regras mudam.',
        pericias: ['malandragem', 'discernimento'],
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
        habilidades: [],
      },
      teurgo_do_legado: {
        nome: 'Teurgo do Legado',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['teurgo', 'estudioso divino', 'guardião do legado'],
        citacao: 'Os Primordiais não morreram — vivem em cada palavra antiga que alguém ainda se atreve a pronunciar.',
        pericias: ['legado', 'teologia'],
        habilidades: [],
      },
      inquisidor_implacavel: {
        nome: 'Inquisidor Implacável',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['inquisidor', 'juiz', 'purificador'],
        citacao: 'A fé sem tribunal é piedade. A fé com tribunal é ordem.',
        pericias: ['intimidacao', 'teologia'],
        habilidades: [],
      },
      profeta_da_agonia: {
        nome: 'Profeta da Agonia',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['profeta', 'vidente da dor', 'oráculo corrompido'],
        citacao: 'Cada visão que recebo é uma cicatriz nova na alma — mas nenhuma delas mentiu até hoje.',
        pericias: ['ocultismo', 'discernimento'],
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
        habilidades: [],
      },
      feiticeiro_da_centelha: {
        nome: 'Feiticeiro da Centelha',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['feiticeiro', 'nascido com magia', 'centelha viva'],
        citacao: 'Nunca aprendi magia — ela sempre esteve aqui, esperando que eu parasse de ter medo dela.',
        pericias: ['sintonia', 'tradicao'],
        habilidades: [],
      },
      tecelao_de_miragens: {
        nome: 'Tecelão de Miragens',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['tecelão de ilusão', 'ilusionista', 'artífice de sonhos'],
        citacao: 'A verdade é apenas a miragem que mais pessoas concordaram em acreditar ao mesmo tempo.',
        pericias: ['arcanismo', 'enganacao'],
        habilidades: [],
      },
      cronomante_de_khairos: {
        nome: 'Cronomante de Khairos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['cronomante', 'manipulador do tempo', 'viajante de khairos'],
        citacao: 'Khairos não me ensinou a prever o futuro — me ensinou que o passado ainda não terminou de acontecer.',
        pericias: ['arcanismo', 'percepcao'],
        habilidades: [],
      },
      bruxo_do_sangue: {
        nome: 'Bruxo do Sangue',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['bruxo', 'sangromante', 'feiticeiro de sangue'],
        citacao: 'O sangue é o único contrato que Nythraxis aceita — e ele sempre cobra com juros.',
        pericias: ['ocultismo', 'fortitude'],
        habilidades: [],
      },
      arcanista_da_deformacao: {
        nome: 'Arcanista da Deformação',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['arcanista corrompido', 'deformador', 'mutador arcano'],
        citacao: 'A carne é apenas o rascunho — e eu aprendi a reescrever.',
        pericias: ['ocultismo', 'atletismo'],
        habilidades: [],
      },
      invocador_do_abismo: {
        nome: 'Invocador do Abismo',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['invocador abissal', 'demonologista', 'convocador de nythraxis'],
        citacao: 'Não invoco demônios — firmo acordos com entidades que os demônios temem.',
        pericias: ['ocultismo', 'intimidacao'],
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
        habilidades: [],
      },
      invocador_de_bestas: {
        nome: 'Invocador de Bestas',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['invocador', 'senhor das feras', 'domador'],
        citacao: 'Os animais não precisam de palavras para dizer a verdade — e isso os torna mais honestos do que qualquer homem.',
        pericias: ['adestramento', 'exploracao'],
        habilidades: [],
      },
      avatar_dos_quatro_ventos: {
        nome: 'Avatar dos Quatro Ventos',
        trilha: 'Pura',
        recurso: 'Sopro',
        aliases: ['avatar', 'filho dos ventos', 'elemental vivo'],
        citacao: 'Sou a tempestade que os Dragões Primordiais esqueceram de apagar — e isso foi um erro deles.',
        pericias: ['adaptacao', 'sintonia'],
        habilidades: [],
      },
      senhor_das_catastrofes: {
        nome: 'Senhor das Catástrofes',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['senhor do caos', 'destruidor', 'catalisador'],
        citacao: 'Não trago o fim do mundo — trago o fim do mundo que vocês conhecem.',
        pericias: ['ocultismo', 'adaptacao'],
        habilidades: [],
      },
      calamidade_telurica: {
        nome: 'Calamidade Telúrica',
        trilha: 'Corrompida',
        recurso: 'Mácula',
        aliases: ['calamidade', 'terremoto vivo', 'força geológica'],
        citacao: 'A terra tem memória mais longa do que qualquer civilização — e ela se lembra de cada injustiça.',
        pericias: ['ocultismo', 'atletismo'],
        habilidades: [],
      },
    },
  },

};

// Exportação condicional: compatível com script tag (global) e CommonJS (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = classesRPG;
}
