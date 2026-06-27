// =============================================================
// GRIMÓRIO — Banco de Magias D&D 5ª Edição (PT-BR)
// -------------------------------------------------------------
// Cobertura atual: Truques (nível 0) até magias de 5º círculo.
// Isso abrange a faixa de personagens de nível 1 a ~10, que é
// onde a maioria das mesas joga a maior parte do tempo.
//
// Formato de cada magia:
//   nome, nivel (0-9), escola, classes [...], tempo, alcance,
//   componentes, material (ou null), duracao, concentracao (bool),
//   ritual (bool), desc (texto resumido, mostrado só ao expandir)
//
// Para adicionar novas magias depois, basta seguir o mesmo
// formato e inserir no array MAGIAS.
// =============================================================

const ESCOLAS = {
  abjuracao:    { nome: 'Abjuração',    cor: '#4A6AAF' },
  adivinhacao:  { nome: 'Adivinhação',  cor: '#C9A84C' },
  conjuracao:   { nome: 'Conjuração',   cor: '#8B3A00' },
  encantamento: { nome: 'Encantamento', cor: '#A02060' },
  evocacao:     { nome: 'Evocação',     cor: '#A02020' },
  ilusao:       { nome: 'Ilusão',       cor: '#6A3FA0' },
  necromancia:  { nome: 'Necromancia',  cor: '#3A6A3A' },
  transmutacao: { nome: 'Transmutação', cor: '#1BBFB5' }
};

const CLASSES_MAGIA = ['Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Mago','Paladino','Patrulheiro'];

