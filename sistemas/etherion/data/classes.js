// classes.js — Aetherion RPG System
// 6 Classes Base | 54 Especializações | afinidadesRaciais: esqueleto pronto p/ preenchimento futuro

const classesRPG = {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. VANGUARDA
  // ─────────────────────────────────────────────────────────────────────────────
  vanguarda: {
    nome: 'Vanguarda',
    aliases: ['tank', 'guerreiro', 'lutador', 'protetor', 'linha de frente'],
    descricao: 'Forjada para absorver o impacto que ninguém mais sobrevive. A Vanguarda planta os pés na linha de frente e transforma o próprio corpo em muralha, seja pela fé, pela fúria ou pelo aço. Onde ela avança, o campo de batalha se reorganiza ao seu redor.',
    hpInicial: 12,
    hpPorNivel: 5,
    atributoFoco: 'for',
    atributosChave: ['for', 'cos'],
    salvaguardas: ['for', 'cos'],
    proficienciaArmas: ['Espada', 'Machado', 'Martelo', 'Lança'],
    proficienciaArmadura: { tipos: ['leve', 'media', 'pesada'], escudo: true },
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
        descricao: 'O Paladino Guardião canaliza o Sopro na sua forma mais primordial: a centelha de Archëon como escudo místico, não como espada. Ele não busca vencer batalhas — busca garantir que elas nunca cheguem a quem não pode se defender. Sua fé não está atrelada a um único deus do panteão, mas ao próprio ato de criação: se Archëon deu livre-arbítrio a tudo que respira, então proteger esse arbítrio é a forma mais pura de devoção. Em combate, planta-se entre o perigo e os inocentes e simplesmente não sai do lugar, absorvendo o que for preciso. É a classe ideal para quem quer ser o motivo de todo mundo sobreviver, mesmo sem ser quem desfere o golpe final.',
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
        descricao: 'A Lâmina Voraz carrega o calor de Pyraël, o Sol — não como bênção calma, mas como fogo que consome e avança sem hesitar. Enquanto o Paladino se define pelo que protege, a Lâmina Voraz se define pelo que atravessa: ela não recua, não negocia com o cansaço e não pergunta se vale a pena continuar lutando. É a guerreira ou o guerreiro puro, aquele que aprendeu a ler um campo de batalha pelo instinto do próprio corpo, avançando como uma tempestade de aço que não sabe fazer outra coisa além de seguir em frente. Ideal para quem quer jogar o combatente cru, sem misticismo, só vontade e lâmina.',
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
        descricao: 'O Tecelão da Lâmina bebe do Saber de Aethrýs, a deusa que concedeu a língua universal e a compreensão cosmológica aos primeiros povos — mas aplica esse conhecimento não a livros, e sim ao próprio corpo em movimento. É a prova viva de que o estudo profundo da Arte não precisa se limitar a grimórios: cada golpe é uma equação resolvida em tempo real, cada defesa é uma fórmula testada sob pressão. Diferente da Vanguarda pura, o Tecelão entende os princípios por trás da força que usa, e por isso alcança patamares mágicos que um guerreiro comum jamais tocaria. É a escolha certa para quem quer combinar aço e arcanismo sem abandonar a linha de frente.',
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
        descricao: 'O Comandante da Ordem segue Ordelyne, a deusa nascida da fusão de saber e magia residual para conter o caos semeado por Zyrhûn. Onde a Ordem existe, o conflito tem regras, e onde há regras, há vitória sustentável. Este guerreiro não é o mais forte da linha de frente — é quem decide onde a linha de frente deve estar. Sua autoridade nasce da clareza tática, não da imposição: aliados seguem suas ordens porque elas funcionam, batalha após batalha. É a especialização perfeita para quem quer liderar um grupo de aventureiros na mesa, pensando em posicionamento e sinergia tanto quanto em dano.',
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
        descricao: 'O Algoz do Abismo carrega a Mácula das Trevas de Kharvion, o semideus responsável pelas punições no Submundo — as sombras nascidas do medo primitivo dos traidores exilados após a Guerra do Caos. Este guerreiro não busca apenas ferir o corpo do inimigo, mas quebrar sua vontade de continuar lutando, usando o terror como arma tão real quanto qualquer lâmina. Sua força vem de um pacto silencioso com aquilo que a maioria evita nomear: o Véu Trincado sussurrou, e o Algoz escutou, trocando parte de si por um poder que não perdoa hesitação. É a Vanguarda para quem quer intimidar tanto quanto tanka, fazendo o próprio grupo inimigo hesitar antes de avançar.',
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
        descricao: 'O Flagelo de Zyrhûn serve, direta ou indiretamente, ao deus aprisionado no grau mais profundo do Submundo — aquele que, mil anos após a Criação, testou os limites do livre-arbítrio concedido por Archëon e semeou o Caos que quase destruiu tudo. Mesmo preso, parte da energia de Zyrhûn ainda flui para o mundo físico, e o Flagelo é um dos canais dessa fuga: um guerreiro que aceitou que o caos não é ausência de poder, mas sua forma mais honesta. Ele luta sem padrão, sem previsibilidade, confiando que a imprevisibilidade em si é uma vantagem tática. É a Vanguarda para quem quer um tanque instável, perigoso até para seus próprios aliados quando o combate se estende demais.',
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
        descricao: 'O Escudo de Maelthra canaliza a deusa que deu forma ao próprio globo de Aetherion, moldando-o antes mesmo que os deuses compreendessem que o sangue de Archëon corria por suas veias. Este guerreiro não luta como quem ataca — luta como quem existe, imóvel e inevitável, da mesma forma que uma cordilheira não se desvia do caminho de um rio. Não há drama nem fúria em sua defesa: apenas a certeza tranquila de que, enquanto ele estiver de pé, aquele espaço está protegido. É a especialização mais literal do conceito de tanque dentro da Vanguarda, perfeita para quem quer ser a muralha que o grupo inteiro pode usar como ponto de apoio.',
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
        descricao: 'A Fúria Desmedida ressoa com Káryon Thraël, o Deus dos Céus e dos Trovões, criado para equilibrar frio e calor mas que nunca deixou de carregar a ira das tempestades consigo. Este guerreiro não busca esse equilíbrio — ele é a tempestade propriamente dita, uma força bruta e impetuosa que se solta no calor da batalha e atropela tudo em seu caminho, aliado ou inimigo por igual, se alguém for descuidado o bastante para ficar no meio. Sua conexão mais forte é com o Vento Sul, Sahryx, aquele que carrega fúria, calor e crescimento acelerado — às vezes destrutivo demais para ser contido. É a Vanguarda para quem quer jogar puro instinto de combate, trocando controle por dano bruto e imprevisibilidade.',
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
        descricao: 'O Bastião Silencioso segue a influência de Morvhaël, o Vento do Norte, guiado pela lua e responsável pelas brisas frias e o silêncio que toma as paisagens que toca — a mesma força que molda a lore gélida de Nyvelis, Guardiã das Terras Gélidas. Diferente da Fúria Desmedida, este guerreiro não anuncia sua chegada: ele se posiciona, espera, e deixa o inimigo cometer o erro de subestimá-lo. Seu controle de campo de batalha é cirúrgico, quase meditativo, como o gelo que avança silenciosamente até que já não há mais como recuar dele. É a Vanguarda para quem prefere pensar tático em vez de gritar em combate, controlando o ritmo da luta com paciência gélida.',
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
        descricao: 'O Corpo de Nythraxis nasceu do contato direto com as fendas do Véu Trincado — as fissuras abertas quando a onda de choque da Guerra do Caos rachou a barreira entre o Mundo Espiritual e o físico, deixando vazar a essência não filtrada de Archëon misturada ao medo e ao imprevisto. Este guerreiro permitiu que essa amálgama profana reescrevesse sua própria carne, trocando vulnerabilidade por uma resistência que não é natural e nunca deveria existir. Seu corpo já não responde totalmente às leis do mundo mortal, e isso o torna ao mesmo tempo um tanque assustadoramente resiliente e uma lembrança viva de que o Véu nunca foi completamente selado. É a Vanguarda mais sombria e visceral, para quem quer jogar com o preço explícito da Mácula estampado no próprio corpo.',
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
    descricao: 'Move-se antes que o inimigo perceba que a luta já começou. O Precursor vive da leitura do campo de batalha, do golpe certeiro e da saída limpa — seja pela lâmina, pela flecha ou pelas sombras. Onde a força bruta falha, a velocidade decide.',
    hpInicial: 10,
    hpPorNivel: 4,
    atributoFoco: 'agi',
    atributosChave: ['agi', 'sab'],
    salvaguardas: ['agi', 'sab'],
    proficienciaArmas: ['Adaga', 'Espada Curta', 'Arco', 'Besta', 'Rapieira'],
    proficienciaArmadura: { tipos: ['leve', 'media'], escudo: false },
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
        descricao: 'A Flecha Implacável carrega a marca gélida de Nyvelis, Guardiã das Terras Gélidas, aprendendo com a fauna selvagem a arte de ler um território antes de agir nele. Este caçador não busca a luta — busca o momento exato em que ela se torna desnecessária, porque o golpe certeiro já foi desferido antes que o alvo percebesse estar sendo observado. Rastrear é, para ele, tão importante quanto atirar: entender pegadas, ventos e hábitos é o verdadeiro trabalho, a flecha é só a conclusão. É o Precursor ideal para quem quer jogar o batedor do grupo, sempre um passo à frente de qualquer emboscada.',
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
        descricao: 'O Dervixe da Mudança segue a energia bruta de Káryon Thraël, o Deus dos Trovões, mas a interpreta de forma completamente distinta da fúria da Vanguarda: em vez de se tornar a tempestade, ele aprende a dançar dentro dela. Cada movimento é calculado para parecer imprevisível, cada esquiva é parte de uma coreografia que confunde o inimigo antes mesmo do primeiro corte. Ele não vence pela força, vence pela impossibilidade de ser atingido enquanto se movimenta pelo campo de batalha como se este fosse um palco. É o Precursor perfeito para quem quer combate fluido, acrobático, quase teatral.',
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
        descricao: 'O Asceta do Sopro busca a centelha de Archëon da forma mais direta possível: não através de rituais, grimórios ou pactos, mas pela disciplina extrema do próprio corpo como instrumento. Ele acredita que a vida — o sopro que Archëon concedeu a tudo que existe — já contém toda a magia necessária, bastando refinar o vaso que a carrega. Anos de treino o levaram a um patamar que rivaliza com conjuradores dedicados, mesmo sem tocar em uma única página de magia. É o Precursor mais introspectivo e filosófico, perfeito para quem quer combinar combate desarmado com uma jornada pessoal de autoconhecimento.',
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
        descricao: 'O Esgrimista Audaz carrega a beleza de Lyrëa, semideusa que também abençoou os Sylphari com sua elegância sobrenatural. Para este duelista, o combate não é apenas sobrevivência — é expressão, é performance, é a certeza de que se vai morrer ou matar, que ao menos aconteça com estilo. Ele treina tanto a lâmina quanto a presença social, porque um bom duelo começa muito antes da primeira estocada, na forma como se entra em uma sala e se lê um oponente. É o Precursor mais carismático, ideal para quem quer ser tanto o fio da espada quanto a voz mais afiada da mesa.',
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
        descricao: 'O Assassino do Véu aprendeu a se mover pelas fissuras que a Guerra do Caos abriu na barreira entre os mundos, usando as mesmas fendas por onde sussurram as entidades de Nythraxis para se deslocar de forma que nenhuma vigilância mortal consegue prever. Não é um demônio nem um servo direto do Abismo, mas alguém que fez um pacto silencioso com o Véu Trincado para emprestar um pouco daquela natureza incompreensível. Ele aparece onde não deveria, desaparece antes que alguém processe tê-lo visto, e cobra o preço de existir entre dois mundos em cada golpe que desfere. É o Precursor mais sombrio, para quem quer jogar o predador absoluto das sombras.',
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
        descricao: 'O Gatuno das Sombras compartilha a mesma origem sombria do Assassino do Véu — as Trevas nascidas do medo primitivo dos exilados no Submundo — mas escolheu um caminho menos letal e mais lucrativo. Onde o Assassino mata, o Gatuno rouba, engana e desaparece antes que alguém sequer note a perda. Ele conhece cada esconderijo, cada guarda subornável, cada rota de fuga de uma cidade porque fez questão de aprender antes de precisar. Sua relação com a escuridão é quase afetuosa, uma velha parceria de ofício mais do que um pacto sombrio. É o Precursor perfeito para quem quer o ladino clássico: charme, malícia e mãos ligeiras.',
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
        descricao: 'O Punho do Abismo é tocado pelo mesmo Caos de Zyrhûn que deu origem a Nythraxis, o domínio fraturado nascido da amálgama entre o sangue de Archëon e o medo da guerra. Mas diferente do lutador abissal que se apoia em mutação física bruta, este combatente manteve seu corpo quase intacto — a mudança aconteceu por dentro, na forma como enxerga violência e limites. Rápido, brutal e imprevisível, ele combina a agressividade de um berserker com a mobilidade de um verdadeiro Precursor, atacando em rajadas que não dão brechas de resposta. É a escolha para quem quer velocidade e dano corpo a corpo sem depender de armas.',
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
        descricao: 'O Mestre das Esporas estuda a vida silenciosa que Elysséra semeou no mundo — a mesma magia que, ao mutacionar pequenas plantas e fungos, deu origem aos Feyrin. Este Precursor aprendeu a ouvir aquilo que a maioria ignora: fungos, esporos e venenos que crescem na sombra das florestas e carregam poder mortal para quem sabe reconhecê-lo. Ele não briga de frente — prepara o terreno com antecedência, plantando toxinas que agem muito depois de ele já ter ido embora. É o Precursor mais paciente e cientificamente curioso, ideal para quem gosta de estratégia de longo prazo e combate indireto.',
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
        descricao: 'O Trapaceiro do Bosque canaliza a beleza sedutora e enganosa de Lyrëa, a mesma influência que deu origem aos Sylphari, com um espírito que lembra os próprios Feyrin — criaturas travessas que trocam coisas de lugar e adoram pregar peças em mortais distraídos. Ele não vê a vida como uma sequência de combates a vencer, mas como uma grande piada cósmica na qual ele é o único que entende a graça. Ilusões, distrações e pequenos encantos são suas ferramentas favoritas, sempre com um sorriso guardado para o momento em que a vítima perceber o que aconteceu. É o Precursor mais lúdico e imprevisível, perfeito para quem quer trazer humor e travessura para a mesa sem abrir mão de utilidade real.',
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
    descricao: 'Nunca é a arma mais forte na sala, mas quase sempre é quem decide como a sala vai terminar. O Especialista domina engenhocas, venenos, informação e improviso — transformando conhecimento e preparo em vantagem onde a força bruta não chega.',
    hpInicial: 10,
    hpPorNivel: 4,
    atributoFoco: 'int',
    atributosChave: ['int', 'car'],
    salvaguardas: ['int', 'car'],
    proficienciaArmas: ['Adaga', 'Besta', 'Pistola de Artífice', 'Bordão'],
    proficienciaArmadura: { tipos: ['leve', 'media'], escudo: false },
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
        descricao: 'O Cronista da Tradição segue os passos de Aethrýs, a deusa que desceu diante dos Três Grandes Imperadores e concedeu a língua universal, tornando consciente o que antes era apenas instinto cosmológico. Este Especialista entende que histórias não são apenas entretenimento: são memória viva, e povos que esquecem sua história perdem a própria identidade. Aprendeu com os Feyrin — que só existem enquanto forem lembrados — que palavras bem colocadas podem curar, inspirar ou destruir uma reputação inteira. Carrega consigo lendas de todos os continentes e sabe exatamente qual contar em cada situação. É o Especialista mais versátil socialmente, ideal para quem quer ser a memória e a voz do grupo.',
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
        descricao: 'O Engenheiro de Sucata trabalha sob a influência de Maelthra, a deusa que moldou o próprio globo de Aetherion — mas em vez de montanhas e planícies, este Especialista molda metal, engrenagens e mecanismos com as próprias mãos. Herdeiro espiritual da tradição dos Durkan, célebres por sua arte na criação de armas e fortalezas, ele acredita que qualquer coisa quebrada pode virar algo novo com paciência e criatividade suficientes. Não tem magia inata, mas compensa com engenhocas, armadilhas e soluções improvisadas que surpreendem tanto aliados quanto inimigos. É o Especialista para quem gosta de resolver problemas com as mãos sujas de graxa em vez de feitiços.',
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
        descricao: 'O Alquimista Volátil estuda a vida em sua forma mais reativa, canalizando o mesmo princípio que Elysséra usou para semear os primeiros seres conscientes e mutações biológicas pelo mundo. Ele entende que toda substância viva carrega dois potenciais opostos — cura e veneno — e a única coisa que separa um do outro é a intenção de quem a manuseia. Suas poções explodem, curam, corroem ou revigoram dependendo da mistura exata, e ele carrega sempre mais reagentes instáveis do que qualquer pessoa sã deveria. É o Especialista mais imprevisível em termos de utilidade, útil tanto no campo de batalha quanto fora dele.',
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
        descricao: 'O Sabotador Cínico ecoa a filosofia de Zyrhûn: a crença de que ordem e harmonia são apenas ilusões confortáveis esperando para serem desmontadas. Ele não é um lutador direto nem um destruidor bruto — é um especialista em encontrar exatamente o ponto fraco de um sistema, seja ele uma fortaleza, uma organização ou uma relação de confiança, e aplicar pressão ali até tudo desmoronar. Seu cinismo não vem de maldade gratuita, mas da convicção de que instituições corruptas merecem cair. É o Especialista mais perigoso fora de combate direto, ideal para campanhas com intriga, espionagem e sabotagem política.',
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
        descricao: 'O Infiltrador do Submundo aprendeu seu ofício nas Trevas nascidas do medo dos exilados de Kharvion — não porque desceu literalmente ao Submundo, mas porque absorveu a mesma lição sombria: todo mundo tem algo a esconder, e quem controla os segredos controla o poder real por trás dos tronos. Ele se move entre guildas criminosas, cortes reais e tabernas de beira de estrada com igual naturalidade, sempre coletando informação antes de decidir o que fazer com ela. Discreto, paciente e frio, raramente age por impulso. É o Especialista para quem quer jogar espionagem, redes de contato e informação como arma principal.',
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
        descricao: 'O Vigarista do Véu Trincado fez um acordo, ainda que informal, com as entidades que sussurram através das fendas entre os mundos — aquelas que manipulam as probabilidades do plano material oferecendo pactos, sorte e poder em troca de preços bizarros. Ele aprendeu a jogar com essas mesmas margens de incerteza, tornando-se um mestre em manipular chances, apostas e acordos onde a vantagem sempre parece pender ligeiramente a seu favor. Ninguém tem certeza de quanto do seu sucesso é habilidade e quanto é a sombra de algo mais antigo escutando cada aposta que ele faz. É o Especialista mais ambíguo moralmente, perfeito para quem gosta de personagens com um pé no mistério cósmico.',
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
        descricao: 'A Voz de Aethervhal carrega o legado direto do Pacto dos Três Imperadores — o momento em que Thorgar Vhaldrûn, Aelthirion Vael\'Zyra e Kael Varyon Drathis, líderes de Durkan, Elvarin e Valarin, deixaram de lado guerras territoriais para fundar o reino que deu origem aos aventureiros e seus rankings. Este Especialista acredita que a maior conquista não é vencer uma guerra, mas evitar que ela comece, e que ouvir de verdade é uma habilidade mais rara e mais poderosa do que qualquer feitiço de combate. Beleza de Lyrëa e carisma natural se combinam nele para tornar qualquer sala mais receptiva à sua presença. É o Especialista ideal para quem quer ser o rosto diplomático do grupo, resolvendo conflitos com palavras antes que cheguem às armas.',
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
        descricao: 'O Artífice de Myrran segue a tradição dos gnomos surgidos da influência de Aethrýs — um povo profundamente inteligente que vive em locais subterrâneos desconhecidos e guarda seu saber tecnológico por medo do que ambiciosos fariam com ele em tempos de guerra. Este Especialista aprendeu que, se o sangue de Archëon corre pelas veias do próprio mundo, então até a matéria "morta" carrega um eco de vida esperando para ser lembrado e reativado. Suas criações — sejam golens, autômatos ou mecanismos animados — não são criaturas novas, mas memórias despertadas. É a especialização mais próxima da verdadeira conjuração dentro do Especialista, para quem quer construir aliados mecânicos com uma pitada de mistério arcano.',
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
        descricao: 'O Socorrista de Aethervhal representa a resposta mortal e prática ao sofrimento — treinado nas guildas que floresceram sob o Pacto dos Três Imperadores, sem depender de bênçãos divinas para salvar uma vida. Onde o Devoto cura pela fé, este Especialista cura pelo conhecimento anatômico, técnica e frieza sob pressão, tratando cada ferimento como um problema a ser resolvido metodicamente, não como um milagre a ser pedido. Sua confiança vem da experiência, não da revelação. É a escolha certa para quem quer um curador de grupo com identidade totalmente secular, ideal para narrativas mais realistas ou céticas em relação ao panteão divino.',
        pericias: ['socorrismo', 'investigacao'],
        // Trava 1: cura biológica é o tema exato, mesmo numa abordagem "não-mágica".
        aspectoPadrao: 'vida_elyssera',
        afinidadesRaciais: [],
        habilidades: [],
      },
      catalogador_do_eclipse: {
        nome: 'Catalogador do Eclipse',
        trilha: 'Equilibrada',
        recurso: '50/50',
        aliases: ['catalogador', 'pesquisador da fronteira', 'cientista do véu'],
        citacao: 'Sopro e Mácula não são inimigos. São só duas respostas diferentes para a mesma pergunta que ninguém teve coragem de fazer.',
        descricao: 'O Catalogador do Eclipse estuda a fronteira que Khaíros criou para apaziguar a disputa eterna entre Pyraël e Nyxara — o próprio eclipse, momento de encontro e batalha entre Sol e Lua. Nasce já compreendendo os dois lados da moeda entre Sopro e Mácula, sem o julgamento moral que a maioria das outras especializações carrega sobre o tema. Para ele, ciência e mística não são opostos: são ferramentas de investigação da mesma realidade complexa, e catalogar o inexplicável é uma forma de fé tão válida quanto qualquer templo. É a especialização mais academicamente curiosa do Especialista, perfeita para quem quer investigar os mistérios do Véu com método científico em vez de devoção cega.',
        pericias: ['investigacao', 'arcanismo'],
        // Trava 1: Lua de Nyxara — "o véu entre o que se vê e o que se esconde" — é
        // literalmente a fronteira entre Sopro e Mácula, sem julgamento moral entre os dois.
        aspectoPadrao: 'lua_nyxara',
        afinidadesRaciais: [],
        habilidades: [],
        // Trava de acesso à mecânica de Corromper/Purificar (V1.0, ver magias.js resolverSinergia).
        destravaSinergia: true,
        // Override da Trava 1 (aprendizado livre): esta especialização não escolhe
        // aspectos com vagas livres — ela NASCE conhecendo os dois lados da fronteira.
        // aspectosIniciaisFixos vêm de graça, fora do sistema de vagas, mas em troca
        // aspectosAprendizado cai para 0 (nenhuma vaga livre adicional no nível dela;
        // só aspectos concedidos por raça, se houver, poderiam somar depois).
        aspectosAprendizado: 0,
        aspectosIniciaisFixos: ['lua_nyxara', 'morte_morvethra'],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DEVOTO
  // ─────────────────────────────────────────────────────────────────────────────
  devoto: {
    nome: 'Devoto',
    aliases: ['clérigo', 'sacerdote', 'curandeiro', 'servo divino', 'inquisidor'],
    descricao: 'Canal vivo de um poder maior que si mesmo, seja luz, sombra ou o fio entre as duas. O Devoto protege, cura e julga em nome daquilo em que acredita, e carrega essa convicção como escudo e como arma.',
    hpInicial: 8,
    hpPorNivel: 3,
    atributoFoco: 'sab',
    atributosChave: ['sab', 'car'],
    salvaguardas: ['sab', 'car'],
    proficienciaArmas: ['Maça', 'Cajado', 'Martelo Sagrado'],
    proficienciaArmadura: { tipos: ['leve', 'media'], escudo: true },
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
        descricao: 'O Sacerdote da Luz canaliza Ordelyne, a Deusa da Ordem nascida da fusão de conhecimento e magia residual — a mesma que projetou os degraus mais altos do Submundo, fazendo nascer ali a Luz que equilibra as Trevas geradas pelo medo dos exilados. Este Devoto vê a cura não como um ato de escolha, mas como uma extensão natural de sua fé: assim como a luz simplesmente ilumina por existir, ele simplesmente cura por ser quem é, sem precisar de permissão ou justificativa. Sua presença tende a acalmar espaços tensos, e feridos confiam nele quase instintivamente. É o clérigo mais clássico e reconfortante do Devoto, ideal para quem quer ser o pilar de cura e esperança do grupo.',
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
        descricao: 'O Teurgo do Legado dedica sua fé a Khaíros, o Deus do Fluxo Temporal que estabeleceu o ciclo de dias e noites e criou os eclipses para apaziguar disputas cósmicas. Mas o foco deste Devoto não está no tempo à frente, e sim no que ficou para trás: os Primordiais, a primeira criação mortal, extinta na guerra de Zyrhûn e ressuscitada apenas na memória de quem ainda recita seus nomes e feitos. Ele acredita que esquecer é uma segunda morte, e que preservar rituais, línguas antigas e histórias sagradas é um ato tão divino quanto qualquer cura. É o Devoto mais estudioso e histórico, ideal para campanhas com forte peso em lore e arqueologia mística.',
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
        descricao: 'O Inquisidor Implacável serve Kharvion, o semideus responsável pelas punições no Submundo, aquele a quem os exilados foram entregues após a Guerra do Caos. Este Devoto acredita que fé sem consequência é apenas conforto vazio, e que a verdadeira devoção exige julgamento — sobre si mesmo, sobre os fiéis e, principalmente, sobre aqueles que corromperam o que era puro. Ele não hesita em usar o medo como ferramenta de correção, convencido de que a dor de um julgamento justo é preferível ao caos de nunca julgar nada. É o Devoto mais severo e assustador, perfeito para campanhas com tons de horror religioso ou moralidade cinzenta.',
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
        descricao: 'O Profeta da Agonia recebe visões através das mesmas Trevas de Kharvion que governam o Submundo, mas de uma forma muito mais pessoal e dolorosa: cada revelação chega como uma ferida na própria alma, uma cicatriz que nunca cicatriza completamente. Ele não escolheu esse fardo — foi escolhido por ele, e aprendeu que a dor, por mais cruel que seja, nunca o enganou até hoje. Fiéis o procuram com medo e esperança em partes iguais, sabendo que qualquer verdade que ele revelar virá acompanhada de sofrimento visível em seu rosto. É o Devoto mais trágico e visionário, para quem gosta de personagens marcados por um preço espiritual constante.',
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
        descricao: 'O Punho de Pyraël segue o Deus do Sol, que junto com Nyxara lançou domínios de calor extremo sobre o mundo recém-formado, criando um dos pólos que precisaram ser equilibrados por Khaíros. Este Devoto rejeita a imagem do clérigo passivo e contemplativo: para ele, fé se prova em ação, e a luz solar não é algo que se contempla, é algo que se torna. Combate corpo a corpo com convicção religiosa, cada golpe sendo tanto uma oração quanto um ataque. Sua devoção é ruidosa, física e impossível de ignorar. É o Devoto mais combativo, ideal para quem quer um clérigo que luta na linha de frente com os próprios punhos.',
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
        descricao: 'O Vidente de Khaíros serve diretamente o Deus do Fluxo Temporal, aquele que observou a disputa entre Sol e Lua e criou o próprio conceito de ciclo — dia, noite, e o eclipse como ponto de encontro entre extremos. Este Devoto percebe o tempo de forma diferente da maioria dos mortais: passado, presente e futuro se misturam em sua percepção como pontos igualmente concretos de uma mesma linha, e por isso suas profecias carregam um peso quase inevitável. Ele fala do amanhã com a mesma certeza tranquila com que outros falam do que já aconteceu ontem. É o Devoto mais enigmático e filosófico, perfeito para campanhas com elementos de destino, profecia e loops temporais.',
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
        descricao: 'O Guardião da Ampulheta presta reverência a Morvethra, a Morte encarnada, nascida do sacrifício conjunto de Khaíros, Elysséra e Nyxara para pôr fim à eternidade de agonia sofrida pelos Primordiais durante a Guerra do Caos. Diferente do que se poderia imaginar, este Devoto não celebra o fim da vida — celebra o alívio que a morte trouxe a um mundo que não sabia como parar de sofrer. Ele conduz funerais com solenidade, ajuda almas a aceitarem sua hora e vê a ampulheta de Morvethra não como ameaça, mas como misericórdia inevitável. É o Devoto mais sereno diante da mortalidade, ideal para quem quer explorar temas de luto, aceitação e ciclos de vida com respeito.',
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
        descricao: 'O Escriba de Aethrýs devota sua vida à deusa da sabedoria que, ao descer diante dos Três Grandes Imperadores, concedeu a língua universal e tornou consciente o conhecimento cosmológico que antes era só instinto. Este Devoto não guarda esse dom para si: dedica-se a espalhá-lo, ensinando, traduzindo textos antigos e conectando culturas que, sem a bênção de Aethrýs, jamais teriam se entendido. Ele acredita que conhecimento trancado é conhecimento desperdiçado, e que ensinar é a forma mais duradoura de fé que existe. É o Devoto mais generoso intelectualmente, perfeito para quem quer combinar magia com o papel de mentor ou professor dentro do grupo.',
        pericias: ['teologia', 'arcanismo'],
        // Trava 1: nome da especialização cita a divindade diretamente.
        aspectoPadrao: 'saber_aethrys',
        afinidadesRaciais: [],
        habilidades: [],
      },
      juiz_do_eclipse: {
        nome: 'Juiz do Eclipse',
        trilha: 'Equilibrada',
        recurso: 'Sopro',
        aliases: ['juiz', 'clérigo do véu', 'guardião da fronteira sagrada'],
        citacao: 'Nyxara disputou os céus com Pyraël até que Khaíros forjou o eclipse. Minha fé não escolheu um lado — ela guarda a linha entre os dois.',
        descricao: 'O Juiz do Eclipse pratica uma doutrina rara que não escolhe lado entre Sopro e Mácula, honrando tanto a Lua de Nyxara quanto a Morte de Morvethra como duas faces necessárias da mesma verdade cósmica. Sua fé nasceu do próprio eclipse que Khaíros forjou para apaziguar a disputa eterna entre Sol e Lua — um momento de encontro, não de vitória de um lado sobre o outro. Este Devoto acredita que julgar exige compreender ambos os extremos igualmente bem, e por isso nasce já conectado às duas correntes, sem as vagas de escolha livre que outros aspectos exigem. É o Devoto mais equilibrado teologicamente, ideal para quem quer representar neutralidade divina genuína, não indecisão.',
        pericias: ['teologia', 'ocultismo'],
        // Trava 1: Lua de Nyxara nasceu do sonho de Archëon e gerou tanto Morvethra
        // (Mácula) quanto Nerýth (Sopro) — doutrina que estuda os dois lados por fé,
        // não por ausência dela.
        aspectoPadrao: 'lua_nyxara',
        afinidadesRaciais: [],
        habilidades: [],
        // Trava de acesso à mecânica de Corromper/Purificar (V1.0, ver magias.js resolverSinergia).
        destravaSinergia: true,
        // Override da Trava 1 (aprendizado livre) — ver comentário equivalente em
        // catalogador_do_eclipse. Mesmo mecanismo: nasce com os 2 fixos, zero vagas livres.
        aspectosAprendizado: 0,
        aspectosIniciaisFixos: ['lua_nyxara', 'morte_morvethra'],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TRANSCENDENTE
  // ─────────────────────────────────────────────────────────────────────────────
  transcendente: {
    nome: 'Transcendente',
    aliases: ['mago', 'feiticeiro', 'bruxo', 'arcanista', 'conjurador'],
    descricao: 'Rompeu a barreira entre o mundo material e o Motor que sustenta a realidade — e paga o preço disso a cada respiração. O Transcendente manipula a Arte em seu estado mais puro, dobrando Sopro e Mácula à própria vontade sem as amarras que prendem as outras classes.',
    hpInicial: 6,
    hpPorNivel: 2,
    atributoFoco: 'car',
    atributosChave: ['int', 'sab'],
    salvaguardas: ['int', 'sab'],
    proficienciaArmas: ['Cajado', 'Adaga', 'Foco Arcano'],
    proficienciaArmadura: { tipos: ['leve'], escudo: false },
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
    // Trava de acesso à mecânica de Corromper/Purificar (V1.0, ver magias.js
    // resolverSinergia). Diferente de `destravaSinergia` nas especializações
    // (que destrava só aquela especialização específica), esta flag a nível
    // de CLASSE destrava para TODAS as especializações do Transcendente,
    // independente de qual delas o personagem escolheu — a classe inteira
    // já transcendeu a separação Pura/Corrompida por domínio da Arte.
    destravaSinergiaClasseInteira: true,
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
        descricao: 'O Mago da Torre é produto direto da guilda da Torre Mágica, fundada após o Pacto dos Três Imperadores sob a bênção de Aethrýs, deusa da sabedoria e da língua universal. Sua magia não nasce de instinto ou pacto, mas de anos de estudo rigoroso, disciplina acadêmica e domínio metódico da Arte em sua forma mais estruturada. Ele entende feitiços como um erudito entende teoremas: cada um construído sobre o anterior, cada erro uma lição cara mas necessária. É o conjurador mais previsível e confiável do Transcendente, perfeito para quem gosta de magia como ciência exata, com fórmulas, regras e domínio deliberado.',
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
        descricao: 'O Feiticeiro da Centelha carrega, de forma mais intensa que qualquer mortal comum, a centelha de Archëon que corre nas "veias" e rios mágicos de todo Aetherion — o verdadeiro Motor do Mundo. Ele nunca precisou estudar magia em uma torre ou negociar com entidades: o poder sempre esteve lá, latente, desde o nascimento, como se o próprio mundo tivesse escolhido reagir de forma mais viva dentro dele. Seu desafio nunca foi aprender a conjurar, mas aprender a controlar algo que nasceu descontrolado. É o conjurador mais instintivo e emocional do Transcendente, ideal para quem quer magia como identidade inata, não como habilidade adquirida.',
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
        descricao: 'O Tecelão de Miragens canaliza Lyrëa, semideusa da beleza e dos espelhos que também deu origem à natureza sedutora dos Sylphari. Este Transcendente domina a ilusão não como truque barato, mas como filosofia: se percepção molda realidade para a maioria dos mortais, então quem controla a percepção controla, de certa forma, a própria verdade compartilhada. Suas ilusões são tão refinadas que muitas vítimas nunca descobrem terem sido enganadas. Ele caminha uma linha tênue entre arte e manipulação, sem nunca se importar muito com onde essa linha realmente está. É o conjurador mais sutil e psicológico do Transcendente, perfeito para quem gosta de magia baseada em engano elegante.',
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
        descricao: 'O Cronomante de Khaíros toca diretamente o domínio do Deus do Fluxo Temporal, aquele que forjou o próprio conceito de eclipse para apaziguar Sol e Lua e que rege o ciclo de dias e noites de todo Aetherion. Diferente do Vidente que serve Khaíros com fé contemplativa, este Transcendente manipula o tempo de forma ativa e arcana: acelera, desacelera, revisita instantes que já deveriam ter passado. Ele entende que o tempo não é uma linha reta e rígida, mas um tecido manipulável por quem possui conhecimento suficiente. Cada feitiço carrega o risco de consequências que ainda não aconteceram — ou que já aconteceram e ninguém percebeu. É o conjurador mais conceitualmente complexo do Transcendente, para quem gosta de magia com peso filosófico.',
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
        descricao: 'O Bruxo do Sangue firmou um pacto com forças que atravessam as fendas do Véu Trincado, próximas o bastante de Morvethra para manipular a força vital como moeda de troca. Diferente de um clérigo da morte, ele não venera o fim — ele barganha com a vida em si, sangrando poder de si mesmo e de outros para alimentar magias que nenhum grimório comum ensinaria. Cada feitiço tem um preço físico e visível, e ele aprendeu a considerar isso justo: nada realmente poderoso vem de graça. É o conjurador mais visceral e arriscado do Transcendente, ideal para quem gosta de magia com custo pessoal tangível.',
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
        descricao: 'O Arcanista da Deformação mergulhou fundo no Caos de Zyrhûn, o mesmo experimento cósmico que rachou o Véu e deu origem a Nythraxis. Ele descobriu que a matéria viva — moldada pelo sangue de Archëon que corre por todo Aetherion — não é fixa nem sagrada, mas um rascunho constantemente reescrevível para quem tem coragem e conhecimento profano suficientes. Suas magias distorcem carne, osso e forma com uma facilidade que perturba até outros conjuradores corrompidos. Ele não busca destruição pela destruição, mas pela curiosidade obsessiva de descobrir até onde a mutação pode ir. É o Transcendente mais perturbador visualmente, perfeito para campanhas com tons de horror corporal.',
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
        descricao: 'O Invocador do Abismo negocia diretamente através das fendas do Véu Trincado com as entidades antiquíssimas de Nythraxis — seres de intelectos incompreensíveis que enxergam o desespero mortal como um ímã e oferecem pactos em troca de preços bizarros. Este Transcendente não é ingênuo: sabe que está lidando com algo muito maior e mais estranho do que consegue compreender completamente, mas aprendeu a negociar com cuidado suficiente para extrair poder sem ser completamente consumido. Cada invocação carrega o risco real de que, um dia, o preço cobrado seja maior do que ele está disposto a pagar. É o conjurador mais perigoso e ambicioso do Transcendente, para quem gosta de flertar deliberadamente com forças além da compreensão mortal.',
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
        descricao: 'O Punho Relampejante canaliza Káryon Thraël, o Deus dos Céus e dos Trovões, criado para equilibrar os climas extremos de Pyraël e Nyxara mas que nunca abandonou a ira das tempestades em sua essência. Este Transcendente prefere ser o raio, não o trovão — o golpe instantâneo e decisivo, não o eco tardio que vem depois. Sua magia é rápida, elétrica e imprevisível, atingindo antes que o oponente processe o perigo. Ele evita conjurações lentas e ritualísticas, preferindo o impacto explosivo de um único momento bem escolhido. É o evocador mais direto e agressivo do Transcendente, ideal para quem quer dano mágico rápido e decisivo.',
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
        descricao: 'O Pactuante de Lyrëa firmou um acordo com a semideusa da beleza e dos espelhos, a mesma influência que deu origem à graça sobrenatural dos Sylphari. Diferente de um pacto sombrio e desesperado, este é um acordo elegante entre iguais que se respeitam: Lyrëa empresta poder feérico e criaturas aliadas, mas cobra favores específicos e caprichosos que só ela sabe articular. Este Transcendente aprendeu a navegar essa relação com charme e cautela, ciente de que uma fada nunca esquece uma dívida, mesmo que demore séculos para cobrá-la. É o conjurador mais gracioso e socialmente hábil do Transcendente, perfeito para quem quer magia feérica com sabor de conto de fadas ambíguo.',
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
        descricao: 'O Tecelão de Pactos serve Ordelyne, a Deusa da Ordem que nasceu para dar estrutura e regras ao mundo após o caos de Zyrhûn quase destruir tudo. Este Transcendente vê cada feitiço de suporte que lança sobre um aliado como um contrato implícito: proteção, força ou clareza concedidas em troca de confiança mútua, e ele sempre cumpre sua parte do acordo com rigor quase religioso. Não é um conjurador de dano direto, mas um mestre em tornar seus aliados mais capazes através de bênçãos arcanas cuidadosamente tecidas. É o Transcendente mais focado em equipe do grupo todo, ideal para quem quer jogar suporte mágico com identidade de "guardião de acordos".',
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
    descricao: 'Fala a língua que existia antes das palavras — a da terra, da fera e da tempestade. O Primordial não invoca a natureza, ele é uma extensão dela, canalizando os Quatro Ventos Dragônicos e o pulso bruto do mundo vivo em cada gesto.',
    hpInicial: 8,
    hpPorNivel: 3,
    atributoFoco: 'cos',
    atributosChave: ['cos', 'sab'],
    salvaguardas: ['cos', 'sab'],
    proficienciaArmas: ['Cajado', 'Foice', 'Lança', 'Adaga'],
    proficienciaArmadura: { tipos: ['leve', 'media'], escudo: false },
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
        descricao: 'O Tecelão de Archëon sente, mais intensamente que qualquer outro Primordial, o verdadeiro Motor do Mundo: a Terra viva reagindo, adaptando-se e criando bestas e criaturas de formas que nem os próprios deuses previram. Ele não venera Archëon como uma divindade distante e adormecida, mas como um processo contínuo do qual faz parte ativamente — cada planta que cresce sob sua influência, cada criatura que nasce perto dele, é uma pequena continuação daquele sonho original de criação. Ele se vê menos como conjurador e mais como colaborador de algo maior que ainda está sendo escrito. É o Primordial mais filosoficamente conectado à cosmologia fundamental de Aetherion.',
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
        descricao: 'O Invocador de Bestas segue a mesma influência gélida que molda Nyvelis, Guardiã das Terras Gélidas, aprendendo com a fauna selvagem um tipo de sabedoria que nenhum livro ensina. Ele acredita que os animais, sem a capacidade mortal de mentir ou fingir, enxergam o mundo com uma honestidade que os humanos perderam há muito tempo, e por isso dedica sua vida a se conectar com feras e vínculos animais em vez de rebanhos humanos. Sua fauna aliada não é domesticada por medo, mas por respeito mútuo genuíno. É o Primordial mais próximo do arquétipo clássico de senhor das feras, ideal para quem quer lutar ao lado de companheiros animais leais.',
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
        descricao: 'O Avatar dos Quatro Ventos canaliza simultaneamente Morvhaël, Sahryx, Aelthyr e Calýndor — os Quatro Ventos Dragônicos nascidos do último suspiro da consciência adormecida de Archëon, entidades primais que sopram o mundo até hoje e moldam a diversidade cultural e climática de todo Aetherion. Diferente de qualquer outro Primordial, ele não escolheu apenas um vento para seguir: aprendeu a deixar todos os quatro fluírem através de si, ora frio e silencioso, ora furioso e ardente, ora mutável, ora nostálgico. Essa amplitude tem um custo — ele nunca é completamente estável, sempre em fluxo entre extremos. É o Primordial mais elemental e imprevisível de todos, para quem quer jogar uma força da natureza literal.',
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
        descricao: 'O Senhor das Catástrofes canaliza o Caos de Zyrhûn através da própria natureza selvagem, entendendo destruição não como maldade gratuita, mas como parte necessária do ciclo de renovação do mundo vivo. Ele viu como a devastação da Guerra do Caos, por mais terrível que tenha sido, também abriu espaço para a Segunda Criação e o surgimento de novas raças e ecossistemas inteiros. Este Primordial provoca incêndios florestais, tempestades e erosões deliberadas, convencido de que às vezes é preciso queimar tudo para que algo novo consiga crescer. É o Primordial mais radical e assustador, para quem quer explorar destruição como força criativa em vez de vilania simples.',
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
        descricao: 'A Calamidade Telúrica combina o poder de Maelthra, a deusa que moldou o próprio globo de Aetherion, com a corrupção do Caos de Zyrhûn, tornando-se uma força geológica que carrega ressentimento acumulado por eras inteiras. Diferente do Escudo de Maelthra na Vanguarda, que representa a terra estável e protetora, este Primordial canaliza a terra como algo que se lembra — cada guerra travada sobre seu solo, cada floresta queimada, cada rio poluído durante a era de Zyrhûn. Ela não perdoa, e periodicamente escolhe cobrar essa dívida através de terremotos e falhas geológicas guiadas por vontade quase consciente. É o Primordial mais vingativo e implacável, para quem gosta da natureza como juíza implacável da história.',
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
        descricao: 'A Seiva de Verdarin canaliza a vida abundante que Elysséra semeou pelo mundo — a mesma deusa que sentiu ser o momento de povoar Aetherion com criaturas pensantes e capazes de criar histórias. Sua conexão espiritual ecoa a natureza dos Verdarin, o povo Dahllan intimamente ligado às florestas. Este Primordial entende cura de forma completamente orgânica: feridas não são tratadas com magia abstrata, mas com a mesma paciência regenerativa com que uma árvore fecha uma cicatriz na própria casca, com que uma floresta reconstrói o que o fogo destruiu. Ela vê cada ferimento como parte de um ciclo natural que a natureza sempre soube resolver, dado tempo e cuidado suficientes. É a curandeira mais gentil e paciente do Primordial, ideal para quem quer suporte de cura com identidade profundamente vegetal e maternal.',
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
        descricao: 'O Sangue de Lihzahrd carrega a herança direta dos Lihzahrd, a raça de lagartos que vive em tribos nos grandes pântanos, descendente dos Quatro Grandes Dragões que moldaram fisicamente o próprio continente de Aetherion. Cada indivíduo dessa linhagem nasce com afinidade para um poder distinto herdado do sangue dracônico — escuridão lunar, luz solar, sabedoria ancestral ou adaptação constante — e este Primordial ainda está descobrindo, através da transformação de sua própria forma física, qual dessas heranças realmente define quem ele é. Metamorfose, para ele, não é apenas combate: é uma jornada contínua de autodescoberta sobre uma identidade fragmentada entre quatro possibilidades dracônicas. É o Primordial mais versátil fisicamente, para quem quer explorar mutação de forma como tema central de personagem.',
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
        descricao: 'A Praga de Nythraxis nasceu do contato direto entre a natureza viva de Aetherion e a amálgama profana vazada através das fendas do Véu Trincado — o mesmo domínio fraturado que gerou aberrações após a Guerra do Caos. Este Primordial não controla pragas por maldade, mas as encarna como resposta natural a um mundo que, em algum lugar, adoeceu demais para se curar sozinho. Ele vê pântanos corrompidos e doenças místicas não como aberrações a exterminar, mas como sintomas de um desequilíbrio maior que precisa ser confrontado na raiz. Sua presença tende a incomodar tanto aliados quanto inimigos, já que carrega literalmente a decadência da terra em sua magia. É o Primordial mais sombrio e incompreendido, para quem gosta de horror biológico com camadas morais complexas.',
        pericias: ['ocultismo', 'exploracao'],
        // Trava 1: pragas místicas é tema explícito e literal de Mabryth.
        aspectoPadrao: 'teia_mabryth',
        afinidadesRaciais: [],
        habilidades: [],
      },
      guardiao_da_mare_cheia: {
        nome: 'Guardião da Maré Cheia',
        trilha: 'Equilibrada',
        recurso: 'Mácula',
        aliases: ['guardião da maré', 'xamã do eclipse', 'filho do ciclo'],
        citacao: 'A maré não pergunta se prefere subir ou descer. Ela só sabe que as duas coisas são a mesma água.',
        descricao: 'O Guardião da Maré Cheia serve a Lua de Nyxara, que governa marés e ciclos assim como um dia governa a noite, mantendo viva a mesma filosofia de equilíbrio que originou o eclipse forjado por Khaíros. Este Primordial nasce já conectado tanto ao Sopro quanto à Mácula, entendendo Puro e Corrompido não como um julgamento moral entre bem e mal, mas apenas como as duas fases naturais do mesmo ciclo — maré alta e maré baixa, a mesma água em movimentos opostos. Ele guia comunidades costeiras através das mudanças cíclicas do mundo, aceitando destruição e renovação como parceiras inevitáveis. É o Primordial mais filosoficamente maduro sobre dualidade, ideal para quem quer jogar equilíbrio genuíno sem cair em indecisão narrativa.',
        pericias: ['sintonia', 'ocultismo'],
        // Trava 1: Lua de Nyxara governa marés e ciclos — para o Primordial, Puro e
        // Corrompido não são um julgamento moral, são só as duas fases do mesmo ciclo
        // natural, como noite e dia, maré alta e baixa.
        aspectoPadrao: 'lua_nyxara',
        afinidadesRaciais: [],
        habilidades: [],
        // Trava de acesso à mecânica de Corromper/Purificar (V1.0, ver magias.js resolverSinergia).
        destravaSinergia: true,
        // Override da Trava 1 (aprendizado livre) — ver comentário equivalente em
        // catalogador_do_eclipse. Mesmo mecanismo: nasce com os 2 fixos, zero vagas livres.
        aspectosAprendizado: 0,
        aspectosIniciaisFixos: ['lua_nyxara', 'morte_morvethra'],
      },
    },
  },

};

