// =============================================================
// DADOS BASE DO SISTEMA D&D 5e
// =============================================================
const ATRIBUTOS = [
  { id: 'str', nome: 'Força' },
  { id: 'dex', nome: 'Destreza' },
  { id: 'con', nome: 'Constituição' },
  { id: 'int', nome: 'Inteligência' },
  { id: 'wis', nome: 'Sabedoria' },
  { id: 'cha', nome: 'Carisma' }
];

const PERICIAS = [
  { id: 'acrobacia',        nome: 'Acrobacia',          attr: 'dex' },
  { id: 'arcanismo',        nome: 'Arcanismo',          attr: 'int' },
  { id: 'atletismo',        nome: 'Atletismo',          attr: 'str' },
  { id: 'atuacao',          nome: 'Atuação',            attr: 'cha' },
  { id: 'blefar',           nome: 'Blefar',             attr: 'cha' },
  { id: 'conhecimento',     nome: 'Conhecimento (Hist.)', attr: 'int' },
  { id: 'enganacao',        nome: 'Enganação',          attr: 'cha' },
  { id: 'furtividade',      nome: 'Furtividade',        attr: 'dex' },
  { id: 'intimidacao',      nome: 'Intimidação',        attr: 'cha' },
  { id: 'intuicao',         nome: 'Intuição',           attr: 'wis' },
  { id: 'investigacao',     nome: 'Investigação',       attr: 'int' },
  { id: 'lidar_animais',    nome: 'Lidar com Animais',  attr: 'wis' },
  { id: 'medicina',         nome: 'Medicina',           attr: 'wis' },
  { id: 'natureza',         nome: 'Natureza',           attr: 'int' },
  { id: 'percepcao',        nome: 'Percepção',          attr: 'wis' },
  { id: 'persuasao',        nome: 'Persuasão',          attr: 'cha' },
  { id: 'prestidigitacao',  nome: 'Prestidigitação',    attr: 'dex' },
  { id: 'religiao',         nome: 'Religião',           attr: 'int' },
  { id: 'sobrevivencia',    nome: 'Sobrevivência',      attr: 'wis' }
];

// ─── Raças e Classes disponíveis ───────────────────────────────────────────
// Cada item tem só { id, nome } por enquanto. Quando formos aplicar bônus de
// atributo, proficiências e traços automaticamente, basta acrescentar campos
// aqui (ex: bonusAttrs: { dex: 2 }, proficiencias: [...], tracos: [...]) —
// o sistema de seleção abaixo não precisa mudar.
const RACAS = [
  { id: 'humano',      nome: 'Humano' },
  { id: 'elfo',        nome: 'Elfo' },
  { id: 'elfo_negro',  nome: 'Elfo Negro (Drow)' },
  { id: 'meio_elfo',   nome: 'Meio-Elfo' },
  { id: 'anao',        nome: 'Anão' },
  { id: 'halfling',    nome: 'Halfling' },
  { id: 'draconato',   nome: 'Draconato' },
  { id: 'gnomo',       nome: 'Gnomo' },
  { id: 'meio_orc',    nome: 'Meio-Orc' },
  { id: 'tiefling',    nome: 'Tiefling' },
  { id: 'aasimar',     nome: 'Aasimar' },
  { id: 'goliath',     nome: 'Goliath' },
  { id: 'orc',         nome: 'Orc' },
  { id: 'tabaxi',      nome: 'Tabaxi' },
  { id: 'triton',      nome: 'Tritão' },
  { id: 'kenku',       nome: 'Kenku' },
  { id: 'genasi',      nome: 'Genasi' },
  { id: 'firbolg',     nome: 'Firbolg' }
];

const CLASSES = [
  { id: 'artifice',    nome: 'Artífice' },
  { id: 'barbaro',     nome: 'Bárbaro' },
  { id: 'bardo',       nome: 'Bardo' },
  { id: 'bruxo',       nome: 'Bruxo' },
  { id: 'clerigo',     nome: 'Clérigo' },
  { id: 'druida',      nome: 'Druida' },
  { id: 'feiticeiro',  nome: 'Feiticeiro' },
  { id: 'guerreiro',   nome: 'Guerreiro' },
  { id: 'ladino',      nome: 'Ladino' },
  { id: 'mago',        nome: 'Mago' },
  { id: 'monge',       nome: 'Monge' },
  { id: 'paladino',    nome: 'Paladino' },
  { id: 'patrulheiro', nome: 'Patrulheiro' }
];

// Mapa usado pelo combobox genérico: nome do campo em `dados` -> lista de opções
const COMBO_DATA = {
  cls:  CLASSES,
  race: RACAS
};

