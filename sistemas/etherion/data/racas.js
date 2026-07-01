// =============================================================
// BANCO DE DADOS DE RAÇAS — ETHERION
// =============================================================
// Edite ESTE arquivo pra adicionar/alterar raças. Não precisa
// tocar no etherion-ficha.js pra isso.
//
// ESTRUTURA GERAL
// ----------------
// RACAS_DB = {
//   "id_familia": {
//     nome: "Nome da família (ex: 'Anão')",
//     aliases: ["sinônimos", "pra ajudar na busca"],
//     habilidadesComuns: [ {nome, desc} ],   // toda sub-raça da família ganha
//     subracas: {
//       "id_subraca": {
//         nome: "Nome completo (ex: 'Durkhar das Alturas')",
//         aliases: [...],
//         citacao: "frase de flavor (opcional)",
//
//         // PISO de atributo. É somado ao ATRIB_BASE (1).
//         // Use só quando o texto da raça falar de ATRIBUTO em si
//         // (força, agilidade etc). Pra conceitos como "resistência
//         // a magia" ou "fortitude", use os campos abaixo (ainda
//         // não são numéricos — viram texto informativo na ficha).
//         attrBonus: { agi: 1 },
//
//         resistencias: ["Magia (especialmente arcana)", "Quedas e impacto"],
//         fraquezas: ["Resistência física reduzida", "Fortitude base menor"],
//         regiao: "Onde essa sub-raça costuma viver",
//         habilidades: [ {nome, desc} ]
//       }
//     }
//   }
// }
//
// RAÇAS SEM SUB-RAÇA (ex: Humano): crie mesmo assim uma única
// sub-raça com o mesmo id/nome da família. Isso mantém o código
// da ficha simples (sempre família > sub-raça, mesmo que só exista 1).