const MAGIAS = [

// =============================== TRUQUES (NÍVEL 0) ===============================
{
  nome: 'Amizade', nivel: 0, escola: 'encantamento', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Pela duração, você tem vantagem em testes de Carisma feitos contra uma criatura não-hostil. Quando a magia termina, a criatura percebe que foi influenciada magicamente e pode ficar hostil em relação a você.'
},
{
  nome: 'Ataque Certeiro', nivel: 0, escola: 'adivinhacao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'S', material: null,
  duracao: 'Concentração, até 1 rodada', concentracao: true, ritual: false,
  desc: 'Você aponta um dedo para um alvo dentro do alcance, ganhando uma compreensão mística de suas defesas. Na próxima vez que você acertar a criatura com uma jogada de ataque antes do fim do seu próximo turno, você tem vantagem na primeira jogada de ataque.'
},
{
  nome: 'Bordão Místico', nivel: 0, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação bônus', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Magia que infunde um cajado ou clava com energia natural. Pela duração, você pode usar seu modificador de habilidade de conjuração, em vez de Força, nas jogadas de ataque e dano com aquela arma, e o dado de dano se torna 1d8 (para uma mão) ou 1d10 (duas mãos) de dano contundente. A arma também conta como mágica para fins de superar resistência e imunidade.'
},
{
  nome: 'Sagrada Chama', nivel: 0, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma chama divina cai sobre uma criatura que você possa ver dentro do alcance. O alvo deve ser bem sucedido em um teste de resistência de Destreza ou sofre 1d8 de dano radiante. O alvo não recebe nenhum benefício de cobertura para esse teste. Em Níveis Superiores: o dano aumenta em 1d8 ao alcançar o 5° (2d8), 11° (3d8) e 17° nível (4d8).'
},
{
  nome: 'Chicote de Espinhos', nivel: 0, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria um longo chicote de espinhos que golpeia uma criatura dentro do alcance. Faça um ataque mágico corpo a corpo; em caso de acerto, o alvo sofre 1d6 de dano perfurante e, se for de tamanho Grande ou menor, você o puxa até 3 metros mais perto de você. O dano aumenta em 1d6 nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Consertar', nivel: 0, escola: 'transmutacao', classes: ['Bardo','Clérigo','Druida','Feiticeiro','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'duas peças de metal magnetizadas',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia repara um único dano de quebra ou corte em um objeto que você toque, como o elo partido de uma corrente, duas metades de uma chave quebrada ou a página rasgada de um livro. Desde que o dano não exceda 30 cm em qualquer dimensão, você o repara, sem deixar vestígios do dano anterior. Não pode dar vida a um objeto destruído.'
},
{
  nome: 'Controlar Chamas', nivel: 0, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'S', material: null,
  duracao: 'Instantânea ou 1 hora', concentracao: false, ritual: false,
  desc: 'Você cria um dos seguintes efeitos mágicos dentro do alcance, manipulando uma chama não-mágica existente: aumenta ou diminui o tamanho da chama por 1 hora; provoca dano por meio dela, fazendo-a se mover e ferir uma criatura dentro de 1,5 metro; muda a cor da chama por 1 hora; ou expressa uma forma simples como um símbolo dentro da chama, que persiste por 1 hora.'
},
{
  nome: 'Criar Chamas', nivel: 0, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '10 minutos', concentracao: false, ritual: false,
  desc: 'Você cria uma chama do tamanho de uma tocha na palma de sua mão. A chama dura pela duração e não causa dano nem queima você ou seus pertences. Ela ilumina como uma tocha. Você também pode arremessá-la em uma criatura a até 9 metros: faça um ataque à distância com sua habilidade de conjuração, causando 1d8 de dano de fogo em caso de acerto. Arremessá-la encerra a magia.'
},
{
  nome: 'Criar Fogueira', nivel: 0, escola: 'conjuracao', classes: ['Bruxo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma fogueira em um ponto que você possa ver dentro do alcance. A fogueira preenche um cubo de 1,5 metro pela duração. Qualquer criatura que esteja dentro da fogueira quando ela aparece, ou entre nela, sofre 1d8 de dano de fogo. O dano aumenta em 1d8 ao alcançar o 5° (2d8), 11° (3d8) e 17° nível (4d8).'
},
{
  nome: 'Druidismo', nivel: 0, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você sussurra para o espírito da natureza para criar um dos seguintes efeitos: prever o clima das próximas 24 horas em sua área; fazer uma flor brotar, uma semente germinar ou um broto se abrir; fazer plantas se entrelaçarem para formar uma forma ou padrão simples; ou fazer plantas próximas liberarem um leve odor agradável por 1 minuto.'
},
{
  nome: 'Espirro Ácido', nivel: 0, escola: 'conjuracao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria uma bolha de ácido. Escolha uma criatura, ou duas criaturas adjacentes entre si, dentro do alcance. O alvo (ou ambos) deve ser bem sucedido em um teste de Destreza ou sofre 1d6 de dano ácido. O dano aumenta em 1d6 ao alcançar o 5° (2d6), 11° (3d6) e 17° nível (4d6).'
},
{
  nome: 'Estabilizar', nivel: 0, escola: 'necromancia', classes: ['Clérigo'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura à beira da morte e estabiliza seu estado mágico. Essa criatura recupera 1 ponto de vida e fica estável, sem precisar fazer testes de resistência contra a morte nem sofrer mais dano por motivos relacionados.'
},
{
  nome: 'Globos de Luz', nivel: 0, escola: 'evocacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pedaço de fósforo ou musgo fosforescente',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria até quatro tochas, lanternas, orbes ou esferas de luz dentro do alcance, fazendo-as flutuar no ar pela duração. Cada luz emite luz fraca em raio de 3 metros. Como ação bônus, você pode movê-las até 18 metros para qualquer ponto dentro do alcance. Uma luz deve permanecer a até 6 metros de outra e desaparece se ficar fora do alcance da magia.'
},
{
  nome: 'Ilusão Menor', nivel: 0, escola: 'ilusao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'S, M', material: 'um pedacinho de lã',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você cria um som ou imagem de um objeto dentro do alcance que persiste pela duração. A ilusão também termina se você a dispensar como ação ou conjurar essa magia novamente. Se criar um som, seu volume pode variar de um sussurro a um grito. Uma criatura que use sua ação para examinar a ilusão pode reconhecê-la como falsa com um teste de Inteligência (Investigação) contra sua CD de magia.'
},
{
  nome: 'Lâmina da Chama Esverdeada', nivel: 0, escola: 'evocacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'S, M', material: 'uma arma corpo a corpo no valor de pelo menos 1 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Fogo esverdeado salta de uma arma quando você ataca com ela. Faça um ataque corpo a corpo com a arma contra uma criatura. Em caso de acerto, o alvo sofre o dano normal da arma e uma segunda criatura, à sua escolha, que esteja a até 1,5 metro do alvo original e dentro do alcance, sofre dano de fogo igual ao seu modificador de habilidade de conjuração. O dano de fogo aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Lâmina Estrondosa', nivel: 0, escola: 'evocacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'S, M', material: 'uma arma corpo a corpo no valor de pelo menos 1 PO',
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Energia de trovão envolve sua arma. Faça um ataque corpo a corpo com a arma infundida contra uma criatura dentro do alcance. Em caso de acerto, o alvo sofre o dano normal da arma e, até o fim do seu próximo turno, sofre 1d8 de dano de trovão se ele se mover voluntariamente antes desse momento. O dano de trovão aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Lufada', nivel: 0, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria uma rajada de vento capaz de mover objetos leves, perturbar uma chama, espalhar gás ou fumaça, ou empurrar levemente uma criatura pequena ou menor. Não causa dano nem é forte o suficiente para mover criaturas grandes.'
},
{
  nome: 'Luz', nivel: 0, escola: 'evocacao', classes: ['Bardo','Clérigo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, M', material: 'uma vagalume ou musgo fosforescente',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você toca um objeto não maior que 3 metros em qualquer dimensão. Até a magia terminar, o objeto emite luz forte em raio de 6 metros e luz fraca por mais 6 metros. A luz pode ter qualquer cor. Cobrir o objeto totalmente com algo opaco bloqueia a luz. A magia termina se for conjurada novamente ou dispelida.'
},
{
  nome: 'Mãos Mágicas', nivel: 0, escola: 'conjuracao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Uma mão espectral e flutuante aparece em um ponto à sua escolha dentro do alcance. Ela dura pela duração ou até você a dispensar como ação. A mão pode manipular um objeto, abrir uma porta ou recipiente destrancado, guardar ou retirar um item de um recipiente aberto, ou derramar o conteúdo de um frasco. A cada vez que você a move, ela pode fazer uma dessas ações. Não pode atacar, ativar itens mágicos nem carregar mais de 5 kg.'
},
{
  nome: 'Moldar Água', nivel: 0, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea ou 1 hora', concentracao: false, ritual: false,
  desc: 'Você escolhe uma área de água visível dentro do alcance que caiba em um cubo de 1,5 metro e causa um dos seguintes efeitos: move ou molda a água de forma simples; muda sua cor ou opacidade por 1 hora; congela-a, desde que não haja criaturas nela; cria texturas grosseiras na superfície por 1 hora; ou cria pequenos efeitos visuais nela por 1 hora.'
},
{
  nome: 'Moldar Terra', nivel: 0, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea ou 1 hora', concentracao: false, ritual: false,
  desc: 'Você escolhe uma porção de terra ou pedra solta visível dentro do alcance que caiba em um cubo de 1,5 metro e molda-a em uma forma simples diferente, ou cria um obstáculo de até 1,5 metro de altura. Não pode causar dano a criaturas com essa magia.'
},
{
  nome: 'Orientação', nivel: 0, escola: 'adivinhacao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você toca uma criatura disposta. Uma vez antes da magia terminar, o alvo pode rolar um d4 e somar o resultado a um teste de habilidade de sua escolha. O alvo pode rolar o dado antes ou depois de fazer o teste.'
},
{
  nome: 'Pedra Encantada', nivel: 0, escola: 'transmutacao', classes: ['Bruxo','Druida'],
  tempo: '1 ação bônus', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você toca um seixo e o infunde com energia natural para usar como projétil. Quando você o joga ou arremessa em uma criatura dentro de 18 metros, faça um ataque mágico à distância; em caso de acerto, o alvo sofre 1d6 de dano contundente, e a pedra perde a magia. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Picada Congelante', nivel: 0, escola: 'evocacao', classes: ['Bruxo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você envia um sopro gelado em direção a uma criatura dentro do alcance. Faça um ataque mágico à distância contra o alvo. Em caso de acerto, sofre 1d6 de dano de frio e tem desvantagem na próxima jogada de ataque com arma que fizer antes do início do seu próximo turno, devido à dor extrema. Em uma criatura que use armadura de placas, ela sofre desvantagem no próximo teste de Destreza ou Força ao invés. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Truque de Prestidigitador', nivel: 0, escola: 'transmutacao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V, S', material: null,
  duracao: 'Até 1 hora', concentracao: false, ritual: false,
  desc: 'Você cria um efeito mágico sensorial simples dentro do alcance: uma chama instantânea, uma corrente de ar frio, um cheiro fraco, um som suave, marcas coloridas, uma pequena imagem ilusória que cabe em uma mão, ou a limpeza e secagem de um objeto pequeno. Pode realizar efeitos simples como esses indefinidamente enquanto a magia durar.'
},
{
  nome: 'Proteção Contra Lâminas', nivel: 0, escola: 'abjuracao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Você fortalece sua defesa física. Até o início do seu próximo turno, você tem resistência a dano cortante, perfurante e concussivo causado por ataques com armas.'
},
{
  nome: 'Raio de Fogo', nivel: 0, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você arremessa um mísel mandante de fogo em uma criatura ou objeto dentro do alcance. Faça um ataque mágico à distância contra o alvo. Em caso de acerto, sofre 1d10 de dano de fogo. Um alvo inflamável que seja atingido sofre fogo se ainda não estiver com chamas. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Raio de Gelo', nivel: 0, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um raio fino de luz azulada e branca surge de você em direção a uma criatura dentro do alcance. Faça um ataque mágico à distância. Em caso de acerto, sofre 1d8 de dano de frio e seu deslocamento é reduzido em 3 metros até o início do seu próximo turno. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Rajada de Veneno', nivel: 0, escola: 'conjuracao', classes: ['Bruxo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você estende sua mão em direção a uma criatura que possa ver dentro do alcance e provoca uma rajada de gás venenoso da sua mão. O alvo deve realizar um teste de Constituição ou sofrer 1d12 de dano de veneno. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Rajada Mística', nivel: 0, escola: 'evocacao', classes: ['Bruxo'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria um feixe crepitante de energia arcana que dispara em direção a uma criatura dentro do alcance. Faça um ataque mágico à distância contra o alvo. Em caso de acerto, sofre 1d10 de dano de força. A magia cria mais de um feixe quando você alcança níveis mais altos: dois feixes no 5° nível, três no 11° e quatro no 17°, podendo direcioná-los a um mesmo alvo ou a alvos diferentes, com um ataque por feixe.'
},
{
  nome: 'Resistência', nivel: 0, escola: 'abjuracao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um talismã pequeno e benzido',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você toca uma criatura disposta. Uma vez antes da magia terminar, o alvo pode rolar um d4 e somar o resultado a um teste de resistência de sua escolha. Pode rolar o dado antes ou depois de fazer o teste.'
},
{
  nome: 'Rompante de Espadas', nivel: 0, escola: 'conjuracao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você invoca espadas espectrais que giram à sua volta por um instante, atacando criaturas próximas. Cada criatura, exceto você, em um raio de 1,5 metro deve fazer um teste de Destreza. Em caso de falha, sofre 1d6 de dano de força. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Taumaturgia', nivel: 0, escola: 'transmutacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V', material: null,
  duracao: 'Até 1 minuto', concentracao: false, ritual: false,
  desc: 'Você manifesta um sinal menor de poder divino, criando um dos seguintes efeitos dentro do alcance: sua voz triplica de volume por 1 minuto; você faz chamas oscilarem, ventos soprarem suave, trovões soarem baixo, ou portas e janelas destrancadas se abrirem ou baterem; causa pequenas mudanças instantâneas em sua aparência por 1 turno; seus olhos brilham por 1 minuto; cria um som inofensivo instantâneo; ou abre ou fecha uma porta/janela destrancada repentinamente. Pode manter até três efeitos simultaneamente, descartando um anterior para criar outro.'
},
{
  nome: 'Toque Arrepiante', nivel: 0, escola: 'necromancia', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Você cria uma mão espectral e arrepiante na direção de uma criatura dentro do alcance. Faça um ataque mágico à distância contra ela. Em caso de acerto, sofre 1d8 de dano necrótico e não pode recuperar pontos de vida até o início do seu próximo turno. Até esse momento, a mão se prende a ela. Se você atingir um morto-vivo, ele também tem desvantagem nas jogadas de ataque contra você até o fim do seu próximo turno. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Toque Chocante', nivel: 0, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Relâmpagos crepitam em sua mão à medida que você tenta acertar um ataque corpo a corpo na criatura alvo. Você tem vantagem no ataque se o alvo estiver vestindo armadura de metal. Em caso de acerto, sofre 1d8 de dano elétrico, e não pode usar reações até o início do seu próximo turno. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Trovoada', nivel: 0, escola: 'evocacao', classes: ['Bardo','Bruxo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera uma explosão sonora que pode ser ouvida a até 30 metros. Toda criatura, exceto você, dentro de 1,5 metro deve realizar um teste de Constituição ou sofrer 1d6 de dano de trovão. O dano aumenta nos níveis 5°, 11° e 17°.'
},
{
  nome: 'Zombaria Viciosa', nivel: 0, escola: 'encantamento', classes: ['Bardo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera uma série de insultos atados com encantamentos sutis em uma criatura que possa ver dentro do alcance. Se o alvo puder ouvir você, deve ser bem sucedido em um teste de Sabedoria ou sofre 1d4 de dano psíquico e tem desvantagem na próxima jogada de ataque que fizer antes do fim do seu próximo turno. O dano aumenta nos níveis 5°, 11° e 17°.'
},

// =============================== NÍVEL 1 ===============================
{
  nome: 'Absorver Elementos', nivel: 1, escola: 'abjuracao', classes: ['Druida','Mago','Patrulheiro'],
  tempo: '1 reação', alcance: 'Pessoal', componentes: 'S', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'A magia capta parte da energia que fere você, reduzindo o dano que sofre e armazenando-a para um golpe posterior. Você tem resistência ao tipo de dano que provocou a reação. Além disso, na primeira vez que acertar um ataque corpo a corpo antes do fim do seu próximo turno, o alvo sofre 1d6 de dano extra do tipo absorvido.'
},
{
  nome: 'Alarme', nivel: 1, escola: 'abjuracao', classes: ['Mago','Patrulheiro'],
  tempo: '1 minuto', alcance: '9 metros', componentes: 'V, S, M', material: 'um pedaço de fio de cobre fino',
  duracao: '8 horas', concentracao: false, ritual: true,
  desc: 'Você cria uma área de alerta mágico contra intrusos em um cubo de 6 metros dentro do alcance. Quando uma criatura que você não designou entra na área, você é avisado por um alarme mental (se conjurou de forma sigilosa) ou audível (até 18 metros). Você pode excluir até 12 criaturas, que não disparam o alarme.'
},
{
  nome: 'Amizade Animal', nivel: 1, escola: 'encantamento', classes: ['Bardo','Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um punhado de comida',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Essa magia permite que você convença uma besta de que você não significa nenhum dano para ela. Escolha uma besta que possa ver dentro do alcance. Ela deve ver e ouvir você. Se a Inteligência dela for 4 ou menos, ela deve realizar um teste de Sabedoria. Em caso de falha, fica enfeitiçada por você pela duração. Se você ou um de seus companheiros prejudicar o alvo, a magia termina.'
},
{
  nome: 'Armadura Arcana', nivel: 1, escola: 'abjuracao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pedaço de couro curtido',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Uma força mágica protetora envolve uma criatura disposta tocada por você até a magia terminar. O alvo ganha uma CA base de 13 + seu modificador de Destreza. A magia não funciona se o alvo já estiver vestindo armadura ou se estiver usando um escudo.'
},
{
  nome: 'Armadura de Agathys', nivel: 1, escola: 'abjuracao', classes: ['Bruxo'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pingo de água ou gelo',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Uma camada gélida de geada mágica cobre você, dando pontos de vida temporários iguais a 5 x o nível da magia. Enquanto durarem, qualquer criatura que acerte um ataque corpo a corpo contra você sofre 5 de dano de frio.'
},
{
  nome: 'Bênção', nivel: 1, escola: 'encantamento', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um aspersório de água benta',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você abençoa até três criaturas dentro do alcance. Sempre que um alvo fizer uma jogada de ataque ou um teste de resistência antes da magia terminar, pode somar 1d4 ao total. Em Níveis Superiores: pode afetar uma criatura adicional para cada nível de magia acima do 1°.'
},
{
  nome: 'Bom Fruto', nivel: 1, escola: 'transmutacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um ramo de visco',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Até dez bagas mágicas se materializam na sua mão e brilham fracamente até serem comidas. Cada baga é mágica e leva 1 minuto para ser consumida. Comer uma cura 1 ponto de vida e fornece nutrição suficiente para sustentar uma criatura por um dia. Bagas não consumidas perdem a magia após 24 horas.'
},
{
  nome: 'Braços de Hadar', nivel: 1, escola: 'conjuracao', classes: ['Bruxo'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 3 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você abre brevemente um vínculo com o Vazio Distante e canaliza esse poder para destruir seus inimigos próximos. Cada criatura à sua escolha dentro de 3 metros de você deve fazer um teste de Constituição. Em caso de falha, sofre 2d6 de dano necrótico e não pode usar reações até o seu próximo turno; em caso de sucesso, sofre metade do dano. O dano aumenta em 1d6 para cada nível acima do 1°.'
},
{
  nome: 'Bruxaria', nivel: 1, escola: 'encantamento', classes: ['Bruxo'],
  tempo: '1 ação bônus', alcance: '27 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você maldiz uma criatura dentro do alcance. Até a magia terminar, você causa 1d6 de dano necrótico extra ao alvo sempre que acertá-lo com uma jogada de ataque. Você também tem desvantagem em testes de habilidade feitos com a habilidade escolhida pelo alvo quando você conjurou. Se o alvo cair a 0 PV antes do fim da magia, você pode usar uma ação bônus em um turno futuro para mudar a maldição para outra criatura.'
},
{
  nome: 'Catapulta', nivel: 1, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedaço pequeno de couro curvado',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Escolha um objeto solto de 1 a 2,5 kg dentro do alcance que não esteja sendo carregado. O objeto voa em linha reta até 27 metros na direção que você escolher antes de cair no chão, atingindo cada criatura no seu caminho. Cada criatura deve fazer um teste de Destreza ou sofre 3d8 de dano contundente.'
},
{
  nome: 'Causar Medo', nivel: 1, escola: 'necromancia', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você desperta o pavor latente da mortalidade em uma criatura que você possa ver dentro do alcance. Ela deve fazer um teste de Sabedoria ou ficar amedrontada por você pela duração. Pela duração, a criatura pode repetir o teste de resistência ao fim de cada um de seus turnos, terminando o efeito sobre si com sucesso.'
},
{
  nome: 'Cerimônia', nivel: 1, escola: 'evocacao', classes: ['Clérigo','Paladino'],
  tempo: '1 hora', alcance: 'Toque', componentes: 'V, S, M', material: 'água benta e incenso no valor de 25 PO, consumidos',
  duracao: 'Instantânea (efeitos variam)', concentracao: false, ritual: true,
  desc: 'Você realiza um ritual religioso que carrega bênção divina sobre o alvo, com diferentes efeitos à sua escolha: Abençoar uma Criatura (recebe PV temporários e proteção contra mortos-vivos), Compromisso (jura algo solene), Funeral (purifica os restos de um morto), Imposição de Nomes (concede um nome verdadeiro com benefícios) ou Casamento (recebe vantagem em testes envolvendo o cônjuge).'
},
{
  nome: 'Comando', nivel: 1, escola: 'encantamento', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Você fala uma única palavra de comando mágico em uma criatura que possa ver dentro do alcance. O alvo deve ser bem sucedido em um teste de Sabedoria ou seguir o comando em seu próximo turno: Aproximar, Largar, Cair, Fugir ou Parar. A magia não tem efeito se o alvo for morto-vivo, não entender seu idioma, ou se o comando for prejudicial diretamente.'
},
{
  nome: 'Compreender Idiomas', nivel: 1, escola: 'adivinhacao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pouco de fuligem e sal',
  duracao: '1 hora', concentracao: false, ritual: true,
  desc: 'Pela duração, você compreende o significado literal de qualquer idioma falado que ouvir. Você também compreende qualquer idioma escrito que vir, mas deve estar tocando a superfície onde as palavras estão escritas. Demora aproximadamente 1 minuto para ler uma página de texto.'
},
{
  nome: 'Constrição', nivel: 1, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Vinhas e raízes irrompem do solo em um quadrado de 6 metros dentro do alcance. Pela duração, essas plantas transformam o terreno na área em terreno difícil. Cada criatura nessa área quando a magia é conjurada deve realizar um teste de Força, ficando impedida em caso de falha enquanto permanecer na área ou até se libertar.'
},
{
  nome: 'Criar ou Destruir Água', nivel: 1, escola: 'transmutacao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma gota de água se for criar, ou areia se for destruir',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria ou destrói até 40 litros de água dentro do alcance. Pode criar água potável e limpa, ou destruir água ou névoa em uma área, apagando chamas pequenas que estejam nela. Alternativamente, pode afetar água em um recipiente de até 4 litros que esteja com outras criaturas.'
},
{
  nome: 'Curar Feridas', nivel: 1, escola: 'evocacao', classes: ['Bardo','Clérigo','Druida','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma criatura que você tocar recupera pontos de vida iguais a 1d8 + seu modificador de habilidade de conjuração. Essa magia não tem efeito sobre mortos-vivos ou constructos. Em Níveis Superiores: a cura aumenta em 1d8 para cada nível de magia acima do 1°.'
},
{
  nome: 'Detectar Bem e Mal', nivel: 1, escola: 'adivinhacao', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'água benta ou incenso sagrado',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: true,
  desc: 'Pela duração, você sabe se há uma criatura celestial, corruptora, elemental ou morta-viva a até 9 metros de você, bem como onde se encontra. Da mesma forma, você sabe se há algum local ou objeto consagrado ou profanado na mesma área.'
},
{
  nome: 'Detectar Magia', nivel: 1, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Druida','Feiticeiro','Mago','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: true,
  desc: 'Pela duração, você sente a presença de magia a até 9 metros de você. Se sentir essa presença, pode usar sua ação para ver um brilho fraco em torno de qualquer criatura ou objeto visível que porte magia, e aprende a escola de magia, se houver alguma.'
},
{
  nome: 'Detectar Veneno e Doença', nivel: 1, escola: 'adivinhacao', classes: ['Clérigo','Druida','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'uma folha de teixo',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: true,
  desc: 'Pela duração, você sabe a localização de qualquer veneno, criatura venenosa e doença a até 9 metros de você. Você também identifica o tipo de veneno, criatura venenosa ou doença em cada caso.'
},
{
  nome: 'Disfarçar-se', nivel: 1, escola: 'ilusao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você se disfarça, incluindo suas roupas, armaduras, armas e equipamento, alterando sua aparência. Você decide as especificidades da disfarce, podendo parecer 30 cm mais alto ou mais baixo e pode parecer magro, gordo ou de altura média. Não pode mudar o tipo básico de corpo. A magia não fornece nenhum dado adicional para fazer alguém acreditar que você é outra pessoa.'
},
{
  nome: 'Encontrar Familiar', nivel: 1, escola: 'conjuracao', classes: ['Mago'],
  tempo: '1 hora', alcance: '3 metros', componentes: 'V, S, M', material: 'incenso e ervas no valor de 10 PO, queimados em um pequeno braseiro',
  duracao: 'Instantânea', concentracao: false, ritual: true,
  desc: 'Você ganha o serviço de um familiar, um espírito que assume a forma de um animal que você escolhe: morcego, gato, caranguejo, sapo, falcão, lagarto, rato, corvo, peixe-do-mar, lula ou aranha. Aparecendo a uma distância de até 3 metros, o familiar tem as estatísticas do animal escolhido, mas é um fantasma, não uma fera. Você pode se comunicar telepaticamente com ele e ver através de seus sentidos.'
},
{
  nome: 'Enfeitiçar Pessoa', nivel: 1, escola: 'encantamento', classes: ['Bardo','Bruxo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você tenta enfeitiçar um humanoide que possa ver dentro do alcance. Ele deve realizar um teste de Sabedoria, com desvantagem se você ou seus aliados estiverem lutando com ele, ou ficará enfeitiçado por você pela duração. A criatura enfeitiçada sabe que você é seu amigo e, ao final da duração, sabe que foi enfeitiçada.'
},
{
  nome: 'Escudo Arcano', nivel: 1, escola: 'abjuracao', classes: ['Feiticeiro','Mago'],
  tempo: '1 reação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Uma barreira invisível de força mágica aparece e o protege. Até o início do seu próximo turno, você recebe +5 de bônus na CA, incluindo contra o ataque que disparou a magia, e você não sofre dano de Mísseis Mágicos.'
},
{
  nome: 'Escudo de Fé', nivel: 1, escola: 'abjuracao', classes: ['Clérigo','Paladino'],
  tempo: '1 ação bônus', alcance: '18 metros', componentes: 'V, S, M', material: 'um pequeno emblema sagrado',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Um brilho cintilante envolve uma criatura escolhida dentro do alcance, concedendo +2 de bônus na CA pela duração.'
},
{
  nome: 'Falar com Animais', nivel: 1, escola: 'adivinhacao', classes: ['Bardo','Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '10 minutos', concentracao: false, ritual: true,
  desc: 'Pela duração, você ganha a capacidade de compreender bestas e se comunicar verbalmente com elas. O conhecimento e a inteligência de muitas bestas são limitados pela sua natureza, mas pelo menos elas podem fornecer informações sobre lugares próximos e monstros, incluindo o que viram ou ouviram nas últimas horas.'
},
{
  nome: 'Fogo das Fadas', nivel: 1, escola: 'evocacao', classes: ['Bardo','Druida'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Cada objeto em um cubo de 6 metros dentro do alcance fica delineado em luz violeta, verde ou azul (à sua escolha). Qualquer criatura na área quando a magia é conjurada também é delineada se falhar em um teste de Destreza. Pela duração, objetos e criaturas afetadas emitem luz fraca em raio de 3 metros, e qualquer ataque contra eles tem vantagem se o atacante puder vê-los, sem benefício de invisibilidade.'
},
{
  nome: 'Heroísmo', nivel: 1, escola: 'encantamento', classes: ['Bardo','Paladino'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma criatura voluntária que você toca é imbuída com bravura. Pela duração, o alvo é imune ao medo e ganha pontos de vida temporários iguais ao seu modificador de habilidade de conjuração no início de cada um de seus turnos. Quando a magia termina, o alvo perde quaisquer pontos de vida temporários restantes dessa magia.'
},
{
  nome: 'Identificação', nivel: 1, escola: 'adivinhacao', classes: ['Bardo','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'uma pérola no valor de pelo menos 100 PO e uma pena de coruja, ambas consumidas',
  duracao: 'Instantânea', concentracao: false, ritual: true,
  desc: 'Escolha um objeto que você deva tocar pela duração da conjuração. Se for um objeto mágico ou outro item imbuído de magia, você aprende suas propriedades e como usá-las, se ele requer Atunamento e quantas cargas restam, se houver. Você aprende se algum encantamento ou magia está afetando o item.'
},
{
  nome: 'Imagem Silenciosa', nivel: 1, escola: 'ilusao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedacinho de lã',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você cria uma imagem de um objeto, criatura ou outro fenômeno visível que tenha até 4,5 metros em cada lado. A imagem aparece em um ponto que você escolher dentro do alcance e dura pela duração. A imagem não tem sons, cheiros nem efeitos sonoros. Você pode usar sua ação para fazer a imagem se mover dentro do alcance.'
},
{
  nome: 'Infligir Ferimentos', nivel: 1, escola: 'necromancia', classes: ['Clérigo'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Energia necrótica fere a sua vítima quando você toca uma criatura com a mão. Faça um ataque mágico corpo a corpo contra o alvo. Em caso de acerto, sofre 3d10 de dano necrótico. Em Níveis Superiores: o dano aumenta em 1d10 para cada nível de magia acima do 1°.'
},
{
  nome: 'Laço', nivel: 1, escola: 'abjuracao', classes: ['Druida','Mago','Patrulheiro'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'S, M', material: 'um pedaço de corda de 75 cm',
  duracao: 'Até ser dissipado ou acionado', concentracao: false, ritual: false,
  desc: 'Quando você conjura essa magia, você cria um laço mágico em um chão, escada ou outra passagem similar e ele se torna armadilhado pela duração. Esse laço é invisível e abrange uma área com até 1,5 metro quadrado. Quando uma criatura toca um fio invisível que se estende do laço por até 3 metros, conectado a um gatilho, a criatura presa fica impedida e suspensa até 1 metro acima do chão.'
},
{
  nome: 'Leque Cromático', nivel: 1, escola: 'ilusao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (cone de 4,5 metros)', componentes: 'V, S, M', material: 'pó de lula ou carvão',
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Uma explosão fascinante de luz colorida brota de sua mão. Cada criatura no cone de 4,5 metros deve realizar um teste de Constituição. Uma criatura que falhar fica cega, surda, atônita ou inconsciente (role 1d10) até o fim do seu próximo turno.'
},
{
  nome: 'Mãos Flamejantes', nivel: 1, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (cone de 4,5 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Estendendo seus dedos abertos, um cone de chamas se irradia de suas mãos. Cada criatura no cone de 4,5 metros deve realizar um teste de Destreza, sofrendo 3d6 de dano de fogo em caso de falha, ou metade em caso de sucesso. O fogo incendeia objetos inflamáveis desprotegidos. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 1°.'
},
{
  nome: 'Marca do Caçador', nivel: 1, escola: 'adivinhacao', classes: ['Patrulheiro'],
  tempo: '1 ação bônus', alcance: '27 metros', componentes: 'V', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você marca magicamente uma criatura que possa ver dentro do alcance como sua presa. Até a magia terminar, você causa 1d6 de dano extra ao alvo sempre que acertá-lo com uma jogada de ataque, e você tem vantagem em qualquer teste de Sabedoria (Percepção) ou Sabedoria (Sobrevivência) feito para localizá-lo. Se o alvo cair a 0 PV antes da magia terminar, você pode usar uma ação bônus em um turno futuro para mudar a marca para outra criatura.'
},
{
  nome: 'Mísseis Mágicos', nivel: 1, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria três dardos brilhantes de força mágica. Cada dardo atinge automaticamente uma criatura à sua escolha que você possa ver dentro do alcance, causando 1d4+1 de dano de força. Os dardos atingem simultaneamente e podem ser direcionados a um único alvo ou a múltiplos. Em Níveis Superiores: a magia cria um dardo adicional para cada nível de magia acima do 1°.'
},
{
  nome: 'Névoa Obscurecente', nivel: 1, escola: 'conjuracao', classes: ['Druida','Feiticeiro','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'uma pitada de poeira diamante',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você cria uma esfera de névoa centrada em um ponto dentro do alcance. A esfera tem raio de 6 metros, se estende ao redor de cantos e sua área é fortemente obscurecida. Ela persiste pela duração ou até que um vento forte a disperse.'
},
{
  nome: 'Onda Trovejante', nivel: 1, escola: 'evocacao', classes: ['Bardo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (cubo de 4,5 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma onda de força trovejante se espalha de você. Cada criatura em um cubo de 4,5 metros originário de você deve realizar um teste de Constituição. Em caso de falha, sofre 2d8 de dano de trovão e é empurrada 3 metros para longe de você. Em caso de sucesso, sofre metade do dano e não é empurrada. Objetos não fixados e leves também são empurrados. Em Níveis Superiores: o dano aumenta em 1d8 para cada nível acima do 1°.'
},
{
  nome: 'Orbe Cromático', nivel: 1, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'um diamante no valor de pelo menos 50 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você lança uma esfera mágica de energia em direção a uma criatura dentro do alcance. Escolha ácido, frio, fogo, elétrico, veneno ou trovão para o tipo de dano. Faça um ataque mágico à distância contra o alvo. Em caso de acerto, sofre 3d8 de dano do tipo escolhido. Se for fogo e o alvo for inflamável, ele pega fogo. Em Níveis Superiores: o dano aumenta em 1d8 para cada nível acima do 1°.'
},
{
  nome: 'Palavra de Cura', nivel: 1, escola: 'evocacao', classes: ['Bardo','Clérigo','Druida'],
  tempo: '1 ação bônus', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma criatura de sua escolha que você possa ver dentro do alcance recupera pontos de vida iguais a 1d4 + seu modificador de habilidade de conjuração. Essa magia não tem efeito sobre mortos-vivos ou constructos. Em Níveis Superiores: a cura aumenta em 1d4 para cada nível acima do 1°.'
},
{
  nome: 'Passo Largo', nivel: 1, escola: 'transmutacao', classes: ['Bardo','Druida','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pouco de barro',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'O deslocamento da criatura tocada aumenta em 3 metros até a magia terminar. A magia pode ser conjurada novamente antes de terminar para estender sua duração por mais 1 hora.'
},
{
  nome: 'Perdição', nivel: 1, escola: 'encantamento', classes: ['Bardo','Clérigo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma gota de sangue',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Até três criaturas à sua escolha dentro do alcance devem realizar um teste de Carisma ou ficarão sob efeito dessa magia pela duração. Sempre que um alvo afetado fizer uma jogada de ataque ou um teste de resistência antes da magia terminar, ele deve rolar um d4 e subtrair o resultado da jogada de ataque ou do teste.'
},
{
  nome: 'Proteção Contra Bem e Mal', nivel: 1, escola: 'abjuracao', classes: ['Bruxo','Clérigo','Mago','Paladino'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'água benta ou incenso sagrado, queimados em um pequeno braseiro',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Até a magia terminar, uma criatura disposta tocada por você é protegida contra certos tipos de criaturas: aberrações, celestiais, elementais, corruptores, fadas, mortos-vivos. A proteção concede vários benefícios: vantagem em testes contra essas criaturas, vantagem para resistir aos encantamentos/medo causados por elas, e o tipo afetado não pode atacar magicamente o alvo possuído ou enfeitiçado.'
},
{
  nome: 'Purificar Comida e Bebida', nivel: 1, escola: 'transmutacao', classes: ['Clérigo','Druida','Paladino'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: true,
  desc: 'Toda comida e bebida não-mágica dentro de um cubo de 1,5 metro centrado em um ponto à sua escolha dentro do alcance fica purificada e livre de veneno e doença.'
},
{
  nome: 'Queda Suave', nivel: 1, escola: 'transmutacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 reação', alcance: '18 metros', componentes: 'V, M', material: 'uma pequena pena',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Escolha até cinco criaturas em queda dentro do alcance. A taxa de queda de uma criatura afetada diminui imediatamente para 18 metros por rodada até o fim da magia. Se a criatura aterrissar antes do fim da queda, ela não sofre dano de queda e pode cair em pé.'
},
{
  nome: 'Raio da Bruxa', nivel: 1, escola: 'evocacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma teia de aranha pintada com um pingo de prata fundida',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Um lampejo de energia azul-violeta surge em uma linha entre você e a criatura alvo dentro do alcance. Faça um ataque mágico à distância contra o alvo, causando 1d12 de dano elétrico em caso de acerto. Nas rodadas seguintes, enquanto manter concentração, você pode usar sua ação para causar automaticamente 1d12 de dano adicional no mesmo alvo, sem novo teste de ataque, desde que ele esteja dentro do alcance.'
},
{
  nome: 'Raio do Caos', nivel: 1, escola: 'evocacao', classes: ['Feiticeiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera um feixe instável de energia mágica em direção a uma criatura dentro do alcance. Faça um ataque mágico à distância. Em caso de acerto, role 1d8 para determinar o tipo de dano (ácido, frio, fogo, força, elétrico, veneno, psíquico ou trovão), causando 2d8 desse dano. Se os dois d8 do dano saírem com o mesmo número, o raio salta para outra criatura próxima, repetindo o efeito.'
},
{
  nome: 'Raio Guiador', nivel: 1, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Um feixe flamejante de luz desce em direção a uma criatura dentro do alcance. Faça um ataque mágico à distância contra o alvo. Em caso de acerto, sofre 4d6 de dano radiante, e a próxima jogada de ataque feita contra ele antes do fim do seu próximo turno tem vantagem, devido à luz brilhante que marca o alvo. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 1°.'
},
{
  nome: 'Recuo Acelerado', nivel: 1, escola: 'transmutacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação bônus', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Seu deslocamento aumenta em 9 metros até a magia terminar. Cada vez que você usa essa ação bônus em seu turno, você pode usar a ação Disparada como ação bônus em vez de uma ação normal.'
},
{
  nome: 'Repreensão Infernal', nivel: 1, escola: 'evocacao', classes: ['Bruxo'],
  tempo: '1 reação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você ponta um dedo acusador para uma criatura que acabou de causar dano a você. Chamas infernais surgem na localização escolhida e crepitam ao redor do alvo. O alvo deve realizar um teste de Destreza, sofrendo 2d10 de dano de fogo em caso de falha, ou metade do dano em caso de sucesso. Em Níveis Superiores: o dano aumenta em 1d10 para cada nível acima do 1°.'
},
{
  nome: 'Riso Histérico de Tasha', nivel: 1, escola: 'encantamento', classes: ['Bardo','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um pequeno biscoito amanteigado',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você tenta sobrecarregar a estabilidade emocional de uma criatura, fazendo-a explodir em uma crise de risadas incontroláveis se falhar em um teste de Sabedoria. O alvo fica caído, com a condição incapacitado, e não para de gargalhar. A cada turno ela pode repetir o teste, terminando o efeito sobre si com sucesso.'
},
{
  nome: 'Salto', nivel: 1, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'uma pata de gafanhoto',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura. A distância de salto dela triplica até a magia terminar.'
},
{
  nome: 'Santuário', nivel: 1, escola: 'abjuracao', classes: ['Clérigo'],
  tempo: '1 ação bônus', alcance: '9 metros', componentes: 'V, S, M', material: 'um pequeno disco de prata polida',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você protege uma criatura dentro do alcance contra ataques. Até a magia terminar, qualquer criatura que tente direcionar um ataque ou magia prejudicial contra o alvo protegido deve realizar um teste de Sabedoria antes de fazê-lo. Em caso de falha, deve escolher outro alvo ou perder o ataque/magia. Isso não protege o alvo de áreas de efeito.'
},
{
  nome: 'Servo Invisível', nivel: 1, escola: 'conjuracao', classes: ['Bardo','Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedaço de barbante e madeira',
  duracao: '1 hora', concentracao: false, ritual: true,
  desc: 'Essa magia cria uma força invisível, incorpórea e sem mente, que executa tarefas simples a seu comando até a magia terminar. O servo surge em um espaço desocupado no chão dentro do alcance. Ele tem CA 10, 1 PV e Força 2, e não pode atacar. Se reduzido a 0 PV, a magia termina.'
},
{
  nome: 'Sono', nivel: 1, escola: 'encantamento', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'uma pitada de areia fina, pétalas de rosa ou um besouro vivo',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Essa magia transmite torpor mágico em criaturas. Role 5d8; o total é quantos pontos de vida de criaturas essa magia pode afetar. Criaturas dentro de 6 metros de um ponto que você escolher dentro do alcance são afetadas em ordem ascendente de seus pontos de vida atuais (ignorando inconscientes). Mortos-vivos e criaturas imunes a ficar atônitas não são afetados.'
},
{
  nome: 'Sussurros Dissonantes', nivel: 1, escola: 'encantamento', classes: ['Bardo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você sussurra uma melodia dissonante que apenas uma criatura dentro do alcance pode ouvir, causando dor angustiante. O alvo deve fazer um teste de Sabedoria, sofrendo 3d6 de dano psíquico em caso de falha e devendo usar imediatamente sua reação, se disponível, para se afastar de você o máximo possível. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 1°.'
},
{
  nome: 'Tremor de Terra', nivel: 1, escola: 'evocacao', classes: ['Bardo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 3 metros)', componentes: 'V, S, M', material: 'uma pedrinha',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você faz o chão tremer em um raio de 3 metros centrado em você. Cada criatura nessa área, exceto você, deve fazer um teste de Destreza. Em caso de falha, sofre 1d6 de dano contundente e fica caída. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 1°.'
},
{
  nome: 'Vitalidade Falsa', nivel: 1, escola: 'necromancia', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de carne podre',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você toca uma fonte de necromancia sombria, ganhando 1d4 + 4 pontos de vida temporários. Em Níveis Superiores: os pontos de vida temporários aumentam em 5 para cada nível de magia acima do 1°.'
},

// =============================== NÍVEL 2 ===============================
{
  nome: 'Acalmar Emoções', nivel: 2, escola: 'encantamento', classes: ['Bardo','Clérigo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você tenta suprimir emoções fortes em um grupo de pessoas. Cada humanoide em um raio de 6 metros de um ponto à sua escolha deve realizar um teste de Carisma. Você pode então suprimir hostilidade (impedindo ataques e enfeitiçando levemente) ou suprimir indiferença (tornando o alvo enfeitiçado e instigando uma emoção que você escolher).'
},
{
  nome: 'Ajuda', nivel: 2, escola: 'abjuracao', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma pequena tira de pano branco',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Sua magia fortalece os aliados com resistência e determinação. Escolha até três criaturas dentro do alcance. O máximo de pontos de vida e os pontos de vida atuais de cada alvo aumentam em 5 pela duração. Em Níveis Superiores: o aumento sobe em 5 para cada nível acima do 2°.'
},
{
  nome: 'Alterar-se', nivel: 2, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você assume uma forma diferente. Escolha uma das opções a seguir, cujo efeito dura pela duração: Disfarce Natural (você muda sua aparência), Adaptação Aquática (cresce brânquias e membranas) ou Armas Naturais (uma parte do seu corpo se transforma em arma natural causando 1d6 de dano). Você pode terminar a magia antes para reverter à sua forma normal.'
},
{
  nome: 'Aprimorar Habilidade', nivel: 2, escola: 'transmutacao', classes: ['Bardo','Clérigo','Druida','Feiticeiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'pelo ou penas de uma besta',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você toca uma criatura e concede a ela vantagem em testes de habilidade usando uma das habilidades escolhidas: Aspecto da Águia (Sabedoria/Percepção visual), Resistência do Bezerro (Constituição/manter consciência), Força do Touro (Força/levantamento) ou Astúcia da Pantera (Destreza/Furtividade). Em Níveis Superiores: pode afetar uma criatura adicional por nível acima do 2°.'
},
{
  nome: 'Arma Espiritual', nivel: 2, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação bônus', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você cria uma arma espectral flutuante dentro do alcance que dura pela duração ou até você conjurar essa magia novamente. Quando conjura a magia, pode usar um ataque corpo a corpo com seu modificador de habilidade de conjuração contra uma criatura dentro de 1,5 metro da arma, causando 1d8 + modificador de dano de força em caso de acerto. Como ação bônus, você pode mover a arma até 6 metros e repetir o ataque. Em Níveis Superiores: o dano aumenta em 1d8 a cada dois níveis acima do 2°.'
},
{
  nome: 'Arma Mágica', nivel: 2, escola: 'transmutacao', classes: ['Mago','Paladino'],
  tempo: '1 ação bônus', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você toca uma arma não-mágica. Até a magia terminar, essa arma se torna uma arma mágica com bônus de +1 nas jogadas de ataque e dano. Em Níveis Superiores: o bônus aumenta para +2 com magia de 4° nível, e +3 com magia de 6° nível.'
},
{
  nome: 'Arrombar', nivel: 2, escola: 'transmutacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Escolha um objeto trancado ou preso que você possa ver dentro do alcance, como porta, baú, grades, cadeado ou outro mecanismo similar. Um alarme audível tocado dentro de 90 metros toca uma vez. Aplica-se um dos efeitos: cada fechadura no objeto é destrancada; cada ferrolho retraído; ou o objeto, se for porta ou tampa, é arrombado violentamente, ficando aberto.'
},
{
  nome: 'Augúrio', nivel: 2, escola: 'adivinhacao', classes: ['Clérigo'],
  tempo: '1 minuto', alcance: 'Pessoal', componentes: 'V, S, M', material: 'objetos especiais no valor de 25 PO, usados para a adivinhação, consumidos no processo',
  duracao: 'Instantânea', concentracao: false, ritual: true,
  desc: 'Por meio de sua magia, você recebe um pressentimento sobre as consequências prováveis de um curso de ação específico que você planeja realizar dentro das próximas 30 minutos. O DM escolhe um resultado: presságio bom, presságio ruim, ambos os bons e ruins, ou nenhum dos dois.'
},
{
  nome: 'Aumentar/Reduzir', nivel: 2, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um pingo de óleo de cardo',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você causa um aumento ou redução mágico em uma criatura ou objeto não animado que você possa ver dentro do alcance, durando pela duração. Escolha uma criatura disposta ou um objeto que não esteja sendo carregado por outra criatura. Se aumentado, o alvo dobra em todas dimensões e seu peso é multiplicado por oito; se reduzido, suas dimensões são reduzidas pela metade e seu peso reduzido a um oitavo.'
},
{
  nome: 'Boca Encantada', nivel: 2, escola: 'ilusao', classes: ['Bardo','Mago'],
  tempo: '1 minuto', alcance: '9 metros', componentes: 'V, S, M', material: 'um pequeno pedaço de carne de porco',
  duracao: 'Até dispelida', concentracao: false, ritual: true,
  desc: 'Você implanta uma mensagem dentro de um objeto, no espaço que você ocupa. A mensagem é proferida em voz alta quando uma criatura ou outro gatilho especificado se aproxima dentro de 9 metros, sem precisar poder ver o objeto. A boca consiste em movimentos animados na área onde você lançou a magia e fala a mensagem com sua própria voz ou outra escolhida.'
},
{
  nome: 'Cativar', nivel: 2, escola: 'encantamento', classes: ['Bardo','Bruxo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você tece um cordão de palavras distrativas, fazendo as criaturas, à sua escolha, que você puder ver dentro do alcance e que puderem ouvir você, realizarem um teste de Sabedoria. Se falhar na resistência, a criatura terá desvantagem em testes de Sabedoria (Percepção) feitos para notar qualquer criatura além de você, até a magia acabar ou até o alvo não poder mais ouvir você.'
},
{
  nome: 'Cegueira/Surdez', nivel: 2, escola: 'necromancia', classes: ['Bardo','Clérigo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você pode cegar ou ensurdecer um inimigo. Escolha um alvo que você possa ver dentro do alcance para fazer um teste de Constituição. Se falhar, fica cego ou surdo (você escolhe) pela duração. Ao fim de cada um de seus turnos, o alvo pode repetir o teste, terminando o efeito sobre si com sucesso.'
},
{
  nome: 'Despedaçar', nivel: 2, escola: 'evocacao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedaço de couraça mineral',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um som estridente, ampliado magicamente para um volume devastador, fere uma criatura ou objeto à sua escolha que você possa ver dentro do alcance. Ele deve fazer um teste de Constituição, sofrendo 3d8 de dano de trovão em caso de falha, ou metade em caso de sucesso. Em Níveis Superiores: o dano aumenta em 1d8 para cada nível acima do 2°.'
},
{
  nome: 'Detectar Pensamentos', nivel: 2, escola: 'adivinhacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de cobre',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Pela duração, você pode ler os pensamentos superficiais de certas criaturas. Quando conjura a magia e em cada um dos seus turnos até o fim, você pode focar a mente em uma criatura que possa ver até 9 metros. Se a criatura tiver Inteligência 3 ou menos, ou não falar idioma algum, ela é imune. No primeiro turno em que sondar a mente do alvo, você aprende a superfície de seus pensamentos.'
},
{
  nome: 'Encontrar Armadilhas', nivel: 2, escola: 'adivinhacao', classes: ['Clérigo','Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você sente a presença de qualquer armadilha dentro do alcance que esteja a até 36 metros de você. Para os fins dessa magia, uma armadilha inclui qualquer coisa que ofereça perigo, mas que não seja por si só naturalmente perigosa. A magia apenas revela a existência de uma armadilha, não sua localização exata.'
},
{
  nome: 'Encontrar Montaria', nivel: 2, escola: 'conjuracao', classes: ['Paladino'],
  tempo: '10 minutos', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você invoca um espírito que assume a forma de uma montaria poderosa e fiel, à sua escolha entre cavalo de guerra, pônei de guerra, camelo, alce ou mastim de guerra. Aparece em um espaço desocupado dentro do alcance. A montaria tem as estatísticas do animal escolhido, mas é de tipo celestial, corruptor ou fada. Você pode se comunicar telepaticamente com ela enquanto estiver a até 1,6 km.'
},
{
  nome: 'Escuridão', nivel: 2, escola: 'evocacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, M', material: 'um pedaço de pele de morcego e carvão',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Trevas mágicas se espalham de um ponto que você escolher dentro do alcance, criando uma esfera de trevas com raio de 4,5 metros pela duração. As trevas se espalham ao redor de cantos. Uma criatura com visão no escuro não consegue ver através dessa escuridão, e luz não-mágica não a ilumina.'
},
{
  nome: 'Esfera Flamejante', nivel: 2, escola: 'conjuracao', classes: ['Druida','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedaço de cera e estopa',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma esfera de fogo do tamanho de uma bola de boliche surge em um espaço aberto à sua escolha dentro do alcance, persistindo pela duração. Qualquer criatura que termine seu turno a até 1,5 metro da esfera deve realizar um teste de Destreza, sofrendo 2d6 de dano de fogo em caso de falha, ou metade em caso de sucesso. Como ação bônus, você pode mover a esfera até 9 metros. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 2°.'
},
{
  nome: 'Imagem Espelhada', nivel: 2, escola: 'ilusao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Três imagens ilusórias suas se criam no seu espaço. Pela duração, as imagens se movem com você e imitam suas ações. Cada vez que uma criatura te ataca enquanto a magia estiver ativa, role 1d20 para determinar se o ataque acerta uma das imagens, ao invés de você. Uma imagem tem CA 10 + seu modificador de Destreza, e é destruída se for atingida.'
},
{
  nome: 'Imobilizar Pessoa', nivel: 2, escola: 'encantamento', classes: ['Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedacinho de metal retorcido',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Escolha um humanoide que você possa ver dentro do alcance. O alvo deve realizar um teste de Sabedoria ou ficará paralisado pela duração. Ao fim de cada um de seus turnos, o alvo pode repetir o teste de resistência, terminando o efeito sobre si com sucesso. Em Níveis Superiores: pode afetar um humanoide adicional para cada nível de magia acima do 2°, devendo estar a 9 metros entre si.'
},
{
  nome: 'Invisibilidade', nivel: 2, escola: 'ilusao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um cílio envolto em goma arábica',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Uma criatura que você tocar se torna invisível até a magia terminar. Qualquer coisa que o alvo esteja vestindo ou carregando fica invisível enquanto estiver de posse dele. A magia termina para o alvo caso ele ataque ou conjure uma magia. Em Níveis Superiores: pode afetar um humanoide adicional para cada nível acima do 2°, devendo estar a 9 metros entre si.'
},
{
  nome: 'Levitação', nivel: 2, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um filamento de pena pequeno torcido em formato de garfo',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Uma criatura ou objeto à sua escolha que você possa ver dentro do alcance flutua no ar e fica suspenso a 6 metros do solo durante a duração. A magia pode levitar um alvo que pese até 230 kg. Uma criatura não-disposta tem direito a um teste de Constituição para evitar o efeito.'
},
{
  nome: 'Localizar Objeto', nivel: 2, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Druida','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um vergalho de ferro',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você sente a direção de um objeto familiar. Pode buscar a localização de um objeto específico ou pesquisar pelo tipo mais próximo de um objeto genérico, desde que você o tenha visto de perto antes. A magia detecta o objeto se estiver dentro de 1,6 km, mas não funciona se houver até mesmo uma fina camada de chumbo bloqueando o caminho direto.'
},
{
  nome: 'Lufada de Vento', nivel: 2, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (linha de 18 metros)', componentes: 'V, S, M', material: 'uma pena de leque',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma rajada de vento sopra em direção a uma linha de 18 metros por 3 metros de largura, originária de você, pela duração. Cada criatura que começa seu turno na linha deve realizar um teste de Força ou ser empurrada 4,5 metros para longe de você. A magia dissipa gases e vapores, apaga chamas pequenas e provoca turbulência em chamas grandes na área.'
},
{
  nome: 'Mensageiro Animal', nivel: 2, escola: 'encantamento', classes: ['Bardo','Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um pouco de comida',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Por meio dessa magia, você usa um animal minúsculo para entregar uma mensagem. Escolha uma besta Minúscula que você possa ver dentro do alcance, como esquilo, pássaro ou morcego. Você especifica uma localização que conheça e uma descrição de aparência ou nome de criatura. A criatura viaja para a localização pela duração da magia, entregando sua mensagem.'
},
{
  nome: 'Nublar', nivel: 2, escola: 'ilusao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Sua imagem fica embaçada, mudando de forma e cor de maneira sutil, pela duração. Qualquer criatura tem desvantagem em jogadas de ataque contra você. Um atacante é imune a esse efeito se não depender da visão para atingi-lo, ou se conseguir ver através de ilusões de outra forma.'
},
{
  nome: 'Nuvem de Adagas', nivel: 2, escola: 'conjuracao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'uma adaga ou agulha de costura',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma nuvem de adagas espalhafatosas em um cubo de 1,5 metro centrado em um ponto à sua escolha dentro do alcance. A nuvem persiste pela duração. Qualquer criatura na área quando ela aparece, ou que entre na área pela primeira vez em um turno, deve realizar um teste de Destreza, sofrendo 4d4 de dano cortante em caso de falha, ou metade em caso de sucesso.'
},
{
  nome: 'Passo das Brumas', nivel: 2, escola: 'conjuracao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação bônus', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Brevemente envolto em névoa, você se teletransporta até 9 metros para um espaço desocupado que você possa ver.'
},
{
  nome: 'Passos Sem Pegadas', nivel: 2, escola: 'abjuracao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pouco de cinza de queimadeira de junípero',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você e criaturas amigáveis dentro de um raio de 9 metros de você se movem com furtividade aprimorada. Uma criatura que você escolher não pode ser monitorada exceto por meios mágicos, e qualquer rastro que deixe é extremamente difícil de seguir. Pela duração, você e as criaturas escolhidas que permanecerem na área recebem essa proteção.'
},
{
  nome: 'Patas de Aranha', nivel: 2, escola: 'transmutacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'uma gota de seiva pegajosa e um pelo de aranha',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Até a magia terminar, uma criatura disposta que você toca ganha a habilidade de se mover sem dificuldades em superfícies verticais e sobre tetos, sem precisar fazer testes de habilidade. O alvo também ganha deslocamento de escalada igual ao seu deslocamento normal.'
},
{
  nome: 'Pele de Árvore', nivel: 2, escola: 'transmutacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pouco de casca de árvore',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você toca uma criatura disposta. Pela duração, a pele do alvo assume uma aparência arborizada e a CA dela não pode ser inferior a 16, independente da armadura usada.'
},
{
  nome: 'Pirotecnia', nivel: 2, escola: 'transmutacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Escolha uma chama não-mágica que você possa ver dentro do alcance e que não exceda 1,5 metro cúbico. Você pode transformá-la em fogos de artifício brilhantes ou fumaça densa e escura. Fogos: emite luz brilhante em raio de 3 metros por 1 rodada e provoca explosão estridente, fazendo cada criatura a até 3 metros testar Constituição ou ficar atônita até o fim do seu próximo turno. Fumaça: cria névoa que se espalha em raio de 6 metros, fortemente obscurecendo por 1 minuto.'
},
{
  nome: 'Prece da Cura', nivel: 2, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '10 minutos', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Até seis criaturas à sua escolha dentro do alcance recuperam pontos de vida iguais a 2d8 + seu modificador de habilidade de conjuração. Essa magia não tem efeito sobre mortos-vivos ou constructos. Em Níveis Superiores: a cura aumenta em 1d8 para cada nível acima do 2°.'
},
{
  nome: 'Proteção Contra Veneno', nivel: 2, escola: 'abjuracao', classes: ['Clérigo','Druida','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura. Se estiver envenenada, você neutraliza o veneno. Se mais de um veneno a afetar, você neutraliza um deles que conheça estar presente, ou um aleatório se não souber. Pela duração, o alvo também ganha resistência a dano de veneno e vantagem em testes de resistência contra envenenamento.'
},
{
  nome: 'Raio Ardente', nivel: 2, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria três raios de fogo e os arremessa em alvos dentro do alcance. Você pode arremessá-los em um único alvo ou em vários. Faça um ataque mágico à distância para cada raio. Em caso de acerto, o alvo sofre 2d6 de dano de fogo. Em Níveis Superiores: a magia cria um raio adicional para cada nível acima do 2°.'
},
{
  nome: 'Raio do Enfraquecimento', nivel: 2, escola: 'necromancia', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pingo de óleo e água',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você aponta o dedo para uma criatura dentro do alcance. Sua vitalidade é drenada por um raio de energia negra. O alvo deve realizar um teste de Constituição, sofrendo 2d4 de dano necrótico e tendo desvantagem em jogadas de dano baseadas em Força até a magia terminar em caso de falha; em caso de sucesso, sofre apenas metade do dano. Em Níveis Superiores: o dano aumenta em 1d4 para cada nível acima do 2°.'
},
{
  nome: 'Raio Lunar', nivel: 2, escola: 'evocacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'várias lascas de pedra-lunar finamente trabalhadas e adornadas com prata',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Um raio de luz prateada brilha para baixo, formando um cilindro de luz de 1,5 metro de raio e 12 metros de altura, centrado em um ponto dentro do alcance. Cada criatura na área quando a magia é conjurada deve fazer um teste de Constituição, sofrendo 2d10 de dano radiante em caso de falha, ou metade em caso de sucesso. Em Níveis Superiores: o dano aumenta em 1d10 para cada nível acima do 2°.'
},
{
  nome: 'Reflexos', nivel: 2, escola: 'ilusao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Três imagens ilusórias suas se criam no seu espaço, imitando suas ações e se deslocando com você. Sempre que uma criatura te ataca enquanto a magia estiver ativa, role um dado para determinar se o ataque acerta uma das imagens em vez de você. Uma imagem tem CA 10 + seu Destreza e é destruída se atingida.'
},
{
  nome: 'Restauração Menor', nivel: 2, escola: 'abjuracao', classes: ['Bardo','Clérigo','Druida','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura e pode eliminar uma doença ou acabar com uma das seguintes condições afetando-a: cego, surdo, paralisado ou envenenado.'
},
{
  nome: 'Sentido Bestial', nivel: 2, escola: 'adivinhacao', classes: ['Bardo','Bruxo','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você toca uma besta disposta. Pela duração, você pode usar sua ação para ver através dos olhos da besta e ouvir o que ela ouve, até o fim de seu próximo turno, ganhando os benefícios de quaisquer sentidos especiais que aquela besta possua, mas ficando cego e surdo em relação aos seus próprios sentidos.'
},
{
  nome: 'Silêncio', nivel: 2, escola: 'ilusao', classes: ['Bardo','Clérigo','Patrulheiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: true,
  desc: 'Pela duração, nenhum som pode ser criado dentro ou passar por uma esfera de raio 6 metros centrada em um ponto que você escolher dentro do alcance. Qualquer criatura ou objeto totalmente dentro da esfera fica imune a dano por trovão, e criaturas ficam ensurdecidas enquanto estiverem totalmente dentro dela. Conjurar magias que exigem componentes verbais é impossível ali.'
},
{
  nome: 'Sugestão', nivel: 2, escola: 'encantamento', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, M', material: 'um pedacinho de linguiça de cobra',
  duracao: 'Concentração, até 8 horas', concentracao: true, ritual: false,
  desc: 'Você sugere um curso de atividade (não mais que algumas frases) e mistura magicamente sua sugestão com comandos sociais e mágicos para induzir uma criatura escolhida que você possa ver dentro do alcance, capaz de ouvir e entender você, a seguir essa sugestão. Ela deve realizar um teste de Sabedoria. Se falhar, ela segue o curso de ação sugerido o melhor que puder.'
},
{
  nome: 'Teia', nivel: 2, escola: 'conjuracao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pouco de teia de aranha',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você conjura uma massa de teia espessa e pegajosa em um ponto à sua escolha dentro do alcance. A teia preenche um cubo de 6 metros a partir desse ponto pela duração. A teia é terreno difícil e levemente obscurece a área. Cada criatura que comece seu turno na teia ou entre nela durante seu turno deve realizar um teste de Destreza, ficando impedida em caso de falha.'
},
{
  nome: 'Tranca Arcana', nivel: 2, escola: 'abjuracao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'ouro no valor de pelo menos 25 PO',
  duracao: 'Até dispelida', concentracao: false, ritual: false,
  desc: 'Você toca um objeto fechado, como porta, janela, baú ou portão, e o tranca. Você e criaturas escolhidas por você na conjuração podem abrir o objeto normalmente. Você também pode dar uma frase-senha que, quando falada a até 1,5 metro do objeto, suspende essa proteção por 1 minuto. Forçar a abertura exige conjuração de magia de Dissipar Magia de nível igual ou superior.'
},
{
  nome: 'Truque de Corda', nivel: 2, escola: 'transmutacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pedaço de corda de até 1,5 metro',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você toca uma corda de até 1,8 metro de comprimento. Uma das extremidades da corda se eleva ao ar, e a corda fica rígida o suficiente para subir. No topo, abre-se um espaço extradimensional invisível que dura até a magia terminar. O espaço pode conter até oito criaturas Médias. Você e qualquer criatura no espaço pode puxar a corda para dentro, fazendo a corda e o espaço desaparecerem do plano original.'
},
{
  nome: 'Ver o Invisível', nivel: 2, escola: 'adivinhacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'pó de cílio de gato, queimado em pequeno braseiro com uma chama de incenso',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Pela duração, você vê criaturas e objetos invisíveis como se fossem visíveis, e pode ver no plano etéreo. Criaturas e objetos etéreos aparecem fantasmagóricos e translúcidos.'
},
{
  nome: 'Vínculo Protetor', nivel: 2, escola: 'abjuracao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'duas alianças de metal pequenas, idênticas',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Esse vínculo cria um elo mágico entre você e outra criatura disposta dentro do alcance. Enquanto ambos estiverem a até 9 metros um do outro, o alvo recebe um bônus de +1 na CA e nos testes de resistência se você sofrer dano. Em vez disso, você sofre metade do dano que ele sofreria, e ele não sofre nada. A magia termina se você cair a 0 PV ou se ambos ficarem a mais de 9 metros pela duração total.'
},
{
  nome: 'Visão no Escuro', nivel: 2, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'uma pitada de baga de cenoura seca',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura disposta para concedê-la a habilidade de ver no escuro. Pela duração, a criatura tem visão no escuro com alcance de 18 metros.'
},
{
  nome: 'Zona da Verdade', nivel: 2, escola: 'encantamento', classes: ['Bardo','Clérigo','Paladino'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '10 minutos', concentracao: false, ritual: true,
  desc: 'Você cria uma esfera mágica de verdade com raio de 4,5 metros, centrada em um ponto à sua escolha dentro do alcance. Pela duração, uma criatura que entrar na área pela primeira vez ou começar seu turno nela deve realizar um teste de Carisma. Se falhar, é incapaz de falar uma deliberada inverdade enquanto permanecer na área. Você sabe se cada criatura passa ou falha no teste.'
},

// =============================== NÍVEL 3 ===============================
{
  nome: 'Ampliar Plantas', nivel: 3, escola: 'transmutacao', classes: ['Bardo','Druida','Patrulheiro'],
  tempo: '1 ação ou 8 horas', alcance: '45 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia canaliza vitalidade na vida vegetal próxima. Há dois usos para essa magia: Crescimento Súbito (a vegetação em um raio de 30 metros cresce e se torna terreno difícil por 1 minuto) ou Cultivar (multiplica o rendimento de qualquer cultura alimentícia na área pelo dobro do normal por 8 horas).'
},
{
  nome: 'Andar na Água', nivel: 3, escola: 'transmutacao', classes: ['Clérigo','Druida','Feiticeiro','Patrulheiro'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um pedaço de rolha de cortiça',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Essa magia concede a habilidade de se mover sobre qualquer superfície líquida, como água, ácido, lama, neve, areia movediça ou lava, como se fosse terreno sólido e plano, a até dez criaturas dispostas que você possa ver dentro do alcance. Uma criatura afetada que esteja completamente submersa em um líquido é elevada à superfície do líquido a uma taxa de 18 metros por rodada.'
},
{
  nome: 'Animar os Mortos', nivel: 3, escola: 'necromancia', classes: ['Clérigo','Mago'],
  tempo: '1 minuto', alcance: '3 metros', componentes: 'V, S, M', material: 'uma pitada de poeira de ossos e uma gota de sangue',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia cria um morto-vivo obediente. Escolha um cadáver ou pilha de ossos de criatura Média ou Pequena dentro do alcance. Sua magia o reveste de energia tenebrosa, dando vida a um esqueleto ou zumbi servil sob seu controle. Em Níveis Superiores: anima dois mortos-vivos adicionais para cada nível de magia acima do 3°, devendo todos receber comandos no mesmo turno.'
},
{
  nome: 'Bola de Fogo', nivel: 3, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'uma pequena bolinha de excremento de morcego e enxofre',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um brilho fulgurante surge de um ponto que você escolher dentro do alcance e então se expande em uma explosão de chamas com 6 metros de raio. Cada criatura nessa área deve realizar um teste de resistência de Destreza, sofrendo 8d6 de dano de fogo em caso de falha, ou metade desse dano em caso de sucesso. O fogo se propaga ao redor de cantos e incendeia objetos inflamáveis desprotegidos. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 3°.'
},
{
  nome: 'Círculo Mágico', nivel: 3, escola: 'abjuracao', classes: ['Bruxo','Clérigo','Mago','Paladino'],
  tempo: '1 minuto', alcance: '3 metros', componentes: 'V, S, M', material: 'água benta ou ferro prateado, e incenso',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você cria um cilindro de poder mágico protetor de 3 metros de raio que se estende por 6 metros de altura, centrado e voltado para você. Escolha um ou mais dos tipos de criaturas a seguir: celestiais, elementais, fadas, corruptores, mortos-vivos. O círculo afeta uma criatura do tipo escolhido das seguintes maneiras: ela não pode entrar voluntariamente na área, tem desvantagem nas jogadas de ataque contra alvos dentro do círculo, e alvos dentro do círculo não podem ser possuídos magicamente.'
},
{
  nome: 'Clarividência', nivel: 3, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Feiticeiro','Mago'],
  tempo: '10 minutos', alcance: '1,6 quilômetros', componentes: 'V, S, M', material: 'um botão de osso, vidro ou cristal, no valor de 100 PO',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você cria um sensor invisível dentro de um local que você possa ver, na sua faixa de alcance. O sensor permanece imóvel, mas pode perceber o ambiente como se você estivesse lá. Você escolhe visão ou audição ao conjurar, podendo usar sua ação para alternar entre os dois sentidos. Uma criatura que possa ver o sensor (como por Ver o Invisível) o reconhece como tal.'
},
{
  nome: 'Conjurar Animais', nivel: 3, escola: 'conjuracao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você convoca espíritos feéricos que assumem a forma de bestas e aparecem em espaços desocupados que você possa ver dentro do alcance. Escolha uma das opções a seguir: dois feras com desafio 2 ou menor, quatro com desafio 1 ou menor, ou oito com desafio 1/2 ou menor. Cada besta é amigável e obedece seus comandos verbais.'
},
{
  nome: 'Contra-Magia', nivel: 3, escola: 'abjuracao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 reação', alcance: '18 metros', componentes: 'S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você tenta interromper uma criatura no processo de conjurar uma magia. Se a criatura conjurar uma magia de nível 3 ou menos, sua magia falha sem efeito. Se conjurar uma magia de nível 4 ou superior, faça um teste de habilidade de conjuração contra CD 10 + nível da magia; se falhar, a magia falha sem efeito.'
},
{
  nome: 'Convocar Relâmpagos', nivel: 3, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Uma nuvem de tempestade surge e fica suspensa no ar dentro de um cilindro de raio 18 metros e altura 18 metros, centrado em um ponto que você possa ver acima de você. Quando conjura a magia, ou como ação em um turno futuro, você pode chamar um relâmpago da nuvem em qualquer ponto que você possa ver abaixo dela. Cada criatura em um cilindro de raio 1,5 metro deve fazer um teste de Destreza, sofrendo 3d10 de dano elétrico em caso de falha. Em Níveis Superiores: o dano aumenta em 1d10 para cada nível acima do 3°.'
},
{
  nome: 'Criar Comida e Água', nivel: 3, escola: 'conjuracao', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria 18 kg de comida e 45 litros de água em um ponto à sua escolha dentro do alcance, suficiente para sustentar até quinze humanoides ou cinco cavalos por 24 horas. A comida é simples mas nutritiva, e fica podre se não consumida em 24 horas.'
},
{
  nome: 'Dissipar Magia', nivel: 3, escola: 'abjuracao', classes: ['Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Mago','Paladino'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Escolha uma criatura, objeto ou efeito mágico dentro do alcance. Qualquer magia de nível 3 ou inferior afetando-o termina. Para cada magia de nível mais alto afetando, faça um teste de habilidade de conjuração contra CD 10 + nível da magia; em caso de sucesso, a magia termina.'
},
{
  nome: 'Enviar Mensagem', nivel: 3, escola: 'evocacao', classes: ['Bardo','Clérigo','Mago'],
  tempo: '1 ação', alcance: 'Ilimitado', componentes: 'V, S, M', material: 'um fio de cobre fino',
  duracao: '1 rodada', concentracao: false, ritual: true,
  desc: 'Você envia uma mensagem curta de até vinte e cinco palavras para uma criatura com a qual já tenha tido contato antes. A criatura ouve a mensagem na sua própria mente, reconhece você (se a conhecer) e pode responder brevemente, da mesma maneira, imediatamente.'
},
{
  nome: 'Falar com Mortos', nivel: 3, escola: 'necromancia', classes: ['Bardo','Clérigo'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V, S, M', material: 'incenso queimado e adornos funerários no valor de pelo menos 300 PO',
  duracao: '10 minutos', concentracao: false, ritual: true,
  desc: 'Você concede temporariamente a inteligência de um cadáver para que ele possa responder às suas perguntas. O cadáver deve ainda ter uma boca e não pode estar morto-vivo. A magia falha se o cadáver tiver morrido há mais de 10 dias. Você pode fazer até cinco perguntas; um cadáver hostil pode tentar resistir, e um indiferente recebe um teste de Sabedoria.'
},
{
  nome: 'Farol de Esperança', nivel: 3, escola: 'abjuracao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Essa magia traz esperança e vitalidade renovadas a até três criaturas dispostas que você possa ver dentro do alcance. Pela duração, as criaturas afetadas têm vantagem em testes de resistência de Sabedoria e testes de morte, e recuperam o máximo de pontos de vida possível de qualquer rolagem de cura.'
},
{
  nome: 'Forma Gasosa', nivel: 3, escola: 'transmutacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 minuto', alcance: '9 metros', componentes: 'V, S, M', material: 'uma laranja-de-coelho',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você transforma uma criatura disposta, juntamente com tudo que estiver vestindo e carregando, em uma forma nublada e disforme pela duração. A forma gasosa é incapaz de ações físicas e fala normais, mas pode se mover por brechas estreitas e voar lentamente, sendo resistente a danos não-mágicos.'
},
{
  nome: 'Guardiões Espirituais', nivel: 3, escola: 'conjuracao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 4,5 metros)', componentes: 'V, S, M', material: 'um pequeno emblema sagrado',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Espíritos sutis e fantasmagóricos saem de você e se movem com você pela duração, espreitando a 4,5 metros de raio. Você escolhe se assumem aparência amistosa ou aterrorizante. Quando uma criatura hostil à sua escolha entra na área pela primeira vez ou começa o turno lá, ela deve fazer um teste de Sabedoria, sofrendo 3d8 de dano radiante (boa) ou necrótico (má) em caso de falha, ou metade em caso de sucesso, e seu deslocamento é reduzido à metade até o seu próximo turno.'
},
{
  nome: 'Idiomas', nivel: 3, escola: 'adivinhacao', classes: ['Bardo','Bruxo','Clérigo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'pequenas porções de fuligem e cinzas',
  duracao: '1 hora', concentracao: false, ritual: true,
  desc: 'Essa magia concede à criatura que você toca a habilidade de entender qualquer idioma falado que ela ouvir. Além disso, quando o alvo fala, qualquer criatura que conheça pelo menos um idioma e possa ouvi-lo entende o que ela diz.'
},
{
  nome: 'Imagem Maior', nivel: 3, escola: 'ilusao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pouco de lã ou areia fina',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você cria a imagem de um objeto, criatura ou outro fenômeno visível que tenha até 6 metros em cada lado. A imagem aparece em um local à sua escolha dentro do alcance e dura pela duração. Ela inclui efeitos sonoros, olfativos e térmicos sutis suficientes para convencer ao toque. Você pode usar sua ação para mover a imagem dentro do alcance e mudar como ela se parece, soa ou cheira.'
},
{
  nome: 'Indetectável', nivel: 3, escola: 'abjuracao', classes: ['Bardo','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pitada de diamante em pó no valor de 25 PO, espalhada sobre o alvo',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Pela duração, você esconde um alvo de adivinhação. O alvo pode ser uma criatura disposta ou um local ou objeto que não exceda 3 metros cúbicos. O alvo não pode ser encontrado por magia de adivinhação, como Escrutínio, e não pode ser visto através de sensores criados por magia de adivinhação.'
},
{
  nome: 'Lentidão', nivel: 3, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pingo de melaço',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você altera o tempo em torno de até seis criaturas à sua escolha em um cubo de 12 metros dentro do alcance. Cada alvo deve realizar um teste de Sabedoria. Em caso de falha, o deslocamento de uma criatura afetada é reduzido à metade, ela tem -2 na CA e em testes de Destreza, e não pode usar reações; em seu turno, pode usar uma ação ou ação bônus, não as duas. Ao fim de cada um de seus turnos, ela pode repetir o teste.'
},
{
  nome: 'Luz do Dia', nivel: 3, escola: 'evocacao', classes: ['Clérigo','Druida','Feiticeiro','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Um esfera de luz com 18 metros de raio surge de um ponto à sua escolha dentro do alcance. A esfera emite luz forte e luz fraca por mais 18 metros. Se você escolher um ponto em um objeto que você está carregando ou que não está sendo carregado nem usado, a luz brilha do objeto e se move com ele. Cobrir totalmente a fonte de luz com algo opaco bloqueia a luz. A luz dissipa escuridão mágica criada por uma magia de nível 3 ou inferior na área.'
},
{
  nome: 'Maremoto', nivel: 3, escola: 'conjuracao', classes: ['Druida','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'uma gota de água',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você invoca uma onda d\'água que se ergue e despenca sobre uma área que você escolher dentro do alcance. A área pode ter até 9 metros de comprimento, 3 metros de largura e 3 metros de altura. Cada criatura na área deve fazer um teste de Força, sofrendo 4d8 de dano contundente e sendo derrubada e empurrada 3 metros para longe da onda em caso de falha.'
},
{
  nome: 'Medo', nivel: 3, escola: 'ilusao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (cone de 9 metros)', componentes: 'V, S, M', material: 'uma pena de pássaro branco',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você projeta uma fantasmagoria que apenas as criaturas dentro de um cone de 9 metros, originário de você, conseguem ver. Cada criatura na área deve realizar um teste de Sabedoria. Em caso de falha, ela fica amedrontada pela duração. A criatura amedrontada deve usar a ação Largar Tudo (deixando cair o que estiver carregando) e seu deslocamento até se afastar o máximo possível de você.'
},
{
  nome: 'Mesclar-se à Rocha', nivel: 3, escola: 'transmutacao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você toca uma pedra natural de tamanho suficiente para conter seu corpo, e você e equipamento que esteja carregando se fundem na rocha pela duração. Enquanto fundido, você não pode ver fora da rocha e qualquer teste de Sabedoria (Percepção) feito para ouvir sons fora dela tem desvantagem.'
},
{
  nome: 'Muralha de Água', nivel: 3, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'uma gota de água',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você conjura uma parede de água que aparece em um ponto à sua escolha dentro do alcance e dura pela duração. Você pode fazê-la em até quatro painéis adjacentes de 1,5 metro quadrado e até 0,3 metro de espessura, ou criá-la na forma de um anel com raio de até 3 metros, com altura e espessura iguais. A água da parede extingue chamas expostas na área. Cada criatura que entre nela pela primeira vez ou termine o turno lá deve realizar um teste de Constituição.'
},
{
  nome: 'Muralha de Vento', nivel: 3, escola: 'evocacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'uma pena de pássaro',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma parede de vento forte surge em uma linha no chão dentro do alcance. A parede pode ter até 15 metros de comprimento, 4,5 metros de altura e 0,3 metro de espessura. Você pode moldá-la livremente dentro dessas limitações. O vento forte na parede dificulta o movimento através dela, derruba criaturas pequenas ou menores que tentem atravessar, defleete gases, e dispersa fumaça e névoa não-mágicas.'
},
{
  nome: 'Nevasca', nivel: 3, escola: 'conjuracao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'um pequeno pedaço de quartzo',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Granizo prejudicial e chuva gelada e escorregadia caem em uma área cilíndrica de 6 metros de raio e 6 metros de altura, centrada em um ponto dentro do alcance. A área fica fortemente obscurecida e chamas expostas na área são extintas. O chão na área torna-se terreno difícil até o fim da magia, devido ao gelo acumulado.'
},
{
  nome: 'Névoa Fétida', nivel: 3, escola: 'conjuracao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'um ovo podre ou folhas de repolho podre',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma esfera de gás nojento e amarelado com raio de 6 metros, centrada em um ponto à sua escolha dentro do alcance. O gás se espalha ao redor de cantos e a área é fortemente obscurecida. Cada criatura totalmente dentro da névoa no início de seu turno deve realizar um teste de Constituição, ficando atônita pela duração em caso de falha. Ao fim de cada um dos seus turnos, ela pode repetir o teste, terminando o efeito sobre si com sucesso.'
},
{
  nome: 'Padrão Hipnótico', nivel: 3, escola: 'ilusao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'S, M', material: 'um aparelho figural ou pedras coloridas em formato cristalino',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria um padrão fascinante e cintilante que pode se mover ou ondular em um cubo de 9 metros dentro do alcance. Cada criatura na área quando a magia é conjurada deve realizar um teste de Sabedoria. Em caso de falha, fica enfeitiçada por você pela duração. Enquanto enfeitiçada, fica atônita e o efeito termina se sofrer dano ou se outra pessoa usar uma ação para abanar a mão na frente do alvo.'
},
{
  nome: 'Palavra de Cura em Massa', nivel: 3, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Pronunciando uma palavra de poder, você pode curar até seis criaturas de sua escolha que você possa ver dentro do alcance. Cada alvo recupera pontos de vida iguais a 1d4 + seu modificador de habilidade de conjuração. Essa magia não tem efeito sobre mortos-vivos ou constructos. Em Níveis Superiores: a cura aumenta em 1d4 para cada nível acima do 3°.'
},
{
  nome: 'Piscar', nivel: 3, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'uma pedra de quartzo cinza fumê',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você desaparece intermitentemente entre o Plano Material e o Plano Etéreo. Você é incapaz de afetar ou ser afetado por nada no outro plano. No fim de cada um dos seus turnos, role um d20; em um 11 ou superior, você fica no Plano Etéreo até seu próximo turno, depois retorna. Quando a magia termina, você reaparece em um espaço desocupado o mais próximo possível de onde você desapareceu.'
},
{
  nome: 'Proteção Contra Elementos', nivel: 3, escola: 'abjuracao', classes: ['Clérigo','Druida','Feiticeiro','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Pela duração, a criatura voluntária que você toca ganha resistência a um tipo de dano que você escolher: ácido, frio, fogo, elétrico ou trovão.'
},
{
  nome: 'Relâmpago', nivel: 3, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (linha de 30 metros)', componentes: 'V, S, M', material: 'pelo de pele de gato e um pedaço de âmbar, vidro ou cristal',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um raio de relâmpago se forma em uma linha de 30 metros de comprimento e 1,5 metro de largura, originário de você na direção que você escolher. Cada criatura na linha deve realizar um teste de Destreza, sofrendo 8d6 de dano elétrico em caso de falha, ou metade em caso de sucesso. O relâmpago incendeia objetos inflamáveis desprotegidos na área. Em Níveis Superiores: o dano aumenta em 1d6 para cada nível acima do 3°.'
},
{
  nome: 'Remover Maldição', nivel: 3, escola: 'abjuracao', classes: ['Bruxo','Clérigo','Mago','Paladino'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Em caso de toque, você acaba com todas as maldições afetando a criatura ou objeto. Se o objeto for um item mágico amaldiçoado, a maldição permanece, mas a magia rompe sua ligação com o portador, podendo então ser removido ou descartado normalmente.'
},
{
  nome: 'Respirar na Água', nivel: 3, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago','Patrulheiro'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma rajada curta de junco',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Essa magia concede a até dez criaturas dispostas que você possa ver dentro do alcance a habilidade de respirar embaixo da água até a magia terminar. Criaturas afetadas também retêm sua forma normal de respiração.'
},

// =============================== NÍVEL 4 ===============================
{
  nome: 'Banimento', nivel: 4, escola: 'abjuracao', classes: ['Bardo','Bruxo','Clérigo','Feiticeiro','Mago','Paladino'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um item de pelo menos 1.000 PO que represente o que está sendo banido',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você tenta enviar uma criatura que você possa ver dentro do alcance para outro plano de existência. O alvo deve realizar um teste de Carisma. Em caso de falha, fica preso em um bolso vazio de espaço não-espacial pela duração; se for nativo de outro plano, é enviado para lá ao fim da magia. Em Níveis Superiores: pode afetar uma criatura adicional para cada nível acima do 4°.'
},
{
  nome: 'Confusão', nivel: 4, escola: 'encantamento', classes: ['Bardo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'três nozes',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Essa magia atordoa as mentes de até criaturas em uma esfera de 9 metros de raio centrada em um ponto à sua escolha dentro do alcance. Cada criatura na área deve realizar um teste de Sabedoria, ficando confusa pela duração em caso de falha, não podendo agir normalmente e tendo que rolar um d10 a cada turno para determinar seu comportamento aleatório.'
},
{
  nome: 'Conjurar Elemental Menor', nivel: 4, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 minuto', alcance: '27 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você invoca um espírito elemental. Ele assume a forma de um elemental ar, terra, fogo ou água (à sua escolha) e aparece em um espaço desocupado dentro do alcance. O elemental desaparece quando reduzido a 0 PV ou quando a magia termina.'
},
{
  nome: 'Conjurar Fera Selvagem', nivel: 4, escola: 'conjuracao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você invoca um espírito feérico que assume a forma de uma fera ancestral feroz. Ele aparece em um espaço desocupado que você possa ver dentro do alcance e desaparece quando reduzido a 0 PV ou quando a magia termina. O espírito é amistoso a você e seus companheiros, lutando ao seu lado em combate.'
},
{
  nome: 'Convocar Visão Faminta', nivel: 4, escola: 'transmutacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '90 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você revela e ataca criaturas escondidas. Cada criatura escondida ou invisível em um cubo de 9 metros centrado em um ponto à sua escolha dentro do alcance sofre 4d10 de dano de força e tem sua localização revelada por uma marca brilhante até o fim da magia. Em caso de sucesso em um teste de Sabedoria, sofre metade do dano e não é marcada.'
},
{
  nome: 'Crescimento de Espinhos', nivel: 4, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'sete espinhos de qualquer planta espinhenta',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Essa magia transforma o terreno em uma área de 9 metros de raio centrada em um ponto à sua escolha dentro do alcance em terreno selvagem e intransitável pela duração. A área fica coberta com plantas, raízes e galhos espinhosos. Qualquer criatura que se mova através dessa área sofre 2d4 de dano cortante para cada 1,5 metro percorrido.'
},
{
  nome: 'Dimensão Trancada', nivel: 4, escola: 'conjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca um ponto no espaço e abre um portal vinculado a um pequeno espaço de bolso em outro plano que existe por 1 minuto. Você decide o que enviar para esse espaço: você mesmo, outras criaturas dispostas, ou objetos. Em um turno futuro, você pode usar uma ação para abrir outro portal para o espaço de bolso, mas se você não tiver feito isso quando o tempo se esgotar, qualquer coisa nesse espaço fica presa lá permanentemente.'
},
{
  nome: 'Domínio de Plantas', nivel: 4, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você adquire controle sobre plantas inofensivas e mundanas dentro do alcance, podendo escolher um dos seguintes efeitos: Movimento Restrito (planta cresce e prende uma criatura), Caminho Aberto (cria um caminho seguro de até 9 metros através de terreno espinhoso ou cipós), ou Levantar Plantas (libera plantas de raiz para formar uma barreira temporária de até 12 metros de comprimento e 3 metros de altura).'
},
{
  nome: 'Encantamento de Arma', nivel: 4, escola: 'transmutacao', classes: ['Bardo','Mago'],
  tempo: '1 hora', alcance: 'Toque', componentes: 'V, S, M', material: 'limalha de ferro e pedra-ímã',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você toca uma arma não-mágica. Até a magia terminar, essa arma se torna uma arma mágica.'
},
{
  nome: 'Escudo da Fé', nivel: 4, escola: 'abjuracao', classes: ['Clérigo','Paladino'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pequeno espelho de prata polida',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você cria uma esfera protetora de força ao redor de uma criatura dentro do alcance. A esfera dura pela duração. Qualquer ataque corpo a corpo direcionado ao alvo protegido tem desvantagem, e o alvo não pode ser alvo de qualquer ataque ou magia de outro plano de existência.'
},
{
  nome: 'Forma de Árvore', nivel: 4, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 minuto', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pingo de seiva coletada de uma árvore viva',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você se transforma, junto a tudo que estiver carregando, em uma árvore grande e disforme por 8 horas. Você ganha resistência a dano contundente enquanto estiver nessa forma. Você é incapaz de se mover ou falar e pode ser confundido com uma árvore comum por uma inspeção casual.'
},
{
  nome: 'Geleira', nivel: 4, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '90 metros', componentes: 'V, S, M', material: 'um pedaço de marfim no valor de pelo menos 150 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma onda de ar frio e cristais de gelo se irradia de você. Cada criatura em um cubo de 18 metros originário de você deve realizar um teste de Constituição. Em caso de falha, sofre 4d8 de dano de frio e fica gravemente ferida pelo frio, sofrendo desvantagem em ataques e testes de habilidade até o fim de seu próximo turno; em caso de sucesso, sofre metade do dano sem outros efeitos.'
},
{
  nome: 'Globo de Invulnerabilidade', nivel: 4, escola: 'abjuracao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 3 metros)', componentes: 'V, S, M', material: 'um pedaço pequeno de pó de diamante e água benta',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Um globo translúcido de força protetora envolve você e se estende em um raio de 3 metros pela duração. Qualquer magia de nível 4 ou inferior que tentar entrar no globo não tem efeito.'
},
{
  nome: 'Guardião de Fé', nivel: 4, escola: 'conjuracao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um pequeno emblema sagrado no valor de pelo menos 5 PO',
  duracao: 'Até dispelido ou exaurido', concentracao: false, ritual: false,
  desc: 'Você convoca uma entidade espectral semelhante a uma armadura cheia de espinhos para guardar um local. Ela aparece em um espaço desocupado dentro do alcance e permanece pela duração. Qualquer criatura hostil que entre no espaço pela primeira vez ou que comece o turno lá deve fazer um teste de Sabedoria, sofrendo 4d10 de dano radiante ou necrótico (sua escolha) em caso de falha, ou metade em caso de sucesso. O guardião desaparece após causar 60 pontos de dano cumulativo.'
},
{
  nome: 'Identidade Verdadeira', nivel: 4, escola: 'adivinhacao', classes: ['Mago'],
  tempo: '1 minuto', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um espelho com molduras de prata no valor de pelo menos 25 PO',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Pela duração, você vê coisas como elas realmente são. Você tem visão verdadeira, vendo no escuro a até 36 metros, percebendo formas alteradas (vendo a forma verdadeira de criaturas transformadas, polimorfadas ou metamorfoseadas), e detectando ilusões visuais e a presença de matéria etérea ou no Plano Etéreo.'
},
{
  nome: 'Invocar Sombras', nivel: 4, escola: 'ilusao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de pano que foi parte de uma mortalha funerária',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma área de escuridão mágica em uma esfera de 4,5 metros de raio centrada em um ponto que você possa ver dentro de 36 metros. A escuridão se espalha ao redor de cantos. Uma criatura com visão no escuro não consegue ver através dela, e luz não-mágica não a ilumina. Pela duração, você pode invocar criaturas das sombras a cada turno como ação bônus.'
},
{
  nome: 'Liberdade de Movimento', nivel: 4, escola: 'abjuracao', classes: ['Bardo','Clérigo','Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pedaço de couro trançado ao redor de seu braço durante a conjuração',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura disposta. Pela duração, o movimento do alvo não é afetado por terreno difícil, e magias e outros efeitos mágicos não podem reduzir o deslocamento do alvo, nem fazê-la ficar paralisada ou impedida. O alvo também pode gastar 1,5 metro de movimento para se libertar automaticamente se estiver agarrado.'
},
{
  nome: 'Localizar Criatura', nivel: 4, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Druida','Paladino','Patrulheiro'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de pelo da criatura que você está caçando',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Descreva ou nomeie uma criatura familiar a você. Você sente a direção da localização da criatura, desde que esteja a até 480 km. Se a criatura estiver se movendo, você sabe a direção desse movimento. A magia não funciona se a criatura estiver completamente debaixo da água ou se uma fina camada de chumbo bloquear o caminho direto.'
},
{
  nome: 'Mãos Ardentes de Otiluke', nivel: 4, escola: 'evocacao', classes: ['Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma esfera pequena de cristal ou vidro',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria mãos espectrais translúcidas no ar em um cubo de 3 metros dentro do alcance. As mãos persistem pela duração e empurram todas as criaturas na área para fora, fazendo qualquer criatura que comece seu turno lá realizar um teste de Força, sofrendo 5d8 de dano de força e ficando empurrada em caso de falha, ou metade do dano sem ser empurrada em caso de sucesso.'
},
{
  nome: 'Metamorfose', nivel: 4, escola: 'transmutacao', classes: ['Bardo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'uma lagarta',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Essa magia transforma uma criatura que você possa ver dentro do alcance em uma nova forma. Uma criatura não-disposta deve realizar um teste de Sabedoria. A nova forma pode ser de qualquer besta com valor de desafio igual ou inferior ao do alvo, e a criatura mantém sua mente e personalidade. A magia termina antes se a criatura cair a 0 PV ou morrer.'
},
{
  nome: 'Morte Súbita', nivel: 4, escola: 'necromancia', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pingo de óleo de sebo',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você envia negatividade sombria a uma criatura que você possa ver dentro do alcance, causando dor angustiante. O alvo deve realizar um teste de Constituição, sofrendo 10d10 de dano necrótico em caso de falha. Se esse dano reduzir o alvo a 0 PV, ele morre instantaneamente. Em caso de sucesso, sofre metade do dano. Em Níveis Superiores: o dano aumenta em 3d10 para cada nível acima do 4°.'
},
{
  nome: 'Muralha de Fogo', nivel: 4, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pequeno pedaço de fósforo',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma parede de fogo em um ponto que você possa ver dentro do alcance. Pode ser uma linha de até 18 metros de comprimento, 6 metros de altura e 0,3 metro de espessura, ou um anel de até 6 metros de diâmetro, 6 metros de altura e 0,3 metro de espessura. A parede é opaca e dura pela duração. Quando criada, escolha um lado para sofrer 5d8 de dano de fogo se uma criatura estiver dentro de 1,5 metro daquele lado.'
},
{
  nome: 'Olho Arcano', nivel: 4, escola: 'adivinhacao', classes: ['Mago'],
  tempo: '1 ação', alcance: '9 metros (depois ilimitado)', componentes: 'V, S, M', material: 'uma pena de morcego',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você cria um olho invisível e mágico dentro do alcance que flutua pela duração e que você pode mover livremente, transmitindo visão e audição para sua mente. O olho pode se mover em qualquer direção a até 9 metros por rodada, mas não pode entrar em outro plano de existência. Uma área de escuridão total bloqueia sua visão.'
},
{
  nome: 'Onda Glacial', nivel: 4, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pequeno pedaço de marfim na forma de um dente',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria uma onda de frio devastadora em uma área de 9 metros de comprimento, 3 metros de largura e 3 metros de altura dentro do alcance. Cada criatura na área deve fazer um teste de Constituição, sofrendo 10d8 de dano de frio em caso de falha, ou metade em caso de sucesso. Uma criatura que morre por esse dano fica congelada em um bloco de gelo. A água na área fica congelada e dura pela duração.'
},
{
  nome: 'Polimorfar', nivel: 4, escola: 'transmutacao', classes: ['Bardo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um casulo de borboleta',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Essa magia transforma uma criatura que você possa ver dentro do alcance em uma nova forma. Uma criatura não-disposta deve realizar um teste de Sabedoria. A nova forma pode ser qualquer besta com valor de desafio igual ou inferior ao da criatura (ou seu nível, se ela não tiver desafio). A criatura assume os pontos de vida e capacidades físicas da nova forma, mas mantém sua mente e personalidade.'
},
{
  nome: 'Profecia das Estrelas', nivel: 4, escola: 'adivinhacao', classes: ['Druida'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'um astrolábio no valor de pelo menos 200 PO',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você toca o desenho de uma constelação na hora em que conjura essa magia, concedendo a uma criatura disposta o benefício de uma das sete formas de poder estelar (Arqueiro, Caldeirão, Quimera, Coroa, Espada, Touro ou Vidente), cada uma com benefícios passivos e uma ativação especial enquanto a magia durar.'
},
{
  nome: 'Profecia de Bigby', nivel: 4, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação bônus', alcance: '36 metros', componentes: 'V, S, M', material: 'uma luva de couro com uma joia engastada no pulso',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma mão espectral de força surge e aparece em um espaço que você escolher dentro do alcance, persistindo pela duração. A mão é em formato de punho fechado, e você pode usar uma ação bônus para mover a mão até 18 metros e usá-la para socar, agarrar, empurrar ou proteger uma criatura, dependendo da forma escolhida ao conjurar.'
},
{
  nome: 'Reflexos do Cogumelo Venenoso', nivel: 4, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma nuvem de espinhos venenosos do tamanho de um cubo de 6 metros, centrada em um ponto à sua escolha dentro do alcance, que persiste pela duração. A área é fortemente obscurecida. Quando uma criatura entra na nuvem pela primeira vez em um turno ou começa o turno lá, ela deve fazer um teste de Constituição, sofrendo 6d4 de dano de veneno em caso de falha, ou metade em caso de sucesso.'
},
{
  nome: 'Restauração', nivel: 4, escola: 'abjuracao', classes: ['Bardo','Clérigo','Druida'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'água benta misturada com pó de prata e açafrão',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura e pode acabar com um dos seguintes efeitos: um efeito que reduz a pontuação de habilidade do alvo, ou que reduz o máximo de pontos de vida do alvo; uma maldição, incluindo a transformação imposta por uma magia de Polimorfar; paralisia; ou petrificação.'
},
{
  nome: 'Salva de Espinhos', nivel: 4, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'sete espinhos ou pequenos ramos espinhosos',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você faz com que espinhos afiados disparem em uma explosão de 9 metros de raio centrada em um ponto à sua escolha dentro do alcance. Cada criatura na área deve realizar um teste de Destreza, sofrendo 7d8 de dano perfurante em caso de falha, ou metade em caso de sucesso. As plantas não-mágicas na área se tornam terreno difícil até serem queimadas ou desbastadas.'
},
{
  nome: 'Tempestade de Gelo', nivel: 4, escola: 'evocacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '90 metros', componentes: 'V, S, M', material: 'uma pedra de granizo ou um pequeno pedaço de gelo',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Granizo afiado e prejudicial despenca em uma área cilíndrica de 6 metros de raio e 12 metros de altura, centrada em um ponto dentro do alcance. Cada criatura na área deve fazer um teste de Destreza, sofrendo 2d8 de dano contundente e 4d6 de dano de frio em caso de falha, ou metade desse dano em caso de sucesso. Plantas não-mágicas na área são destruídas pela tempestade, e o chão fica coberto de gelo escorregadio.'
},
{
  nome: 'Visão Verdadeira de Arcane', nivel: 4, escola: 'adivinhacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um unguento para os olhos no valor de 25 PO, feito de açafrão e outros ingredientes raros',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Essa magia confere visão verdadeira a uma criatura disposta que você tocar, dando a ela a habilidade de ver coisas como elas realmente são, por 24 horas. Esta visão permite à criatura ver no escuro normal e mágico a 36 metros, perceber criaturas invisíveis e visualizar a forma verdadeira de criaturas transformadas ou disfarçadas, além de detectar ilusões automaticamente.'
},

// =============================== NÍVEL 5 ===============================
{
  nome: 'Animar Objetos', nivel: 5, escola: 'transmutacao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Objetos animam-se à sua vontade. Escolha até dez objetos não-mágicos que estejam a até 9 metros uns dos outros, dentro do alcance. Pequenos objetos pesando até 11 kg ganham vida, batalhando por você. Você pode controlar até dez objetos animados simultaneamente, comandando-os como ação bônus.'
},
{
  nome: 'Antimagia, Campo de', nivel: 8, escola: 'abjuracao', classes: ['Clérigo','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 3 metros)', componentes: 'V, S, M', material: 'pó de ferro ou limalha de ferro',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Uma esfera invisível de força mágica antagônica envolve você em um raio de 3 metros e se move com você pela duração. Essa esfera suprime qualquer magia dentro dela, e qualquer criatura ou objeto invocado ou criado por magia desaparece momentaneamente. Magias de nível 8 ou inferior conjuradas dentro da esfera simplesmente não têm efeito.'
},
{
  nome: 'Banquete dos Heróis', nivel: 6, escola: 'conjuracao', classes: ['Clérigo','Druida'],
  tempo: '10 minutos', alcance: '9 metros', componentes: 'V, S, M', material: 'um pedaço de comida no valor de 1.000 PO, consumido',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você conjura um banquete que inclui água potável e comida farta o suficiente para alimentar até doze criaturas. A comida demora 1 hora para ser comida, e cada criatura que comer recebe diversos benefícios: imunidade a veneno e medo por 24 horas, vantagem em testes de resistência de Sabedoria, e os máximos de pontos de vida e pontos de vida atuais aumentam em 2d10.'
},
{
  nome: 'Chamar Relâmpago', nivel: 5, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Uma nuvem de tempestade surge e fica suspensa no ar dentro de um cilindro de 36 metros de raio e 36 metros de altura. Você pode causar um relâmpago descer da nuvem em um ponto que você possa ver abaixo dela, fazendo cada criatura a até 1,5 metro daquele ponto realizar um teste de Destreza, sofrendo 8d6 de dano elétrico em caso de falha, ou metade em caso de sucesso. Você pode fazer isso uma vez por turno até o fim da magia.'
},
{
  nome: 'Cone de Frio', nivel: 5, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (cone de 18 metros)', componentes: 'V, S, M', material: 'um pequeno pedaço de cristal ou vidro em formato de cone',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um cone de ar gélido se irradia de suas mãos. Cada criatura no cone de 18 metros deve fazer um teste de Constituição, sofrendo 8d8 de dano de frio em caso de falha, ou metade em caso de sucesso. Uma criatura morta por esse dano fica congelada em um bloco de gelo sólido. Em Níveis Superiores: o dano aumenta em 1d8 para cada nível acima do 5°.'
},
{
  nome: 'Contágio', nivel: 5, escola: 'necromancia', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '7 dias', concentracao: false, ritual: false,
  desc: 'Sua mão toca uma criatura, infectando-a com uma de várias doenças mágicas à sua escolha (peste do espinho, podridão da carne, febre cega, olho de fogo, queda do verme ou desperdício do oráculo). O alvo deve realizar um teste de Constituição; em caso de falha, fica imediatamente contaminado pela doença escolhida e ficar envenenado até a doença ser curada.'
},
{
  nome: 'Curar Feridas em Massa', nivel: 5, escola: 'evocacao', classes: ['Bardo','Clérigo','Druida'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma onda de energia que cura ferimentos varre uma área dentro do alcance. Escolha um ponto dentro do alcance: cada criatura em uma esfera de 9 metros de raio centrada nesse ponto recupera pontos de vida iguais a 5d8 + seu modificador de habilidade de conjuração. Essa magia não afeta mortos-vivos ou constructos. Em Níveis Superiores: a cura aumenta em 1d8 para cada nível acima do 5°.'
},
{
  nome: 'Dissipação Sonora', nivel: 6, escola: 'transmutacao', classes: ['Bardo'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V', material: null,
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Você cria um pulso sônico capaz de derrubar uma criatura. Faça um ataque mágico corpo a corpo contra uma criatura que você possa tocar. Em caso de acerto, a criatura sofre 4d6 de dano de trovão e deve fazer um teste de Constituição, ficando atônita até o fim do seu próximo turno em caso de falha.'
},
{
  nome: 'Domínio Animal', nivel: 5, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Essa magia faz com que até quatro bestas que você possa ver dentro do alcance fiquem encantadas com você. Bestas com Inteligência 4 ou mais não são afetadas. Cada alvo deve fazer um teste de Sabedoria, ficando encantado por você pela duração em caso de falha, obedecendo aos seus comandos verbais o melhor que puder.'
},
{
  nome: 'Esfera Arcana', nivel: 6, escola: 'evocacao', classes: ['Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'pó diamante no valor de 500 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria uma esfera de força que voa em direção a um ponto à sua escolha dentro do alcance e explode em uma rajada de energia mística. Cada criatura em uma esfera de 6 metros de raio centrada nesse ponto deve realizar um teste de Destreza, sofrendo 12d6 de dano de força em caso de falha, ou metade em caso de sucesso.'
},
{
  nome: 'Escudo de Estrelas de Bigby', nivel: 5, escola: 'evocacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 3 metros)', componentes: 'V, S, M', material: 'um pequeno pedaço de meteorito',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Pontos de luz estelar circulam você em um raio de 3 metros pela duração, concedendo luz fraca em todo o raio e o benefício de cobertura de meia-cobertura contra ataques à distância. Como ação bônus, você pode lançar um raio dessa luz contra uma criatura dentro de 36 metros, causando 4d12 de dano radiante em caso de acerto.'
},
{
  nome: 'Inveja de Bigby', nivel: 7, escola: 'evocacao', classes: ['Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pingo de cera derretida moldada em forma de pequena mão',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma mão grande, espectral e de força mágica aparece em um espaço desocupado dentro do alcance. A mão dura pela duração, e você pode atacar, agarrar, empurrar ou criar uma barreira protetora com ela usando uma ação bônus em cada um dos seus turnos.'
},
{
  nome: 'Legião de Vespas', nivel: 5, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'um pedaço de favo de mel e fumaça pungente',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Uma nuvem zumbidora de insetos espectrais e vorazes enche um cubo de 6 metros centrado em um ponto à sua escolha dentro do alcance. A nuvem se espalha ao redor de cantos e a área fica levemente obscurecida. A nuvem persiste pela duração. Quando ela aparece, cada criatura nela deve realizar um teste de Constituição, sofrendo 4d10 de dano perfurante em caso de falha, ou metade em caso de sucesso.'
},
{
  nome: 'Mãos Flamejantes Maior', nivel: 5, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (esfera de 9 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera uma onda de fogo destruidor. Cada criatura em uma esfera de 9 metros de raio centrada em você deve realizar um teste de Destreza, sofrendo 10d6 de dano de fogo em caso de falha, ou metade em caso de sucesso. O fogo incendeia objetos inflamáveis desprotegidos na área.'
},
{
  nome: 'Mãos Negras de Bigby', nivel: 5, escola: 'evocacao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'uma gota de tinta preta',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Lampejos de energia negra coalescem em uma forma humanoide sinistra dentro do alcance, persistindo pela duração. Em cada turno, você pode usar uma ação bônus para socar, esmagar, agarrar, oprimir ou proteger uma criatura usando a mão, infligindo dano de força ou outros efeitos dependendo da ação escolhida.'
},
{
  nome: 'Muralha de Pedra', nivel: 5, escola: 'evocacao', classes: ['Druida','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pequeno bloco de pedra de granito',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Uma seção de pedra sólida aparece em um ponto à sua escolha dentro do alcance e dura pela duração. Você pode moldar a parede em diversas formas, com painéis de 0,3 metro de espessura, cobrindo até trinta painéis de 1,5 metro quadrado. A parede tira material da terra ou pedra circundante, deixando um buraco proporcional ao tamanho da parede criada.'
},
{
  nome: 'Onda Trovejante Maior', nivel: 5, escola: 'evocacao', classes: ['Bardo','Druida'],
  tempo: '1 ação', alcance: 'Pessoal (cubo de 18 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera uma poderosa onda sônica originária de você. Cada criatura em um cubo de 18 metros originário de você deve realizar um teste de Constituição, sofrendo 8d6 de dano de trovão e sendo empurrada para longe em caso de falha, ou metade do dano sem ser empurrada em caso de sucesso.'
},
{
  nome: 'Passagem Planar', nivel: 5, escola: 'conjuracao', classes: ['Bruxo','Clérigo','Druida','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'um fragmento da pedra fundamental de Sigil',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você cria um portal que conecta um plano de existência específico (que você nomeia ou descreve) ao plano em que você está. O portal é uma área plana de até 3 por 4,5 metros, orientado como você escolher, permanecendo aberto pela duração. Qualquer criatura ou objeto que entre no portal aparece instantaneamente perto do portal correspondente no outro plano.'
},
{
  nome: 'Raio Solar', nivel: 6, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal (linha de 18 metros)', componentes: 'V, S, M', material: 'uma lente de aumento côncava',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Um feixe de luz brilhante se irradia de você em uma linha de 18 metros de comprimento e 1,5 metro de largura. Cada criatura na linha deve fazer um teste de Constituição, sofrendo 6d8 de dano radiante e ficando cega até o fim do seu próximo turno em caso de falha, ou metade em caso de sucesso sem ficar cega. Em cada turno até a magia terminar, você pode usar sua ação para criar o feixe novamente.'
},
{
  nome: 'Restauração Maior', nivel: 5, escola: 'abjuracao', classes: ['Bardo','Clérigo','Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'pó de diamante no valor de pelo menos 100 PO, consumido',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura e elimina um dos seguintes males: um nível de exaustão; uma redução em uma pontuação de habilidade; ou um efeito que reduz o máximo de pontos de vida da criatura.'
},
{
  nome: 'Telecinésia', nivel: 5, escola: 'transmutacao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você ganha a capacidade de mover ou manipular criaturas ou objetos pelo pensamento. Quando conjura a magia e como ação em cada turno até a magia terminar, você pode exercer sua vontade sobre uma coisa que você possa ver dentro do alcance, podendo movê-la, agarrá-la, empurrá-la, puxá-la ou usar contra criaturas.'
},
{
  nome: 'Teleportar Círculo', nivel: 5, escola: 'conjuracao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 minuto', alcance: '3 metros', componentes: 'V, M', material: 'pó de safira raro no valor de 50 PO espalhado em um círculo de 3 metros de diâmetro',
  duracao: '1 rodada', concentracao: false, ritual: false,
  desc: 'Você desenha um círculo de teletransporte de 3 metros de diâmetro consistindo em runas mágicas que ficam ativas até o final do seu próximo turno. O círculo conecta seu local a um círculo permanente de sua escolha que você visitou antes, dentro do mesmo plano de existência. Uma versão minúscula do círculo permanente correspondente aparece visualmente quando o círculo é conjurado, e qualquer criatura que entre no seu círculo é transportada instantaneamente para o destino.'
},
{
  nome: 'Visão Verdadeira', nivel: 6, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um unguento para os olhos no valor de 25 PO, feito de açafrão e outros ingredientes raros',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Essa magia concede visão verdadeira à criatura disposta que você tocar, dando a ela a habilidade de ver coisas como elas realmente são, pela duração. A criatura ganha visão no escuro até 36 metros, vê através de ilusões normais e mágicas, percebe a forma física verdadeira de criaturas alteradas ou disfarçadas, e pode ver no Plano Etéreo.'
},

// =============================== NÍVEL 6 (continuação) ===============================
{
  nome: 'Asas Anjicas', nivel: 6, escola: 'transmutacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'uma pequena pena branca',
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Asas espectrais surgem das suas costas pela duração, concedendo deslocamento de voo de 18 metros. Quando as asas aparecem, você pode usar uma reação imediata para envolver outra criatura em uma área de luz radiante, fazendo cada criatura hostil dentro de 1,5 metro realizar um teste de resistência ou sofrer dano radiante.'
},
{
  nome: 'Bigby Aceno', nivel: 8, escola: 'evocacao', classes: ['Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'uma luva',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma enorme mão translúcida de força mágica aparece em um espaço dentro do alcance, podendo socar, agarrar, empurrar ou criar uma barreira contra uma criatura ou objeto, com dano e efeitos consideráveis, refletindo o poder de um conjurador experiente.'
},
{
  nome: 'Comunhão', nivel: 5, escola: 'adivinhacao', classes: ['Clérigo'],
  tempo: '10 minutos', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: '1 minuto', concentracao: false, ritual: true,
  desc: 'Você entra em contato com sua divindade ou intermediários divinos e faz até três perguntas que possam ser respondidas com sim ou não. Você deve fazer as perguntas antes que a magia termine. Você recebe uma resposta correta para cada pergunta, ou um "não sei" se a divindade não souber ou for ambíguo.'
},
{
  nome: 'Conjurar Fada', nivel: 6, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S, M', material: 'um trevo de quatro folhas',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você convoca um espírito feérico. Ele aparece em um espaço desocupado que você possa ver dentro do alcance e assume uma forma à sua escolha: Olho Sorridente (uma esfera flutuante e enganosa) ou Fera Selvagem (um animal feérico poderoso). A criatura desaparece quando reduzida a 0 PV ou quando a magia termina.'
},
{
  nome: 'Conjurar Lacaios', nivel: 6, escola: 'conjuracao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '27 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você invoca lacaios espectrais em espaços desocupados que você possa ver dentro do alcance. Você pode invocar três lacaios de tamanho Médio, seis Pequenos, ou doze Minúsculos. Os lacaios são amistosos a você e seus companheiros, lutando ao seu lado em combate até desaparecerem.'
},
{
  nome: 'Criar Morto-Vivo', nivel: 6, escola: 'necromancia', classes: ['Clérigo'],
  tempo: '1 minuto', alcance: '3 metros', componentes: 'V, S, M', material: 'pó de rubi no valor de pelo menos 150 PO por cadáver',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você pode conjurar essa magia apenas durante a noite. Escolha até três cadáveres de humanoides Médios ou Pequenos dentro do alcance. Cada cadáver se torna um morto-vivo sob seu controle (ghoul, ou wight se for de elfo ou humano). Você comanda qualquer morto-vivo que você criou com essa magia, sem precisar manter concentração.'
},
{
  nome: 'Disfarce Verdadeiro', nivel: 6, escola: 'ilusao', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um pouco de pó de cogumelo',
  duracao: 'Concentração, até 1 hora (ou 24 horas em si mesmo)', concentracao: true, ritual: false,
  desc: 'Você transforma sua própria aparência, ou a de uma criatura disposta que você tocar. Você pode parecer com outra raça, ganhar uma altura ligeiramente diferente, ter uma aparência feia ou bela. A criatura transformada decide os detalhes da disfarce. A mudança não confere quaisquer benefícios mecânicos.'
},
{
  nome: 'Erupção da Terra', nivel: 5, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pedaço de pedra-pomes',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Detritos rochosos pontiagudos brotam do chão em um cubo de 6 metros centrado em um ponto à sua escolha dentro do alcance. Cada criatura na área deve realizar um teste de Destreza, sofrendo 3d12 de dano perfurante em caso de falha, ou metade em caso de sucesso. O terreno na área se torna terreno difícil até ser limpo.'
},
{
  nome: 'Geas', nivel: 5, escola: 'encantamento', classes: ['Bardo','Clérigo','Druida','Paladino'],
  tempo: '1 minuto', alcance: '18 metros', componentes: 'V', material: null,
  duracao: '30 dias', concentracao: false, ritual: false,
  desc: 'Você impõe magicamente um curso de ação (limitado a uma frase ou duas) a uma criatura que possa ver dentro do alcance e que possa ouvir e compreender você. O alvo deve realizar um teste de Sabedoria ou ficará enfeitiçado por você pela duração. Enquanto enfeitiçado, a criatura sofre dano psíquico se tomar ações claramente contrárias aos seus desígnios, ou se recusar a agir.'
},
{
  nome: 'Heroísmo Lendário', nivel: 6, escola: 'encantamento', classes: ['Bardo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, M', material: 'uma moeda de prata levada de um conflito heroico',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Use essa magia para infundir até 10 criaturas dentro do alcance com bravura e poder. Cada uma ganha vantagem nas próximas três jogadas de ataque ou testes de habilidade, e recebe um bônus de PV temporário considerável, refletindo o poder de uma lenda em batalha.'
},
{
  nome: 'Ilha Voadora', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 minuto', alcance: '36 metros', componentes: 'V, S, M', material: 'um pedaço de musgo e uma pedra pequena',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você faz com que uma porção de terra ou pedra rochosa de até 9 metros de diâmetro e 1,5 metro de profundidade dentro do alcance flutue no ar e fique sustentada lá pela duração, podendo até carregar estruturas e criaturas em cima.'
},
{
  nome: 'Implosão', nivel: 9, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você pronuncia uma palavra de poder destrutivo que pode despedaçar criaturas. Escolha até duas criaturas que você possa ver dentro do alcance. Cada alvo deve realizar um teste de Constituição. Em caso de falha, o corpo da criatura é violentamente comprimido em um espaço minúsculo, infligindo 10d10 de dano contundente e matando instantaneamente uma criatura que chegue a 0 PV. Em caso de sucesso, sofre 10d10 de dano contundente apenas.'
},
{
  nome: 'Incinerar', nivel: 6, escola: 'evocacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Um feixe brilhante e amarelo-vermelho de chama urgente surge de você em direção a um ponto dentro do alcance. Cada criatura em uma linha de 1,5 metro de largura entre você e o ponto deve realizar um teste de Destreza, sofrendo 10d8 de dano de fogo em caso de falha, ou metade em caso de sucesso. Objetos inflamáveis desprotegidos na linha são incendiados.'
},
{
  nome: 'Maldição dos Mortos-Vivos', nivel: 6, escola: 'necromancia', classes: ['Bruxo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'um pedaço de ossos quebrados e uma pitada de sal preto',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você marca um ser vivo dentro do alcance com uma maldição mortal. Na próxima vez que o alvo for reduzido a 0 PV antes que a maldição termine, ele se torna um morto-vivo sob seu controle, sofrendo as alterações da maldição que você escolher conjurar.'
},
{
  nome: 'Mover Terra', nivel: 6, escola: 'transmutacao', classes: ['Druida','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um saco de minhocas, um chifre cheio de pó de terra de toupeira e um caracol de cobre',
  duracao: 'Concentração, até 2 horas', concentracao: true, ritual: false,
  desc: 'Escolha uma área de terra ou pedra que você possa ver dentro do alcance que não exceda 12 metros de cada lado. Você pode esculpir colinas, valas, cavidades, montes ou outras formações similares dentro da área pela duração. A magia não pode esculpir uma estrutura mais fina do que 3 metros e não afeta a vegetação existente nem objetos na área.'
},
{
  nome: 'Olho de Asas e Garras', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'a pena de uma ave de rapina',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você assume a forma de uma criatura predatória voadora pela duração, ganhando deslocamento de voo elevado e sentidos aguçados, mantendo sua capacidade de falar e usar habilidades mentais enquanto na nova forma.'
},
{
  nome: 'Onda Sísmica', nivel: 8, escola: 'evocacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 27 metros)', componentes: 'V, S, M', material: 'uma pedra preciosa no valor de pelo menos 500 PO, consumida',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você causa um terremoto violento em um ponto à sua escolha dentro do alcance. Pela duração, ondas de terra tremulante e fendas se espalham da área, fazendo criaturas e estruturas testarem resistência contra dano contundente e desmoronamento de estruturas frágeis.'
},
{
  nome: 'Ondas de Fastio', nivel: 5, escola: 'necromancia', classes: ['Bardo','Bruxo'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 9 metros)', componentes: 'S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria uma onda de desespero existencial em torno de você. Cada criatura à sua escolha em um raio de 9 metros deve realizar um teste de Sabedoria, ficando atônita pela duração em caso de falha. Uma criatura atônita pode repetir o teste ao fim de cada um de seus turnos.'
},
{
  nome: 'Profecia do Vidente', nivel: 9, escola: 'adivinhacao', classes: ['Bardo','Clérigo','Druida','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, M', material: 'incenso e um cristal de prognóstico no valor de pelo menos 1.000 PO',
  duracao: '1 ano', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura disposta e oferece uma profecia limitada sobre o curso futuro de seus eventos. Você cria até três efeitos especiais: ela ganha vantagem em testes de habilidade, ataque ou resistência de um tipo específico; ela ganha resistência a um tipo de dano específico; ou ela ganha imunidade contra detecção mágica de um tipo específico, pela duração.'
},
{
  nome: 'Raio de Estrelas Cadentes', nivel: 5, escola: 'evocacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'um pequeno meteorito',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Fragmentos brilhantes de estrelas cadentes despencam em uma área que você escolher dentro do alcance, abrangendo uma esfera de 6 metros de raio. Cada criatura na área deve realizar um teste de Destreza, sofrendo 5d6 de dano de fogo e 5d6 de dano contundente em caso de falha, ou metade em caso de sucesso.'
},
{
  nome: 'Sonho', nivel: 5, escola: 'ilusao', classes: ['Bardo','Bruxo','Mago'],
  tempo: '1 minuto', alcance: 'Especial', componentes: 'V, S, M', material: 'uma pitada de areia, um pingo de tinta e uma pena de coruja arrancada',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Essa magia molda os sonhos de uma criatura. Escolha uma criatura conhecida por você para ser o alvo da magia. O alvo deve estar em algum lugar do mesmo plano de existência que você. Criaturas que não dormem, como elfos, não podem ser afetadas por essa magia. Você ou uma criatura escolhida por você experimenta um sonho à sua escolha, podendo entregar uma mensagem ou criar um pesadelo angustiante.'
},
{
  nome: 'Tempestade de Vingança', nivel: 9, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '1,6 quilômetros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma tempestade torrencial composta de chuva, granizo, vento e relâmpago surge e se centraliza em um ponto que você possa ver dentro do alcance, formando um cilindro de raio 18 metros e altura 9 mil metros, persistindo pela duração. Cada turno, você causa um efeito devastador adicional na área, como granizo causando dano contundente, ventos fortes que derrubam criaturas, ou relâmpagos que causam dano elétrico massivo.'
},
{
  nome: 'Terreno Espinhoso', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'sete agulhas de pinheiro afiadas',
  duracao: 'Até dispelido', concentracao: false, ritual: false,
  desc: 'Você transforma o terreno em uma área de até 15 metros de cada lado dentro do alcance em terreno selvagem retorcido pela duração. A área fica coberta de plantas tortuosas, raízes e espinhos. Qualquer criatura nessa área que tente atacar sofre dificuldades, e atravessar a área causa dano cortante automaticamente.'
},
{
  nome: 'Verdadeira Forma Polimórfica', nivel: 9, escola: 'transmutacao', classes: ['Bardo','Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S, M', material: 'pó de um casulo de mariposa-da-roupa e um pedaço de carapaça de besouro, ambos no valor de pelo menos 1.000 PO, consumidos',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Essa magia transforma uma criatura disposta dentro do alcance, ou a si mesmo, em outra criatura, em uma planta, ou de volta à sua forma original. A magia funciona em qualquer forma natural ou já vista, e a transformação dura pela duração ou até ser dissipada, podendo se tornar permanente se mantida pela duração completa.'
},

// =============================== NÍVEL 7 ===============================
{
  nome: 'Chuva de Fogo', nivel: 7, escola: 'evocacao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Chamas chovem do céu em um cilindro de raio 6 metros e altura 12 metros centrado em um ponto dentro do alcance. Cada criatura na área deve realizar um teste de Destreza, sofrendo 4d6 de dano de fogo e 4d6 de dano contundente em caso de falha, ou metade em caso de sucesso. Objetos inflamáveis desprotegidos pegam fogo.'
},
{
  nome: 'Dissipar Magia Maior', nivel: 6, escola: 'abjuracao', classes: ['Bardo','Clérigo','Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Escolha uma criatura, objeto ou efeito mágico dentro do alcance. Qualquer magia de nível 6 ou inferior afetando-o termina automaticamente. Para cada magia de nível 7 ou superior, faça um teste de habilidade de conjuração contra CD 10 + nível da magia.'
},
{
  nome: 'Divisão Etérea', nivel: 7, escola: 'transmutacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'um cubo de ferro forjado de 1 cm',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você toca uma criatura disposta para criar uma duplicata espectral incorpórea dela em outro plano de existência. A duplicata permanece pela duração e age sob seu controle limitado, podendo se mover e perceber o ambiente etéreo enquanto a criatura original permanece no plano material.'
},
{
  nome: 'Espinhos de Aço', nivel: 7, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'sete agulhas de ferro',
  duracao: 'Instantânea ou concentração, até 1 minuto', concentracao: false, ritual: false,
  desc: 'Você invoca sete agulhas de metal mágicas no ar a até 1,5 metro de uma criatura que você possa ver dentro do alcance. Você pode lançar as agulhas em um único alvo ou em até três, fazendo um ataque mágico à distância para cada agulha, infligindo dano perfurante considerável em caso de acerto.'
},
{
  nome: 'Etereidade', nivel: 7, escola: 'transmutacao', classes: ['Bardo','Clérigo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: 'Até 8 horas', concentracao: false, ritual: false,
  desc: 'Você entra no Plano Etéreo pela duração. Enquanto lá, você pode se mover em qualquer direção. Você pode ver e ouvir o plano que deixou, mas tudo parece monocromático e sons são abafados. Você não pode interagir com nada nem ser detectado por criaturas no Plano Material, a menos que algo lhe dê essa habilidade.'
},
{
  nome: 'Fenda de Mordenkainen', nivel: 7, escola: 'conjuracao', classes: ['Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'pó de obsidiana negra e bronze',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria um portal extraplanar limitado em um espaço dentro do alcance. Um vácuo aterrador surge na área, e qualquer criatura que entre nele pode ser arrastada para um plano aleatório e hostil de existência, à mercê do Mestre.'
},
{
  nome: 'Magia de Ferro de Mordenkainen', nivel: 7, escola: 'transmutacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'pó de chumbo, ferro fundido e mercúrio em pó',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você transforma a carne e os ossos de uma criatura disposta que você toca em ferro vivo. Pela duração, a Força do alvo aumenta consideravelmente, ele ganha resistência a dano cortante, perfurante e contundente, mas tem seu deslocamento reduzido devido ao peso.'
},
{
  nome: 'Movimento Translocacional', nivel: 7, escola: 'conjuracao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia transporta instantaneamente você e até oito criaturas dispostas a até 3 metros de você, ou apenas um único objeto que você possa ver dentro do alcance, para um destino que você escolha. Se você escolher um destino familiar, a viagem é segura. Destinos desconhecidos correm risco de erro de localização.'
},
{
  nome: 'Plano Astral', nivel: 7, escola: 'conjuracao', classes: ['Clérigo','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: 'Especial', concentracao: false, ritual: false,
  desc: 'Você projeta você mesmo e até oito criaturas dispostas dentro do alcance para o Plano Astral, deixando seus corpos físicos em transe no Plano Material. As criaturas transportadas mantêm suas formas e personalidades, e a magia dura até ser dissipada por você ou interrompida por dano grave.'
},
{
  nome: 'Prisão', nivel: 9, escola: 'abjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 minuto', alcance: '9 metros', componentes: 'V, S, M', material: 'uma estatueta de cristal feita ou simbolizando uma criatura específica no valor de pelo menos 500 PO por nível de desafio da criatura alvo',
  duracao: 'Até dispelida', concentracao: false, ritual: false,
  desc: 'Você tenta aprisionar magicamente um alvo dentro do alcance. O alvo deve realizar um teste de Sabedoria ou ficará preso pela duração. Uma criatura presa fica incapacitada e não tem conhecimento de seu entorno. Escolha o tipo de prisão entre opções como prisão sutil, masmorra de correntes, ou tumba de pedra, cada uma com seus próprios efeitos.'
},
{
  nome: 'Projetar Imagem', nivel: 7, escola: 'ilusao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '1,6 quilômetros', componentes: 'V, S, M', material: 'um boneco minúsculo entalhado à sua semelhança e vestido com retalhos de pano',
  duracao: 'Concentração, até 1 dia', concentracao: true, ritual: false,
  desc: 'Você cria uma ilusão de si mesmo num local que você possa ver dentro do alcance. A ilusão é uma cópia visual e sonora de você, mas é intangível. Pela duração, você pode usar sua ação para mover a ilusão a qualquer lugar dentro do alcance e ver e ouvir através dela como se estivesse onde a ilusão está.'
},
{
  nome: 'Sonhos da Vingança', nivel: 7, escola: 'ilusao', classes: ['Bardo','Bruxo'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria a ilusão de uma figura ameaçadora em um espaço desocupado que você possa ver dentro do alcance. A ilusão ocupa esse espaço e é invisível para todas as criaturas, exceto uma que você designar. Como ação bônus, você pode mover a ilusão até 18 metros e fazer com que ela ataque a criatura designada, causando dano psíquico considerável se o teste de Sabedoria falhar.'
},
{
  nome: 'Teia da Lich', nivel: 9, escola: 'necromancia', classes: ['Mago'],
  tempo: '8 horas', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um recipiente embalsamado especial no valor de pelo menos 50.000 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia separa sua alma do seu corpo e a coloca em um recipiente preparado, permitindo que você sobreviva indefinidamente desde que o recipiente não seja destruído. Se seu corpo for destruído, sua alma transmigra para um novo corpo após algum tempo, próximo ao recipiente.'
},
{
  nome: 'Voo Estelar', nivel: 5, escola: 'transmutacao', classes: ['Druida','Patrulheiro'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S, M', material: 'uma pena', 
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura disposta, concedendo a ela deslocamento de voo de 18 metros pela duração. A magia falha se for conjurada em uma criatura que respira água.'
},

// =============================== NÍVEL 8 ===============================
{
  nome: 'Clone', nivel: 8, escola: 'necromancia', classes: ['Mago'],
  tempo: '1 hora', alcance: 'Toque', componentes: 'V, S, M', material: 'um pedaço de carne da criatura clonada e um recipiente caro no valor de pelo menos 1.000 PO, grande o suficiente para conter uma criatura Média',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia cria um corpo inanimado duplicado de uma criatura viva como vasilha de segurança contra a morte. Quando o original morre, sua alma migra para o clone, desde que ele esteja a até 1,6 km e tenha tido tempo de envelhecer até a idade do original.'
},
{
  nome: 'Controlar o Clima', nivel: 8, escola: 'transmutacao', classes: ['Clérigo','Druida','Mago'],
  tempo: '10 minutos', alcance: '0,8 quilômetros', componentes: 'V, S, M', material: 'queimar incenso e oferecer sacrifícios de comida e bebida',
  duracao: 'Concentração, até 8 horas', concentracao: true, ritual: false,
  desc: 'Você assume o controle das condições climáticas dentro de 0,8 km por 8 horas. Você deve estar ao ar livre para conjurar essa magia. Mudar o clima leva tempo, e você pode escolher uma condição climática nova a cada turno, evoluindo gradualmente em direção a uma condição alvo.'
},
{
  nome: 'Demanda', nivel: 8, escola: 'encantamento', classes: ['Bardo','Clérigo','Bruxo','Mago'],
  tempo: '1 minuto', alcance: 'Especial', componentes: 'V, S, M', material: 'um pedaço de papelão com sua mensagem ou comando escrito',
  duracao: '1 dia', concentracao: false, ritual: false,
  desc: 'Você envia mensagens curtas e instruções a uma criatura conhecida, junto com uma sugestão mental para que cumpra o pedido. O alvo deve realizar um teste de Sabedoria; em caso de falha, ele segue suas instruções o melhor que puder, sentindo a urgência de cumpri-las.'
},
{
  nome: 'Escudo Mental', nivel: 8, escola: 'abjuracao', classes: ['Bardo','Bruxo','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'uma faixa de couro a ser amarrada ao redor da cabeça',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Até a magia terminar, o alvo é imune a qualquer magia ou efeito que permita que outras criaturas leiam suas emoções ou pensamentos, determinem se ele está mentindo, sintam sua localização ou afetem sua mente de qualquer forma.'
},
{
  nome: 'Ira Divina', nivel: 9, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Raios de luz fulminante jorram do céu em pontos que você possa ver dentro do alcance. Cada criatura em um cilindro de raio 9 metros centrado em cada ponto deve realizar um teste de Destreza, sofrendo 4d6 de dano radiante em caso de falha, ou metade em caso de sucesso. Você pode repetir esse efeito em pontos diferentes a cada turno até a magia terminar.'
},
{
  nome: 'Maelstrom', nivel: 9, escola: 'conjuracao', classes: ['Druida'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Um vórtice violento de água surge em um ponto que você possa ver dentro do alcance, formando um cilindro de raio 9 metros e altura 18 metros. Cada criatura na área deve realizar um teste de Força, sofrendo dano contundente massivo e sendo arrastada para o centro em caso de falha.'
},
{
  nome: 'Mente em Branco', nivel: 8, escola: 'abjuracao', classes: ['Bardo','Mago'],
  tempo: '1 ação', alcance: 'Toque', componentes: 'V, S', material: null,
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Até a magia terminar, uma criatura disposta que você toca fica imune a dano psíquico, a qualquer efeito que sinta suas emoções ou leia seus pensamentos, a magias de adivinhação, e à condição enfeitiçado. A magia chega a frustrar até mesmo Desejo e efeitos de poder semelhante usados para afetar a mente do alvo ou obter informações sobre ele.'
},
{
  nome: 'Olho de Mente', nivel: 8, escola: 'evocacao', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você libera um pulso devastador de energia psíquica pura. Cada criatura em uma esfera de 9 metros de raio centrada em um ponto dentro do alcance deve realizar um teste de Inteligência, sofrendo dano psíquico massivo em caso de falha, ou metade em caso de sucesso, e potencialmente ficando atônita.'
},
{
  nome: 'Praga Vil', nivel: 8, escola: 'necromancia', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você invoca uma praga de pústulas malignas e doença em uma criatura que você possa ver dentro do alcance. O alvo deve realizar um teste de Constituição. Em caso de falha, sofre dano necrótico considerável e fica envenenado por 1 minuto, sofrendo dano adicional ao fim de cada um de seus turnos se permanecer envenenado.'
},
{
  nome: 'Tempestade de Vento', nivel: 8, escola: 'evocacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 90 metros)', componentes: 'V, S, M', material: 'um galho de carvalho, abeto ou bétula',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma tempestade violenta de vento, relâmpago e chuva torrencial centrada em você se forma, espalhando-se em raio de 90 metros. A tempestade dificulta o voo, derruba criaturas pequenas com ventania, e causa dano elétrico para criaturas atingidas por relâmpagos aleatórios.'
},

// =============================== NÍVEL 9 ===============================
{
  nome: 'Acordo com o Tempo', nivel: 9, escola: 'transmutacao', classes: ['Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você muda brevemente o fluxo do tempo para você mesmo, fazendo com que ele pareça parar para todos, exceto você. Nenhum tempo passa para outras criaturas, enquanto você pode realizar uma sequência extraordinária de ações ou movimentos antes que o tempo volte ao normal.'
},
{
  nome: 'Desejo', nivel: 9, escola: 'conjuracao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'A Desejo é a magia mortal mais poderosa que existe. Simplesmente falando em voz alta, você pode alterar os fundamentos da realidade de acordo com seus desejos. A magia base pode duplicar o efeito de qualquer outra magia de 8º nível ou inferior, ou criar um efeito com parâmetros que você escolher (sujeito a aprovação do Mestre), mas usá-la para algo além de duplicar outra magia traz risco considerável de estresse físico e mental, podendo causar dano grave ou impedir você de conjurar a magia novamente.'
},
{
  nome: 'Fenda Gravitacional', nivel: 9, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '90 metros', componentes: 'S, M', material: 'um diamante esférico no valor de pelo menos 5.000 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você cria uma fenda gravitacional especial em um ponto que você possa ver dentro do alcance. Por um período curto, ela suga objetos e criaturas em um raio considerável, causando dano de força massivo e potencialmente puxando alvos para o centro do efeito.'
},
{
  nome: 'Onda Mortal', nivel: 9, escola: 'necromancia', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal (raio de 18 metros)', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Energia mortal se irradia de você em uma onda devastadora. Cada criatura à sua escolha em um raio de 18 metros deve realizar um teste de Constituição, sofrendo uma quantidade massiva de dano necrótico em caso de falha, ou metade em caso de sucesso. Mortos-vivos na área são imunes ao efeito.'
},
{
  nome: 'Parar o Tempo', nivel: 9, escola: 'transmutacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você para brevemente o fluxo do tempo para todos exceto você. Nenhum tempo passa para outras criaturas enquanto, para você, o tempo continua. Você ganha vários turnos extras de ação em sequência, podendo agir e se mover livremente durante este período, até que use uma ação que afete outra criatura ou um objeto que outra criatura esteja carregando ou vestindo, momento em que a magia termina.'
},
{
  nome: 'Portal', nivel: 9, escola: 'conjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'pó de diamante no valor de pelo menos 5.000 PO',
  duracao: '1 minuto', concentracao: false, ritual: false,
  desc: 'Você cria um portal que liga um ponto fixo dentro do alcance a um local específico em qualquer outro plano de existência. O portal é uma área circular ou oval de até 3 metros de diâmetro, orientada como você escolher, permanecendo aberto pela duração e permitindo viagem em ambas as direções.'
},
{
  nome: 'Reformulação Verdadeira', nivel: 9, escola: 'transmutacao', classes: ['Bardo','Clérigo','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'pó de diamante, esmeralda, rubi e safira no valor de pelo menos 25.000 PO, consumidos',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura e oferece a ela uma transformação mágica profunda, podendo reverter qualquer transformação que o alvo tenha sofrido, neutralizar qualquer veneno afetando-o, curar todas as suas doenças e ferimentos, remover todas as condições e maldições afetando-o, restaurar pontuações de habilidade reduzidas ao normal, e até trocar a raça ou aparência do alvo, se ele desejar.'
},
{
  nome: 'Ressurreição Verdadeira', nivel: 9, escola: 'necromancia', classes: ['Clérigo','Druida'],
  tempo: '1 hora', alcance: 'Toque', componentes: 'V, S, M', material: 'pó de diamante no valor de pelo menos 25.000 PO, consumido',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você toca uma criatura que morreu há no máximo 200 anos e que morreu por qualquer motivo, exceto velhice. Se a alma da criatura estiver livre e dispostas a retornar, ela retorna à vida com todos os seus pontos de vida. Essa magia até pode fornecer um novo corpo se o original tiver sido destruído ou esteja indisponível, reconstituindo o corpo perdido.'
},
{
  nome: 'Tempestade de Vingança Divina', nivel: 9, escola: 'conjuracao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '1,6 quilômetros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma tempestade divina e devastadora se centraliza em um ponto que você possa ver dentro do alcance, abrangendo um cilindro de raio 18 metros. Pela duração, a cada rodada você causa um efeito catastrófico diferente na área, como raios sagrados, vendavais ou granizo flamejante, infligindo dano considerável a criaturas hostis.'
},

// =============================== NÍVEL 6 — verificadas via SRD ===============================
{
  nome: 'Carne para Pedra', nivel: 6, escola: 'transmutacao', classes: ['Bruxo','Druida','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'uma pitada de cal, água e terra',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você tenta transformar uma criatura que possa ver dentro do alcance em pedra. Se o corpo do alvo for de carne, ele deve realizar um teste de Constituição. Em caso de falha, fica impedido enquanto sua carne começa a endurecer; ao fim de cada um de seus turnos, deve repetir o teste. Após três sucessos, a magia termina; após três falhas, o alvo é petrificado pela duração. Sucessos e falhas não precisam ser consecutivos.'
},
{
  nome: 'Círculo da Morte', nivel: 6, escola: 'necromancia', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'pó de pérola negra no valor de pelo menos 500 PO',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma esfera de energia negativa se espalha a partir de um ponto que você escolher dentro do alcance, abrangendo um raio de 18 metros. Cada criatura nessa área deve realizar um teste de Constituição, sofrendo 8d6 de dano necrótico em caso de falha, ou metade em caso de sucesso. Em Níveis Superiores: o dano aumenta em 2d6 para cada nível de magia acima do 6°.'
},
{
  nome: 'Ataque Visual', nivel: 6, escola: 'necromancia', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Pela duração, seus olhos se tornam um vazio sombrio imbuído de poder funesto. Em cada um dos seus turnos, você pode usar sua ação para escolher uma criatura que possa ver dentro de 18 metros; ela deve realizar um teste de Sabedoria ou sofre um dos seguintes efeitos à sua escolha: cair inconsciente, ficar amedrontada e fugir de você, ou ficar enfraquecida com desvantagem em testes de Força e Destreza. Uma criatura que já tenha resistido com sucesso a esta conjuração não pode ser escolhida de novo.'
},
{
  nome: 'Portal Arcano', nivel: 6, escola: 'conjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '150 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Você cria dois portais lineares conectados entre si, um em um ponto que você possa ver dentro do alcance e outro em um local familiar a até 150 metros de distância, mesmo em outro plano de existência. Qualquer criatura ou objeto que entrar em um portal emerge imediatamente do outro, como se tivesse se movido entre eles. Você pode reposicionar um ou ambos os portais como ação em turnos futuros.'
},
{
  nome: 'Sugestão em Massa', nivel: 6, escola: 'encantamento', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, M', material: 'um pedacinho de linguiça de cobra',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Você sugere um curso de atividade e mistura sua sugestão com comandos sociais e mágicos para induzir até doze criaturas de sua escolha, que possam ver e ouvir você, a seguir essa sugestão. Cada alvo deve realizar um teste de Sabedoria; em caso de falha, segue a sugestão o melhor que puder até a magia terminar. Em Níveis Superiores: a duração aumenta para 10 dias (7°), 30 dias (8°) ou um ano e um dia (9°).'
},
{
  nome: 'Gaiola da Alma', nivel: 6, escola: 'necromancia', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S, M', material: 'uma gaiola minúscula de osso, marfim ou metal',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Esta magia se ativa quando uma criatura próxima de você morre, prendendo sua alma antes de partir. Quando uma criatura a até 18 metros morre durante a duração, sua alma é capturada dentro do componente material da magia, a menos que já estivesse vinculada a algo. Você pode liberar a alma capturada com uma ação, ou consumi-la para reaprender informações que ela tinha em vida ou para alimentar outras magias de restauração.'
},
{
  nome: 'Manto de Chamas', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'cinzas de algo consumido pelo fogo',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Pela duração, você se torna uma criatura de fogo vivo. Você é imune a dano de fogo e resistente a dano contundente, cortante e perfurante. Sua pele irradia calor intenso, causando dano de fogo a quem tocar você ou acertá-lo em corpo a corpo, e você pode usar sua ação para liberar uma onda de fogo que incendeia criaturas próximas.'
},
{
  nome: 'Manto de Gelo', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de gelo ou água pura',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Pela duração, você se torna uma criatura de gelo vivo. Você é imune a dano de frio e resistente a dano contundente, cortante e perfurante. Você ganha deslocamento de natação, pode respirar embaixo da água e pode usar sua ação para liberar uma rajada gélida que cobre criaturas próximas de geada cortante.'
},
{
  nome: 'Manto de Pedra', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'um pedaço de pedra ou argila',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Pela duração, você se torna uma criatura de pedra viva. Você é resistente a dano contundente, cortante e perfurante, e sua CA não pode ser inferior a um valor alto fixo. Você pode usar sua ação para fazer ondas de terra tremerem ao seu redor, derrubando criaturas próximas, e ganha a habilidade de escavar através de terra e pedra macia.'
},
{
  nome: 'Manto de Vento', nivel: 6, escola: 'transmutacao', classes: ['Druida'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'uma pena de pássaro raro',
  duracao: 'Concentração, até 10 minutos', concentracao: true, ritual: false,
  desc: 'Pela duração, você se torna uma criatura de vento vivo. Você ganha deslocamento de voo elevado, é resistente a dano contundente, cortante e perfurante de ataques não-mágicos, e pode usar sua ação para criar uma rajada poderosa que empurra criaturas próximas e desvia projéteis dirigidos a você.'
},

// =============================== NÍVEL 7 — verificadas via SRD ===============================
{
  nome: 'Dedo da Morte', nivel: 7, escola: 'necromancia', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você envia energia negativa através de uma criatura que possa ver dentro do alcance, causando dor agonizante. O alvo deve realizar um teste de Constituição, sofrendo 7d8+30 de dano necrótico em caso de falha, ou metade em caso de sucesso. Uma criatura humanoide morta por esse dano se levanta no início do seu próximo turno como um zumbi sob seu controle permanente.'
},
{
  nome: 'Prisão de Energia', nivel: 7, escola: 'evocacao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '30 metros', componentes: 'V, S, M', material: 'pó de rubi no valor de pelo menos 1.500 PO',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você cria uma jaula invisível de força mágica ao redor de uma área que você possa ver dentro do alcance. A jaula pode ser uma cúpula ou cubo de até 6 metros de lado, ou uma caixa pequena o suficiente para conter um único alvo de tamanho Médio ou menor. Nada pode passar pela jaula, e magias não podem ser conjuradas dentro ou através dela.'
},
{
  nome: 'Mansão Magnífica', nivel: 7, escola: 'conjuracao', classes: ['Bardo','Mago'],
  tempo: '1 minuto', alcance: '90 metros', componentes: 'V, S, M', material: 'um pequeno cubo de madeira ferro-cravejado',
  duracao: '24 horas', concentracao: false, ritual: false,
  desc: 'Você cria uma entrada extradimensional dentro do alcance que leva a um vestíbulo, com uma porta mágica que conecta a uma mansão luxuosa com até cinquenta cômodos. A mansão tem mobília e provisões, é iluminada e climatizada, e até cem criaturas podem servir como servos espectrais para os ocupantes. A entrada desaparece ao fim da duração, deixando qualquer criatura dentro presa até a magia ser conjurada novamente ou liberada.'
},
{
  nome: 'Miragem Arcana', nivel: 7, escola: 'ilusao', classes: ['Bardo','Druida','Mago'],
  tempo: '10 minutos', alcance: '1,6 quilômetros', componentes: 'V, S', material: null,
  duracao: '10 dias', concentracao: false, ritual: false,
  desc: 'Você transforma magicamente a aparência do terreno de uma área de natureza vasta, fazendo árvores, edifícios, penhascos e outros recursos parecerem outra coisa, ou até criar fenômenos como ilusões de lagos ou desfiladeiros. A área afetada parece, sente, soa e cheira diferente, mas as criaturas que a tocam descobrem que objetos sólidos ilusórios não são reais, embora não consigam ver através da ilusão à distância.'
},
{
  nome: 'Reversão da Gravidade', nivel: 7, escola: 'transmutacao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '30 metros', componentes: 'V, S, M', material: 'uma pena de fragmento de pena, um pedaço de cabelo de iuana e um pedaço de pedra-ímã',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Essa magia inverte a direção da gravidade em uma área cilíndrica centrada em um ponto que você possa ver dentro do alcance. Todas as criaturas e objetos não fixados na área que não estejam apoiados caem para cima e atingem o topo da área, ou flutuam ali se o teto for alto o suficiente. Se houver uma superfície sólida acima na direção da queda invertida, criaturas sofrem dano de queda contra ela.'
},
{
  nome: 'Encarceramento', nivel: 9, escola: 'abjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 minuto', alcance: '9 metros', componentes: 'V, S, M', material: 'uma estátua de cristal no valor de pelo menos 500 PO por dado de vida da criatura alvo',
  duracao: 'Até dispelida', concentracao: false, ritual: false,
  desc: 'Você cria um campo mágico ao redor de uma criatura que você possa ver dentro do alcance, prendendo-a permanentemente. O alvo deve realizar um teste de Sabedoria. Em caso de falha, fica preso usando uma das seguintes formas: bola de corrente (afundada no chão e incapaz de se mover), capa minóica (em sono perpétuo), cubo isolante (consciente mas incapaz de agir), ou esfera entumecida (caindo lentamente em transe). A prisão dura até ser dispelida por uma magia poderosa o suficiente.'
},
{
  nome: 'Simulacro', nivel: 7, escola: 'ilusao', classes: ['Feiticeiro','Mago'],
  tempo: '12 horas', alcance: 'Toque', componentes: 'V, S, M', material: 'neve ou gelo suficiente para fazer uma duplicata da criatura, junto com pó de rubi no valor de 1.500 PO',
  duracao: 'Até dispelida', concentracao: false, ritual: false,
  desc: 'Você molda uma duplicata ilusória e parcialmente real de uma criatura voluntária ou inconsciente próxima, feita de neve ou gelo. A duplicata tem a metade dos pontos de vida máximos da criatura original e nenhuma de suas capacidades especiais, mas é leal a você e obedece seus comandos, podendo agir de forma independente como uma criatura sob seu controle.'
},
{
  nome: 'Símbolo', nivel: 7, escola: 'abjuracao', classes: ['Bardo','Clérigo','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'pó de mercúrio, fósforo e pó de diamante e rubi no valor de pelo menos 1.000 PO',
  duracao: 'Até dispelido ou acionado', concentracao: false, ritual: false,
  desc: 'Você inscreve um glifo nocivo em uma superfície ou no interior de um objeto que pode ser fechado, definindo o gatilho que ativa o símbolo. Quando ativado, ele explode com um dos vários efeitos à sua escolha, incluindo medo, atordoamento, sono, insanidade ou dano massivo, afetando criaturas em uma área de 6 metros de raio em torno do símbolo.'
},
{
  nome: 'Teleporte', nivel: 7, escola: 'conjuracao', classes: ['Bardo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '3 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Essa magia te transporta instantaneamente, junto com até oito criaturas dispostas que você escolher dentro do alcance, para um destino que você selecionar. Se você tentar viajar para um local familiar, a viagem é totalmente segura. Destinos menos conhecidos correm risco crescente de erro, podendo resultar em chegar fora de posição, em um plano diferente, ou até desaparecer no nada, dependendo de quão bem você conhece o local.'
},
{
  nome: 'Espada Arcana', nivel: 7, escola: 'evocacao', classes: ['Bardo','Mago'],
  tempo: '1 ação', alcance: '9 metros', componentes: 'V, S, M', material: 'uma miniatura de espada de prata e cobre no valor de 250 PO',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria um plano de força em formato de espada que flutua dentro do alcance, durando pela duração. Quando ela aparece, você pode fazer imediatamente um ataque mágico corpo a corpo contra um alvo a até 1,5 metro da espada. Em turnos seguintes, você pode usar uma ação bônus para mover a espada até 6 metros e atacar novamente, causando dano de força considerável em caso de acerto.'
},

// =============================== NÍVEL 8 — verificadas via SRD ===============================
{
  nome: 'Dominar Monstro', nivel: 8, escola: 'encantamento', classes: ['Bardo','Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você tenta dominar a vontade de uma criatura que possa ver dentro do alcance. Ela deve realizar um teste de Sabedoria, com desvantagem se você ou seus aliados estiverem lutando com ela; em caso de falha, fica enfeitiçada por você pela duração, e você pode usar sua ação para comandar mentalmente seus atos em cada turno. Se você não der nenhum comando, a criatura age apenas para se defender. A criatura recebe um novo teste sempre que sofrer dano por você ou seus aliados.'
},
{
  nome: 'Terremoto', nivel: 8, escola: 'evocacao', classes: ['Clérigo','Druida'],
  tempo: '1 ação', alcance: '150 metros', componentes: 'V, S, M', material: 'um pedaço de pedra calcária, granito ou outra rocha',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você cria um terremoto violento em um ponto que você escolher dentro do alcance, abrangendo uma área de até 30 metros de raio. O solo na área se torna terreno difícil cheio de fendas, estruturas correm risco de desmoronar sobre criaturas próximas, e criaturas em pé devem realizar testes de Destreza ou caírem.'
},
{
  nome: 'Enfraquecer Intelecto', nivel: 8, escola: 'encantamento', classes: ['Bardo','Bruxo','Druida','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'um peixe vivo e um sino de cristal',
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você tenta destruir a mente de uma criatura, mergulhando-a em um estado catatônico que é difícil de curar. O alvo deve realizar um teste de Inteligência. Em caso de falha, sua Inteligência e Carisma caem a 1 pela duração, deixando-o incapaz de lançar magias, entender idiomas ou se comunicar de forma coerente, até ser curado por magia restaurativa poderosa o suficiente.'
},
{
  nome: 'Nuvem Incendiária', nivel: 8, escola: 'conjuracao', classes: ['Druida','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '45 metros', componentes: 'V, S, M', material: 'uma semente de samambaia diabo',
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Uma esfera de fumaça abrasadora e brasas pulsantes surge em um ponto que você escolher dentro do alcance, formando uma esfera de 6 metros de raio. A área fica fortemente obscurecida pela fumaça. Quando a nuvem aparece, cada criatura nela deve realizar um teste de Destreza, sofrendo 10d8 de dano de fogo em caso de falha, ou metade em caso de sucesso. Em turnos seguintes, você pode mover a nuvem com uma ação.'
},
{
  nome: 'Demiplano', nivel: 8, escola: 'conjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'S', material: null,
  duracao: '1 hora', concentracao: false, ritual: false,
  desc: 'Você cria um espaço escuro extradimensional do tamanho de uma sala pequena, acessível através de uma porta sombria que aparece em uma superfície sólida dentro do alcance. Você decide quem pode abrir a porta e a entrada desaparece ao fim da duração, deixando qualquer criatura ou objeto dentro presos até a magia ser conjurada de novo no mesmo demiplano.'
},
{
  nome: 'Controlar Clima', nivel: 8, escola: 'transmutacao', classes: ['Clérigo','Druida','Mago'],
  tempo: '10 minutos', alcance: '0,8 quilômetros', componentes: 'V, S, M', material: 'incenso queimado e oferendas de comida e bebida sacrificadas ao vento',
  duracao: 'Concentração, até 8 horas', concentracao: true, ritual: false,
  desc: 'Você assume o controle das condições climáticas dentro de um raio de 0,8 km centrado em você pela duração. Você precisa estar ao ar livre para conjurar essa magia. Mudar drasticamente o clima leva tempo; cada vez que você usa sua ação para mudar o clima, ele evolui um passo na direção da condição alvo que você escolher, desde chuva forte até nevasca ou tempestade de granizo.'
},

// =============================== NÍVEL 9 — verificadas via SRD ===============================
{
  nome: 'Projeção Astral', nivel: 9, escola: 'necromancia', classes: ['Bruxo','Clérigo','Mago'],
  tempo: '1 hora', alcance: 'Toque', componentes: 'V, S, M', material: 'incenso especial e ametistas talhadas no valor de pelo menos 1.000 PO por criatura que receba a magia, consumidas',
  duracao: 'Especial', concentracao: false, ritual: false,
  desc: 'Você e até oito criaturas dispostas que você tocar projetam seus astrais para o Plano Astral, deixando seus corpos físicos e tudo o que carregam em transe no plano que deixaram. As formas astrais se assemelham aos corpos originais em todos os aspectos, exceto que a cor é levemente esmaecida. A magia dura até ser dispelida, até o corpo físico ser destruído, ou até você decidir terminá-la, retornando todos os viajantes a seus corpos.'
},
{
  nome: 'Sexto Sentido', nivel: 9, escola: 'adivinhacao', classes: ['Bardo','Druida','Mago'],
  tempo: '1 minuto', alcance: 'Toque', componentes: 'V, S, M', material: 'um pena de pássaro raro no valor de pelo menos 500 PO',
  duracao: '8 horas', concentracao: false, ritual: false,
  desc: 'Essa magia concede a uma criatura disposta que você toca uma percepção mística do futuro iminente, deixando-a praticamente impossível de pegar de surpresa. Pela duração, o alvo não pode ficar surpreso e tem vantagem em jogadas de ataque, testes de habilidade e testes de resistência. Além disso, outras criaturas têm desvantagem em jogadas de ataque contra o alvo enquanto a magia durar.'
},
{
  nome: 'Portal Planar', nivel: 9, escola: 'conjuracao', classes: ['Clérigo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Você convoca uma entidade extraplanar específica e poderosa, abrindo um portal direcionado a ela em qualquer plano que você conheça. A criatura invocada chega através do portal e age de acordo com sua própria natureza, sendo extremamente difícil de controlar ou compelir caso seja hostil — uma magia que abre as portas para forças muito além do controle do conjurador.'
},
{
  nome: 'Cura em Massa', nivel: 9, escola: 'evocacao', classes: ['Clérigo'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Uma onda profunda de energia de cura flui através do grupo dentro do alcance. Você restaura até 700 pontos de vida, divididos entre quantas criaturas você escolher dentro do alcance. Curar uma criatura também acaba com cegueira, surdez e qualquer doença afetando-a. Essa magia não tem efeito sobre mortos-vivos ou constructos.'
},
{
  nome: 'Chuva de Meteoros', nivel: 9, escola: 'evocacao', classes: ['Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '1,6 quilômetros', componentes: 'V, S', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Bolas de fogo flamejantes despencam do céu em pontos que você possa ver dentro do alcance. Cada criatura em uma esfera de 12 metros de raio centrada em cada ponto deve realizar um teste de Destreza, sofrendo 20d6 de dano combinado de fogo e contundente em caso de falha, ou metade em caso de sucesso. O dano de uma criatura na área de mais de um meteoro é cumulativo.'
},
{
  nome: 'Palavra de Poder Matar', nivel: 9, escola: 'encantamento', classes: ['Bruxo','Feiticeiro','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V', material: null,
  duracao: 'Instantânea', concentracao: false, ritual: false,
  desc: 'Você fala uma palavra de poder que pode instantaneamente matar uma criatura mortalmente ferida. Escolha uma criatura que você possa ver dentro do alcance. Se ela tiver 100 pontos de vida ou menos, ela morre instantaneamente; caso contrário, a magia não tem efeito.'
},
{
  nome: 'Muralha Prismática', nivel: 9, escola: 'abjuracao', classes: ['Bruxo','Mago'],
  tempo: '1 ação', alcance: '18 metros', componentes: 'V, S', material: null,
  duracao: '10 minutos', concentracao: false, ritual: false,
  desc: 'Uma muralha vertical opaca e multicolorida de luz pura aparece dentro do alcance. Ela pode ter formato de cúpula ou esfera de até 18 metros de raio, ou de uma parede plana de até 27 metros de comprimento e 9 metros de altura. A muralha consiste em sete camadas, cada uma com uma cor diferente, cada uma com seu próprio efeito devastador sobre quem tenta atravessá-la, do dano elementar à cegueira ou até a petrificação.'
},
{
  nome: 'Transformação', nivel: 9, escola: 'transmutacao', classes: ['Druida','Mago'],
  tempo: '1 ação', alcance: 'Pessoal', componentes: 'V, S, M', material: 'pedaços diversos de criaturas que representem as formas que você pode assumir, consumidos',
  duracao: 'Concentração, até 1 hora', concentracao: true, ritual: false,
  desc: 'Você assume a forma de outra criatura pela duração. A nova forma pode ser de qualquer criatura com valor de desafio igual ou inferior ao seu próprio nível. Você transforma todo seu corpo, ganhando os atributos físicos e capacidades especiais da nova forma, exceto sua classe e nível, mantendo sua mente e personalidade originais, podendo assumir uma nova forma diferente em turnos futuros sem reconjurar a magia.'
},
{
  nome: 'Estranheza', nivel: 9, escola: 'ilusao', classes: ['Mago'],
  tempo: '1 ação', alcance: '36 metros', componentes: 'V, S', material: null,
  duracao: 'Concentração, até 1 minuto', concentracao: true, ritual: false,
  desc: 'Recorrendo aos medos mais profundos de um grupo de criaturas, você cria criaturas ilusórias em suas mentes, visíveis apenas para elas. Cada criatura em uma esfera de 9 metros de raio centrada em um ponto à sua escolha dentro do alcance deve realizar um teste de Sabedoria. Em caso de falha, fica amedrontada pela duração, e ao fim de cada um de seus turnos enquanto amedrontada deve repetir o teste ou sofrer dano psíquico considerável; em caso de sucesso, a magia termina para aquela criatura.'
},
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ESCOLAS, CLASSES_MAGIA, MAGIAS };
}