// =============================================================
// CÁLCULO AUTOMÁTICO DE ESPAÇOS DE MAGIA (SPELL SLOTS) + TRUQUES
// Tabelas verificadas contra o 5e SRD / PHB cap. 3 (mono-classe).
// Truques (nível 0): não são "slots" consumíveis, mas têm um limite de
// quantos o personagem conhece, que cresce com o nível.
// Fonte: PHB tabelas de classe — "Cantrips Known" por nível 1-20.
// Artífice: não contemplado (retorna zerado).
// =============================================================
function calcularSpellSlots(classe, nivel) {
  const nv = Math.min(Math.max(parseInt(nivel) || 1, 1), 20);

  // Full caster: Mago, Clérigo, Druida, Bardo, Feiticeiro — slots níveis 1-9
  const FULL_CASTER_TABLE = [
    [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
    [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
    [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
    [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
    [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1],
  ];

  // Half caster: Paladino, Patrulheiro — slots níveis 1-5
  const HALF_CASTER_TABLE = [
    [0,0,0,0,0],[2,0,0,0,0],[3,0,0,0,0],[3,0,0,0,0],[4,2,0,0,0],[4,2,0,0,0],
    [4,3,0,0,0],[4,3,0,0,0],[4,3,2,0,0],[4,3,2,0,0],[4,3,3,0,0],[4,3,3,0,0],
    [4,3,3,1,0],[4,3,3,1,0],[4,3,3,2,0],[4,3,3,2,0],[4,3,3,3,1],[4,3,3,3,1],
    [4,3,3,3,2],[4,3,3,3,2],
  ];

  // Pact Magic: Bruxo — slots poucos mas todos no círculo mais alto disponível
  const PACT_MAGIC_TABLE = [
    {qtd:1,circulo:1},{qtd:2,circulo:1},{qtd:2,circulo:2},{qtd:2,circulo:2},{qtd:2,circulo:3},
    {qtd:2,circulo:3},{qtd:2,circulo:4},{qtd:2,circulo:4},{qtd:2,circulo:5},{qtd:2,circulo:5},
    {qtd:3,circulo:5},{qtd:3,circulo:5},{qtd:3,circulo:5},{qtd:3,circulo:5},{qtd:3,circulo:5},
    {qtd:3,circulo:5},{qtd:4,circulo:5},{qtd:4,circulo:5},{qtd:4,circulo:5},{qtd:4,circulo:5},
  ];

  // ── Truques conhecidos por classe e nível (Cantrips Known, PHB) ──────────
  // Mago: 3 no nv 1, +1 nos níveis 4 e 10 → 3/3/3/4/4/4/4/4/4/5/5/5/5/5/5/5/5/5/5/5
  const CANTRIPS_MAGO        = [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5];
  // Clérigo: 3 no nv 1, +1 nos níveis 4 e 10
  const CANTRIPS_CLERIGO     = [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5];
  // Druida: 2 no nv 1, +1 nos níveis 4 e 10
  const CANTRIPS_DRUIDA      = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  // Bardo: 2 no nv 1, +1 nos níveis 4 e 10
  const CANTRIPS_BARDO       = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  // Feiticeiro: 4 no nv 1, +1 nos níveis 4 e 10
  const CANTRIPS_FEITICEIRO  = [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6];
  // Bruxo: 2 no nv 1, +1 nos níveis 4 e 10
  const CANTRIPS_BRUXO       = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  // Paladino e Patrulheiro: sem truques (lista vazia → 0 para todos os níveis)
  // Bárbaro, Guerreiro, Ladino, Monge: sem conjuração

  const FULL_CASTERS  = ['Mago','Clérigo','Druida','Bardo','Feiticeiro'];
  const HALF_CASTERS  = ['Paladino','Patrulheiro'];

  // Inicializa slots 0-9 com zero
  const slots = {};
  for (let i = 0; i <= 9; i++) slots[String(i)] = 0;

  if (FULL_CASTERS.includes(classe)) {
    FULL_CASTER_TABLE[nv-1].forEach((qtd, i) => { slots[String(i+1)] = qtd; });
    // Truques por full caster
    const cantripMap = {
      'Mago': CANTRIPS_MAGO, 'Clérigo': CANTRIPS_CLERIGO, 'Druida': CANTRIPS_DRUIDA,
      'Bardo': CANTRIPS_BARDO, 'Feiticeiro': CANTRIPS_FEITICEIRO
    };
    slots['0'] = (cantripMap[classe] || [])[nv-1] || 0;
  } else if (HALF_CASTERS.includes(classe)) {
    HALF_CASTER_TABLE[nv-1].forEach((qtd, i) => { slots[String(i+1)] = qtd; });
    // Paladino e Patrulheiro não têm truques — slots['0'] permanece 0
  } else if (classe === 'Bruxo') {
    const { qtd, circulo } = PACT_MAGIC_TABLE[nv-1];
    slots[String(circulo)] = qtd;
    slots['0'] = CANTRIPS_BRUXO[nv-1] || 0;
  }
  // Bárbaro, Guerreiro, Ladino, Monge, Artífice (não implementado),
  // classe vazia ou não reconhecida → tudo zerado.

  return slots;
}

// Recalcula os slots MÁXIMOS automaticamente a partir da classe+nível do
// personagem, preservando o quanto já foi "usado" no dia (não reseta o
// progresso de combate ao mudar nível/classe). Não sobrescreve um override
// manual marcado por `d.spellSlotsManual` (ver atualizarSlotMax).
function recalcularSlotsAutomaticos() {
  const d = PERSONAGEM.dados;
  if (!d.spellSlots) d.spellSlots = {};
  if (!d.spellSlotsManual) d.spellSlotsManual = {};

  const calculados = calcularSpellSlots(d.cls, d.level);
  // Cobre nível 0 (truques) + níveis 1-9
  for (let n = 0; n <= 9; n++) {
    const key = String(n);
    if (!d.spellSlots[key]) d.spellSlots[key] = { max: 0, usados: 0 };
    if (!d.spellSlotsManual[key]) {
      d.spellSlots[key].max = calculados[key] || 0;
      // Truques (nível 0) não são "usados" — garante usados=0 sempre
      if (n === 0) d.spellSlots[key].usados = 0;
      else if (d.spellSlots[key].usados > d.spellSlots[key].max) {
        d.spellSlots[key].usados = d.spellSlots[key].max;
      }
    }
  }
}

// Condições padrão de D&D 5e — usadas como "chips" pra estados temporários
const CONDICOES_PADRAO = [
  { id: 'cego',         nome: 'Cego' },
  { id: 'caido',        nome: 'Caído' },
  { id: 'agarrado',     nome: 'Agarrado' },
  { id: 'surdo',        nome: 'Surdo' },
  { id: 'atordoado',    nome: 'Atordoado' },
  { id: 'enfeiticado',  nome: 'Enfeitiçado' },
  { id: 'assustado',    nome: 'Assustado' },
  { id: 'incapacitado', nome: 'Incapacitado' },
  { id: 'invisivel',    nome: 'Invisível' },
  { id: 'paralisado',   nome: 'Paralisado' },
  { id: 'petrificado',  nome: 'Petrificado' },
  { id: 'envenenado',   nome: 'Envenenado' },
  { id: 'restringido',  nome: 'Restringido' },
  { id: 'inconsciente', nome: 'Inconsciente' },
  { id: 'exausto',      nome: 'Exausto' }
];

// Moedas padrão de D&D 5e — paraPO é a taxa de conversão pra peças de ouro
const MOEDAS = [
  { id: 'pp', nome: 'Platina', sigla: 'PP', cor: '#cfd8e3', paraPO: 10 },
  { id: 'po', nome: 'Ouro',    sigla: 'PO', cor: '#C9A84C', paraPO: 1 },
  { id: 'pe', nome: 'Electro', sigla: 'PE', cor: '#cbbf8a', paraPO: 0.5 },
  { id: 'pt', nome: 'Prata',   sigla: 'PT', cor: '#b9bcc2', paraPO: 0.1 },
  { id: 'pc', nome: 'Cobre',   sigla: 'PC', cor: '#b87333', paraPO: 0.01 }
];

const NIVEIS_BONUS_PROF = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6]; // índice = nível-1

const SLOTS_MAX_PADRAO = [4,3,3,3,2,1,1,1,1]; // nível de magia 1..9, placeholder genérico

// ─── Ícone d20 inline (SVG) ───────────────────────────────────────────────
// Gerado com a paleta da interface: pedra escura + ouro
const D20_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18" style="display:block;flex-shrink:0">
<defs><filter id="gd"><feGaussianBlur stdDeviation="1.2" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter></defs>
<ellipse cx="50" cy="91" rx="24" ry="3.5" fill="rgba(0,0,0,0.4)"/>
<polygon points="50,6 50,27.6 68.4,41" fill="rgba(201,168,76,0.22)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,6 68.4,41 61.4,62.7" fill="rgba(201,168,76,0.22)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,6 61.4,62.7 38.6,62.7" fill="rgba(201,168,76,0.22)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,6 38.6,62.7 31.6,41" fill="rgba(201,168,76,0.22)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,6 31.6,41 50,27.6" fill="rgba(201,168,76,0.22)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,27.6 68.4,41 61.4,37.3" fill="rgba(201,168,76,0.38)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="68.4,41 61.4,62.7 68.4,59" fill="rgba(201,168,76,0.18)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="61.4,62.7 38.6,62.7 50,72.4" fill="rgba(201,168,76,0.11)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="38.6,62.7 31.6,41 31.6,59" fill="rgba(201,168,76,0.20)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="31.6,41 50,27.6 38.6,37.3" fill="rgba(201,168,76,0.28)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="61.4,37.3 68.4,41 68.4,59" fill="rgba(201,168,76,0.32)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="68.4,59 61.4,62.7 50,72.4" fill="rgba(201,168,76,0.14)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,72.4 38.6,62.7 31.6,59" fill="rgba(201,168,76,0.08)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="31.6,59 31.6,41 38.6,37.3" fill="rgba(201,168,76,0.16)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="38.6,37.3 50,27.6 61.4,37.3" fill="rgba(201,168,76,0.26)" stroke="#C9A84C" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,94 61.4,37.3 68.4,59" fill="rgba(139,105,20,0.20)" stroke="#8B6914" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,94 68.4,59 50,72.4" fill="rgba(139,105,20,0.20)" stroke="#8B6914" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,94 50,72.4 31.6,59" fill="rgba(139,105,20,0.20)" stroke="#8B6914" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,94 31.6,59 38.6,37.3" fill="rgba(139,105,20,0.20)" stroke="#8B6914" stroke-width="0.8" stroke-linejoin="round"/>
<polygon points="50,94 38.6,37.3 61.4,37.3" fill="rgba(139,105,20,0.20)" stroke="#8B6914" stroke-width="0.8" stroke-linejoin="round"/>
<polyline points="50,6 50,27.6 68.4,41 61.4,62.7 38.6,62.7 31.6,41 50,6" fill="none" stroke="#C9A84C" stroke-width="1" opacity="0.75"/>
<polyline points="50,94 61.4,37.3 68.4,59 50,72.4 31.6,59 38.6,37.3 50,94" fill="none" stroke="#8B6914" stroke-width="0.8" opacity="0.55"/>
<text x="50" y="55" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="#E8C96D" text-anchor="middle" dominant-baseline="middle" filter="url(#gd)">20</text>
</svg>`;

// ─── Rolagem de dado ───────────────────────────────────────────────────────
function rolarD20(nomePericia, modificador) {
  const dado = Math.floor(Math.random() * 20) + 1;
  const total = dado + modificador;
  const modStr = modificador >= 0 ? `+${modificador}` : `${modificador}`;

  // Classifica resultado
  let classe = '';
  let prefixo = '';
  if (dado === 20) { classe = 'roll-nat20'; prefixo = '⚡ NAT 20! '; }
  else if (dado === 1)  { classe = 'roll-nat1';  prefixo = '💀 FALHA CRÍTICA! '; }
  else if (total >= 20) { classe = 'roll-great'; }
  else if (total <= 5)  { classe = 'roll-bad'; }

  // Monta HTML do toast de rolagem (substituir o toast normal por um mais rico)
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast roll-toast ${classe}`;
  t.innerHTML = `
    <div class="roll-toast-header">${nomePericia}</div>
    <div class="roll-toast-body">
      <span class="roll-dado">${dado}</span>
      <span class="roll-op">${modStr}</span>
      <span class="roll-igual">=</span>
      <span class="roll-total">${total}</span>
    </div>
    <div class="roll-toast-sub">${prefixo}d20 (${dado}) ${modStr}</div>
  `;
  c.appendChild(t);

  // Animação de entrada + saída
  t.style.opacity = '0';
  t.style.transform = 'translateX(30px) scale(0.92)';
  t.style.transition = 'all 0.25s cubic-bezier(.22,.68,0,1.4)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateX(0) scale(1)';
    });
  });

  setTimeout(() => {
    t.style.transition = 'all 0.3s ease';
    t.style.opacity = '0';
    t.style.transform = 'translateX(30px)';
    setTimeout(() => t.remove(), 320);
  }, 3200);
}

function bonusProficiencia(nivel) {
  const n = Math.min(Math.max(parseInt(nivel) || 1, 1), 20);
  return NIVEIS_BONUS_PROF[n-1];
}

function mod(score) {
  const s = parseInt(score);
  if (isNaN(s)) return 0;
  return Math.floor((s - 10) / 2);
}

function fmtMod(n) {
  n = parseInt(n) || 0;
  return n >= 0 ? `+${n}` : `${n}`;
}

// =============================================================
// STORAGE — mesma base usada pela tela principal (forja_personagens)
// =============================================================
function loadData(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch(e) { return fallback; }
}
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

let PERSONAGENS = loadData('forja_personagens', []);
let CHAR_ID = null;
let PERSONAGEM = null;

function pegarIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Estrutura default de "dados" pra um personagem D&D — usada pra completar
// qualquer campo que ainda não exista (ex: personagem criado antes desta ficha existir).
function defaultDadosDnD() {
  return {
    cls: '', clsId: '', race: '', raceId: '', level: 1, align: '',
    attrs: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    overrides: {}, // ex: { ca: 17 } quando o jogador sobrescreve manualmente
    profSaves: [], // ex: ['str','con']
    profSkills: [], // ex: ['percepcao','furtividade']
    hp: { atual: 10, max: 10, temp: 0 },
    hitDiceUsados: 0,
    deathSaves: { sucesso: 0, falha: 0 },
    carga: { capacidadeOverride: null },
    inventario: [],
    carteira: { pp: 0, po: 0, pe: 0, pt: 0, pc: 0 },
    ataquesList: [], // ataques estruturados: { nome, bonus, dano, alcance, tipo }
    spellSlots: {}, // ex: { '0': { max: 3, usados: 0 }, '1': { max: 4, usados: 0 } } — níveis 0-9
    spells: [], // { id, nome, nivel, preparada, escola }
    condicoesTemp: [], // ids de CONDICOES_PADRAO ativos no momento
    estadosPermanentes: [], // [{ nome, descricao }] — doenças, maldições, traços fixos
    inspiracao: false,
    bio: {
      altura: '', peso: '', idade: '', corOlhos: '',
      aparencia: '', historia: '',
      personalidade: '', ideais: '', vinculos: '', defeitos: ''
    },
    proficiencias: '', ataques: '', notas: ''
  };
}

