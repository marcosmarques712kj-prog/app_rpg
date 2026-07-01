// origens.js — Aetherion RPG System
// 38 Origens Oficiais | Gerado conforme instrucoes_claude_origens_completo.md
//
// REGRA DE TOLERÂNCIA DE DUPLICIDADE (Flexibilidade Temática):
// Se o jogador escolher uma Origem cujo poolPericias sobreponha uma perícia já
// treinada pela Classe, o sistema NÃO trava nem bloqueia. A interface oferece
// amigavelmente a opção de substituição, mas se o jogador confirmar a duplicidade
// por escolha narrativa, a engine aceita e cria o personagem normalmente.

const origensRPG = {

  // ───────────────────────────────────────────────────────────────────────────
  // ⚔️ BLOCO 1: MARCIAIS E COMBATE
  // ───────────────────────────────────────────────────────────────────────────

  soldado: {
    nome: 'Soldado',
    aliases: ['militar', 'veterano', 'combatente', 'infantaria', 'guarda'],
    citacao: 'Quem protege os muros aprende que a disciplina militar vale muito mais do que a bravura cega.',
    poolPericias: ['atletismo', 'fortitude', 'tatica', 'percepcao'],
    interacaoMecanica: 'Quando usar o recurso Sopro da Criação para mitigar dano de um aliado, você recupera +1 PV na carne.',
    tracoNarrativo: 'Reconhece patentes, sinais táticos e formações militares. NPCs da guarda tendem a respeitá-lo e colaborar com ordens simples sem questionamentos.',
  },

  mercenario: {
    nome: 'Mercenário',
    aliases: ['espadachim de aluguel', 'contratado', 'lança livre', 'pistoleiro'],
    citacao: 'Eu não luto por reinos, deuses ou ideais. Eu luto pelo tilintar do ouro. E o meu preço é alto.',
    poolPericias: ['tatica', 'atletismo', 'malandragem', 'discernimento'],
    interacaoMecanica: 'Mestre em contratos. Você recebe +10% de moedas ou recompensas financeiras ao concluir missões acordadas contratualmente.',
    tracoNarrativo: 'Conhece os códigos de honra das guildas de mercenários e avalia se um NPC está ocultando perigos em um trabalho antes de assinar qualquer acordo.',
  },

  gladiador: {
    nome: 'Gladiador',
    aliases: ['arena', 'lutador', 'campeão da arena', 'combatente espetáculo'],
    citacao: 'Nas Arenas de Ferro, não há espaço para sutilezas. Ou você quebra o escudo dele, ou ele abre seu crânio.',
    poolPericias: ['atletismo', 'fortitude', 'intimidacao', 'acrobacia'],
    interacaoMecanica: 'Quando estiver desarmado ou usando armas improvisadas de cenário (cadeiras, barras), seus ataques corporais causam +1 de dano bruto.',
    tracoNarrativo: 'Suas marcas físicas chamam a atenção imediata. Organizadores de apostas clandestinas e capangas urbanos reconhecem sua fama e reagem com cautela ou interesse.',
  },

  carrasco: {
    nome: 'Carrasco',
    aliases: ['executor', 'algoz', 'verdugo', 'punidor', 'lâmina da lei'],
    citacao: 'O metal da lâmina é frio, mas o meu coração precisou ficar ainda mais frio para fazer o trabalho que ninguém queria.',
    poolPericias: ['intimidacao', 'fortitude', 'atletismo', 'socorrismo'],
    interacaoMecanica: 'Olhar gélido. Uma vez por cena, usa uma Ação Bônus para forçar um inimigo adjacente a rolar um teste de Vontade (CD 12). Se falhar, o alvo fica Abalado por 1 turno.',
    tracoNarrativo: 'Conhece a anatomia mortal (matar rápido ou prolongar a dor). NPCs comuns sentem um desconforto instintivo e tendem a ceder antes de confrontar diretamente.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 👣 BLOCO 2: URBANOS E SUBMUNDO
  // ───────────────────────────────────────────────────────────────────────────

  filho_ruas: {
    nome: 'Filho das Ruas',
    aliases: ['criança de rua', 'pivete', 'malandro urbano', 'sobrevivente da sarjeta'],
    citacao: 'As leis dos palácios não alimentam ninguém nas sarjetas. Aqui embaixo, ou você é rápido ou vira estatística.',
    poolPericias: ['furtividade', 'percepcao', 'malandragem', 'ladinagem'],
    interacaoMecanica: 'Uma vez por cena de combate ou perseguição, pode usar sua Ação Bônus para sumir em multidões urbanas ou becos escuros (se houver cobertura leve), quebrando linha de visão sem rolar dados.',
    tracoNarrativo: 'Conhece as engrenagens criminosas, mercados negros, gírias secretas de gangues e rotas de fuga através de esgotos e ruelas esquecidas.',
  },

  criminoso: {
    nome: 'Criminoso',
    aliases: ['bandido', 'fora-da-lei', 'infrator', 'contraventor'],
    citacao: 'A lei diz que sou um monstro. Eu digo que sou apenas um sujeito que atende à demanda de mercados que o rei proíbe.',
    poolPericias: ['malandragem', 'enganacao', 'furtividade', 'ladinagem'],
    interacaoMecanica: 'Contrabandista nato. Consegue esconder pequenos itens (adagas, poções) no corpo perfeitamente; guardas falham em revistá-lo passivamente sem uma ordem específica superior.',
    tracoNarrativo: 'Possui contatos ativos com o Mercado Negro e receptadores de carga roubada em grandes portos e capitais do Pacto dos Três Imperadores.',
  },

  charlatao: {
    nome: 'Charlatão',
    aliases: ['vigarista', 'enganador', 'vendedor ambulante', 'falsário'],
    citacao: 'Este frasco contém o elixir milagroso da Torre Mágica! Cura pestes, espanta monstros... e custa apenas duas moedas!',
    poolPericias: ['enganacao', 'malandragem', 'artificio', 'discernimento'],
    interacaoMecanica: 'Mestre da falsificação. Pode gastar 10 minutos para falsificar assinaturas ou salvo-condutos. A CD de Investigação para NPCs descobrirem a farsa é igual a 10 + sua Inteligência + seu nível de personagem.',
    tracoNarrativo: 'Detecta trapaças, jogos de azar viciados e blefes de NPCs instantaneamente, pois passou a vida usando esses truques contra outros.',
  },

  desertor: {
    nome: 'Desertor',
    aliases: ['fujão', 'renegado militar', 'traidor da farda', 'soldado fugitivo'],
    citacao: 'Eles me ordenaram queimar aquela vila cheia de inocentes. Naquela noite, joguei meu brasão na lama e comecei a correr.',
    poolPericias: ['furtividade', 'vontade', 'exploracao', 'enganacao'],
    interacaoMecanica: 'Instinto de fuga. Uma vez por sessão, se o grupo sofrer uma emboscada ou você falhar na Iniciativa, você ignora a rodada de surpresa e age normalmente no primeiro turno.',
    tracoNarrativo: 'Sabe ler cartazes de procurado, evitar patrulhas de estrada oficiais e criar disfarces rápidos para burlar vigilâncias militares em postos de controle.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // ⚙️ BLOCO 3: ACADÊMICOS E PROFISSIONAIS
  // ───────────────────────────────────────────────────────────────────────────

  sabio: {
    nome: 'Sábio',
    aliases: ['estudioso', 'erudito', 'intelectual', 'pesquisador', 'acadêmico'],
    citacao: 'Reinos caem e deuses silenciam, mas o conhecimento registrado nos pergaminhos permanece eterno.',
    poolPericias: ['arcanismo', 'legado', 'teologia', 'investigacao'],
    interacaoMecanica: 'Consulta rápida. Uma vez por descanso longo, pode gastar 1 Sopro para decifrar uma runa antiga ou fazer uma pergunta direta de lore histórico ou místico ao Mestre, que é obrigado a responder com precisão.',
    tracoNarrativo: 'Possui autoridade e trânsito livre em bibliotecas, arquivos históricos e guildas acadêmicas oficiais do Pacto dos Três Imperadores.',
  },

  investigador: {
    nome: 'Investigador',
    aliases: ['detetive', 'inspetor', 'analista criminal', 'xerife'],
    citacao: 'A noite esconde os crimes mais sórdidos e as bizarrices do Véu. Meu trabalho começa quando as luzes apagam.',
    poolPericias: ['investigacao', 'percepcao', 'discernimento', 'tatica'],
    interacaoMecanica: 'Olho clínico. Durante cenas de busca ou perícia em cenários, gasta apenas 1 turno analisando o local para notar se algo foi alterado de propósito, sem precisar rolar dados.',
    tracoNarrativo: 'Conhece burocracias criminais, oficiais da lei e carcereiros. Sabe interrogar testemunhas nervosas com precisão sem recorrer à violência física.',
  },

  curandeiro: {
    nome: 'Curandeiro',
    aliases: ['médico', 'boticário', 'enfermeiro', 'ervanário', 'físico'],
    citacao: 'As poções arcanas são caras demais para os pobres. Uma folha esmagada de Raiz do Motor e uma boa agulha salvam mais vidas do que orações.',
    poolPericias: ['socorrismo', 'artificio', 'discernimento', 'investigacao'],
    interacaoMecanica: 'Quando usar a perícia Socorrismo para estabilizar um aliado Moribundo (0 PV) e passar no teste, o aliado estabiliza e recupera instantaneamente 1 PV em vez de continuar desmaiado.',
    tracoNarrativo: 'Reconhece sintomas de venenos, contaminações biológicas e pestes à primeira vista. Farmas e boticários compartilham estoques de ervas com você sem cobrança.',
  },

  artesao: {
    nome: 'Artesão',
    aliases: ['ferreiro', 'carpinteiro', 'forjador', 'manufatureiro', 'habilidoso'],
    citacao: 'Dê-me uma bigorna quente, um martelo Durkhar e um pedaço de aço... e eu dobro a realidade ao meu comando.',
    poolPericias: ['artificio', 'investigacao', 'percepcao', 'atletismo'],
    interacaoMecanica: 'Manutenção rápida. Durante um Descanso Curto, você conserta um item, escudo ou armadura danificada do grupo sem custos ou gastos de recursos materiais.',
    tracoNarrativo: 'Avalia falhas estruturais de equipamentos mecânicos à primeira vista. Membros da Guilda dos Ferreiros o tratam como colega de profissão e oferecem descontos automáticos.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🌿 BLOCO 4: SOBREVIVENTES E VIAJANTES
  // ───────────────────────────────────────────────────────────────────────────

  cacador: {
    nome: 'Caçador',
    aliases: ['rastreador', 'caçador de presas', 'mateiro', 'batedores de mato'],
    citacao: 'O sangue corrompido deforma as feras do mato. Se você não souber ler os rastros, virará a presa antes de puxar a corda do arco.',
    poolPericias: ['percepcao', 'exploracao', 'adestramento', 'atletismo'],
    interacaoMecanica: 'Estudo de presa. Ao desferir ataques contra monstros ou criaturas biológicas que você ou o grupo já rastrearam ou estudaram antes, soma +1 de dano bruto na rolagem.',
    tracoNarrativo: 'Identifica marcas de território, pelos, pegadas e restos biológicos de monstros mutantes à distância, deduzindo hábitos alimentares e rotas de patrulha.',
  },

  eremita: {
    nome: 'Eremita',
    aliases: ['anacoreta', 'solitário', 'recluso', 'asceta da natureza'],
    citacao: 'O Motor do Mundo pulsa forte no silêncio da terra viva. O isolamento ensina verdades que nenhum mestre de cidade compreende.',
    poolPericias: ['adaptacao', 'sintonia', 'percepcao', 'vontade'],
    interacaoMecanica: 'Meditação isolada. Ao fazer um Descanso Curto em locais de natureza intocada ou fendas puras de Sopro, você recupera +1 Sopro da Criação adicional além do valor padrão.',
    tracoNarrativo: 'Nota flutuações e reações instintivas na natureza como mudanças de vento ou tremores leves no solo. O Mestre concede pistas ambientais intuitivas durante a exploração.',
  },

  nomade: {
    nome: 'Nômade',
    aliases: ['andarilho', 'errante', 'viajante sem lar', 'clã nômade'],
    citacao: 'Morvhaël traz o gelo e Sahryx a fúria do fogo. Corremos mais rápido que os Quatro Ventos Dragônicos desde o nosso nascimento.',
    poolPericias: ['adaptacao', 'exploracao', 'acrobacia', 'sintonia'],
    interacaoMecanica: 'Pele calejada. Ganha imunidade passiva a penalidades de fadiga, exaustão ou lentidão causadas estritamente por climas extremos do ambiente como nevascas ou calor vulcânico.',
    tracoNarrativo: 'Prevê mudanças climáticas com horas de antecedência. Tribos nômades e clãs isolados o enxergam com simpatia natural e oferecem abrigo sem pedir favores.',
  },

  marinheiro: {
    nome: 'Marinheiro',
    aliases: ['navegador', 'marujo', 'lobo do mar', 'tripulante'],
    citacao: 'As brumas do oceano escondem coisas muito piores que os piratas. Se o mar ruge, você obedece ou afunda com o convés.',
    poolPericias: ['atletismo', 'adaptacao', 'exploracao', 'intimidacao'],
    interacaoMecanica: 'Equilíbrio náutico. Ganha Vantagem em testes atléticos para nadar ou se equilibrar em estruturas instáveis como conveses em tempestade, e é imune a enjoo náutico.',
    tracoNarrativo: 'Domina cartografia náutica, nós de corda e marés. Sabe recrutar tripulações e localizar tabernas portuárias decadentes onde informações fluem livremente.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🗣️ BLOCO 5: SOCIAIS E INFLUÊNCIA
  // ───────────────────────────────────────────────────────────────────────────

  nobre: {
    nome: 'Nobre',
    aliases: ['aristocrata', 'fidalgo', 'lordes', 'conde', 'visconde'],
    citacao: 'Eles queimaram meu brasão e tomaram minhas terras. Mas a postura de governar... essa eles nunca conseguirão me roubar.',
    poolPericias: ['diplomacia', 'tatica', 'investigacao', 'intimidacao'],
    interacaoMecanica: 'Postura aristocrática. Em interações sociais formais, ganha Vantagem em testes de Diplomacia ou Intimidação ao lidar diretamente com autoridades civis ou nobres de menor influência.',
    tracoNarrativo: 'Domina heráldica, linhagens aristocráticas e etiqueta da corte. Sabe agir com autoridade inata, fazendo plebeus hesitarem antes de desobedecê-lo publicamente.',
  },

  artista: {
    nome: 'Artista',
    aliases: ['bardo', 'músico', 'ator', 'pintor', 'escultor', 'performático'],
    citacao: 'As baladas antigas do Pacto ganham vida quando toco estas cordas. O povo comum precisa de arte para esquecer o medo do Véu.',
    poolPericias: ['tradicao', 'diplomacia', 'enganacao', 'percepcao'],
    interacaoMecanica: 'Alívio mental. Durante um descanso longo, sua performance artística faz com que todos os aliados que ouvirem recuperem +1 ponto de Sanidade perdida.',
    tracoNarrativo: 'Conhece o folclore local, cantigas populares e boatos urbanos. Donos de tabernas oferecem estadia gratuita em troca de shows noturnos.',
  },

  taverneiro: {
    nome: 'Taverneiro',
    aliases: ['estalajadeiro', 'hospedeiro', 'barman', 'dono de taverna'],
    citacao: 'Passei anos servindo hidromel, limpando sangue de brigas e ouvindo confissões de homens bêbados. Sei ler uma pessoa antes dela abrir a boca.',
    poolPericias: ['diplomacia', 'discernimento', 'tradicao', 'malandragem'],
    interacaoMecanica: 'Diplomacia de balcão. Uma vez por cena social, pode gastar 1 Sopro para acalmar os ânimos de um NPC hostil comum, forçando-o a escutar o grupo por uma rodada completa antes de atacar.',
    tracoNarrativo: 'Mestre em captar fofocas e sussurros urbanos. Sempre conhece os donos de estalagens locais em qualquer cidade, conseguindo estadias baratas ou informações privilegiadas.',
  },

  peregrino: {
    nome: 'Peregrino',
    aliases: ['romeiro', 'viajante da fé', 'devoto itinerante', 'caminhante sagrado'],
    citacao: 'A estrada poeirenta é meu verdadeiro templo. Minha oração é caminhar sob o olhar atento do Panteão.',
    poolPericias: ['diplomacia', 'discernimento', 'teologia', 'tradicao'],
    interacaoMecanica: 'Fé militante. Quando usar uma habilidade para curar ou proteger um aliado com menos de 50% dos PV máximos, a eficácia do efeito aumenta em +2.',
    tracoNarrativo: 'Templos e igrejas oficiais reconhecem seu status sagrado itinerante. Oferecem abrigo, água limpa e rações de viagem gratuitamente sem exigir contrapartida.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🕳️ BLOCO 6: HORROR E TRAUMA
  // ───────────────────────────────────────────────────────────────────────────

  ex_cultista: {
    nome: 'Ex-Cultista',
    aliases: ['ex-sectário', 'desertor de seita', 'herege arrependido', 'apóstata'],
    citacao: 'Fiz parte daquela seita. Sussurrei heresias para as fissuras do Véu. Eu vi o fim de todas as coisas... e consegui fugir antes que arrancassem minha alma.',
    poolPericias: ['ocultismo', 'vontade', 'enganacao', 'furtividade'],
    interacaoMecanica: 'Conhecimento mórbido. Ao rolar testes de Vontade para resistir a perder Sanidade contra monstros de Nythraxis, pode gastar +1 ponto de Mácula intencionalmente para rolar o teste com Vantagem.',
    tracoNarrativo: 'Reconhece rituais, insígnias secretas e esconderijos ocultistas com facilidade assustadora. Membros ativos de seitas caçam você ferozmente como um traidor imundo.',
  },

  vitima: {
    nome: 'Vítima',
    aliases: ['sobrevivente', 'traumatizado', 'marcado pelo horror', 'remanescente'],
    citacao: 'Minha vila inteira foi devorada pelas Crias de Nythraxis. Eu me escondi embaixo dos corpos frios dos meus irmãos. Eu sobrevivi, mas parte de mim ficou naquele fosso.',
    poolPericias: ['vontade', 'percepcao', 'ocultismo', 'fortitude'],
    interacaoMecanica: 'Adrenalina do pânico. Na primeira vez em um combate que sofrer dano na Sanidade ou ficar sob uma condição de medo, ganha instantaneamente +1,5m de deslocamento por 2 rodadas.',
    tracoNarrativo: 'Carrega tremores, tiques nervosos ou pesadelos brutais. Animais e NPCs dotados de sensibilidade notam que sua mente está fragilizada e reagem com cautela e compaixão involuntária.',
  },

  ex_escravo: {
    nome: 'Ex-Escravo',
    aliases: ['liberto', 'alforriado', 'escravo fugido', 'emancipado'],
    citacao: 'Eles nos acorrentaram perto das fendas para extrair cristais de Sopro. Muitos enlouqueceram. Eu usei os elos partidos para quebrar o pescoço do feitor.',
    poolPericias: ['fortitude', 'vontade', 'furtividade', 'atletismo'],
    interacaoMecanica: 'Corpo resiliente. Anos carregando grilhões pesados geraram resiliência muscular única: possui Vantagem em testes de Fortitude ou Atletismo para escapar de amarras, algemas ou redes.',
    tracoNarrativo: 'Possui marcas profundas de correntes nos pulsos visíveis a qualquer olhar atento. Outros ex-escravos e oprimidos confiam em você silenciosamente, oferecendo esconderijos seguros.',
  },

  campones: {
    nome: 'Camponês',
    aliases: ['agricultor', 'lavrador', 'servo da terra', 'trabalhador rural'],
    citacao: 'O trigo não quer saber das brigas dos imperadores ou dos magos. Ele só precisa de terra firme e suor humano para brotar.',
    poolPericias: ['fortitude', 'atletismo', 'adaptacao', 'adestramento'],
    interacaoMecanica: 'Estamina bruta. O trabalho físico exaustivo da enxada calejou seu corpo: você ignora o primeiro nível de penalidade física causado por exaustão ou fadiga mundana.',
    tracoNarrativo: 'O povo simples das fazendas e vilas rurais confia em você imediatamente sem reservas. Animais domésticos ou de tração raramente atacam você sem um motivo extremo.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🔮 BLOCO 7: CONEXÕES COM A LORE DE AETHERION
  // ───────────────────────────────────────────────────────────────────────────

  iniciado: {
    nome: 'Iniciado',
    aliases: ['aprendiz de mago', 'ex-aluno da torre', 'assistente arcano', 'expulso'],
    citacao: 'Você entrou para a influente guilda da Torre Mágica, mas nunca passou de um assistente de laboratório. Expulso, mas com anos respirando poeira de grimórios.',
    poolPericias: ['arcanismo', 'investigacao', 'artificio', 'tradicao'],
    interacaoMecanica: 'Alfabetizado no Véu. Uma vez por cena, pode rolar um teste de Arcanismo para identificar instantaneamente as propriedades de uma runa ou o efeito de uma poção sem gastar Sopro.',
    tracoNarrativo: 'Conhece os maneirismos e a burocracia interna da Torre Mágica. Aprendizes e guardas da guilda aceitam trocar informações com você mais facilmente do que com estranhos.',
  },

  prospector: {
    nome: 'Prospector',
    aliases: ['minerador', 'garimpeiro', 'extrator de sopro', 'mineiro de cristal'],
    citacao: 'O sangue de Archëon gera veios de energia que se cristalizam no subsolo. Meu trabalho era me enfiar em cavernas instáveis para minerar Cristais de Sopro.',
    poolPericias: ['atletismo', 'fortitude', 'exploracao', 'percepcao'],
    interacaoMecanica: 'Olho para o Sopro. Possui intuição geológica única: ganha +2 passivo em testes de Percepção ou Exploração para detectar desabamentos iminentes ou gases subterrâneos venenosos.',
    tracoNarrativo: 'Conhece o valor de mercado de minérios brutos e pedras. Tem grande facilidade para negociar com mineiros e anões Durkhar das Profundezas, sendo tratado como igual.',
  },

  esquecido: {
    nome: 'Esquecido',
    aliases: ['apagado', 'invisível', 'sem registro', 'tocado pelos feyrin'],
    citacao: 'Você foi tocado pela névoa do vento Calýndor ou cruzou o caminho de um Feyrin rancoroso. O resultado? O mundo esqueceu que você existe; seus registros sumiram.',
    poolPericias: ['vontade', 'sintonia', 'furtividade', 'tradicao'],
    interacaoMecanica: 'Presença nula. Uma vez por cena de furtividade, se falhar em um teste contra um guarda comum, pode forçá-lo a rolar Percepção com Desvantagem — pois a realidade reluta em reconhecê-lo.',
    tracoNarrativo: 'Não possui pátria ou laços civis registrados. Os Feyrin e criaturas ligadas à memória coletiva sentem afinidade por você, permitindo-lhe ouvir sussurros em objetos antigos.',
  },

  emissario: {
    nome: 'Emissário',
    aliases: ['embaixador', 'diplomata', 'mensageiro do pacto', 'enviado oficial'],
    citacao: 'Manter a paz entre três impérios gigantescos exige diplomatas treinados. Entrei em cortes entregando decretos e negociando tréguas sob a capa de embaixador.',
    poolPericias: ['diplomacia', 'discernimento', 'legado', 'enganacao'],
    interacaoMecanica: 'Imunidade diplomática. Quando estiver portando mensagens oficiais ou selos de guildas do Pacto, guardas civis comuns não podem prender ou revistar você ou seu grupo sem uma ordem direta de um Marechal.',
    tracoNarrativo: 'Domina heráldica, a geopolítica atual dos Três Imperadores e segredos das cortes. Sabe se portar diante de reis e generais sem cometer gafes diplomáticas custosas.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 👑 BLOCO 8: ELITES E PODER CIVIL
  // ───────────────────────────────────────────────────────────────────────────

  cortesao: {
    nome: 'Cortesão',
    aliases: ['áulico', 'palatino', 'conselheiro real', 'intrigante de corte'],
    citacao: 'Passei a vida inteira trancado nos salões aristocráticos. Sobrevivi em um ninho de cobras onde um sussurro errado custa a vida e um boato derruba um ducado.',
    poolPericias: ['enganacao', 'diplomacia', 'discernimento', 'tradicao'],
    interacaoMecanica: 'Ler o Salão. Após observar NPCs em ambiente social por 1 minuto, o Mestre deve revelar em segredo quem é a pessoa mais influente ali e qual sua fraqueza social dominante (orgulho, ganância ou medo).',
    tracoNarrativo: 'Mestre em etiquetas de alto nível, reconhece venenos sutis em taças e sabe como plantar fofocas políticas que se espalham por cidades inteiras em questão de dias.',
  },

  burgues: {
    nome: 'Burguês',
    aliases: ['comerciante rico', 'mercador abastado', 'empresário', 'capitalista'],
    citacao: 'Você não tem uma gota de sangue azul, mas tem algo que os nobres falidos mais cobiçam: ouro. Você vê o mundo como uma planilha de lucros e sabe que tudo tem um preço.',
    poolPericias: ['diplomacia', 'malandragem', 'discernimento', 'investigacao'],
    interacaoMecanica: 'Financiamento Inicial. O personagem inicia o jogo com capital financeiro bônus substancial. Sabe calcular o valor exato do suborno necessário para fazer fiscais de alfândega e guardas fazerem vista grossa.',
    tracoNarrativo: 'Possui cartas de crédito ativas com os maiores bancos do Pacto. Nobres endividados relutam em tratá-lo mal devido a pendências financeiras com sua família.',
  },

  acolito: {
    nome: 'Acólito',
    aliases: ['subdiácono', 'ajudante da igreja', 'clérigo menor', 'servente eclesiástico'],
    citacao: 'Passei anos trancado nos escritórios e monastérios da Igreja dos Oito Deuses, coletando o dízimo e organizando relatórios. Conheço o lado burocrático da fé.',
    poolPericias: ['teologia', 'legado', 'investigacao', 'discernimento'],
    interacaoMecanica: 'Requisição Eclesiástica. Uma vez por descanso longo, ao visitar uma capela ou posto da igreja em qualquer cidade, pode requisitar um suprimento menor sagrado ou comum (água benta, incensos) gratuitamente.',
    tracoNarrativo: 'Conhece os dogmas, segredos clericais internos e as rivalidades das ordens religiosas. Sacerdotes de nível baixo temem sua possível influência junto aos Bispos.',
  },

  operario: {
    nome: 'Operário',
    aliases: ['trabalhador fabril', 'operador de máquinas', 'forjador industrial'],
    citacao: 'As grandes forjas Durkhar exigem milhares de braços. Passei a vida em fábricas escuras, respirando fuligem e operando maquinários sob as ordens de mestres ferreiros.',
    poolPericias: ['artificio', 'atletismo', 'fortitude', 'percepcao'],
    interacaoMecanica: 'Costas Calejadas. Esforço físico industrial contínuo expandiu sua capacidade de carga: você consegue carregar +2 slots de itens de volume no inventário sem sofrer penalidades de sobrecarga.',
    tracoNarrativo: 'Facilidade extrema para lidar com a classe trabalhadora urbana. Conhece o funcionamento técnico e sabe como consertar ou sabotar caldeiras, elevadores e guindastes industriais.',
  },

  foragido: {
    nome: 'Foragido',
    aliases: ['evadido', 'fugitivo da prisão', 'escapado', 'preso fujão'],
    citacao: 'Diferente dos criminosos comuns, eu fui pego. Passei anos trancado nas masmorras imperiais de segurança máxima antes de arquitetar minha fuga. Meu nome continua manchado.',
    poolPericias: ['ladinagem', 'furtividade', 'atletismo', 'intimidacao'],
    interacaoMecanica: 'Casca de Prisão. Sobreviver ao cárcere ensinou resiliência biológica extrema: ganha +2 em testes de Fortitude para resistir a infecções de ferimentos sujos ou venenos biológicos degradados.',
    tracoNarrativo: 'Carrega marcas de chicote e tatuagens prisionais visíveis. Reconhece outros ex-detentos pelo olhar e domina plantas arquitetônicas de carceragens, facilitando infiltrações planejadas.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🔍 BLOCO 9: INVESTIGAÇÃO AVANÇADA E MISCELÂNEA
  // ───────────────────────────────────────────────────────────────────────────

  amnesico: {
    nome: 'Amnésico',
    aliases: ['sem memória', 'esquecido de si', 'tabula rasa', 'memória apagada'],
    citacao: 'Acordei em uma sarjeta perto de uma fenda do Véu sem lembrar do meu próprio nome. Tenho flashes de memórias bizarras e cicatrizes que não sei como ganhei.',
    poolPericias: ['vontade', 'discernimento', 'percepcao', 'sintonia'],
    interacaoMecanica: 'Memória muscular. Uma vez por descanso longo, ao rolar um teste de perícia na qual NÃO é treinado, gasta 1 Sopro para ter um vislumbre e rolar o teste com Vantagem (sua carne lembra quando sua mente não lembra).',
    tracoNarrativo: 'Sem passado legal registrado. O Mestre ganha total liberdade para introduzir figuras misteriosas do passado que amam ou caçam o personagem, servindo como motor narrativo da campanha.',
  },

  perseguidor: {
    nome: 'Perseguidor',
    aliases: ['caçador de recompensas', 'bounty hunter', 'rastreador humano', 'cobrador'],
    citacao: 'O Caçador rastreia feras na mata; meu trabalho é caçar pessoas. Fui contratado por nobres e gangues para trazer de volta devedores, fugitivos e assassinos.',
    poolPericias: ['percepcao', 'exploracao', 'investigacao', 'intimidacao'],
    interacaoMecanica: 'Olhar do predador. Ao focar em um alvo humanoide visível no início do combate gastando sua Ação Bônus, ganha +1,5m de deslocamento quando se mover na direção exata desse alvo.',
    tracoNarrativo: 'Lê com precisão a linguagem corporal de indivíduos nervosos tentando mentir ou fugir. Sabe colher pistas no submundo urbano e acionar informantes com pagamentos mínimos.',
  },

  capanga: {
    nome: 'Capanga',
    aliases: ['guarda-costas', 'músculo', 'cobrador de dívidas', 'segurança particular'],
    citacao: 'Fui o músculo privado de tabernas decadentes e cobrador da Guilda Mercantil. Meu trabalho era quebrar pernas de quem não pagava e servir de escudo de carne pro chefe.',
    poolPericias: ['atletismo', 'intimidacao', 'fortitude', 'malandragem'],
    interacaoMecanica: 'Truculência urbana. Ao realizar com sucesso uma ação de Agarrar ou Empurrar contra um inimigo usando Atletismo, o alvo sofre a condição Lento até o fim do próximo turno dele.',
    tracoNarrativo: 'Gangues urbanas menores e criminosos de rua reconhecem sua postura perigosa e evitam brigas fúteis. Sabe avaliar de relance o vigor físico e a experiência de combate de guardas civis.',
  },

  pescador: {
    nome: 'Pescador',
    aliases: ['pescador artesanal', 'trabalhador do mar', 'rede e anzol', 'ribeirinho'],
    citacao: 'Fui um humilde trabalhador de águas calmas e mares violentos. Passei a vida em barcos puxando redes pesadas sob o frio dos Ventos Dragônicos para sustentar minha família.',
    poolPericias: ['adaptacao', 'atletismo', 'percepcao', 'exploracao'],
    interacaoMecanica: 'Paciência de pescador. Reflexos afinados para fisgar no milissegundo exato: possui Vantagem em testes para agarrar objetos em movimento rápido como cordas ou armas jogadas, e para coletar comida em rios.',
    tracoNarrativo: 'Sabe ler correntes aquáticas, prever redemoinhos e identificar comportamento territorial de monstros marinhos. Comunidades costeiras o acolhem com hospitalidade imediata e sem suspeitas.',
  },

  herdeiro: {
    nome: 'Herdeiro',
    aliases: ['legatário', 'herdeiro misterioso', 'novo proprietário', 'destinatário de herança'],
    citacao: 'Recebi uma herança inesperada de um parente distante que mal conhecia: uma propriedade abandonada caindo aos pedaços na periferia e um diário criptografado tenebroso.',
    poolPericias: ['diplomacia', 'legado', 'investigacao', 'tradicao'],
    interacaoMecanica: 'Legado de família. Inicia o jogo portando um artefato sem valor de venda (relógio que gira ao contrário, diário misterioso). Uma vez por sessão, gasta 1 Sopro para interagir com o item e ganhar uma pista narrativa sobre o mistério atual.',
    tracoNarrativo: 'Advogados, cartórios e juízes do Pacto reconhecem seus direitos civis sobre a herança. Contudo, cobradores estranhos e seitas ocultistas podem estar vigiando seus passos para roubar o artefato.',
  },

};

// Exportação condicional: compatível com script tag (global) e CommonJS (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = origensRPG;
}