const RACAS_DB = {
  humano: {
    nome: 'Valarin (Humano)',
    aliases: ['humano', 'valarin', 'humanos'],
    habilidadesComuns: [],
    subracas: {
      valarin: {
        nome: 'Valarin',
        aliases: ['humano', 'valarin'],
        citacao: 'Criados com o sangue de todos os deuses, ambiciosos e adaptáveis.',
        attrBonus: { escolha: 3 },
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Todos os continentes',
        pericias: ['sintonia', 'vontade'],
        habilidades: [
          { nome: 'Proficiência de Sintonia e Vontade', desc: '+2 na proficiência de Sintonia e +2 na proficiência de Vontade.' },
          { nome: 'Idiomas', desc: 'Valarin, Comum e mais 2 à escolha do jogador.' },
          { nome: 'Ambição Sem Limites', desc: 'Por terem vida curta, ganham bônus em testes para alcançar objetivos históricos ou de longo prazo.' },
          { nome: 'Adaptação Cultural', desc: 'Dependendo do continente de origem, podem escolher uma perícia extra para ter +2 de bônus.' }
        ]
      }
    }
  },

  anao: {
    nome: 'Durkhar (Anão)',
    aliases: ['anao', 'durkhar', 'anoes'],
    habilidadesComuns: [],
    subracas: {
      durkhar_alturas: {
        nome: 'Durkhar das Alturas',
        aliases: ['anao das alturas'],
        citacao: 'Poucos anões olharam para o céu… menos ainda o conquistaram.',
        attrBonus: { agi: 2, for: 1 },
        // 'Passo Leve' e 'Salto das Alturas' são situacionais (terreno elevado/queda),
        // sem valor fixo de CA ou deslocamento aplicável em qualquer situação.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Magia (especialmente arcana)', 'Quedas e impacto de grandes alturas'],
        fraquezas: ['Menor resistência física', 'Menor Fortitude base'],
        regiao: 'Montanhas colossais, próximos às ilhas flutuantes, penhascos e cidades elevadas.',
        habilidades: [
          { nome: 'Passo Leve', desc: 'Ignoram penalidades em terrenos elevados ou irregulares.' },
          { nome: 'Afinidade Celeste', desc: 'Redução de dano mágico recebido.' },
          { nome: 'Salto das Alturas', desc: 'Podem reduzir dano de queda ou realizar saltos maiores.' }
        ]
      },
      durkhar_forja_solar: {
        nome: 'Durkhar da Forja Solar',
        aliases: ['anao da forja'],
        citacao: 'A chama que molda o mundo corre em suas veias.',
        attrBonus: { for: 1, cos: 2 },
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (muito elevada)', 'Calor extremo e magma'],
        fraquezas: ['Vulnerabilidade a frio intenso', 'Ambientes sem calor reduzem sua eficiência'],
        regiao: 'Cidades de Forja, regiões vulcânicas, próximos a rios de magma.',
        pericias: ['fortitude'],
        habilidades: [
          { nome: 'Fortitude Elevada', desc: 'Fortitude +2' },
          { nome: 'Chama de Pyraël', desc: 'Pode imbuir armas e o seu corpo com dano de fogo temporário.' },
          { nome: 'Mestre Supremo da Forja', desc: 'Grande bônus ao criar, reparar ou melhorar equipamentos.' },
          { nome: 'Corpo Incandescente', desc: 'Resistência passiva a dano por calor.' }
        ]
      },
      durkhar_profundezas: {
        nome: 'Durkhar das Profundezas',
        aliases: ['anao das profundezas'],
        citacao: 'Os que ouviram primeiro o pulsar da criação.',
        attrBonus: {for: 2, con: 1},
        // 'Velocidade reduzida' é citado como fraqueza, mas sem valor numérico definido
        // no texto original — não convertido em deslocamentoBonus pra não inventar o número.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Terra (maior eficácia)', 'Pressão e ambientes extremos subterrâneos'],
        fraquezas: ['Velocidade reduzida', 'Dificuldade em terrenos instáveis (areia, lama, gelo)'],
        regiao: 'Cidadelas Abissais, túneis ancestrais esquecidos, próximos ao núcleo do mundo.',
        pericias: ['fortitude'],
        habilidades: [
          { nome: 'Fortitude Elevada', desc: 'Fortitude +4 e resistência adicional a dano físico.' },
          { nome: 'Pele de Basalto', desc: 'Reduz dano físico recebido.' },
          { nome: 'Sentido Sísmico', desc: 'Detecta movimentações através do solo em curta distância.' },
          { nome: 'Corpo Inabalável', desc: 'Dificilmente são derrubados, empurrados ou desestabilizados.' }
        ]
      }
    }
  },

  elfo: {
    nome: 'Elvarin (Elfo)',
    aliases: ['elfo', 'elvarin', 'elfos'],
    habilidadesComuns: [],
    subracas: {
      elvarin_lunar: {
        nome: 'Elvarin Lunar',
        aliases: ['elfo lunar'],
        citacao: 'A luz da lua guia os passos do elfo.',
        attrBonus: { sab: 1, agi: 2 },
        // 'Passo do Véu' e 'Sombra Pura' são condicionais (ação bônus / período noturno),
        // sem valor fixo de CA ou deslocamento aplicável permanentemente.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Resistência a dano de Frio (Reduz em 5)'],
        fraquezas: ['Sensibilidade à Luz Extrema: -2 em percepção e ataques sob luz solar direta.'],
        regiao: 'Continente gélido de Nyrvald',
        pericias: ['furtividade', 'acrobacia'],
        habilidades: [
          { nome: 'Filhos da Noite', desc: 'Visão perfeita no escuro mágico e não-mágico.' },
          { nome: 'Passo do Véu', desc: 'Como Ação Bônus, entram no véu. Até o fim do turno, ignoram ataques de oportunidade e terreno difícil.' },
          { nome: 'Sombra Pura', desc: 'À noite ou em locais escuros, recebem Vantagem em ataques furtivos.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Acrobacia.' }
        ]
      },
      elvarin_errante: {
        nome: 'Elvarin Errante',
        aliases: ['elfo errante', 'nomade'],
        citacao: 'Buscam histórias, contos e cantos que tocam a alma.',
        attrBonus: { sab: 1, car: 2 },
        // 'Leveza dos Ventos': Deslocamento base aumentado em 3 metros (permanente).
        bonusCA: 0,
        deslocamentoBonus: 3,
        resistencias: ['Imunidade a magias que alteram memórias ou causam confusão mental.'],
        fraquezas: ['Maldição do Nômade: Se dormirem no mesmo local por mais de 1 mês, perdem 1 de Vigor/Constituição permanentemente até viajarem.'],
        regiao: 'Nômades por natureza',
        pericias: ['sintonia', 'tradicao', 'diplomacia'],
        habilidades: [
          { nome: 'Leveza dos Ventos', desc: 'Deslocamento base aumentado em 3 metros.' },
          { nome: 'Ecos da Criação', desc: 'Uma vez por sessão, podem transformar uma falha em Conhecimento, História ou Religião em Acerto Crítico.' },
          { nome: 'Canção do Alento', desc: 'Podem inspirar um aliado concedendo +4 na próxima rolagem de ataque ou resistência.' },
          { nome: 'Proficiências', desc: '+4 em Sintonia e Atuação/Diplomacia.' }
        ]
      },
      elvarin_solar: {
        nome: 'Elvarin Solar',
        aliases: ['elfo solar'],
        citacao: 'Guerreiros orgulhosos e estudiosos das chamas purificadoras.',
        attrBonus: { sab: 1, agi: 1, for: 1 },
        // 'Aura Iluminada' e 'Fúria de Pyraël' são efeitos narrativos/condicionais,
        // sem valor fixo de CA ou deslocamento.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (Reduz em 5) e imunidade a calor extremo.'],
        fraquezas: ['Arrogância Solar: Desvantagem em testes de Vontade contra encantamentos de ego/controle mental.'],
        regiao: 'Continente árido de Morvath',
        pericias: ['exploracao', 'percepcao'],
        habilidades: [
          { nome: 'Aura Iluminada', desc: 'Brilham levemente no escuro (ilumina 3m, impede furtividade total).' },
          { nome: 'Fúria de Pyraël', desc: 'Uma vez por turno (ação livre), imbuir armas com chamas douradas (+4 de dano).' },
          { nome: 'Luz Ofuscante', desc: 'Clarão que cega inimigos próximos por 1 rodada (Teste de Fortitude evita).' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência (desertos) e Percepção.' }
        ]
      }
    }
  },

  orc: {
    nome: 'Grotans (Orc)',
    aliases: ['orc', 'grotan', 'orcs', 'grotans'],
    habilidadesComuns: [],
    subracas: {
      grotan_corrompido: {
        nome: 'Grotans Corrompidos',
        aliases: ['orc corrompido'],
        citacao: 'Rebelaram-se contra sua própria natureza e abraçaram a aniquilação.',
        attrBonus: { for: 2, cos: 1 },
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Dano Sombrio', 'Imunidade a Venenos não-mágicos', '+2 Vontade contra controle mental (exceto Nythraxis)'],
        fraquezas: ['Marca de Nythraxis: Cura recebida de Magias Sagradas cai pela metade, e dano sagrado causa o dobro de impacto.'],
        regiao: 'Áreas amaldiçoadas e através do Véu Trincado',
        pericias: ['furtividade', 'exploracao'],
        habilidades: [
          { nome: 'Sacrifício Abissal', desc: 'Sacrifica PV (ex: 10 PV) para causar o triplo como Dano Sombrio extra (+30 dano) que ignora resistências físicas.' },
          { nome: 'Fome Indescritível', desc: 'Ao derrotar inimigo orgânico, consome sua essência para recuperar 5 PV imediatamente.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Sobrevivência em ambientes amaldiçoados.' }
        ]
      },
      grotan_ordem: {
        nome: 'Grotans da Ordem',
        aliases: ['orc da ordem'],
        citacao: 'Abraçaram a disciplina e a justiça, tornando-se devotos fiéis da deusa Ordelyne.',
        attrBonus: { for: 1, car: 1, cos: 1 },
        // '+2 de Defesa Natural permanente' (resistências) → bônus fixo de CA.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade a Medo e Pânico', '+2 de Defesa Natural permanente'],
        fraquezas: ['Código de Honra: Incapazes de atacar inimigo desarmado/rendido. Quebrar resulta na perda dos bônus raciais.'],
        regiao: 'Exércitos estruturados de Aetherion',
        pericias: ['intimidacao', 'tatica'],
        habilidades: [
          { nome: 'Avanço Tático', desc: 'Ação bônus para dar ordem. Um aliado ganha +4 em dano ou Defesa no próximo ataque.' },
          { nome: 'Golpe da Justiça', desc: 'Uma vez por cena, atacar inimigo que causou dano a um aliado causa +4 de dano fixo que ignora resistências físicas.' },
          { nome: 'Proficiências', desc: '+4 em Intimidação e História (Táticas Militares).' }
        ]
      },
      grotan_solar: {
        nome: 'Grotans Solares',
        aliases: ['orc solar'],
        citacao: 'A iluminação do Deus do Sol é uma provação física constante.',
        attrBonus: { for: 2, con: 1 },
        // 'Sangue Frio' reduz deslocamento à metade apenas em frio extremo/escuridão —
        // é condicional, não um modificador fixo aplicável sempre. Não convertido em número.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade total a fogo natural e mágico'],
        fraquezas: ['Sangue Frio: Em frio extremo ou escuridão, deslocamento reduz pela metade e perdem imunidade a Fogo.'],
        regiao: 'Regiões vulcânicas e desérticas extremas',
        pericias: ['atletismo', 'fortitude'],
        habilidades: [
          { nome: 'Vigor Solar', desc: 'Recuperam 2 PV sempre que começam o turno em ambiente com luz direta do sol.' },
          { nome: 'Coração de Fogo', desc: 'Uma vez por cena, inflama ataques corpo a corpo (+4 dano de fogo) por 3 rodadas.' },
          { nome: 'Onda de Calor', desc: 'Onda de calor que desidrata e fadiga inimigos próximos (Fortitude ou Exausto por 1 rodada).' },
          { nome: 'Proficiências', desc: '+4 em Atletismo e Fortitude.' }
        ]
      },
      grotan_trovoes: {
        nome: 'Grotans dos Trovões',
        aliases: ['orc do trovao'],
        citacao: 'Lutam pela glória dos céus e adoram as tempestades.',
        attrBonus: { agi: 2, car: 1 },
        // Sem bônus passivo numérico de CA/Deslocamento (Vantagem na Iniciativa não é
        // um valor fixo somável nessas duas fórmulas).
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Dano Elétrico', '+2 em esquiva ou reflexos contra área', 'Vantagem na Iniciativa'],
        fraquezas: ['Hiperatividade: Não conseguem ficar parados. Sofrem -4 em testes de Furtividade.'],
        regiao: 'Montanhas',
        pericias: ['atletismo', 'acrobacia'],
        habilidades: [
          { nome: 'Investida do Trovão', desc: 'Se mover 6m em linha reta antes de atacar, causa +4 dano elétrico extra e empurra 3m.' },
          { nome: 'Grito da Tempestade', desc: 'Uma vez por sessão, grito que atordoa alvos próximos por 1 rodada (Fortitude evita).' },
          { nome: 'Proficiências', desc: '+4 em Atletismo (saltos/escaladas) e Acrobacia.' }
        ]
      }
    }
  },

  draconato: {
    nome: 'Drakar (Draconato)',
    aliases: ['draconato', 'dragao', 'drakar'],
    // Comuns a todo Drakar, herdado dos Quatro Grandes Dragões independente do Vento de linhagem.
    habilidadesComuns: [
      { nome: 'Sangue Dracônico', desc: '+2 de Defesa Natural permanente.' },
      { nome: 'Proficiências', desc: '+4 em Intimidação e Atletismo.' }
    ],
    pericias: ['intimidacao', 'atletismo'],
    subracas: {
      drakar_norte: {
        nome: 'Drakar do Norte (Morvhaël)',
        aliases: ['drakar lunar', 'draconato do norte'],
        citacao: 'Escamas que não fazem ruído, olhos que veem através da escuridão e do silêncio.',
        attrBonus: { sab: 2, car: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Frio (Reduz em 5)', 'Imunidade a efeitos de silêncio e mudez mágica'],
        fraquezas: ['Presença Ameaçadora: -2 em Diplomacia com raças que não respeitam o poder bruto.', 'Sono Longo: precisam de hibernação anual de 1 semana, ou sofrem Exaustão progressiva.'],
        regiao: 'Continente gélido de Nyrvald, próximos aos domínios de Morvhaël',
        habilidades: [
          { nome: 'Sopro Congelante', desc: 'Uma vez por cena, cone de gelo que causa dano e reduz o deslocamento dos alvos pela metade por 1 rodada (Reflexos reduz o dano à metade).' },
          { nome: 'Vigília da Lua', desc: 'Visão perfeita no escuro mágico e não-mágico.' }
        ]
      },
      drakar_sul: {
        nome: 'Drakar do Sul (Sahryx)',
        aliases: ['drakar solar', 'draconato do sul'],
        citacao: 'Fúria e crescimento acelerado correm nas escamas avermelhadas dos filhos de Sahryx.',
        attrBonus: { for: 2, con: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (Imunidade)', 'Calor extremo'],
        fraquezas: ['Presença Ameaçadora: -2 em Diplomacia com raças que não respeitam o poder bruto.', 'Ira de Sahryx: em combate, sofrem Desvantagem em testes de Vontade para recuar ou negociar uma vez engajados.'],
        regiao: 'Continente árido de Morvath e regiões vulcânicas',
        habilidades: [
          { nome: 'Sopro Primordial', desc: 'Uma vez por cena, cone de fogo que causa dano em área (Reflexos reduz à metade).' },
          { nome: 'Crescimento Acelerado', desc: 'Recupera 2 PV extras sempre que descansa sob luz solar direta.' }
        ]
      },
      drakar_leste: {
        nome: 'Drakar do Leste (Aelthyr)',
        aliases: ['drakar mutavel', 'draconato do leste'],
        citacao: 'Nada permanece igual sob o Vento do Leste — nem mesmo as próprias escamas.',
        attrBonus: { agi: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Elétrico (Reduz em 5)', 'Resistência a efeitos de transformação forçada ou polimorfia'],
        fraquezas: ['Presença Ameaçadora: -2 em Diplomacia com raças que não respeitam o poder bruto.', 'Instabilidade da Mudança: uma vez por sessão, ao sofrer dano crítico, uma característica menor (cor de escama, tom de voz) muda aleatoriamente até o próximo descanso longo.'],
        regiao: 'Continente de Arkhavel, junto às correntes voláteis de Aelthyr',
        habilidades: [
          { nome: 'Sopro Corrosivo', desc: 'Uma vez por cena, cone de energia instável que causa dano e reduz a proficiência de Defesa do alvo em -2 por 1 rodada (Reflexos evita a redução).' },
          { nome: 'Reflexo Adaptativo', desc: 'Uma vez por cena, como Reação, pode trocar uma resistência elemental já possuída por outra (Fogo, Frio, Ácido ou Elétrico) até o fim do combate.' }
        ]
      },
      drakar_oeste: {
        nome: 'Drakar do Oeste (Calýndor)',
        aliases: ['drakar do declinio', 'draconato do oeste'],
        citacao: 'Guardam nas escamas o peso de eras que ninguém mais lembra.',
        attrBonus: { car: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Sombrio (Reduz em 5)', 'Imunidade a magias que alteram memórias'],
        fraquezas: ['Presença Ameaçadora: -2 em Diplomacia com raças que não respeitam o poder bruto.', 'Melancolia do Declínio: Desvantagem em testes de Vontade contra medo ou desespero, exceto em combate.'],
        regiao: 'Continente de Valtheris, junto aos vales antigos de Calýndor',
        habilidades: [
          { nome: 'Rugido do Vento Dragônico', desc: 'Ação bônus para rugir; inimigos próximos fazem teste de Vontade ou perdem a ação de movimento.' },
          { nome: 'Memória das Eras', desc: 'Vantagem em testes de Conhecimento, História ou Religião ligados a eventos antigos ou perdidos.' }
        ]
      }
    }
  },

  terrakin: {
    nome: 'Terrakin (Elementais Despertos)',
    aliases: ['terrakin', 'elemental', 'golem', 'desperto'],
    // Comuns a todo Terrakin: não nasceram de ventre algum, mas do próprio Motor do
    // Mundo — veios de sangue de Archëon que se acumulam na matéria até ela "acordar".
    habilidadesComuns: [
      { nome: 'Corpo Desperto', desc: 'Imunidade a venenos, doenças e fadiga. Não respira, não precisa dormir (apenas entrar em torpor mineral).' },
      { nome: 'Casca Elemental', desc: '+2 Defesa Natural.' }
    ],
    subracas: {
      terrakin_pedra: {
        nome: 'Terrakin de Pedra',
        aliases: ['golem de pedra', 'desperto da montanha'],
        citacao: 'Dormiram como rocha por eras, até que o pulso do mundo os chamou de volta.',
        attrBonus: { for: 2, con: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['RD 2 contra dano físico'],
        fraquezas: ['Vulnerabilidade a efeitos que quebram ou fragmentam (dano crítico causa +50% de dano extra).'],
        regiao: 'Cordilheiras antigas e desfiladeiros onde a terra ainda pulsa com força',
        habilidades: [
          { nome: 'Pulso da Terra', desc: 'Uma vez por cena, golpe no chão que causa dano em área a 3m e derruba alvos que falharem em Reflexos.' },
          { nome: 'Proficiências', desc: '+4 em Fortitude e Atletismo.' }
        ]
      },
      terrakin_cristal: {
        nome: 'Terrakin de Cristal',
        aliases: ['golem de cristal', 'desperto do veio arcano'],
        citacao: 'Nasceram onde o sangue de Archëon se cristalizou por séculos, guardando cada eco de magia que já os atravessou.',
        attrBonus: { int: 2, sab: 1 },
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra Ilusão e Encantamento'],
        fraquezas: ['Ressonância Frágil: sofre Vantagem em ataques baseados em som ou vibração contra si.'],
        regiao: 'Cavernas de quartzo e veios arcanos profundos, onde o Motor do Mundo é mais intenso',
        habilidades: [
          { nome: 'Eco Arcano', desc: 'Uma vez por sessão, absorve uma magia direcionada a si e a devolve como um raio de energia bruta (mesmo dano, sem efeito adicional).' },
          { nome: 'Proficiências', desc: '+4 em Sintonia e Conhecimento (Arcano).' }
        ]
      },
      terrakin_magma: {
        nome: 'Terrakin de Magma',
        aliases: ['golem de magma', 'desperto do nucleo'],
        citacao: 'O calor do coração do mundo nunca os deixou esfriar por completo.',
        attrBonus: { for: 1, con: 2 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (Imunidade)'],
        fraquezas: ['Vulnerabilidade a Frio (Dano em dobro).', 'Rastro Incandescente: deixa marcas visíveis de calor onde passa, facilitando ser rastreado.'],
        regiao: 'Regiões vulcânicas e fendas próximas ao núcleo de Aetherion',
        habilidades: [
          { nome: 'Núcleo em Ebulição', desc: 'Uma vez por cena, libera calor: ataques corpo a corpo causam +4 de dano de fogo extra por 2 rodadas.' },
          { nome: 'Proficiências', desc: '+4 em Fortitude e Intimidação.' }
        ]
      },
      terrakin_gelo: {
        nome: 'Terrakin de Gelo',
        aliases: ['golem de gelo', 'desperto da geada'],
        citacao: 'Silenciosos como geleiras, tão pacientes quanto o inverno que os formou.',
        attrBonus: { sab: 2, con: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Frio (Imunidade)'],
        fraquezas: ['Vulnerabilidade a Fogo (Dano em dobro).'],
        regiao: 'Geleiras e picos congelados de Nyrvald',
        habilidades: [
          { nome: 'Vigília Gélida', desc: 'Não pode ser surpreendido nem sofrer o estado Surpreso.' },
          { nome: 'Toque Congelante', desc: 'Uma vez por cena, ataque corpo a corpo reduz o deslocamento do alvo pela metade por 1 rodada (Fortitude evita).' },
          { nome: 'Proficiências', desc: '+4 em Percepção e Fortitude.' }
        ]
      }
    }
  },

  feyrin: {
    nome: 'Feyrin (Duendes)',
    aliases: ['feyrin', 'duende'],
    // Comuns a todo Feyrin, ligado à sua natureza de mito vivo.
    habilidadesComuns: [
      { nome: 'Passo de Fungo', desc: 'Pode se esgueirar em floresta fechada como sob invisibilidade.' },
      { nome: 'Existência Esquecida', desc: 'Se passar 24h sem interagir com seres vivos ou mágicos, perde 2 PV Máx por dia até voltar a interagir.' }
    ],
    subracas: {
      feyrin_trapaceiro: {
        nome: 'Feyrin Trapaceiro',
        aliases: ['duende trapaceiro', 'duende ladrao'],
        citacao: 'Trocam suas botas por sombra e sua sombra por sua bota — e você nem percebe.',
        attrBonus: { agi: 2, car: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra danos elementais naturais (Fogo, Frio, Elétrico)'],
        fraquezas: [],
        regiao: 'Vilarejos nas bordas da floresta e cidades pequenas',
        habilidades: [
          { nome: 'Truque da Floresta', desc: 'Uma vez por combate, ilusão que distrai o alvo (-4 em ataque ou percepção por 1 rodada).' },
          { nome: 'Mão Leve', desc: 'Vantagem em testes para furtar ou trocar objetos pequenos sem ser percebido.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Ladinagem.' }
        ]
      },
      feyrin_guardiao: {
        nome: 'Feyrin Guardião',
        aliases: ['duende guardiao', 'duende da raiz'],
        citacao: 'Protegem segredos que a própria floresta esqueceu que possuía.',
        attrBonus: { con: 2, sab: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra danos elementais naturais (Fogo, Frio, Elétrico)', 'Resistência a venenos naturais'],
        fraquezas: [],
        regiao: 'Bosques profundos e raízes ancestrais',
        habilidades: [
          { nome: 'Transposição de Raízes', desc: 'Ação bônus para teleporte até 6m através do subsolo (terra/floresta/pântano).' },
          { nome: 'Vínculo com a Floresta', desc: 'Sente a presença de intrusos em até 15m dentro de floresta ou pântano.' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência e Percepção.' }
        ]
      },
      feyrin_contador: {
        nome: 'Feyrin Contador de Histórias',
        aliases: ['duende contador', 'duende mito'],
        citacao: 'Vivem enquanto forem lembrados — então garantem que a história nunca acabe.',
        attrBonus: { int: 2, car: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra danos elementais naturais (Fogo, Frio, Elétrico)', 'Imunidade a magias que apagam memórias'],
        fraquezas: ['Existência Esquecida (agravada): a perda de PV Máx por isolamento é o dobro da usual.'],
        regiao: 'Feiras, tavernas e encruzilhadas onde histórias circulam',
        habilidades: [
          { nome: 'Eco do Mito', desc: 'Uma vez por sessão, pode transformar uma falha em teste social em Acerto Crítico ao contar uma história convincente.' },
          { nome: 'Memória Emprestada', desc: 'Pode "gastar" uma interação recente para recuperar 1d6 PV, como se fosse lembrado com carinho por alguém.' },
          { nome: 'Proficiências', desc: '+4 em Atuação e Diplomacia.' }
        ]
      }
    }
  },

  kaelthas: {
    nome: 'Kaelthas (Tieflings)',
    aliases: ['kaelthas', 'tiefling', 'demonio'],
    // Comuns a todo Kaelthas, independente da origem do toque sombrio.
    habilidadesComuns: [
      { nome: 'Marca do Toque Sombrio', desc: 'Visão no Escuro total.' },
      { nome: 'Sensibilidade a Luz/Fé', desc: 'Dano sagrado ignora resistências do Kaelthas.' },
      { nome: 'Proficiências', desc: '+4 em Intimidação e Enganação.' }
    ],
    subracas: {
      kaelthas_abissal: {
        nome: 'Kaelthas Abissal',
        aliases: ['tiefling abissal', 'tocado por nythraxis'],
        citacao: 'Nasceram de um pacto sussurrado através de uma fenda no Véu Trincado.',
        attrBonus: { car: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (metade)'],
        fraquezas: ['Eco do Pacto: entidades de Nythraxis reconhecem sua presença e podem tentar renegociar termos antigos em momentos de desespero.'],
        regiao: 'Variadas, com preferência por regiões próximas a fendas do Véu Trincado',
        habilidades: [
          { nome: 'Chamas do Vazio', desc: '+4 dano de fogo/sombrio em qualquer ataque ou magia ofensiva.' },
          { nome: 'Sussurro do Pacto', desc: 'Uma vez por sessão, pode fazer uma pergunta a uma entidade de Nythraxis e receber uma resposta parcial e ambígua (a critério do mestre).' }
        ]
      },
      kaelthas_umbrio: {
        nome: 'Kaelthas Umbrio',
        aliases: ['tiefling umbrio', 'tocado por morvethra'],
        citacao: 'Carregam a frieza de Morvethra na alma, como se a Morte tivesse os tocado de leve e seguido em frente.',
        attrBonus: { int: 2, sab: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Sombrio (metade)', 'Imunidade a Medo'],
        fraquezas: ['Frieza Emocional: Desvantagem em testes de Presença para expressar empatia genuína ou consolar outros.'],
        regiao: 'Variadas, com preferência por cemitérios, campos de batalha antigos e o Submundo',
        habilidades: [
          { nome: 'Domínio Mental', desc: 'Ação bônus para instigar medo (Teste de Presença vs Vontade).' },
          { nome: 'Toque da Ceifa', desc: 'Uma vez por cena, ataque contra alvo com menos da metade dos PV causa +6 de dano sombrio extra.' }
        ]
      }
    }
  },

  lihzahrd: {
    nome: 'Lihzahrd (Lagartos)',
    aliases: ['lihzahrd', 'lagarto', 'reptil'],
    habilidadesComuns: [
      { nome: 'Sangue Frio, Casca Dura', desc: '+2 de Defesa Natural permanente. Imunes a doenças e venenos dos pântanos.' },
      { nome: 'Anfíbios Naturais', desc: 'Respiram debaixo d\'água e deslocamento normal em lama.' },
      { nome: 'Proficiências Base', desc: '+4 em Sobrevivência e Atletismo (Natação).' },
      { nome: 'Letargia Térmica (Debuff)', desc: '-2 em testes físicos e deslocamento em frio extremo.' }
    ],
    subracas: {
      lihzahrd_lunar: {
        nome: 'Lihzahrd Lunar (Vento do Norte)',
        aliases: ['lagarto lunar'],
        citacao: 'Escuridão e sombras moldam seu instinto de caçador.',
        attrBonus: { sab: 2, con: 1 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd
        // ('Sangue Frio, Casca Dura'), herdado por todas as sub-raças. 'Letargia Térmica'
        // (deslocamento reduzido em frio extremo) é condicional, não convertida em número.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Visão no Escuro total'],
        fraquezas: [],
        regiao: 'Pântanos',
        habilidades: [
          { nome: 'Caçador Silencioso', desc: 'Invisíveis submersos. Ataques furtivos causam +4 de dano extra.' }
        ]
      },
      lihzahrd_solar: {
        nome: 'Lihzahrd Solar (Vento do Sul)',
        aliases: ['lagarto solar'],
        citacao: 'Fúria vulcânica que aquece os pântanos frios.',
        attrBonus: { for: 2, con: 1 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (Reduz em 5)'],
        fraquezas: [],
        regiao: 'Pântanos',
        habilidades: [
          { nome: 'Fúria Vulcânica', desc: 'Evapora a água ao redor. Ataques corpo a corpo causam +4 de dano escaldante.' }
        ]
      },
      lihzahrd_adaptado: {
        nome: 'Lihzahrd Adaptado (Vento do Leste)',
        aliases: ['lagarto adaptado'],
        citacao: 'Mudança e reflexos rápidos garantem a sobrevivência.',
        attrBonus: { agi: 2, con: 1 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Elétrico (Reduz em 5)'],
        fraquezas: [],
        regiao: 'Pântanos',
        habilidades: [
          { nome: 'Camuflagem Reativa', desc: 'Ação de movimento para mudar de cor (Vantagem em Furtividade e +4 em Acrobacia p/ escapar).' }
        ]
      },
      lihzahrd_sabio: {
        nome: 'Lihzahrd Sábio (Vento do Oeste)',
        aliases: ['lagarto sabio'],
        citacao: 'Contos e o declínio do Vento Ocidental.',
        attrBonus: { int: 2, con: 1 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Sombrio (Reduz em 5)'],
        fraquezas: [],
        regiao: 'Pântanos',
        habilidades: [
          { nome: 'Sopro das Eras', desc: 'Uma vez por cena, cone de neblina corrosiva: causa dano e quebra armadura/proteção por 1 rodada.' }
        ]
      }
    }
  },

  myrran: {
    nome: 'Myrran (Gnomos)',
    aliases: ['myrran', 'gnomo'],
    // Comuns a todo Myrran, independente da postura frente ao mundo de fora.
    habilidadesComuns: [
      { nome: 'Visão Subterrânea', desc: 'Visão no Escuro (Penumbra).' },
      { nome: 'Mente Analítica', desc: '+2 contra Ilusão e Encantamento.' }
    ],
    subracas: {
      myrran_recluso: {
        nome: 'Myrran Recluso',
        aliases: ['gnomo recluso', 'gnomo guardiao'],
        citacao: 'Guardam a sabedoria arcana, convencidos de que o mundo ainda não merece conhecê-la.',
        attrBonus: { int: 2, sab: 1 },
        // 'Glifo Defensivo' dá +4 de CA, mas só como Reação contra um ataque específico —
        // não é um bônus permanente somável na CA padrão. Não convertido em número fixo.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: ['Paranoia Constante: -2 em Carisma/Diplomacia e não confiam no grupo (exigem contratos).'],
        regiao: 'Subsolo profundo, longe do conhecimento de qualquer outra raça',
        habilidades: [
          { nome: 'Gênio Recluso', desc: 'Uma vez por sessão, decifra qualquer runa, enigma ou selo arcano (+4 p/ desarmar armadilhas mágicas).' },
          { nome: 'Glifo Defensivo', desc: 'Reação para ativar um glifo gravado no corpo: +4 de CA contra o ataque específico.' },
          { nome: 'Proficiências', desc: '+4 em Sintonia e Conhecimento (Arcano).' }
        ]
      },
      myrran_errante: {
        nome: 'Myrran Errante',
        aliases: ['gnomo mercador', 'gnomo errante'],
        citacao: 'Discordam dos seus: acreditam que a sabedoria arcana, usada com cautela, pode ajudar mais do que destruir.',
        attrBonus: { int: 2, car: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: ['Exilado de Casa: sofre Desvantagem em testes de Diplomacia com outros Myrran Reclusos, que os veem como traidores da causa.'],
        regiao: 'Rotas comerciais entre o subsolo e a superfície',
        habilidades: [
          { nome: 'Talismã Improvisado', desc: 'Uma vez por cena, cria um pequeno talismã arcano que concede +4 em um teste de Sintonia, Ladinagem ou Percepção.' },
          { nome: 'Barganha Justa', desc: 'Vantagem em testes de negociação envolvendo compra, venda ou troca de itens.' },
          { nome: 'Proficiências', desc: '+4 em Diplomacia e Conhecimento (Arcano).' }
        ]
      }
    }
  },

  noctaryn: {
    nome: 'Noctaryn (Vampiros)',
    aliases: ['noctaryn', 'vampiro'],
    // Criados como agentes híbridos de Morvethra (Morte) e Zyrhûn (Caos) durante a
    // guerra do Caos: colhiam vidas em excesso no mundo físico — Primordiais corrompidos,
    // criaturas nascidas da mácula — como uma ponte entre o Submundo e Aetherion. A não-morte
    // por idade é a mesma suspensão que Morvethra concedeu (e depois retirou) dos Primordiais,
    // só que fixada de forma permanente nesta raça. Com a Ruptura do Véu, a vigilância divina
    // sobre o mundo físico enfraqueceu, e boa parte dos Noctaryn deixou de responder ao chamado.
    // Hoje vivem livres; cultuar Morvethra ou Zyrhûn é escolha pessoal, sem cobrança — mas quem
    // ativamente se volta para outro deus após ter jurado lealdade sofre a ira do pacto quebrado.
    habilidadesComuns: [
      { nome: 'Sangue Antigo', desc: 'Resistência a Sombrio e Venenos. Paralisam o próprio envelhecimento. Visão perfeita no escuro.' },
      { nome: 'Maldição Solar', desc: 'Na luz direta, sofrem -4 em For, Agi, Con, deslocamento pela metade e visão turva.' },
      { nome: 'Metamorfose do Véu', desc: 'Ação de movimento: transforma-se em nuvem de morcegos/névoa.' },
      { nome: 'Marca do Pacto Antigo', desc: 'Não é punido por ignorar Morvethra ou Zyrhûn. Mas se jurar lealdade a outro deus e depois romper esse juramento, sofre Desvantagem em todos os testes de Vontade até fazer as pazes ou for perdoado (a critério do mestre).' }
    ],
    subracas: {
      noctaryn_sanguinario: {
        nome: 'Noctaryn Sanguinário',
        aliases: ['vampiro sanguinario', 'vampiro cacador', 'tocado por zyrhun'],
        citacao: 'Não fingem ser gentis. A fome que Zyrhûn deixou neles nunca aprendeu a esperar.',
        attrBonus: { agi: 2, for: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: ['Fome do Caos: se passar mais de 3 dias sem se alimentar, sofre Desvantagem em testes de Vontade contra impulsos violentos.'],
        regiao: 'Sombras, cavernas e florestas noturnas',
        habilidades: [
          { nome: 'Predador Noturno', desc: 'Se não tiverem se alimentado, Vantagem para rastrear criaturas vivas.' },
          { nome: 'Sede de Vitalidade', desc: 'Uma vez por cena, +4 de dano necrótico em ataque e recupera isso em PV.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Atletismo.' }
        ]
      },
      noctaryn_sedutor: {
        nome: 'Noctaryn Sedutor',
        aliases: ['vampiro sedutor', 'vampiro social', 'tocado por morvethra'],
        citacao: 'A presa convidada raramente percebe que já foi ceifada — só falta o corpo entender.',
        attrBonus: { car: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra Encantamento e efeitos de leitura mental'],
        fraquezas: [],
        regiao: 'Cidades, cortes e salões noturnos',
        habilidades: [
          { nome: 'Encanto do Sangue', desc: 'Uma vez por cena, alvo que falhar em teste de Vontade fica Fascinado por 1 rodada, tratando o Noctaryn como aliado confiável.' },
          { nome: 'Sede de Vitalidade', desc: 'Uma vez por cena, +4 de dano necrótico em ataque e recupera isso em PV.' },
          { nome: 'Proficiências', desc: '+4 em Diplomacia e Enganação.' }
        ]
      }
    }
  },

  sylphari: {
    nome: 'Sylphari (Fadas)',
    aliases: ['sylphari', 'fada'],
    // Comuns a todo Sylphari, independente da vertente de magia feérica.
    habilidadesComuns: [
      { nome: 'Voo Fluido', desc: 'Pode voar livremente. +4 em testes de esquiva no ar.' },
      { nome: 'Fragilidade Física', desc: 'Vida Máxima -5.' },
      { nome: 'Vulnerabilidade a Ferro Frio', desc: 'Dano dobrado.' }
    ],
    subracas: {
      sylphari_ilusionista: {
        nome: 'Sylphari Ilusionista',
        aliases: ['fada ilusionista', 'fada dos sonhos'],
        citacao: 'Tecem sonhos e mentiras com a mesma facilidade com que outros respiram.',
        attrBonus: { agi: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Clareiras enevoadas de florestas místicas',
        habilidades: [
          { nome: 'Invisibilidade Efêmera', desc: 'Reação a ataque (uma vez por cena) ou ação de movimento: fica invisível.' },
          { nome: 'Pó de Sonhos', desc: 'Força alvo (Vontade) a ficar atordoado/dormir por 1 rodada.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Acrobacia.' }
        ]
      },
      sylphari_encantadora: {
        nome: 'Sylphari Encantadora',
        aliases: ['fada encantadora', 'fada da natureza'],
        citacao: 'Onde pousam, uma flor nasce; onde curam, uma ferida esquece que sangrou.',
        attrBonus: { int: 2, sab: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Resistência a venenos naturais'],
        fraquezas: [],
        regiao: 'Bosques floridos e jardins mágicos',
        habilidades: [
          { nome: 'Afinidade Arcana', desc: 'Reduz custo de magias em 1 ou ganha +2 em conjuração.' },
          { nome: 'Toque Vital', desc: 'Uma vez por cena, cura 2d6 PV em um alvo tocado, ou acelera o crescimento de plantas próximas.' },
          { nome: 'Proficiências', desc: '+4 em Sintonia e Medicina.' }
        ]
      }
    }
  },

  velkarin: {
    nome: 'Velkarin (Anjo Caído)',
    aliases: ['velkarin', 'anjo'],
    // Comuns a todo Velkarin, independente de como carregam a queda.
    habilidadesComuns: [
      { nome: 'Sangue Celestial', desc: 'Resistência a dano Sagrado e Sombrio (Reduz em 5). Imunidade a dano de queda.' },
      { nome: 'Asas Sombrias', desc: 'Planar e voar por curtos períodos.' },
      { nome: 'Marca do Exílio', desc: 'Facilmente rastreável (Vantagem para quem rastreia).' }
    ],
    subracas: {
      velkarin_redimido: {
        nome: 'Velkarin Redimido',
        aliases: ['anjo caido redimido', 'anjo penitente'],
        citacao: 'Ainda acreditam que a queda pode ser o começo de outra ascensão.',
        attrBonus: { car: 2, sab: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Santuários esquecidos e vilarejos que aceitam sua presença',
        habilidades: [
          { nome: 'Presença Imponente', desc: 'Uma vez por cena, força inimigos (Vontade) a ficarem abalados.' },
          { nome: 'Luz Residual', desc: 'Uma vez por cena, cura 2d6 PV em um aliado tocado.' },
          { nome: 'Proficiências', desc: '+4 em Diplomacia e Intuição.' }
        ]
      },
      velkarin_renegado: {
        nome: 'Velkarin Renegado',
        aliases: ['anjo caido renegado', 'anjo da ira'],
        citacao: 'Se o Céu os expulsou, que sinta o peso disso a cada golpe.',
        attrBonus: { car: 2, for: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: ['Ira Contida: Desvantagem em testes de Vontade contra provocações diretas.'],
        regiao: 'Variadas, sempre à margem de qualquer comunidade estabelecida',
        habilidades: [
          { nome: 'Chama do Exílio', desc: 'Ataques causam +4 de dano espiritual extra.' },
          { nome: 'Grito da Queda', desc: 'Uma vez por cena, força inimigos próximos (Vontade) a recuarem 3m.' },
          { nome: 'Proficiências', desc: '+4 em Intimidação e Atletismo.' }
        ]
      }
    }
  },

  verdarin: {
    nome: 'Verdarin (Dahllan)',
    aliases: ['verdarin', 'dahllan', 'planta'],
    // Comuns a todo Verdarin, independente do bioma de origem.
    habilidadesComuns: [
      { nome: 'Casca Viva', desc: '+2 de Defesa Natural permanente.' },
      { nome: 'Fotossíntese', desc: 'Após 1h de luz, não precisa comer no dia e recupera +5 PV em descanso curto.' },
      { nome: 'Vulnerabilidade ao Fogo', desc: 'Dano em dobro.' }
    ],
    subracas: {
      verdarin_guardia: {
        nome: 'Verdarin Guardiã Florestal',
        aliases: ['dahllan guardia', 'dahllan da floresta'],
        citacao: 'A floresta densa não precisa gritar para se defender — basta fechar o caminho.',
        attrBonus: { sab: 2, con: 1 },
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Florestas conscientes densas e antigas',
        habilidades: [
          { nome: 'Raízes de Maelthra', desc: 'Ação bônus, alvo faz teste de Reflexos ou fica Enraizado por 1 rodada.' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência (Florestas) e Medicina.' }
        ]
      },
      verdarin_selvagem: {
        nome: 'Verdarin Selvagem',
        aliases: ['dahllan selvagem', 'dahllan agreste'],
        citacao: 'Cresceram onde a terra é hostil, e aprenderam a ser mais hostis ainda.',
        attrBonus: { for: 2, con: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Charnecas, terras agrestes e bordas selvagens sem cultivo',
        habilidades: [
          { nome: 'Simbionte de Batalha', desc: 'Em terreno natural, ataques corpo a corpo causam +4 dano extra.' },
          { nome: 'Proficiências', desc: '+4 em Atletismo e Sobrevivência.' }
        ]
      }
    }
  },

  zirkin: {
    nome: 'Zirkin (Goblins)',
    aliases: ['zirkin', 'goblin'],
    // Comuns a todo Zirkin, independente de viverem sozinhos ou em clã.
    habilidadesComuns: [
      { nome: 'Sobrevivente do Esgoto', desc: 'Imunidade a doenças e venenos ingeridos.' },
      { nome: 'Covardia Racional', desc: '-2 em Vontade vs Medo de Abissais/Grandes. Se falhar, recua na 1ª rodada.' }
    ],
    subracas: {
      zirkin_sucateiro: {
        nome: 'Zirkin Sucateiro',
        aliases: ['goblin sucateiro', 'goblin solitario'],
        citacao: 'Sozinho, mas nunca desarmado — sempre há uma gambiarra a montar.',
        attrBonus: { agi: 2, int: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: 'Esgotos e cavernas ácidas, longe de qualquer clã',
        habilidades: [
          { nome: 'Sucata é Ouro', desc: 'Ação bônus p/ criar Gambiarra: +4 num único teste (ataque, defesa, cura) antes de quebrar.' },
          { nome: 'Ataque Oportunista', desc: 'Se atacar alvo distraído/flanqueado, causa +4 de dano extra.' },
          { nome: 'Proficiências', desc: '+4 em Engenharia (Gambiarras) e Ladinagem.' }
        ]
      },
      zirkin_clanico: {
        nome: 'Zirkin Clânico',
        aliases: ['goblin de cla', 'goblin tribal'],
        citacao: 'Um Zirkin sozinho é presa fácil. Um bando de Zirkin é uma enchente.',
        attrBonus: { con: 2, car: 1 },
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade a Provocação/Fúria induzida magicamente'],
        fraquezas: [],
        regiao: 'Colônias e assentamentos subterrâneos densamente povoados',
        habilidades: [
          { nome: 'Vantagem Numérica', desc: 'Ganha +1 em ataque e Defesa para cada aliado Zirkin adjacente ao alvo (máximo +3).' },
          { nome: 'Grito do Clã', desc: 'Ação bônus, uma vez por cena: aliados Zirkin em 6m ganham Vantagem no próximo ataque.' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência e Intimidação.' }
        ]
      }
    }
  },

  linhagem: {
    nome: 'Desconhecida (Linhagem)',
    aliases: ['linhagem'],
    habilidadesComuns: [],
    subracas: {
      linhagem_leste: {
        nome: 'Forma do Leste',
        aliases: ['vento errante'],
        citacao: 'Descendentes de mortais marcados pelo Vento Errante.',
        attrBonus: {},
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: '',
        habilidades: [
          { nome: 'Influência Comercial', desc: 'Bônus em sorte e carisma/persuasão. Vantagem em testes sociais/negociações.' },
          { nome: 'Linguagens', desc: 'Comum, Primário da raça, 4 da escolha do jogador.' }
        ]
      },
      linhagem_norte: {
        nome: 'Forma do Norte',
        aliases: ['lunar', 'norte'],
        citacao: 'Descendentes de mortais influenciados pela Deusa da lua.',
        attrBonus: {},
        // 'Vento e Velocidade' cita 'Buff em Velocidade/Mobilidade' sem valor numérico
        // definido no texto original — não convertido em deslocamentoBonus.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Frio', 'Efeitos climáticos'],
        fraquezas: [],
        regiao: '',
        habilidades: [
          { nome: 'Magia Lunar', desc: 'Afinidade com magia lunar e sombras/escuridão.' },
          { nome: 'Vento e Velocidade', desc: 'Buff em Velocidade/Mobilidade. Sensibilidade espiritual (presságios do vento).' },
          { nome: 'Furtividade e Foco', desc: 'Bônus em furtividade, concentração ou resistência mental.' },
          { nome: 'Linguagens', desc: 'Comum, Primário da raça.' }
        ]
      },
      linhagem_oeste: {
        nome: 'Forma do Oeste',
        aliases: ['vento da memoria'],
        citacao: 'Influência dos Cantos, Contos e Artes.',
        attrBonus: {},
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: [],
        regiao: '',
        habilidades: [
          { nome: 'Memória Local', desc: 'Capacidade de "lembrar" eventos passados de um lugar.' },
          { nome: 'Rituais', desc: 'Vantagem em rituais.' },
          { nome: 'Conhecimentos', desc: 'Bônus em História, Religião e Cultura.' },
          { nome: 'Linguagens', desc: 'Comum, Primário da raça + dois da escolha do jogador.' }
        ]
      },
      linhagem_sul: {
        nome: 'Forma do Sul',
        aliases: ['vento da furia'],
        citacao: 'Descendentes de mortais sob influência do Vento da Fúria Viva.',
        attrBonus: {},
        // 'Fúria Física' cita 'Bônus em força, vigor ou regeneração' sem valor numérico
        // de CA ou deslocamento definido no texto original.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Calor'],
        fraquezas: [],
        regiao: '',
        habilidades: [
          { nome: 'Magia Solar', desc: 'Afinidade com magia solar/fogo. Magias ligadas a explosão, ira e vitalidade.' },
          { nome: 'Fúria Física', desc: 'Bônus em força, vigor ou regeneração.' },
          { nome: 'Linguagens', desc: 'Comum, Primário da raça.' }
        ]
      }
    }
  }
};

// =============================================================
// HELPERS — não precisa editar nada daqui pra baixo
// =============================================================

function listarFamilias() {
  return Object.keys(RACAS_DB).map(id => ({ id, nome: RACAS_DB[id].nome }));
}

function listarSubracas(familiaId) {
  const fam = RACAS_DB[familiaId];
  if (!fam) return [];
  return Object.keys(fam.subracas).map(id => ({ id, nome: fam.subracas[id].nome }));
}

function getSubraca(familiaId, subracaId) {
  const fam = RACAS_DB[familiaId];
  if (!fam) return null;
  const sub = fam.subracas[subracaId];
  if (!sub) return null;
  return {
    familiaId, familiaNome: fam.nome,
    subracaId, ...sub,
    // habilidades = comuns da família + específicas da sub-raça
    habilidadesTotais: [...(fam.habilidadesComuns || []), ...(sub.habilidades || [])]
  };
}

// Busca "inteligente": acha família OU sub-raça por nome/alias parcial.
// Retorna lista de { familiaId, subracaId, label } pra popular um
// autocomplete/busca livre no futuro, se você quiser ir além dos 2 selects.
function buscarRaca(termo) {
  const q = (termo || '').toLowerCase().trim();
  if (!q) return [];
  const resultados = [];
  Object.entries(RACAS_DB).forEach(([famId, fam]) => {
    Object.entries(fam.subracas).forEach(([subId, sub]) => {
      const candidatos = [sub.nome, fam.nome, ...(sub.aliases||[]), ...(fam.aliases||[])]
        .join(' ').toLowerCase();
      if (candidatos.includes(q)) {
        resultados.push({ familiaId: famId, subracaId: subId, label: `${sub.nome} (${fam.nome})` });
      }
    });
  });
  return resultados;
}