function mesclarComDefault(dados) {
  const def = defaultDadosDnD();
  const out = { ...def, ...dados };
  out.attrs = { ...def.attrs, ...(dados.attrs||{}) };
  out.overrides = { ...(dados.overrides||{}) };
  out.hp = { ...def.hp, ...(dados.hp||{}) };
  out.deathSaves = { ...def.deathSaves, ...(dados.deathSaves||{}) };
  out.carga = { ...def.carga, ...(dados.carga||{}) };
  out.carteira = { ...def.carteira, ...(dados.carteira||{}) };
  out.bio = { ...def.bio, ...(dados.bio||{}) };
  out.profSaves = dados.profSaves || [];
  out.profSkills = dados.profSkills || [];
  out.inventario = dados.inventario || [];
  out.ataquesList = dados.ataquesList || [];
  out.spellSlots = dados.spellSlots || {};
  out.spells = dados.spells || [];
  // BUG 3 — garante que condições são sempre um array de strings (nunca objeto/undefined)
  out.condicoesTemp = Array.isArray(dados.condicoesTemp) ? dados.condicoesTemp.filter(x => typeof x === 'string') : [];
  out.estadosPermanentes = Array.isArray(dados.estadosPermanentes) ? dados.estadosPermanentes : [];
  out.inspiracao = dados.inspiracao || false;
  // Migração: a aba Principal tinha um campo único "Traços de Personalidade" que
  // misturava personalidade/ideais/vínculos/defeitos. Se existir texto antigo e o
  // novo campo "personalidade" da Biografia ainda estiver vazio, aproveita o texto.
  if (dados.tracosPersonalidade && !out.bio.personalidade) {
    out.bio.personalidade = dados.tracosPersonalidade;
  }
  return out;
}

function carregarPersonagem() {
  CHAR_ID = pegarIdDaUrl();
  if (!CHAR_ID) { mostrarEstadoVazio('Nenhum personagem especificado na URL.'); return false; }
  const p = PERSONAGENS.find(x => x.id === CHAR_ID);
  if (!p) { mostrarEstadoVazio('Personagem não encontrado. Ele pode ter sido apagado.'); return false; }
  PERSONAGEM = p;
  PERSONAGEM.dados = mesclarComDefault(p.dados || {});
  return true;
}