// ─────────────────────────────────────────────────────────────────────────────
// CÁLCULO DE CLASSE DE ARMADURA (CA)
// ─────────────────────────────────────────────────────────────────────────────
// Regra do sistema:
//   Sem armadura equipada -> CA = CA_BASE + modDestreza
//   Com armadura          -> CA = valorArmadura + modDestreza
//   Com armadura + escudo -> CA = valorArmadura + valorEscudo + modDestreza
//
// `armadura` (opcional): { valor: number, tipo: 'leve'|'media'|'pesada' }
// `escudo`   (opcional): { valor: number }
// A função não valida proficiência — combine com podeUsarArmadura() abaixo
// antes de aplicar o item, se quiser impedir uso fora da proficiência da classe.
const CA_BASE = 10;

function calcularCA(modDestreza, armadura = null, escudo = null) {
  let ca = armadura ? armadura.valor : CA_BASE;
  if (escudo) ca += escudo.valor;
  ca += modDestreza;
  return ca;
}

// Verifica se uma classe (pela chave em classesRPG, ex: 'vanguarda') pode
// usar um tipo de armadura ('leve'|'media'|'pesada') e/ou escudo.
function podeUsarArmadura(classeKey, tipoArmadura = null, comEscudo = false) {
  const classe = classesRPG[classeKey];
  if (!classe || !classe.proficienciaArmadura) return false;
  const prof = classe.proficienciaArmadura;
  if (tipoArmadura && !prof.tipos.includes(tipoArmadura)) return false;
  if (comEscudo && !prof.escudo) return false;
  return true;
}

// Anexa as funções utilitárias de CA ao próprio objeto classesRPG, mantendo
// retrocompatibilidade total com quem já faz `const classesRPG = require('./classes.js')`.
classesRPG.calcularCA = calcularCA;
classesRPG.podeUsarArmadura = podeUsarArmadura;
classesRPG.CA_BASE = CA_BASE;

// Exportação condicional: compatível com script tag (global) e CommonJS (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = classesRPG;
}
// Garante visibilidade global quando carregado via <script> no browser
if (typeof window !== 'undefined') {
  window.classesRPG = classesRPG;
}
