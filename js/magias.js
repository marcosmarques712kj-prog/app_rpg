// =============================================================
// BANCO DE DADOS COMBINATÓRIO DE MAGIA — AETHERION
// =============================================================
// Sistema modular de 3 camadas:
//   Aspecto (15) × Verbo (9) × Modificador (7+)
//
// Cada combinação gera uma receita única de magia. As strings
// de lore foram escritas para refletir o tom de fantasia sombria,
// horror cósmico e a mitologia dos deuses de Aetherion.
//
// Exporta o objeto `sistemaMagia` com:
//   - aspectos{}       → 15 aspectos divinos/primais
//   - verbos{}         → 9 verbos de ação (com propriedade `intencao`)
//   - modificadores{}  → modificadores com `descricao` tripartido por intenção
//
// REFATORAÇÃO V4.0 — Arquitetura de Intenções:
//   - Verbos classificados por intenção: 'ofensivo' | 'defensivo' | 'utilidade'
//   - Modificadores com descricao.ofensivo / .defensivo / .utilidade
//   - gerarDescricaoMagia() resolve a string correta por intenção do verbo
//   - Blindagem NaN: ajDadoFaces e ajDadoBase protegidos com || 0
//
// Toda a matemática de escalonamento é tratada via funções
// que recebem o `circulo` (1 a 10).
// =============================================================