function mostrarEstadoVazio(msg) {
  const tabs = document.querySelector('.sheet-tabs');
  if (tabs) tabs.style.display = 'none';
  document.getElementById('sheetContent').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">⚠</div>
      <div class="empty-state-text">${msg}</div>
      <button class="sheet-back" onclick="voltarParaHome()" style="opacity:0.8">← Voltar para Forja das Eras</button>
    </div>`;
}

function voltarParaHome() {
  window.location.href = '../index.html';
}
// =============================================================
// CÁLCULOS DERIVADOS (com suporte a override manual)
// =============================================================

// Pega o valor de um campo "derivado": se houver override manual salvo, usa ele;
// senão calcula automaticamente. Retorna { valor, manual }.
function derivado(campoId, calcFn) {
  const ov = PERSONAGEM.dados.overrides[campoId];
  if (ov !== undefined && ov !== null && ov !== '') {
    return { valor: ov, manual: true };
  }
  return { valor: calcFn(), manual: false };
}

function calcCA() {
  // base 10 + mod destreza (sem armadura — ponto de partida simples e editável)
  return 10 + mod(PERSONAGEM.dados.attrs.dex);
}
function calcIniciativa() {
  return mod(PERSONAGEM.dados.attrs.dex);
}
function calcDeslocamento() {
  return 9; // metros, padrão maioria das raças — editável via override
}
function calcCapacidadeCarga() {
  const str = parseInt(PERSONAGEM.dados.attrs.str) || 10;
  return str * 15; // regra padrão D&D 5e, em libras convertido livre p/ "unidades"
}

function toggleOverride(campoId, calcFnName) {
  const dados = PERSONAGEM.dados;
  const jaManual = dados.overrides[campoId] !== undefined;
  if (jaManual) {
    delete dados.overrides[campoId];
  } else {
    const inputEl = document.getElementById('stat_' + campoId);
    const calcFn = window[calcFnName];
    dados.overrides[campoId] = inputEl ? inputEl.value : (calcFn ? calcFn() : '');
  }
  agendarSalvar();
  renderPrincipal();
}

// =============================================================
// RENDER: ABA PRINCIPAL
// =============================================================
function renderPrincipal() {
  const d = PERSONAGEM.dados;
  const ca = derivado('ca', calcCA);
  const ini = derivado('iniciativa', calcIniciativa);
  const desl = derivado('deslocamento', calcDeslocamento);
  const prof = bonusProficiencia(d.level);

  document.getElementById('panel-principal').innerHTML = `
    <div class="identity-row">
      ${comboFieldHTML('cls', 'Classe', 'Digite ou escolha...')}
      ${comboFieldHTML('race', 'Raça', 'Digite ou escolha...')}
      <div class="identity-field">
        <label class="identity-label">Nível</label>
        <input class="identity-input" type="number" min="1" max="20" id="f_level" value="${d.level}" oninput="atualizarNivel(this.value)">
      </div>
      <div class="identity-field">
        <label class="identity-label">Alinhamento</label>
        <select class="identity-input" id="f_align" onchange="atualizarCampoSimples('align', this.value)">
          ${['','Leal Bom','Neutro Bom','Caótico Bom','Leal Neutro','Neutro','Caótico Neutro','Leal Mau','Neutro Mau','Caótico Mau']
            .map(a => `<option value="${a}" ${d.align===a?'selected':''}>${a||'Selecionar...'}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="combat-grid">
      <div class="attrs-col">
        ${ATRIBUTOS.map(a => attrShieldHTML(a)).join('')}
      </div>

      <div class="right-col">
        <div class="combat-stats-row">
          ${combatStatHTML('ca', 'CA', ca, 'Classe de Armadura', 'calcCA')}
          ${combatStatHTML('iniciativa', 'Iniciativa', ini, fmtMod(ini.valor), 'calcIniciativa', true)}
          ${combatStatHTML('deslocamento', 'Deslocamento', desl, 'metros', 'calcDeslocamento')}
          <div class="combat-stat">
            <span class="combat-stat-label">Bônus Prof.</span>
            <div class="combat-stat-value" style="cursor:default">${fmtMod(prof)}</div>
            <span class="combat-stat-sub">por nível</span>
          </div>
        </div>

        <div class="hp-box">
          <div class="hp-row">
            <div>
              <span class="hp-label">Pontos de Vida</span>
              <div class="hp-current-wrap">
                <input class="hp-input" type="number" value="${d.hp.atual}" oninput="atualizarHP('atual', this.value)">
                <span class="hp-divider">/</span>
                <input class="hp-max-input" type="number" value="${d.hp.max}" oninput="atualizarHP('max', this.value)">
              </div>
            </div>
            <div class="hp-temp-wrap">
              <span class="hp-label" style="color:var(--arcane-glow)">Temp.</span>
              <input class="hp-temp-input" type="number" value="${d.hp.temp}" oninput="atualizarHP('temp', this.value)">
            </div>
          </div>
          <div class="hp-bar-track"><div class="hp-bar-fill" style="width:${Math.max(0,Math.min(100, (d.hp.atual/(d.hp.max||1))*100))}%"></div></div>

          <div class="death-hitdice-row">
            <div class="death-saves">
              <span class="death-saves-title">Testes de Morte</span>
              <div class="death-saves-row">
                <div class="death-save-group">
                  ${[0,1,2].map(i => `<div class="death-save-dot success ${i<d.deathSaves.sucesso?'filled':''}" onclick="setDeathSave('sucesso',${i+1})"></div>`).join('')}
                  <span class="death-save-text">Sucesso</span>
                </div>
              </div>
              <div class="death-saves-row">
                <div class="death-save-group">
                  ${[0,1,2].map(i => `<div class="death-save-dot fail ${i<d.deathSaves.falha?'filled':''}" onclick="setDeathSave('falha',${i+1})"></div>`).join('')}
                  <span class="death-save-text">Falha</span>
                </div>
              </div>
            </div>
            <div>
              <span class="death-saves-title">Dados de Vida</span>
              <div class="hitdice-row" style="margin-top:8px">
                <input class="hitdice-input" type="number" min="0" value="${d.hitDiceUsados}" oninput="atualizarCampoSimples('hitDiceUsados', parseInt(this.value)||0)">
                <span class="death-save-text">usados de ${d.level}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="box">
      <div class="box-title">Proficiências &amp; Idiomas</div>
      <textarea class="text-box" style="min-height:110px" oninput="atualizarCampoSimples('proficiencias', this.value)" placeholder="Armas, ferramentas, idiomas...">${esc(d.proficiencias)}</textarea>
    </div>
  `;
}

function attrShieldHTML(a) {
  const score = PERSONAGEM.dados.attrs[a.id];
  const m = mod(score);
  return `
  <div class="attr-shield">
    <div class="attr-shield-emblem">
      ${shieldSVG()}
      <span class="attr-mod-num">${fmtMod(m)}</span>
    </div>
    <div class="attr-body">
      <span class="attr-name">${a.nome}</span>
      <div class="attr-score-row">
        <input class="attr-score-input" type="number" min="1" max="30" value="${score}" oninput="atualizarAttr('${a.id}', this.value)">
        <span class="attr-score-label">pontuação</span>
      </div>
    </div>
  </div>`;
}

function shieldSVG() {
  return `<svg viewBox="0 0 52 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 2 L48 10 V30 C48 44 38 53 26 56 C14 53 4 44 4 30 V10 Z" stroke="#8B6914" stroke-width="1.3" fill="rgba(201,168,76,0.05)"/>
    <path d="M26 7 L43 13.5 V29 C43 40 35 47.5 26 50.5 C17 47.5 9 40 9 29 V13.5 Z" stroke="#C9A84C" stroke-width="0.8" opacity="0.45" fill="none"/>
  </svg>`;
}

function savingThrowRowHTML(a, prof) {
  const proficiente = PERSONAGEM.dados.profSaves.includes(a.id);
  const valor = mod(PERSONAGEM.dados.attrs[a.id]) + (proficiente ? prof : 0);
  return `
  <div class="skill-row" style="grid-template-columns:22px 1fr 50px">
    <input type="checkbox" class="skill-prof" ${proficiente?'checked':''} onchange="toggleProfSave('${a.id}')">
    <span class="skill-name">${a.nome}</span>
    <span class="skill-mod-input" style="border:none;background:none;cursor:default">${fmtMod(valor)}</span>
  </div>`;
}

function skillRowHTML(p, prof) {
  const proficiente = PERSONAGEM.dados.profSkills.includes(p.id);
  const valor = mod(PERSONAGEM.dados.attrs[p.attr]) + (proficiente ? prof : 0);
  return `
  <div class="skill-row">
    <input type="checkbox" class="skill-prof" ${proficiente?'checked':''} onchange="toggleProfSkill('${p.id}')">
    <span class="skill-name">${p.nome} <span class="skill-attr-tag">${p.attr}</span></span>
    <span></span>
    <span class="skill-mod-input" style="border:none;background:none;cursor:default">${fmtMod(valor)}</span>
  </div>`;
}

function combatStatHTML(campoId, label, derivObj, subtitulo, calcFnName, isMod) {
  const v = derivObj.valor;
  const display = isMod ? fmtMod(v) : v;
  return `
  <div class="combat-stat">
    <span class="combat-stat-toggle ${derivObj.manual?'manual':''}" title="${derivObj.manual?'Usando valor manual — clique para voltar ao automático':'Automático — clique para travar um valor manual'}" onclick="toggleOverride('${campoId}', ${calcFnName})">${derivObj.manual?'✎':'⟲'}</span>
    <span class="combat-stat-label">${label}</span>
    <input class="combat-stat-value" id="stat_${campoId}" value="${display}" oninput="overrideManualDireto('${campoId}', this.value)">
    <span class="combat-stat-sub">${subtitulo}</span>
  </div>`;
}

// quando o jogador digita direto no círculo, isso já conta como override manual
function overrideManualDireto(campoId, val) {
  PERSONAGEM.dados.overrides[campoId] = val;
  agendarSalvar();
}

function esc(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// =============================================================
// COMBOBOX (Classe / Raça) — digita e filtra a lista; clicar escolhe;
// Enter escolhe a opção em destaque ou, se nada estiver em destaque,
// a opção mais "parecida" com o que foi digitado.
// =============================================================
let comboState = {}; // { cls: {filtered:[...], open:bool, activeIndex:n}, race: {...} }

function normalizar(s) {
  return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function comboInitState(campo) {
  comboState[campo] = { filtered: COMBO_DATA[campo].slice(), open: false, activeIndex: -1 };
}

function comboFieldHTML(campo, label, placeholder) {
  comboInitState(campo);
  const valor = PERSONAGEM.dados[campo] || '';
  return `
  <div class="identity-field combo-field">
    <label class="identity-label">${label}</label>
    <div class="combo-wrap">
      <input class="identity-input combo-input" id="f_${campo}" type="text" autocomplete="off"
        value="${esc(valor)}" placeholder="${placeholder}"
        oninput="comboFiltrar('${campo}', this.value)"
        onfocus="comboAbrir('${campo}')"
        onkeydown="comboKeydown(event, '${campo}')"
        onblur="comboBlur('${campo}')">
      <div class="combo-dropdown" id="combo_dropdown_${campo}"></div>
    </div>
  </div>`;
}

function comboFiltrar(campo, valor) {
  const termo = normalizar(valor);
  const lista = COMBO_DATA[campo];
  const filtrados = termo ? lista.filter(o => normalizar(o.nome).includes(termo)) : lista.slice();

  comboState[campo] = comboState[campo] || {};
  comboState[campo].filtered = filtrados;
  comboState[campo].activeIndex = filtrados.length ? 0 : -1;
  comboState[campo].open = true;
  renderComboDropdown(campo);

  // Guarda o texto livre normalmente (permite digitar algo fora da lista também).
  PERSONAGEM.dados[campo] = valor;
  // Se o texto já bate exatamente com uma opção, vincula o id correspondente
  // (é esse id que vai ser usado depois pra aplicar bônus/proficiências da raça/classe).
  const exato = lista.find(o => normalizar(o.nome) === termo);
  PERSONAGEM.dados[campo + 'Id'] = exato ? exato.id : '';
  if (campo === 'cls') recalcularSlotsAutomaticos();
  agendarSalvar();
}

function comboAbrir(campo) {
  const input = document.getElementById('f_' + campo);
  comboFiltrar(campo, input ? input.value : '');
}

function renderComboDropdown(campo) {
  const st = comboState[campo];
  const el = document.getElementById('combo_dropdown_' + campo);
  if (!el || !st) return;
  if (!st.open || !st.filtered.length) {
    el.classList.remove('show');
    el.innerHTML = '';
    return;
  }
  el.innerHTML = st.filtered.map((o, i) => `
    <div class="combo-option ${i === st.activeIndex ? 'active' : ''}"
         onmousedown="event.preventDefault(); comboEscolher('${campo}', '${o.id}')">${esc(o.nome)}</div>
  `).join('');
  el.classList.add('show');
  const ativo = el.querySelector('.combo-option.active');
  if (ativo) ativo.scrollIntoView({ block: 'nearest' });
}

function comboEscolher(campo, id) {
  const opt = COMBO_DATA[campo].find(o => o.id === id);
  if (!opt) return;
  PERSONAGEM.dados[campo] = opt.nome;
  PERSONAGEM.dados[campo + 'Id'] = opt.id;
  const input = document.getElementById('f_' + campo);
  if (input) { input.value = opt.nome; input.focus(); }
  comboFechar(campo);
  if (campo === 'cls') { recalcularSlotsAutomaticos(); renderCombate(); }
  agendarSalvar();
}

function comboFechar(campo) {
  if (comboState[campo]) comboState[campo].open = false;
  renderComboDropdown(campo);
}

function comboBlur(campo) {
  // pequeno atraso: se o blur foi causado por um clique numa opção, o onmousedown
  // (que roda antes do blur) já tratou a escolha — isso aqui só fecha o dropdown.
  setTimeout(() => comboFechar(campo), 120);
}

function comboKeydown(event, campo) {
  const st = comboState[campo];
  if (!st) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (!st.open) { comboAbrir(campo); return; }
    st.activeIndex = Math.min(st.activeIndex + 1, st.filtered.length - 1);
    renderComboDropdown(campo);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    st.activeIndex = Math.max(st.activeIndex - 1, 0);
    renderComboDropdown(campo);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    let escolha = null;
    if (st.open && st.activeIndex >= 0 && st.filtered[st.activeIndex]) {
      escolha = st.filtered[st.activeIndex]; // opção em destaque na lista filtrada
    } else {
      escolha = encontrarMaisProximo(event.target.value, COMBO_DATA[campo]); // "o que mais tá próximo"
    }
    if (escolha) comboEscolher(campo, escolha.id);
    else comboFechar(campo);
  } else if (event.key === 'Escape') {
    comboFechar(campo);
    event.target.blur();
  }
}

// Distância de Levenshtein simples — usada só pro "mais próximo" do Enter.
function distanciaLevenshtein(a, b) {
  a = normalizar(a); b = normalizar(b);
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d = [];
  for (let i = 0; i <= m; i++) d.push([i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i-1] === b[j-1] ? d[i-1][j-1] : 1 + Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
    }
  }
  return d[m][n];
}

function encontrarMaisProximo(texto, lista) {
  if (!texto || !texto.trim()) return null;
  const termo = normalizar(texto);
  let achado = lista.find(o => normalizar(o.nome) === termo);          // 1) igual
  if (achado) return achado;
  achado = lista.find(o => normalizar(o.nome).startsWith(termo));     // 2) começa com
  if (achado) return achado;
  achado = lista.find(o => normalizar(o.nome).includes(termo));       // 3) contém
  if (achado) return achado;
  let melhor = null, melhorDist = Infinity;                            // 4) mais parecido (Levenshtein)
  lista.forEach(o => {
    const dist = distanciaLevenshtein(texto, o.nome);
    if (dist < melhorDist) { melhorDist = dist; melhor = o; }
  });
  return melhor;
}
// =============================================================
// HANDLERS — ABA PRINCIPAL
// =============================================================
function atualizarCampoSimples(campo, valor) {
  PERSONAGEM.dados[campo] = valor;
  agendarSalvar();
}

function atualizarNivel(valor) {
  const n = Math.min(Math.max(parseInt(valor) || 1, 1), 20);
  PERSONAGEM.dados.level = n;
  recalcularSlotsAutomaticos();
  agendarSalvar();
  renderPrincipal(); // bônus de proficiência e HD máximos dependem do nível
}

function atualizarAttr(attrId, valor) {
  const v = Math.min(Math.max(parseInt(valor) || 1, 1), 30);
  PERSONAGEM.dados.attrs[attrId] = v;
  agendarSalvar();
  renderPrincipal(); // recalcula mods, CA, salvaguardas etc, exceto onde há override
  if (document.getElementById('panel-inventario').classList.contains('rendered-once')) renderInventario();
}

function atualizarHP(campo, valor) {
  const v = parseInt(valor);
  PERSONAGEM.dados.hp[campo] = isNaN(v) ? 0 : v;
  agendarSalvar();
  // só atualiza a barra sem re-renderizar tudo, pra não perder o foco do input
  const d = PERSONAGEM.dados;
  const track = document.querySelector('.hp-bar-fill');
  if (track) track.style.width = Math.max(0,Math.min(100,(d.hp.atual/(d.hp.max||1))*100)) + '%';
}

function setDeathSave(tipo, valor) {
  const atual = PERSONAGEM.dados.deathSaves[tipo];
  // clicar no mesmo ponto já marcado desmarca (permite voltar)
  PERSONAGEM.dados.deathSaves[tipo] = (atual === valor) ? valor - 1 : valor;
  agendarSalvar();
  renderPrincipal();
}

function toggleProfSave(attrId) {
  const arr = PERSONAGEM.dados.profSaves;
  const i = arr.indexOf(attrId);
  if (i >= 0) arr.splice(i, 1); else arr.push(attrId);
  agendarSalvar();
  // Re-renderiza painéis que dependem de salvaguardas
  const activePainel = document.querySelector('.sheet-panel.active');
  if (activePainel && activePainel.id === 'panel-pericias') {
    renderPericias();
  } else {
    renderPrincipal();
  }
}

function toggleProfSkill(periciaId) {
  const arr = PERSONAGEM.dados.profSkills;
  const i = arr.indexOf(periciaId);
  if (i >= 0) arr.splice(i, 1); else arr.push(periciaId);
  agendarSalvar();
  const activePainel = document.querySelector('.sheet-panel.active');
  if (activePainel && activePainel.id === 'panel-pericias') {
    renderPericias();
  } else {
    renderPrincipal();
  }
}
// =============================================================
// RENDER: ABA PERÍCIAS
// =============================================================
function renderPericias() {
  const d = PERSONAGEM.dados;
  const prof = bonusProficiencia(d.level);

  // Divide as 19 perícias em duas colunas de tamanho igual
  const metade = Math.ceil(PERICIAS.length / 2);
  const colA = PERICIAS.slice(0, metade);
  const colB = PERICIAS.slice(metade);

  function skillinha(p) {
    const proficiente = d.profSkills.includes(p.id);
    const valor = mod(d.attrs[p.attr]) + (proficiente ? prof : 0);
    const modStr = valor >= 0 ? `+${valor}` : `${valor}`;
    return `
    <div class="skill-row" style="grid-template-columns:18px 1fr 26px 36px 22px;gap:5px;padding:4px 2px">
      <input type="checkbox" class="skill-prof" ${proficiente ? 'checked' : ''}
        onchange="toggleProfSkill('${p.id}'); renderPericias();">
      <span class="skill-name" style="font-size:12.5px">${p.nome}</span>
      <span class="skill-attr-tag" style="font-size:7.5px;opacity:0.4">${p.attr.toUpperCase()}</span>
      <span style="font-family:'Cinzel',serif;font-size:12px;text-align:right;
        color:${proficiente ? 'var(--gold)' : 'var(--parchment-dark)'};
        opacity:${proficiente ? '1' : '0.6'}">${modStr}</span>
      <button class="d20-btn" title="Rolar teste de ${p.nome} (1d20${modStr})"
        onclick="rolarD20('${p.nome}', ${valor})">${D20_SVG}</button>
    </div>`;
  }

  function saveRow(a) {
    const proficiente = d.profSaves.includes(a.id);
    const valor = mod(d.attrs[a.id]) + (proficiente ? prof : 0);
    const modStr = valor >= 0 ? `+${valor}` : `${valor}`;
    return `
    <div class="skill-row" style="grid-template-columns:18px 1fr 36px 22px;gap:5px;padding:4px 2px">
      <input type="checkbox" class="skill-prof" ${proficiente ? 'checked' : ''}
        onchange="toggleProfSave('${a.id}'); renderPericias();">
      <span class="skill-name" style="font-size:12.5px">${a.nome}</span>
      <span style="font-family:'Cinzel',serif;font-size:12px;text-align:right;color:var(--gold)">${modStr}</span>
      <button class="d20-btn" title="Rolar salvaguarda de ${a.nome} (1d20${modStr})"
        onclick="rolarD20('Salv. ${a.nome}', ${valor})">${D20_SVG}</button>
    </div>`;
  }

  const passiva = 10 + mod(d.attrs.wis) + (d.profSkills.includes('percepcao') ? prof : 0);

  document.getElementById('panel-pericias').innerHTML = `
    <div style="display:grid;grid-template-columns:220px 1fr;gap:18px;align-items:start">

      <!-- Coluna esquerda estreita: info + salvaguardas -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- Inspiração + Bônus Prof + Passiva -->
        <div class="box" style="padding:14px 16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" class="skill-prof" style="width:15px;height:15px"
                ${d.inspiracao ? 'checked' : ''}
                onchange="atualizarCampoSimples('inspiracao', this.checked)">
              <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:var(--gold);text-transform:uppercase">Inspiração</span>
            </label>
          </div>
          <div style="display:flex;gap:10px">
            <div style="flex:1;text-align:center;background:rgba(0,0,0,0.25);border:1px solid rgba(139,105,20,0.2);padding:8px 4px">
              <div style="font-family:'Cinzel Decorative',serif;font-size:20px;color:var(--gold)">${fmtMod(prof)}</div>
              <div style="font-family:'Cinzel',serif;font-size:7px;letter-spacing:1px;color:var(--gold-dark);text-transform:uppercase;margin-top:2px">Bônus Prof.</div>
            </div>
            <div style="flex:1;text-align:center;background:rgba(0,0,0,0.25);border:1px solid rgba(139,105,20,0.2);padding:8px 4px">
              <div style="font-family:'Cinzel Decorative',serif;font-size:20px;color:var(--gold)">${passiva}</div>
              <div style="font-family:'Cinzel',serif;font-size:7px;letter-spacing:1px;color:var(--gold-dark);text-transform:uppercase;margin-top:2px">Perc. Passiva</div>
            </div>
          </div>
        </div>

        <!-- Salvaguardas -->
        <div class="box" style="padding:14px 16px">
          <div class="box-title" style="margin-bottom:10px">Salvaguardas</div>
          <div class="skills-list">
            ${ATRIBUTOS.map(a => saveRow(a)).join('')}
          </div>
        </div>

      </div>

      <!-- Coluna direita: duas colunas de perícias num único box -->
      <div class="box" style="padding:14px 18px">
        <div class="box-title" style="margin-bottom:10px">Perícias</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px">
          <div class="skills-list">${colA.map(p => skillinha(p)).join('')}</div>
          <div class="skills-list">${colB.map(p => skillinha(p)).join('')}</div>
        </div>
      </div>

    </div>
  `;
}

// =============================================================
// CARTEIRA (moedas) — dentro da aba Inventário
// =============================================================
function carteiraHTML(d) {
  const c = d.carteira;
  const totalPO = MOEDAS.reduce((sum, m) => sum + (parseFloat(c[m.id]) || 0) * m.paraPO, 0);
  return `
  <div class="box" style="margin-bottom:18px">
    <div class="box-title">Carteira</div>
    <div class="wallet-row">
      ${MOEDAS.map(m => `
        <div class="wallet-coin" style="border-top:3px solid ${m.cor}">
          <span class="wallet-coin-label">${m.sigla}</span>
          <input class="wallet-coin-input" type="number" min="0" value="${c[m.id]}" oninput="atualizarMoeda('${m.id}', this.value)">
          <span class="wallet-coin-name">${m.nome}</span>
        </div>
      `).join('')}
    </div>
    <div class="wallet-total">Total aproximado: <strong>${totalPO.toFixed(2)} PO</strong> <span style="opacity:0.6">(1 PP=10PO · 1PO=2PE · 1PO=10PT · 1PO=100PC)</span></div>
  </div>`;
}

function atualizarMoeda(id, valor) {
  const v = Math.max(0, parseFloat(valor) || 0);
  PERSONAGEM.dados.carteira[id] = v;
  agendarSalvar();
  renderInventario();
}

// =============================================================
// RENDER: ABA INVENTÁRIO
// =============================================================
function renderInventario() {
  const d = PERSONAGEM.dados;
  const itens = d.inventario;
  const pesoTotal = itens.reduce((sum, it) => sum + (parseFloat(it.peso)||0) * (parseInt(it.qtd)||0), 0);
  const capacidadeAuto = calcCapacidadeCarga();
  const capOverride = d.carga.capacidadeOverride;
  const capacidade = (capOverride !== null && capOverride !== undefined && capOverride !== '') ? parseFloat(capOverride) : capacidadeAuto;
  const pct = capacidade > 0 ? Math.min(150, (pesoTotal / capacidade) * 100) : 0;
  const sobrecarregado = pesoTotal > capacidade;

  document.getElementById('panel-inventario').innerHTML = `
    ${carteiraHTML(d)}

    <div class="box">
      <div class="carry-meter">
        <div class="carry-meter-row">
          <span class="carry-meter-label">Carga Transportada</span>
          <span class="carry-meter-val ${sobrecarregado?'over':''}"><span id="carryTotalLabel">${pesoTotal.toFixed(1)}</span> / <input type="number" step="0.1" class="hitdice-input" style="width:56px;display:inline-block" value="${capOverride!==null&&capOverride!==undefined?capOverride:''}" placeholder="${capacidadeAuto}" oninput="atualizarCapacidadeOverride(this.value)"> un.</span>
        </div>
        <div class="carry-bar-track"><div class="carry-bar-fill ${sobrecarregado?'over':''}" style="width:${pct}%"></div></div>
        ${sobrecarregado ? `<div style="font-family:'EB Garamond',serif;font-style:italic;font-size:12px;color:var(--blood-light);opacity:0.8;margin-top:6px">⚠ Sobrecarregado — desloc. reduzido e desvantagem em testes físicos.</div>` : ''}
        <div style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.45;margin-top:4px">Capacidade automática: Força × 15 = ${capacidadeAuto} un. (deixe o campo vazio pra usar o automático)</div>
      </div>

      <table class="inv-table">
        <thead>
          <tr><th style="width:40%">Item</th><th>Qtd.</th><th>Peso un.</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          ${itens.map((it, i) => `
          <tr>
            <td><input class="inv-name-input" value="${esc(it.nome)}" placeholder="Nome do item" oninput="atualizarItemInv(${i},'nome',this.value)"></td>
            <td><input class="inv-num-input" type="number" min="0" value="${it.qtd}" oninput="atualizarItemInv(${i},'qtd',this.value)"></td>
            <td><input class="inv-num-input" type="number" min="0" step="0.1" value="${it.peso}" oninput="atualizarItemInv(${i},'peso',this.value)"></td>
            <td style="font-family:'Cinzel',serif;font-size:12px;color:var(--parchment-dark)">${((parseFloat(it.peso)||0)*(parseInt(it.qtd)||0)).toFixed(1)}</td>
            <td><button class="inv-del-btn" onclick="removerItemInv(${i})">✕</button></td>
          </tr>`).join('')}
        </tbody>
      </table>

      <div class="inv-add-row">
        <button class="add-row-btn" onclick="adicionarItemInv()">+ Adicionar Item</button>
      </div>
    </div>
  `;
  document.getElementById('panel-inventario').classList.add('rendered-once');
}

function atualizarCapacidadeOverride(valor) {
  PERSONAGEM.dados.carga.capacidadeOverride = valor === '' ? null : valor;
  agendarSalvar();
  renderInventario();
}

function adicionarItemInv() {
  PERSONAGEM.dados.inventario.push({ nome: '', qtd: 1, peso: 0 });
  agendarSalvar();
  renderInventario();
}

function removerItemInv(i) {
  PERSONAGEM.dados.inventario.splice(i, 1);
  agendarSalvar();
  renderInventario();
}

function atualizarItemInv(i, campo, valor) {
  const it = PERSONAGEM.dados.inventario[i];
  if (!it) return;
  it[campo] = (campo === 'qtd' || campo === 'peso') ? (parseFloat(valor)||0) : valor;
  agendarSalvar();
  renderInventarioTotaisSomente();
}

// Atualiza barra de carga e totais de linha sem reconstruir os <input> (evita perder foco
// enquanto o jogador digita). Só o necessário é tocado: texto da barra, largura, e a célula
// "Total" de cada linha — nunca os inputs de nome/qtd/peso.
function renderInventarioTotaisSomente() {
  const d = PERSONAGEM.dados;
  const itens = d.inventario;
  const pesoTotal = itens.reduce((sum, it) => sum + (parseFloat(it.peso)||0) * (parseInt(it.qtd)||0), 0);
  const capacidadeAuto = calcCapacidadeCarga();
  const capOverride = d.carga.capacidadeOverride;
  const capacidade = (capOverride !== null && capOverride !== undefined && capOverride !== '') ? parseFloat(capOverride) : capacidadeAuto;
  const pct = capacidade > 0 ? Math.min(150, (pesoTotal / capacidade) * 100) : 0;
  const sobrecarregado = pesoTotal > capacidade;

  const totalLabel = document.getElementById('carryTotalLabel');
  const barEl = document.querySelector('.carry-bar-fill');
  const valEl = document.querySelector('.carry-meter-val');
  if (totalLabel) totalLabel.textContent = pesoTotal.toFixed(1);
  if (valEl) valEl.classList.toggle('over', sobrecarregado);
  if (barEl) { barEl.style.width = pct + '%'; barEl.classList.toggle('over', sobrecarregado); }

  document.querySelectorAll('.inv-table tbody tr').forEach((tr, i) => {
    const it = itens[i];
    if (!it) return;
    const totalCell = tr.children[3];
    if (totalCell) totalCell.textContent = ((parseFloat(it.peso)||0)*(parseInt(it.qtd)||0)).toFixed(1);
  });
}
// =============================================================
// ESTADOS ATIVOS (condições temporárias + permanentes) — aba Combate
// =============================================================
function estadosHTML(d) {
  return `
  <div class="box" style="margin-bottom:18px">
    <div class="box-title">Estados Ativos</div>

    <div style="margin-bottom:16px">
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold-dark);text-transform:uppercase;margin-bottom:8px">Temporários</div>
      <div class="condicoes-grid">
        ${CONDICOES_PADRAO.map(c => `
          <button type="button" class="condicao-chip ${d.condicoesTemp.includes(c.id) ? 'active' : ''}"
            onclick="toggleCondicaoTemp('${c.id}')">${c.nome}</button>
        `).join('')}
      </div>
    </div>

    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--gold-dark);text-transform:uppercase">Permanentes</span>
        <button class="add-row-btn" style="width:auto;padding:5px 14px" onclick="adicionarEstadoPermanente()">+ Adicionar</button>
      </div>
      ${d.estadosPermanentes.length === 0
        ? `<div style="font-family:'EB Garamond',serif;font-style:italic;color:var(--parchment-dark);opacity:0.4;font-size:13px;padding:4px 2px">Nenhum estado permanente registrado.</div>`
        : d.estadosPermanentes.map((e, i) => `
          <div class="permstate-row">
            <button class="permstate-del-btn" onclick="removerEstadoPermanente(${i})">✕</button>
            <input class="permstate-name-input" value="${esc(e.nome)}" placeholder="ex: Maldição da Lua Cheia"
              oninput="atualizarEstadoPermanente(${i},'nome',this.value)">
            <textarea class="permstate-desc-input" placeholder="Descrição do efeito..."
              oninput="atualizarEstadoPermanente(${i},'descricao',this.value)">${esc(e.descricao)}</textarea>
          </div>
        `).join('')
      }
    </div>
  </div>`;
}

function toggleCondicaoTemp(id) {
  const arr = PERSONAGEM.dados.condicoesTemp;
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1); else arr.push(id);
  agendarSalvar();
  renderCombate();
}

function adicionarEstadoPermanente() {
  PERSONAGEM.dados.estadosPermanentes.push({ nome: '', descricao: '' });
  agendarSalvar();
  renderCombate();
}

function removerEstadoPermanente(i) {
  PERSONAGEM.dados.estadosPermanentes.splice(i, 1);
  agendarSalvar();
  renderCombate();
}

function atualizarEstadoPermanente(i, campo, valor) {
  const e = PERSONAGEM.dados.estadosPermanentes[i];
  if (!e) return;
  e[campo] = valor;
  agendarSalvar();
}

function renderCombate() {
  const d = PERSONAGEM.dados;
  const prof = bonusProficiencia(d.level);

  // garante lista de ataques estruturados e slots de magia (níveis 0-9)
  if (!d.ataquesList) d.ataquesList = [];
  const slotsAindaNaoExistiam = !d.spellSlots || Object.keys(d.spellSlots).length === 0;
  for (let n = 0; n <= 9; n++) {
    if (!d.spellSlots[n]) d.spellSlots[n] = { max: 0, usados: 0 };
  }
  // primeira vez que essa aba é aberta: calcula slots automaticamente
  if (slotsAindaNaoExistiam) recalcularSlotsAutomaticos();

  if (!d.spellSlotsManual) d.spellSlotsManual = {};

  const magiasPorNivel = {};
  d.spells.forEach((sp, i) => {
    const nv = sp.nivel ?? 0;
    if (!magiasPorNivel[nv]) magiasPorNivel[nv] = [];
    magiasPorNivel[nv].push({ ...sp, _i: i });
  });
  const niveisComMagia = Object.keys(magiasPorNivel).map(Number).sort((a,b)=>a-b);

  document.getElementById('panel-combate').innerHTML = `

    <!-- ===== ESTADOS ATIVOS (única implementação — estadosHTML) ===== -->
    ${estadosHTML(d)}

    <!-- ===== ATAQUES ===== -->
    <div class="box" style="margin-bottom:18px">
      <div class="box-title">
        <span>Ataques</span>
        <button class="add-row-btn" style="width:auto;padding:5px 14px" onclick="adicionarAtaque()">+ Novo Ataque</button>
      </div>
      <table class="inv-table" style="margin-bottom:6px">
        <thead>
          <tr>
            <th style="width:30%">Nome</th>
            <th>Bônus Atq.</th>
            <th>Dano / Tipo</th>
            <th>Alcance</th>
            <th>Tipo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${d.ataquesList.length === 0
            ? `<tr><td colspan="6" style="font-family:'EB Garamond',serif;font-style:italic;color:var(--parchment-dark);opacity:0.4;font-size:13px;padding:10px 6px">Nenhum ataque cadastrado ainda.</td></tr>`
            : d.ataquesList.map((atq, i) => `
            <tr>
              <td><input class="inv-name-input" value="${esc(atq.nome)}" placeholder="ex: Espada Longa" oninput="atualizarAtaque(${i},'nome',this.value)"></td>
              <td><input class="inv-num-input" style="width:60px" value="${esc(atq.bonus)}" placeholder="+5" oninput="atualizarAtaque(${i},'bonus',this.value)"></td>
              <td><input class="inv-name-input" value="${esc(atq.dano)}" placeholder="1d8+3 cortante" oninput="atualizarAtaque(${i},'dano',this.value)"></td>
              <td><input class="inv-num-input" style="width:72px" value="${esc(atq.alcance)}" placeholder="1,5m" oninput="atualizarAtaque(${i},'alcance',this.value)"></td>
              <td>
                <select class="spell-meta-input" onchange="atualizarAtaque(${i},'tipo',this.value)">
                  ${['Corpo a corpo','À distância','Magia (toque)','Magia (dist.)','Especial']
                    .map(t => `<option value="${t}" ${atq.tipo===t?'selected':''}>${t}</option>`).join('')}
                </select>
              </td>
              <td><button class="inv-del-btn" onclick="removerAtaque(${i})">✕</button></td>
            </tr>`).join('')
          }
        </tbody>
      </table>
    </div>

    <!-- ===== ESPAÇOS DE MAGIA (inclui truques — nível 0) ===== -->
    <div class="box" style="margin-bottom:18px">
      <div class="box-title">Espaços de Magia por Nível</div>
      <div class="spell-slots-row">
        ${[0,1,2,3,4,5,6,7,8,9].map(n => {
          const conhecidas = (d.spells || []).filter(s => s.nivel === n).length;
          return spellSlotLvlHTML(n, d.spellSlots[n] || {max:0,usados:0}, !!(d.spellSlotsManual && d.spellSlotsManual[n]), conhecidas);
        }).join('')}
      </div>
      <div style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.5;margin-top:8px">
        Nível 0 = truques conhecidos (não são consumidos). Valores calculados automaticamente pela classe e nível.
      </div>
    </div>

    <!-- ===== GRIMÓRIO ===== -->
    <div class="box">
      <div class="box-title">
        <span>Grimório</span>
        <div style="display:flex;gap:8px">
          <button class="add-row-btn" style="width:auto;padding:5px 14px" onclick="abrirGrimorio()">🜸 Abrir Grimório</button>
          <button class="add-row-btn" style="width:auto;padding:5px 14px" onclick="adicionarMagia()">+ Magia Manual</button>
        </div>
      </div>

      ${spellGroupHTML(0, 'Truques (Nível 0)', magiasPorNivel[0])}
      ${[1,2,3,4,5,6,7,8,9].map(n => niveisComMagia.includes(n) ? spellGroupHTML(n, `Nível ${n}`, magiasPorNivel[n]) : '').join('')}
      ${d.spells.length === 0 ? `<div style="font-family:'EB Garamond',serif;font-style:italic;color:var(--parchment-dark);opacity:0.4;font-size:13px;padding:8px 2px">Nenhuma magia adicionada ainda. Abra o Grimório para aprender magias da sua classe.</div>` : ''}
    </div>
  `;
}

// Funções CRUD de ataques
function adicionarAtaque() {
  if (!PERSONAGEM.dados.ataquesList) PERSONAGEM.dados.ataquesList = [];
  PERSONAGEM.dados.ataquesList.push({ nome: '', bonus: '', dano: '', alcance: '', tipo: 'Corpo a corpo' });
  agendarSalvar();
  renderCombate();
}

function removerAtaque(i) {
  PERSONAGEM.dados.ataquesList.splice(i, 1);
  agendarSalvar();
  renderCombate();
}

function atualizarAtaque(i, campo, valor) {
  const atq = PERSONAGEM.dados.ataquesList[i];
  if (!atq) return;
  atq[campo] = valor;
  agendarSalvar();
}

function spellSlotLvlHTML(nivel, slot, isManual, conhecidas) {
  const max = slot.max || 0;
  const isTruque = nivel === 0;
  const noLimite = !isTruque && max > 0 && conhecidas >= max;
  return `
  <div class="spell-slot-lvl">
    <div class="spell-slot-lvl-head">
      <span class="spell-slot-lvl-label">${isTruque ? 'Truques' : 'Nv ' + nivel}</span>
      <button class="slot-reset-btn ${isManual ? '' : 'is-hidden'}" onclick="restaurarSlotAutomatico(${nivel})" title="Restaurar cálculo automático" ${isManual ? '' : 'tabindex="-1"'}>↺</button>
    </div>

    <input class="spell-slot-max-input" type="number" min="0" max="${isTruque ? 10 : 9}" value="${max}"
      onchange="atualizarSlotMax(${nivel}, this.value)"
      title="${isManual ? 'Ajustado manualmente — clique no ↺ para voltar ao automático' : (isTruque ? 'Truques conhecidos (calculado automaticamente)' : 'Espaços de magia (calculado automaticamente)')}">

    <div class="spell-slot-dots">
      ${isTruque
        ? ''
        : Array.from({length: Math.max(max,1)}).map((_, i) => max === 0 ? '' : `
          <div class="spell-slot-dot ${i < slot.usados ? 'used' : ''}" onclick="toggleSpellSlot(${nivel}, ${i+1})"></div>
        `).join('')
      }
    </div>

    ${max > 0 ? `<span class="spell-known-count ${noLimite ? 'full' : ''}" title="Magias ${isTruque ? '(truques)' : 'de nível ' + nivel} aprendidas neste nível, de um máximo de ${max}">${conhecidas}/${max} conhecidas</span>` : ''}
  </div>`;
}

// spellKnownLvlHTML e atualizarSpellsKnownMax foram removidos (BUG 2):
// o limite de magias/truques conhecidos agora vem de spellSlots[nivel].max,
// calculado automaticamente por calcularSpellSlots() ao trocar classe/nível.

function abrirGrimorio() {
  // Salva imediatamente antes de abrir, para o iframe ler os dados mais recentes
  if (_saveTimeout) salvarAgora();

  // Reutiliza o overlay se já existir
  let overlay = document.getElementById('grimorio-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'grimorio-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9000',
      'background:rgba(5,3,1,0.82)',
      'backdrop-filter:blur(5px)',
      '-webkit-backdrop-filter:blur(5px)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:0'
    ].join(';');

    const iframe = document.createElement('iframe');
    iframe.id = 'grimorio-iframe';
    iframe.style.cssText = [
      'width:100%', 'max-width:900px',
      'height:90vh', 'max-height:920px',
      'border:none', 'border-radius:0',
      'background:transparent'
    ].join(';');
    iframe.src = 'livros/grimorio.html?id=' + encodeURIComponent(CHAR_ID);

    overlay.appendChild(iframe);
    document.body.appendChild(overlay);

    // Fecha ao clicar no fundo escuro (fora do iframe)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharGrimorio();
    });
  } else {
    // Já existe: atualiza o src para recarregar com dados frescos
    const iframe = document.getElementById('grimorio-iframe');
    if (iframe) iframe.src = 'livros/grimorio.html?id=' + encodeURIComponent(CHAR_ID);
    overlay.style.display = 'flex';
  }
}

