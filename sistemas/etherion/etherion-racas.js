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
        attrBonus: { agi: 1 },
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
        attrBonus: { for: 2 },
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo (muito elevada)', 'Calor extremo e magma'],
        fraquezas: ['Vulnerabilidade a frio intenso', 'Ambientes sem calor reduzem sua eficiência'],
        regiao: 'Cidades de Forja, regiões vulcânicas, próximos a rios de magma.',
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
        attrBonus: {},
        // 'Velocidade reduzida' é citado como fraqueza, mas sem valor numérico definido
        // no texto original — não convertido em deslocamentoBonus pra não inventar o número.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Terra (maior eficácia)', 'Pressão e ambientes extremos subterrâneos'],
        fraquezas: ['Velocidade reduzida', 'Dificuldade em terrenos instáveis (areia, lama, gelo)'],
        regiao: 'Cidadelas Abissais, túneis ancestrais esquecidos, próximos ao núcleo do mundo.',
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
        attrBonus: { sab: 1, pre: 2 },
        // 'Leveza dos Ventos': Deslocamento base aumentado em 3 metros (permanente).
        bonusCA: 0,
        deslocamentoBonus: 3,
        resistencias: ['Imunidade a magias que alteram memórias ou causam confusão mental.'],
        fraquezas: ['Maldição do Nômade: Se dormirem no mesmo local por mais de 1 mês, perdem 1 de Vigor/Constituição permanentemente até viajarem.'],
        regiao: 'Nômades por natureza',
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
        attrBonus: { for: 1, pre: 1, cos: 1 },
        // '+2 de Defesa Natural permanente' (resistências) → bônus fixo de CA.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade a Medo e Pânico', '+2 de Defesa Natural permanente'],
        fraquezas: ['Código de Honra: Incapazes de atacar inimigo desarmado/rendido. Quebrar resulta na perda dos bônus raciais.'],
        regiao: 'Exércitos estruturados de Aetherion',
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
        attrBonus: { agi: 2, pre: 1 },
        // Sem bônus passivo numérico de CA/Deslocamento (Vantagem na Iniciativa não é
        // um valor fixo somável nessas duas fórmulas).
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Dano Elétrico', '+2 em esquiva ou reflexos contra área', 'Vantagem na Iniciativa'],
        fraquezas: ['Hiperatividade: Não conseguem ficar parados. Sofrem -4 em testes de Furtividade.'],
        regiao: 'Montanhas',
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
    habilidadesComuns: [],
    subracas: {
      drakar: {
        nome: 'Drakar',
        aliases: ['draconato'],
        citacao: 'Herdeiros diretos das escamas e do poder brutal dos Quatro Dragões.',
        attrBonus: { for: 2, pre: 1 },
        // '+2 de Defesa Natural permanente' (resistências) → bônus fixo de CA.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Resistência à escolha (Fogo, Frio, Ácido, Elétrico)', '+2 de Defesa Natural permanente'],
        fraquezas: ['Presença Ameaçadora: -2 em Diplomacia com raças que não respeitam o poder bruto.'],
        regiao: 'Altas cordilheiras e topos de montanhas inóspitas',
        habilidades: [
          { nome: 'Sopro Primordial', desc: 'Uma vez por cena, cone destrutivo do seu elemento que causa dano em área (Reflexos reduz à metade).' },
          { nome: 'Rugido do Vento Dragônico', desc: 'Ação bônus para rugir, inimigos fazem teste de Vontade ou perdem a ação de movimento.' },
          { nome: 'Proficiências', desc: '+4 em Intimidação e Atletismo.' }
        ]
      }
    }
  },

  arkanir: {
    nome: 'Arkanir (Warforged)',
    aliases: ['arkanir', 'warforged', 'robo', 'golem'],
    habilidadesComuns: [],
    subracas: {
      arkanir: {
        nome: 'Arkanir',
        aliases: ['warforged'],
        citacao: 'Criados pelos primordiais, são a vanguarda tecnológica de Etherion.',
        attrBonus: { con: 2, for: 1, int: 1 },
        // '+2 Defesa Natural' (resistências) → bônus fixo de CA.
        // 'RD 2 contra físicos' é redução de dano, não CA — não somado aqui.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade a venenos, doenças e fadiga. Não respira.', '+2 Defesa Natural', 'RD 2 contra físicos'],
        fraquezas: ['Vulnerabilidade a Ácido e efeitos de Ferrugem.'],
        regiao: 'Desconhecida',
        habilidades: [
          { nome: 'Núcleo de Energia', desc: 'Uma vez por cena, ganha +5 em teste físico ou rolagem de dano por 2 rodadas.' },
          { nome: 'Protocolo de Reparo', desc: 'Usa ação para curar (1d10+Con), apenas com ferramentas ou magia.' },
          { nome: 'Proficiências', desc: '+4 em Fortitude e Engenharia.' }
        ]
      }
    }
  },

  feyrin: {
    nome: 'Feyrin (Duendes)',
    aliases: ['feyrin', 'duende'],
    habilidadesComuns: [],
    subracas: {
      feyrin: {
        nome: 'Feyrin',
        aliases: ['duende'],
        citacao: 'Dizem que um Feyrin só morre se for totalmente esquecido.',
        attrBonus: { agi: 2, int: 1 },
        // 'Passo de Fungo' (furtividade em floresta) e 'Transposição de Raízes' (ação bônus,
        // teleporte 6m) são situacionais, sem valor fixo de CA ou deslocamento permanente.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra danos elementais naturais (Fogo, Frio, Elétrico)'],
        fraquezas: ['Existência Esquecida: Se 24h sem interagir com vivos/mágicos, perdem 2 PV Máx por dia até interagirem.'],
        regiao: 'Florestas e pântanos',
        habilidades: [
          { nome: 'Passo de Fungo', desc: 'Pode se esgueirar em floresta fechada como sob invisibilidade.' },
          { nome: 'Truque da Floresta', desc: 'Uma vez por combate, ilusão que distrai o alvo (-4 em ataque ou percepção por 1 rodada).' },
          { nome: 'Transposição de Raízes', desc: 'Ação bônus para teleporte até 6m através do subsolo (terra/floresta/pântano).' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Ladinagem.' }
        ]
      }
    }
  },

  kaelthas: {
    nome: 'Kaelthas (Tieflings)',
    aliases: ['kaelthas', 'tiefling', 'demonio'],
    habilidadesComuns: [],
    subracas: {
      kaelthas: {
        nome: 'Kaelthas',
        aliases: ['tiefling'],
        citacao: 'Mortais tocados pelas energias do Abismo ou entidades sombrias.',
        attrBonus: { pre: 2, int: 2 },
        // Sem bônus passivo numérico de CA/Deslocamento nas habilidades desta sub-raça.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Fogo e Sombrio (metade)', 'Visão no Escuro total'],
        fraquezas: ['Sensibilidade a Luz/Fé: Dano sagrado ignora resistências.'],
        regiao: 'Variadas',
        habilidades: [
          { nome: 'Chamas do Vazio', desc: '+4 dano de fogo/sombrio em qualquer ataque ou magia ofensiva.' },
          { nome: 'Domínio Mental', desc: 'Ação bônus para instigar medo (Teste de Presença vs Vontade).' },
          { nome: 'Proficiências', desc: '+4 em Intimidação e Enganação.' }
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
        attrBonus: { con: 2, sab: 2 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd
        // ('Sangue Frio, Casca Dura'), herdado por todas as sub-raças. 'Letargia Térmica'
        // (deslocamento reduzido em frio extremo) é condicional, não convertida em número.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: [],
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
        attrBonus: { con: 2, for: 2 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['Fogo'],
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
        attrBonus: { con: 2, agi: 2 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: [],
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
        attrBonus: { con: 2, int: 2 },
        // '+2 de Defesa Natural permanente' vem de habilidadesComuns da família Lihzahrd.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: [],
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
    habilidadesComuns: [],
    subracas: {
      myrran: {
        nome: 'Myrran',
        aliases: ['gnomo'],
        citacao: 'Guardiões reclusos da tecnologia de Aetherion.',
        attrBonus: { int: 3, agi: 1 },
        // 'Gadget Defensivo' dá +4 de CA, mas só como Reação contra um ataque específico —
        // não é um bônus permanente somável na CA padrão. Não convertido em número fixo.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['+2 contra Ilusão e Encantamento', 'Visão no Escuro (Penumbra)'],
        fraquezas: ['Paranoia Constante: -2 em Carisma/Diplomacia e não confiam no grupo (exigem contratos).'],
        regiao: 'Subsolo profundo',
        habilidades: [
          { nome: 'Gênio Recluso', desc: 'Uma vez por sessão, entende qualquer puzzle/engenhoca (+4 p/ desarmar armadilhas).' },
          { nome: 'Gadget Defensivo', desc: 'Reação para usar invenção: +4 de CA contra o ataque específico.' },
          { nome: 'Proficiências', desc: '+4 em Engenharia e Ofícios (Tecnologia/Magitec).' }
        ]
      }
    }
  },

  noctaryn: {
    nome: 'Noctaryn (Vampiros)',
    aliases: ['noctaryn', 'vampiro'],
    habilidadesComuns: [],
    subracas: {
      noctaryn: {
        nome: 'Noctaryn',
        aliases: ['vampiro'],
        citacao: 'Predadores perfeitos para manter o equilíbrio populacional.',
        attrBonus: { agi: 2, pre: 2 },
        // 'Maldição Solar' reduz deslocamento à metade apenas em luz direta — condicional,
        // não um modificador fixo aplicável sempre. Não convertido em número.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Sombrio e Venenos', 'Paralisam envelhecimento', 'Visão perfeita no escuro'],
        fraquezas: ['Maldição Solar: Na luz direta, sofrem -4 em For, Agi, Con, deslocamento pela metade e visão turva.'],
        regiao: 'Sombras e regiões noturnas',
        habilidades: [
          { nome: 'Predador Noturno', desc: 'Se não tiverem se alimentado, Vantagem para rastrear criaturas vivas.' },
          { nome: 'Sede de Vitalidade', desc: 'Uma vez por cena, +4 de dano necrótico em ataque e recupera isso em PV.' },
          { nome: 'Metamorfose do Véu', desc: 'Ação de movimento: transforma-se em nuvem de morcegos/névoa.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Intimidação.' }
        ]
      }
    }
  },

  sylphari: {
    nome: 'Sylphari (Fadas)',
    aliases: ['sylphari', 'fada'],
    habilidadesComuns: [],
    subracas: {
      sylphari: {
        nome: 'Sylphari',
        aliases: ['fada'],
        citacao: 'Pequenos espíritos da natureza e do ar.',
        attrBonus: { agi: 3, int: 1 },
        // 'Voo Fluido' concede a capacidade de voar, mas não define um número fixo de
        // metros extras de deslocamento terrestre — não convertido em deslocamentoBonus.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: [],
        fraquezas: ['Fragilidade Física: Vida Máxima -5.', 'Vulnerabilidade a Ferro Frio (Dano dobrado).'],
        regiao: 'Florestas místicas',
        habilidades: [
          { nome: 'Voo Fluido', desc: 'Pode voar livremente. +4 em testes de esquiva no ar.' },
          { nome: 'Afinidade Arcana', desc: 'Reduz custo de magias em 1 ou ganha +2 em conjuração.' },
          { nome: 'Invisibilidade Efêmera', desc: 'Reação a ataque (uma vez por cena) ou ação de movimento: fica invisível.' },
          { nome: 'Pó de Sonhos', desc: 'Força alvo (Vontade) a ficar atordoado/dormir por 1 rodada.' },
          { nome: 'Proficiências', desc: '+4 em Furtividade e Acrobacia.' }
        ]
      }
    }
  },

  velkarin: {
    nome: 'Velkarin (Anjo Caído)',
    aliases: ['velkarin', 'anjo'],
    habilidadesComuns: [],
    subracas: {
      velkarin: {
        nome: 'Velkarin',
        aliases: ['anjo caido'],
        citacao: 'Carregam a beleza divina misturada com a melancolia da queda.',
        attrBonus: { pre: 2, agi: 1, for: 1 },
        // 'Asas Sombrias' permite planar/voar por curtos períodos, sem definir um valor
        // fixo de deslocamento terrestre extra — não convertido em deslocamentoBonus.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Sagrado e Sombrio (Reduz em 5)', 'Imunidade a dano de queda'],
        fraquezas: ['Marca do Exílio: Facilmente rastreável (Vantagem para quem rastreia).'],
        regiao: 'Variadas',
        habilidades: [
          { nome: 'Asas Sombrias', desc: 'Planar e voar por curtos períodos.' },
          { nome: 'Chama do Exílio', desc: 'Ataques causam +4 de dano espiritual extra.' },
          { nome: 'Presença Imponente', desc: 'Uma vez por cena, força inimigos (Vontade) a ficarem abalados.' },
          { nome: 'Proficiências', desc: '+4 em Diplomacia e Intuição.' }
        ]
      }
    }
  },

  verdarin: {
    nome: 'Verdarin (Dahllan)',
    aliases: ['verdarin', 'dahllan', 'planta'],
    habilidadesComuns: [],
    subracas: {
      verdarin: {
        nome: 'Verdarin',
        aliases: ['dahllan'],
        citacao: 'São a fúria da própria terra viva.',
        attrBonus: { sab: 2, con: 2 },
        // '+2 de Defesa Natural permanente' (resistências) → bônus fixo de CA.
        bonusCA: 2,
        deslocamentoBonus: 0,
        resistencias: ['+2 de Defesa Natural permanente'],
        fraquezas: ['Vulnerabilidade ao Fogo (Dano em dobro).'],
        regiao: 'Florestas conscientes',
        habilidades: [
          { nome: 'Fotossíntese', desc: 'Após 1h de luz, não precisa comer no dia e recupera +5 PV em descanso curto.' },
          { nome: 'Raízes de Maelthra', desc: 'Ação bônus, alvo faz teste de Reflexos ou fica Enraizado por 1 rodada.' },
          { nome: 'Simbionte de Batalha', desc: 'Em terreno natural, ataques corpo a corpo causam +4 dano extra.' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência (Florestas) e Medicina.' }
        ]
      }
    }
  },

  zirkin: {
    nome: 'Zirkin (Goblins)',
    aliases: ['zirkin', 'goblin'],
    habilidadesComuns: [],
    subracas: {
      zirkin: {
        nome: 'Zirkin',
        aliases: ['goblin'],
        citacao: 'Sobrevivem onde o resto do mundo morre.',
        attrBonus: { agi: 2, con: 2 },
        // 'Sucata é Ouro' concede +4 num único teste (ataque, defesa ou cura) antes de
        // quebrar — é um efeito temporário sob ação bônus, não um bônus fixo de CA.
        bonusCA: 0,
        deslocamentoBonus: 0,
        resistencias: ['Imunidade a doenças e venenos ingeridos', 'Imunidade a Provocação/Fúria induzida magicamente'],
        fraquezas: ['Covardia Racional: -2 em Vontade vs Medo de Abissais/Grandes. Se falhar, recua na 1ª rodada.'],
        regiao: 'Esgotos e cavernas ácidas',
        habilidades: [
          { nome: 'Sucata é Ouro', desc: 'Ação bônus p/ criar Gambiarra: +4 num único teste (ataque, defesa, cura) antes de quebrar.' },
          { nome: 'Ataque Oportunista', desc: 'Se atacar alvo distraído/flanqueado, causa +4 de dano extra.' },
          { nome: 'Proficiências', desc: '+4 em Sobrevivência e Engenharia (Gambiarras).' }
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