const sistemaMagia = {

  // ===========================================================
  // MOTOR DE CURVAS — Funções matemáticas de escalonamento
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
  // CAMADA 4 (MOTOR) — ESCADA DE DADOS À PROVA DE QUEBRAS
  // ===========================================================
  // Ordem progressiva das faces de dado usadas pelos Aspectos e
  // ajustada dinamicamente por Verbos/Manifestações que sobem ou
  // descem o "degrau" do dado (ex: Lança = +1 degrau, Cone = -1 degrau).
  //
  // Brechas fechadas pela Auditoria Red Team (ver V3.1):
  //   - "Piso de Vidro": Aspectos que já nascem em d4 (Aethrýs, Mabryth)
  //     não podem cair mais. Em vez de conceder dados em dobro de
  //     graça, a função corta o Bônus Fixo original pela metade como
  //     penalidade compensatória.
  //   - "Teto de Vidro": Aspectos que já nascem em d12 (Morvethra,
  //     Zyrhûn) não podem subir mais. Em vez de perder o bônus de
  //     Geometria (ex: Lança +2 degraus), o excedente de degraus é
  //     convertido em dano fixo letal (+2 de Dano Fixo por dado, por
  //     degrau excedente).
  // ===========================================================
  escadaDados: ['d4', 'd6', 'd8', 'd10', 'd12'],

  /**
   * Ajusta o degrau (face) de um dado de forma segura, absorvendo
   * tentativas de descer abaixo de d4 ou subir acima de d12 sem
   * quebrar o balanceamento do sistema.
   *
   * @param {number} indiceBase        — índice atual em escadaDados (0 = d4 ... 4 = d12)
   * @param {number} alteracao         — quantos degraus subir (+) ou descer (-)
   * @param {number} bonusFixoOriginal — bônus fixo de dano já acumulado (ex: de Ordelyne, Aethrýs)
   * @returns {{ dado: string, indiceFinal: number, bonusFixo: number, bonusFlatExtra: number }}
   */
  ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal = 0) {
    const indiceBruto = indiceBase + alteracao;
    let bonusFixo = bonusFixoOriginal;
    let bonusFlatExtra = 0;

    if (indiceBruto < 0) {
      // Piso de Vidro: não há "d2". Penaliza cortando o bônus fixo pela metade.
      bonusFixo = Math.floor(bonusFixoOriginal / 2);
      return { dado: this.escadaDados[0], indiceFinal: 0, bonusFixo, bonusFlatExtra };
    }

    if (indiceBruto > this.escadaDados.length - 1) {
      // Teto de Vidro: não há acima de d12. Converte excedente em dano fixo letal.
      const excedente = indiceBruto - (this.escadaDados.length - 1);
      bonusFlatExtra = excedente * 2;
      return { dado: this.escadaDados[this.escadaDados.length - 1], indiceFinal: this.escadaDados.length - 1, bonusFixo, bonusFlatExtra };
    }

    return { dado: this.escadaDados[indiceBruto], indiceFinal: indiceBruto, bonusFixo, bonusFlatExtra };
  },

  // ===========================================================
  // ETIQUETAS QUALITATIVAS — Conversão valor bruto → rótulo
  // ===========================================================
  etiquetas: {
    alcance:       ['Toque', 'Curta', 'Média', 'Longa', 'Persiste até acertar'],
    area:          ['Alvo Único', 'Dois Alvos', 'Pequena Área', 'Grande Área', 'Devastação Total'],
    duracao:       ['Instantânea', '1 Turno', 'Cena', 'Até dissipar', 'Permanente'],
    visibilidade:  ['Imperceptível', 'Perceptível', 'Chamativa', 'Incontrolável', 'Evento Histórico'],
    sequela:       ['Nenhuma', 'Leve', 'Moderada', 'Severa'],
  },

  // ===========================================================
  // RESUMO DO CÍRCULO — Visão rápida por círculo para o Mestre
  // ===========================================================
  resumoCirculo: {
    1:  { titulo: 'Centelha',         desc: 'Um feitiço frágil — pouco mais que um truque controlado.' },
    2:  { titulo: 'Fagulha',          desc: 'Força suficiente para ferir ou impressionar, mas ainda contida.' },
    3:  { titulo: 'Chama',            desc: 'Magia real. Visível, perigosa, digna de respeito.' },
    4:  { titulo: 'Tempestade',       desc: 'O conjurador demonstra domínio — os leigos recuam por instinto.' },
    5:  { titulo: 'Cataclisma',       desc: 'Poder que muda o curso de uma batalha inteira.' },
    6:  { titulo: 'Devastação',       desc: 'Força que rivaliza com os feitos menores dos Semi-Deuses.' },
    7:  { titulo: 'Calamidade',       desc: 'Magia que deixa cicatrizes no terreno. Testemunhas jamais esquecem.' },
    8:  { titulo: 'Hecatombe',        desc: 'O mundo treme. O Véu estala. Os deuses sentem a perturbação.' },
    9:  { titulo: 'Apocalipse',       desc: 'Poder reservado aos Escolhidos. Facções inteiras mudam de curso.' },
    10: { titulo: 'Gênese Invertida', desc: 'Um eco da Criação — ou da sua antítese. O que veio a seguir não tem nome mortal.' },
  },


  // ===========================================================
  // CAMADA 1 — OS 15 ASPECTOS DIVINOS E PRIMAIS
  // ===========================================================
  // Cada aspecto define:
  //   nome       → nome de exibição
  //   divindade  → deus/entidade patrono(a)
  //   pericias   → array de perícias de conjuração válidas
  //   recurso    → 'sopro' (Trilha Pura) ou 'macula' (Trilha Corrompida)
  //   elemento   → tipo de dano/efeito narrativo
  //   descricao  → texto de lore poético-narrativo
  //   corHex     → cor temática para a UI
  //   icone      → emoji representativo

  aspectos: {

    // ─────────────────────────────────────────────────
    // 1. SOPRO DE ARCHËON — Força Criadora Primordial
    // ─────────────────────────────────────────────────
    sopro_archeon: {
      nome: 'Sopro de Archëon',
      divindade: 'Archëon',
      pericias: ['sintonia'],
      recurso: 'sopro',
      elemento: 'Força Pura / Escudo Místico',
      descricao:
        'Antes que houvesse matéria, antes que o tempo ousasse contar seus ' +
        'primeiros grãos, existia apenas o Sonhador — Archëon, a alma jovem ' +
        'e pura cuja euforia deu forma ao vazio. Canalizar o Sopro é tocar ' +
        'a centelha que antecede toda a criação: uma força bruta e luminosa ' +
        'que percorre as veias ocultas de Aetherion como sangue adormecido. ' +
        'Quem invoca este aspecto sente o peso do universo antes do primeiro ' +
        'amanhecer — o êxtase silencioso de um deus que sonhou tão forte que ' +
        'o nada se despedaçou e deu lugar às estrelas. Escudos tecidos com ' +
        'esta energia brilham com a mesma inocência que criou o mundo, mas ' +
        'carregam o poder terrível de quem nunca conheceu limites.',
      corHex: '#E8D5B7',
      icone: '♾️',
      dadoBase: 'd8',
      tracos: { escalaAlcance: 1.0, escalaArea: 1.0, escalaDuracao: 0.8, escalaVisibilidade: 1.4 },
      sequela: {
        leve:     'Uma euforia efêmera invade o conjurador, seguida de um cansaço súbito — como despertar de um sonho vívido demais.',
        moderada: 'As veias do conjurador brilham com luz branca por breves segundos. Exaustão física se instala: -1 em testes de Força até o próximo descanso.',
        severa:   'O conjurador ouve o eco distante do Sonho de Archëon — um sussurro de criação que preenche a mente e esvazia o corpo. Cai Exausto por 1 rodada.',
      }
    },

    // ─────────────────────────────────────────────────
    // 2. SOL DE PYRAËL — Fogo Solar Devastador
    // ─────────────────────────────────────────────────
    sol_pyrael: {
      nome: 'Sol de Pyraël',
      divindade: 'Pyraël',
      pericias: ['sintonia', 'intimidacao'],
      recurso: 'sopro',
      elemento: 'Fogo Solar / Derreter Defesas / Queimado',
      descricao:
        'Quando Pyraël lançou seu domínio sobre o globo recém-formado, o ' +
        'calor era tão intenso que as águas de Nerýth evaporavam antes de ' +
        'tocar a pedra. O Sol não é gentil — é o olho furioso de um deus ' +
        'que forjou pólos de calor extremo e cujas chamas derreteram as ' +
        'primeiras montanhas. Invocar o aspecto solar é empunhar a ira ' +
        'incandescente de Pyraël: labaredas brancas que não apenas queimam, ' +
        'mas liquefazem armaduras, reduzem ossos a cinza e selam feridas ' +
        'com cauterização brutal. A carne tocada por este fogo não cicatriza ' +
        '— ela se funde, se deforma, e carrega para sempre a marca do sol ' +
        'que não perdoa os fracos. Os Grotans Solares sabem: onde Pyraël ' +
        'ilumina, não há sombra onde o mal se esconda, apenas brasas.',
      corHex: '#FF6B1A',
      icone: '☀️',
      dadoBase: 'd10',
      tracos: { escalaAlcance: 1.0, escalaArea: 1.6, escalaDuracao: 0.5, escalaVisibilidade: 2.0 },
      sequela: {
        leve:     'As palmas das mãos do conjurador ficam vermelhas e quentes ao toque por alguns minutos.',
        moderada: 'A pele do conjurador arde como se exposta ao sol do meio-dia. Suor escorre dos poros e a respiração se torna pesada.',
        severa:   'Queimaduras leves surgem nos braços do conjurador. O ar ao redor cheira a metal quente, e marcas solares se desenham na pele como tatuagens fugitivas.',
      }
    },

    // ─────────────────────────────────────────────────
    // 3. LUA DE NYXARA — Clarividência e Controle Sutil
    // ─────────────────────────────────────────────────
    lua_nyxara: {
      nome: 'Lua de Nyxara',
      divindade: 'Nyxara',
      pericias: ['percepcao', 'furtividade'],
      recurso: 'sopro',
      elemento: 'Clarividência / Revelação / Controle Mental',
      descricao:
        'A Lua traz consigo a noite, o descanso e os perigos que dançam ' +
        'nas sombras — Nyxara foi uma das primeiras a nascer do sonho de ' +
        'Archëon, e dela brotaram Nerýth, Morvethra e a própria Mabryth. ' +
        'Seu domínio é o véu entre o que se vê e o que se esconde. ' +
        'Canalizar a Lua é abrir o terceiro olho à luz prateada que revela ' +
        'mapas ocultos, sussurra verdades enterradas e tece fios invisíveis ' +
        'na mente dos desatentos. Nyxara disputou os céus com Pyraël até ' +
        'que Khaíros forjou o ciclo de dias e noites, criando eclipses como ' +
        'campos de batalha cósmica. Nos eclipses, dizem os Elvarin Lunares ' +
        'de Nyrvald, a magia da Lua sangra para o mundo mortal com uma ' +
        'intensidade que devora sanidade e revela segredos que deveriam ' +
        'permanecer sepultados nas profundezas da memória.',
      corHex: '#B8C6E0',
      icone: '🌙',
      dadoBase: 'd6',
      tracos: { escalaAlcance: 1.2, escalaArea: 0.7, escalaDuracao: 1.8, escalaVisibilidade: 0.5 },
      sequela: {
        leve:     'Os olhos do conjurador ganham um brilho prateado por alguns instantes. Uma leve sonolência percorre o corpo.',
        moderada: 'A percepção do conjurador se distorce — sombras parecem se mover, sussurros inaudíveis roçam os ouvidos. Desorientação por 1 turno.',
        severa:   'O conjurador perde a noção de tempo. Para ele, passaram minutos; para os outros, segundos. Visões de luar inundam a mente e segredos alheios sussurram nos cantos do pensamento.',
      }
    },

    // ─────────────────────────────────────────────────
    // 4. TEMPO DE KHAÍROS — Fluxo Temporal
    // ─────────────────────────────────────────────────
    tempo_khairos: {
      nome: 'Tempo de Khaíros',
      divindade: 'Khaíros',
      pericias: ['arcanismo', 'legado'],
      recurso: 'sopro',
      elemento: 'Manipulação Temporal / Aceleração / Desaceleração',
      descricao:
        'Khaíros observou as disputas eternas entre Sol e Lua pelo domínio ' +
        'dos céus e, com paciência calculada, teceu o grande equilíbrio: o ' +
        'ciclo de dias e noites, o giro das estações, o peso inexorável de ' +
        'cada segundo que passa. Dele brotou parte do sacrifício que gerou ' +
        'Morvethra — a Morte encarnada — pois o Tempo é irmão do Fim. ' +
        'Canalizar Khaíros é arrancar fios do próprio tear da causalidade: ' +
        'desacelerar o instante em que a lâmina desce sobre o pescoço, ' +
        'acelerar o coração de um aliado até que seus músculos atuem antes ' +
        'do pensamento, ou congelar um adversário num fragmento de eternidade ' +
        'onde cada segundo dura mil anos de agonia silenciosa. Quem abusa do ' +
        'Tempo, porém, sente seus ossos envelhecerem — pois Khaíros cobra ' +
        'cada grão de areia roubado de sua ampulheta.',
      corHex: '#C9A84C',
      icone: '⏳',
      dadoBase: 'd6',
      tracos: { escalaAlcance: 1.4, escalaArea: 0.6, escalaDuracao: 1.6, escalaVisibilidade: 0.6 },
      sequela: {
        leve:     'Alguns fios de cabelo do conjurador embranquecem momentaneamente, voltando à cor natural em minutos.',
        moderada: 'O conjurador sente o peso dos anos — as articulações estralam, a pele parece ressecada. Envelhecimento visual que reverte após uma hora.',
        severa:   'O tempo cobra seu preço. O conjurador envelhece visivelmente por um dia inteiro: rugas, postura encurvada, mãos trêmulas. Funcional, mas visivelmente marcado.',
      }
    },

    // ─────────────────────────────────────────────────
    // 5. SABER DE AETHRÝS — Contramágica e Runas
    // ─────────────────────────────────────────────────
    saber_aethrys: {
      nome: 'Saber de Aethrýs',
      divindade: 'Aethrýs',
      pericias: ['tradicao', 'investigacao'],
      recurso: 'sopro',
      elemento: 'Contramágica / Silêncio / Decifrar Runas',
      descricao:
        'Aethrýs, a Deusa da Sabedoria e das Guerras, desceu dos céus como ' +
        'um avatar de tonalidade verde, coberta de letras e palavras de ' +
        'conhecimento, e os três maiores imperadores de Aetherion curvaram-se ' +
        'diante de sua presença. Foi ela quem concedeu a língua universal, ' +
        'quem deu consciência aos Grotans e quem abençoou as primeiras raças ' +
        'com entendimento cosmológico. Invocar seu Saber é empunhar a lâmina ' +
        'do intelecto contra a tapeçaria bruta da magia: dissipar encantos ' +
        'tecidos por mãos inferiores, silenciar conjuradores que ousam ' +
        'profanar os arcanos, e decifrar runas tão antigas que foram ' +
        'gravadas antes que os mortais aprendessem a sangrar. Cada glifo ' +
        'lido é um fragmento do conhecimento que Aethrýs compartilha com ' +
        'relutância — pois ela sabe que sabedoria demais na mão dos ' +
        'ambiciosos só traz ruína, como os Myrran guardam em segredo.',
      corHex: '#4CAF50',
      icone: '🦉',
      dadoBase: 'd4',
      bonusFixoDados: (c) => c * 2,
      tracos: { escalaAlcance: 1.2, escalaArea: 0.8, escalaDuracao: 1.0, escalaVisibilidade: 0.8 },
      sequela: {
        leve:     'Uma dor de cabeça aguda e breve, como se informação demais tivesse sido processada de uma vez.',
        moderada: 'Sangramento nasal. Glifos fantasma piscam na visão periférica do conjurador por alguns minutos.',
        severa:   'Sobrecarga cognitiva — o conjurador recebe um flash de conhecimento não solicitado (o Mestre narra uma informação). Enxaqueca incapacitante por 1 turno.',
      }
    },

    // ─────────────────────────────────────────────────
    // 6. VIDA DE ELYSSÉRA — Cura Biológica e Mutações
    // ─────────────────────────────────────────────────
    vida_elyssera: {
      nome: 'Vida de Elysséra',
      divindade: 'Elysséra',
      pericias: ['socorrismo', 'adestramento'],
      recurso: 'sopro',
      elemento: 'Cura Biológica / Mutações Benéficas',
      descricao:
        'Elysséra sentiu que o mundo moldado pelos deuses estava pronto para ' +
        'ser povoado por criaturas pensantes, capazes de criar histórias ' +
        'épicas e cantos lendários. Foi dela o ímpeto que forjou os ' +
        'Primordiais — o primeiro experimento mortal — e dela o sacrifício ' +
        'que, junto a Khaíros e Nyxara, deu origem a Morvethra, a Morte. ' +
        'Canalizar a Vida é mergulhar as mãos no barro ensanguentado da ' +
        'criação: ossos estilhaçados se reagrupam com estalos úmidos, carne ' +
        'rasgada se costura fibra a fibra, e órgãos perfurados se regeneram ' +
        'com um pulso de dor aguda seguida de alívio. Mas a Vida de Elysséra ' +
        'não é delicada — ela é crua, visceral, um motor biológico que pode ' +
        'forçar mutações benéficas na carne do conjurador: garras de osso, ' +
        'pele endurecida como casca de árvore ancestral, sentidos aguçados ' +
        'como os dos Feyrin que se movem pelas raízes da floresta.',
      corHex: '#66BB6A',
      icone: '📖',
      dadoBase: 'd8',
      tracos: { escalaAlcance: 0.8, escalaArea: 1.0, escalaDuracao: 1.4, escalaVisibilidade: 1.0 },
      sequela: {
        leve:     'Uma fome voraz invade o conjurador. O corpo exige nutrientes como se tivesse corrido por horas.',
        moderada: 'Coceira intensa nos braços — a pele parece repuxar como se algo crescesse sob a superfície. Fome extrema.',
        severa:   'Crescimento orgânico breve — musgos ou brotos minúsculos germinam nos ombros ou cabelo do conjurador, secando e caindo após 1 hora. O corpo dói como após um parto.',
      }
    },

    // ─────────────────────────────────────────────────
    // 7. TERRA DE MAELTHRA — Pedra, Abalo e Defesa
    // ─────────────────────────────────────────────────
    terra_maelthra: {
      nome: 'Terra de Maelthra',
      divindade: 'Maelthra',
      pericias: ['fortitude', 'artificio'],
      recurso: 'sopro',
      elemento: 'Paredes de Pedra / Abalos Táteis / Defesa Física',
      descricao:
        'Maelthra formou o globo de Aetherion com o peso de suas mãos ' +
        'titânicas, e o sangue de Archëon correu pelas veias do mundo ' +
        'recém-nascido como magma primordial. Dela nasceram os Elvarin e ' +
        'os Durkan — raças talhadas em rocha e raiz. Dela também nasceram ' +
        'Káryon Thraël, Nerýth Kalos e o sombrio Kharvion. Invocar a Terra ' +
        'é despertar o organismo vivo que pulsa sob os pés de cada mortal: ' +
        'paredes de granito negro irrompem do solo com a fúria de um planeta ' +
        'que se defende, tremores táteis deslocam exércitos inteiros sobre ' +
        'terreno instável, e a própria rocha se funde à pele do conjurador ' +
        'como a armadura definitiva. Os Durkhar das Profundezas sabem que, ' +
        'nas entranhas de Aetherion, a pedra sussurra — e quem ouve seus ' +
        'segredos ergue fortalezas que nem o Caos de Zyrhûn derrubou.',
      corHex: '#8D6E63',
      icone: '🪨',
      dadoBase: 'd10',
      tracos: { escalaAlcance: 0.6, escalaArea: 1.4, escalaDuracao: 1.2, escalaVisibilidade: 1.4 },
      sequela: {
        leve:     'Os pés do conjurador parecem mais pesados. A pele das mãos fica temporariamente áspera como lixa.',
        moderada: 'Peso nos membros — o conjurador se move como se carregasse uma armadura invisível. -1 em Agilidade por 1 turno.',
        severa:   'A pele do conjurador ganha uma textura rochosa visível por horas. Rachaduras finas se desenham nos antebraços como veios de minério. Bonito e assustador.',
      }
    },

    // ─────────────────────────────────────────────────
    // 8. CAOS DE ZYRHÛN — Corrosão e Mutação Instável
    // ─────────────────────────────────────────────────
    caos_zyrhun: {
      nome: 'Caos de Zyrhûn',
      divindade: 'Zyrhûn',
      pericias: ['ocultismo'],
      recurso: 'macula',
      elemento: 'Dano Corrosivo / Mutações Instáveis',
      descricao:
        'Após mil anos de harmonia, Zyrhûn — o Deus da Loucura e do Caos — ' +
        'decidiu testar os limites do livre-arbítrio. Semeou a mácula da ' +
        'destruição pelo mundo, desencadeando uma guerra que arruinou campos, ' +
        'poluiu águas e escravizou animais até o colapso. Seu experimento ' +
        'trincou o próprio Véu, dando origem a Nythraxis e às aberrações ' +
        'que rastejam nas fissuras da realidade. Mesmo aprisionado no grau ' +
        'mais profundo do Submundo, sua energia ainda flui para o mundo ' +
        'físico — pois o Caos é necessário. Canalizar Zyrhûn é beber do ' +
        'veneno que corrói a ordem natural: ácido arcano que dissolve carne ' +
        'e metal com igual voracidade, mutações grotescas que retorcem ' +
        'membros em formas impossíveis, e uma euforia demente que promete ' +
        'poder ilimitado enquanto devora a sanidade do conjurador grão a ' +
        'grão. Os Grotans Corrompidos entenderam: não há regras, não há ' +
        'honra — apenas a aniquilação desenfreada que Zyrhûn sussurra ' +
        'das profundezas de sua cela eterna.',
      corHex: '#9C27B0',
      icone: '💥',
      dadoBase: 'd12',
      tracos: { escalaAlcance: 1.0, escalaArea: 1.2, escalaDuracao: 0.6, escalaVisibilidade: 1.8 },
      sequela: {
        leve:     'Um olho do conjurador muda de cor por alguns minutos. Um riso nervoso e involuntário escapa dos lábios.',
        moderada: 'Mutação cosmética temporária — dedos alongam, pele muda de tom, pupilas se fendem como as de um réptil. Reverte em 1 hora. Mácula aumenta em +1.',
        severa:   'Corrupção real. O corpo do conjurador se retorce brevemente — um membro se alonga, dentes se afilam, veias negras pulsam visivelmente. Mácula aumenta em +3. Mutação pode deixar cicatriz permanente (a critério do Mestre).',
      }
    },

    // ─────────────────────────────────────────────────
    // 9. TROVÃO DE KÁRYON THRAËL — Eletricidade e Ira
    // ─────────────────────────────────────────────────
    trovao_karyon: {
      nome: 'Trovão de Káryon Thraël',
      divindade: 'Káryon Thraël',
      pericias: ['atletismo', 'intimidacao'],
      recurso: 'sopro',
      elemento: 'Eletricidade / Empurrão / Atordoamento',
      descricao:
        'Káryon Thraël foi forjado pela necessidade: as forças naturais de ' +
        'Pyraël e Nyxara rasgavam o equilíbrio climático, e o mundo precisava ' +
        'de um guardião dos céus. Mas Káryon não é um mediador sereno — ' +
        'carrega a ira das tempestades consigo, o rugido dos trovões que ' +
        'cortam os céus como a lâmina de um deus enfurecido. Os Grotans dos ' +
        'Trovões cultuam-no porque entendem: o som do trovão é o próprio ' +
        'grito de guerra da criação, a batalha eterna entre calor e frio ' +
        'que se resolve em relâmpagos. Canalizar o Trovão é convocar essa ' +
        'fúria celestial: arcos de eletricidade que percorrem armaduras de ' +
        'metal como serpentes de luz, ondas de choque que arremessam corpos ' +
        'contra paredes com brutalidade sônica, e o atordoamento absoluto ' +
        'que paralisa o sistema nervoso do alvo como se o próprio céu o ' +
        'tivesse escolhido para punir. O ar cheira a ozônio e medo.',
      corHex: '#42A5F5',
      icone: '⚡',
      dadoBase: 'd10',
      tracos: { escalaAlcance: 1.2, escalaArea: 1.2, escalaDuracao: 0.4, escalaVisibilidade: 2.2 },
      sequela: {
        leve:     'Zumbido nos ouvidos do conjurador por alguns minutos. O cabelo fica eriçado com estática.',
        moderada: 'Espasmos musculares involuntários num braço. Faíscas saltam das pontas dos dedos. Audição reduzida temporariamente.',
        severa:   'Descarga residual — o conjurador leva um choque próprio. Queimadura leve nos dedos, espasmos por 1 turno, e o trovão do feitiço ensurdece o conjurador por 1 minuto.',
      }
    },

    // ─────────────────────────────────────────────────
    // 10. OCEANOS DE NERÝTH KALOS — Impacto Aquático
    // ─────────────────────────────────────────────────
    oceanos_neryth: {
      nome: 'Oceanos de Nerýth',
      divindade: 'Nerýth Kalos',
      pericias: ['adaptacao', 'exploracao'],
      recurso: 'sopro',
      elemento: 'Impacto Aquático / Terreno Lento / Purificação',
      descricao:
        'Nerýth Kalos nasceu da união entre a Lua e a Terra — Nyxara e ' +
        'Maelthra o conceberam para governar o fluxo das águas que ' +
        'inundavam o mundo recém-esculpido pelos Quatro Dragões. Quando ' +
        'sua presença tocou Aetherion, as vegetações proliferaram com uma ' +
        'intensidade que fascinou os próprios deuses. Mas as águas de ' +
        'Nerýth não são gentis riachos de aldeia — são o oceano primordial ' +
        'que uma vez cobriu tudo, a massa titânica que precisou dos Dragões ' +
        'para ser domada. Canalizar os Oceanos é empunhar a pressão ' +
        'esmagadora das profundezas abissais: torrentes que destroçam ' +
        'formações de batalha, inundações que transformam o campo em ' +
        'terreno traiçoeiro onde cada passo é uma luta contra a correnteza, ' +
        'e a purificação brutal de águas que lavam venenos e máculas como ' +
        'o dilúvio que limpou os campos arruinados após a guerra de Zyrhûn.',
      corHex: '#0288D1',
      icone: '🌊',
      dadoBase: 'd8',
      tracos: { escalaAlcance: 1.0, escalaArea: 1.2, escalaDuracao: 1.2, escalaVisibilidade: 1.0 },
      sequela: {
        leve:     'O conjurador tosse — uma sensação de água nos pulmões que passa em segundos. A roupa fica úmida.',
        moderada: 'Sensação de afogamento breve. Água escorre do nariz e boca do conjurador como se tivesse emergido de um mergulho profundo.',
        severa:   'O conjurador vomita água salgada. Pressão nos ouvidos como numa descida abissal. Vertigem e náusea por 1 turno.',
      }
    },

    // ─────────────────────────────────────────────────
    // 11. BELEZA DE LYRËA — Encantamento e Ilusão
    // ─────────────────────────────────────────────────
    beleza_lyrea: {
      nome: 'Beleza de Lyrëa',
      divindade: 'Lyrëa',
      pericias: ['diplomacia', 'enganacao'],
      recurso: 'sopro',
      elemento: 'Encantamento / Fascinar / Névoa Hipnótica / Espelhos',
      descricao:
        'Lyrëa é a única divindade forjada pelo sangue de quase todos os ' +
        'deuses — Maelthra, Pyraël, Nyxara, Nerýth, Káryon, Elysséra, ' +
        'Aethrýs e o próprio Archëon adormecido contribuíram com fragmentos ' +
        'de sua essência para criar a Deusa da Beleza e Sedução. Ela é o ' +
        'reflexo perfeito de todas as forças — a convergência que hipnotiza. ' +
        'As Sylphari, nascidas de sua bênção, são prova viva de que a ' +
        'beleza em Aetherion não é fraqueza — é uma arma afiada como ' +
        'obsidiana. Canalizar a Beleza é tecer ilusões tão reais que o ' +
        'inimigo se apaixona pela própria morte: névoas hipnóticas que ' +
        'perfumam o ar enquanto paralisam a vontade, espelhos de luz que ' +
        'multiplicam reflexos até que o alvo não distinga o real do falso, ' +
        'e encantos sussurrados que fazem guerreiros veteranos abaixarem ' +
        'suas armas com lágrimas nos olhos, cegos pela perfeição de algo ' +
        'que nunca existiu.',
      corHex: '#EC407A',
      icone: '🦋',
      dadoBase: 'd6',
      tracos: { escalaAlcance: 1.0, escalaArea: 1.0, escalaDuracao: 1.4, escalaVisibilidade: 1.2 },
      sequela: {
        leve:     'O conjurador sente uma vaidade incomum — confere seu reflexo em qualquer superfície por alguns minutos.',
        moderada: 'Narcisismo fugaz. O conjurador se distrai com a própria aparência. Seu reflexo em superfícies brilha ligeiramente mais bonito do que deveria.',
        severa:   'O conjurador enxerga todos ao redor como grotescos por 1 hora — rostos distorcidos, vozes desafinadas. Apenas sua própria beleza parece real. Solidão existencial breve.',
      }
    },

    // ─────────────────────────────────────────────────
    // 12. ORDEM DE ORDELYNE — Dano Radiante e Dissipação
    // ─────────────────────────────────────────────────
    ordem_ordelyne: {
      nome: 'Ordem de Ordelyne',
      divindade: 'Ordelyne',
      pericias: ['tatica', 'vontade'],
      recurso: 'sopro',
      elemento: 'Dano Radiante / Dissipar Ilusões / Punição Reativa',
      descricao:
        'Ordelyne nasceu do esforço conjunto de Aethrýs e Pyraël quando o ' +
        'mundo agonizava sob o flagelo do Caos — criada com resquícios de ' +
        'magia residual para ser a antítese de Zyrhûn. Mas a Deusa da ' +
        'Ordem não é bondade: ela busca o equilíbrio frio do mundo, sabendo ' +
        'que nem muita devastação nem muita bondade sustentam a criação. ' +
        'Foi ela quem projetou os degraus do Submundo e fez nascer a Luz ' +
        'nos seus níveis mais altos para balancear as Trevas que emergiram ' +
        'do medo dos condenados. Canalizar a Ordem é empunhar o julgamento ' +
        'radiante: lâminas de luz branca que dissipam ilusões e mentiras ' +
        'como o amanhecer dissolve pesadelos, punições luminosas que reagem ' +
        'automaticamente a cada agressão sofrida, e a certeza implacável ' +
        'de que todo ato tem consequência. Os Grotans da Ordem marcham sob ' +
        'seu estandarte — disciplinados, honrados, e absolutamente brutais ' +
        'na execução de sua justiça cega.',
      corHex: '#FFD54F',
      icone: '⚖️',
      dadoBase: 'd8',
      bonusFixoDados: (c) => c,
      tracos: { escalaAlcance: 1.0, escalaArea: 1.0, escalaDuracao: 1.0, escalaVisibilidade: 1.4 },
      sequela: {
        leve:     'O conjurador sente uma rigidez postural — as costas se endireitam, os gestos se tornam excessivamente simétricos por minutos.',
        moderada: 'Compulsão por ordem — o conjurador sente necessidade de alinhar objetos ao redor, corrigir assimetrias. Incômodo narrativo, não mecânico.',
        severa:   'Rigidez muscular total por 1 turno — o corpo do conjurador se trava numa postura marcial perfeita, incapaz de improvisar movimentos fluidos. Julgamento frio invade os pensamentos.',
      }
    },

    // ─────────────────────────────────────────────────
    // 13. MORTE DE MORVETHRA — Necrose e Dreno Vital
    // ─────────────────────────────────────────────────
    morte_morvethra: {
      nome: 'Morte de Morvethra',
      divindade: 'Morvethra',
      pericias: ['vontade'],
      recurso: 'macula',
      elemento: 'Dano Necrótico / Dreno de Vida / Negação de Cura',
      descricao:
        'Quando a imortalidade foi arrancada dos Primordiais, o céu choveu ' +
        'pétalas de sangue e brancura. Morvethra — nascida do sacrifício ' +
        'de Khaíros, Elysséra e Nyxara — surgiu com uma ampulheta impiedosa ' +
        'e um sorriso sombrio. Com um estalar de dedos, ceifou metade das ' +
        'hostes belicistas e exterminou toda criação impura nascida do ' +
        'turbilhão de Zyrhûn. A Morte não é um conceito abstrato em ' +
        'Aetherion — é uma deusa que sorri. Canalizar Morvethra é invocar ' +
        'o frio absoluto do cessar: energia necrótica que apodrece tecido ' +
        'vivo ao toque como fruta esquecida sob o sol de mil verões, drenos ' +
        'vitais que sugam a força do inimigo até que seus olhos percam o ' +
        'brilho e seus joelhos cedam como galhos secos, e a negação cruel ' +
        'de toda cura — pois onde Morvethra toca, a carne não se regenera, ' +
        'os ossos não se soldam, e a vida simplesmente esquece como voltar. ' +
        'Ela concedeu longevidade aos Elvarin, mas nunca de graça.',
      corHex: '#4E342E',
      icone: '⚰️',
      dadoBase: 'd12',
      tracos: { escalaAlcance: 0.8, escalaArea: 0.7, escalaDuracao: 2.0, escalaVisibilidade: 0.4 },
      sequela: {
        leve:     'Um frio nos ossos que nenhum fogo esquenta. O pulso do conjurador enfraquece por alguns minutos.',
        moderada: 'A pele do conjurador acinzenta temporariamente. Exala um cheiro breve de flores murchas. Batimentos cardíacos se tornam audíveis — lentos demais.',
        severa:   'O conjurador sente a Morte o observar. Por 1 turno, não consegue curar nem ser curado (a marca de Morvethra nega regeneração temporariamente). Frio absoluto nos membros.',
      }
    },

    // ─────────────────────────────────────────────────
    // 14. TREVAS DE KHARVION — Escuridão e Dreno Mental
    // ─────────────────────────────────────────────────
    trevas_kharvion: {
      nome: 'Trevas de Kharvion',
      divindade: 'Kharvion',
      pericias: ['malandragem', 'ocultismo'],
      recurso: 'macula',
      elemento: 'Escuridão Mágica / Cegueira / Dreno de Sanidade',
      descricao:
        'Quando os primeiros traidores e covardes foram exilados no ' +
        'Submundo, do medo infindo que consumia suas almas emergiu algo ' +
        'que os deuses não previram — as Trevas, a sombra gerada pelo ' +
        'temor primitivo de que suas existências se resumiriam a sofrimento ' +
        'e esquecimento eterno. Kharvion, nascido de Maelthra, Ordelyne e ' +
        'Morvethra, foi designado o Senhor das Punições, responsável por ' +
        'enforçar a sentença nos degraus mais profundos. Canalizar as ' +
        'Trevas é abrir uma fenda para aquele abismo: zonas de escuridão ' +
        'tão absoluta que mesmo a memória da luz é devorada, cegueira ' +
        'mágica que não cega os olhos — cega a alma, e drenos de sanidade ' +
        'que fazem o alvo ouvir os sussurros dos condenados primordiais ' +
        'que ainda definham nos poços de Kharvion. Nas Trevas, não há ' +
        'morte — há algo pior: a eternidade consciente no escuro, sabendo ' +
        'que ninguém jamais virá.',
      corHex: '#37474F',
      icone: '⛩️',
      dadoBase: 'd6',
      tracos: { escalaAlcance: 0.8, escalaArea: 1.0, escalaDuracao: 1.6, escalaVisibilidade: 0.3 },
      sequela: {
        leve:     'A sombra do conjurador se move de forma independente por alguns segundos. Um calafrio sem explicação.',
        moderada: 'O conjurador vê vultos na visão periférica por 10 minutos. Sussurros dos condenados do Submundo ecoam nos cantos da mente.',
        severa:   'Pesadelo garantido no próximo sono. Durante o descanso, o conjurador revive fragmentos dos poços de Kharvion. Recuperação do descanso reduzida pela metade.',
      }
    },

    // ─────────────────────────────────────────────────
    // 15. TEIA DE MABRYTH — Restrição e Veneno
    // ─────────────────────────────────────────────────
    teia_mabryth: {
      nome: 'Teia de Mabryth',
      divindade: 'Mabryth',
      pericias: ['ladinagem', 'ocultismo'],
      recurso: 'macula',
      elemento: 'Restrição / Fios de Destino / Veneno / Pragas',
      descricao:
        'Mabryth nasceu nas sombras que conectam a Morte e as Trevas — ' +
        'filha de Kharvion, tecedora dos fios invisíveis que prendem ' +
        'destinos a consequências inescapáveis. Enquanto Morvethra ceifa e ' +
        'Kharvion pune, Mabryth captura — ela é a aranha paciente que tece ' +
        'a armadilha antes que a presa saiba que já está morta. Sua teia ' +
        'é feita dos mesmos fios que conectam as fissuras do Véu trincado, ' +
        'e através delas, as entidades de Nythraxis sussurram ofertas de ' +
        'poder a preços bizarros. Canalizar a Teia é tecer restrições na ' +
        'própria realidade: filamentos de energia sombria que paralisam ' +
        'membros como cordas de aço invisível, venenos arcanos que corroem ' +
        'de dentro para fora como larvas sob a pele, e pragas místicas que ' +
        'se espalham de hospedeiro em hospedeiro como rumores em tempos de ' +
        'guerra. A Teia não mata depressa — ela prende, apodrece e assiste ' +
        'enquanto a vítima compreende, lentamente, que cada luta a ' +
        'enreda mais.',
      corHex: '#6A1B9A',
      icone: '🕷️',
      dadoBase: 'd4',
      tracos: { escalaAlcance: 0.8, escalaArea: 1.2, escalaDuracao: 1.6, escalaVisibilidade: 0.5 },
      sequela: {
        leve:     'Dormência nos dedos do conjurador por alguns minutos. As veias dos antebraços escurecem levemente.',
        moderada: 'Fios de energia residual grudam nos dedos do conjurador como teias invisíveis. Sensação de insetos caminhando sob a pele.',
        severa:   'Veneno residual. O conjurador sofre 1 ponto de dano necrótico não-letal. Veias dos braços se tornam visivelmente roxas por horas. Aranhas reais parecem ser atraídas ao conjurador.',
      }
    }
  },

  // ===========================================================
  // CAMADA 2 — OS 9 VERBOS (AÇÃO E CUSTO BASE)
  // ===========================================================
  // Cada verbo define:
  //   nome         → nome de exibição
  //   custoBase    → multiplicador base para a fórmula de custo
  //   formulaDano  → função que retorna string da fórmula de dados
  //   efeitoBase   → descrição mecânica do efeito
  //   descricao    → texto poético-narrativo
  //   template     → objeto com fragmentos de texto para cada aspecto
  //                   que serão concatenados na interface de criação

  verbos: {

    // ─────────────────────────────────────────────────
    // MANIFESTAR — Dano/Cura de alvo único
    // ─────────────────────────────────────────────────
    manifestar: {
      nome: 'Manifestar',
      intencao: 'ofensivo',
      custoBase: 1,
      multiplicadorDados: 1.0,
      acaoBase: 'Ação Padrão',
      formulaDano: (circulo) => `${circulo}d6`,
      curvas: { curvaAlcance: 'raiz', curvaArea: 'constante', curvaDuracao: 'lenta', curvaVisibilidade: 'lenta' },
      efeitoBase: 'Dano ou cura equilibrada de alvo único.',
      descricao:
        'Manifestar é o acto mais puro da vontade arcana — arrancar um ' +
        'fragmento da essência divina do aspecto canalizado e materializá-lo ' +
        'no plano mortal como força bruta, cura visceral ou fenómeno ' +
        'elementar concentrado num único alvo. Não há desperdício, não há ' +
        'dispersão: é o golpe cirúrgico do conjurador que sabe exactamente ' +
        'onde aplicar a dor ou o alívio.',
      template: {
        sopro_archeon:
          'O conjurador estende a palma e o ar estala — uma esfera de ' +
          'energia primordial, branca como o primeiro amanhecer, se ' +
          'condensa entre seus dedos antes de disparar contra o alvo com ' +
          'a precisão de uma vontade que antecede a própria matéria.',
        sol_pyrael:
          'Uma lança de fogo solar perfura o ar com um sibilo agudo, ' +
          'deixando um rastro de ar cauterizado. Onde atinge, a carne se ' +
          'derrete em camadas — primeiro a pele, depois o músculo — e o ' +
          'cheiro de queimado persiste como uma memória cruel.',
        lua_nyxara:
          'Um raio de luz prateada desce em silêncio absoluto e toca a ' +
          'testa do alvo. Por um instante, seus olhos se tornam espelhos ' +
          'da Lua, e todo segredo que ele guardava se desdobra diante do ' +
          'conjurador como páginas de um livro aberto.',
        tempo_khairos:
          'O ar em torno do alvo se distorce — os movimentos desaceleram ' +
          'até que cada gesto pareça subaquático, enquanto o conjurador se ' +
          'move em tempo real, golpeando com a certeza de quem vê o futuro ' +
          'e corrige o presente.',
        saber_aethrys:
          'Glifos verdes pulsam ao redor do conjurador como olhos que tudo ' +
          'vêem. Um feixe concentrado de conhecimento arcano atinge o alvo, ' +
          'desmantelando sua conexão mágica com um estalo seco — como uma ' +
          'corda de harpa que se rompe.',
        vida_elyssera:
          'O conjurador pressiona as mãos contra a ferida e a carne ' +
          'responde — fibras se reconectam com estalos úmidos, ossos ' +
          'estilhaçados se reagrupam com o som de galhos quebrando ao ' +
          'contrário. A dor é breve e aguda antes do alívio inundar o corpo.',
        terra_maelthra:
          'Um punho de rocha sólida irrompe do solo sob o alvo com a ' +
          'velocidade de um terremoto comprimido num único instante. O ' +
          'impacto estala ossos e ergue poeira que cheira a minério antigo, ' +
          'a terra profunda que nunca viu a luz do sol.',
        caos_zyrhun:
          'Um projétil amorfo de matéria corrosiva se forma a partir do ' +
          'nada — borbulhante, instável, mudando de cor entre roxo-doente ' +
          'e verde-putrefato. Ao impactar, dissolve o que toca com chiados ' +
          'ácidos, e o conjurador sente um riso que não é seu ecoar atrás ' +
          'dos dentes.',
        trovao_karyon:
          'Um arco de eletricidade salta da mão do conjurador com o ' +
          'estrondo de um trovão comprimido. O alvo se contorce quando a ' +
          'corrente percorre sua armadura e seus nervos, deixando o ar ao ' +
          'redor com cheiro de ozônio e ferro quente.',
        oceanos_neryth:
          'Uma esfera de água hiperpressurizada dispara como um projétil ' +
          'de canhão — ao impactar, a pressão abissal se liberta e o alvo ' +
          'é atingido com a força dos oceanos que uma vez cobriram todo o ' +
          'mundo, antes que os Dragões esculpissem vales para domá-los.',
        beleza_lyrea:
          'O conjurador sussurra uma única nota — perfeita, impossível — ' +
          'e o alvo pára. Seus olhos se enchem de algo entre amor e terror ' +
          'enquanto uma ilusão feita de luz líquida se forma diante dele, ' +
          'tão bela que a dor de perdê-la arranca um gemido involuntário.',
        ordem_ordelyne:
          'Um raio de luz dourada corta o ar em linha recta, puro e ' +
          'inabalável como um veredito. Onde atinge, a desordem se desfaz ' +
          '— ilusões se estilhaçam, maldições se dissolvem, e o que resta ' +
          'é a verdade nua e crua, radiante e imperdoável.',
        morte_morvethra:
          'Uma mão espectral translúcida emerge do peito do conjurador e ' +
          'avança em direcção ao alvo. Ao tocá-lo, a vida se retrai — a ' +
          'pele acinzenta, as veias escurecem, e um frio que não pertence ' +
          'ao mundo dos vivos percorre cada fibra do corpo atingido.',
        trevas_kharvion:
          'A sombra do conjurador se alonga impossívelmente e engole a ' +
          'sombra do alvo. Por um instante, o alvo vê — não a escuridão, ' +
          'mas o que vive nela: os rostos distorcidos dos condenados no ' +
          'Submundo, bocas abertas em gritos que não emitem som.',
        teia_mabryth:
          'Filamentos quase invisíveis disparam da ponta dos dedos do ' +
          'conjurador e se cravão no alvo como anzóis de seda negra. A ' +
          'cada movimento que o alvo tenta, os fios se retesam, injectando ' +
          'um veneno arcano que queima nas veias como formigas sob a pele.'
      }
    },

    // ─────────────────────────────────────────────────
    // ALTERAR — Buffs/Debuffs de Atributos
    // ─────────────────────────────────────────────────
    alterar: {
      nome: 'Alterar',
      intencao: 'utilidade',
      custoBase: 2,
      multiplicadorDados: 0.5,
      acaoBase: 'Ação Padrão',
      formulaDano: (_circulo) => null,
      curvas: { curvaAlcance: 'logaritmica', curvaArea: 'constante', curvaDuracao: 'quadratica', curvaVisibilidade: 'logaritmica' },
      efeitoBase: 'Interrupção mecânica: bloqueia cura, magia, movimento ou passivas.',
      descricao:
        'Alterar é o verbo da transmutação — não o dano bruto, mas a ' +
        'reescrita da própria natureza de um corpo ou espírito. É a magia ' +
        'que não destrói, mas redefine: fortalecer músculos até que rasgem ' +
        'a armadura que os contém, enfraquecer a vontade de um inimigo até ' +
        'que ele se renda antes de compreender por quê, ou transmutar a ' +
        'essência de um aliado para que resista ao impossível.',
      template: {
        sopro_archeon:
          'A energia de Archëon percorre o alvo como uma corrente eléctrica ' +
          'silenciosa, reescrevendo seus limites naturais. Atributos se ' +
          'amplificam como se o Sonhador Primordial olhasse para ele e ' +
          'sussurrasse: "Pode mais."',
        sol_pyrael:
          'O calor solar se internaliza — os músculos do alvo ganham uma ' +
          'rigidez incandescente, seus reflexos se aceleram como chamas ' +
          'lambendo combustível fresco. Ou, se voltado contra um inimigo, ' +
          'o calor evapora sua determinação como água sob o sol inclemente.',
        lua_nyxara:
          'O luar infiltra-se como neblina prateada nos sentidos do alvo. ' +
          'A percepção se aguça até níveis sobre-humanos — ou, inversamente, ' +
          'um véu lunar cai sobre o inimigo, embotando seus sentidos até ' +
          'que o mundo pareça um sonho do qual não consegue despertar.',
        tempo_khairos:
          'O fluxo temporal em torno do alvo se dilata ou comprime. ' +
          'Músculos envelhecem décadas em segundos, tornando-se frágeis ' +
          'como pergaminho — ou rejuvenescem, ganhando a elasticidade ' +
          'feroz da juventude que o Tempo um dia roubou.',
        saber_aethrys:
          'Runas de conhecimento se inscrevem temporariamente na mente do ' +
          'alvo — bônus de percepção tática, compreensão instantânea de ' +
          'fraquezas estruturais. Ou, se hostil, os glifos apagam ' +
          'memórias musculares e instintos de combate, deixando o guerreiro ' +
          'tão desorientado quanto um recém-nascido.',
        vida_elyssera:
          'O corpo do alvo se adapta — tendões se adensam, ossos se ' +
          'mineralizam, fibras musculares se duplicam com estalos húmidos. ' +
          'Ou, quando corrompido, a magia força o corpo a regredir: ' +
          'músculos atrofiam e articulações enrijecem como raízes secas.',
        terra_maelthra:
          'A pele do alvo ganha a textura e a resistência da rocha de ' +
          'Maelthra. Cada passo se torna mais pesado, mais firme, mais ' +
          'inabalável. Contra um inimigo, a mesma magia enraíza seus pés ' +
          'no solo e torna seus ossos pesados como chumbo primordial.',
        caos_zyrhun:
          'O corpo do alvo entra em mutação descontrolada — músculos se ' +
          'hipertrofiam grotescamente num braço enquanto o outro murcha, ' +
          'os olhos piscam em cores diferentes, e uma força selvagem e ' +
          'imprevisível flui por veias que já não obedecem à anatomia ' +
          'convencional. Pode ser bênção. Pode ser maldição. Zyrhûn ' +
          'não distingue.',
        trovao_karyon:
          'A electricidade estática carrega os músculos do alvo — cada ' +
          'fibra reage com velocidade sobre-humana, os reflexos se tornam ' +
          'tempestuosos. Contra um inimigo, a mesma carga sobrecarrega seus ' +
          'nervos, causando espasmos e descoordenação como um boneco cujas ' +
          'cordas foram cortadas pelo raio.',
        oceanos_neryth:
          'A água no corpo do alvo responde — fluidos se redistribuem, ' +
          'articulações se lubrificam com eficiência sobrenatural, e a ' +
          'resistência se amplifica como as marés que nunca cessam. Num ' +
          'inimigo, a desidratação arcana resseca músculos e olhos até que ' +
          'cada movimento doa como areia nos tendões.',
        beleza_lyrea:
          'O alvo é envolvido por uma aura de presença que hipnotiza — sua ' +
          'voz ganha harmônicos impossíveis, seus gestos se tornam fluidos ' +
          'como dança. Contra um inimigo, a beleza se inverte: ele se vê ' +
          'grotesco, monstruoso, e a vergonha corrói sua postura de combate.',
        ordem_ordelyne:
          'A Ordem reescreve a postura do alvo — cada músculo se alinha ' +
          'com perfeição geométrica, cada reflexo se sincroniza com ' +
          'disciplina marcial. Contra um inimigo, a Ordem impõe rigidez ' +
          'excessiva: movimentos se tornam previsíveis, automáticos, e ele ' +
          'perde a capacidade de improvisar.',
        morte_morvethra:
          'A vitalidade do alvo é drenada parcialmente — não o suficiente ' +
          'para matar, mas o bastante para que seus músculos percam a ' +
          'tensão, sua visão se escureça nas bordas, e cada batida do ' +
          'coração soe como um lembrete de que Morvethra o está observando.',
        trevas_kharvion:
          'Sombras se alojam nos cantos da mente do alvo, erodindo sua ' +
          'confiança. Os atributos mentais se degradam como memórias ' +
          'esquecidas — a determinação vacila, a coragem esmorece, e um ' +
          'medo ancestral sem nome se enrosca na base da espinha.',
        teia_mabryth:
          'Fios invisíveis se enrolam em torno dos tendões do alvo, ' +
          'alterando a mecânica do seu corpo como um titereiro que puxa ' +
          'cordas de uma marionete. Movimentos se tornam lentos, pesados, ' +
          'e um veneno sutil corrói os atributos de agilidade como ferrugem ' +
          'comendo ferro sob a chuva.'
      }
    },

    // ─────────────────────────────────────────────────
    // VINCULAR — Condições de Restrição Física
    // ─────────────────────────────────────────────────
    vincular: {
      nome: 'Vincular',
      intencao: 'utilidade',
      custoBase: 1,
      multiplicadorDados: 0.5,
      acaoBase: 'Ação Padrão',
      formulaDano: (_circulo) => null,
      curvas: { curvaAlcance: 'raiz', curvaArea: 'constante', curvaDuracao: 'linear', curvaVisibilidade: 'logaritmica' },
      efeitoBase: 'Condição duradoura de restrição, elo ou subserviência (Agarrado, Caído).',
      descricao:
        'Vincular é o verbo da contenção — prender, imobilizar, subjugar ' +
        'sem destruir. É a magia do caçador paciente, do estrategista que ' +
        'sabe que um inimigo imóvel é um inimigo morto que ainda não o sabe. ' +
        'Cada aspecto tece a prisão à sua maneira: correntes de luz, raízes ' +
        'de pedra, grilhões de gelo temporal.',
      template: {
        sopro_archeon:
          'Bandas de energia primordial se enrolam no alvo como serpentes ' +
          'luminosas, prendendo membros ao tronco com a força inabalável ' +
          'do primeiro ato de criação. Ele pode gritar — mas não pode mover.',
        sol_pyrael:
          'Anéis de fogo solar circundam o alvo, tão intensos que se ' +
          'aproximar os braços é sentir a carne crepitar. A prisão não ' +
          'precisa de correntes — o medo do calor é algema suficiente.',
        lua_nyxara:
          'A mente do alvo é envolta numa ilusão lunar tão perfeita que ' +
          'ele acredita estar paralisado — músculos que funcionam ' +
          'perfeitamente se recusam a obedecer porque o cérebro está ' +
          'convencido de que correntes prateadas o prendem ao chão.',
        tempo_khairos:
          'O tempo em torno do alvo congela numa bolha cristalina — ele ' +
          'pode ver o mundo se movendo, pode sentir cada segundo passar, ' +
          'mas seu corpo está preso entre um instante e o seguinte, numa ' +
          'pausa que parece eterna.',
        saber_aethrys:
          'Glifos de contenção se projetam no chão ao redor do alvo, ' +
          'formando um círculo arcano que anula qualquer tentativa de ' +
          'movimento. Quanto mais o alvo luta, mais as runas se iluminam, ' +
          'mais apertado o laço do conhecimento se torna.',
        vida_elyssera:
          'Raízes e vinhas vivas irrompem do solo e se enrolam nos membros ' +
          'do alvo com força orgânica bruta. As plantas pulsam com vida ' +
          'própria — se o alvo corta uma, duas nascem no lugar, mais ' +
          'grossas, mais determinadas.',
        terra_maelthra:
          'O chão se abre como uma boca e se fecha em torno dos pés do ' +
          'alvo, solidificando-se instantaneamente em granito. Ele está ' +
          'enraizado na própria Maelthra — e arrancar-se dela é tão fácil ' +
          'quanto arrancar uma montanha.',
        caos_zyrhun:
          'Tentáculos de matéria caótica emergem de rachaduras no espaço e ' +
          'se agarram ao alvo com movimentos espásticos e imprevisíveis. ' +
          'Cada tentáculo pulsa com um ritmo diferente, puxa numa direcção ' +
          'diferente, e o alvo sente sua sanidade escorrer junto com sua ' +
          'capacidade de se mover.',
        trovao_karyon:
          'Uma descarga eléctrica percorre o sistema nervoso do alvo, ' +
          'travando seus músculos em contracção involuntária. Ele fica de ' +
          'pé, rígido, com os maxilares cerrados e os olhos abertos em ' +
          'terror enquanto o corpo se recusa a obedecer.',
        oceanos_neryth:
          'Uma redoma de água se forma ao redor do alvo — não o suficiente ' +
          'para afogar, mas o bastante para que cada movimento seja uma ' +
          'luta contra a correnteza. Os braços se movem como em sonho, ' +
          'lentos, pesados, inúteis.',
        beleza_lyrea:
          'O alvo se congela não por força, mas por fascínio — uma visão ' +
          'tão devastadoramente bela se materializa diante dele que todo o ' +
          'seu corpo se recusa a se mover, terrificado com a ideia de que ' +
          'um gesto brusco possa destruir a perfeição diante de seus olhos.',
        ordem_ordelyne:
          'Correntes de luz dourada se materializam ao redor dos pulsos e ' +
          'tornozelos do alvo, prendendo-o numa posição de genuflexão. A ' +
          'Ordem o julga, e até que a sentença se complete, ele permanecerá ' +
          'de joelhos, curvado diante de um tribunal que não pode ver.',
        morte_morvethra:
          'O alvo sente suas pernas cederem — não por dor, mas por uma ' +
          'fadiga mortal que permeia cada fibra. O corpo compreende, antes ' +
          'da mente, que a Morte o segura. Cair é inevitável. Levantar-se ' +
          'exige lutar contra a própria mortalidade.',
        trevas_kharvion:
          'Sombras sólidas emergem do chão e se enrolam no alvo como ' +
          'correntes de escuridão tangível. Dentro das sombras, ele ouve ' +
          'sussurros — vozes dos exilados do Submundo que imploram que ele ' +
          'fique, que fique, que fique para sempre.',
        teia_mabryth:
          'Fios de seda negra arcana explodem em todas as direcções a ' +
          'partir de um ponto no chão, colando o alvo numa teia pegajosa ' +
          'que endurece como aço ao ser tocada. Cada fio contém doses ' +
          'microscópicas de veneno paralisante que adormece os músculos ' +
          'um a um, metódico, paciente, inevitável.'
      }
    },

    // ─────────────────────────────────────────────────
    // SELAR — Aprisionamento Místico
    // ─────────────────────────────────────────────────
    selar: {
      nome: 'Selar',
      intencao: 'utilidade',
      custoBase: 2,
      multiplicadorDados: 0.5,
      acaoBase: 'Ação Padrão',
      formulaDano: (_circulo) => null,
      curvas: { curvaAlcance: 'raiz', curvaArea: 'constante', curvaDuracao: 'linear', curvaVisibilidade: 'lenta' },
      efeitoBase: 'Alteração fisiológica ou material. Não causa dano direto. Tranca portões do Véu ou habilidades.',
      descricao:
        'Selar é o verbo dos deuses que aprisionaram Zyrhûn no Submundo e ' +
        'tentaram restaurar o Véu trincado. É a magia da negação absoluta: ' +
        'trancar portões entre planos, suprimir habilidades que não deveriam ' +
        'existir, aprisionar entidades em círculos de contenção ou fechar ' +
        'fissuras por onde as aberrações de Nythraxis se esgueiram.',
      template: {
        sopro_archeon:
          'Um selo brilhante — ecoando o poder com que Archëon criou o ' +
          'Véu entre mundos — se materializa no ar e prensa contra o alvo ' +
          'ou fissura. As bordas do selo queimam com luz primordial, e o ' +
          'que foi selado permanece trancado com a mesma firmeza que ' +
          'separou deuses de mortais.',
        sol_pyrael:
          'Chamas solares se cristalizam num disco de vidro incandescente ' +
          'que se estampa sobre a fonte de poder do alvo. Suas habilidades ' +
          'são cauterizadas — não removidas, mas queimadas para dentro, ' +
          'presas sob uma cicatriz de fogo que só o tempo pode desfazer.',
        lua_nyxara:
          'Um glifo prateado de contenção mental se inscreve na testa do ' +
          'alvo, invisível a todos menos ao conjurador. A mente do alvo é ' +
          'selada: memórias de como conjurar, como lutar, como gritar — ' +
          'todas trancadas atrás de uma porta de prata que não tem maçaneta.',
        tempo_khairos:
          'O instante em que o alvo tenta usar a habilidade selada é ' +
          'arrancado do fluxo temporal e guardado numa ampulheta que ' +
          'o conjurador segura. Enquanto o selo durar, aquele momento ' +
          'simplesmente não existe — foi roubado do Tempo.',
        saber_aethrys:
          'Runas de supressão se sobrepõem às runas de poder do alvo, ' +
          'anulando-as como uma equação que se equilibra em zero. O ' +
          'conhecimento de Aethrýs sabe exactamente qual fio cortar ' +
          'para que a tapeçaria inteira desmorone sem violência.',
        vida_elyssera:
          'Tecido orgânico se forma sobre a fonte de poder do alvo — ' +
          'como uma pele nova crescendo sobre uma ferida — selando-a ' +
          'sob camadas de vida que sufocam a magia como raízes que ' +
          'estrangulam ruínas antigas.',
        terra_maelthra:
          'O alvo é parcialmente engolido pela terra — não o bastante ' +
          'para feri-lo, mas o suficiente para que sinta a rocha de ' +
          'Maelthra pressionar contra seu peito como um sarcófago que se ' +
          'fecha. O que foi selado permanece soterrado.',
        caos_zyrhun:
          'O Caos sela à sua maneira — paradoxalmente, criando tanta ' +
          'interferência arcana que nenhuma magia estável consegue se ' +
          'formar. É um selo de estática, de ruído branco mágico, tão ' +
          'caótico que até a ordem precisa para conjurar se perde no ' +
          'turbilhão. Irônico: o Caos como cadeado.',
        trovao_karyon:
          'Um campo electromagnético permanente envolve o alvo, criando ' +
          'uma gaiola de Faraday mística que impede qualquer energia ' +
          'arcana de entrar ou sair. O zumbido constante da electricidade ' +
          'contida é o único lembrete de que o selo existe.',
        oceanos_neryth:
          'Uma esfera de água pressurizada se forma ao redor da fonte de ' +
          'poder do alvo, contendo-a como o oceano primordial uma vez ' +
          'conteve todo o mundo antes que os Dragões o libertassem. O ' +
          'poder do alvo afoga-se silenciosamente.',
        beleza_lyrea:
          'O alvo é envolvido por uma ilusão tão perfeita que acredita ' +
          'que seus poderes simplesmente não existem — nunca existiram. ' +
          'A beleza da mentira é tão convincente que a realidade se ' +
          'curva diante dela, e a habilidade selada obedece.',
        ordem_ordelyne:
          'Um decreto de Ordelyne se inscreve no ar em letras de luz — ' +
          'a sentença é clara, imutável, radiante: a habilidade está ' +
          'proibida. E como a Ordem não negoceia, o selo permanece ' +
          'inabalável enquanto a vontade do conjurador durar.',
        morte_morvethra:
          'Morvethra sela com a finalidade que lhe é própria — a ' +
          'habilidade do alvo morre. Não é suprimida, não é trancada: ' +
          'ela cessa de existir temporariamente, como uma chama que se ' +
          'extinguiu. Reacendê-la exige mais do que vontade — exige ' +
          'desafiar a própria Morte.',
        trevas_kharvion:
          'A habilidade selada é engolida pela escuridão — jogada nos ' +
          'poços do Submundo de onde Kharvion governa. O alvo pode sentir ' +
          'o eco distante do seu poder gritando nas trevas, mas alcançá-lo ' +
          'seria como enfiar a mão num abismo sem fundo.',
        teia_mabryth:
          'Fios de destino se reconfiguram ao redor do alvo, amarrando ' +
          'sua habilidade a um nó tão apertado que puxá-la só a enreda ' +
          'mais. A Teia de Mabryth não sela com força — sela com ' +
          'paciência, e cada tentativa de romper o selo apenas reforça ' +
          'os fios que o prendem.'
      }
    },

    // ─────────────────────────────────────────────────
    // DESTRUIR — Dano Massivo em Área
    // ─────────────────────────────────────────────────
    destruir: {
      nome: 'Destruir',
      intencao: 'ofensivo',
      custoBase: 2,
      multiplicadorDados: 1.5,
      acaoBase: 'Ação Padrão',
      formulaDano: (circulo) => `${circulo}d10`,
      curvas: { curvaAlcance: 'linear', curvaArea: 'quadratica', curvaDuracao: 'constante', curvaVisibilidade: 'quadratica' },
      efeitoBase: 'Dano massivo em área explosiva e destruição ambiental.',
      descricao:
        'Destruir é o verbo da aniquilação — não a precisão de Manifestar, ' +
        'mas a devastação indiscriminada de quem decide que tudo dentro de ' +
        'um raio precisa deixar de existir. É o eco da guerra de Zyrhûn, ' +
        'o ressoar dos Dragões cavando vales com o bater de asas, a fúria ' +
        'concentrada de deuses que decidiram que a misericórdia é um luxo ' +
        'que Aetherion não pode pagar.',
      template: {
        sopro_archeon:
          'Uma onda de energia primordial se expande a partir do conjurador ' +
          'como uma nova criação — mas invertida. O que o Sopro de Archëon ' +
          'criou, agora destrói: matéria se desintegra em partículas de ' +
          'luz que se dissipam como o último suspiro do Sonhador.',
        sol_pyrael:
          'Uma coluna de fogo solar explode do chão como um gêiser de ' +
          'magma estelar. A temperatura no epicentro ultrapassa qualquer ' +
          'medição mortal — metal vaporiza, pedra vitrífica, e os que ' +
          'estavam mais próximos não deixam nem cinzas. Apenas sombras ' +
          'queimadas no chão.',
        lua_nyxara:
          'Uma explosão silenciosa de luz prateada se expande — e dentro ' +
          'dela, cada ser atingido vive simultaneamente todos os seus ' +
          'piores pesadelos comprimidos num único instante. Não é o corpo ' +
          'que se destrói — é a mente, despedaçada pela verdade que a Lua ' +
          'arranca à força.',
        tempo_khairos:
          'O tempo na área de efeito entra em colapso — objetos envelhecem ' +
          'milênios em segundos, metal enferruja até desintegrar, madeira ' +
          'apodrece em pó, e corpos vivos sentem seus ossos se tornarem ' +
          'frágeis como cristal antes de estilhaçarem sob o peso da ' +
          'entropia acelerada.',
        saber_aethrys:
          'Uma cascata de glifos de anulação se expande em ondas ' +
          'concêntricas, decompondo toda magia activa na área como ácido ' +
          'em pergaminho. Encantamentos se dissolvem, runas explodem, e ' +
          'conjuradores pegos no raio sentem suas reservas arcanas serem ' +
          'violentamente esvaziadas.',
        vida_elyssera:
          'A Vida se revolta contra si mesma — células se multiplicam ' +
          'descontroladamente, tumores de crescimento explosivo irrompem ' +
          'nos corpos da área, ossos se alongam e se quebram, e a própria ' +
          'vegetação ao redor cresce com violência selvagem, engolindo ' +
          'tudo num maremoto verde e vermelho de dor orgânica.',
        terra_maelthra:
          'O chão se ergue e despedaça — um terremoto comprimido que ' +
          'transforma a área num campo de estilhaços de pedra. Fissuras ' +
          'se abrem como bocas famintas, pilares de rocha se erguem e ' +
          'desabam, e o pó de Maelthra engole a luz do sol com a fúria ' +
          'de uma deusa cujo corpo é o próprio mundo ferido.',
        caos_zyrhun:
          'A realidade na área simplesmente colapsa — fragmentos de ' +
          'dimensões colidem, a gravidade inverte e corrige freneticamente, ' +
          'cores impossíveis pulsam, e tudo que é matéria se retorce em ' +
          'formas grotescas antes de se desfazer. É o Experimento de ' +
          'Zyrhûn em miniatura: belo, horrível, e absolutamente ' +
          'devastador.',
        trovao_karyon:
          'Um relâmpago colossal desce dos céus com a fúria de Káryon ' +
          'em pessoa — o impacto gera uma onda de choque que arremessa ' +
          'corpos, despedaça estruturas e deixa uma cratera fumegante ' +
          'onde antes havia vida. O trovão que se segue é tão intenso ' +
          'que os sobreviventes ficam surdos por dias.',
        oceanos_neryth:
          'Uma parede de água impossível se ergue do nada e desaba sobre ' +
          'a área como o dilúvio que limpou o mundo após a guerra dos ' +
          'Primordiais. A pressão esmaga, a correnteza arrasta, e quando ' +
          'a água se retira, resta apenas lama e silêncio.',
        beleza_lyrea:
          'Uma explosão de beleza tão avassaladora que destrói por excesso ' +
          '— luzes de todas as cores estilhaçam retinas, harmonias ' +
          'impossíveis rompem tímpanos, e um perfume tão intenso que os ' +
          'pulmões se recusam a processar. A beleza, levada ao extremo, ' +
          'é tão mortal quanto qualquer veneno.',
        ordem_ordelyne:
          'Um pilar de luz divina desce dos céus e se espalha pelo solo ' +
          'como uma sentença de extermínio. Tudo que é impuro, caótico ' +
          'ou desordenado na área é julgado e eliminado com a eficiência ' +
          'fria de Ordelyne — sem malícia, sem prazer. Apenas justiça ' +
          'bruta.',
        morte_morvethra:
          'Uma onda de energia necrótica se expande como um suspiro de ' +
          'Morvethra — silenciosa, inevitável. Plantas murcham, animais ' +
          'caem, e mortais na área sentem o envelhecimento de décadas ' +
          'comprimir-se em segundos. A Morte não explode — ela esvazia.',
        trevas_kharvion:
          'Uma esfera de escuridão absoluta se expande e devora tudo ' +
          'dentro de si. Não há som, não há luz, não há ar. Dentro da ' +
          'esfera, os atingidos sentem-se cair eternamente nos poços do ' +
          'Submundo de Kharvion, e quando as Trevas se retiram, o dano ' +
          'não é apenas físico — é existencial.',
        teia_mabryth:
          'Milhares de fios explodem de um ponto central como uma teia ' +
          'detonada, cortando tudo que tocam como arame-farpado arcano. ' +
          'Cada fio carrega veneno concentrado, e a área inteira se torna ' +
          'uma armadilha mortal de filamentos tóxicos que cortam, ' +
          'envenenam e restringem simultaneamente.'
      }
    },

    // ─────────────────────────────────────────────────
    // INVOCAR — Criar Lacaio/Construto
    // ─────────────────────────────────────────────────
    invocar: {
      nome: 'Invocar',
      intencao: 'utilidade',
      custoBase: 3,
      multiplicadorDados: null, // Não rola dados de dano — Vida do lacaio = Círculo × 10
      acaoBase: 'Ação Completa',
      formulaDano: (circulo) => `PV do Lacaio: ${circulo * 10}`,
      curvas: { curvaAlcance: 'lenta', curvaArea: 'constante', curvaDuracao: 'linear', curvaVisibilidade: 'linear' },
      efeitoBase: 'Materializa uma entidade que age independentemente.',
      descricao:
        'Invocar é o verbo que mais se aproxima do acto original de Archëon: ' +
        'criar algo do nada, dar forma ao informe, soprar vida no que não ' +
        'existe. Mas onde o Sonhador criou com euforia, o conjurador cria ' +
        'com sangue, suor e recurso arcano. Cada invocação é um eco ' +
        'imperfeito da Primeira Criação — uma réplica que serve, combate ' +
        'e obedece até que a magia que a sustenta se esgote.',
      template: {
        sopro_archeon:
          'A energia primordial se condensa numa forma humanóide de luz ' +
          'branca e dourada — um eco silencioso do próprio Archëon, sem ' +
          'rosto mas com propósito. O construto move-se com a graciosidade ' +
          'de algo que nunca precisou de ossos ou músculos.',
        sol_pyrael:
          'Chamas se entrelaçam e solidificam num elemental solar — uma ' +
          'silhueta de fogo vivo cujos olhos brilham como duas estrelas. ' +
          'O calor que emana é tão intenso que o chão ao redor se ' +
          'vitrífica, e inimigos que se aproximam sentem o suor evaporar ' +
          'antes de escorrer.',
        lua_nyxara:
          'Neblina prateada se adensa até formar uma sombra lunar — um ' +
          'espectro translúcido de olhos como luas cheias que flutua ' +
          'acima do solo. Onde pisa, as sombras se aprofundam, e os que ' +
          'o encaram sentem uma sonolência irresistível.',
        tempo_khairos:
          'Fragmentos de momentos perdidos se aglutinam numa figura ' +
          'cintilante — um construto temporal feito de instantes roubados, ' +
          'que existe em todos os segundos simultaneamente. Seus ataques ' +
          'atingem antes de serem lançados.',
        saber_aethrys:
          'Glifos e runas se organizam numa estrutura tridimensional ' +
          'animada — um autómato de puro conhecimento arcano, cujos ' +
          'movimentos são equações e cujos golpes são teoremas da ' +
          'destruição. Aethrýs empresta seu saber temporariamente.',
        vida_elyssera:
          'Carne, osso e verde se entrelaçam num quimera orgânica — ' +
          'uma criatura viva tecida a partir da matéria biológica ao ' +
          'redor. Fungos, raízes e músculos animais se fundem numa ' +
          'besta que respira, sangra e obedece ao conjurador com a ' +
          'devoção cega dos Feyrin pelas florestas.',
        terra_maelthra:
          'A rocha se levanta, se organiza e se torna — um golem de ' +
          'granito e obsidiana cujos passos fazem o chão tremer. Cada ' +
          'pedra que o compõe é um fragmento do corpo de Maelthra, e ' +
          'destruí-lo exige a mesma força que derrubar uma montanha.',
        caos_zyrhun:
          'Matéria caótica se condensa numa aberração que desafia a ' +
          'anatomia — membros demais, olhos em posições impossíveis, ' +
          'bocas que riem sem motivo. O lacaio do Caos é instável, ' +
          'imprevisível, e possivelmente tão perigoso para o conjurador ' +
          'quanto para os inimigos. Zyrhûn aprova.',
        trovao_karyon:
          'Relâmpagos se entrelaçam numa forma esférica que pulsa e ' +
          'crepita — um elemental de pura electricidade que se move ' +
          'como um raio em câmara lenta. O ar em torno dele ioniza, ' +
          'cabelos se arrepiam, e metais próximos faíscam ao sentir ' +
          'sua presença.',
        oceanos_neryth:
          'Água se ergue do solo, de poças, do ar húmido — e assume ' +
          'a forma de uma serpente marinha translúcida cujo corpo ' +
          'ondula com a pressão dos oceanos profundos. Ela se move ' +
          'como se nadasse pelo ar, e seus golpes carregam a força de ' +
          'marés.',
        beleza_lyrea:
          'Uma figura de luz iridescente se materializa — tão bela que ' +
          'dói olhar. O lacaio de Lyrëa não combate com força bruta: ' +
          'ele distrai, fascina e desorienta. Inimigos hesitam em atacar ' +
          'algo tão perfeito, e essa hesitação é a arma.',
        ordem_ordelyne:
          'Armadura dourada se assembla do nada ao redor de um núcleo de ' +
          'luz pura — um sentinela de Ordelyne que se posiciona com ' +
          'disciplina marcial inabalável. Cada golpe é medido, cada ' +
          'movimento é eficiente, e sua presença irradia a certeza ' +
          'fria da lei.',
        morte_morvethra:
          'Ossos antigos — talvez dos próprios Primordiais — se erguem ' +
          'do solo e se articulam num esqueleto revestido de energia ' +
          'necrótica. O lacaio de Morvethra não respira, não sente, ' +
          'não hesita. Ele ceifa porque a Morte nunca parou de sorriso.',
        trevas_kharvion:
          'Sombras se desprendem do chão e se erguem como uma silhueta ' +
          'humanóide sem feições — uma presença de escuridão condensada ' +
          'cujos olhos são dois pontos de vazio absoluto. Quem olha para ' +
          'o lacaio de Kharvion sente um frio existencial que não ' +
          'pertence a nenhuma estação.',
        teia_mabryth:
          'Fios de seda arcana se tecem no ar com velocidade antinatural ' +
          'até formar uma aranha colossal de membros articulados e ' +
          'presas que gotejam veneno cor de âmbar. O lacaio de Mabryth ' +
          'tece teias em torno do campo de batalha, transformando-o numa ' +
          'armadilha viva.'
      }
    },

    // ─────────────────────────────────────────────────
    // CORTAR — Projéteis e Lâminas de Vácuo
    // ─────────────────────────────────────────────────
    cortar: {
      nome: 'Cortar',
      intencao: 'ofensivo',
      custoBase: 1,
      multiplicadorDados: 1.0,
      acaoBase: 'Ação Padrão',
      formulaDano: (circulo) => `${circulo}d8 (ignora RD mundana)`,
      curvas: { curvaAlcance: 'linear', curvaArea: 'lenta', curvaDuracao: 'constante', curvaVisibilidade: 'linear' },
      efeitoBase: 'Ataque em linha ou arco limpo. Ignora defesas materiais.',
      descricao:
        'Cortar é o verbo da violência refinada — não a destruição em massa, ' +
        'mas a lâmina perfeita que ignora defesas mundanas como se não ' +
        'existissem. É a arte do golpe que atravessa armadura, osso e ' +
        'pretensão com a mesma facilidade, porque a magia que o sustenta ' +
        'vibra numa frequência que o mundo físico não sabe bloquear.',
      template: {
        sopro_archeon:
          'Um crescente de energia primordial se forma e dispara com um ' +
          'sibilo que racha o ar. A lâmina de vácuo corta a realidade ' +
          'antes de cortar a carne — como se Archëon tivesse desenhado ' +
          'uma linha no mundo e decidido que tudo de um lado não pertence ' +
          'ao outro.',
        sol_pyrael:
          'Um disco de fogo solar, fino como pergaminho e brilhante como ' +
          'o olhar de Pyraël, gira a velocidades impossíveis antes de ser ' +
          'lançado. Ele não queima ao cortar — cauteriza, selando a ferida ' +
          'com fogo no mesmo instante em que a abre.',
        lua_nyxara:
          'Uma lâmina de luz lunar, quase invisível na penumbra, corta o ' +
          'ar sem som. A ferida que deixa é estranha — não sangra ' +
          'imediatamente, como se o corpo não percebesse que foi cortado ' +
          'até que a dor atrasada exploda segundos depois.',
        tempo_khairos:
          'Uma fissura temporal se abre e fecha como uma mandíbula — um ' +
          'corte que existe em dois momentos simultaneamente, dobrando o ' +
          'dano num paradoxo de causalidade. O alvo sente a dor antes da ' +
          'ferida e sangra depois de estar curado.',
        saber_aethrys:
          'Um projétil de runas comprimidas dispara como um dardo de ' +
          'conhecimento letal. Ao penetrar, não corta a carne — corta o ' +
          'fluxo arcano do alvo, desfiando conexões mágicas com a ' +
          'precisão de uma cirurgiã que sabe exactamente qual veia ' +
          'severar.',
        vida_elyssera:
          'Uma lâmina orgânica — osso cristalizado num fio impossível — ' +
          'se forma na mão do conjurador e é arremessada com rotação ' +
          'mortífera. Ao penetrar, a lâmina cria raízes dentro da ferida, ' +
          'forçando o corpo do alvo a nutrir algo que o destrói.',
        terra_maelthra:
          'Um estilhaço de obsidiana se arranca do solo e dispara como ' +
          'projétil de catapulta. A lâmina de pedra vulcânica é tão ' +
          'afiada que corta na escala molecular — e ao impactar, estilha ' +
          'em fragmentos que se cravão como espinhos na carne aberta.',
        caos_zyrhun:
          'Uma lâmina de Caos — mudando de forma, cor e consistência a ' +
          'cada nanosegundo — é lançada contra o alvo. Ela pode cortar ' +
          'como aço, queimar como ácido, ou congelar como o vazio entre ' +
          'estrelas. Nem o conjurador sabe o que vai acontecer. Essa é ' +
          'a graça.',
        trovao_karyon:
          'Um arco voltaico se estica como um chicote de eletricidade pura ' +
          'e corta o ar com o estrondo de um trovão comprimido. O corte é ' +
          'limpo, cauterizado por calor eléctrico, e os músculos em torno ' +
          'da ferida se contraem involuntariamente, paralisando o membro.',
        oceanos_neryth:
          'Um jato de água hiperpressurizada — fino como fio de seda e ' +
          'duro como diamante — corta horizontalmente com a precisão de ' +
          'um cirurgião dos abismos. A água carrega sal primordial que ' +
          'arde em feridas abertas como memória de oceanos.',
        beleza_lyrea:
          'Um fragmento de espelho — reflectindo o rosto do alvo no ' +
          'instante de sua morte — dispara e corta com elegância obscena. ' +
          'A ferida é limpa, quase bonita, e o alvo olha para o próprio ' +
          'sangue com uma fascinação hipnotizada antes de sentir a dor.',
        ordem_ordelyne:
          'Uma lâmina de luz dourada se forma e desce como um veredicto ' +
          'final. O corte é recto, perfeito, geométrico — não há ' +
          'desperdício, não há brutalidade desnecessária. Apenas a ' +
          'eficiência implacável de uma sentença executada.',
        morte_morvethra:
          'Uma foice espectral se materializa no ar e ceifa em arco ' +
          'silencioso. Onde toca, a carne não sangra — apodrece. A ' +
          'ferida envelhece instantaneamente, bordas enegrecidas como ' +
          'fruta podre, e a vida se retira daquela zona do corpo como ' +
          'água escorrendo de um prato rachado.',
        trevas_kharvion:
          'Uma lâmina de escuridão sólida corta o ar sem reflexo, sem ' +
          'som, sem aviso. A ferida que deixa não é visível — é sentida, ' +
          'uma dor que existe mais na alma do que na carne, como se as ' +
          'Trevas tivessem arrancado um pedaço do espírito junto com ' +
          'o tecido.',
        teia_mabryth:
          'Fios de seda arcana esticados como arame de lâmina disparam ' +
          'em padrão geométrico impossível. Cada fio corta o que toca ' +
          'com precisão milimétrica, e nos cortes, um veneno de actuação ' +
          'lenta se deposita — ardendo progressivamente como uma ' +
          'pergunta que não para de doer.'
      }
    },

    // ─────────────────────────────────────────────────
    // PROTEGER — Escudo Místico e Absorção
    // ─────────────────────────────────────────────────
    proteger: {
      nome: 'Proteger',
      intencao: 'defensivo',
      custoBase: 1,
      multiplicadorDados: 2.0,
      acaoBase: 'Ação Padrão', // Pode ser usado como Reação em algumas mesas, mas o base é Padrão
      formulaDano: (circulo) => `${circulo}d6 PV Temporários (não acumulativo)`,
      curvas: { curvaAlcance: 'lenta', curvaArea: 'constante', curvaDuracao: 'raiz', curvaVisibilidade: 'lenta' },
      efeitoBase: 'Aumento de CA, Resistências ou PV Temporários.',
      descricao:
        'Proteger é o verbo da resiliência — a afirmação obstinada de que ' +
        'este corpo, esta mente, esta alma não cairá enquanto a vontade do ' +
        'conjurador arder. É o eco das muralhas dos Durkan que nunca foram ' +
        'tomadas, dos escudos dos Grotans da Ordem que nunca foram ' +
        'rompidos, e do próprio Véu que Archëon criou para separar o ' +
        'divino do mortal.',
      template: {
        sopro_archeon:
          'Uma cúpula de luz primordial envolve o alvo — translúcida, ' +
          'iridescente, vibrando com a frequência da própria criação. ' +
          'Golpes que a atingem se dissipam como ondas contra uma costa ' +
          'que existia antes do oceano.',
        sol_pyrael:
          'Uma armadura de chamas solares reveste o alvo sem queimá-lo — ' +
          'o calor é direccionado para fora, e qualquer atacante que se ' +
          'aproxime sente a pele crispar antes do golpe. O escudo de ' +
          'Pyraël protege e pune simultaneamente.',
        lua_nyxara:
          'Uma ilusão lunar duplica a posição do alvo — atacantes vêem ' +
          'duas imagens sobrepostas e nunca sabem qual é real. O golpe ' +
          'que deveria conectar atravessa a miragem prateada e se perde ' +
          'no vazio.',
        tempo_khairos:
          'O tempo ao redor do alvo se dilata — cada golpe que se ' +
          'aproxima desacelera até quase parar, dando ao alvo tempo ' +
          'infinito para esquivar, bloquear, ou simplesmente observar ' +
          'a lâmina a centímetros do rosto antes de se afastar.',
        saber_aethrys:
          'Um escudo rúnico se projeta — glifos de anulação que ' +
          'decompõem ataques mágicos ao toque e absorvem os mundanos ' +
          'com a eficiência de uma mente que previu cada golpe antes de ' +
          'ser desferido.',
        vida_elyssera:
          'Uma camada de tecido orgânico denso — parte casca de árvore, ' +
          'parte quitina de insecto ancestral — se forma sobre a pele ' +
          'do alvo como uma segunda armadura viva que se regenera a cada ' +
          'impacto com estalos húmidos.',
        terra_maelthra:
          'Placas de rocha se erguem e se colam ao corpo do alvo como ' +
          'uma armadura tectónica que se adapta ao movimento. Cada golpe ' +
          'recebido estilhaça uma camada, mas outra já se forma — como ' +
          'a Terra que se recusa a parar de existir.',
        caos_zyrhun:
          'Um campo de distorção caótica envolve o alvo — a realidade ' +
          'em torno dele fluctua de forma imprevisível, e ataques que ' +
          'deveriam conectar são desviados por anomalias espaciais ' +
          'aleatórias. O escudo do Caos funciona, mas ninguém sabe como ' +
          'ou por quanto tempo.',
        trovao_karyon:
          'Um campo electromagnético reveste o alvo como uma segunda ' +
          'pele — relâmpagos miniaturizados dançam na superfície, e ' +
          'qualquer atacante corpo-a-corpo recebe uma descarga eléctrica ' +
          'punitiva que contrai músculos e afasta instintivamente.',
        oceanos_neryth:
          'Uma película de água densa envolve o alvo como uma armadura ' +
          'líquida — golpes são absorvidos pela pressão aquática, ' +
          'desacelerados e dissipados antes de atingir a carne. A água ' +
          'se reconstitui depois de cada impacto como uma maré que não ' +
          'cessa.',
        beleza_lyrea:
          'Uma aura de fascínio envolve o alvo — atacantes são tomados ' +
          'por uma hesitação involuntária no instante do golpe, seus ' +
          'músculos recusando-se a ferir algo que parece tão... perfeito. ' +
          'A beleza é o escudo mais cruel: funciona até contra a vontade.',
        ordem_ordelyne:
          'Um escudo de luz dourada se materializa — geométrico, perfeito, ' +
          'com bordas que brilham como o fio de uma espada recém-forjada. ' +
          'Cada ataque é recebido e redistribuído com eficiência marcial, ' +
          'e o escudo responde com um pulso de luz punitivo.',
        morte_morvethra:
          'Uma aura de decadência envolve o alvo — não como protecção, ' +
          'mas como aviso. Atacantes que se aproximam sentem seus membros ' +
          'pesarem, suas feridas doerem mais, e um medo primitivo de que ' +
          'cada passo em direcção ao alvo é um passo em direcção à Morte.',
        trevas_kharvion:
          'Sombras se adensam ao redor do alvo como um manto vivo, ' +
          'absorvendo ataques na escuridão e devolvendo apenas silêncio. ' +
          'Dentro do manto, o alvo está seguro. Fora dele, os atacantes ' +
          'não conseguem encontrá-lo — como se ele tivesse caído nos ' +
          'poços de Kharvion e levado consigo a própria existência.',
        teia_mabryth:
          'Uma teia defensiva se tece instantaneamente ao redor do alvo ' +
          '— fios que vibram e detectam ameaças, retesando-se em barreiras ' +
          'rígidas no ponto exacto do impacto. Atacantes ficam com armas ' +
          'presas nos fios pegajosos, e o veneno nos filamentos garante ' +
          'que recuem com as mãos dormentes.'
      }
    },

    // ─────────────────────────────────────────────────
    // DESLOCAR — Teletransporte e Empurrão Tático
    // ─────────────────────────────────────────────────
    deslocar: {
      nome: 'Deslocar',
      intencao: 'utilidade',
      custoBase: 2,
      multiplicadorDados: 0.5,
      acaoBase: 'Ação Padrão',
      formulaDano: (_circulo) => null,
      curvas: { curvaAlcance: 'quadratica', curvaArea: 'lenta', curvaDuracao: 'constante', curvaVisibilidade: 'linear' },
      efeitoBase: 'Teletransporte, empurrão forçado ou gravidade alterada no mapa.',
      descricao:
        'Deslocar é o verbo do controle espacial — a arte de decidir onde ' +
        'cada peça do tabuleiro deve estar. Não é dano, não é cura: é a ' +
        'imposição da vontade sobre a geometria do campo de batalha, ' +
        'movendo aliados para posições vantajosas e arremessando inimigos ' +
        'para longe de onde querem estar. Os Dragões deslocaram montanhas ' +
        'com o bater de asas; o conjurador desloca destinos com um gesto.',
      template: {
        sopro_archeon:
          'O tecido do espaço se dobra como pergaminho sob os dedos de ' +
          'Archëon — o alvo desaparece num flash de luz primordial e ' +
          'reaparece noutra posição com o estalo silencioso de uma criação ' +
          'que se refaz.',
        sol_pyrael:
          'Uma explosão solar impulsiona o alvo como uma rajada de calor ' +
          'comprimido — arremessado pela força do Sol que um dia disputou ' +
          'os céus com a Lua, o corpo voa em arco e aterra com o cheiro ' +
          'de ozônio e ambição queimada.',
        lua_nyxara:
          'O alvo se dissolve em neblina prateada e se recondensa noutra ' +
          'posição como um sonho que muda de cena. A transição é tão ' +
          'silenciosa que os observadores duvidam do que viram — talvez ' +
          'ele sempre estivesse ali.',
        tempo_khairos:
          'O alvo não se move — o tempo ao redor dele recua. Para todos os ' +
          'outros, ele simplesmente aparece na posição em que estava ' +
          'segundos atrás, como se os últimos momentos tivessem sido ' +
          'apagados da cronologia do mundo.',
        saber_aethrys:
          'Glifos de teleportação se inscrevem no ar em sequência ' +
          'matemática — coordenadas arcanas que definem exactamente para ' +
          'onde o alvo vai. Não há aleatoriedade, não há risco: é a ' +
          'precisão científica do conhecimento aplicada ao espaço.',
        vida_elyssera:
          'Raízes subterrâneas se conectam como uma rede e puxam o alvo ' +
          'para baixo — ele afunda no solo como se a Terra o engolisse e ' +
          'é vomitado em outra posição, coberto de terra e fungos, mas ' +
          'intacto. Os Feyrin sempre souberam viajar assim.',
        terra_maelthra:
          'O chão sob o alvo se liquefaz momentaneamente — ele afunda ' +
          'como em areia movediça e é cuspido por outra fissura na terra ' +
          'a metros de distância. Ou um pilar de rocha se ergue com ' +
          'violência, arremessando o alvo pela força tectónica.',
        caos_zyrhun:
          'A posição do alvo simplesmente muda — sem transição, sem ' +
          'efeito visual, sem lógica. Num instante ele está aqui, no ' +
          'seguinte está ali. A física olha para o lado e finge que não ' +
          'viu. Mesmo o conjurador não tem certeza de como funcionou.',
        trovao_karyon:
          'Uma onda de choque eléctrica dispara e arremessa o alvo ' +
          'com a força de um trovão concentrado — o corpo voa, membros ' +
          'se agitam descontroladamente, e o impacto da aterragem é ' +
          'acompanhado por faíscas e o cheiro de ar ionizado.',
        oceanos_neryth:
          'Uma corrente de água impossível se forma e arrasta o alvo ' +
          'como uma maré de enchente — transportando-o para longe ou ' +
          'para perto com a determinação dos rios que os Dragões ' +
          'esculpiram nos vales de Aetherion.',
        beleza_lyrea:
          'O alvo é envolvido numa névoa iridescente e, quando a névoa ' +
          'se dissipa, está numa posição diferente — como se a beleza o ' +
          'tivesse levado num passo de dança que cruzou o campo de ' +
          'batalha inteiro.',
        ordem_ordelyne:
          'Linhas douradas se projetam no chão como uma grade tática, e ' +
          'o alvo desliza pela grade até a posição designada — obedecendo ' +
          'à geometria perfeita de Ordelyne sem resistência. A Ordem não ' +
          'pede. A Ordem posiciona.',
        morte_morvethra:
          'O alvo sente suas pernas moverem-se contra a vontade — a ' +
          'Morte o puxa para onde ela quer que ele esteja, e resistir é ' +
          'tão inútil quanto resistir ao envelhecimento. O corpo se ' +
          'desloca com movimentos rígidos de cadáver, e quando pára, há ' +
          'um instante de horror ao perceber que não foi ele quem andou.',
        trevas_kharvion:
          'O alvo é engolido pela sua própria sombra e vomitado pela ' +
          'sombra de outro objecto ou criatura. A passagem pelas Trevas ' +
          'é breve — mas o alvo jura que ouviu os sussurros dos ' +
          'condenados de Kharvion durante uma eternidade.',
        teia_mabryth:
          'Fios de seda arcana se prendem ao alvo e o puxam como uma ' +
          'marionete — arrastado pelo campo de batalha com a elegância ' +
          'brutal de uma aranha que reposiciona sua presa na teia antes ' +
          'de se alimentar. A vítima não se desloca — é deslocada.'
      }
    }
  },

  // ===========================================================
  // CAMADA 3 — MODIFICADORES (FORMA, ALCANCE E IMPOSTOS)
  // ===========================================================
  // V4.0 — Arquitetura de Intenções:
  //   A propriedade `descricao` deixou de ser uma string única e
  //   passou a ser um objeto com três chaves de intenção:
  //     descricao.ofensivo  → foco em dano, laceração, destruição
  //     descricao.defensivo → foco em barreiras, absorção, resiliência
  //     descricao.utilidade → foco em distorção do Véu, aprisionamento
  //                           metafísico, manipulação espacial/temporal
  //
  //   A função gerarDescricaoMagia() detecta a `intencao` do verbo
  //   e seleciona automaticamente a string correta, eliminando as
  //   contradições narrativas (ex: "Proteger + Fragmentado" não dirá
  //   mais que o escudo "metralhará os monstros com estilhaços letais").
  //
  //   Blindagem NaN (V4.0):
  //   Todos os campos `ajAlcance`, `ajArea`, `ajDuracao`, `ajVisibilidade`
  //   são garantidos como número via fallback `|| 0` na leitura.
  //
  // Novos modificadores adicionados nesta versão:
  //   - Dobra Espacial  (distorção do Véu / teletransporte implícito)
  //   - Sacrifício Vital (custo em PV do conjurador / poder amplificado)
  //   - Eco Persistente  (ressonância que repete o efeito em escala menor)

  modificadores: {

    // ─────────────────────────────────────────────────
    // DIRECIONADO — Alvo Único, Alcance Curto
    // ─────────────────────────────────────────────────
    direcionado: {
      nome: 'Direcionado',
      custoExtra: 0,
      ajustes: { ajAlcance: +0, ajArea: -1, ajDuracao: +0, ajVisibilidade: +0 },
      efeitoMecanico: 'Alvo único, alcance curto.',
      descricao: {
        ofensivo:
          'A forma mais instintiva da violência arcana — um único ponto de ' +
          'foco, uma única vítima, um único destino. Sem dispersão, sem ' +
          'desperdício. O conjurador olha para o alvo, e o universo inteiro ' +
          'se comprime num feixe que conecta o dedo estendido ao coração ' +
          'exposto. Cada gota de energia vai para onde dói mais.',
        defensivo:
          'A proteção mais pura e concentrada — toda a energia canalizada ' +
          'flui para um único destinatário, envolvendo-o num casulo sem ' +
          'brechas. Não há dispersão entre vários corpos, não há diluição ' +
          'do escudo: o alvo escolhido recebe a barreira intacta, densa ' +
          'como granito e inabalável como a vontade do conjurador.',
        utilidade:
          'Precisão metafísica destilada numa única intenção — o efeito ' +
          'localiza seu alvo no tecido do Véu com a exatidão de uma agulha ' +
          'que costura dois planos. Sem interferência colateral, sem ' +
          'ressonâncias indesejadas: o alvo certo, o momento certo, ' +
          'o impacto que o Mestre do tempo, Khaíros, aprovaria.',
      },
      template:
        'A energia se concentra num feixe cirúrgico — o conjurador fixa o ' +
        'olhar no alvo com a precisão de um falcão que seleccionou sua ' +
        'presa. Não há escapatória na linha recta entre a vontade e o ' +
        'impacto. Um alvo. Uma sentença.'
    },

    // ─────────────────────────────────────────────────
    // CAÓTICO — Dispersão Imprevisível
    // ─────────────────────────────────────────────────
    caotico: {
      nome: 'Caótico',
      custoExtra: 2,
      ajustes: { ajAlcance: +0, ajArea: +0, ajDuracao: +0, ajVisibilidade: +2 },
      efeitoMecanico: 'Dispersão imprevisível, chance de ricochetear.',
      descricao: {
        ofensivo:
          'O legado de Zyrhûn inscrito na própria forma do ataque — a rejeição ' +
          'de toda previsibilidade destrutiva. A energia se fragmenta como estilhaços ' +
          'de um espelho partido, cada shard ricocheteando em superfícies impossíveis ' +
          'e lançando-se contra tudo que respira com a mesma indiferença sanguinária ' +
          'que o Caos semeou durante a Grande Guerra. Aliados e inimigos sangram ' +
          'igualmente sob uma chuva que não escolhe lados.',
        defensivo:
          'O Caos abraça o defensor como uma segunda pele de entropia controlada — ' +
          'a barreira não é um muro rígido, mas uma nuvem de anomalias espaciais que ' +
          'deflectem ataques em trajectórias imprevisíveis. Cada golpe que deveria ' +
          'conectar é desviado para um ângulo impossível, ricocheteia no vazio entre ' +
          'os planos ou simplesmente desaparece, engolido pelo ruído branco do Caos ' +
          'que envolve o alvo como um escudo de puro acidente.',
        utilidade:
          'O experimento de Zyrhûn em miniatura — o efeito se desprende da ' +
          'intenção original e se espalha pelas fissuras do Véu Trincado de ' +
          'forma errática. Áreas adjacentes ao alvo original são tocadas por ' +
          'ressonâncias colaterais, cada uma com comportamento ligeiramente ' +
          'diferente, como os Quatro Ventos que ignoram fronteiras e geram ' +
          'conflitos eternos onde quer que soprem.',
      },
      template:
        'A energia irrompe de forma errática — fragmentos ricocheteiando ' +
        'contra paredes, chão e tecto com trajectórias que desafiam a ' +
        'física. O conjurador sente o riso distante de Zyrhûn ecoar em ' +
        'sua mente enquanto o poder se dispersa em direcções impossíveis. ' +
        'A destruição é certa. O alvo exacto... nem tanto.'
    },

    // ─────────────────────────────────────────────────
    // CONTÍNUO — Duração Sustentada
    // ─────────────────────────────────────────────────
    continuo: {
      nome: 'Contínuo',
      custoExtra: 3,
      ajustes: { ajAlcance: +0, ajArea: +0, ajDuracao: +2, ajVisibilidade: +1 },
      efeitoMecanico:
        'Duração sustentada por rodadas (Limitado a 3 rodadas ou ' +
        'igual ao círculo injetado, o que for menor). Exige Ação Bônus.',
      descricao: {
        ofensivo:
          'A magia que se recusa a deixar o inimigo respirar — mantida pelo ' +
          'fio de vontade do conjurador como as marés de Nerýth que nunca ' +
          'cessam. O alvo não recebe um único golpe e tem tempo de se recompor; ' +
          'recebe a pressão constante de um poder que corrói, queima, lacera ' +
          'ou dissolve rodada após rodada, até que a vontade do conjurador ' +
          'se esgote ou o inimigo deixe de estar de pé.',
        defensivo:
          'O escudo que não se dissipa com o primeiro impacto — sustentado ' +
          'pelo ciclo de dias e noites que Khaíros teceu para toda a eternidade, ' +
          'a barreira persiste enquanto a Ação Bônus do conjurador a alimentar. ' +
          'Cada rodada que passa, o escudo reabsorve os golpes recebidos e os ' +
          'converte em calor residual, luz ou pedra que se refaz, resiliente ' +
          'como a promessa de um deus que nunca precisou pedir desculpas.',
        utilidade:
          'O efeito se torna um pulso rítmico no Véu — como o coração ' +
          'adormecido de Archëon que ainda faz o sangue da criação circular ' +
          'pelas veias ocultas de Aetherion. A alteração, a ligação ou o ' +
          'aprisionamento se mantém rodada após rodada, cada batida ' +
          'reafirmando a intenção do conjurador sobre o tecido da realidade ' +
          'ao custo de uma Ação Bônus que drena como areia de ampulheta.',
      },
      template:
        'O efeito não se dissipa — persiste, pulsa, arde. A energia do ' +
        'conjurador alimenta a magia rodada após rodada como sangue ' +
        'nutrindo um órgão vital. Os olhos do conjurador brilham com ' +
        'esforço contido, veias pulsam na testa, e o ar ao redor vibra ' +
        'com a tensão de uma vontade que se recusa a ceder. A cada ' +
        'momento que passa, o custo se faz sentir — mas o efeito ' +
        'permanece, inabalável como a promessa de um deus.'
    },

    // ─────────────────────────────────────────────────
    // FRAGMENTADO — Efeito Dividido
    // ─────────────────────────────────────────────────
    fragmentado: {
      nome: 'Fragmentado',
      custoExtra: 1,
      ajustes: { ajAlcance: -1, ajArea: +1, ajDuracao: +0, ajVisibilidade: +1 },
      efeitoMecanico: 'Divide o efeito bruto entre múltiplos alvos menores.',
      descricao: {
        ofensivo:
          'A energia se estilhaça em múltiplos fragmentos pontiagudos, como o ' +
          'último suspiro de Archëon que se despedaçou nos Quatro Ventos Dragônicos. ' +
          'Cada shard busca um corpo diferente com instinto de projétil, ' +
          'bombardeando o campo de batalha com uma saraivada de impactos que ' +
          'sangram e rompem de forma simultânea — menos letal por ponto, ' +
          'mas impiedosa na amplitude da destruição espalhada.',
        defensivo:
          'O escudo se divide numa colmeia de micro-barreiras flutuantes, ' +
          'hexagonais como o padrão das fortalezas Durkan esculpidas nas ' +
          'cadeias de montanhas de Aetherion. Cada fragmento intercepta ' +
          'ataques vindos de ângulos diferentes com autonomia própria — ' +
          'a proteção cobre múltiplas direcções simultaneamente, sem ' +
          'brechas para um segundo golpe lateral enquanto o escudo ' +
          'central absorve o primeiro.',
        utilidade:
          'O efeito se fraciona em pequenas ressonâncias instáveis que ' +
          'se propagam pelo tecido do Véu como ondas de um único impacto ' +
          'no espelho de um lago. Cada fragmento pode tocar um alvo menor ' +
          'ou uma fissura diferente do Véu Trincado, permitindo afetar ' +
          'múltiplos pontos de interesse metafísico de forma simultânea — ' +
          'à custa de que nenhum receba o peso total da intenção.',
      },
      template:
        'A energia se fractura em múltiplos fragmentos — como o último ' +
        'suspiro de Archëon que se despedaçou nos Quatro Ventos Dragônicos. ' +
        'Cada estilhaço procura um alvo diferente, menor em poder mas ' +
        'impiedoso em alcance. O campo de batalha se ilumina com ' +
        'múltiplos impactos simultâneos, como uma chuva de estrelas ' +
        'cadentes que não trazem desejos — trazem consequências.'
    },

    // ─────────────────────────────────────────────────
    // ESTÁVEL — Alcance Longo, Sem Riscos Ambientais
    // ─────────────────────────────────────────────────
    estavel: {
      nome: 'Estável',
      custoExtra: 1,
      ajustes: { ajAlcance: +2, ajArea: +0, ajDuracao: +0, ajVisibilidade: -1 },
      efeitoMecanico: 'Garante alcance longo e elimina riscos ambientais mundanos.',
      descricao: {
        ofensivo:
          'A violência calculada e sem margem de erro — o ataque percorre ' +
          'distâncias longas sem se degradar, sem ser desviado pelo vento ' +
          'ou pela chuva, sem o risco de interferência mundana. É a certeza ' +
          'em forma de dano: como as leis universais que Aethrýs integrou ' +
          'ao mundo, este golpe obedece a regras absolutas. A distância ' +
          'não o enfraquece. Apenas a morte do conjurador o para.',
        defensivo:
          'A barreira que se estende além do braço alcança — um escudo ' +
          'que pode envolver aliados distantes com a mesma solidez de um ' +
          'que envolve quem está ao lado. Com a disciplina dos Grotans da ' +
          'Ordem que marcham em formações inabaláveis, a energia defensiva ' +
          'percorre o intervalo sem perda de coesão, sem que o vento ou a ' +
          'chuva dilua a espessura da proteção erguida.',
        utilidade:
          'O controle absoluto sobre a trajectória e a integridade do efeito ' +
          '— como a precisão calculada de Aethrýs que concedeu a língua ' +
          'universal sem distorção entre o que foi dito e o que foi ' +
          'compreendido. A manipulação, o aprisionamento ou o deslocamento ' +
          'alcança o ponto desejado sem interferência de forças externas, ' +
          'sem desvios pelo Véu Trincado que poderiam distorcer a intenção.',
      },
      template:
        'A energia se estabiliza com disciplina arcana — o feixe percorre ' +
        'a distância sem oscilação, sem degradação, sem o risco de ' +
        'interferência mundana. Como as leis universais que Aethrýs ' +
        'propôs integrar ao mundo para aprimorá-lo, esta magia obedece a ' +
        'regras absolutas. O vento não a desvia. A chuva não a apaga. ' +
        'A distância não a enfraquece. Apenas a vontade do conjurador ' +
        'determina onde ela termina.'
    },

    // ─────────────────────────────────────────────────
    // ESPELHADO — Duplicação de Origem
    // ─────────────────────────────────────────────────
    espelhado: {
      nome: 'Espelhado',
      custoExtra: 2,
      ajustes: { ajAlcance: +0, ajArea: +1, ajDuracao: +0, ajVisibilidade: +2 },
      efeitoMecanico: 'Duplica o ponto de origem através de um clone ilusório/cópia.',
      descricao: {
        ofensivo:
          'A duplicação nascida da arte de Lyrëa como arma — a capacidade de ' +
          'criar um segundo ponto de origem tão convincente que o golpe irrompe ' +
          'de dois ângulos simultaneamente. O inimigo eleva o escudo contra a ' +
          'frente e recebe o impacto pelas costas, onde um reflexo que não ' +
          'deveria existir projeta dano com a mesma força do original, como os ' +
          'eclipses de Khaíros onde o sol atinge quando todos esperavam a sombra.',
        defensivo:
          'O espelho erguido como proteção — um segundo escudo ilusório se ' +
          'materializa numa posição simétrica ao primeiro, tão real que até ' +
          'a magia acredita nele. Ataques que contornam a barreira primária ' +
          'encontram uma segunda camada inesperada, e o agressor que golpeou ' +
          'o reflexo sente a resistência plena de algo que teoricamente não ' +
          'deveria estar ali para o deter.',
        utilidade:
          'O efeito se bifurca como os rios que Nerýth Kalos traçou nos ' +
          'vales esculpidos pelos Dragões — duas correntes saindo do mesmo ' +
          'ponto de nascente, cada uma alcançando um destino diferente. O ' +
          'Véu reconhece os dois pontos como simultâneos e os trata com ' +
          'igual peso, permitindo que a mesma intenção toque dois lugares ' +
          'distintos num único gesto de conjuração.',
      },
      template:
        'Uma cópia ilusória do conjurador se materializa numa posição ' +
        'espelhada — perfeita como os reflexos nos espelhos de Lyrëa, tão ' +
        'real que até a magia acredita. O efeito irrompe de dois pontos ' +
        'de origem simultâneos, e o alvo que bloqueia um é atingido pelo ' +
        'outro — como os eclipses que Khaíros criou, onde Sol e Lua se ' +
        'encontram e o mundo nunca sabe para qual olhar.'
    },

    // ─────────────────────────────────────────────────
    // LATENTE — Armadilha de Gatilho
    // ─────────────────────────────────────────────────
    latente: {
      nome: 'Latente',
      custoExtra: 2,
      ajustes: { ajAlcance: +0, ajArea: +0, ajDuracao: +0, ajVisibilidade: -2 },
      efeitoMecanico: 'Transforma a magia numa armadilha tática de gatilho num quadrado do mapa.',
      descricao: {
        ofensivo:
          'A paciência de Mabryth destilada em emboscada letal — a magia não ' +
          'se manifesta ao ser conjurada. Ela dorme. Espera. Observa. Presa ' +
          'num quadrado do mapa como uma aranha que sabe que a presa cruzará ' +
          'o fio inevitavelmente. Quando o gatilho é activado, toda a violência ' +
          'acumulada desperta de um só golpe, com a fúria amplificada de algo ' +
          'que teve todo o tempo do mundo para se preparar para lacerar.',
        defensivo:
          'Uma proteção que nasce do gatilho — a barreira permanece adormecida ' +
          'e invisível até que a ameaça se aproxime do ponto marcado, e então ' +
          'se ergue de forma instantânea, sem o custo de uma reação prévia do ' +
          'conjurador. O escudo latente surge entre o golpe e a carne no ' +
          'preciso instante em que seria necessário, como as teias de Mabryth ' +
          'que já estavam lá muito antes de a presa perceber que pisou nelas.',
        utilidade:
          'A armadilha metafísica tecida no Véu — o efeito dorme como um ' +
          'glifo invisível no tecido da realidade, aguardando o gatilho ' +
          'que o acorde. Quando o gatilho se activa, a magia irrompe ' +
          'com toda a sua potência não-gasta, distorcendo o Véu, ' +
          'aprisionando entidades ou deslocando corpos com a violência ' +
          'contida de quem não desperdiçou energia na antecipação.',
      },
      template:
        'A energia é tecida no chão como um glifo invisível — adormecida, ' +
        'paciente, como as teias de Mabryth que aguardam eternidades pela ' +
        'presa perfeita. O quadrado do mapa pulsa imperceptivelmente, e ' +
        'apenas o conjurador sabe que cada passo em sua direcção é um passo ' +
        'mais perto do despertar. Quando o gatilho é activado — seja por ' +
        'proximidade, toque ou intenção hostil — a magia irrompe com a ' +
        'violência contida de uma armadilha que teve todo o tempo do mundo ' +
        'para se preparar.'
    },

    // ─────────────────────────────────────────────────
    // SIMBIONTE — Armadilha de Aliado (V3.1)
    // ─────────────────────────────────────────────────
    simbionte: {
      nome: 'Simbionte',
      custoExtra: 2,
      ajustes: { ajAlcance: +0, ajArea: +0, ajDuracao: +1, ajVisibilidade: -2 },
      efeitoMecanico:
        'A magia fica dormente, alojada num aliado, e ativa-se como Reação ' +
        'no instante em que esse aliado sofre um ataque corpo a corpo. ' +
        'Restrição de Balanceamento: válido apenas para magias de Círculo 1 ' +
        'a 4 (impede combinações de "one-shot" atrasado em círculos altos).',
      restricaoCirculo: { min: 1, max: 4 },
      descricao: {
        ofensivo:
          'A víbora plantada sob a pele do aliado — não para protegê-lo ' +
          'gentilmente, mas para responder com brutalidade igual à que o ' +
          'tocou. O Simbionte dorme no sangue de quem o carrega até que ' +
          'o corpo hospedeiro seja atingido em combate corpo a corpo, e ' +
          'então desperta com a fúria explosiva de algo que observou ' +
          'a agressão de perto e escolheu o momento perfeito para contraatacar.',
        defensivo:
          'A forma mais íntima e protetora da paciência arcana — uma semente ' +
          'plantada sob a pele de um aliado confiante que absorve o impacto ' +
          'do golpe recebido e o converte em escudo. No instante em que a ' +
          'violência toca o hospedeiro, o Simbionte desperta e interpõe uma ' +
          'barreira entre a carne e o dano, como um segundo coração que ' +
          'bate precisamente quando o primeiro deveria parar.',
        utilidade:
          'A ligação que nasce do trauma — o Simbionte dorme no fluxo ' +
          'vital do aliado como uma ressonância do Véu enroscada em seu ' +
          'sistema nervoso. Ao ser golpeado em corpo a corpo, o portador ' +
          'dispara involuntariamente o efeito encapsulado: um deslocamento, ' +
          'um selo, uma alteração — a intenção original do conjurador ' +
          'se liberta com a adrenalina do momento, sem gasto adicional.',
      },
      template:
        'A energia se enrosca como um segundo coração sob a pele do aliado ' +
        '— invisível, silenciosa, esperando. Ninguém percebe o peso extra ' +
        'que ele carrega até o golpe descer. No instante do impacto corpo a ' +
        'corpo, o Simbionte desperta com violência reativa, irrompendo de ' +
        'dentro para fora como uma resposta que o próprio corpo do aliado ' +
        'não sabia que guardava.'
    },

    // ─────────────────────────────────────────────────
    // CONDENSADO — Dano Máximo, Tudo ou Nada (V3.1)
    // ─────────────────────────────────────────────────
    condensado: {
      nome: 'Condensado',
      custoExtra: 0,
      custoMultiplicador: 3,
      ajustes: { ajAlcance: +0, ajArea: -3, ajDuracao: +0, ajVisibilidade: +1 },
      efeitoMecanico:
        'Esmaga uma magia de "Grande Área" até "Alvo Único (Toque)". O ' +
        'conjurador não rola os dados — aplica o Dano Máximo instantâneo. ' +
        'Restrição de Balanceamento: o Custo (Sopro/Mácula) é TRIPLICADO. ' +
        'É "Tudo ou Nada": se o alvo passar no teste de resistência, recebe ' +
        '0 de dano em vez da metade.',
      tudoOuNada: true,
      descricao: {
        ofensivo:
          'O oposto absoluto da dispersão — toda a força que poderia varrer ' +
          'um campo de batalha inteiro é comprimida, esmagada, condensada ' +
          'num único ponto de contacto letal. Não há sorte envolvida, não há ' +
          'variação de dados: apenas o Dano Máximo, certo e instantâneo, ' +
          'como uma sentença já escrita antes de ser proferida. Mas a aposta ' +
          'é cruel — se o alvo resistir, a energia condensada se dissipa ' +
          'por completo, sem o consolo de um dano parcial.',
        defensivo:
          'Todo o poder defensivo que protegeria um grupo inteiro é ' +
          'colapsado sobre um único destinatário — um casulo de proteção ' +
          'tão denso que rivaliza com as fortalezas Durkan nas cadeias de ' +
          'montanhas de Aetherion. O custo triplicado reflete o esforço de ' +
          'comprimir no Toque o que deveria se expandir por um raio, e a ' +
          'barreira resultante é absoluta ou não existe — não há meio-termo ' +
          'entre o muro perfeito e o muro que desmoronou.',
        utilidade:
          'A intenção inteira colapsada num único instante de contacto — ' +
          'o aprisionamento, o deslocamento ou a alteração que afetaria uma ' +
          'área se concentra no ponto de toque com precisão cirúrgica. O ' +
          'efeito é instantâneo e total, sem gradação, sem resistência parcial: ' +
          'o Véu se dobra completamente ao redor do ponto escolhido ou não ' +
          'se dobra em nada, cobrado o triplo do recurso habitual.',
      },
      template:
        'Toda a energia que se espalharia por um raio inteiro é forçada a ' +
        'colapsar num único ponto, comprimida com violência contra a ' +
        'própria natureza dispersiva da magia. O ar ao redor implode por ' +
        'uma fração de segundo antes do impacto — não uma onda, mas uma ' +
        'agulha de poder máximo, certeira e absoluta. O conjurador sente o ' +
        'custo pesar triplicado em seu corpo: é tudo ou é nada.'
    },

    // ─────────────────────────────────────────────────
    // DOBRA ESPACIAL — Distorção do Véu (V4.0)
    // ─────────────────────────────────────────────────
    dobra_espacial: {
      nome: 'Dobra Espacial',
      custoExtra: 3,
      ajustes: { ajAlcance: +3, ajArea: +0, ajDuracao: +0, ajVisibilidade: +1 },
      efeitoMecanico:
        'O efeito ignora a distância euclidiana e atravessa o Véu para ' +
        'atingir o alvo. Trata alcance como Persiste até acertar; ' +
        'obstáculos físicos não bloqueiam linha de efeito.',
      descricao: {
        ofensivo:
          'As fissuras do Véu Trincado tornam-se atalhos para o dano — a ' +
          'energia do ataque não viaja pelo espaço físico entre conjurador e ' +
          'alvo; ela se esgueira pelas fendas que as entidades de Nythraxis ' +
          'usam para sussurrar nos ouvidos dos mortais e reemerge do outro ' +
          'lado da barreira ou da parede como se o obstáculo nunca tivesse ' +
          'existido. Muros não param o que viaja pelo entre-planos.',
        defensivo:
          'O escudo não se ergue ao redor do alvo — ele se materializa ' +
          'através do Véu, como uma barreira que existe simultaneamente ' +
          'em dois planos. Ataques que atingem o alvo no plano físico ' +
          'são parcialmente absorvidos pelo plano espiritual, dissipados ' +
          'nas fendas que os deuses não conseguiram selar depois da guerra ' +
          'de Zyrhûn, e o que chega de volta é apenas o eco enfraquecido ' +
          'de um golpe que perdeu sua substância na travessia.',
        utilidade:
          'A dobra do Véu como ferramenta de precisão — o efeito salta ' +
          'pelas fissuras entre o mundo físico e o espiritual, ignorando ' +
          'os limites que o espaço euclidiano imporia. Selos se inscrevem ' +
          'em alvos que estão do outro lado de paredes; deslocamentos ' +
          'atravessam obstáculos como se fossem névoa; alterações alcançam ' +
          'corpos que a linha de visão normal nunca poderia tocar.',
      },
      template:
        'O ar à frente do conjurador se amassa e rasga — uma fenda vertical ' +
        'de luz negra e prateada, como as trincas que o Véu jamais conseguiu ' +
        'fechar desde a guerra de Zyrhûn. O efeito desaparece na fenda e ' +
        'reaparece do outro lado do obstáculo, sem anunciar sua chegada. ' +
        'O espaço entre os dois planos é o caminho mais curto.'
    },

    // ─────────────────────────────────────────────────
    // SACRIFÍCIO VITAL — Poder Comprado com Sangue (V4.0)
    // ─────────────────────────────────────────────────
    sacrificio_vital: {
      nome: 'Sacrifício Vital',
      custoExtra: 0,
      ajustes: { ajAlcance: +0, ajArea: +1, ajDuracao: +1, ajVisibilidade: +2 },
      efeitoMecanico:
        'O conjurador paga (Círculo × 2) PV próprios como custo adicional. ' +
        'Em troca, o efeito aumenta de escala em Área e Duração, e a ' +
        'Visibilidade sobe dois graus. O recurso arcano (Sopro/Mácula) ' +
        'permanece o mesmo — o sangue substitui parte do esforço metafísico.',
      descricao: {
        ofensivo:
          'O poder que nenhum feitiço comprado com recurso arcano pode ' +
          'igualar — porque este foi comprado com sangue do próprio conjurador. ' +
          'Como os deuses que sacrificaram partes de seu poder para criar ' +
          'Morvethra e Ordelyne, o conjurador abre uma veia de sua própria ' +
          'vitalidade e a converte em dano amplificado, em área expandida, ' +
          'em destruição que ecoa pelos dois planos simultaneamente. A carne ' +
          'dói. O inimigo também.',
        defensivo:
          'A proteção mais genuína é aquela que custa ao protetor — como ' +
          'Khaíros, Elysséra e Nyxara que sacrificaram partes de seu próprio ' +
          'poder para criar Morvethra e salvar o mundo da agonia eterna. ' +
          'O conjurador paga em PV próprios para erguer um escudo ampliado ' +
          'que cobre mais aliados, dura mais rodadas e brilha com a ' +
          'intensidade de uma devoção que o custo do Sopro não poderia comprar.',
        utilidade:
          'A mácula do sangue como catalisador metafísico — o Véu responde ' +
          'ao sacrifício vital com uma abertura mais generosa, deixando o ' +
          'efeito penetrar mais fundo, alcançar alvos mais distantes no ' +
          'plano espiritual e persistir por mais tempo antes de colapsar. ' +
          'As entidades de Nythraxis reconhecem o preço pago em carne e ' +
          'desviam-se do caminho da intenção, como se o sangue as espantasse.',
      },
      template:
        'O conjurador fecha o punho e aperta — não uma pedra de foco, mas ' +
        'a palma da própria mão. Uma fina linha vermelha se forma. O sangue ' +
        'não cai: converte-se em luz que permeia a magia e a expande além ' +
        'do que o Sopro ou a Mácula sozinhos sustentariam. O custo é visível ' +
        'no rosto do conjurador — palidez, pupilas dilatadas — mas o efeito ' +
        'pulsa com uma intensidade que os recursos comuns não alcançam.'
    },

    // ─────────────────────────────────────────────────
    // ECO PERSISTENTE — Ressonância Secundária (V4.0)
    // ─────────────────────────────────────────────────
    eco_persistente: {
      nome: 'Eco Persistente',
      custoExtra: 2,
      ajustes: { ajAlcance: +0, ajArea: +0, ajDuracao: +1, ajVisibilidade: +0 },
      efeitoMecanico:
        'No início do próximo turno do conjurador, o feitiço ecoa ' +
        'automaticamente com metade do Círculo original (arredondado para ' +
        'baixo, mínimo 1), sem custo adicional de recurso. O Eco não ' +
        'pode ser modificado por outros modificadores e não gera novos Ecos.',
      descricao: {
        ofensivo:
          'Como o rugido de trovão de Káryon que ressoa nas montanhas ' +
          'muito depois do raio original se dissipou — o ataque deixa uma ' +
          'ressonância no Véu que se propaga de volta ao alvo no turno ' +
          'seguinte, mais fraca mas igualmente real. O inimigo que acreditava ' +
          'ter sobrevivido ao golpe inicial descobre, um momento depois, que ' +
          'o Véu ainda guarda a memória do dano e a repete, como um eco ' +
          'que insiste em doer.',
        defensivo:
          'O escudo que deixa um rastro de proteção — a barreira primária ' +
          'pode se dissipar, mas a ressonância dela persiste no Véu por ' +
          'mais um turno, como o Calýndor que carrega o declínio mas ' +
          'nunca o faz de forma abrupta. No início do turno seguinte, ' +
          'uma versão enfraquecida da proteção se reerge automaticamente, ' +
          'como se o Véu tivesse memória do escudo e insistisse em repeti-lo ' +
          'uma última vez por conta própria.',
        utilidade:
          'O efeito se inscreve no Véu como uma runa de ressonância — ' +
          'a primeira manifestação altera, sela ou desloca com força total, ' +
          'e o Eco no turno seguinte reforça ou reaplica a intenção em ' +
          'escala menor. Como Khaíros estabeleceu os eclipses como ecos ' +
          'dos conflitos primordiais entre Sol e Lua, este modificador ' +
          'estabelece um eco da conjuração original que o Véu repete ' +
          'por iniciativa própria, sem custo ao conjurador.',
      },
      template:
        'A magia impacta — e depois de um instante de silêncio, a realidade ' +
        'estremece levemente de novo. O Véu guardou a memória do feitiço ' +
        'como uma pedra guarda o calor do sol após o pôr do dia. No ' +
        'próximo turno do conjurador, um pulso mais suave, um eco da ' +
        'intenção original, repete-se sem aviso, sem custo, como se ' +
        'Aetherion ainda estivesse processando o que aconteceu.'
    }

  },


  // ===========================================================
  // CAMADA 4 — MANIFESTAÇÕES (V3.1)
  // ===========================================================
  // A 4ª camada determina a FORMA FÍSICA que a magia assume ao se
  // manifestar no mundo. Cada manifestação pertence a um dos 5
  // subgrupos (geometria, projecao, estruturas, orbitais, elos) e
  // injeta tags extras + ajustes de degrau/área no retorno JSON da
  // Ficha, SEM jamais apagar a lore das camadas 1-3.
  //
  // Brechas fechadas pela Auditoria Red Team (ver V3.1):
  //   - Disco: limite de ricochetes = Max(Círculo) alvos, em vez de
  //     50% de chance infinita por turno.
  //   - Lança/Flecha: excedente acima de d12 converte-se em dano fixo
  //     via ajustarDegrau (ver Motor de Degraus), em vez de se perder.
  //
  // Campos de cada manifestação:
  //   nome            → nome de exibição
  //   subgrupo        → 'geometria' | 'projecao' | 'estruturas' | 'orbitais' | 'elos'
  //   ajusteDegrau    → quantos degraus sobe/desce na escadaDados (0 se não aplicável)
  //   ajusteArea      → ajuste bruto somado ao eixo de área (mesma escala dos modificadores, ×2.5)
  //   tags            → array de tags fixas injetadas na Ficha
  //   limiteRicochete → (apenas Disco) função(circulo) → nº máximo de alvos
  //   danoMaximoPrimeiroAlvo → (Linha/Coluna) não rola: aplica valor máximo no 1º alvo
  //   pvEstrutural    → se true, converte o total de dados rolados em PV de estrutura
  //   descricao       → lore da manifestação
  //   template        → texto narrativo combinado ao final de descricaoFinal
  // ===========================================================
  manifestacoes: {

    // ───────────── 2.1 GEOMETRIA (Controle Espacial) ─────────────
    linha: {
      nome: 'Linha',
      subgrupo: 'geometria',
      ajusteDegrau: 0,
      ajusteArea: +1,
      tags: ['Perfura Cobertura', 'Dano Máximo no 1º Alvo'],
      danoMaximoPrimeiroAlvo: true,
      descricao:
        'A magia rasga o espaço num corredor recto e implacável, ignorando ' +
        'anteparos mundanos como se a cobertura fosse apenas uma sugestão ' +
        'educada. O primeiro corpo na trajectória não tem o privilégio do ' +
        'acaso — recebe o Dano Máximo dos dados, sem rolar, como a lança ' +
        'de um deus que já sabia exactamente onde a ponta tocaria a carne.',
      template:
        'A energia dispara em linha recta absoluta, perfurando barreiras ' +
        'mundanas como papel encharcado. O primeiro alvo na trajectória ' +
        'não tem chance de sorte — o impacto é certeiro e máximo, antes ' +
        'que qualquer dado precise rolar.'
    },
    coluna: {
      nome: 'Coluna',
      subgrupo: 'geometria',
      ajusteDegrau: 0,
      ajusteArea: +1,
      tags: ['Perfura Cobertura', 'Dano Máximo no 1º Alvo'],
      danoMaximoPrimeiroAlvo: true,
      descricao:
        'Como a Linha, mas vertical — um pilar de força que despenca ou ' +
        'ascende através de andares, tectos e coberturas com a mesma ' +
        'indiferença implacável. O primeiro corpo atingido recebe o Dano ' +
        'Máximo dos dados, sem rolar.',
      template:
        'A energia se ergue ou despenca como um pilar inabalável, ' +
        'perfurando qualquer cobertura entre os planos vertical. O ' +
        'primeiro alvo na trajectória recebe o impacto máximo, instantâneo ' +
        'e sem chance de variação.'
    },
    cone: {
      nome: 'Cone',
      subgrupo: 'geometria',
      ajusteDegrau: -1,
      ajusteArea: +2,
      tags: ['Dispersão em Cone', 'Área Aumentada'],
      descricao:
        'A energia se abre como as fauces de uma besta primordial, ' +
        'cobrindo um arco cada vez mais largo de terreno à medida que se ' +
        'afasta do conjurador. A dispersão tem um preço: o dado de dano cai ' +
        'um degrau, pois a força que poderia perfurar um único corpo agora ' +
        'se espalha fina demais entre muitos.',
      template:
        'A energia se abre num leque crescente, varrendo um arco generoso ' +
        'de terreno diante do conjurador. A dispersão sacrifica a ' +
        'intensidade do impacto individual em troca de cobertura — menos ' +
        'fatal por alvo, mais difícil de evitar por completo.'
    },
    esfera: {
      nome: 'Esfera',
      subgrupo: 'geometria',
      ajusteDegrau: -1,
      ajusteArea: +2,
      tags: ['Dispersão Esférica', 'Área Aumentada'],
      descricao:
        'Uma bolha de força se expande em todas as direcções a partir de ' +
        'um ponto de origem, indiferente a paredes baixas ou obstáculos ' +
        'parciais. Como o Cone, a dispersão custa um degrau no dado de dano.',
      template:
        'A energia se expande como uma bolha invisível, engolindo tudo ' +
        'dentro do seu raio com igual indiferença. A força que poderia ' +
        'esmagar um único corpo se reparte entre todos os que ousaram ' +
        'permanecer perto demais.'
    },
    halo: {
      nome: 'Halo',
      subgrupo: 'geometria',
      ajusteDegrau: -1,
      ajusteArea: +2,
      tags: ['Dispersão em Anel', 'Área Aumentada', 'Ignora Centro'],
      descricao:
        'A energia se expande em anel, poupando deliberadamente o centro — ' +
        'útil para o conjurador que precisa atingir tudo à sua volta sem se ' +
        'ferir. A dispersão ainda custa um degrau no dado de dano.',
      template:
        'A energia se expande num anel perfeito ao redor do conjurador, ' +
        'poupando o centro como um olho de tempestade calmo. Tudo que ' +
        'cerca esse olho é varrido pela força dispersa do feitiço.'
    },
    muralha: {
      nome: 'Muralha',
      subgrupo: 'geometria',
      ajusteDegrau: 0,
      ajusteArea: +1,
      tags: ['Estrutura: PV Convertido', 'Bloqueia Linha de Visão'],
      pvEstrutural: true,
      descricao:
        'A magia deixa de ser uma arma e se torna um anteparo — os dados ' +
        'totais que normalmente feririam carne são convertidos em Pontos de ' +
        'Vida Estruturais, erguendo uma barreira que bloqueia movimento e ' +
        'linha de visão até ser destruída ou dissipada.',
      template:
        'Em vez de ferir, a energia se solidifica numa parede contínua — ' +
        'translúcida ou opaca, conforme o aspecto canalizado — bloqueando ' +
        'passagem e visão com a mesma força que, noutra forma, teria sido ' +
        'usada para destruir.'
    },
    prisma: {
      nome: 'Prisma',
      subgrupo: 'geometria',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Estrutura: PV Convertido', 'Volume Fechado'],
      pvEstrutural: true,
      descricao:
        'Como a Muralha, mas fechada em todos os lados — uma cela, uma ' +
        'cúpula, uma prisão geométrica que aprisiona ou protege um volume ' +
        'inteiro de espaço. Os dados totais tornam-se PV Estruturais do ' +
        'invólucro.',
      template:
        'A energia se curva sobre si mesma até formar um volume fechado — ' +
        'uma jaula ou cúpula translúcida que aprisiona o espaço interior, ' +
        'tão resistente quanto os dados que a sustentam permitirem.'
    },

    // ───────────── 2.2 PROJEÇÃO (Armas Semi-Físicas) ─────────────
    lanca: {
      nome: 'Lança',
      subgrupo: 'projecao',
      ajusteDegrau: +1,
      ajusteArea: -1,
      tags: ['Alvo Único', 'Projeção: Lança'],
      descricao:
        'A energia se condensa numa haste rígida e veloz, lançada com força ' +
        'perfurante contra um único alvo. A concentração total em um ponto ' +
        'sobe o dado de dano um degrau — e nos aspectos que já residem no ' +
        'teto de d12 (Morvethra, Zyrhûn), o excedente não se perde: ' +
        'converte-se em dano fixo letal adicional por dado, como uma ponta ' +
        'que perfura mesmo o impossível.',
      template:
        'A energia se condensa numa haste afiada e veloz, disparada com a ' +
        'força concentrada de um arpão divino contra um único alvo. Nada ' +
        'se dispersa — tudo perfura.'
    },
    flecha: {
      nome: 'Flecha',
      subgrupo: 'projecao',
      ajusteDegrau: +1,
      ajusteArea: -1,
      tags: ['Alvo Único', 'Projeção: Flecha'],
      descricao:
        'Mais veloz e menos volumosa que a Lança, mas com o mesmo princípio ' +
        'de concentração total — o dado de dano sobe um degrau, com o ' +
        'mesmo tratamento de excedente para aspectos já no teto de d12.',
      template:
        'Um dardo veloz de energia condensada corta o ar com um sibilo ' +
        'agudo, toda a força do feitiço comprimida na ponta de um único ' +
        'projétil certeiro.'
    },
    agulha: {
      nome: 'Agulha',
      subgrupo: 'projecao',
      ajusteDegrau: 0,
      forcaDadoFixo: 'd4',
      ajusteArea: -2,
      tags: ['Ignora Defesas Arcanas', 'Dado Reduzido a d4'],
      descricao:
        'A energia se comprime num filamento finíssimo — tão fino que ' +
        'trespassa escudos arcanos e Pontos de Vida Temporários mundanos ' +
        'como se não existissem. O preço dessa penetração absoluta é a ' +
        'força: o dado de dano é reduzido a d4, independentemente do ' +
        'Aspecto canalizado.',
      template:
        'A energia se afina até se tornar um filamento quase invisível, ' +
        'fino demais para qualquer escudo arcano notar — ele simplesmente ' +
        'atravessa, como se a defesa nunca tivesse existido.'
    },
    fio: {
      nome: 'Fio',
      subgrupo: 'projecao',
      ajusteDegrau: 0,
      forcaDadoFixo: 'd4',
      ajusteArea: -2,
      tags: ['Ignora Defesas Arcanas', 'Dado Reduzido a d4'],
      descricao:
        'Como a Agulha, mas estendida — um fio contínuo de energia que ' +
        'corta em vez de perfurar, igualmente capaz de trespassar Escudos ' +
        'e PV Temporários mundanos. O dado de dano é reduzido a d4.',
      template:
        'Um fio de energia tão fino quanto letal se estende entre o ' +
        'conjurador e o alvo, indiferente a qualquer escudo arcano que ' +
        'tente interceptá-lo — ele apenas o corta, como tudo o mais.'
    },
    chicote: {
      nome: 'Chicote',
      subgrupo: 'projecao',
      ajusteDegrau: -1,
      ajusteArea: 0,
      tags: ['Controle: Derrubado/Agarrado'],
      descricao:
        'A energia se torna flexível e ágil, mais voltada ao controlo do ' +
        'que à destruição pura — o dado de dano cai um degrau, mas o alvo ' +
        'atingido pode ser derrubado ou agarrado pelo impacto.',
      template:
        'A energia se estende como um látego vivo, estalando no ar antes ' +
        'de se enroscar no alvo com força suficiente para arrastá-lo ao ' +
        'chão ou imobilizá-lo no lugar.'
    },
    foice: {
      nome: 'Foice',
      subgrupo: 'projecao',
      ajusteDegrau: 0,
      ajusteArea: -1,
      tags: ['Curto Alcance', 'Execução < 25% PV'],
      execucaoLimiar: 0.25,
      descricao:
        'A energia se curva numa lâmina cruel de curto alcance — pouco ' +
        'útil contra alvos saudáveis, mas devastadora contra os que já ' +
        'cambaleiam à beira da morte. Contra inimigos com menos de 25% de ' +
        'seus Pontos de Vida, a Foice executa em vez de ferir.',
      template:
        'A energia se curva numa lâmina cruel e próxima, mais adequada a ' +
        'colher do que a abater. Contra um corpo já cambaleante à beira da ' +
        'morte, ela não fere — ela encerra.'
    },
    disco: {
      nome: 'Disco',
      subgrupo: 'projecao',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Ricochete (Par)'],
      limiteRicochete: (circulo) => circulo,
      descricao:
        'Um disco de energia é lançado e ricocheteia entre alvos sempre ' +
        'que o resultado do dado tirar um número par — mas a Auditoria Red ' +
        'Team de V3.1 fechou a brecha do loop infinito: o número de ' +
        'ricochetes é limitado ao valor do Círculo da magia (ou ao ' +
        'Modificador de Atributo, à escolha do Mestre), evitando que um ' +
        'único disco limpe o tabuleiro inteiro numa cadeia teórica de 50% ' +
        'de chance.',
      template:
        'Um disco luminoso é arremessado e salta de alvo a alvo sempre que ' +
        'o impacto ressoa em número par — mas mesmo a sorte mais ' +
        'generosa tem um limite: o disco se apaga após saltar o número ' +
        'máximo de vezes permitido pelo Círculo da magia.'
    },

    // ───────────── 2.3 ESTRUTURAS (Construções Estáticas) ─────────────
    estrutura_fixa: {
      nome: 'Estrutura Fixa',
      subgrupo: 'estruturas',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['PV Fixo: Círculo × 10'],
      pvFixo: (circulo) => circulo * 10,
      descricao:
        'Uma construção estática e duradoura — não rola dados, não varia: ' +
        'possui Pontos de Vida fixos iguais ao Círculo da magia multiplicado ' +
        'por dez, sólida como a própria intenção do conjurador de que ela ' +
        'permaneça de pé.',
      template:
        'A energia se assenta numa forma definitiva e imóvel, tão estável ' +
        'quanto a vontade que a sustenta — sem oscilação, sem variação, ' +
        'apenas presença constante e resistente.'
    },
    fracionamento: {
      nome: 'Fracionamento',
      subgrupo: 'estruturas',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Pulso por Turno (1 Dado)'],
      pulsoPorTurno: true,
      descricao:
        'A estrutura não libera todo o seu poder de uma vez — ela pulsa, ' +
        'liberando um único dado do Aspecto canalizado a cada turno da ' +
        'cena, como um coração lento que bate sob a pedra ou a luz.',
      template:
        'Em vez de explodir de uma só vez, a energia pulsa em intervalos ' +
        'regulares — um único impulso por turno, constante como uma ' +
        'respiração que a cena inteira pode sentir.'
    },
    portal: {
      nome: 'Portal',
      subgrupo: 'estruturas',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Pulso por Turno (1 Dado)', 'Teletransporte'],
      pulsoPorTurno: true,
      descricao:
        'Uma variante do Fracionamento que rasga, em vez de pulsar dano, ' +
        'uma passagem entre dois pontos do espaço — ganhando a tag de ' +
        'Teletransporte além do pulso padrão de 1 dado por turno na cena.',
      template:
        'Um rasgo circular se abre no tecido do espaço, pulsando com ' +
        'estabilidade suficiente para permitir passagem entre os dois ' +
        'pontos que conecta, turno após turno, enquanto a cena durar.'
    },

    // ───────────── 2.4 ORBITAIS (Modificação de Ação) ─────────────
    orbital: {
      nome: 'Orbital',
      subgrupo: 'orbitais',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Reação - Mitigar/Detonar', 'Aura Protetora'],
      permiteReacaoForaDeTurno: true,
      descricao:
        'A energia não dispara de imediato — ela orbita o conjurador ou um ' +
        'aliado como uma aura latente, pronta para ser accionada como ' +
        'Reação fora do turno normal, seja para mitigar um golpe recebido ' +
        'ou detonar contra um agressor.',
      template:
        'Um anel tênue de energia gira ao redor do conjurador ou de um ' +
        'aliado, silencioso e atento — pronto para responder, mitigar ou ' +
        'detonar no instante exacto em que o perigo se aproximar demais.'
    },

    // ───────────── 2.5 ELOS / CORRENTES ─────────────
    elo: {
      nome: 'Elo',
      subgrupo: 'elos',
      ajusteDegrau: 0,
      ajusteArea: 0,
      tags: ['Dano/Cura Contínuo (Sem Re-teste)'],
      semReteste: true,
      rompePorMovimento: true,
      descricao:
        'Um fio invisível de energia se prende entre conjurador e alvo, ' +
        'pulsando dano ou cura continuamente sem exigir novos testes de ' +
        'resistência — até que o alvo gaste seu movimento para romper a ' +
        'conexão e se libertar.',
      template:
        'Um elo invisível se firma entre o conjurador e o alvo, pulsando ' +
        'em fluxo constante — nem o alvo precisa resistir de novo, nem o ' +
        'conjurador precisa insistir. O elo simplesmente persiste, até que ' +
        'o movimento o rompa.'
    },
    corrente: {
      nome: 'Corrente',
      subgrupo: 'elos',
      ajusteDegrau: 0,
      ajusteArea: +1,
      tags: ['Dano/Cura Contínuo (Sem Re-teste)', 'Múltiplos Elos'],
      semReteste: true,
      rompePorMovimento: true,
      descricao:
        'Como o Elo, mas multiplicado — vários fios de energia se prendem ' +
        'simultaneamente a múltiplos alvos, cada um pulsando de forma ' +
        'independente até que o respectivo alvo rompa sua própria conexão ' +
        'pelo movimento.',
      template:
        'Vários elos se firmam ao mesmo tempo, cada um ligado a um alvo ' +
        'distinto, pulsando em coro silencioso — uma teia de correntes ' +
        'invisíveis que só se desfazem alvo a alvo, conforme cada um se ' +
        'liberta pelo próprio esforço.'
    }
  },

  // ===========================================================
  // CAMADA 5 — MATRIZ DE AFINIDADE ASPECTO × MANIFESTAÇÃO (V6.0)
  // ===========================================================
  // Resposta ao pedido do dono do projeto: "queria que a manifestação
  // conversasse com os dados, aí a variação viria com toda certeza" —
  // refinado para que a variação NÃO seja uma tabela de números solta,
  // mas nasça do encontro entre a "personalidade física" de cada Aspecto
  // (como sua energia se comporta no mundo: irradia, perfura, prende,
  // flui, engole...) e a forma física que a Manifestação impõe.
  //
  // Por isso a afinidade não pertence à Manifestação isolada nem ao
  // Aspecto isolado — ela é uma propriedade do PAR, registrada aqui como
  // afinidades[aspectoId][manifestacaoId].
  //
  // Três níveis (nunca um binário bom/ruim), cada um com efeito real:
  //   'harmonioso' → +1 degrau extra no dado, empilhando com o ajuste
  //                  próprio da Manifestação (ex: Sol+Cone: -1 do Cone
  //                  +1 da afinidade = ajuste líquido 0, em vez do -1 cru).
  //   'neutro'     → +0. Comportamento idêntico ao motor pré-V6.0.
  //   'dissonante' → -1 degrau extra, MAS nunca uma penalidade pura: o
  //                  motor (ver resolverDadoManifestacao) converte parte
  //                  da perda em bonusFlatExtra "instável" e gera uma tag
  //                  narrativa explicando o atrito entre a lore do Aspecto
  //                  e a forma da Manifestação — a combinação fica mais
  //                  arriscada e crua, nunca "sem graça" (decisão #4 do
  //                  handoff de expansão).
  //
  // O termo de afinidade é apenas mais uma parcela somada ao `alteracao`
  // dentro de resolverDadoManifestacao — empilha com o ajusteDegrau da
  // própria Manifestação e com o -1 do Fragmentado, e ainda passa pelo
  // mesmo ajustarDegrau (Piso/Teto de Vidro) já existente. Não substitui
  // nada do motor V3.1/V5.0; só adiciona um termo a mais na mesma soma.
  //
  // Quando a Manifestação tem forcaDadoFixo (Agulha/Fio), o dado já está
  // travado em d4 antes da escada rodar — a afinidade não altera o degrau
  // (mesma regra já aplicada ao Fragmentado), mas a tag e o motivo da
  // afinidade ainda são exibidos, pois são informação de lore válida
  // independentemente do travamento mecânico.
  //
  // Os 7 pares de calibração validados em conversa com o dono do projeto
  // (Sol+Cone harmonioso, Aethrýs+Cone dissonante, Káryon+Disco harmonioso,
  // Elysséra+Foice dissonante, Nerýth+Halo harmonioso, Mabryth+Chicote
  // harmonioso, Mabryth+Linha dissonante) estão todos presentes abaixo e
  // cobertos por teste de regressão automatizado.
  // ===========================================================
  afinidades: {
    sopro_archeon: {
      linha: { nivel: 'neutro', motivo: 'Força bruta em trajetória reta não tem identidade própria com Archëon — funciona, sem mais.' },
      coluna: { nivel: 'neutro', motivo: 'Pilar de força crua; aceitável, mas sem ressonância especial com a criação primordial.' },
      cone: { nivel: 'harmonioso', motivo: 'Expansão indiferenciada irradiando do ponto de origem é a própria imagem do Sonho se despedaçando em todas as direções.' },
      esfera: { nivel: 'harmonioso', motivo: 'Bolha que cresce em todas as direções iguais ecoa o "nada se despedaçando" que deu origem ao mundo — força pura, sem direção privilegiada.' },
      halo: { nivel: 'neutro', motivo: 'Anel que poupa o centro não tem motivo lore específico para Archëon — nem favorece nem contradiz.' },
      muralha: { nivel: 'harmonioso', motivo: 'Escudo Místico é a metade defensiva do próprio Aspecto; virar parede é literalmente o que Archëon já faz.' },
      prisma: { nivel: 'harmonioso', motivo: 'Volume fechado de força pura é o "casulo" de proteção primordial descrito na própria lore do Aspecto.' },
      lanca: { nivel: 'dissonante', motivo: 'Concentrar a força indiferenciada de Archëon num único ponto perfurante contradiz sua natureza expansiva e sem limites.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança — velocidade fina e focada é o oposto de uma força que "nunca conheceu limites".' },
      agulha: { nivel: 'dissonante', motivo: 'Um filamento finíssimo é a antítese da força bruta e ampla de Archëon.' },
      fio: { nivel: 'dissonante', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Controle físico não acrescenta nem contradiz a lore de força primordial.' },
      foice: { nivel: 'neutro', motivo: 'Execução cirúrgica não tem laço temático forte com Archëon.' },
      disco: { nivel: 'neutro', motivo: 'Ricochete é neutro — não há lore de imprevisibilidade em Archëon, mas também não contradiz.' },
      estrutura_fixa: { nivel: 'harmonioso', motivo: 'Construção permanente e sólida ecoa a criação primordial que "deu forma ao vazio" de modo definitivo.' },
      fracionamento: { nivel: 'dissonante', motivo: 'Pulsar em pequenas doses contradiz a imagem de uma força que se libera de uma vez, "antes que houvesse limites".' },
      portal: { nivel: 'neutro', motivo: 'Teletransporte não tem laço de lore específico — nem favorece nem contradiz Archëon.' },
      orbital: { nivel: 'neutro', motivo: 'Reação fora de turno é mecanicamente neutra para um Aspecto de força bruta.' },
      elo: { nivel: 'neutro', motivo: 'Conexão contínua não conflita nem reforça a lore de força primordial explosiva.' },
      corrente: { nivel: 'neutro', motivo: 'Mesma razão do Elo, em escala maior.' },
    },
    sol_pyrael: {
      linha: { nivel: 'harmonioso', motivo: 'Um raio de sol que perfura em linha reta, queimando tudo no caminho, é a imagem mais direta do próprio Aspecto.' },
      coluna: { nivel: 'harmonioso', motivo: 'Pilar de fogo solar descendo é a mesma imagem de Linha, na vertical — luz que desce do zênite.' },
      cone: { nivel: 'harmonioso', motivo: 'Calor solar se abrindo em leque é fisicamente natural — irradiação, explosão, sol se abrindo no horizonte.' },
      esfera: { nivel: 'harmonioso', motivo: 'Explosão solar esférica, radiação em todas as direções — a forma mais pura de "sol".' },
      halo: { nivel: 'harmonioso', motivo: 'Anel de fogo ao redor do conjurador, poupando o centro, é a coroa solar — luz que cerca sem queimar quem a porta.' },
      muralha: { nivel: 'neutro', motivo: 'Parede de fogo funciona, mas não acrescenta nada de específico à lore solar além do óbvio.' },
      prisma: { nivel: 'neutro', motivo: 'Cúpula de fogo é funcional, sem ressonância lore adicional.' },
      lanca: { nivel: 'neutro', motivo: 'Lança de fogo concentrado é genérica — funciona, mas Pyraël já tem expressões mais icônicas (leque, esfera).' },
      flecha: { nivel: 'neutro', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'dissonante', motivo: 'Fogo solar é sobre calor que se espalha e queima largamente; comprimi-lo num filamento finíssimo contradiz a própria fúria "que não escolhe".' },
      fio: { nivel: 'dissonante', motivo: 'Mesma razão da Agulha — um fio fino é precisão cirúrgica, o oposto do sol que "derrete tudo igual".' },
      chicote: { nivel: 'neutro', motivo: 'Um chicote de fogo é narrativamente plausível, sem laço forte de lore.' },
      foice: { nivel: 'dissonante', motivo: 'A Foice é sobre crueldade silenciosa e cirúrgica contra o já-caído; o Sol de Pyraël é fúria declarada e visível — a discrição da execução contradiz o "olho furioso que não se esconde".' },
      disco: { nivel: 'neutro', motivo: 'Disco solar ricocheteando é narrativamente engraçado, mas sem laço de lore forte.' },
      estrutura_fixa: { nivel: 'neutro', motivo: 'Fogo como estrutura fixa é estranho (fogo não é estático), mas não chega a contradizer fortemente.' },
      fracionamento: { nivel: 'dissonante', motivo: 'Pyraël é fúria imediata e total; pulsar em doses pequenas contradiz a imagem de um sol que "não é gentil".' },
      portal: { nivel: 'neutro', motivo: 'Sem laço de lore específico.' },
      orbital: { nivel: 'neutro', motivo: 'Sem laço de lore específico.' },
      elo: { nivel: 'neutro', motivo: 'Dano contínuo sem reteste é genérico para fogo, sem ressonância forte.' },
      corrente: { nivel: 'neutro', motivo: 'Mesma razão do Elo.' },
    },
    lua_nyxara: {
      linha: { nivel: 'dissonante', motivo: 'Nyxara é sobre véus, sutileza e revelação indireta; uma linha que perfura tudo de forma declarada contradiz a natureza furtiva do Aspecto.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha — um pilar óbvio e direto é o oposto do "terceiro olho" sutil.' },
      cone: { nivel: 'neutro', motivo: 'Dispersão em arco é aceitável para luz lunar, sem ressonância forte.' },
      esfera: { nivel: 'neutro', motivo: 'Funcional, mas Nyxara não é sobre abrangência bruta.' },
      halo: { nivel: 'harmonioso', motivo: 'Um anel de luz prateada que poupa quem está perto é a imagem do "véu" que revela ao redor sem cegar o centro — controle preciso e sutil.' },
      muralha: { nivel: 'neutro', motivo: 'Funcional, sem laço de lore forte.' },
      prisma: { nivel: 'harmonioso', motivo: 'Uma cela de luz prateada que aprisiona é exatamente o "controle mental" e aprisionamento sutil que a lore de Nyxara descreve.' },
      lanca: { nivel: 'neutro', motivo: 'Concentração em ponto único é plausível para um foco de percepção, mas sem ressonância extra.' },
      flecha: { nivel: 'neutro', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'harmonioso', motivo: 'Um filamento luminoso que ignora defesas arcanas é a tradução perfeita de "sussurra verdades enterradas" — penetra a mente sem ser percebido.' },
      fio: { nivel: 'harmonioso', motivo: 'Mesma razão da Agulha — fios invisíveis tecidos na mente dos desatentos é lore literal de Nyxara.' },
      chicote: { nivel: 'neutro', motivo: 'Controle físico é tangencial ao controle mental — funciona, sem ressonância forte.' },
      foice: { nivel: 'dissonante', motivo: 'Execução violenta contradiz a sutileza e indiretividade do domínio lunar.' },
      disco: { nivel: 'neutro', motivo: 'Ricochete imprevisível não tem laço de lore com Nyxara.' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'Nyxara é fluida e mutável como o ciclo lunar; uma estrutura rígida e permanente contradiz sua natureza.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'Pulsos regulares e graduais ecoam o ciclo lunar e o avanço gradual da percepção — revelação pouco a pouco, não de uma vez.' },
      portal: { nivel: 'harmonioso', motivo: 'O "véu entre o que se vê e o que se esconde" se traduz literalmente em uma passagem que conecta dois pontos ocultos.' },
      orbital: { nivel: 'harmonioso', motivo: 'Uma aura latente que reage no momento exato é a vigilância silenciosa e reativa típica de quem domina percepção e furtividade.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fio de controle contínuo sem reteste é o domínio mental sustentado que a lore descreve — Nyxara não golpeia, ela mantém.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos fios de controle simultâneos — controle mental em massa, coerente com "tece fios invisíveis na mente dos desatentos".' },
    },
    tempo_khairos: {
      linha: { nivel: 'dissonante', motivo: 'Um instante único e definitivo (dano máximo, sem rolar) é o oposto do fluxo e da gradação que definem o domínio do Tempo.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Dispersão em arco não tem laço de lore temporal específico.' },
      esfera: { nivel: 'neutro', motivo: 'Funcional, sem ressonância de lore.' },
      halo: { nivel: 'neutro', motivo: 'Funcional, sem ressonância de lore forte.' },
      muralha: { nivel: 'neutro', motivo: 'Funcional, mas Khaíros não é sobre estruturas físicas.' },
      prisma: { nivel: 'neutro', motivo: 'Funcional, mas sem laço de lore — "congelar num fragmento de eternidade" sugeriria algo mais dinâmico que uma cela estática.' },
      lanca: { nivel: 'neutro', motivo: 'Concentração pontual é compatível com "o instante exato", mas não acrescenta nada além do óbvio.' },
      flecha: { nivel: 'neutro', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Plausível como precisão temporal cirúrgica, sem ressonância adicional forte.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Controle físico tangencial ao controle temporal.' },
      foice: { nivel: 'neutro', motivo: 'Execução baseada em limiar de PV não tem laço de lore temporal direto.' },
      disco: { nivel: 'dissonante', motivo: 'O ricochete de Disco é sorte/caos espacial; Khaíros é sobre o "equilíbrio calculado" do tempo, o oposto de um salto aleatório.' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'O Tempo é fluxo, nunca estático — uma estrutura imóvel contradiz a própria essência de Khaíros.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'Pulsar a cada turno é a tradução mecânica mais literal do domínio do Tempo — cada pulso é "um grão de areia" da ampulheta de Khaíros.' },
      portal: { nivel: 'harmonioso', motivo: 'Khaíros já é descrito tecendo "fios do tear da causalidade"; uma passagem que conecta dois pontos no espaço é a mesma lógica aplicada ao espaço em vez do tempo.' },
      orbital: { nivel: 'harmonioso', motivo: 'Agir fora do turno normal — antecipando ou atrasando a ação — é literalmente desacelerar/acelerar o instante, o efeito-marca do Aspecto.' },
      elo: { nivel: 'harmonioso', motivo: 'Um efeito contínuo "rodada após rodada" é o próprio mecanismo do Tempo passando, sem interrupção.' },
      corrente: { nivel: 'harmonioso', motivo: 'Mesma razão do Elo, em escala maior — múltiplos fluxos temporais simultâneos.' },
    },
    saber_aethrys: {
      linha: { nivel: 'neutro', motivo: 'Precisão em linha reta é compatível com runas, mas sem ressonância adicional além do óbvio.' },
      coluna: { nivel: 'neutro', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'dissonante', motivo: 'Conhecimento e runas são sobre precisão; "dispersar" o efeito num leque largo contradiz a própria identidade do Aspecto (calibração do handoff).' },
      esfera: { nivel: 'dissonante', motivo: 'Mesma razão do Cone — abrangência difusa é o oposto de decifração exata.' },
      halo: { nivel: 'dissonante', motivo: 'Mesma lógica de dispersão imprecisa contradizendo a precisão de Aethrýs.' },
      muralha: { nivel: 'neutro', motivo: 'Uma barreira de runas é plausível (contramágica como escudo), sem ressonância extra.' },
      prisma: { nivel: 'harmonioso', motivo: 'Um selo geométrico fechado é a imagem mais literal de "runa" — um círculo de contenção perfeito e preciso.' },
      lanca: { nivel: 'harmonioso', motivo: 'Concentração total num único ponto de precisão runica é a tradução mecânica direta de "decifrar com exatidão".' },
      flecha: { nivel: 'harmonioso', motivo: 'Mesma razão da Lança — precisão cirúrgica de runas em um único ponto.' },
      agulha: { nivel: 'harmonioso', motivo: 'Um filamento que ignora defesas arcanas é a contramágica em sua forma mais pura — atravessa o que outras magias não conseguem.' },
      fio: { nivel: 'harmonioso', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'dissonante', motivo: 'Controle físico bruto contradiz a natureza intelectual e precisa do Saber.' },
      foice: { nivel: 'dissonante', motivo: 'Execução cirúrgica baseada em limiar de PV é crueza tática, não decifração — sem ressonância com runas/silêncio.' },
      disco: { nivel: 'dissonante', motivo: 'Ricochete imprevisível é o oposto de precisão runica exata.' },
      estrutura_fixa: { nivel: 'harmonioso', motivo: 'Uma runa gravada e permanente — selo fixo e imutável — é a imagem mais pura do Saber feito estrutura.' },
      fracionamento: { nivel: 'neutro', motivo: 'Plausível como "leitura gradual de runas", sem ressonância forte além disso.' },
      portal: { nivel: 'neutro', motivo: 'Plausível, runas de teletransporte existem em quase toda lore arcana — sem ressonância exclusiva.' },
      orbital: { nivel: 'harmonioso', motivo: 'Uma runa latente que reage no momento exato é o "Silêncio" reativo descrito na lore — contramágica que espera o gatilho certo.' },
      elo: { nivel: 'neutro', motivo: 'Funcional, sem ressonância de lore adicional forte.' },
      corrente: { nivel: 'neutro', motivo: 'Mesma razão do Elo.' },
    },
    vida_elyssera: {
      linha: { nivel: 'dissonante', motivo: 'Perfurar e causar dano máximo num único alvo é o oposto de cura biológica e mutação benéfica.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Plausível como "onda de vitalidade" que se espalha, sem ressonância extra forte.' },
      esfera: { nivel: 'neutro', motivo: 'Mesma razão do Cone.' },
      halo: { nivel: 'harmonioso', motivo: 'Um anel que poupa o centro e cuida de quem está ao redor é a imagem perfeita de cura em área sem ferir quem a lança.' },
      muralha: { nivel: 'neutro', motivo: 'Estrutura de carne/vida é narrativamente estranha, mas não chega a contradizer fortemente.' },
      prisma: { nivel: 'neutro', motivo: 'Mesma razão da Muralha.' },
      lanca: { nivel: 'dissonante', motivo: 'Concentrar força vital num único ponto perfurante contradiz a natureza difusa e regenerativa da cura.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Uma agulha de cura (como uma seringa) tem alguma ressonância biológica, mas o ajusteDegrau=0/forcaDadoFixo torna o ganho irrelevante na prática — fica neutro.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'dissonante', motivo: 'Controle físico agressivo contradiz a gentileza biológica do Aspecto.' },
      foice: { nivel: 'dissonante', motivo: 'Execução de quem já está agonizando é a inversão temática direta de um Aspecto de cura/vida (calibração do handoff).' },
      disco: { nivel: 'neutro', motivo: 'Sem ressonância forte de lore, nem contradição.' },
      estrutura_fixa: { nivel: 'neutro', motivo: 'Uma "estrutura viva" é narrativamente possível mas não tem ressonância de lore forte.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'Cura/regeneração gradual, pulso a pulso, é exatamente como a vida biológica se recupera — um processo, não um evento único.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'harmonioso', motivo: 'Uma aura de vida latente, pronta para reagir e proteger um aliado no momento do golpe, é o instinto protetor/regenerativo do Aspecto.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fluxo contínuo de cura sem reteste é a tradução mecânica mais direta de "regeneração sustentada".' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos fluxos de cura simultâneos para vários aliados — a generosidade vital de Elysséra em escala de grupo.' },
    },
    terra_maelthra: {
      linha: { nivel: 'neutro', motivo: 'Uma rajada de pedra em linha reta é plausível, sem ressonância de lore adicional forte.' },
      coluna: { nivel: 'harmonioso', motivo: 'Um pilar de pedra que se ergue ou despenca é a imagem mais literal de "Terra" — paredes de pedra na vertical.' },
      cone: { nivel: 'neutro', motivo: 'Estilhaços de pedra em leque são plausíveis, sem ressonância extra.' },
      esfera: { nivel: 'neutro', motivo: 'Abalo sísmico esférico é plausível, sem ressonância de lore adicional forte além do óbvio.' },
      halo: { nivel: 'neutro', motivo: 'Onda sísmica em anel é plausível, sem ressonância forte.' },
      muralha: { nivel: 'harmonioso', motivo: '"Paredes de pedra" é praticamente a definição textual do Aspecto — a Manifestação e a lore são quase a mesma frase.' },
      prisma: { nivel: 'harmonioso', motivo: 'Uma cela de pedra fechada é a defesa física máxima — o próprio elemento do Aspecto em volume.' },
      lanca: { nivel: 'neutro', motivo: 'Uma estaca de pedra é plausível, sem ressonância extra além do óbvio.' },
      flecha: { nivel: 'neutro', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'dissonante', motivo: 'A Terra de Maelthra é sobre peso e solidez; comprimir esse poder num filamento fino contradiz a própria robustez do elemento.' },
      fio: { nivel: 'dissonante', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Um chicote de pedra é narrativamente estranho mas funcional; sem ressonância forte.' },
      foice: { nivel: 'neutro', motivo: 'Funcional, sem ressonância de lore forte.' },
      disco: { nivel: 'neutro', motivo: 'Disco de pedra ricocheteando é estranho, mas não contradiz fortemente.' },
      estrutura_fixa: { nivel: 'harmonioso', motivo: 'PV fixo e duradouro é exatamente a "defesa física" estável e permanente que o Aspecto promete — pedra que simplesmente não cede.' },
      fracionamento: { nivel: 'dissonante', motivo: 'Terra é sobre solidez imediata e imponente; fragmentar o efeito em pulsos pequenos contradiz a imagem de uma muralha que se ergue de uma vez.' },
      portal: { nivel: 'dissonante', motivo: 'Pedra é imóvel por definição; um portal que move algo instantaneamente pelo espaço é tematicamente o oposto da fixidez da Terra.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte, mas também sem contradição relevante.' },
      elo: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte além do genérico.' },
      corrente: { nivel: 'neutro', motivo: 'Mesma razão do Elo.' },
    },
    caos_zyrhun: {
      linha: { nivel: 'dissonante', motivo: 'Uma trajetória reta e previsível é a antítese da imprevisibilidade que define o próprio nome do Aspecto.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'harmonioso', motivo: 'Dispersão larga e descontrolada é a imagem mecânica mais direta do Caos se espalhando.' },
      esfera: { nivel: 'harmonioso', motivo: 'Mesma razão do Cone — explosão sem direção privilegiada é o próprio Caos.' },
      halo: { nivel: 'neutro', motivo: 'Plausível, mas o anel ainda tem uma forma ordenada (circular perfeita) que soa um pouco contraditória ao caos puro — fica neutro.' },
      muralha: { nivel: 'dissonante', motivo: 'Uma estrutura estável e contínua é o oposto do que o Caos representa — corrosão instável, não contenção.' },
      prisma: { nivel: 'dissonante', motivo: 'Mesma razão da Muralha — geometria fechada e perfeita é ordem, não caos.' },
      lanca: { nivel: 'dissonante', motivo: 'Concentração total e precisa num ponto único é o oposto do espalhamento errático do Caos.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'dissonante', motivo: 'Precisão fina e previsível contradiz a essência errática e instável do Caos.' },
      fio: { nivel: 'dissonante', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Plausível como instabilidade física, sem ressonância de lore forte adicional.' },
      foice: { nivel: 'neutro', motivo: 'Funcional, sem ressonância forte.' },
      disco: { nivel: 'harmonioso', motivo: 'Ricochete imprevisível entre alvos é a tradução mecânica mais perfeita do Caos — energia que nunca segue um caminho previsível.' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'O Caos é "mutação instável" por definição; uma estrutura fixa e imutável é a contradição mais direta possível.' },
      fracionamento: { nivel: 'dissonante', motivo: 'Pulsos regulares e previsíveis a cada turno contradizem a natureza errática do Caos — o Caos não tem ritmo.' },
      portal: { nivel: 'harmonioso', motivo: 'A lore do próprio Aspecto menciona "fissuras do Véu Trincado" geradas pela guerra de Zyrhûn — um portal instável é literalmente herança do Caos.' },
      orbital: { nivel: 'neutro', motivo: 'Plausível, sem ressonância de lore forte além do genérico.' },
      elo: { nivel: 'dissonante', motivo: 'Um fluxo contínuo e estável contradiz a instabilidade definidora do Caos.' },
      corrente: { nivel: 'neutro', motivo: 'Múltiplos fios simultâneos podem soar "caóticos" pela quantidade, suavizando a dissonância do Elo — fica neutro.' },
    },
    trovao_karyon: {
      linha: { nivel: 'harmonioso', motivo: 'Um raio que dispara em linha reta e perfurante é a imagem mais literal de um relâmpago.' },
      coluna: { nivel: 'neutro', motivo: 'Um raio vertical é plausível, mas a Linha já cobre essa ideia com mais força — fica neutro aqui.' },
      cone: { nivel: 'neutro', motivo: 'Plausível como descarga se espalhando, sem ressonância de lore exclusiva.' },
      esfera: { nivel: 'neutro', motivo: 'Plausível, sem ressonância de lore adicional forte.' },
      halo: { nivel: 'neutro', motivo: 'Plausível como onda de choque elétrica, sem ressonância forte exclusiva.' },
      muralha: { nivel: 'dissonante', motivo: 'Eletricidade é descarga instantânea, não barreira contínua e estática — contradiz a natureza pulsante do raio.' },
      prisma: { nivel: 'dissonante', motivo: 'Mesma razão da Muralha.' },
      lanca: { nivel: 'neutro', motivo: 'Um raio concentrado é plausível, sem ressonância extra alem do óbvio.' },
      flecha: { nivel: 'neutro', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Plausível como descarga fina, sem ressonância forte.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'harmonioso', motivo: 'O estalo de um chicote é fisicamente quase idêntico ao estalo de um relâmpago — som, velocidade e impacto súbito.' },
      foice: { nivel: 'neutro', motivo: 'Funcional, sem ressonância de lore forte.' },
      disco: { nivel: 'harmonioso', motivo: 'Um disco que ricocheteia entre alvos em par é literalmente como um raio salta entre superfícies condutoras (calibração do handoff).' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'Eletricidade não é estática por definição — uma estrutura fixa contradiz a própria natureza pulsante do Aspecto.' },
      fracionamento: { nivel: 'neutro', motivo: 'Plausível como descargas repetidas, sem ressonância exclusiva forte (o ricochete do Disco já cobre melhor a "imprevisibilidade elétrica").' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fio de energia contínuo é literalmente uma "corrente elétrica" — a metáfora mecânica e a física se encontram.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos fios elétricos simultâneos — o nome da Manifestação e a natureza do Aspecto colidem de forma quase redundante.' },
    },
    oceanos_neryth: {
      linha: { nivel: 'dissonante', motivo: 'Um jato fino e reto de água perfurando é uma imagem fraca; Nerýth é sobre volume e fluxo, não sobre perfuração cirúrgica.' },
      coluna: { nivel: 'neutro', motivo: 'Uma coluna de água (como um gêiser) é plausível, sem grande ressonância exclusiva.' },
      cone: { nivel: 'neutro', motivo: 'Plausível como jato de água se abrindo, sem ressonância de lore exclusiva forte.' },
      esfera: { nivel: 'neutro', motivo: 'Plausível como onda esférica, mas o Halo já cobre melhor a "propagação a partir de um ponto".' },
      halo: { nivel: 'harmonioso', motivo: 'Um anel que poupa o centro é exatamente como uma onda se propaga a partir de um ponto de origem (calibração do handoff).' },
      muralha: { nivel: 'harmonioso', motivo: 'Uma parede de água/maré que bloqueia passagem é a imagem mais direta da força aquática descrita na lore.' },
      prisma: { nivel: 'neutro', motivo: 'Uma bolha de água fechada é plausível, sem ressonância exclusiva além da Muralha.' },
      lanca: { nivel: 'dissonante', motivo: 'Concentrar água num ponto fino e perfurante contradiz a natureza fluida e abrangente do oceano.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'dissonante', motivo: 'Água não corta fino como uma lâmina — comprimi-la num filamento contradiz sua natureza fluida e volumosa.' },
      fio: { nivel: 'dissonante', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Um chicote de água é plausível (como uma onda que açoita), sem ressonância de lore forte.' },
      foice: { nivel: 'dissonante', motivo: 'A crueza cirúrgica da execução não combina com "purificação" — um dos elementos centrais do Aspecto.' },
      disco: { nivel: 'neutro', motivo: 'Plausível, sem ressonância forte de lore.' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'O oceano é definido por fluxo e movimento constante (maré); uma estrutura estática contradiz sua essência líquida.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'O fluxo das marés que vão e voltam em ciclos é exatamente o pulso regular descrito pela Manifestação — ondas que retornam, turno após turno.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fluxo contínuo sem reteste é a corrente marítima constante — a água nunca "ataca uma vez e para".' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplas correntes de água simultâneas — quase um jogo de palavras com o próprio nome "Corrente" e a lore aquática.' },
    },
    beleza_lyrea: {
      linha: { nivel: 'dissonante', motivo: 'Violência direta e perfurante contradiz a sutileza e o fascínio indireto que definem a Beleza de Lyrëa.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Uma névoa hipnótica que se espalha em leque é plausível, sem grande ressonância exclusiva (o Halo cobre melhor a ideia de "fascínio circundante").' },
      esfera: { nivel: 'neutro', motivo: 'Plausível como névoa expansiva, mas sem ressonância exclusiva forte.' },
      halo: { nivel: 'harmonioso', motivo: 'Uma névoa hipnótica que envolve a todos ao redor sem tocar o centro é a imagem perfeita de fascínio que cerca sem ferir quem o lança.' },
      muralha: { nivel: 'neutro', motivo: 'Um espelho como parede é plausível dada a lore de "espelhos", sem ressonância exclusiva forte.' },
      prisma: { nivel: 'harmonioso', motivo: 'Uma cela de espelhos fechada é a tradução mais literal da lore de "espelhos" do Aspecto — um labirinto reflexivo que aprisiona.' },
      lanca: { nivel: 'dissonante', motivo: 'Concentração violenta e direta contradiz a indiretividade do encantamento e fascínio.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Um filamento sutil tem alguma ressonância com "sutileza", mas o efeito é ofensivo demais para a lore de fascínio — fica neutro.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Controle físico é tangencial ao fascínio mental, sem ressonância forte.' },
      foice: { nivel: 'dissonante', motivo: 'Execução violenta contradiz frontalmente a natureza sedutora e indireta da Beleza.' },
      disco: { nivel: 'harmonioso', motivo: 'Um disco que ricocheteia como reflexo entre superfícies é a tradução mecânica direta da lore de "espelhos" do Aspecto.' },
      estrutura_fixa: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte além do genérico.' },
      fracionamento: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte exclusiva.' },
      portal: { nivel: 'neutro', motivo: 'Espelhos como portais têm alguma ressonância folclórica, mas não está na lore escrita — fica neutro.' },
      orbital: { nivel: 'harmonioso', motivo: 'Uma aura fascinante latente, pronta para agir no momento certo, é o controle sedutor e oportunista que a lore de "fascinar" sugere.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fio de fascínio contínuo sem reteste é o controle hipnótico sustentado — a vítima não escapa do encanto a cada rodada, só rompendo pelo próprio esforço.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos fios de fascínio simultâneos sobre vários alvos — a névoa hipnótica em escala de grupo.' },
    },
    ordem_ordelyne: {
      linha: { nivel: 'neutro', motivo: 'Um raio de luz reto e implacável é plausível, sem ressonância exclusiva forte.' },
      coluna: { nivel: 'harmonioso', motivo: 'Um pilar de luz radiante que desce verticalmente é a imagem icônica de "justiça que cai do alto" — luz divina vertical.' },
      cone: { nivel: 'neutro', motivo: 'Plausível como leque de luz, sem ressonância exclusiva forte.' },
      esfera: { nivel: 'neutro', motivo: 'Plausível, sem ressonância exclusiva forte.' },
      halo: { nivel: 'neutro', motivo: 'Plausível como aura de luz, mas a Coluna e o Orbital já cobrem melhor as ideias centrais do Aspecto.' },
      muralha: { nivel: 'neutro', motivo: 'Plausível como barreira de luz, sem ressonância exclusiva forte.' },
      prisma: { nivel: 'harmonioso', motivo: 'Uma cela de luz geometricamente perfeita é a tradução mecânica de "Ordem" — simetria e contenção absolutas.' },
      lanca: { nivel: 'neutro', motivo: 'Plausível, sem ressonância exclusiva forte.' },
      flecha: { nivel: 'neutro', motivo: 'Plausível, sem ressonância exclusiva forte.' },
      agulha: { nivel: 'neutro', motivo: 'Plausível, sem ressonância exclusiva forte.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      foice: { nivel: 'dissonante', motivo: 'Execução fora da régua, baseada em oportunismo tático, contradiz a "justiça cega" e processual que define Ordelyne.' },
      disco: { nivel: 'dissonante', motivo: 'O ricochete é regido por sorte (par/ímpar); Ordelyne é sobre previsibilidade e regra fixa — sorte aleatória contradiz a "punição reativa" sempre consistente.' },
      estrutura_fixa: { nivel: 'harmonioso', motivo: 'Uma construção fixa, simétrica e duradoura é a Ordem em sua forma mais literal — nada muda, nada quebra a regra.' },
      fracionamento: { nivel: 'neutro', motivo: 'Plausível como ciclo regular de punição, sem ressonância exclusiva forte além do genérico.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'harmonioso', motivo: '"Punições luminosas que reagem automaticamente a cada agressão sofrida" é texto quase literal da lore do Aspecto — Orbital é a tradução mecânica direta disso.' },
      elo: { nivel: 'neutro', motivo: 'Plausível, sem ressonância exclusiva forte.' },
      corrente: { nivel: 'neutro', motivo: 'Mesma razão do Elo.' },
    },
    morte_morvethra: {
      linha: { nivel: 'neutro', motivo: 'Um corte necrótico direto é plausível, sem ressonância exclusiva forte (a Foice cobre melhor a "morte" tematicamente).' },
      coluna: { nivel: 'neutro', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Uma onda de podridão se espalhando é plausível, sem ressonância exclusiva forte.' },
      esfera: { nivel: 'neutro', motivo: 'Mesma razão do Cone.' },
      halo: { nivel: 'dissonante', motivo: 'Um anel que poupa deliberadamente o centro é misericórdia — uma inversão temática direta de uma deusa que "ceifa" sem distinção.' },
      muralha: { nivel: 'dissonante', motivo: 'Morvethra não constrói nem protege — ela cessa. Uma estrutura defensiva contradiz a essência de uma força puramente destrutiva/terminal.' },
      prisma: { nivel: 'dissonante', motivo: 'Mesma razão da Muralha.' },
      lanca: { nivel: 'harmonioso', motivo: 'Concentração letal num único ponto fatal é a "ceifa" mais literal — Morvethra escolhe um e o termina por completo.' },
      flecha: { nivel: 'harmonioso', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Plausível como veneno necrótico fino, sem ressonância exclusiva forte adicional.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      foice: { nivel: 'harmonioso', motivo: 'Execução de quem já está à beira da morte é a tradução mecânica mais literal e perfeita da própria deusa da Morte — a foice IS Morvethra.' },
      disco: { nivel: 'dissonante', motivo: 'Sorte e ricochete imprevisível contradizem a certeza implacável e definitiva que a Morte representa — Morvethra não "talvez" ceifa.' },
      estrutura_fixa: { nivel: 'dissonante', motivo: 'Mesma razão da Muralha — Morvethra termina coisas, não as constrói para durar.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'O dreno de vida gradual, pulso a pulso, é a imagem perfeita de uma vítima definhando lentamente até a Morte — "os ossos não se soldam" ao longo do tempo.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      elo: { nivel: 'harmonioso', motivo: 'Um dreno contínuo sem reteste, que só se rompe pelo esforço da vítima, é exatamente "drenos vitais que sugam a força do inimigo até que seus joelhos cedam" — texto quase literal da lore.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos drenos simultâneos sobre vários alvos — a ceifa em escala de campo de batalha.' },
    },
    trevas_kharvion: {
      linha: { nivel: 'dissonante', motivo: 'Trevas não perfuram com precisão cirúrgica — elas envolvem e engolem; uma linha reta contradiz a natureza envolvente e sem forma da escuridão.' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Escuridão se espalhando em leque é plausível, mas a Esfera/Halo cobrem melhor a ideia de "engolir ao redor".' },
      esfera: { nivel: 'harmonioso', motivo: 'Uma escuridão que se expande em todas as direções, indiferente a paredes, é a imagem mais literal de trevas "devorando" tudo ao redor.' },
      halo: { nivel: 'harmonioso', motivo: 'Um anel de escuridão que cega a alma ao redor, poupando o centro (o próprio conjurador, imune à própria sombra), é coerente com a lore — o abismo que cerca sem consumir quem o invoca.' },
      muralha: { nivel: 'neutro', motivo: 'Uma parede de trevas que bloqueia visão é plausível e até literal ("Bloqueia Linha de Visão" combina com cegueira), mas sem ressonância exclusiva muito além do óbvio.' },
      prisma: { nivel: 'harmonioso', motivo: 'Uma cela de escuridão total, onde "mesmo a memória da luz é devorada", é a tradução mecânica mais exata da lore — os poços de Kharvion são literalmente isso.' },
      lanca: { nivel: 'dissonante', motivo: 'Trevas não perfuram em ponto único — elas cegam e envolvem; concentração cirúrgica contradiz a natureza difusa do Aspecto.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Plausível como um toque de sanidade drenada cirurgicamente, sem ressonância exclusiva forte.' },
      fio: { nivel: 'neutro', motivo: 'Mesma razão da Agulha.' },
      chicote: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      foice: { nivel: 'neutro', motivo: 'Sem ressonância de lore exclusiva forte (a Foice já está fortemente associada a Morvethra na lore).' },
      disco: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      estrutura_fixa: { nivel: 'harmonioso', motivo: 'Os "poços de Kharvion" descritos na lore são literalmente prisões permanentes e estáveis — uma estrutura fixa de trevas é texto quase literal.' },
      fracionamento: { nivel: 'neutro', motivo: 'Plausível como sussurros recorrentes, sem ressonância exclusiva forte.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      elo: { nivel: 'harmonioso', motivo: 'Um dreno de sanidade contínuo sem reteste, que sussurra "vozes dos condenados" rodada após rodada, é a tradução mecânica direta da lore.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos drenos simultâneos — vários alvos ouvindo os sussurros dos condenados ao mesmo tempo.' },
    },
    teia_mabryth: {
      linha: { nivel: 'dissonante', motivo: 'Linha perfura em trajetória reta ignorando cobertura; Mabryth é sobre prender, não sobre atravessar (calibração do handoff).' },
      coluna: { nivel: 'dissonante', motivo: 'Mesma razão da Linha.' },
      cone: { nivel: 'neutro', motivo: 'Uma teia se espalhando em leque é plausível, sem ressonância exclusiva tão forte quanto Chicote/Elo/Fio.' },
      esfera: { nivel: 'neutro', motivo: 'Mesma razão do Cone.' },
      halo: { nivel: 'neutro', motivo: 'Uma teia em anel é plausível, mas sem ressonância exclusiva tão forte quanto outras opções do Aspecto.' },
      muralha: { nivel: 'neutro', motivo: 'Uma parede de teia é plausível (bloqueia passagem), sem ressonância exclusiva forte adicional.' },
      prisma: { nivel: 'neutro', motivo: 'Um casulo de teia fechado tem alguma ressonância (capturar por completo), mas sem texto de lore explícito — fica neutro.' },
      lanca: { nivel: 'dissonante', motivo: 'Perfurar contradiz a essência de "prender" — a Teia enreda, não trespassa.' },
      flecha: { nivel: 'dissonante', motivo: 'Mesma razão da Lança.' },
      agulha: { nivel: 'neutro', motivo: 'Um filamento fino tem ressonância com "fios", mas o efeito é perfurante/ofensivo, não restritivo — fica neutro.' },
      fio: { nivel: 'harmonioso', motivo: 'A própria Manifestação se chama "Fio" — é quase tautológico com a lore de "filamentos de energia sombria" da Teia de Mabryth.' },
      chicote: { nivel: 'harmonioso', motivo: 'Chicote derruba/agarra; Mabryth já é sobre restrição e fios — quase redundante com a identidade do Aspecto (calibração do handoff).' },
      foice: { nivel: 'neutro', motivo: 'A lore de pragas/veneno tem alguma proximidade com execução lenta, mas a Foice é súbita — contradição leve, não forte. Fica neutro.' },
      disco: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      estrutura_fixa: { nivel: 'neutro', motivo: 'Uma teia fixa tem alguma ressonância (armadilha permanente), mas sem texto de lore explícito — fica neutro.' },
      fracionamento: { nivel: 'harmonioso', motivo: 'O veneno/praga "que corrói de dentro para fora" e "se espalha como rumores" é literalmente um efeito gradual, pulso a pulso — texto quase exato da lore.' },
      portal: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      orbital: { nivel: 'neutro', motivo: 'Sem ressonância de lore forte.' },
      elo: { nivel: 'harmonioso', motivo: 'Um fio que prende e só se rompe pelo movimento da vítima é a tradução mais literal possível de "Teia" — a presa só se liberta pelo próprio esforço.' },
      corrente: { nivel: 'harmonioso', motivo: 'Múltiplos fios prendendo múltiplos alvos simultaneamente — a teia em escala de enxame, exatamente como pragas "se espalham de hospedeiro em hospedeiro".' },
    }
  },
  /**
   * Converte um valor bruto de escalonamento em uma etiqueta qualitativa (ex: 'Curta', 'Grande Área')
   * @param {string} tipo - O eixo de escalonamento ('alcance', 'area', 'duracao', 'visibilidade', 'sequela')
   * @param {number} valorBruto - O valor matemático calculado pela curva e traços
   * @returns {string} - A etiqueta correspondente
   */
  resolverEtiqueta(tipo, valorBruto) {
    const tabela = this.etiquetas[tipo];
    if (!tabela) return 'Desconhecido';
    const index = Math.min(Math.floor(valorBruto / 2.5), tabela.length - 1);
    return tabela[Math.max(0, index)];
  },

  /**
   * Resolve todos os eixos de escalonamento e sequela para a combinação.
   *
   * @param {string} aspectoId — chave do aspecto
   * @param {string} verboId   — chave do verbo
   * @param {string} modId     — chave do modificador
   * @param {number} circulo   — círculo injetado (1 a 10)
   * @returns {object}         — objeto com os rótulos finais e nível de sequela
   */
  resolverEscala(aspectoId, verboId, modId, circulo) {
    const aspecto = this.aspectos[aspectoId];
    const verbo   = this.verbos[verboId];
    const mod     = this.modificadores[modId];
    const C       = circulo;

    // 1. Valor bruto = curva do Verbo(círculo) × traço do Aspecto
    const brutoAlcance = this.curvas[verbo.curvas.curvaAlcance](C)  * aspecto.tracos.escalaAlcance;
    const brutoArea    = this.curvas[verbo.curvas.curvaArea](C)     * aspecto.tracos.escalaArea;
    const brutoDuracao = this.curvas[verbo.curvas.curvaDuracao](C)  * aspecto.tracos.escalaDuracao;
    const brutoVisib   = this.curvas[verbo.curvas.curvaVisibilidade](C) * aspecto.tracos.escalaVisibilidade;

    // 2. Etiqueta = conversão + ajuste do Modificador
    const alcance = (modId === 'latente') 
      ? 'Toque (Armadilha)' 
      : this.resolverEtiqueta('alcance', brutoAlcance + ((mod.ajustes?.ajAlcance || 0) * 2.5));

    const area = this.resolverEtiqueta('area', brutoArea + ((mod.ajustes?.ajArea || 0) * 2.5));

    const duracao = (modId === 'latente') 
      ? 'Até ativar (Armadilha)' 
      : this.resolverEtiqueta('duracao', brutoDuracao + ((mod.ajustes?.ajDuracao || 0) * 2.5));

    const visibilidade = this.resolverEtiqueta('visibilidade', brutoVisib + ((mod.ajustes?.ajVisibilidade || 0) * 2.5));

    // 3. Sequela por faixa de círculo
    let nivelSequela = 'Nenhuma';
    let textoSequela = '';
    if (C >= 8)      { nivelSequela = 'Severa';   textoSequela = aspecto.sequela.severa; }
    else if (C >= 5) { nivelSequela = 'Moderada'; textoSequela = aspecto.sequela.moderada; }
    else if (C >= 2) { nivelSequela = 'Leve';     textoSequela = aspecto.sequela.leve; }

    return { alcance, area, duracao, visibilidade, nivelSequela, textoSequela };
  },

  /**
   * Calcula o Custo Final da magia baseado no verbo, círculo e modificador.
   * Fórmula: (Custo Base do Verbo × Círculo Injetado) + Custo do Modificador
   *
   * V3.1: Se o modificador possuir `custoMultiplicador` (ex: Condensado = 3x,
   * "Tudo ou Nada"), o custo total é multiplicado em vez de somado, conforme
   * a Restrição de Balanceamento da Auditoria Red Team.
   *
   * @param {string} verboId   — chave do verbo (ex: 'manifestar')
   * @param {number} circulo   — círculo injetado (1 a 10)
   * @param {string} modId     — chave do modificador (ex: 'direcionado')
   * @returns {number}         — custo final em pontos de recurso
   */
  calcularCusto(verboId, circulo, modId) {
    const verbo = this.verbos[verboId];
    const mod = this.modificadores[modId];
    if (!verbo || !mod) return 0;
    let custo = (verbo.custoBase * circulo) + mod.custoExtra;
    if (mod.custoMultiplicador) {
      custo = custo * mod.custoMultiplicador;
    }
    return custo;
  },

  /**
   * Aplica o Imposto Mago de Infusão (Regra de Classe, V3.1).
   * Magos puros (qualquer classe fora de 'vanguarda'/'suporte') que
   * fundem magia a matéria sofrem um Imposto Fixo de +30% no Custo
   * final, em vez do custo x2 absoluto original (que inviabilizava o
   * lategame ao saltar de 20 para 40 pontos de Sopro num Círculo 10).
   * Também exige Concentração Constante.
   *
   * @param {number} custoFinal       — custo já calculado pela combinação
   * @param {string} classePersonagem — classe do personagem conjurador
   * @returns {{ custoFinal: number, tags: string[] }}
   */
  calcularInfusao(custoFinal, classePersonagem) {
    const tags = [];
    let custo = custoFinal;
    if (!['vanguarda', 'suporte'].includes(classePersonagem)) {
      custo = Math.ceil(custo * 1.3); // Imposto Mago de 30%
      tags.push('Exige Concentração Constante');
      tags.push('Imposto de Infusão (+30%)');
    }
    return { custoFinal: custo, tags };
  },

  /**
   * Resolve a tag de Ressonância de Falha Crítica, de acordo com o
   * Recurso (Sopro ou Mácula) do Aspecto canalizado.
   *
   * Sopro  → [Falha Inofensiva]: energia dissipa, Ação/Mana perdida.
   * Mácula → [Custo do Abismo]: conjurador sofre 1d6 de Dano de Sanidade.
   *
   * @param {string} recurso — 'sopro' ou 'macula'
   * @returns {{ tag: string, descricao: string, formulaDano: string|null }}
   */
  resolverFalhaCritica(recurso) {
    if (recurso === 'macula') {
      return {
        tag: 'Custo do Abismo',
        descricao: 'O conjurador sofre 1d6 de Dano de Sanidade quando a magia falha catastroficamente.',
        formulaDano: '1d6'
      };
    }
    return {
      tag: 'Falha Inofensiva',
      descricao: 'A energia dissipa-se sem efeito. A Ação e o Recurso gasto são perdidos.',
      formulaDano: null
    };
  },

  /**
   * Retorna a string da fórmula de dano/efeito para a combinação.
   *
   * @param {string} verboId — chave do verbo
   * @param {number} circulo — círculo injetado (1 a 10)
   * @returns {string|null}  — fórmula de dados ou null se não aplicável
   */
  calcularFormula(verboId, circulo) {
    const verbo = this.verbos[verboId];
    if (!verbo) return null;
    return verbo.formulaDano(circulo);
  },

  /**
   * Calcula o limite máximo de Sopro baseado no nível do personagem.
   * Fórmula: Base(3) + Mod. de Atributo de Foco + Math.floor(Nível / 2)
   *
   * @param {number} nivel       — nível do personagem (1 a 50)
   * @param {number} modFoco     — modificador do atributo de foco da classe
   * @returns {number}
   */
  calcularLimiteSopro(nivel, modFoco) {
    return 3 + modFoco + Math.floor(nivel / 2);
  },

  /**
   * Calcula o limite máximo de Mácula baseado no nível do personagem.
   * Fórmula: Base(12) + (Math.floor(Nível / 5) × 2)
   *
   * @param {number} nivel — nível do personagem (1 a 50)
   * @returns {number}
   */
  calcularLimiteMacula(nivel) {
    return 12 + (Math.floor(nivel / 5) * 2);
  },

  /**
   * Calcula os slots de Grimório Equipados (magias prontas na aba rápida).
   * Fórmula: Nível + Math.max(Mod. INT, Mod. SAB)
   *
   * @param {number} nivel   — nível do personagem (1 a 50)
   * @param {number} modInt  — modificador de Inteligência
   * @param {number} modSab  — modificador de Sabedoria
   * @returns {number}
   */
  calcularSlotsGrimorio(nivel, modInt, modSab) {
    return nivel + Math.max(modInt, modSab);
  },

  /**
   * Calcula a duração máxima do modificador Contínuo.
   * Limitado a 3 rodadas ou igual ao círculo injetado, o que for menor.
   *
   * @param {number} circulo — círculo injetado (1 a 10)
   * @returns {number}       — rodadas de duração
   */
  calcularDuracaoContinuo(circulo) {
    return Math.min(3, circulo);
  },

  /**
   * Calcula a Classe de Dificuldade (CD) para resistir ao feitiço.
   * Fórmula: 10 + Modificador de Atributo de Foco + Math.floor(Nível / 2)
   *
   * @param {number} nivel       — nível do personagem (1 a 50)
   * @param {number} modFoco     — modificador do atributo de foco
   * @returns {number}
   */
  calcularCD(nivel, modFoco) {
    return 10 + modFoco + Math.floor(nivel / 2);
  },

  // ===========================================================
  // CAMADA 4 (MOTOR) — FUNÇÕES DE SUPORTE V3.1 / V6.0
  // ===========================================================

  /**
   * Resolve a Afinidade entre um Aspecto e uma Manifestação (Camada 5, V6.0).
   * Lookup seguro: combinações ausentes da matriz (não deveria acontecer,
   * mas qualquer Aspecto/Manifestação nova adicionada no futuro sem entrada
   * na matriz) caem em 'neutro' como piso seguro — igual ao espírito do
   * "Círculo cai em 1" para `circulo` inválido.
   *
   * @param {string} aspectoId       — chave do aspecto
   * @param {string} manifestacaoId  — chave da manifestação
   * @returns {{ nivel: 'harmonioso'|'neutro'|'dissonante', motivo: string, ajusteDegrau: number }}
   */
  resolverAfinidade(aspectoId, manifestacaoId) {
    const tabelaAspecto = this.afinidades[aspectoId];
    const entrada = tabelaAspecto ? tabelaAspecto[manifestacaoId] : null;

    if (!entrada) {
      return { nivel: 'neutro', motivo: 'Combinação não catalogada — tratada como neutra por padrão.', ajusteDegrau: 0 };
    }

    const ajusteDegrauPorNivel = { harmonioso: +1, neutro: 0, dissonante: -1 };
    return {
      nivel: entrada.nivel,
      motivo: entrada.motivo,
      ajusteDegrau: ajusteDegrauPorNivel[entrada.nivel] || 0
    };
  },

  /**
   * Resolve a face de dado final de um Aspecto após a Geometria/Projeção
   * da Manifestação ajustar o degrau, absorvendo os casos de borda
   * "Piso de Vidro" (d4) e "Teto de Vidro" (d12) via ajustarDegrau().
   *
   * V6.0 — Matriz de Afinidade: o termo de Afinidade (Camada 5) é somado
   * ao MESMO `alteracao` que já recebe o ajusteDegrau da Manifestação e o
   * -1 do Fragmentado, antes de passar por ajustarDegrau. Não é uma camada
   * nova de resolução — é mais uma parcela na mesma soma, conforme a
   * orientação do handoff de expansão ("aditivo ao motor atual, não
   * substitutivo"). Quando Dissonante, a perda de degrau é parcialmente
   * compensada por `bonusInstavel` (dano fixo extra por dado, refletindo
   * a decisão de design de que nenhuma combinação deve ficar "sem graça" —
   * ver seção 4 do handoff), nunca anulando a penalidade, apenas
   * dando-lhe uma textura tática própria em vez de ser só "mais fraco".
   *
   * @param {string} aspectoId       — chave do aspecto
   * @param {string} manifestacaoId  — chave da manifestação (opcional)
   * @param {number} circulo         — círculo injetado, usado para bônus fixo de alguns Aspectos
   * @param {string} modId           — (opcional) chave do modificador, para aplicar o -1 degrau do Fragmentado
   * @returns {{ dado: string, bonusFixo: number, bonusFlatExtra: number, bonusInstavel: number, afinidade: object|null }}
   */
  resolverDadoManifestacao(aspectoId, manifestacaoId, circulo, modId = null, verboId = null) {
    const aspecto = this.aspectos[aspectoId];
    if (!aspecto || !aspecto.dadoBase) {
      return { dado: null, bonusFixo: 0, bonusFlatExtra: 0, bonusInstavel: 0, afinidade: null };
    }

    // Se o verbo não tem rolagem de dado real (formulaDano === null), a
    // manifestação não deve ajustar o dado do Aspecto — não há dado para ajustar.
    // Impede que Alterar+Lança, Vincular+Cone, Selar+Flecha, Deslocar+Esfera
    // gerem tags de dado falsas para verbos utilitários/defensivos sem rolagem.
    if (verboId) {
      const verbo = this.verbos[verboId];
      if (verbo && typeof verbo.formulaDano === 'function' && verbo.formulaDano(1) === null) {
        return { dado: null, bonusFixo: 0, bonusFlatExtra: 0, bonusInstavel: 0, afinidade: null };
      }
    }

    const bonusFixoOriginal = aspecto.bonusFixoDados ? aspecto.bonusFixoDados(circulo) : 0;
    const manifestacao = manifestacaoId ? this.manifestacoes[manifestacaoId] : null;

    // A Afinidade só existe quando há de fato uma Manifestação escolhida —
    // sem Manifestação não há "encontro" entre forma física e Aspecto para julgar.
    const afinidade = manifestacao ? this.resolverAfinidade(aspectoId, manifestacaoId) : null;

    // Agulha/Fio fixam o dado em d4 independentemente do dadoBase do Aspecto —
    // não passam pela escada, então o bônus fixo original é preservado.
    // O -1 degrau do Fragmentado não se aplica aqui: o dado já está no piso
    // absoluto da regra da Agulha/Fio, não no piso natural do Aspecto.
    // A Afinidade segue a MESMA regra: o degrau está travado, então o termo
    // de afinidade não o altera — mas o motivo/nível ainda é devolvido (a tag
    // de lore continua válida mesmo quando o dado está travado mecanicamente).
    if (manifestacao && manifestacao.forcaDadoFixo) {
      return { dado: manifestacao.forcaDadoFixo, bonusFixo: bonusFixoOriginal, bonusFlatExtra: 0, bonusInstavel: 0, afinidade };
    }

    const indiceBase = this.escadaDados.indexOf(aspecto.dadoBase);

    // Combina TODOS os ajustes de degrau num único delta antes de chamar
    // ajustarDegrau — Fragmentado (-1), a Manifestação (ex: Cone -1, Lança +1)
    // e agora a Afinidade (Harmonioso +1 / Neutro +0 / Dissonante -1) empilham
    // normalmente, e só então o piso/teto de vidro é verificado.
    const ajusteManifestacao = (manifestacao && (manifestacao.ajusteDegrau || 0));
    const ajusteFragmentado = (modId === 'fragmentado') ? -1 : 0;
    const ajusteAfinidade = afinidade ? afinidade.ajusteDegrau : 0;
    const alteracao = ajusteManifestacao + ajusteFragmentado + ajusteAfinidade;

    // Bônus de Instabilidade: só se aplica quando a Afinidade é Dissonante.
    // +1 de dano fixo POR DADO — metade do valor de um degrau perdido em
    // termos de poder médio — para que a combinação "ainda funcione, só que
    // de um jeito mais cru/instável", como pede a decisão #4 do handoff,
    // em vez de ser estritamente pior sem nenhuma compensação.
    const bonusInstavel = (afinidade && afinidade.nivel === 'dissonante') ? 1 : 0;

    if (alteracao === 0) {
      return { dado: aspecto.dadoBase, bonusFixo: bonusFixoOriginal, bonusFlatExtra: 0, bonusInstavel, afinidade };
    }

    const resultado = this.ajustarDegrau(indiceBase, alteracao, bonusFixoOriginal);
    return { dado: resultado.dado, bonusFixo: resultado.bonusFixo, bonusFlatExtra: resultado.bonusFlatExtra, bonusInstavel, afinidade };
  },

  /**
   * Calcula a quantidade final de dados a rolar para a fórmula de dano,
   * combinando o multiplicadorDados do Verbo com o Círculo injetado.
   * Verbos sem rolagem de dados (ex: Invocar) retornam null.
   *
   * V3.1: o modificador Fragmentado dobra a quantidade de dados (e cai
   * um degrau na face, tratado separadamente em resolverDadoManifestacao),
   * representando o mesmo poder bruto estilhaçado em mais projéteis menores.
   *
   * V5.0: recebe manifestacaoId para detectar forcaDadoFixo (Agulha/Fio).
   * Quando o dado já está travado em d4, o Fragmentado NÃO dobra a quantidade —
   * a regra do forcaDadoFixo substitui a regra do Fragmentado inteiramente.
   *
   * @param {string} verboId        — chave do verbo
   * @param {number} circulo        — círculo injetado (1 a 10)
   * @param {string} modId          — (opcional) chave do modificador, para dobrar via Fragmentado
   * @param {string} manifestacaoId — (opcional) chave da manifestação, para bloquear dobro em forcaDadoFixo
   * @returns {number|null}
   */
  resolverQuantidadeDados(verboId, circulo, modId = null, manifestacaoId = null) {
    const verbo = this.verbos[verboId];
    if (!verbo || verbo.multiplicadorDados === null || verbo.multiplicadorDados === undefined) {
      return null;
    }
    // Verbos com formulaDano === null (Alterar, Vincular, Selar, Deslocar) têm
    // multiplicadorDados > 0 apenas para escalonamento interno de custo, não para
    // rolagem real. Retornar null evita que o motor de degraus da Camada 4 gere
    // tags de dado falsas para verbos defensivos/utilitários.
    if (typeof verbo.formulaDano === 'function' && verbo.formulaDano(1) === null) {
      return null;
    }
    let quantidade = Math.max(1, Math.round(circulo * verbo.multiplicadorDados));

    // V5.0: Fragmentado dobra a quantidade APENAS se o dado não estiver travado
    // por forcaDadoFixo (Agulha/Fio). Quando o dado já está no piso absoluto da
    // regra da manifestação, dobrar a quantidade quebraria o balanceamento —
    // o Fragmentado inteiro é absorvido pelo forcaDadoFixo, sem bônus de quantidade.
    if (modId === 'fragmentado') {
      const manifestacao = manifestacaoId ? this.manifestacoes[manifestacaoId] : null;
      const dadoTravado = manifestacao && manifestacao.forcaDadoFixo;
      if (!dadoTravado) {
        quantidade = quantidade * 2;
      }
    }

    return quantidade;
  },

  /**
   * MOTOR UNIFICADO V5.0 — Único ponto de entrada para geração de magias.
   *
   * Integra as quatro camadas do sistema num único passo, eliminando a
   * duplicidade entre gerarDescricaoMagia (Camada 3) e gerarMagiaSegura
   * (Camada 4). Não há mais dois motores de dado coexistindo: o dado exibido
   * é sempre o do Motor de Degraus (dadoBase do Aspecto + ajuste de Manifestação),
   * nunca a fórmula crua do Verbo (formulaDano).
   *
   * Parâmetros opcionais: manifestacaoId, nivel, modFoco, classePersonagem.
   * Chamadas sem manifestacaoId continuam funcionando e exibem o dadoBase
   * do Aspecto com seus bônus fixos (sem ajuste de degrau).
   *
   * Retrocompatibilidade: gerarDescricaoMagia e gerarMagiaSegura são aliases
   * desta função (ver ao final do objeto).
   *
   * @param {string} aspectoId       — chave do aspecto (ex: 'sol_pyrael')
   * @param {string} verboId         — chave do verbo (ex: 'destruir')
   * @param {string} modId           — chave do modificador (ex: 'caotico')
   * @param {string} manifestacaoId  — (opcional) chave da manifestação (ex: 'lanca')
   * @param {number} circulo         — círculo injetado (1 a 10)
   * @param {object} options         — { nivel, modFoco, classePersonagem }
   * @returns {object}               — Ficha completa, sempre com `tags` como Array
   */
  gerarMagia(aspectoId, verboId, modId, manifestacaoId = null, circulo = 1, options = {}) {
    const {
      nivel = 1,
      modFoco = 0,
      classePersonagem = null
    } = options || {};

    // ── 1. Validação e lookup ──────────────────────────────────────────────
    // Blindagem NaN: circulo pode chegar como string, undefined ou NaN vindo
    // de formulários/UI. Number.isFinite garante que apenas um número válido
    // passe pelo clamp; qualquer outra coisa cai no piso seguro (Círculo 1).
    const circuloNumerico = Number(circulo);
    const circuloValidado = Number.isFinite(circuloNumerico)
      ? Math.max(1, Math.min(10, circuloNumerico))
      : 1;

    const aspecto = this.aspectos[aspectoId];
    const verbo   = this.verbos[verboId];
    const mod     = this.modificadores[modId];

    if (!aspecto || !verbo || !mod) {
      return {
        erro: 'Combinação inválida: aspecto, verbo ou modificador não encontrado.',
        tags: [],
        manifestacao: null
      };
    }

    const manifestacao = manifestacaoId ? this.manifestacoes[manifestacaoId] : null;

    // ── 2. Resolução de Intenção do Verbo ─────────────────────────────────
    // Detecta a `intencao` do verbo e busca a string de descrição
    // correspondente no modificador, com fallback para 'ofensivo'.
    const intencao = verbo.intencao || 'ofensivo';
    const descricaoMod =
      (typeof mod.descricao === 'object' && mod.descricao !== null)
        ? (mod.descricao[intencao] || mod.descricao.ofensivo || '')
        : (mod.descricao || '');

    // ── 3. Lore e mecânica base ────────────────────────────────────────────
    const custoBase        = this.calcularCusto(verboId, circuloValidado, modId);
    const templateAspecto  = verbo.template[aspectoId] || '';
    const templateMod      = mod.template || '';
    const cdResistencia    = this.calcularCD(nivel, modFoco);
    const escala           = this.resolverEscala(aspectoId, verboId, modId, circuloValidado);

    let acaoFinal = verbo.acaoBase;
    if (modId === 'latente') acaoFinal += ' (Armadilha)';

    // ── 4. Motor de Degraus — único motor de dado do sistema ──────────────
    // resolverDadoManifestacao determina o dado correto considerando:
    //   dadoBase do Aspecto → ajuste de Manifestação → Fragmentado → Piso/Teto de Vidro
    // resolverQuantidadeDados determina a quantidade de dados, com proteção
    // para Agulha/Fio+Fragmentado (dado travado, sem dobro de quantidade).
    const dadoFinal       = this.resolverDadoManifestacao(aspectoId, manifestacaoId, circuloValidado, modId, verboId);
    const quantidadeDados = this.resolverQuantidadeDados(verboId, circuloValidado, modId, manifestacaoId);

    // ── 5. Tags da Manifestação e do Modificador ──────────────────────────
    const tagsManifestacao = [];
    let templateManifestacao = '';
    let pvFixo = null;
    let limiteRicocheteResolvido = null;

    // 5a. Restrição de balanceamento do Simbionte (Círculo 1 a 4).
    // Fica FORA do bloco `if (manifestacao)` de propósito: a restrição é do
    // Modificador, não da Manifestação, e deve valer mesmo quando a magia é
    // gerada sem nenhuma Manifestação (o caso mais comum de uso).
    if (modId === 'simbionte') {
      const restricao = this.modificadores.simbionte.restricaoCirculo;
      if (circuloValidado < restricao.min || circuloValidado > restricao.max) {
        tagsManifestacao.push(
          `Aviso: Simbionte é restrito a Círculos ${restricao.min}-${restricao.max} (combinação fora da regra)`
        );
      }
    }

    if (manifestacao) {
      // 5b. Limite de Ricochetes do Disco
      if (manifestacao.limiteRicochete) {
        limiteRicocheteResolvido = manifestacao.limiteRicochete(circuloValidado);
        tagsManifestacao.push(`Ricochete Limitado a ${limiteRicocheteResolvido} alvo(s)`);
      }

      // 5c. PV Estrutural / PV Fixo (Muralha, Prisma, Estrutura Fixa)
      if (manifestacao.pvEstrutural) {
        tagsManifestacao.push('Dados Convertidos em PV Estrutural');
      }
      if (manifestacao.pvFixo) {
        pvFixo = manifestacao.pvFixo(circuloValidado);
        tagsManifestacao.push(`PV Estrutural Fixo: ${pvFixo}`);
      }

      // 5d. Tags fixas da manifestação (Perfura Cobertura, Ignora Defesas, etc.)
      tagsManifestacao.push(...manifestacao.tags);

      templateManifestacao = manifestacao.template || '';

      // 5d-bis. Tag de Afinidade (Camada 5, V6.0) — sempre emitida quando há
      // Manifestação, independentemente de o degrau estar travado ou não,
      // porque o veredito de lore (harmonioso/neutro/dissonante) é informação
      // válida mesmo quando o motor de degraus não pode aplicá-lo (Agulha/Fio).
      // O motivo completo de cada par está documentado na matriz `afinidades`;
      // aqui exibimos uma versão compacta para a Ficha do jogador/Mestre.
      if (dadoFinal && dadoFinal.afinidade) {
        const af = dadoFinal.afinidade;
        const rotuloNivel = {
          harmonioso: 'Afinidade: Harmoniosa (+1 Degrau)',
          neutro:     'Afinidade: Neutra',
          dissonante: 'Afinidade: Dissonante (-1 Degrau, +1 Dano Instável/dado)'
        };
        const dadoTravadoParaAfinidade = manifestacao.forcaDadoFixo;
        const rotulo = dadoTravadoParaAfinidade
          ? `Afinidade: ${af.nivel === 'harmonioso' ? 'Harmoniosa' : af.nivel === 'dissonante' ? 'Dissonante' : 'Neutra'} (sem efeito — Dado já travado em ${manifestacao.forcaDadoFixo})`
          : (rotuloNivel[af.nivel] || 'Afinidade: Neutra');
        tagsManifestacao.push(rotulo);
      }
    }

    // 5e. Tag do Fragmentado — exibe o efeito real que aconteceu.
    // Antes, a tag assumia sempre "-1 Degrau", mesmo quando o -1 do
    // Fragmentado era cancelado pelo +1 de uma Manifestação como Lança/Flecha
    // (delta líquido = 0 → o dado NÃO cai, mas a tag dizia que caía). Agora o
    // delta líquido real é recalculado aqui para escolher a mensagem certa:
    //   - Dado travado (Agulha/Fio, forcaDadoFixo): sem penalidade de degrau,
    //     sem dobro de quantidade.
    //   - Delta líquido < 0 (degrau realmente caiu): "-N Degrau(s) / Dados x2".
    //   - Delta líquido >= 0 (Lança/Flecha ou Afinidade Harmoniosa neutralizou
    //     ou mais): quantidade ainda dobra (regra do Fragmentado independe do
    //     degrau), mas a tag não afirma uma queda de degrau que não ocorreu.
    // V6.0: o delta líquido agora soma TAMBÉM o ajusteDegrau da Afinidade —
    // sem isso, a tag voltaria a mentir sempre que uma Afinidade Harmoniosa
    // (+1) ou Dissonante (-1) mudasse o resultado líquido real, repetindo
    // exatamente o padrão do bug #3 já corrigido (ver handoff, seção 3).
    if (modId === 'fragmentado') {
      const dadoTravado = manifestacao && manifestacao.forcaDadoFixo;
      if (dadoTravado) {
        tagsManifestacao.push('Fragmentado: Dado Fixo (sem penalidade de degrau) / Sem dobro de quantidade');
      } else {
        const ajusteManifestacaoLiquido = (manifestacao && (manifestacao.ajusteDegrau || 0));
        const ajusteAfinidadeLiquido = (dadoFinal && dadoFinal.afinidade) ? dadoFinal.afinidade.ajusteDegrau : 0;
        const deltaLiquido = ajusteManifestacaoLiquido + ajusteAfinidadeLiquido + (-1); // -1 é o próprio Fragmentado
        if (deltaLiquido < 0) {
          tagsManifestacao.push(`Fragmentado: ${deltaLiquido} Degrau(s) / Dados x2`);
        } else {
          tagsManifestacao.push('Fragmentado: Degrau Neutralizado pela Manifestação/Afinidade / Dados x2');
        }
      }
    }

    // ── 6. Tag do dado final ───────────────────────────────────────────────
    // Único ponto que emite a tag de dado — sem duplicatas, sem fallback da
    // fórmula crua do Verbo. O prefixo varia por intenção:
    //   ofensivo  → "Dados: NdX"
    //   defensivo → "PV Temp: NdX"
    //   pulsoPorTurno → "Fórmula: 1dX de Dano|PV Temp por turno (Total: N dados)"
    if (dadoFinal && dadoFinal.dado && quantidadeDados) {
      let descricaoDado;
      if (manifestacao && manifestacao.pulsoPorTurno) {
        const prefixoPulso = intencao === 'defensivo' ? 'PV Temp' : 'Dano';
        descricaoDado = `Fórmula: 1${dadoFinal.dado} de ${prefixoPulso} por turno (Total: ${quantidadeDados} dados)`;
      } else if (intencao === 'defensivo') {
        descricaoDado = `PV Temp: ${quantidadeDados}${dadoFinal.dado}`;
      } else {
        descricaoDado = `Dados: ${quantidadeDados}${dadoFinal.dado}`;
      }
      if (dadoFinal.bonusFixo) descricaoDado += ` +${dadoFinal.bonusFixo}`;
      if (dadoFinal.bonusFlatExtra) {
        const labelExtra = intencao === 'defensivo'
          ? 'PV Fixo/dado por excesso de Teto'
          : 'Dano Fixo/dado por excesso de Teto';
        descricaoDado += ` (+${dadoFinal.bonusFlatExtra} ${labelExtra})`;
      }
      if (dadoFinal.bonusInstavel) {
        // V6.0: compensação tática da Afinidade Dissonante — texto deliberadamente
        // separado do "excesso de Teto" acima, pois a origem é outra (atrito de
        // lore Aspecto×Manifestação, não limite d4/d12 da escada).
        const labelInstavel = intencao === 'defensivo'
          ? 'PV Instável/dado (Afinidade Dissonante)'
          : 'Dano Instável/dado (Afinidade Dissonante)';
        descricaoDado += ` (+${dadoFinal.bonusInstavel} ${labelInstavel})`;
      }
      tagsManifestacao.push(descricaoDado);
    }

    // ── 7. Imposto de Infusão (Regra de Classe) ───────────────────────────
    let custoFinal = custoBase;
    let tagsInfusao = [];
    if (classePersonagem) {
      const infusao = this.calcularInfusao(custoBase, classePersonagem);
      custoFinal = infusao.custoFinal;
      tagsInfusao = infusao.tags;
    }

    // ── 8. Ressonância de Falha Crítica ───────────────────────────────────
    const falhaCritica = this.resolverFalhaCritica(aspecto.recurso);

    // ── 9. Array de Tags final — único, sem duplicatas ────────────────────
    // As tags base nunca incluem dado (removido da montagem) —
    // a tag de dado existe apenas em tagsManifestacao (passo 6).
    const tagsBase = [
      aspecto.elemento.split(' / ')[0],
      verbo.nome,
      mod.nome,
      `Custo: ${custoFinal} ${aspecto.recurso === 'sopro' ? 'Sopro' : 'Mácula'}`,
      `Alcance: ${escala.alcance}`,
      `Área: ${escala.area}`,
      ...(escala.nivelSequela !== 'Nenhuma' ? [`Sequela: ${escala.nivelSequela}`] : [])
    ];

    const tags = [
      ...tagsBase,
      ...tagsManifestacao,
      ...tagsInfusao,
      `Falha Crítica: ${falhaCritica.tag}`
    ].filter(Boolean);

    // ── 10. Objeto de retorno completo ────────────────────────────────────
    return {
      // Identificação
      nomeAspecto:    aspecto.nome,
      nomeVerbo:      verbo.nome,
      nomeModificador: mod.nome,
      divindade:      aspecto.divindade,
      icone:          aspecto.icone,
      corHex:         aspecto.corHex,

      // Mecânica
      circulo:          circuloValidado,
      recurso:          aspecto.recurso,
      custoFinal,
      pericias:         aspecto.pericias,
      efeitoBase:       verbo.efeitoBase,
      efeitoModificador: mod.efeitoMecanico,
      acao:             acaoFinal,
      cdResistencia,
      tags,

      // Duração (numérico preservado para Contínuo além da etiqueta)
      duracao: modId === 'continuo' ? this.calcularDuracaoContinuo(circuloValidado) : null,

      // Escalonamento de Propriedades
      alcance:             escala.alcance,
      area:                escala.area,
      duracaoEscala:       escala.duracao,
      visibilidade:        escala.visibilidade,
      sequela:             escala.nivelSequela,
      textoSequela:        escala.textoSequela,
      intensidadeNarrativa: circuloValidado,

      // Metadados de Intenção
      intencaoVerbo: intencao,

      // Motor de Degraus — resultados resolvidos
      manifestacao:         manifestacao ? manifestacao.nome : null,
      subgrupoManifestacao: manifestacao ? manifestacao.subgrupo : null,
      dadoResolvido:        dadoFinal ? dadoFinal.dado : null,
      bonusFixoDado:        dadoFinal ? (dadoFinal.bonusFixo || 0) : 0,
      bonusFlatPorTeto:     dadoFinal ? (dadoFinal.bonusFlatExtra || 0) : 0,
      // Camada 5 (V6.0) — Afinidade Aspecto×Manifestação. null quando não há
      // Manifestação escolhida (não existe "encontro" para julgar).
      afinidadeNivel:       dadoFinal && dadoFinal.afinidade ? dadoFinal.afinidade.nivel : null,
      afinidadeMotivo:      dadoFinal && dadoFinal.afinidade ? dadoFinal.afinidade.motivo : null,
      bonusInstavelPorAfinidade: dadoFinal ? (dadoFinal.bonusInstavel || 0) : 0,
      quantidadeDados,
      // tipoRolagem: sinaliza ao front-end como interpretar o dado resolvido.
      // 'dano'   → verbos ofensivos
      // 'pvtemp' → Proteger (PV Temporários)
      // null     → sem rolagem (verbos utilitários)
      tipoRolagem: (() => {
        if (!dadoFinal || !dadoFinal.dado || !quantidadeDados) return null;
        return (verbo.intencao === 'defensivo') ? 'pvtemp' : 'dano';
      })(),
      pvEstrutural:    pvFixo,
      limiteRicochete: limiteRicocheteResolvido,
      falhaCritica,

      // Lore
      descricaoAspecto:    aspecto.descricao,
      descricaoVerbo:      verbo.descricao,
      descricaoModificador: descricaoMod,
      descricaoManifestacao: manifestacao ? manifestacao.descricao : null,

      // Templates narrativos
      textoConjuracao:    templateAspecto,
      textoForma:         templateMod,
      textoManifestacao:  templateManifestacao,

      // Texto final combinado
      descricaoFinal: [templateAspecto, templateMod, templateManifestacao]
        .filter(Boolean)
        .join('\n\n')
    };
  },

  // ===========================================================
  // ALIASES DE RETROCOMPATIBILIDADE
  // ===========================================================
  // gerarDescricaoMagia e gerarMagiaSegura redirecionam para gerarMagia.
  // Código legado que chame qualquer uma das duas continua funcionando
  // sem alteração, embora gerarDescricaoMagia ignore manifestacaoId e
  // options (como antes), e gerarMagiaSegura passe todos os argumentos.

  gerarDescricaoMagia(aspectoId, verboId, modId, circulo, nivel = 1, modFoco = 0) {
    return this.gerarMagia(aspectoId, verboId, modId, null, circulo, { nivel, modFoco });
  },

  gerarMagiaSegura(aspectoId, verboId, modId, manifestacaoId, circulo, options = {}) {
    return this.gerarMagia(aspectoId, verboId, modId, manifestacaoId, circulo, options);
  }

};

// Exportação para uso em módulos ES6 e compatibilidade com scripts tradicionais
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sistemaMagia;
}