function fecharGrimorio() {
  const overlay = document.getElementById('grimorio-overlay');
  if (overlay) overlay.style.display = 'none';

  // Relê dados do localStorage (o grimório pode ter adicionado magias)
  // e re-renderiza a aba Combate para refletir as mudanças imediatamente.
  PERSONAGENS = loadData('forja_personagens', []);
  const atualizado = PERSONAGENS.find(x => x.id === CHAR_ID);
  if (atualizado) {
    PERSONAGEM = atualizado;
    PERSONAGEM.dados = mesclarComDefault(atualizado.dados || {});
  }
  renderCombate();
}

function toggleSpellSlot(nivel, posicao) {
  const slot = PERSONAGEM.dados.spellSlots[nivel];
  slot.usados = (slot.usados === posicao) ? posicao - 1 : posicao;
  agendarSalvar();
  renderCombate();
}

function atualizarSlotMax(nivel, valor) {
  const max = Math.max(0, Math.min(9, parseInt(valor)||0));
  const slot = PERSONAGEM.dados.spellSlots[nivel];
  slot.max = max;
  if (slot.usados > max) slot.usados = max;
  // marca esse nível como ajustado manualmente: o recálculo automático
  // (ao trocar classe/nível) não vai mais sobrescrever esse valor
  if (!PERSONAGEM.dados.spellSlotsManual) PERSONAGEM.dados.spellSlotsManual = {};
  PERSONAGEM.dados.spellSlotsManual[nivel] = true;
  agendarSalvar();
  renderCombate();
}

function restaurarSlotAutomatico(nivel) {
  if (PERSONAGEM.dados.spellSlotsManual) delete PERSONAGEM.dados.spellSlotsManual[nivel];
  recalcularSlotsAutomaticos();
  agendarSalvar();
  renderCombate();
}

function spellGroupHTML(nivel, titulo, lista) {
  if (!lista || !lista.length) {
    if (nivel !== 0) return '';
    lista = [];
  }
  const max = (PERSONAGEM.dados.spellSlots && PERSONAGEM.dados.spellSlots[nivel] && PERSONAGEM.dados.spellSlots[nivel].max) || 0;
  const preparadas = lista.filter(sp => sp.preparada).length;
  const mostraContador = nivel !== 0 && max > 0;
  return `
  <div class="spell-group">
    <div class="spell-group-title">
      ${titulo}
      ${mostraContador ? `<span class="spell-group-prep-count ${preparadas>=max?'full':''}">${preparadas}/${max} preparadas</span>` : ''}
    </div>
    ${lista.map(sp => `
      <div class="spell-row" style="grid-template-columns:24px 1fr 70px 90px 26px">
        <input type="checkbox" class="spell-prep" ${sp.preparada?'checked':''} title="${sp.nivel===0?'Truques sempre disponíveis':'Preparada (consome espaço de magia)'}" onchange="toggleMagiaPreparada(${sp._i})">
        <input class="spell-name-input" value="${esc(sp.nome)}" placeholder="Nome da magia" oninput="atualizarMagiaCampo(${sp._i}, 'nome', this.value)">
        <select class="spell-meta-input" onchange="atualizarMagiaNivel(${sp._i}, this.value)">
          ${[0,1,2,3,4,5,6,7,8,9].map(n => `<option value="${n}" ${sp.nivel===n?'selected':''}>${n===0?'Truque':'Nv '+n}</option>`).join('')}
        </select>
        <input class="spell-meta-input" value="${esc(sp.escola||'')}" placeholder="escola/efeito" oninput="atualizarMagiaCampo(${sp._i}, 'escola', this.value)">
        <button class="spell-del-btn" onclick="removerMagia(${sp._i})">✕</button>
      </div>
    `).join('')}
  </div>`;
}

function atualizarMagiaNivel(i, valor) {
  const sp = PERSONAGEM.dados.spells[i];
  if (!sp) return;
  sp.nivel = parseInt(valor) || 0;
  agendarSalvar();
  renderCombate();
}

function adicionarMagia() {
  PERSONAGEM.dados.spells.push({ nome: '', nivel: 1, preparada: false, escola: '' });
  agendarSalvar();
  renderCombate();
}

function removerMagia(i) {
  PERSONAGEM.dados.spells.splice(i, 1);
  agendarSalvar();
  renderCombate();
}

function atualizarMagiaCampo(i, campo, valor) {
  const sp = PERSONAGEM.dados.spells[i];
  if (!sp) return;
  sp[campo] = valor;
  agendarSalvar();
}

function toggleMagiaPreparada(i) {
  const sp = PERSONAGEM.dados.spells[i];
  if (!sp) return;

  // Truques (nível 0) nunca consomem espaço de magia — sempre pode preparar/usar livremente.
  if (sp.nivel === 0) {
    sp.preparada = !sp.preparada;
    agendarSalvar();
    return;
  }

  // Vai marcar como preparada agora: checa se ainda há espaço de magia disponível
  // naquele nível (quantas OUTRAS magias do mesmo nível já estão preparadas).
  if (!sp.preparada) {
    const max = (PERSONAGEM.dados.spellSlots && PERSONAGEM.dados.spellSlots[sp.nivel] && PERSONAGEM.dados.spellSlots[sp.nivel].max) || 0;
    const jaPreparadas = PERSONAGEM.dados.spells.filter(s => s.nivel === sp.nivel && s.preparada).length;

    if (max === 0) {
      showToast(`Seu personagem não tem espaços de magia de nível ${sp.nivel} ainda.`, 'warning');
      renderCombate(); // garante que o checkbox volte ao estado desmarcado visualmente
      return;
    }
    if (jaPreparadas >= max) {
      showToast(`Limite de magias de nível ${sp.nivel} preparadas atingido (${jaPreparadas}/${max}). Desmarque outra antes de preparar esta.`, 'warning');
      renderCombate();
      return;
    }
  }

  sp.preparada = !sp.preparada;
  agendarSalvar();
  renderCombate();
}

// toggleCondicao foi removido (BUG 4): use toggleCondicaoTemp (implementação única em estadosHTML).
// adicionarEstadoPermanente / removerEstadoPermanente / atualizarEstadoPermanente
// estão definidos acima, junto a estadosHTML — não há duplicata aqui.
// =============================================================
// RENDER: ABA BIOGRAFIA
// =============================================================
function renderBiografia() {
  const d = PERSONAGEM.dados;
  const b = d.bio;

  function caixaResumo(campo, label, placeholder) {
    return `
    <div>
      <div class="box-title" style="font-size:9px;margin-bottom:6px">${label}</div>
      <textarea class="text-box" style="min-height:100px" placeholder="${placeholder}"
        oninput="atualizarBioCampo('${campo}', this.value)">${esc(b[campo])}</textarea>
    </div>`;
  }

  document.getElementById('panel-biografia').innerHTML = `
    <div class="box" style="margin-bottom:18px">
      <div class="box-title">Aparência Física</div>
      <div class="identity-row" style="margin-bottom:14px">
        <div class="identity-field">
          <label class="identity-label">Altura</label>
          <input class="identity-input" value="${esc(b.altura)}" placeholder="ex: 1,78m" oninput="atualizarBioCampo('altura', this.value)">
        </div>
        <div class="identity-field">
          <label class="identity-label">Peso</label>
          <input class="identity-input" value="${esc(b.peso)}" placeholder="ex: 75kg" oninput="atualizarBioCampo('peso', this.value)">
        </div>
        <div class="identity-field">
          <label class="identity-label">Idade</label>
          <input class="identity-input" value="${esc(b.idade)}" placeholder="ex: 27 anos" oninput="atualizarBioCampo('idade', this.value)">
        </div>
        <div class="identity-field">
          <label class="identity-label">Cor dos Olhos</label>
          <input class="identity-input" value="${esc(b.corOlhos)}" placeholder="ex: Verdes" oninput="atualizarBioCampo('corOlhos', this.value)">
        </div>
      </div>
      <textarea class="text-box" style="min-height:90px" placeholder="Descreva a aparência geral do personagem..."
        oninput="atualizarBioCampo('aparencia', this.value)">${esc(b.aparencia)}</textarea>
    </div>

    <div class="box" style="margin-bottom:18px">
      <div class="box-title">História</div>
      <textarea class="text-box" style="min-height:200px" placeholder="Origem, eventos marcantes, motivações..."
        oninput="atualizarBioCampo('historia', this.value)">${esc(b.historia)}</textarea>
    </div>

    <div class="box">
      <div class="box-title">Resumo do Personagem</div>
      <div class="bio-resumo-grid">
        ${caixaResumo('personalidade', 'Personalidade', 'Como ele age, fala, reage...')}
        ${caixaResumo('ideais', 'Ideais', 'O que ele defende ou busca...')}
        ${caixaResumo('vinculos', 'Vínculos', 'Pessoas, lugares ou objetos importantes...')}
        ${caixaResumo('defeitos', 'Defeitos', 'Fraquezas, vícios, medos...')}
      </div>
    </div>
  `;
}

function atualizarBioCampo(campo, valor) {
  PERSONAGEM.dados.bio[campo] = valor;
  agendarSalvar();
}

// =============================================================
// RENDER: ABA BIOGRAFIA
// =============================================================
function renderBiografia() {
  const d = PERSONAGEM.dados;
  const bio = d.bio || {};

  document.getElementById('panel-biografia').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:18px">
      
      <!-- ===== APARÊNCIA FÍSICA ===== -->
      <div class="box">
        <div class="box-title">Aparência Física</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px">
          <div class="identity-field">
            <label class="identity-label">Altura</label>
            <input class="identity-input" type="text" value="${esc(bio.altura)}" placeholder="ex: 1,80m"
              oninput="atualizarBio('altura', this.value)">
          </div>
          <div class="identity-field">
            <label class="identity-label">Peso</label>
            <input class="identity-input" type="text" value="${esc(bio.peso)}" placeholder="ex: 80kg"
              oninput="atualizarBio('peso', this.value)">
          </div>
          <div class="identity-field">
            <label class="identity-label">Idade</label>
            <input class="identity-input" type="text" value="${esc(bio.idade)}" placeholder="ex: 28"
              oninput="atualizarBio('idade', this.value)">
          </div>
          <div class="identity-field">
            <label class="identity-label">Cor dos Olhos</label>
            <input class="identity-input" type="text" value="${esc(bio.corOlhos)}" placeholder="ex: Azuis"
              oninput="atualizarBio('corOlhos', this.value)">
          </div>
        </div>
        <div class="identity-field" style="margin-bottom:0">
          <label class="identity-label">Aparência Geral</label>
          <textarea class="text-box" style="min-height:100px" placeholder="Descrição física, cicatrizes, tatuagens, características únicas..."
            oninput="atualizarBio('aparencia', this.value)">${esc(bio.aparencia)}</textarea>
        </div>
      </div>

      <!-- ===== HISTÓRIA ===== -->
      <div class="box">
        <div class="box-title">História</div>
        <textarea class="text-box" style="min-height:140px" placeholder="Passado, motivações, encontros importantes, grandes eventos..."
          oninput="atualizarBio('historia', this.value)">${esc(bio.historia)}</textarea>
      </div>

      <!-- ===== RESUMO DE PERSONALIDADE (4 COLUNAS) ===== -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        <div class="box">
          <div class="box-title">Personalidade</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Traços, maneirismos, hábitos..."
            oninput="atualizarBio('personalidade', this.value)">${esc(bio.personalidade)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Ideais</div>
          <textarea class="text-box" style="min-height:130px" placeholder="O que o personagem acredita, valores, moralidade..."
            oninput="atualizarBio('ideais', this.value)">${esc(bio.ideais)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Vínculos</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Pessoas, lugares ou coisas importantes..."
            oninput="atualizarBio('vinculos', this.value)">${esc(bio.vinculos)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Defeitos</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Medos, fraquezas, fobias, segredos..."
            oninput="atualizarBio('defeitos', this.value)">${esc(bio.defeitos)}</textarea>
        </div>
      </div>

    </div>
  `;
}

function atualizarBio(campo, valor) {
  if (!PERSONAGEM.dados.bio) PERSONAGEM.dados.bio = {};
  PERSONAGEM.dados.bio[campo] = valor;
  agendarSalvar();
}

// =============================================================
// RENDER: ABA NOTAS
// =============================================================
function renderNotas() {
  const d = PERSONAGEM.dados;
  document.getElementById('panel-notas').innerHTML = `
    <div class="box">
      <div class="box-title">Anotações Livres</div>
      <textarea class="text-box" style="min-height:420px" oninput="atualizarCampoSimples('notas', this.value)" placeholder="Histórico, plot hooks, lembretes da mesa...">${esc(d.notas)}</textarea>
    </div>
  `;
}

// =============================================================
// ABAS
// =============================================================
function switchTab(id) {
  document.querySelectorAll('.sheet-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sheet-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  document.getElementById('panel-' + id).classList.add('active');
}

// =============================================================
// AUTOSAVE
// =============================================================
let _saveTimeout = null;

function agendarSalvar() {
  clearInterval(_saveTimeout);
  clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(salvarAgora, 450);
}

function salvarAgora() {
  if (!PERSONAGEM) return;
  // sincroniza nome (input do topo) de volta pro objeto raiz, já que home-screen usa p.nome
  const nomeInput = document.getElementById('f_nome');
  if (nomeInput) PERSONAGEM.nome = nomeInput.value.trim() || PERSONAGEM.nome;

  const idx = PERSONAGENS.findIndex(x => x.id === CHAR_ID);
  if (idx >= 0) PERSONAGENS[idx] = PERSONAGEM;
  saveData('forja_personagens', PERSONAGENS);
  mostrarIndicadorSalvo();
}

function mostrarIndicadorSalvo() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.textContent = '✓ Salvo';
  el.classList.add('show');
  clearTimeout(el._hideTimeout);
  el._hideTimeout = setTimeout(() => el.classList.remove('show'), 1600);
}

// =============================================================
// TOAST (mesmo padrao da tela principal)
// =============================================================
function showToast(msg, type = '') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  if (type === 'warning') t.style.borderColor = 'var(--blood-light)';
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(30px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// =============================================================
// INIT
// =============================================================
function montarEstruturaAbas() {
  document.getElementById('sheetContent').innerHTML = `
    <section class="sheet-panel active" id="panel-principal"></section>
    <section class="sheet-panel" id="panel-pericias"></section>
    <section class="sheet-panel" id="panel-combate"></section>
    <section class="sheet-panel" id="panel-inventario"></section>
    <section class="sheet-panel" id="panel-biografia"></section>
    <section class="sheet-panel" id="panel-notas"></section>
  `;
}

function init() {
  if (!carregarPersonagem()) return;

  montarEstruturaAbas();
  document.getElementById('f_nome').value = PERSONAGEM.nome || '';

  renderPrincipal();
  renderPericias();
  renderCombate();
  renderInventario();
  renderBiografia();
  renderNotas();
}

window.addEventListener('beforeunload', () => { if (_saveTimeout) salvarAgora(); });

init();
