// =============================================================
// DADOS DO SISTEMA ETHERION
// =============================================================
const ATRIBUTOS_ETH = [
  { id: 'for', nome: 'FOR', full: 'Força' },
  { id: 'cos', nome: 'COS', full: 'Constituição' },
  { id: 'agi', nome: 'AGI', full: 'Agilidade' },
  { id: 'int', nome: 'INT', full: 'Inteligência' },
  { id: 'sab', nome: 'SAB', full: 'Sabedoria' },
  { id: 'car', nome: 'CAR', full: 'Carisma' }
];

const PERICIAS_ETH = [
  { id: 'atletismo',     nome: 'Atletismo',     attr: 'for' },
  { id: 'fortitude',     nome: 'Fortitude',     attr: 'cos' },
  { id: 'acrobacia',     nome: 'Acrobacia',     attr: 'agi' },
  { id: 'furtividade',   nome: 'Furtividade',   attr: 'agi' },
  { id: 'ladinagem',     nome: 'Ladinagem',     attr: 'agi' },
  { id: 'arcanismo',     nome: 'Arcanismo',     attr: 'int' },
  { id: 'artificio',     nome: 'Artifício',     attr: 'int', temFoco: true },
  { id: 'investigacao',  nome: 'Investigação',  attr: 'int' },
  { id: 'legado',        nome: 'Legado',        attr: 'int' },
  { id: 'ocultismo',     nome: 'Ocultismo',     attr: 'int' },
  { id: 'teologia',      nome: 'Teologia',      attr: 'int' },
  { id: 'tatica',        nome: 'Tática',        attr: 'int' },
  { id: 'adaptacao',     nome: 'Adaptação',     attr: 'sab' },
  { id: 'adestramento',  nome: 'Adestramento',  attr: 'sab' },
  { id: 'discernimento', nome: 'Discernimento', attr: 'sab' },
  { id: 'exploracao',    nome: 'Exploração',    attr: 'sab' },
  { id: 'percepcao',     nome: 'Percepção',     attr: 'sab' },
  { id: 'sintonia',      nome: 'Sintonia',      attr: 'sab' },
  { id: 'socorrismo',    nome: 'Socorrismo',    attr: 'sab' },
  { id: 'vontade',       nome: 'Vontade',       attr: 'sab' },
  { id: 'diplomacia',    nome: 'Diplomacia',    attr: 'car' },
  { id: 'enganacao',     nome: 'Enganação',     attr: 'car' },
  { id: 'intimidacao',   nome: 'Intimidação',   attr: 'car' },
  { id: 'malandragem',   nome: 'Malandragem',   attr: 'car' },
  { id: 'tradicao',      nome: 'Tradição',      attr: 'car' },
];

const DIVINDADES_ETH = [
  'Nenhuma (Ateu/Herético)',
  'Archëon (Criação)',
  'Nyxara (Lua/Marés)',
  'Maelthra (Terra)',
  'Pyraël (Sol)',
  'Khaíros (Tempo)',
  'Aethrys (Sabedoria)',
  'Elyssera (Vida)',
  'Zyrhûn (Caos/Mácula)',
  'Káryon Thraël (Trovões)',
  'Nerýth Kalos (Oceanos)',
  'Lyrëa (Beleza/Fadas)',
  'Ordelyne (Ordem/Luz)',
  'Morvethra (Morte)',
  'Kharvion (Submundo/Trevas)',
  'Mabryth (Teias/Destino)'
];

const ALINHAMENTOS = [
  'Leal Bom', 'Neutro Bom', 'Caótico Bom',
  'Leal Neutro', 'Neutro', 'Caótico Neutro',
  'Leal Mau', 'Neutro Mau', 'Caótico Mau'
];

const PONTOS_INICIAIS = 6;
const ATRIB_BASE     = 1;
const ATRIB_CAP       = 20; // teto atual de atributo — método de compra além do cap ainda será definido

// =============================================================
// STORAGE
// =============================================================
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
function loadData(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
}

// =============================================================
// ESTADO GLOBAL
// =============================================================
let CHAR_ID    = null;
let PERSONAGEM = null;
let PERSONAGENS = [];

// Esta página roda dentro do <iframe id="sheet-frame"> do shell
// (index.html). Quem inicializa o Supabase e pendura o client em
// window.supabaseClient é o bloco-ponte <script type="module"> do
// PRÓPRIO index.html — isso acontece no window do shell, não no window
// deste iframe (cada documento tem seu window). Por isso lemos daqui
// via window.parent.supabaseClient (mesma origem; o iframe em
// index.html já tem sandbox="allow-same-origin", então isso funciona).
// O fallback pra window.supabaseClient só existe pra não quebrar se
// algum dia esta página for aberta fora do shell, sem pai nenhum
// (ex: teste manual direto do arquivo) — nesse caso não há client
// nenhum disponível mesmo, e o código segue pro fallback de
// localStorage normalmente.
function obterSupabase() {
  try {
    if (window.parent && window.parent !== window && window.parent.supabaseClient) {
      return window.parent.supabaseClient;
    }
  } catch (e) {
    // cross-origin de verdade (não deveria acontecer aqui, mesma origem) — ignora e cai no fallback abaixo
  }
  return window.supabaseClient || null;
}

async function carregarPersonagem() {
  const params = new URLSearchParams(window.location.search);
  CHAR_ID = params.get('id');

  if (!CHAR_ID) { mostrarVazio('Nenhum personagem especificado na URL.'); return false; }

  // Tenta buscar do Supabase primeiro (fonte de verdade).
  const sb = obterSupabase();
  if (sb) {
    const { data: { user } = {} } = await sb.auth.getUser();

    const { data, error } = await sb
      .from('personagens')
      .select('*')
      .eq('id', CHAR_ID)
      .maybeSingle();

    if (error) {
      console.error('[etherion-ficha] erro ao buscar personagem no Supabase:', error.message);
    } else if (data) {
      // SEGUNDA CAMADA DE DEFESA (além do RLS no banco): o RLS já deveria
      // impedir que esta query retorne um personagem de outro usuário, mas
      // se o RLS for desabilitado acidentalmente (manutenção, reset),
      // confirmamos aqui no client que quem está vendo é o dono OU o
      // mestre da campanha à qual o personagem pertence — nunca um
      // terceiro qualquer. Não filtramos a query por dono_id porque
      // mestres legitimamente precisam ver fichas de outros jogadores
      // (ver campanha-dnd.html / campanha-op.html / campanha-tormenta.html).
      const ehDono = user && data.dono_id === user.id;
      let ehMestre = false;
      if (!ehDono && user && data.campanha_id) {
        const { data: camp } = await sb
          .from('campanhas')
          .select('mestre_id')
          .eq('id', data.campanha_id)
          .maybeSingle();
        ehMestre = !!(camp && camp.mestre_id === user.id);
      }

      if (!ehDono && !ehMestre) {
        console.error('[etherion-ficha] personagem pertence a outro usuário e quem está logado não é o mestre da campanha — bloqueando exibição.');
        mostrarVazio('Você não tem permissão para ver esta ficha.');
        return false;
      }

      MODO_SOMENTE_LEITURA = !ehDono; // dono edita normalmente; mestre vendo ficha alheia só visualiza

      // Supabase guarda os dados do personagem na coluna `dados` (jsonb).
      // Montamos o objeto no formato que o restante do código espera.
      PERSONAGEM = { id: data.id, nome: data.nome, sistema: data.sistema, dados: data.dados || {}, donoId: data.dono_id, campanhaId: data.campanha_id };
    }
  }

  // Fallback: tenta localStorage (personagens antigos ou criados offline).
  if (!PERSONAGEM) {
    PERSONAGENS = loadData('forja_personagens') || [];
    PERSONAGEM = PERSONAGENS.find(p => p.id === CHAR_ID) || null;
  }

  if (!PERSONAGEM) { mostrarVazio('Personagem não encontrado. Verifique se foi criado na Forja.'); return false; }

  // Garante estrutura mínima
  if (!PERSONAGEM.dados) PERSONAGEM.dados = {};
  const d = PERSONAGEM.dados;
  if (!d.attrs) d.attrs = {};
  if (!d.profs) d.profs = {};
  if (!d.focos) d.focos = {};
  if (!d.recursos) d.recursos = { vida: { cur: 10, max: 10 }, san: { cur: 10, max: 10 }, sopro: { cur: 5, max: 5 }, macula: { cur: 0, max: 12 } };
  if (!d.estados) d.estados = { temp: [], perm: [] };
  if (!d.habRaciais) d.habRaciais = [];
  if (!d.chamados) d.chamados = [];
  if (!d.ataques) d.ataques = [];
  if (!d.inventario) d.inventario = [];
  if (!d.moedas) d.moedas = { cobre: 0, prata: 0, ouro: 0 };
  if (!d.bio) d.bio = {};
  if (!d.notas) d.notas = '';
  if (!d.classeBase) d.classeBase = '';
  if (!d.classeEspec) d.classeEspec = '';

  // Migração: versões antigas podiam salvar d.classeBase como nome legível
  // (ex: 'Vanguarda') em vez da chave do objeto (ex: 'vanguarda').
  // Aqui normalizamos para a chave, que é o que listarClassesBase() e
  // listarEspecializacoes() esperam.
  if (d.classeBase && typeof classesRPG !== 'undefined') {
    const idDireto = classesRPG[d.classeBase]; // já é uma chave válida?
    if (!idDireto) {
      // Tenta casar pelo nome (case-insensitive)
      const idEncontrado = Object.keys(classesRPG).find(k =>
        classesRPG[k].nome.toLowerCase() === d.classeBase.toLowerCase()
      );
      if (idEncontrado) d.classeBase = idEncontrado;
    }
  }
  if (d.classeBase && d.classeEspec && typeof classesRPG !== 'undefined') {
    const base = classesRPG[d.classeBase];
    const especs = base ? (base.especializacoes || {}) : {};
    const idDireto = especs[d.classeEspec]; // já é uma chave válida?
    if (!idDireto) {
      // Tenta casar pelo nome (case-insensitive)
      const idEncontrado = Object.keys(especs).find(k =>
        especs[k].nome.toLowerCase() === d.classeEspec.toLowerCase()
      );
      if (idEncontrado) d.classeEspec = idEncontrado;
    }
  }

  // Migração: preenche/atualiza d.classeNome (label legível) para
  // personagens que ainda não tinham esse campo, ou cujo classeBase/
  // classeEspec foi normalizado acima — mesmo padrão de d.raca logo
  // abaixo. Isso garante que campanha.html (que não carrega classes.js)
  // consiga mostrar o nome da classe assim que o jogador reabrir a
  // ficha uma vez, mesmo sem editar nada.
  if (d.classeBase && typeof classesRPG !== 'undefined' && classesRPG[d.classeBase]) {
    const base = classesRPG[d.classeBase];
    const espec = d.classeEspec ? (base.especializacoes || {})[d.classeEspec] : null;
    d.classeNome = espec ? espec.nome : base.nome;
  }

  if (!d.origemId) d.origemId = '';
  if (!d.origemPericiasEscolhidas) d.origemPericiasEscolhidas = [];
  if (!d.classePericiasAtivas) d.classePericiasAtivas = [];
  if (!d.grimorio) d.grimorio = { ultimaCombo: { aspecto: '', verbo: '', mod: '', manifestacao: '', circulo: 1 }, magiasSalvas: [], aspectosLivres: [] };
  // Migração: combos antigos não tinham o campo 'manifestacao'
  if (d.grimorio.ultimaCombo && d.grimorio.ultimaCombo.manifestacao === undefined) {
    d.grimorio.ultimaCombo.manifestacao = '';
  }
  // Migração: fichas antigas não tinham aspectosLivres (Trava 1 —
  // aspectos escolhidos livremente dentro das vagas da classe).
  if (!Array.isArray(d.grimorio.aspectosLivres)) d.grimorio.aspectosLivres = [];

  // Migração: personagens antigos só tinham d.raca (texto livre).
  // Tenta casar com o banco de raças pra preencher família/sub-raça.
  if (!d.racaFamilia && d.raca) {
    const match = buscarRaca(d.raca)[0];
    if (match) { d.racaFamilia = match.familiaId; d.racaSubraca = match.subracaId; }
  }

  // Migração: personagens antigos só tinham d.antecedente (texto livre,
  // vindo do datalist). Tenta casar pelo nome com o banco de origens.
  if (!d.origemId && d.antecedente && typeof origensRPG !== 'undefined') {
    const idEncontrado = Object.keys(origensRPG).find(
      k => origensRPG[k].nome.toLowerCase() === String(d.antecedente).trim().toLowerCase()
    );
    if (idEncontrado) d.origemId = idEncontrado;
  }

  // Atributos default: usa o PISO racial (base 1 + bônus da raça atual),
  // não mais um "1" fixo pra todo mundo.
  ATRIBUTOS_ETH.forEach(a => {
    if (d.attrs[a.id] === undefined) d.attrs[a.id] = getPisoAtrib(a.id, d);
  });

  return true;
}

// =============================================================
// RAÇA: piso de atributo + leitura do banco (etherion-racas.js)
// =============================================================

// Piso = base 1 + bônus de atributo da sub-raça escolhida (nunca abaixo de 1).
function getPisoAtrib(attrId, d) {
  d = d || PERSONAGEM.dados;
  const sub = getSubraca(d.racaFamilia, d.racaSubraca);
  const bonus = sub && sub.attrBonus ? (sub.attrBonus[attrId] || 0) : 0;
  return Math.max(ATRIB_BASE, ATRIB_BASE + bonus);
}

// =============================================================
// ENGINE — Cálculo automático dos máximos de recursos
// Lógica espelhada de engine.js, sem dependência de import/export.
// =============================================================
function calcularModificador(val) {
  return Math.floor((parseInt(val) || 0) / 2);
}

function calcularRecursosMaximos() {
  const d = PERSONAGEM.dados;
  const classeChave = d.classeBase || '';
  const nivel = parseInt(d.level) || 1;
  const cos   = getAtrib('cos');
  const sab   = getAtrib('sab');
  const int_  = getAtrib('int');

  const classe = (typeof classesRPG !== 'undefined') ? classesRPG[classeChave] : null;

  // ── Vida ──────────────────────────────────────────────────────
  // HP = hpInicial + mod(COS) + hpPorNivel × (nivel - 1)
  let vidaMax = 10;
  if (classe) {
    const modCos = calcularModificador(cos);
    vidaMax = (classe.hpInicial || 10) + modCos + (classe.hpPorNivel || 0) * (nivel - 1);
  }

  // ── Sanidade ──────────────────────────────────────────────────
  // Sanidade = 10 + mod(SAB)
  const sanMax = 10 + calcularModificador(sab);

  // ── Sopro ─────────────────────────────────────────────────────
  // Sopro = 3 + mod(atributoFoco da classe) + floor(nivel / 2)
  let soproMax = 3;
  if (classe && classe.atributoFoco && typeof sistemaMagia !== 'undefined') {
    const modFoco = calcularModificador(getAtrib(classe.atributoFoco));
    soproMax = sistemaMagia.calcularLimiteSopro(nivel, modFoco);
  } else if (classe && classe.atributoFoco) {
    // Fallback caso sistemaMagia não esteja carregado (não deve ocorrer em produção)
    soproMax = 3 + calcularModificador(getAtrib(classe.atributoFoco));
  }

  // ── Mácula ────────────────────────────────────────────────────
  // Mácula = 12 + (floor(nivel / 5) × 2)
  const maculaMax = typeof sistemaMagia !== 'undefined'
    ? sistemaMagia.calcularLimiteMacula(nivel)
    : 12;

  return { vidaMax, sanMax, soproMax, maculaMax };
}

// Recalcula e aplica os máximos nos recursos do personagem.
// Nunca deixa o cur maior que o novo max.
// Atualiza o DOM inline sem re-render completo quando possível.
function recalcularEAplicarRecursos() {
  const d = PERSONAGEM.dados;
  const { vidaMax, sanMax, soproMax, maculaMax } = calcularRecursosMaximos();

  const novosMax = { vida: vidaMax, san: sanMax, sopro: soproMax, macula: maculaMax };

  Object.entries(novosMax).forEach(([id, novoMax]) => {
    if (!d.recursos[id]) {
      d.recursos[id] = { cur: novoMax, max: novoMax };
    } else {
      // Se o max subiu (ex: subiu de nível, ganhou atributo, trocou de
      // classe), soma a diferença no cur também — em vez de deixar o cur
      // parado no valor antigo. Isso preserva o déficit que já existia
      // (dano sofrido, sopro gasto etc.) ao invés de fazer o jogador
      // "perder" o ganho do novo nível. Ex: 8/10 vida, sobe nível e o
      // max vai pra 15 → devia virar 13/15 (ganhou os mesmos +5 do max),
      // não ficar travado em 8/15.
      const maxAntigo = d.recursos[id].max;
      const delta = novoMax - maxAntigo;
      if (delta > 0) {
        d.recursos[id].cur = Math.min(novoMax, d.recursos[id].cur + delta);
      }
      d.recursos[id].max = novoMax;
    }
    // Garante que cur não ultrapasse o novo max (cobre o caso do max ter diminuído)
    if (d.recursos[id].cur > novoMax) d.recursos[id].cur = novoMax;

    // Atualiza DOM inline se os campos já existirem na tela
    const maxEl = document.getElementById('rmax_' + id);
    const curEl = document.getElementById('rcur_' + id);
    const barEl = document.getElementById('rbar_' + id);
    if (maxEl) maxEl.value = novoMax;
    if (curEl) { curEl.value = d.recursos[id].cur; curEl.max = novoMax; }
    if (barEl) {
      const pct = novoMax > 0 ? Math.min(100, Math.round((d.recursos[id].cur / novoMax) * 100)) : 0;
      barEl.style.width = pct + '%';
    }
  });

  agendarSalvar();
}

// Aplica raça escolhida: remove o bônus da raça anterior e aplica o da nova.
// - Subtrai o attrBonus da sub-raça antiga de cada atributo (sem descer abaixo do ATRIB_BASE)
// - Sobe qualquer atributo que esteja abaixo do novo piso racial
function aplicarRaca(familiaId, subracaId) {
  const d = PERSONAGEM.dados;

  // 1. Desconta o bônus da raça que estava ativa antes da troca
  const subAnterior = getSubraca(d.racaFamilia, d.racaSubraca);
  if (subAnterior && subAnterior.attrBonus) {
    ATRIBUTOS_ETH.forEach(a => {
      const bonusAntigo = subAnterior.attrBonus[a.id] || 0;
      if (bonusAntigo > 0) {
        const atual = parseInt(d.attrs[a.id]) || ATRIB_BASE;
        d.attrs[a.id] = Math.max(ATRIB_BASE, atual - bonusAntigo);
      }
    });
  }

  // 2. Grava a nova raça
  d.racaFamilia = familiaId;
  d.racaSubraca = subracaId;
  const sub = getSubraca(familiaId, subracaId);
  d.raca = sub ? sub.nome : ''; // mantém label legível p/ compatibilidade

  // 3. Sobe atributos que ficaram abaixo do novo piso racial
  ATRIBUTOS_ETH.forEach(a => {
    const piso = getPisoAtrib(a.id, d);
    const atual = parseInt(d.attrs[a.id]) || ATRIB_BASE;
    if (atual < piso) d.attrs[a.id] = piso;
  });

  renderPrincipal();
  agendarSalvar();
}

// =============================================================
// ORIGEM (ANTECEDENTE): painel inteligente ligado a origensRPG
// =============================================================
const MAX_PERICIAS_ORIGEM = 2;

function listarOrigens() {
  if (typeof origensRPG === 'undefined') return [];
  return Object.keys(origensRPG).map(k => ({ id: k, nome: origensRPG[k].nome }));
}

// Troca de origem: limpa a escolha de perícias anterior (decisão de
// design: trocar de origem é trocar de passado, então o jogador
// escolhe de novo do zero) e desmarca da aba Perícias qualquer
// proficiência que tinha vindo da origem antiga.
function onMudarOrigem(novoId) {
  const d = PERSONAGEM.dados;
  desmarcarPericiasDaOrigemAtual();
  d.origemId = novoId;
  d.origemPericiasEscolhidas = [];
  renderPrincipal();
  agendarSalvar();
}

// Remove o profs[] de qualquer perícia que esteja marcada como "vinda
// da origem" antes de trocar/limpar a origem. Não toca em perícias que
// o jogador tenha marcado manualmente por fora (não dá pra distinguir
// isso hoje, mas como a escolha de origem é sempre 2 entre 4 dentro do
// pool da própria origem, o pisar-em-pé só acontece dentro da troca).
function desmarcarPericiasDaOrigemAtual() {
  const d = PERSONAGEM.dados;
  (d.origemPericiasEscolhidas || []).forEach(periciaId => {
    delete d.profs[periciaId];
  });
}

// Marca/desmarca uma das 4 perícias do pool da origem. Trava em 2
// escolhidas: pra marcar uma 3ª, o jogador precisa desmarcar uma antes
// (em vez de a UI silenciosamente trocar a mais antiga por ele).
function toggleOrigemPericia(periciaId, marcar) {
  const d = PERSONAGEM.dados;
  const escolhidas = d.origemPericiasEscolhidas || (d.origemPericiasEscolhidas = []);

  if (marcar) {
    if (escolhidas.length >= MAX_PERICIAS_ORIGEM) {
      showToast(`Você já escolheu ${MAX_PERICIAS_ORIGEM} perícias desta origem. Desmarque uma para escolher outra.`, 'warning');
      renderPrincipal(); // re-renderiza pra desfazer o check visual do navegador
      return;
    }
    escolhidas.push(periciaId);
    d.profs[periciaId] = true;
  } else {
    const idx = escolhidas.indexOf(periciaId);
    if (idx > -1) escolhidas.splice(idx, 1);
    delete d.profs[periciaId];
  }

  renderPrincipal();
  renderPericias();
  agendarSalvar();
}

// =============================================================
// DRAWERS INLINE DE IDENTIDADE — Raça, Classe e Origem (V4.1)
// =============================================================
function toggleDrawerIdentidade(id) {
  ['raca','classe','origem'].forEach(d => {
    const el = document.getElementById('idr-' + d);
    if (!el) return;
    if (d === id) {
      const isOpen = el.style.maxHeight && el.style.maxHeight !== '0px';
      el.style.maxHeight = isOpen ? '0px'  : '1400px';
      el.style.opacity   = isOpen ? '0'    : '1';
      el.style.marginTop = isOpen ? '0'    : '10px';
    } else {
      el.style.maxHeight = '0px';
      el.style.opacity   = '0';
      el.style.marginTop = '0';
    }
  });
}

// ── DRAWER: RAÇA ──────────────────────────────────────────────
function gerarDrawerRaca(d) {
  const sub = getSubraca(d.racaFamilia, d.racaSubraca);
  if (!sub) return '';

  const habs = sub.habilidadesTotais || [];
  const habsHTML = habs.length === 0
    ? `<p style="font-size:12px;opacity:0.5;font-style:italic;font-family:'EB Garamond',serif">Nenhuma habilidade cadastrada para esta sub-raça.</p>`
    : habs.map(h => `
        <div class="idr-hab-item">
          <div class="idr-hab-nome">${esc(h.nome)}</div>
          <div class="idr-hab-desc">${esc(h.desc)}</div>
        </div>`).join('');

  const attrBonusHTML = ATRIBUTOS_ETH.map(a => {
    const bonus = sub.attrBonus ? (sub.attrBonus[a.id] || 0) : 0;
    const temBonus = bonus > 0;
    return `
      <div class="idr-attr-chip ${temBonus ? 'bonus' : ''}">
        <span class="idr-attr-label">${a.nome}</span>
        <span class="idr-attr-val">${temBonus ? '+' + bonus : '—'}</span>
      </div>`;
  }).join('');

  const chipLista = (lista, cls) => (lista || []).map(v =>
    `<span class="idr-chip ${cls}">${esc(v)}</span>`).join('');

  const temResist = sub.resistencias && sub.resistencias.length > 0;
  const temFraq   = sub.fraquezas   && sub.fraquezas.length   > 0;
  const nomeFamilia = (typeof listarFamilias === 'function'
    ? listarFamilias().find(f => f.id === d.racaFamilia)?.nome : '') || '';

  return `
  <div id="idr-raca" class="idr-drawer" style="max-height:0;opacity:0;margin-top:0;border-left-color:var(--idr-cor-raca)">
    <div class="idr-header">
      <span class="idr-header-titulo" style="color:var(--idr-cor-raca)">
        ◆ ${esc(sub.nome)}<span style="color:var(--gold-dark);opacity:0.6;font-weight:400"> — ${esc(nomeFamilia)}</span>
      </span>
      <button class="idr-fechar" onclick="toggleDrawerIdentidade('raca')">✕ FECHAR</button>
    </div>
    <div class="idr-body">
      ${sub.citacao ? `<p class="idr-citacao">"${esc(sub.citacao)}"</p>` : ''}
      <div>
        <span class="idr-bloco-label">Bônus de atributos</span>
        <div class="idr-attr-row">${attrBonusHTML}</div>
      </div>
      ${habs.length > 0 ? `
      <div>
        <span class="idr-bloco-label">Habilidades raciais</span>
        <div style="display:flex;flex-direction:column;gap:6px">${habsHTML}</div>
      </div>` : ''}
      ${(temResist || temFraq) ? `
      <div class="idr-cols">
        ${temResist ? `<div>
          <span class="idr-bloco-label">Resistências</span>
          <div class="idr-chip-row">${chipLista(sub.resistencias,'ok')}</div>
        </div>` : ''}
        ${temFraq ? `<div>
          <span class="idr-bloco-label">Fraquezas</span>
          <div class="idr-chip-row">${chipLista(sub.fraquezas,'bad')}</div>
        </div>` : ''}
      </div>` : ''}
      ${sub.regiao ? `
      <div>
        <span class="idr-bloco-label">Região de origem</span>
        <div class="idr-chip-row"><span class="idr-chip">${esc(sub.regiao)}</span></div>
      </div>` : ''}
      <p class="idr-nota">Resistências e fraquezas são informativas — ainda não entram nos cálculos.</p>
    </div>
  </div>`;
}

// ── DRAWER: CLASSE ────────────────────────────────────────────
function gerarDrawerClasse(d) {
  if (!d.classeBase || typeof classesRPG === 'undefined' || !classesRPG[d.classeBase]) return '';
  const base  = classesRPG[d.classeBase];
  const espec = d.classeEspec ? (base.especializacoes || {})[d.classeEspec] : null;

  const chipLista = (lista, cls) => (lista || []).map(v =>
    `<span class="idr-chip ${cls}">${esc(v)}</span>`).join('');

  const profChips  = chipLista(espec?.proficiencias  || base.proficiencias  || [], 'ok');
  const equipChips = chipLista(espec?.equipamentos   || base.equipamentos   || [], 'eq');
  const habsHTML   = (espec?.habilidades || base.habilidades || []).map(h => `
    <div class="idr-hab-item">
      <div class="idr-hab-nome">${esc(h.nome)}</div>
      <div class="idr-hab-desc">${esc(h.desc)}</div>
    </div>`).join('');

  const tituloEspec = espec
    ? `<span style="color:var(--gold-dark);opacity:0.6;font-weight:400"> — ${esc(espec.nome)}</span>`
    : '';
  const tracoNarrativo = espec?.tracoNarrativo || base.tracoNarrativo || '';

  return `
  <div id="idr-classe" class="idr-drawer" style="max-height:0;opacity:0;margin-top:0;border-left-color:var(--idr-cor-classe)">
    <div class="idr-header">
      <span class="idr-header-titulo" style="color:var(--idr-cor-classe)">
        ◆ ${esc(base.nome)}${tituloEspec}
      </span>
      <button class="idr-fechar" onclick="toggleDrawerIdentidade('classe')">✕ FECHAR</button>
    </div>
    <div class="idr-body">
      ${tracoNarrativo ? `<p class="idr-citacao">"${esc(tracoNarrativo)}"</p>` : ''}
      <div class="idr-cols">
        ${profChips ? `<div>
          <span class="idr-bloco-label">Proficiências</span>
          <div class="idr-chip-row">${profChips}</div>
        </div>` : ''}
        ${equipChips ? `<div>
          <span class="idr-bloco-label">Equipamento inicial</span>
          <div class="idr-chip-row">${equipChips}</div>
        </div>` : ''}
      </div>
      ${habsHTML ? `
      <div>
        <span class="idr-bloco-label">Habilidades${espec ? ' da especialização' : ''}</span>
        <div style="display:flex;flex-direction:column;gap:6px">${habsHTML}</div>
      </div>` : ''}
      <div>
        <span class="idr-bloco-label">Recursos calculados</span>
        <div class="idr-chip-row">
          ${base.hpInicial != null ? `<span class="idr-chip ok">HP base: ${base.hpInicial} + mod(COS) por nível</span>` : ''}
          ${base.atributoFoco ? `<span class="idr-chip ok">Sopro: 3 + mod(${base.atributoFoco.toUpperCase()})</span>` : ''}
        </div>
      </div>
    </div>
  </div>`;
}

// ── DRAWER: ORIGEM ────────────────────────────────────────────
function gerarDrawerOrigem(d) {
  if (!d.origemId || typeof origensRPG === 'undefined' || !origensRPG[d.origemId]) return '';
  const origem     = origensRPG[d.origemId];
  const escolhidas = d.origemPericiasEscolhidas || [];

  const periciaChecks = (origem.poolPericias || []).map(periciaId => {
    const def     = PERICIAS_ETH.find(p => p.id === periciaId);
    const label   = def ? def.nome : periciaId;
    const marcada = escolhidas.includes(periciaId);
    const travada = !marcada && escolhidas.length >= MAX_PERICIAS_ORIGEM;
    return `
      <label class="idr-check ${marcada ? 'marcada' : ''} ${travada ? 'travada' : ''}">
        <input type="checkbox" ${marcada ? 'checked' : ''} ${travada ? 'disabled' : ''}
          onchange="toggleOrigemPericia('${periciaId}', this.checked)">
        <span>${esc(label)}</span>
      </label>`;
  }).join('');

  return `
  <div id="idr-origem" class="idr-drawer" style="max-height:0;opacity:0;margin-top:0;border-left-color:var(--idr-cor-origem)">
    <div class="idr-header">
      <span class="idr-header-titulo" style="color:var(--idr-cor-origem)">
        ◆ ${esc(origem.nome)}
      </span>
      <button class="idr-fechar" onclick="toggleDrawerIdentidade('origem')">✕ FECHAR</button>
    </div>
    <div class="idr-body">
      ${origem.citacao ? `<p class="idr-citacao">"${esc(origem.citacao)}"</p>` : ''}
      <div class="idr-cols">
        ${origem.tracoNarrativo ? `<div>
          <span class="idr-bloco-label">Traço narrativo</span>
          <p class="idr-texto">${esc(origem.tracoNarrativo)}</p>
        </div>` : ''}
        ${origem.interacaoMecanica ? `<div>
          <span class="idr-bloco-label">Interação mecânica</span>
          <p class="idr-texto">${esc(origem.interacaoMecanica)}</p>
        </div>` : ''}
      </div>
      <div>
        <span class="idr-bloco-label">Perícias — escolha ${MAX_PERICIAS_ORIGEM} de ${(origem.poolPericias||[]).length}</span>
        <div class="idr-check-row">${periciaChecks}</div>
        <p class="idr-nota" style="margin-top:6px">${escolhidas.length}/${MAX_PERICIAS_ORIGEM} escolhidas${escolhidas.length >= MAX_PERICIAS_ORIGEM ? ' — desmarque uma para trocar' : ''}</p>
      </div>
    </div>
  </div>`;
}

function mostrarVazio(msg) {
  document.getElementById('sheetContent').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:100px 20px;text-align:center">
      <div style="font-size:38px;opacity:0.3">✦</div>
      <div style="font-family:'EB Garamond',serif;font-style:italic;color:var(--parchment-dark);opacity:0.6;font-size:15px">${msg}</div>
      <button onclick="voltarParaHome()" style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,0.3);padding:8px 20px;cursor:pointer;margin-top:10px">← Voltar</button>
    </div>`;
}

// =============================================================
// UTILITÁRIOS
// =============================================================
// Escapa os 5 caracteres HTML/atributo perigosos. O ' (aspas simples) foi
// adicionado por segurança em profundidade: nenhum atributo do código atual
// usa delimitador de aspas simples com dado do usuário interpolado (todos
// usam "..."), mas se algum trecho futuro vier a usar '...', esc() já cobre.
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function getAtrib(id) {
  const v = parseInt(PERSONAGEM.dados.attrs[id]);
  return isNaN(v) ? getPisoAtrib(id) : v;
}

function calcSkillVal(p) {
  const d = PERSONAGEM.dados;
  const base = getAtrib(p.attr);
  const prof = d.profs[p.id] ? parseInt(d.profBonus || 2) : 0;
  return base + prof;
}

function pontosGastos() {
  const d = PERSONAGEM.dados;
  return ATRIBUTOS_ETH.reduce((acc, a) => {
    const piso = getPisoAtrib(a.id, d);
    const atual = parseInt(d.attrs[a.id]) || piso;
    return acc + Math.max(0, atual - piso);
  }, 0);
}
function pontosRestantes() { return PONTOS_INICIAIS - pontosGastos(); }

// =============================================================
// ROLAR DADO
// =============================================================
function rolarD20(bonus, label) {
  const dado = Math.floor(Math.random() * 20) + 1;
  const total = dado + bonus;
  const overlay = document.getElementById('rollOverlay');
  const result  = document.getElementById('rollResult');
  const detail  = document.getElementById('rollDetail');
  const lbl     = document.getElementById('rollLabel');

  lbl.textContent = label.toUpperCase();
  result.textContent = total;
  result.className = 'roll-modal-result' + (dado === 20 ? ' nat20' : dado === 1 ? ' nat1' : '');

  let sub = `d20 (${dado})`;
  if (bonus > 0) sub += ` + ${bonus} = ${total}`;
  else if (bonus < 0) sub += ` − ${Math.abs(bonus)} = ${total}`;
  if (dado === 20) sub = '✦ CRÍTICO NATURAL ✦';
  if (dado === 1)  sub = '✕ Falha Crítica';
  detail.textContent = sub;

  overlay.classList.add('show');
}

function fecharRoll() {
  document.getElementById('rollOverlay').classList.remove('show');
}

function onMudarFamilia(familiaId) {
  // Sem sub-raça ainda escolhida: só re-renderiza pra atualizar o select de sub-raça.
  // Se a família só tem 1 sub-raça (caso "Humano"), aplica direto.
  const subs = listarSubracas(familiaId);
  if (subs.length === 1) {
    aplicarRaca(familiaId, subs[0].id);
  } else {
    PERSONAGEM.dados.racaFamilia = familiaId;
    PERSONAGEM.dados.racaSubraca = null;
    renderPrincipal();
    agendarSalvar();
  }
}
function renderPrincipal() {
  const d = PERSONAGEM.dados;
  const r = d.recursos;

  let isHeresia = false;
  if (!d.divindade || d.divindade.includes('Nenhuma') || d.divindade.includes('Zyrhûn') || d.divindade.includes('Kharvion') || d.divindade.includes('Mabryth') || d.divindade.includes('Morvethra')) {
    isHeresia = true;
  }
  const statusTexto = isHeresia ? "Em estado de heresia" : "Fé Ativa";
  const statusCorTexto = isHeresia ? "var(--blood-light)" : "var(--gold-light)";
  const estiloInputDivindade = isHeresia
    ? "border: 1px solid var(--blood-light); box-shadow: 0 0 8px rgba(122, 24, 24, 0.3); background: rgba(122, 24, 24, 0.03);"
    : "border: 1px solid var(--gold); box-shadow: 0 0 8px rgba(201, 168, 76, 0.3); background: rgba(201, 168, 76, 0.02);";

  // Pills — só aparecem quando o campo está preenchido
  const sub       = getSubraca(d.racaFamilia, d.racaSubraca);
  const temRaca   = !!sub;
  const temClasse = !!(d.classeBase && typeof classesRPG !== 'undefined' && classesRPG[d.classeBase]);
  const temOrigem = !!(d.origemId   && typeof origensRPG  !== 'undefined' && origensRPG[d.origemId]);

  const pillRaca   = temRaca   ? `<button class="idr-pill raca"   onclick="toggleDrawerIdentidade('raca')"  >◆ Habilidades &amp; Resistências</button>`  : '';
  const pillClasse = temClasse ? `<button class="idr-pill classe" onclick="toggleDrawerIdentidade('classe')" >◆ Habilidades &amp; Proficiências</button>` : '';
  const pillOrigem = temOrigem ? `<button class="idr-pill origem" onclick="toggleDrawerIdentidade('origem')" >◆ Traço Narrativo &amp; Perícias</button>`  : '';

  document.getElementById('panel-principal').innerHTML = `
<div class="box" style="margin-bottom:16px">
  <div class="box-title">Identidade</div>

  <div class="identity-row" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:10px">
    <div class="identity-field">
      <label class="identity-label">Raça (Família)</label>
      <select class="identity-input" id="sel_racaFamilia" onchange="onMudarFamilia(this.value)">
        <option value="">Selecione...</option>
        ${listarFamilias().map(f => `<option value="${f.id}" ${d.racaFamilia===f.id?'selected':''}>${esc(f.nome)}</option>`).join('')}
      </select>
      ${pillRaca}
    </div>
    <div class="identity-field">
      <label class="identity-label">Sub-raça</label>
      <select class="identity-input" id="sel_racaSubraca" onchange="aplicarRaca(document.getElementById('sel_racaFamilia').value,this.value)" ${!d.racaFamilia?'disabled':''}>
        <option value="">${d.racaFamilia ? 'Selecione...' : '— família primeiro —'}</option>
        ${listarSubracas(d.racaFamilia).map(s => `<option value="${s.id}" ${d.racaSubraca===s.id?'selected':''}>${esc(s.nome)}</option>`).join('')}
      </select>
    </div>
    <div class="identity-field">
      <label class="identity-label">Classe Base</label>
      <select class="identity-input" id="sel_classeBase" onchange="onMudarClasseBase(this.value)">
        <option value="">Selecione...</option>
        ${listarClassesBase().map(c => `<option value="${c.id}" ${d.classeBase===c.id?'selected':''}>${esc(c.nome)}</option>`).join('')}
      </select>
      ${pillClasse}
    </div>
    <div class="identity-field">
      <label class="identity-label">Especialização</label>
      <select class="identity-input" id="sel_classeEspec" onchange="aplicarEspecializacao(this.value)" ${!d.classeBase?'disabled':''}>
        <option value="">${d.classeBase ? 'Selecione...' : '— classe primeiro —'}</option>
        ${listarEspecializacoes(d.classeBase).map(e => `<option value="${e.id}" ${d.classeEspec===e.id?'selected':''}>${esc(e.nome)}</option>`).join('')}
      </select>
    </div>
  </div>

  <div class="identity-row" style="display:grid;grid-template-columns:1fr 1fr 0.5fr 1fr;gap:10px;margin-bottom:0">
    <div class="identity-field">
      <label class="identity-label">Antecedente (Origem)</label>
      <select class="identity-input" id="sel_origem" onchange="onMudarOrigem(this.value)">
        <option value="">Selecione...</option>
        ${listarOrigens().map(o => `<option value="${o.id}" ${d.origemId===o.id?'selected':''}>${esc(o.nome)}</option>`).join('')}
      </select>
      ${pillOrigem}
    </div>
    <div class="identity-field">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <label class="identity-label">Divindade / Patrono</label>
        <span style="font-size:10px;font-family:'Cinzel',serif;color:${statusCorTexto};letter-spacing:0.5px;font-weight:600;text-transform:uppercase">${statusTexto}</span>
      </div>
      <input class="identity-input" list="eth-divindades" value="${esc(d.divindade)}" placeholder="Divindade..." style="${estiloInputDivindade}" oninput="atualizarCampo('divindade',this.value);renderPrincipal()">
      <datalist id="eth-divindades">${DIVINDADES_ETH.map(div=>`<option value="${div}">`).join('')}</datalist>
    </div>
    <div class="identity-field">
      <label class="identity-label">Nível</label>
      <input class="identity-input" type="number" min="1" max="50" value="${esc(d.level||1)}" oninput="atualizarCampo('level',this.value)">
    </div>
    <div class="identity-field">
      <label class="identity-label">Alinhamento</label>
      <input class="identity-input" list="eth-alinha" value="${esc(d.alinhamento)}" placeholder="Alinhamento..." oninput="atualizarCampo('alinhamento',this.value)">
      <datalist id="eth-alinha">${ALINHAMENTOS.map(a=>`<option value="${a}">`).join('')}</datalist>
    </div>
  </div>

  ${gerarDrawerRaca(d)}
  ${gerarDrawerClasse(d)}
  ${gerarDrawerOrigem(d)}
</div>

    <div class="box" style="margin-bottom:16px">
      <div class="box-title">
        Atributos
        <span style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.6;letter-spacing:0;text-transform:none">
          Base 1 + piso racial · ${PONTOS_INICIAIS} pontos livres para distribuir
        </span>
      </div>
      <div class="pontos-bar" id="pontosBar">
        <span class="pontos-label">Pontos Restantes</span>
        <span class="pontos-count" id="pontosCount">${pontosRestantes()}</span>
        <span class="pontos-hint">de ${PONTOS_INICIAIS}</span>
      </div>
      <div class="atributos-grid" id="atributosGrid">
        ${ATRIBUTOS_ETH.map(a => {
          const val = getAtrib(a.id);
          const piso = getPisoAtrib(a.id, d);
          return `
          <div class="atrib-card">
            <div class="atrib-label">${a.nome}</div>
            <input class="atrib-value" type="number" min="${piso}" max="${ATRIB_CAP}" value="${val}" id="atrib_${a.id}" oninput="atualizarAtrib('${a.id}',this.value)">
            <div class="atrib-mod">${a.full}${piso > ATRIB_BASE ? ` <span style="opacity:0.55">(piso racial ${piso})</span>` : ''}</div>
            <button class="atrib-roll-btn" onclick="rolarD20(${val},'${a.full}')" title="Rolar d20 + ${val}">⚄</button>
          </div>`;
        }).join('')}
      </div>
      <div class="prof-row" style="margin-top:14px">
        <span class="prof-label">Bônus de Proficiência</span>
        <input class="prof-input" type="number" min="1" max="10" value="${esc(d.profBonus||2)}" oninput="atualizarCampo('profBonus',this.value);renderPericias()">
      </div>
    </div>

    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Recursos</div>
      <div class="recursos-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px">
        ${recursoHTML('vida','Vida','vida', r.vida || {cur:10,max:10})}
        ${recursoHTML('san','Sanidade','san', r.san || {cur:10,max:10})}
        ${recursoHTML('sopro','Sopro (Pura)','sopro', r.sopro || {cur:5,max:5})}
        ${recursoHTML('macula','Mácula (Abismo)','macula', r.macula || {cur:0,max:12})}
      </div>
    </div>

    <div class="two-col" style="margin-bottom:16px">
      ${estadosBox('temp','Estado Temporário', d.estados.temp)}
      ${estadosBox('perm','Estado Permanente', d.estados.perm)}
    </div>
    <div class="two-col">
      ${habBox('chamados','Chamados Divinos', d.chamados)}
      ${habBox('habRaciais','Habilidades Raciais Extras', d.habRaciais)}
    </div>
  `;

  anexarEventosRecursos();
}

function recursoHTML(id, label, cls, rec) {
  const pct = rec.max > 0 ? Math.min(100, Math.round((rec.cur / rec.max) * 100)) : 0;
  return `
  <div class="recurso-card">
    <div class="recurso-label ${cls}">${label}</div>
    <div class="recurso-values">
      <input class="recurso-cur" type="number" value="${rec.cur}" id="rcur_${id}" min="0" max="${rec.max}"
        oninput="atualizarRecurso('${id}','cur',this.value)">
      <span class="recurso-sep">/</span>
      <input class="recurso-max" type="number" value="${rec.max}" id="rmax_${id}" readonly tabindex="-1"
        onwheel="event.preventDefault(); this.blur()"
        title="Calculado automaticamente pela classe e atributos — não editável" style="opacity:0.6;cursor:not-allowed">
    </div>
    <div class="recurso-bar-track">
      <div class="recurso-bar-fill ${cls}" id="rbar_${id}" style="width:${pct}%"></div>
    </div>
  </div>`;
}

function atualizarRecurso(id, campo, valor) {
  const d = PERSONAGEM.dados;

  // O max é sempre calculado automaticamente (nível/atributos/classe) em
  // recalcularEAplicarRecursos — o jogador nunca escreve nele. O input já é
  // readonly no HTML, mas travamos aqui também como segunda camada de defesa,
  // caso algo chame esta função com campo 'max' no futuro.
  if (campo === 'max') return;

  if (campo === 'cur') {
    const max = d.recursos[id].max;
    let novoCur = parseInt(valor);
    if (isNaN(novoCur)) novoCur = 0;
    novoCur = Math.max(0, Math.min(max, novoCur)); // trava entre 0 e o max — não deixa passar do teto

    d.recursos[id].cur = novoCur;

    // Se o valor digitado foi travado (ex: usuário tentou passar do max),
    // sincroniza o campo na tela pra refletir o valor real salvo.
    const curEl = document.getElementById('rcur_' + id);
    if (curEl && parseInt(curEl.value) !== novoCur) curEl.value = novoCur;
  } else {
    d.recursos[id][campo] = parseInt(valor) || 0;
  }

  const pct = d.recursos[id].max > 0
    ? Math.min(100, Math.round((d.recursos[id].cur / d.recursos[id].max) * 100))
    : 0;
  const bar = document.getElementById('rbar_' + id);
  if (bar) bar.style.width = pct + '%';
  agendarSalvar();
}

function anexarEventosRecursos() {} // eventos já via oninput inline

function estadosBox(tipo, titulo, lista) {
  const items = lista.map((est, i) => `
    <div class="estado-item ${est.ativo?'ativo':''}" id="estitem_${tipo}_${i}">
      <div class="estado-dot" onclick="toggleEstado('${tipo}',${i})"></div>
      <input class="estado-texto" value="${esc(est.texto)}" placeholder="Estado..."
        oninput="editarEstado('${tipo}',${i},this.value)">
      <button class="estado-del" onclick="deletarEstado('${tipo}',${i})">✕</button>
    </div>`).join('');
  return `
  <div class="box">
    <div class="box-title">${titulo}</div>
    <div class="estado-list" id="estados_${tipo}">${items}</div>
    <button class="add-row-btn" onclick="adicionarEstado('${tipo}')">+ Adicionar Estado</button>
  </div>`;
}

function habBox(campo, titulo, lista) {
  const items = lista.map((h, i) => `
    <div class="hab-item">
      <div class="hab-nome-row">
        <input class="hab-nome" value="${esc(h.nome)}" placeholder="Nome da habilidade..."
          oninput="editarHab('${campo}',${i},'nome',this.value)">
        <button class="hab-del" onclick="deletarHab('${campo}',${i})">✕</button>
      </div>
      <textarea class="hab-desc" rows="2" placeholder="Descrição..."
        oninput="editarHab('${campo}',${i},'desc',this.value)">${esc(h.desc)}</textarea>
    </div>`).join('');
  return `
  <div class="box">
    <div class="box-title">${titulo}</div>
    <div class="hab-list" id="habs_${campo}">${items}</div>
    <button class="add-row-btn" onclick="adicionarHab('${campo}')">+ Adicionar</button>
  </div>`;
}

// ─── Actions: estados ────────────────────────────────────────
function adicionarEstado(tipo) {
  PERSONAGEM.dados.estados[tipo].push({ texto: '', ativo: false });
  renderPrincipal(); agendarSalvar();
}
function deletarEstado(tipo, i) {
  PERSONAGEM.dados.estados[tipo].splice(i, 1);
  renderPrincipal(); agendarSalvar();
}
function toggleEstado(tipo, i) {
  const est = PERSONAGEM.dados.estados[tipo][i];
  est.ativo = !est.ativo;
  const el = document.getElementById(`estitem_${tipo}_${i}`);
  if (el) { el.classList.toggle('ativo', est.ativo); el.querySelector('.estado-dot').parentElement.querySelector('.estado-dot').style.background = est.ativo ? 'var(--gold)' : ''; }
  agendarSalvar();
}
function editarEstado(tipo, i, val) {
  PERSONAGEM.dados.estados[tipo][i].texto = val; agendarSalvar();
}

// ─── Actions: habilidades ────────────────────────────────────
function adicionarHab(campo) {
  PERSONAGEM.dados[campo].push({ nome: '', desc: '' });
  renderPrincipal(); agendarSalvar();
}
function deletarHab(campo, i) {
  PERSONAGEM.dados[campo].splice(i, 1);
  renderPrincipal(); agendarSalvar();
}
function editarHab(campo, i, sub, val) {
  PERSONAGEM.dados[campo][i][sub] = val; agendarSalvar();
}

// =============================================================
// RENDER: ABA PERÍCIAS
// =============================================================
function renderPericias() {
  const d = PERSONAGEM.dados;
  const profB = parseInt(d.profBonus || 2);
  const protegidas = getPericiasProtegidas(); // calculado uma vez, fora do loop

  function linhaPericia(p) {
    const base = getAtrib(p.attr);
    const isProficiente = !!(d.profs[p.id]);
    const isProtegida = protegidas.has(p.id);
    const total = base + (isProficiente ? profB : 0);

    // Input de foco inline — ocupa sua própria coluna quando tem-foco está ativo
    const focoHTML = p.temFoco
      ? `<input type="text" class="skill-foco-input" placeholder="Foco..."
           value="${esc(d.focos[p.id] || '')}"
           title="Especialização de ${p.nome} (ex: Alquimia, Engenharia...)"
           oninput="atualizarFoco('${p.id}',this.value)">`
      : '';

    const checkboxAttr = isProtegida
      ? `disabled title="Concedida por classe ou antecedente"`
      : `onchange="toggleProf('${p.id}',this.checked)"`;

    // Sufixos de label para perícias com restrições especiais
    const sufixoNome = isProtegida
      ? `<sup style="font-size:8px;opacity:0.5;font-family:'Cinzel',serif;letter-spacing:0"> P</sup>`
      : '';

    return `
    <div class="skill-row ${p.temFoco ? 'tem-foco' : ''} ${isProficiente ? 'is-prof' : ''} ${isProtegida ? 'is-protegida' : ''}">
      <input type="checkbox" class="skill-check" ${isProficiente ? 'checked' : ''} ${checkboxAttr}>
      <span class="skill-attr-tag">${p.attr.toUpperCase()}</span>
      <span class="skill-name">${esc(p.nome)}${sufixoNome}</span>
      ${focoHTML}
      <span class="skill-val">${total}</span>
      <button class="skill-roll-btn" onclick="rolarD20(${total},'${p.nome}')" title="Rolar d20 + ${total}">
        <svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 2 L21 7.5 V16.5 L12 22 L3 16.5 V7.5 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 2 V22 M3 7.5 L21 16.5 M21 7.5 L3 16.5" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>
      </button>
    </div>`;
  }

  const metade = Math.ceil(PERICIAS_ETH.length / 2);
  const col1 = PERICIAS_ETH.slice(0, metade);
  const col2 = PERICIAS_ETH.slice(metade);

  document.getElementById('panel-pericias').innerHTML = `
    <div class="box">
      <div class="box-title">
        Perícias
        <span style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.6;letter-spacing:0;text-transform:none">
          Valor = Atributo + (Bônus de Proficiência se marcado)
        </span>
      </div>
      <div class="pericias-cols">
        <div>${col1.map(p=>linhaPericia(p)).join('')}</div>
        <div>${col2.map(p=>linhaPericia(p)).join('')}</div>
      </div>
    </div>
  `;
}

function toggleProf(id, val) {
  const protegidas = getPericiasProtegidas();
  if (!val && protegidas.has(id)) {
    // Perícia concedida por classe ou antecedente: não pode ser desmarcada manualmente.
    // Re-renderiza para desfazer o estado visual do checkbox no navegador.
    renderPericias();
    return;
  }
  PERSONAGEM.dados.profs[id] = val;
  renderPericias();
  agendarSalvar();
}

function atualizarFoco(id, val) {
  PERSONAGEM.dados.focos[id] = val;
  agendarSalvar();
}

// =============================================================
// GRIMÓRIO ARCANO — Camada de Elegibilidade (Travas 1-4)
// =============================================================
// Ponte entre a ficha e sistemaMagia.resolverElegibilidade() (magias.js).
// Monta o "contexto de personagem" (nível, classe, especialização,
// aspectos conhecidos) a partir de PERSONAGEM.dados + racas.js/classes.js,
// e devolve o resultado já pronto pra filtrar os selects do Grimório.
//
// Trava 4 (modificadorPermitido) hoje sempre libera enquanto
// trilhaPermitida não estiver preenchida em todos os modificadores de
// magias.js (fallback documentado na própria função, dentro do motor).
// Nada a fazer aqui quando esses dados chegarem — o motor já resolve.
function resolverElegibilidadeAtual() {
  const d = PERSONAGEM.dados;
  const semDados = { aspectosPermitidos: [], verbosPermitidos: [], circuloMaxNivel: 0, circuloMaxPorAspecto: () => 0, modificadorPermitido: () => true };

  if (typeof sistemaMagia === 'undefined' || typeof classesRPG === 'undefined') return semDados;

  const classeObj = d.classeBase ? classesRPG[d.classeBase] : null;
  if (!classeObj) return semDados;

  const especObj = d.classeEspec ? (classeObj.especializacoes || {})[d.classeEspec] : null;

  const subraca = (typeof getSubraca === 'function') ? getSubraca(d.racaFamilia, d.racaSubraca) : null;
  const aspectoRacial = subraca ? subraca.aspectoPadrao : null;
  const aspectoEspecializacao = especObj ? especObj.aspectoPadrao : null;

  const aspectosConhecidos = sistemaMagia.montarAspectosConhecidos({
    aspectoRacial: aspectoRacial || null,
    aspectoEspecializacao: aspectoEspecializacao || null,
    aspectosLivres: d.grimorio.aspectosLivres || [],
  });

  const nivel = parseInt(d.level) || 1;

  return sistemaMagia.resolverElegibilidade({ nivel, classeObj, especObj, aspectosConhecidos });
}

// Quantas vagas de aspecto livre a classe atual concede, e quantas já
// foram usadas — usado pelo painel de gerenciamento de aspectos
// conhecidos (ver renderPericias/renderGrimorio) pra travar o botão
// de adicionar quando o limite é atingido.
function vagasAspectoLivre() {
  const d = PERSONAGEM.dados;
  if (typeof classesRPG === 'undefined' || !d.classeBase || !classesRPG[d.classeBase]) return { usadas: 0, total: 0 };
  const total = classesRPG[d.classeBase].aspectosAprendizado || 0;
  const usadas = (d.grimorio.aspectosLivres || []).length;
  return { usadas, total };
}

// =============================================================
// GRIMÓRIO ARCANO — integração com motor sistemaMagia (magias.js V2)
// =============================================================

// Converte um objeto {chave: {nome, ...}} em <option> ordenados por nome,
// preservando a chave original como value. Não há nada hardcoded aqui:
// se você adicionar um aspecto/verbo/modificador novo no magias.js, ele
// aparece automaticamente no seletor na próxima renderização.
//
// `chavesPermitidas` (opcional): array ou função de filtro. Quando
// fornecido, chaves fora da lista/filtro são OMITIDAS do select
// (escondidas, não desabilitadas — decisão de UX confirmada). Se
// `chavesPermitidas` for undefined, mantém o comportamento antigo
// (mostra tudo) — usado só como fallback de segurança se a camada de
// elegibilidade não estiver disponível por algum motivo.
function montarOpcoesSelect(objeto, valorSelecionado, chavesPermitidas) {
  if (!objeto) return '';
  const filtro = Array.isArray(chavesPermitidas)
    ? (chave) => chavesPermitidas.includes(chave)
    : (typeof chavesPermitidas === 'function' ? chavesPermitidas : null);

  return Object.keys(objeto)
    .filter(chave => (filtro ? filtro(chave) : true))
    .map(chave => {
      const item = objeto[chave];
      const sel = chave === valorSelecionado ? 'selected' : '';
      const icone = item.icone ? `${item.icone} ` : '';
      return `<option value="${esc(chave)}" ${sel}>${icone}${esc(item.nome)}</option>`;
    })
    .join('');
}

// Monta o rótulo de Custo a partir do recurso do aspecto (Sopro/Mácula).
// Isolado numa função própria porque o card e o badge de alerta precisam
// do mesmo dado em dois lugares.
function classeRecurso(recurso) {
  return recurso === 'macula' ? 'recurso-macula' : 'recurso-sopro';
}

// Gera o bloco de "custo vital" (PV do conjurador).
// O modificador `sacrificio_vital` (V4.0) define custoVital dinamicamente
// via efeitoMecanico — o custo real em PV = Círculo × 2.
// Quando um modificador tem `custoVital` direto no objeto, esse campo
// é usado; caso seja `sacrificio_vital`, calculamos a partir do círculo.
function gerarBlocoCustoVital(mod, circulo) {
  if (!mod) return '';

  // Suporte ao novo modificador Sacrifício Vital (V4.0):
  // paga (Círculo × 2) PV próprios como custo adicional.
  if (mod.nome === 'Sacrifício Vital') {
    const pvCusto = (circulo || 1) * 2;
    return `<div class="magia-custo-vital">🩸 Sacrifício Vital: −${pvCusto} PV do conjurador</div>`;
  }

  // Suporte legado para mods futuros que declarem custoVital diretamente.
  if (!mod.custoVital) return '';
  const cv = mod.custoVital;
  const partes = [];
  if (cv.pv)       partes.push(`${cv.pv} PV`);
  if (cv.sanidade) partes.push(`${cv.sanidade} Sanidade`);
  if (!partes.length) return '';
  return `<div class="magia-custo-vital">🩸 Custo Vital: ${esc(partes.join(' + '))}</div>`;
}

// Constrói o HTML completo do Card de Magia (Coluna 2) a partir do
// objeto retornado por sistemaMagia.gerarMagiaSegura(). Toda a
// sinergia visual (cor, intensidade, badges) é derivada direto do
// objeto `magia` — nada fixo no template.
function gerarHTMLCardMagia(magia, modSelecionado) {
  if (!magia) {
    return `<div class="magia-card-vazio">Selecione um Aspecto, Verbo e Modificador para conjurar o preview.</div>`;
  }
  if (magia.erro) {
    return `<div class="magia-card-vazio magia-card-erro">⚠️ ${esc(magia.erro)}</div>`;
  }

  const intensidade = magia.intensidadeNarrativa || 1; // círculo 1–10
  const ehAlto = intensidade >= 8;
  const ehMedioAlto = intensidade >= 5;

  const classeIntensidade = ehAlto ? 'intensidade-alta' : (ehMedioAlto ? 'intensidade-media' : 'intensidade-baixa');
  const cor = magia.corHex || '#C9A84C';

  // ── V4.0: Badge de Intenção do Verbo ──────────────────────────
  const INTENCAO_LABEL = { ofensivo: '⚔️ Ofensivo', defensivo: '🛡️ Defensivo', utilidade: '🔮 Utilidade' };
  const intencaoLabel = INTENCAO_LABEL[magia.intencaoVerbo] || '';

  // ── Tags da Camada 4 (gerarMagiaSegura): já vêm prontas como Array ──────
  // Inclui: dano, custo, ricochete, PV estrutural, infusão, falha crítica etc.
  const tagsHTML = (Array.isArray(magia.tags) ? magia.tags : []).map(t => {
    const destaque = t.startsWith('Dados:') || t.startsWith('Custo:') || t.startsWith('Dano:');
    const alerta   = t.startsWith('Aviso:') || t.startsWith('Falha') || t.startsWith('Ricochete');
    const cls = destaque ? 'magia-badge recurso-sopro' : alerta ? 'magia-badge recurso-macula' : 'magia-badge';
    return `<span class="${cls}">${esc(t)}</span>`;
  }).join('');

  // Badges de Alcance / Área / Duração / Visibilidade / Recurso (mantidos do legado)
  const badgesLegado = [
    intencaoLabel ? `<span class="magia-badge magia-badge-intencao">${esc(intencaoLabel)}</span>` : '',
    `<span class="magia-badge">📏 ${esc(magia.alcance)}</span>`,
    `<span class="magia-badge">🎯 ${esc(magia.area)}</span>`,
    magia.duracaoEscala ? `<span class="magia-badge">⏳ ${esc(magia.duracaoEscala)}</span>` : '',
    `<span class="magia-badge">👁 ${esc(magia.visibilidade)}</span>`,
    `<span class="magia-badge ${classeRecurso(magia.recurso)}">${magia.recurso === 'macula' ? '🩸' : '✦'} ${magia.custoFinal} ${magia.recurso === 'macula' ? 'Mácula' : 'Sopro'}</span>`,
  ].filter(Boolean).join('');

  // ── V4.0: Blocos especiais dos novos modificadores ─────────────
  const blocoCustoVital = gerarBlocoCustoVital(modSelecionado, magia.circulo);

  // ── Bloco mecânico unificado (Camada 4) ───────────────────────
  // Reúne: dado resolvido, manifestação e eco num único resumo inline.
  // Ícone e label do dado variam por tipoRolagem:
  //   'dano'   → 🎲 (verbos ofensivos)
  //   'pvtemp' → 🛡️ PV Temp (Proteger)
  //   null     → sem dado (sem bloco)
  const spanDado = (magia.dadoResolvido && magia.quantidadeDados && magia.tipoRolagem)
    ? (() => {
        const icone  = magia.tipoRolagem === 'pvtemp' ? '🛡️' : '🎲';
        const prefixo = magia.tipoRolagem === 'pvtemp' ? 'PV Temp' : '';
        const formula = `${magia.quantidadeDados}${esc(magia.dadoResolvido)}`;
        const bonus   = magia.bonusFixoDado ? ` +${magia.bonusFixoDado}` : '';
        const extra   = magia.bonusFlatPorTeto ? ` +${magia.bonusFlatPorTeto}/dado` : '';
        const estru   = magia.pvEstrutural ? ` → PV Estrutural: ${magia.pvEstrutural}` : '';
        const inner   = prefixo ? `${prefixo}: ${formula}${bonus}${extra}${estru}` : `${formula}${bonus}${extra}${estru}`;
        return `<span>${icone} ${inner}</span>`;
      })()
    : '';
  const spanManifest = magia.manifestacao
    ? `<span>🔷 ${esc(magia.manifestacao)}${magia.subgrupoManifestacao ? ` (${esc(magia.subgrupoManifestacao)})` : ''}${magia.limiteRicochete != null ? ` · Ricochete máx. ${magia.limiteRicochete}` : ''}</span>`
    : '';
  const spanEco = (modSelecionado && modSelecionado.nome === 'Eco Persistente')
    ? `<span>🔁 Eco: Círculo ${Math.max(1, Math.floor((magia.circulo || 1) / 2))}</span>`
    : '';
  const spanDobraEspacial = (modSelecionado && modSelecionado.nome === 'Dobra Espacial')
    ? `<span>🌀 Véu atravessado</span>`
    : '';
  const spansMecanica = [spanDado, spanManifest, spanEco, spanDobraEspacial].filter(Boolean);
  const blocoMecanica = spansMecanica.length
    ? `<div class="magia-mecanica-resumo">${spansMecanica.join('<span class="magia-mecanica-sep">·</span>')}</div>`
    : '';

  // ── Camada 4: Falha Crítica ────────────────────────────────────
  const blocoFalhaCritica = (magia.falhaCritica && magia.falhaCritica.descricao) ? `
    <div class="magia-custo-vital" style="background:rgba(80,10,10,0.30);border-color:rgba(180,40,40,0.50)">
      💀 <strong>Falha Crítica (${esc(magia.falhaCritica.tag)}):</strong>
      ${esc(magia.falhaCritica.descricao)}
    </div>` : '';

  // Gaveta de sequela: só aparece se houver sequela (Leve/Moderada/Severa).
  const blocoSequela = (magia.sequela && magia.sequela !== 'Nenhuma') ? `
    <div class="magia-sequela">
      <div class="magia-sequela-titulo">⚠️ Sequela ${esc(magia.sequela)}</div>
      <div class="magia-sequela-texto">${esc(magia.textoSequela)}</div>
    </div>` : '';

  return `
    <div class="magia-card ${classeIntensidade}" style="--cor-aspecto:${cor}">
      <div class="magia-card-header">
        <div class="magia-icone">${magia.icone || '✦'}</div>
        <div>
          <div class="magia-titulo">${esc(magia.nomeVerbo)} · ${esc(magia.nomeAspecto)}</div>
          <div class="magia-subtitulo">${esc(magia.divindade)} — ${esc(magia.nomeModificador)} · Círculo ${magia.circulo}</div>
        </div>
      </div>

      <div class="magia-badges">${badgesLegado}</div>
      ${tagsHTML ? `<div class="magia-badges" style="margin-top:4px">${tagsHTML}</div>` : ''}
      ${blocoCustoVital}
      ${blocoMecanica}

      <div class="magia-resumo-circulo">
        ${sistemaMagia.resumoCirculo && sistemaMagia.resumoCirculo[magia.circulo]
          ? `<strong>${esc(sistemaMagia.resumoCirculo[magia.circulo].titulo)}:</strong> ${esc(sistemaMagia.resumoCirculo[magia.circulo].desc)}`
          : ''}
      </div>

      <div class="magia-descricao">${esc(magia.descricaoFinal).replace(/\n\n/g, '</p><p>')}</div>

      <div class="magia-meta">
        <span><strong>Ação:</strong> ${esc(magia.acao)}</span>
        <span><strong>CD Resistência:</strong> ${magia.cdResistencia}</span>
        ${magia.pericias && magia.pericias.length ? `<span><strong>Perícia:</strong> ${esc(magia.pericias.join(', '))}</span>` : ''}
      </div>

      ${blocoSequela}
      ${blocoFalhaCritica}
    </div>
  `;
}

// Lê os 3 seletores + slider da Coluna 1, chama o motor e injeta o
// card atualizado na Coluna 2. Também grava a última combinação no
// personagem (para retomar de onde o jogador deixou ao reabrir a ficha).
function atualizarPreviewMagia() {
  const aspectoId      = document.getElementById('grim_aspecto').value;
  const verboId        = document.getElementById('grim_verbo').value;
  const modId          = document.getElementById('grim_mod').value;
  const manifestacaoId = (document.getElementById('grim_manifest') || {}).value || '';

  // Recalcula o teto do slider (Trava 1 x Trava 2) toda vez que o
  // aspecto muda — cada aspecto conhecido pode ter uma origem/teto
  // diferente (racial=10, especialização=9, livre=6), sempre limitado
  // pelo teto de nível por cima.
  const eleg = resolverElegibilidadeAtual();
  const circuloTeto = aspectoId ? Math.max(1, eleg.circuloMaxPorAspecto(aspectoId)) : Math.max(1, eleg.circuloMaxNivel || 10);

  const circuloInput = document.getElementById('grim_circulo');
  circuloInput.max = circuloTeto;
  const circulo = Math.min(parseInt(circuloInput.value) || 1, circuloTeto);
  circuloInput.value = circulo;

  document.getElementById('grim_circulo_valor').textContent = circulo;
  const tetoLabel = document.getElementById('grim_circulo_teto');
  if (tetoLabel) tetoLabel.textContent = circuloTeto;

  let magia = null;
  if (aspectoId && verboId && modId) {
    magia = gerarMagiaSegura(aspectoId, verboId, modId, circulo, manifestacaoId || null);
  }

  const modSelecionado = sistemaMagia.modificadores ? sistemaMagia.modificadores[modId] : null;
  document.getElementById('magia-preview-col').innerHTML = gerarHTMLCardMagia(magia, modSelecionado);
  document.getElementById('grimorio-aprender-col').innerHTML = gerarBlocoAprender({
    aspecto: aspectoId, verbo: verboId, mod: modId, manifestacao: manifestacaoId, circulo
  });

  // Persiste a última combinação que o jogador estava montando (inclui manifestação).
  PERSONAGEM.dados.grimorio.ultimaCombo = {
    aspecto: aspectoId, verbo: verboId, mod: modId,
    manifestacao: manifestacaoId, circulo
  };
  agendarSalvar();
}

// Wrapper de segurança em torno de sistemaMagia.gerarMagiaSegura() (Camada 4).
// Inclui a Manifestação opcional (4ª camada: geometria/projeção/estrutura).
// Degrada graciosamente se dados de escalonamento estiverem incompletos.
// Usa nível e classe reais do personagem — isso ativa corretamente regras
// do motor que dependem deles (ex.: Imposto de Infusão para classes fora
// de Vanguarda/Suporte).
function gerarMagiaSegura(aspectoId, verboId, modId, circulo, manifestacaoId) {
  const aspecto = sistemaMagia.aspectos[aspectoId];
  if (aspecto && (!aspecto.tracos || !aspecto.sequela)) {
    return { erro: `O aspecto "${aspecto.nome}" ainda não tem os dados de escalonamento (tracos/sequela) cadastrados em magias.js — preview indisponível até a base ser completada.` };
  }
  const d = PERSONAGEM.dados;
  const nivel = parseInt(d.level) || 1;
  const modFoco = (typeof classesRPG !== 'undefined' && d.classeBase && classesRPG[d.classeBase] && classesRPG[d.classeBase].atributoFoco)
    ? getAtrib(classesRPG[d.classeBase].atributoFoco)
    : 0;
  try {
    // Usa gerarMagiaSegura() do motor (Camada 4): inclui Motor de Degraus,
    // Ricochete do Disco, PV Estrutural, Imposto de Infusão e Falha Crítica.
    return sistemaMagia.gerarMagiaSegura(
      aspectoId, verboId, modId,
      manifestacaoId || null,
      circulo,
      { nivel, modFoco, classePersonagem: d.classeBase || null }
    );
  } catch (e) {
    console.error('Erro ao gerar magia:', e);
    return { erro: 'Não foi possível gerar essa combinação. Verifique os dados desse aspecto/verbo no magias.js.' };
  }
}

function renderGrimorio() {
  const d = PERSONAGEM.dados;
  const combo = d.grimorio.ultimaCombo || { aspecto: '', verbo: '', mod: '', manifestacao: '', circulo: 1 };
  const eleg = resolverElegibilidadeAtual();

  // Se o personagem não tem classe/raça o suficiente para calcular
  // elegibilidade, não bloqueia a tela — mostra tudo (comportamento
  // antigo) com um aviso, em vez de deixar os selects vazios.
  const semElegibilidade = eleg.aspectosPermitidos.length === 0 && eleg.verbosPermitidos.length === 0;

  const opcoesAspecto  = montarOpcoesSelect(sistemaMagia.aspectos, combo.aspecto, semElegibilidade ? undefined : eleg.aspectosPermitidos);
  const opcoesVerbo    = montarOpcoesSelect(sistemaMagia.verbos, combo.verbo, semElegibilidade ? undefined : eleg.verbosPermitidos);
  const opcoesMod      = montarOpcoesSelect(sistemaMagia.modificadores, combo.mod, semElegibilidade ? undefined : (modId) => eleg.modificadorPermitido(modId));
  const opcoesManifest = montarOpcoesSelect(sistemaMagia.manifestacoes || {}, combo.manifestacao || '');

  // Teto do slider de círculo: depende do aspecto escolhido (Trava 1)
  // cruzado com o nível (Trava 2). Sem aspecto escolhido ainda, usa só
  // o teto de nível como referência (o teto real é recalculado quando
  // o jogador escolher o aspecto, via atualizarPreviewMagia()).
  const circuloTeto = combo.aspecto && !semElegibilidade
    ? Math.max(1, eleg.circuloMaxPorAspecto(combo.aspecto))
    : Math.max(1, eleg.circuloMaxNivel || 10);
  const circuloAtual = Math.min(parseInt(combo.circulo) || 1, circuloTeto);

  const vagas = vagasAspectoLivre();
  const avisoElegibilidade = semElegibilidade
    ? `<div class="grimorio-aprender-aviso">Defina Raça e Classe (com Especialização) na aba Principal para liberar os Aspectos, Verbos e Círculos disponíveis para este personagem.</div>`
    : '';

  document.getElementById('panel-grimorio').innerHTML = `
    <div class="box-title" style="margin-bottom:14px;border-bottom:none">Grimório Arcano</div>
    ${avisoElegibilidade}
    <div class="grimorio-grid">

      <!-- COLUNA 1 — Painel de Criação -->
      <div class="box grimorio-criacao">
        <div class="box-title">Composição do Feitiço</div>

        ${!semElegibilidade ? gerarBlocoAprenderAspecto() : ''}

        <div class="identity-field" style="margin-bottom:14px">
          <label class="identity-label">Aspecto (Deus/Primal)</label>
          <select class="identity-input" id="grim_aspecto" onchange="atualizarPreviewMagia()">
            <option value="">— Selecione —</option>
            ${opcoesAspecto}
          </select>
          ${!semElegibilidade ? `<div class="identity-hint" style="font-size:11px;opacity:0.6;margin-top:4px">Aspectos livres: ${vagas.usadas} / ${vagas.total} vagas usadas</div>` : ''}
        </div>

        <div class="identity-field" style="margin-bottom:14px">
          <label class="identity-label">Verbo (Ação)</label>
          <select class="identity-input" id="grim_verbo" onchange="atualizarPreviewMagia()">
            <option value="">— Selecione —</option>
            ${opcoesVerbo}
          </select>
        </div>

        <div class="identity-field" style="margin-bottom:14px">
          <label class="identity-label">Modificador (Forma)</label>
          <select class="identity-input" id="grim_mod" onchange="atualizarPreviewMagia()">
            <option value="">— Selecione —</option>
            ${opcoesMod}
          </select>
        </div>

        <div class="identity-field" style="margin-bottom:18px">
          <label class="identity-label">Manifestação <span style="opacity:0.5;font-style:italic">(opcional — 4ª Camada)</span></label>
          <select class="identity-input" id="grim_manifest" onchange="atualizarPreviewMagia()">
            <option value="">— Nenhuma —</option>
            ${opcoesManifest}
          </select>
        </div>

        <div class="identity-field">
          <label class="identity-label">
            Círculo Injetado — <span id="grim_circulo_valor">${circuloAtual}</span> / <span id="grim_circulo_teto">${circuloTeto}</span>
          </label>
          <input type="range" id="grim_circulo" min="1" max="${circuloTeto}" step="1"
            value="${circuloAtual}" class="grimorio-slider"
            oninput="atualizarPreviewMagia()">
        </div>
      </div>

      <!-- COLUNA 2 — Card de Preview -->
      <div class="grimorio-preview-col">
        <div class="grimorio-preview" id="magia-preview-col">
          ${gerarHTMLCardMagia(
            (combo.aspecto && combo.verbo && combo.mod)
              ? gerarMagiaSegura(combo.aspecto, combo.verbo, combo.mod, combo.circulo, combo.manifestacao || null)
              : null,
            sistemaMagia.modificadores ? sistemaMagia.modificadores[combo.mod] : null
          )}
        </div>
        <div id="grimorio-aprender-col">${gerarBlocoAprender(combo)}</div>
      </div>

    </div>

  `;
}

// =============================================================
// MAGIAS APRENDIDAS — persistência real do Grimório
// =============================================================
// Uma magia "aprendida" é um registro único por combinação
// Aspecto+Verbo+Modificador (Manifestação entra na unicidade também,
// já que ela é uma 4ª camada que muda a magia de fato). O Círculo NÃO
// entra na chave: é editável depois, sem duplicar o registro.

// Limite de magias conhecidas: Nível + floor(maior(INT, SAB) / 2) —
// diminishing returns sobre o atributo, pra evitar que INT/SAB muito
// altos (sem teto definido no sistema) explodam o limite linearmente.
// Atributo ainda é usado bruto (sem fórmula de modificador tipo
// (attr-10)/2), só o efeito dele aqui que agora é dividido por 2.
// Classes ainda não entram nesta conta (não há tabela própria por
// classe definida até o momento).
function limiteMagiasConhecidas() {
  const d = PERSONAGEM.dados;
  const nivel = parseInt(d.level) || 1;
  const int_ = getAtrib('int');
  const sab = getAtrib('sab');
  return nivel + Math.floor(Math.max(int_, sab) / 2);
}

// Chave de unicidade da magia conhecida: Aspecto + Modificador (+
// Manifestação). Verbo NÃO entra mais na chave — ver nota grande
// abaixo de magiasSalvas sobre o motivo (Verbo agora é escolhido na
// hora de conjurar, não na hora de aprender).
function chaveMagia(aspecto, mod, manifestacao) {
  return [aspecto, mod, manifestacao || ''].join('::');
}

function magiaJaAprendida(aspecto, mod, manifestacao) {
  const chave = chaveMagia(aspecto, mod, manifestacao);
  return (PERSONAGEM.dados.grimorio.magiasSalvas || []).some(
    m => chaveMagia(m.aspecto, m.mod, m.manifestacao) === chave
  );
}

// =============================================================
// APRENDER ASPECTO — vagas livres concedidas pela classe (Trava 1)
// =============================================================
// Diferente de "Aprender Magia" (combo Aspecto+Verbo+Mod específico):
// isto é o pré-requisito de mais alto nível — sem conhecer o Aspecto,
// o jogador nem consegue selecioná-lo no painel de composição. Cada
// classe concede N vagas (classesRPG[...].aspectosAprendizado); cada
// vaga usada guarda o ID do aspecto escolhido em d.grimorio.aspectosLivres.
function gerarBlocoAprenderAspecto() {
  const vagas = vagasAspectoLivre();
  if (vagas.total === 0) return ''; // classe sem vagas de aprendizado livre (ex: Vanguarda) — não mostra o bloco

  const d = PERSONAGEM.dados;
  const eleg = resolverElegibilidadeAtual();
  // Já conhecidos por QUALQUER origem (racial/especialização/livre) não
  // podem ser escolhidos de novo como vaga livre — evita desperdiçar
  // uma vaga aprendendo o que o personagem já tem de graça.
  const jaConhecidos = new Set(eleg.aspectosPermitidos);
  const disponiveisParaAprender = Object.keys(sistemaMagia.aspectos).filter(id => !jaConhecidos.has(id));

  const cheio = vagas.usadas >= vagas.total;
  const opcoes = montarOpcoesSelect(sistemaMagia.aspectos, '', disponiveisParaAprender);

  const listaConhecidos = (d.grimorio.aspectosLivres || [])
    .map(id => {
      const asp = sistemaMagia.aspectos[id];
      return asp ? `<span class="grimorio-aspecto-chip">${asp.icone || ''} ${esc(asp.nome)} <button onclick="removerAspectoLivre('${id}')" title="Esquecer este aspecto">✕</button></span>` : '';
    }).join('');

  return `
    <div class="grimorio-aprender-aspecto">
      <div class="identity-label" style="margin-bottom:6px">Aspectos Livres Conhecidos — ${vagas.usadas} / ${vagas.total}</div>
      ${listaConhecidos ? `<div class="grimorio-aspectos-chips">${listaConhecidos}</div>` : ''}
      ${cheio
        ? `<div class="grimorio-aprender-aviso" style="margin-top:6px">Todas as vagas de Aspecto Livre desta classe já estão em uso.</div>`
        : `<div class="identity-field" style="margin-top:8px;display:flex;gap:8px;align-items:flex-end">
             <select class="identity-input" id="grim_aprender_aspecto_select" style="flex:1">
               <option value="">— Escolher novo aspecto —</option>
               ${opcoes}
             </select>
             <button class="btn-aprender-magia" style="white-space:nowrap" onclick="aprenderAspectoLivre()">+ Adicionar</button>
           </div>`
      }
    </div>
  `;
}

function aprenderAspectoLivre() {
  const d = PERSONAGEM.dados;
  const select = document.getElementById('grim_aprender_aspecto_select');
  const aspectoId = select ? select.value : '';
  if (!aspectoId) return;

  const vagas = vagasAspectoLivre();
  if (vagas.usadas >= vagas.total) {
    showToast('Não há vagas de Aspecto Livre disponíveis.', 'warning');
    return;
  }
  if ((d.grimorio.aspectosLivres || []).includes(aspectoId)) return; // defesa: já escolhido

  d.grimorio.aspectosLivres.push(aspectoId);
  showToast('✓ Aspecto aprendido!');
  renderGrimorio();
  agendarSalvar();
}

function removerAspectoLivre(aspectoId) {
  const d = PERSONAGEM.dados;
  d.grimorio.aspectosLivres = (d.grimorio.aspectosLivres || []).filter(id => id !== aspectoId);
  // Se a última combinação em edição usava esse aspecto, limpa — ele
  // não está mais disponível no select filtrado.
  if (d.grimorio.ultimaCombo && d.grimorio.ultimaCombo.aspecto === aspectoId) {
    d.grimorio.ultimaCombo.aspecto = '';
  }
  renderGrimorio();
  agendarSalvar();
}

// Gera o botão/aviso de "Aprender Magia" com base na combinação atual
// da Coluna 1. Cobre os 3 estados: combinação incompleta, já aprendida,
// limite atingido, ou pronta para salvar.
// Nota: Verbo ainda é exigido aqui porque o preview (Coluna 2) precisa
// de um verbo pra gerar a magia completa via gerarMagiaSegura() — mas
// a identidade da magia SALVA é só Aspecto+Modificador(+Manifestação).
// O Verbo escolhido aqui não é persistido como parte do registro; ele
// volta a ser escolhido livremente no momento de conjurar (aba Combate).
function gerarBlocoAprender(combo) {
  const aspecto = combo.aspecto, verbo = combo.verbo, mod = combo.mod;
  const manifestacao = combo.manifestacao || '';

  if (!aspecto || !verbo || !mod) {
    return `<div class="grimorio-aprender-aviso">Selecione Aspecto, Verbo e Modificador para poder aprender esta magia.</div>`;
  }

  const total = (PERSONAGEM.dados.grimorio.magiasSalvas || []).length;
  const limite = limiteMagiasConhecidas();
  const contadorHTML = `<div class="grimorio-contador ${total >= limite ? 'no-limite' : ''}">📖 Magias conhecidas: ${total} / ${limite}</div>`;

  if (magiaJaAprendida(aspecto, mod, manifestacao)) {
    return `${contadorHTML}<div class="grimorio-aprender-aviso ja-aprendida">✓ Esta combinação de Aspecto+Modificador já foi aprendida. O Verbo é escolhido livremente na hora de conjurar, na aba Combate.</div>`;
  }

  if (total >= limite) {
    return `${contadorHTML}<div class="grimorio-aprender-aviso no-limite">⚠️ Limite de magias conhecidas atingido. Remova uma magia da lista, ou suba de nível, para aprender outra.</div>`;
  }

  return `${contadorHTML}<button class="btn-aprender-magia" onclick="aprenderMagiaAtual()">📖 Aprender esta Magia</button>`;
}

// Salva a combinação atual da Coluna 1 como uma nova magia conhecida.
// Persiste só Aspecto+Modificador+Manifestação (a identidade real da
// magia). O Verbo escolhido no momento de aprender é guardado como
// `verboPreferido` — é só uma conveniência de UI (pré-seleciona o
// seletor de verbo na lista de Combate), NÃO faz parte da identidade
// nem da unicidade.
// Revalida limite e unicidade no próprio momento de salvar (defesa em
// profundidade — o botão já não deveria aparecer nesses casos).
function aprenderMagiaAtual() {
  const d = PERSONAGEM.dados;
  const aspecto = document.getElementById('grim_aspecto').value;
  const verbo = document.getElementById('grim_verbo').value;
  const mod = document.getElementById('grim_mod').value;
  const manifestacao = (document.getElementById('grim_manifest') || {}).value || '';
  const circulo = parseInt(document.getElementById('grim_circulo').value) || 1;

  if (!aspecto || !verbo || !mod) return;

  // Defesa em profundidade: revalida a elegibilidade real (não confia
  // só no select já ter filtrado — DOM pode estar desatualizado se o
  // jogador trocou classe/raça sem re-renderizar a aba).
  const eleg = resolverElegibilidadeAtual();
  if (!eleg.aspectosPermitidos.includes(aspecto)) {
    showToast('Este Aspecto não é mais conhecido por este personagem.', 'warning');
    renderGrimorio();
    return;
  }
  if (!eleg.verbosPermitidos.includes(verbo)) {
    showToast('Este Verbo não é permitido pela classe atual.', 'warning');
    renderGrimorio();
    return;
  }
  if (!eleg.modificadorPermitido(mod)) {
    showToast('Este Modificador não é permitido pela Trilha atual.', 'warning');
    renderGrimorio();
    return;
  }
  const circuloTeto = eleg.circuloMaxPorAspecto(aspecto);
  if (circulo > circuloTeto) {
    showToast(`Círculo acima do permitido para este Aspecto (máx. ${circuloTeto}).`, 'warning');
    renderGrimorio();
    return;
  }

  if (magiaJaAprendida(aspecto, mod, manifestacao)) {
    showToast('Esta combinação já foi aprendida.', 'warning');
    return;
  }
  if ((d.grimorio.magiasSalvas || []).length >= limiteMagiasConhecidas()) {
    showToast('Limite de magias conhecidas atingido.', 'warning');
    renderGrimorio();
    return;
  }

  d.grimorio.magiasSalvas.push({
    id: 'mag_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    aspecto, mod, manifestacao, circulo, verboPreferido: verbo
  });

  showToast('✓ Magia aprendida!');
  // Atualiza o Grimório (contador/aviso de "já aprendida" do painel
  // de criação) E o Combate (a lista de magias salvas mora lá agora).
  renderGrimorio();
  renderCombate();
  agendarSalvar();
}

function removerMagiaSalva(magiaId) {
  const d = PERSONAGEM.dados;
  d.grimorio.magiasSalvas = (d.grimorio.magiasSalvas || []).filter(m => m.id !== magiaId);
  // A lista mora em Combate, mas o contador/aviso do Grimório também
  // depende da contagem de magiasSalvas — atualiza os dois.
  renderCombate();
  if (document.getElementById('panel-grimorio')) renderGrimorio();
  agendarSalvar();
}

// Lê o "verbo atual" de uma magia salva, com migração transparente do
// formato antigo. Antes desta mudança, magiasSalvas guardava `verbo`
// como parte fixa e travada do registro (a identidade incluía verbo).
// Agora a identidade é só Aspecto+Modificador(+Manifestação): o Verbo
// é escolhido livremente na hora de conjurar. Registros antigos que
// ainda têm `m.verbo` são tratados como "o último/preferido" em vez
// de descartados — na primeira leitura, esse valor é promovido para
// `verboUltimoUsado` e `m.verbo` é apagado (registro fica no formato
// novo a partir daí, sem perder a escolha anterior do jogador).
function verboAtualMagiaSalva(m) {
  if (m.verbo && !m.verboUltimoUsado) {
    m.verboUltimoUsado = m.verbo;
    delete m.verbo;
  }
  return m.verboUltimoUsado || m.verboPreferido || '';
}

// Troca o Verbo "ativo" de uma magia salva (escolha de conjuração,
// não faz parte da identidade nem da unicidade — é só conveniência de
// UI, pra lembrar qual verbo o jogador usou/quer usar por último).
// Regenera o card de detalhe em tempo real, igual editarCirculoMagiaSalva.
function escolherVerboMagiaSalva(magiaId, novoVerbo) {
  const d = PERSONAGEM.dados;
  const magia = (d.grimorio.magiasSalvas || []).find(m => m.id === magiaId);
  if (!magia) return;
  magia.verboUltimoUsado = novoVerbo;
  delete magia.verbo; // garante que não fica formato antigo duplicado

  const detalheEl = document.getElementById('magsalva_detalhe_' + magiaId);
  if (detalheEl) {
    const modSelecionado = sistemaMagia.modificadores ? sistemaMagia.modificadores[magia.mod] : null;
    const magiaCompleta = gerarMagiaSegura(magia.aspecto, novoVerbo, magia.mod, magia.circulo, magia.manifestacao || null);
    detalheEl.innerHTML = gerarHTMLCardMagia(magiaCompleta, modSelecionado);
  }

  agendarSalvar();
}

// Edita só o Círculo de uma magia já aprendida — não duplica o registro
// nem afeta a unicidade (que ignora Círculo de propósito).
function editarCirculoMagiaSalva(magiaId, novoCirculo) {
  const d = PERSONAGEM.dados;
  const magia = (d.grimorio.magiasSalvas || []).find(m => m.id === magiaId);
  if (!magia) return;
  magia.circulo = parseInt(novoCirculo) || 1;

  // Atualiza só o número exibido ao lado do slider, sem re-renderizar
  // a lista inteira (evita perder o foco do input enquanto arrasta).
  const labelEl = document.getElementById('magsalva_circulo_valor_' + magiaId);
  if (labelEl) labelEl.textContent = magia.circulo;

  // Se o detalhe expandido já existe no DOM, regenera o card dentro
  // dele com o novo círculo (sem isso, o detalhe ficaria mostrando
  // os dados do círculo antigo até a próxima reabertura).
  const detalheEl = document.getElementById('magsalva_detalhe_' + magiaId);
  if (detalheEl) {
    const verboAtual = verboAtualMagiaSalva(magia);
    const modSelecionado = sistemaMagia.modificadores ? sistemaMagia.modificadores[magia.mod] : null;
    const magiaCompleta = gerarMagiaSegura(magia.aspecto, verboAtual, magia.mod, magia.circulo, magia.manifestacao || null);
    detalheEl.innerHTML = gerarHTMLCardMagia(magiaCompleta, modSelecionado);
  }

  agendarSalvar();
}

// Expande/recolhe o card detalhado de uma magia salva (mostra o
// gerarHTMLCardMagia completo dela, igual ao preview).
function toggleDetalheMagiaSalva(magiaId) {
  const el = document.getElementById('magsalva_detalhe_' + magiaId);
  if (!el) return;
  const aberto = el.style.maxHeight && el.style.maxHeight !== '0px';
  el.style.maxHeight = aberto ? '0px' : '2000px';
  el.style.opacity = aberto ? '0' : '1';
  el.style.marginTop = aberto ? '0' : '10px';
}

// Gera a lista completa de magias salvas, com mini-card por item,
// seletor de Verbo inline (escolha livre na hora de conjurar — não
// trava nada, classes ainda não restringem verbos), slider de Círculo
// inline, botão de detalhe e botão de remover.
// Vive na aba Combate (não mais no Grimório Arcano — ver renderCombate()).
function gerarHTMLListaMagiasSalvas(d) {
  const salvas = d.grimorio.magiasSalvas || [];
  if (salvas.length === 0) {
    return `
    <div class="box" style="margin-top:16px">
      <div class="box-title">Magias Aprendidas</div>
      <div class="magia-card-vazio">Nenhuma magia aprendida ainda. Monte uma combinação no Grimório Arcano e clique em "Aprender esta Magia".</div>
    </div>`;
  }

  const itens = salvas.map(m => {
    const aspecto = sistemaMagia.aspectos[m.aspecto];
    const mod = sistemaMagia.modificadores[m.mod];
    const cor = (aspecto && aspecto.corHex) || '#C9A84C';
    const nomeAspecto = aspecto ? aspecto.nome : m.aspecto;
    const nomeMod = mod ? mod.nome : m.mod;

    // Migra formato antigo (m.verbo fixo) pra m.verboUltimoUsado na leitura.
    const verboAtual = verboAtualMagiaSalva(m);
    // Todos os verbos do sistema ficam disponíveis pra escolha aqui —
    // de propósito: classes ainda não travam Verbos liberados (quando
    // travarem, é aqui que a lista de opções passa a ser filtrada).
    const opcoesVerbo = montarOpcoesSelect(sistemaMagia.verbos, verboAtual);
    const verbo = sistemaMagia.verbos[verboAtual];
    const nomeVerbo = verbo ? verbo.nome : (verboAtual || '— escolha um verbo —');

    const magiaCompleta = verboAtual
      ? gerarMagiaSegura(m.aspecto, verboAtual, m.mod, m.circulo, m.manifestacao || null)
      : null;

    return `
    <div class="magsalva-item" style="--cor-aspecto:${cor}">
      <div class="magsalva-linha">
        <div class="magsalva-icone">${(aspecto && aspecto.icone) || '✦'}</div>
        <div class="magsalva-info" onclick="toggleDetalheMagiaSalva('${m.id}')">
          <div class="magsalva-titulo">${esc(nomeAspecto)} · ${esc(nomeMod)}</div>
          <div class="magsalva-subtitulo">${m.manifestacao ? esc((sistemaMagia.manifestacoes[m.manifestacao]||{}).nome || m.manifestacao) : 'Sem manifestação'}</div>
        </div>
        <button class="magsalva-btn-rolar" title="Rolar dados desta magia (em breve)" disabled style="opacity:0.35;cursor:not-allowed;background:none;border:1px solid rgba(201,168,76,0.25);color:var(--gold);font-size:14px;padding:4px 8px;border-radius:4px">🎲</button>
        <button class="magsalva-btn-remover" onclick="removerMagiaSalva('${m.id}')" title="Esquecer esta magia">✕</button>
      </div>
      <div class="magsalva-linha" style="margin-top:6px">
        <label class="magsalva-circulo-label" style="flex-shrink:0">Verbo</label>
        <select class="identity-input magsalva-verbo-select" style="flex:1;min-width:0"
          onchange="escolherVerboMagiaSalva('${m.id}',this.value)">
          <option value="">— Escolha o Verbo ao conjurar —</option>
          ${opcoesVerbo}
        </select>
      </div>
      <div class="magsalva-linha" style="margin-top:6px">
        <div class="magsalva-circulo" style="flex:1">
          <input type="range" min="1" max="10" step="1" value="${m.circulo}"
            oninput="editarCirculoMagiaSalva('${m.id}',this.value)" class="grimorio-slider magsalva-slider">
          <span class="magsalva-circulo-label">Círc. <span id="magsalva_circulo_valor_${m.id}">${m.circulo}</span></span>
        </div>
      </div>
      <div class="magsalva-detalhe" id="magsalva_detalhe_${m.id}" style="max-height:0;opacity:0;margin-top:0">
        ${verboAtual ? gerarHTMLCardMagia(magiaCompleta, mod) : `<div class="magia-card-vazio">Escolha um Verbo acima para ver o efeito completo desta magia (Aspecto: ${esc(nomeAspecto)} · ${esc(nomeMod)}).</div>`}
      </div>
    </div>`;
  }).join('');

  return `
    <div class="box" style="margin-top:16px">
      <div class="box-title">
        Magias Aprendidas
        <span style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.6;letter-spacing:0;text-transform:none">
          ${salvas.length} / ${limiteMagiasConhecidas()} conhecidas — escolha o Verbo, ajuste o Círculo e clique no título p/ ver detalhes
        </span>
      </div>
      <div class="magsalva-lista">${itens}</div>
    </div>`;
}


// Divisor usado no cálculo de CA a partir da Agilidade.
// CA = 5 + Math.floor(AGI / CA_DIVISOR_AGI) + bônus de classe + bônus de raça.
// Se em testes a CA estiver vindo alta demais, troque o 2 por 3 aqui.
const CA_DIVISOR_AGI = 2;

// Lê o bônus passivo de CA da classe escolhida (classesRPG, vindo de
// etherion-classes.js). Tenta algumas chaves plausíveis; ajuste o nome
// da propriedade abaixo se o seu arquivo de classes usar outra.
function getBonusCAClasse() {
  if (typeof classesRPG === 'undefined') return 0;
  const d = PERSONAGEM.dados;
  const classeId = Object.keys(classesRPG).find(k =>
    classesRPG[k].nome === d.classeBase || k === d.classeBase
  );
  const classe = classeId ? classesRPG[classeId] : null;
  if (!classe) return 0;
  // AJUSTE AQUI: troque 'bonusCA' pelo nome real da propriedade no seu
  // etherion-classes.js, caso seja diferente (ex: classe.ca, classe.caBonus).
  const bruto = classe.bonusCA ?? classe.caBonus ?? classe.ca ?? 0;
  return parseInt(bruto) || 0;
}

// Lê o bônus passivo de CA da sub-raça escolhida (etherion-racas.js).
function getBonusCARaca() {
  const d = PERSONAGEM.dados;
  const sub = (typeof getSubraca === 'function') ? getSubraca(d.racaFamilia, d.racaSubraca) : null;
  if (!sub) return 0;
  // AJUSTE AQUI: troque 'bonusCA' pelo nome real da propriedade no seu
  // etherion-racas.js, caso seja diferente (ex: sub.ca, sub.caBonus).
  const bruto = sub.bonusCA ?? sub.caBonus ?? sub.ca ?? 0;
  return parseInt(bruto) || 0;
}

// CA "de corpo" — sem contar o bônus manual de armadura/itens.
function calcCABase() {
  const agi = getAtrib('agi');
  return 5 + Math.floor(agi / CA_DIVISOR_AGI) + getBonusCAClasse() + getBonusCARaca();
}

// CA Final = CA base + bônus manual de armadura/itens digitado pelo jogador.
function calcCAFinal() {
  const d = PERSONAGEM.dados;
  const bonusItens = parseInt(d.caBonusItens) || 0;
  return calcCABase() + bonusItens;
}

// Deslocamento base, em metros, antes de modificadores de raça/classe.
const DESLOCAMENTO_BASE_M = 9;

// Lê modificador de deslocamento (em metros, pode ser negativo) da classe.
function getModDeslocClasse() {
  if (typeof classesRPG === 'undefined') return 0;
  const d = PERSONAGEM.dados;
  const classeId = Object.keys(classesRPG).find(k =>
    classesRPG[k].nome === d.classeBase || k === d.classeBase
  );
  const classe = classeId ? classesRPG[classeId] : null;
  if (!classe) return 0;
  // AJUSTE AQUI: troque 'deslocamento' pelo nome real da propriedade no
  // seu etherion-classes.js, caso seja diferente.
  const bruto = classe.deslocamentoBonus ?? classe.deslocamento ?? 0;
  return parseInt(bruto) || 0;
}

// Lê modificador de deslocamento (em metros, pode ser negativo) da raça.
function getModDeslocRaca() {
  const d = PERSONAGEM.dados;
  const sub = (typeof getSubraca === 'function') ? getSubraca(d.racaFamilia, d.racaSubraca) : null;
  if (!sub) return 0;
  // AJUSTE AQUI: troque 'deslocamento' pelo nome real da propriedade no
  // seu etherion-racas.js, caso seja diferente.
  const bruto = sub.deslocamentoBonus ?? sub.deslocamento ?? 0;
  return parseInt(bruto) || 0;
}

// Deslocamento final em metros, já somando raça e classe.
function calcDeslocamentoFinal() {
  return DESLOCAMENTO_BASE_M + getModDeslocClasse() + getModDeslocRaca();
}

// Recalcula CA Final em tempo real (chamado pelo oninput do campo de itens)
// sem precisar re-renderizar a aba inteira.
function atualizarBonusCAItens(valor) {
  PERSONAGEM.dados.caBonusItens = valor;
  const final = calcCAFinal();
  PERSONAGEM.dados.ca = final; // mantém d.ca sincronizado p/ quem mais ler esse campo
  const campoFinal = document.getElementById('ca_final');
  if (campoFinal) campoFinal.value = final;
  agendarSalvar();
}

// =============================================================
// RENDER: ABA COMBATE
// =============================================================
function renderCombate() {
  const d = PERSONAGEM.dados;

  // Garante que os valores calculados fiquem sempre sincronizados em d,
  // mesmo se nunca tocados pelo jogador (ex: personagem recém-criado).
  d.iniciativa = getAtrib('agi');
  d.ca = calcCAFinal();
  d.deslocamento = calcDeslocamentoFinal() + 'm';

  const ataqueRows = (d.ataques || []).map((a, i) => `
    <tr class="ataque-row">
      <td><input class="atk-input" value="${esc(a.nome)}" placeholder="Nome..."
        oninput="editarAtaque(${i},'nome',this.value)"></td>
      <td><input class="atk-input" style="width:70px" value="${esc(a.bonus)}" placeholder="+0"
        oninput="editarAtaque(${i},'bonus',this.value)"></td>
      <td><input class="atk-input" style="width:80px" value="${esc(a.dano)}" placeholder="1d6+2"
        oninput="editarAtaque(${i},'dano',this.value)"></td>
      <td><input class="atk-input" value="${esc(a.tipo)}" placeholder="Tipo..."
        oninput="editarAtaque(${i},'tipo',this.value)"></td>
      <td><button class="atk-roll-btn" onclick="rolarAtaque(${i})" title="Rolar ataque">⚄</button></td>
      <td><button class="atk-del" onclick="deletarAtaque(${i})">✕</button></td>
    </tr>`).join('');

  document.getElementById('panel-combate').innerHTML = `
    <!-- STATS DE COMBATE -->
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Estatísticas de Combate</div>
      <div class="combate-stats">
        <div class="cstat-card">
          <div class="cstat-label">Classe de Armadura</div>
          <input class="cstat-val" type="number" id="ca_final" value="${esc(calcCAFinal())}" readonly title="5 + (AGI / ${CA_DIVISOR_AGI}) + Classe + Raça + Itens">
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:6px">
            <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;opacity:0.6">+ ITENS</span>
            <input class="cstat-val" type="number" style="width:54px;font-size:13px;padding:4px"
              value="${esc(d.caBonusItens||0)}" title="Bônus de Armadura/Itens"
              oninput="atualizarBonusCAItens(this.value)">
          </div>
        </div>
        <div class="cstat-card">
          <div class="cstat-label">Iniciativa</div>
          <input class="cstat-val" type="number" value="${esc(getAtrib('agi'))}" readonly title="Valor bruto de Agilidade">
        </div>
        <div class="cstat-card">
          <div class="cstat-label">Deslocamento</div>
          <input class="cstat-val" value="${esc(calcDeslocamentoFinal()+'m')}" readonly title="Base ${DESLOCAMENTO_BASE_M}m + Raça + Classe">
        </div>
        <div class="cstat-card">
          <div class="cstat-label">Salvaguardas</div>
          <input class="cstat-val" value="${esc(d.salvaguarda||'—')}" oninput="atualizarCampo('salvaguarda',this.value)">
        </div>
      </div>
    </div>

    <!-- ATAQUES -->
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Ataques</div>
      <table class="ataque-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Bônus Atq.</th>
            <th>Dano</th>
            <th>Tipo</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody id="ataquesTbody">${ataqueRows}</tbody>
      </table>
      <div style="margin-top:10px">
        <button class="add-row-btn" onclick="adicionarAtaque()">+ Adicionar Ataque</button>
      </div>
    </div>

    <!-- MAGIAS APRENDIDAS (Grimório) — movido do Grimório Arcano pra aqui:
         lá fica só a bancada de criação/composição, aqui é onde o jogador
         de fato usa as magias em jogo (escolhe Verbo, ajusta Círculo). -->
    ${gerarHTMLListaMagiasSalvas(d)}

    <!-- MAGIAS / HABILIDADES DE COMBATE -->
    <div class="box" style="margin-top:16px">
      <div class="box-title">Magias & Habilidades de Combate</div>
      <textarea class="text-box" style="min-height:180px" placeholder="Descreva magias, habilidades especiais, efeitos de combate..."
        oninput="atualizarCampo('magiasCombate',this.value)">${esc(d.magiasCombate)}</textarea>
    </div>
  `;
}

function adicionarAtaque() {
  PERSONAGEM.dados.ataques.push({ nome:'', bonus:'', dano:'', tipo:'' });
  renderCombate(); agendarSalvar();
}
function deletarAtaque(i) {
  PERSONAGEM.dados.ataques.splice(i,1);
  renderCombate(); agendarSalvar();
}
function editarAtaque(i, campo, val) {
  PERSONAGEM.dados.ataques[i][campo] = val; agendarSalvar();
}
function rolarAtaque(i) {
  const a = PERSONAGEM.dados.ataques[i];
  const bonus = parseInt(a.bonus) || 0;
  rolarD20(bonus, a.nome || 'Ataque');
}

// =============================================================
// RENDER: ABA INVENTÁRIO
// =============================================================
function renderInventario() {
  const d = PERSONAGEM.dados;

  const invRows = (d.inventario || []).map((it, i) => `
    <tr class="inv-row">
      <td><input type="checkbox" class="inv-equip" ${it.equipado?'checked':''} onchange="editarInv(${i},'equipado',this.checked)"></td>
      <td><input class="inv-input" value="${esc(it.nome)}" placeholder="Item..."
        oninput="editarInv(${i},'nome',this.value)"></td>
      <td><input class="inv-input" style="width:50px;text-align:center" type="number" min="1" value="${esc(it.qtd||1)}"
        oninput="editarInv(${i},'qtd',this.value)"></td>
      <td><input class="inv-input" value="${esc(it.peso)}" placeholder="—"
        oninput="editarInv(${i},'peso',this.value)"></td>
      <td><input class="inv-input" value="${esc(it.desc)}" placeholder="Descrição breve..."
        oninput="editarInv(${i},'desc',this.value)"></td>
      <td><button class="inv-del" onclick="deletarInv(${i})">✕</button></td>
    </tr>`).join('');

  document.getElementById('panel-inventario').innerHTML = `
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Inventário</div>
      <table class="inv-table">
        <thead>
          <tr>
            <th>Eq.</th>
            <th>Item</th>
            <th>Qtd</th>
            <th>Peso</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="invTbody">${invRows}</tbody>
      </table>
      <div style="margin-top:10px">
        <button class="add-row-btn" onclick="adicionarInv()">+ Adicionar Item</button>
      </div>
    </div>

    <!-- CARTEIRA -->
    <div class="box">
      <div class="box-title">Carteira</div>
      <div class="wallet-row">
        <div class="wallet-coin">
          <div class="wallet-coin-label" style="color:#a0522d">Cobre</div>
          <input class="wallet-coin-input" type="number" min="0" value="${esc(d.moedas.cobre)}"
            oninput="atualizarMoeda('cobre',this.value)">
          <div class="wallet-coin-name">pc</div>
        </div>
        <div class="wallet-coin">
          <div class="wallet-coin-label" style="color:#aaa">Prata</div>
          <input class="wallet-coin-input" type="number" min="0" value="${esc(d.moedas.prata)}"
            oninput="atualizarMoeda('prata',this.value)">
          <div class="wallet-coin-name">pp</div>
        </div>
        <div class="wallet-coin">
          <div class="wallet-coin-label" style="color:var(--gold)">Ouro</div>
          <input class="wallet-coin-input" type="number" min="0" value="${esc(d.moedas.ouro)}"
            oninput="atualizarMoeda('ouro',this.value)">
          <div class="wallet-coin-name">po</div>
        </div>
      </div>
    </div>
  `;
}

function adicionarInv() {
  PERSONAGEM.dados.inventario.push({ nome:'', qtd:1, peso:'', desc:'', equipado:false });
  renderInventario(); agendarSalvar();
}
function deletarInv(i) {
  PERSONAGEM.dados.inventario.splice(i,1);
  renderInventario(); agendarSalvar();
}
function editarInv(i, campo, val) {
  PERSONAGEM.dados.inventario[i][campo] = val; agendarSalvar();
}
function atualizarMoeda(tipo, val) {
  PERSONAGEM.dados.moedas[tipo] = parseInt(val)||0; agendarSalvar();
}

// =============================================================
// RENDER: ABA BIOGRAFIA
// =============================================================
function renderBiografia() {
  const d = PERSONAGEM.dados;
  const bio = d.bio || {};

  document.getElementById('panel-biografia').innerHTML = `
    <div class="stack">
      <!-- APARÊNCIA -->
      <div class="box">
        <div class="box-title">Aparência Física</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px">
          ${[
            ['altura','Altura','ex: 1,80m'],
            ['peso','Peso','ex: 80kg'],
            ['idade','Idade','ex: 28'],
            ['corOlhos','Cor dos Olhos','ex: Âmbar']
          ].map(([k,l,p])=>`
            <div class="identity-field">
              <label class="identity-label">${l}</label>
              <input class="identity-input" value="${esc(bio[k])}" placeholder="${p}"
                oninput="atualizarBio('${k}',this.value)">
            </div>`).join('')}
        </div>
        <div class="identity-field">
          <label class="identity-label">Aparência Geral</label>
          <textarea class="text-box" style="min-height:80px" placeholder="Descrição física, cicatrizes, tatuagens, características únicas..."
            oninput="atualizarBio('aparencia',this.value)">${esc(bio.aparencia)}</textarea>
        </div>
      </div>

      <!-- FOTO -->
      <div class="box">
        <div class="box-title">Ilustração do Personagem</div>
        <div style="display:flex;gap:20px;align-items:flex-start">
          <div style="flex-shrink:0">
            <div class="img-upload-area" style="width:140px;height:140px;border-radius:50%;cursor:pointer"
              onclick="document.getElementById('bio_foto_input').click()">
              <img id="bio_foto_preview" src="${esc(PERSONAGEM.foto||bio.foto||'')}" alt=""
                style="display:${(PERSONAGEM.foto||bio.foto)?'block':'none'};width:100%;height:100%;object-fit:cover;border-radius:50%;">
              <div id="bio_foto_placeholder" class="img-upload-placeholder" style="display:${(PERSONAGEM.foto||bio.foto)?'none':'flex'}">
                <span style="font-size:1.8em;opacity:0.3">✦</span>
                <span style="opacity:0.4;font-size:0.7em;text-align:center">Foto do<br>personagem</span>
              </div>
            </div>
            <input type="file" id="bio_foto_input" accept="image/*" style="display:none"
              onchange="trocarFotoPersonagem(this)">
          </div>
          <div style="flex:1">
            <div class="identity-field" style="margin-bottom:10px">
              <label class="identity-label">Idiomas & Talentos</label>
              <textarea class="text-box" style="min-height:80px" placeholder="Idiomas que fala, talentos especiais, treinamentos..."
                oninput="atualizarBio('idiomas',this.value)">${esc(bio.idiomas)}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- HISTÓRIA -->
      <div class="box">
        <div class="box-title">História</div>
        <textarea class="text-box" style="min-height:160px" placeholder="Passado, motivações, encontros importantes, grandes eventos..."
          oninput="atualizarBio('historia',this.value)">${esc(bio.historia)}</textarea>
      </div>

      <!-- PERSONALIDADE -->
      <div class="two-col">
        <div class="box">
          <div class="box-title">Personalidade</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Traços, maneirismos, hábitos..."
            oninput="atualizarBio('personalidade',this.value)">${esc(bio.personalidade)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Ideais</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Valores, moralidade, crenças..."
            oninput="atualizarBio('ideais',this.value)">${esc(bio.ideais)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Vínculos</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Pessoas, lugares ou coisas importantes..."
            oninput="atualizarBio('vinculos',this.value)">${esc(bio.vinculos)}</textarea>
        </div>
        <div class="box">
          <div class="box-title">Defeitos</div>
          <textarea class="text-box" style="min-height:130px" placeholder="Medos, fraquezas, fobias, segredos..."
            oninput="atualizarBio('defeitos',this.value)">${esc(bio.defeitos)}</textarea>
        </div>
      </div>
    </div>
  `;
}

function atualizarBio(campo, val) {
  if (!PERSONAGEM.dados.bio) PERSONAGEM.dados.bio = {};
  PERSONAGEM.dados.bio[campo] = val;
  agendarSalvar();
}

function trocarFotoPersonagem(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 600;
      let w = img.width, h = img.height;
      const ratio = Math.min(MAX/w, MAX/h);
      if (ratio < 1) { w = Math.round(w*ratio); h = Math.round(h*ratio); }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      const b64 = canvas.toDataURL('image/jpeg', 0.82);
      PERSONAGEM.foto = b64;
      const prev = document.getElementById('bio_foto_preview');
      const ph = document.getElementById('bio_foto_placeholder');
      if (prev) { prev.src = b64; prev.style.display = 'block'; }
      if (ph) ph.style.display = 'none';
      agendarSalvar();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// =============================================================
// RENDER: ABA NOTAS
// =============================================================
function renderNotas() {
  const d = PERSONAGEM.dados;
  document.getElementById('panel-notas').innerHTML = `
    <div class="box">
      <div class="box-title">Anotações Livres</div>
      <textarea class="text-box" style="min-height:440px"
        placeholder="Histórico de sessões, plot hooks, NPCs conhecidos, lembretes da mesa..."
        oninput="atualizarCampoSimples('notas',this.value)">${esc(d.notas)}</textarea>
    </div>
  `;
}

// =============================================================
// ATUALIZAR CAMPOS GENÉRICOS
// =============================================================
function atualizarCampo(campo, valor) {
  PERSONAGEM.dados[campo] = valor;
  // Nível afeta HP máximo e o limite de magias conhecidas (mostrado
  // tanto no painel de criação do Grimório quanto na lista em Combate).
  if (campo === 'level') {
    recalcularEAplicarRecursos();
    if (document.getElementById('panel-grimorio')) renderGrimorio();
    if (document.getElementById('panel-combate')) renderCombate();
  }
  agendarSalvar();
}

function atualizarCampoSimples(campo, valor) {
  PERSONAGEM.dados[campo] = valor;
  agendarSalvar();
}

function atualizarAtrib(id, valor) {
  const d = PERSONAGEM.dados;
  const piso = getPisoAtrib(id);
  let v = parseInt(valor);
  if (isNaN(v)) v = piso;

  // Quantos pontos já estão comprometidos pelos OUTROS atributos (sem
  // contar o valor antigo deste, que está sendo substituído agora).
  const valorAntigo = parseInt(d.attrs[id]) || piso;
  const pontosOutros = pontosGastos() - Math.max(0, valorAntigo - piso);
  const pontosDisponiveisParaEste = Math.max(0, PONTOS_INICIAIS - pontosOutros);

  // Trava tripla: nunca abaixo do piso racial, nunca acima do teto atual
  // (ATRIB_CAP), e nunca além do que os pontos restantes realmente pagam —
  // essa última é a que faltava e permitia "Pontos Restantes" negativo.
  const tetoOrcamento = piso + pontosDisponiveisParaEste;
  v = Math.max(piso, Math.min(v, ATRIB_CAP, tetoOrcamento));

  d.attrs[id] = v;

  // Re-renderiza o card pra refletir o valor travado (caso o jogador
  // tenha tentado descer abaixo do piso racial)
  const input = document.getElementById(`atrib_${id}`);
  if (input && parseInt(input.value) !== v) input.value = v;

  // Atualiza pontos restantes sem re-render completo
  const pc = document.getElementById('pontosCount');
  if (pc) {
    const restantes = pontosRestantes();
    pc.textContent = restantes;
    pc.style.color = restantes < 0 ? 'var(--blood-light)' : 'var(--gold)';
  }

  // Atualiza botão de roll do atributo
  const btn = document.querySelector(`#atrib_${id}`)?.parentElement?.querySelector('.atrib-roll-btn');
  if (btn) {
    const aFull = ATRIBUTOS_ETH.find(a => a.id === id)?.full || id;
    btn.setAttribute('onclick', `rolarD20(${v},'${aFull}')`);
    btn.setAttribute('title', `Rolar d20 + ${v}`);
  }

  // Atributos afetam HP (COS), Sanidade (SAB) e Sopro (atrib. foco da classe)
  recalcularEAplicarRecursos();

  // INT/SAB afetam o limite de magias conhecidas, mostrado no Grimório
  // (painel de criação) e na lista de magias salvas, que mora em Combate.
  if ((id === 'int' || id === 'sab')) {
    if (document.getElementById('panel-grimorio')) renderGrimorio();
    if (document.getElementById('panel-combate')) renderCombate();
  }

  agendarSalvar();
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
// NAVEGAÇÃO
// =============================================================
function voltarParaHome() {
  // ANTES: salvarAgora(); window.location.href = '../../index.html';
  // Navegar destruía esta página dentro do iframe e o shell perdia o
  // controle de quando realmente terminou de salvar. Agora esperamos
  // salvarAgora() resolver e só então avisamos o shell pra fechar o
  // iframe e voltar ao hub.
  salvarAgora().then(() => {
    window.parent.postMessage({ tipo: 'ficha:voltar' }, window.location.origin);
  });
}

// Avisa o shell (index.html) qual é o nome atual do personagem, pra
// ele atualizar o #sheet-title no topbar de modo ficha. Chamada ao
// carregar (init) e sempre que o nome for (re)salvo (salvarAgora).
function notificarShell(nome) {
  window.parent.postMessage({ tipo: 'ficha:titulo', payload: nome }, window.location.origin);
}

// =============================================================
// AUTOSAVE
// =============================================================
let _saveTimeout = null;
let MODO_SOMENTE_LEITURA = false; // true quando quem está vendo não é o dono (ex: mestre visualizando ficha de jogador) — setado em carregarPersonagem()

function agendarSalvar() {
  if (MODO_SOMENTE_LEITURA) return; // evita agendar/logar autosave que sabemos de antemão que vai ser bloqueado
  clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(salvarAgora, 450);
}

async function salvarAgora() {
  if (!PERSONAGEM) return;
  const nomeInput = document.getElementById('f_nome');
  if (nomeInput) PERSONAGEM.nome = nomeInput.value.trim() || PERSONAGEM.nome;
  notificarShell(PERSONAGEM.nome);

  // Salva no Supabase (fonte de verdade).
  const sb = obterSupabase();
  let erroSalvar = null;
  if (sb && CHAR_ID) {
    // GUARDA DE PERMISSÃO: só o dono do personagem pode gravar. Um mestre
    // pode legitimamente CARREGAR a ficha de um jogador da sua campanha
    // (ver carregarPersonagem), mas não deve conseguir SOBRESCREVER os
    // dados dela através do autosave desta tela — isso seria edição não
    // intencional de ficha alheia. O RLS no banco já deveria bloquear o
    // update nesse caso (policy de UPDATE restrita a dono_id = auth.uid()),
    // esta é a segunda camada de defesa no client, evitando até a
    // tentativa de escrita e o erro silencioso de RLS que viria dela.
    const { data: { user } = {} } = await sb.auth.getUser();
    const podeEscrever = user && PERSONAGEM.donoId && PERSONAGEM.donoId === user.id;

    if (!podeEscrever) {
      console.warn('[etherion-ficha] usuário atual não é o dono deste personagem — autosave bloqueado (modo somente leitura).');
      mostrarIndicadorSomenteLeitura();
      return;
    }

    const { error } = await sb
      .from('personagens')
      .update({ nome: PERSONAGEM.nome, dados: PERSONAGEM.dados })
      .eq('id', CHAR_ID);
    if (error) {
      console.error('[etherion-ficha] erro ao salvar no Supabase:', error.message);
      erroSalvar = error;
      // Fallback silencioso pro localStorage se o Supabase falhar
      const idx = PERSONAGENS.findIndex(x => x.id === CHAR_ID);
      if (idx >= 0) PERSONAGENS[idx] = PERSONAGEM;
      saveData('forja_personagens', PERSONAGENS);
    }
  } else {
    // Sem Supabase disponível: salva só no localStorage
    const idx = PERSONAGENS.findIndex(x => x.id === CHAR_ID);
    if (idx >= 0) PERSONAGENS[idx] = PERSONAGEM;
    saveData('forja_personagens', PERSONAGENS);
  }

  mostrarIndicadorSalvo();

  // Avisa o shell (index.html) pra atualizar o indicador "✓ Salvo" /
  // "✗ Erro ao salvar" no topbar de modo ficha — ver listener de
  // 'message' em index.html.
  if (erroSalvar) {
    window.parent.postMessage({ tipo: 'ficha:erro-salvo' }, window.location.origin);
  } else {
    window.parent.postMessage({ tipo: 'ficha:salvo' }, window.location.origin);
  }
}

function mostrarIndicadorSalvo() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.textContent = '✓ Salvo';
  el.classList.add('show');
  clearTimeout(el._hideTimeout);
  el._hideTimeout = setTimeout(() => el.classList.remove('show'), 1800);
}

// Mostrado quando o autosave é bloqueado por falta de permissão (ver
// salvarAgora) — ex: mestre visualizando a ficha de um jogador. Fica fixo
// (sem timeout de sumir) pra deixar claro que as edições não estão sendo
// persistidas, evitando o jogador/mestre achar que salvou quando não salvou.
function mostrarIndicadorSomenteLeitura() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.textContent = '👁 Somente leitura';
  el.classList.add('show');
  clearTimeout(el._hideTimeout);
}

// =============================================================
// TOAST
// =============================================================
function showToast(msg, type='') {
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
    <section class="sheet-panel" id="panel-grimorio"></section>
    <section class="sheet-panel" id="panel-combate"></section>
    <section class="sheet-panel" id="panel-inventario"></section>
    <section class="sheet-panel" id="panel-biografia"></section>
    <section class="sheet-panel" id="panel-notas"></section>
  `;
}

async function init() {
  if (!await carregarPersonagem()) return;

  // Reaplicar perícias de classe ao carregar personagem salvo.
  // Garante que o estado visual de perícias seja correto mesmo em personagens
  // já existentes que nunca passaram pela nova lógica de classePericiasAtivas.
  const d = PERSONAGEM.dados;
  if (!d.classePericiasAtivas) d.classePericiasAtivas = [];
  if (d.classeBase && d.classeEspec && typeof classesRPG !== 'undefined') {
    const base = classesRPG[d.classeBase];
    const espec = base && (base.especializacoes || {})[d.classeEspec];
    if (espec) {
      (espec.pericias || []).forEach(id => { d.profs[id] = true; });
      d.classePericiasAtivas = [...(espec.pericias || [])];
    }
  }

  montarEstruturaAbas();
  document.getElementById('f_nome').value = PERSONAGEM.nome || '';
  notificarShell(PERSONAGEM.nome || '');
  recalcularEAplicarRecursos(); // garante máximos corretos antes do primeiro render
  renderPrincipal();
  renderPericias();
  renderGrimorio();
  renderCombate();
  renderInventario();
  renderBiografia();
  renderNotas();
  if (MODO_SOMENTE_LEITURA) mostrarIndicadorSomenteLeitura();
}

// CSS de upload inline + Drawers de Identidade (V4.1 — design angular coeso)
const uploadStyle = document.createElement('style');
uploadStyle.textContent = `
  .img-upload-area {
    width:100%;height:120px;border:1px dashed rgba(201,168,76,0.35);
    background:rgba(0,0,0,0.2);cursor:pointer;position:relative;overflow:hidden;
    transition:border-color 0.2s,background 0.2s;
    display:flex;align-items:center;justify-content:center;
  }
  .img-upload-area:hover { border-color:rgba(201,168,76,0.6);background:rgba(201,168,76,0.04); }
  .img-upload-placeholder {
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:6px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;
    color:var(--parchment);pointer-events:none;
  }

  /* ── Variáveis de cor ────────────────────────────────────── */
  :root {
    --idr-cor-raca:   #4a9a6a;
    --idr-cor-classe: #4a7ab5;
    --idr-cor-origem: #b58c2a;
  }

  /* ── PILL ────────────────────────────────────────────────────
     Sem border-radius. Mesma altura/tipografia dos .box-title.
     Borda colorida identifica o tipo (raça/classe/origem).
  ──────────────────────────────────────────────────────────── */
  .idr-pill {
    display:inline-flex;align-items:center;gap:6px;margin-top:6px;
    padding:4px 10px;cursor:pointer;border:none;
    font-family:'Cinzel',serif;font-size:9px;
    letter-spacing:1.8px;text-transform:uppercase;
    transition:opacity 0.15s;
  }
  .idr-pill:hover  { opacity:0.75; }
  .idr-pill:active { opacity:0.55; }
  .idr-pill.raca   { background:rgba(74,154,106,0.08);  color:var(--idr-cor-raca);   border:1px solid rgba(74,154,106,0.28);  }
  .idr-pill.classe { background:rgba(74,122,181,0.08);  color:var(--idr-cor-classe); border:1px solid rgba(74,122,181,0.28);  }
  .idr-pill.origem { background:rgba(181,140,42,0.08);  color:var(--idr-cor-origem); border:1px solid rgba(181,140,42,0.28);  }

  /* ── DRAWER ──────────────────────────────────────────────────
     Sem border-radius. Borda esquerda colorida (2px) =
     mesma linguagem dos cards de magia com --cor-aspecto.
     Borda geral fina dourada = mesma do .box principal.
  ──────────────────────────────────────────────────────────── */
  .idr-drawer {
    overflow:hidden;
    background:rgba(0,0,0,0.2);
    border:1px solid rgba(139,105,20,0.18);
    border-left-width:2px;
    transition:max-height 0.3s ease, opacity 0.2s ease, margin-top 0.2s ease;
  }

  /* Header = .box-title em miniatura */
  .idr-header {
    display:flex;align-items:center;justify-content:space-between;
    padding:8px 14px;
    background:rgba(0,0,0,0.18);
    border-bottom:1px solid rgba(139,105,20,0.14);
  }
  .idr-header-titulo {
    font-family:'Cinzel',serif;font-size:9.5px;
    letter-spacing:2px;text-transform:uppercase;font-weight:600;
  }
  .idr-fechar {
    background:none;border:none;cursor:pointer;
    font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:1.5px;
    color:var(--parchment-dark);opacity:0.38;padding:2px 6px;
    transition:opacity 0.15s, color 0.15s;
  }
  .idr-fechar:hover { opacity:1; color:var(--gold); }

  /* Body */
  .idr-body { padding:14px 16px;display:flex;flex-direction:column;gap:14px; }

  /* Citação = .origem-citacao */
  .idr-citacao {
    font-family:'EB Garamond',serif;font-style:italic;
    font-size:13.5px;line-height:1.55;
    color:var(--parchment-dark);
    border-left:2px solid rgba(139,105,20,0.4);
    padding-left:12px;margin:0;
  }

  /* Rótulo = .origem-bloco-titulo */
  .idr-bloco-label {
    display:block;
    font-family:'Cinzel',serif;font-size:9px;
    letter-spacing:1.8px;text-transform:uppercase;
    color:var(--gold-dark);margin-bottom:7px;
  }

  /* Texto = .origem-bloco p */
  .idr-texto {
    font-family:'EB Garamond',serif;font-size:13.5px;
    line-height:1.55;color:var(--parchment);margin:0;
  }

  /* Nota de rodapé */
  .idr-nota {
    font-family:'EB Garamond',serif;font-size:11px;
    font-style:italic;color:var(--parchment-dark);opacity:0.38;
  }

  /* Grid 2 colunas */
  .idr-cols { display:grid;grid-template-columns:1fr 1fr;gap:16px; }

  /* ── CHIPS ────────────────────────────────────────────────────
     Sem border-radius. Tipografia Cinzel 9px = .box-title.
     Mesma linguagem dos .magia-badge.
  ──────────────────────────────────────────────────────────── */
  .idr-chip-row { display:flex;flex-wrap:wrap;gap:5px; }
  .idr-chip {
    font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.5px;
    padding:3px 8px;
    background:rgba(0,0,0,0.25);
    border:1px solid rgba(139,105,20,0.2);
    color:var(--parchment-dark);
  }
  .idr-chip.ok  { background:rgba(74,154,106,0.1);  border-color:rgba(74,154,106,0.32); color:#6dbe8d; }
  .idr-chip.bad { background:rgba(180,60,60,0.1);   border-color:rgba(180,60,60,0.32);  color:#d47070; }
  .idr-chip.eq  { background:rgba(74,122,181,0.1);  border-color:rgba(74,122,181,0.32); color:#7aacd4; }

  /* ── CARDS DE ATRIBUTO ────────────────────────────────────────
     Sem border-radius. Mesma linguagem do .atrib-card.
     Fundo escuro, borda dourada fina, label Cinzel pequeno.
  ──────────────────────────────────────────────────────────── */
  .idr-attr-row { display:grid;grid-template-columns:repeat(6,1fr);gap:6px; }
  .idr-attr-chip {
    display:flex;flex-direction:column;align-items:center;
    padding:7px 2px;
    background:rgba(0,0,0,0.3);
    border:1px solid rgba(139,105,20,0.18);
  }
  .idr-attr-chip.bonus {
    background:rgba(74,154,106,0.09);
    border-color:rgba(74,154,106,0.38);
  }
  .idr-attr-label {
    font-family:'Cinzel',serif;font-size:8px;
    letter-spacing:2px;text-transform:uppercase;
    color:var(--gold-dark);
  }
  .idr-attr-val {
    font-family:'Cinzel Decorative',serif;font-size:17px;
    color:var(--parchment);margin-top:3px;line-height:1;
  }
  .idr-attr-chip.bonus .idr-attr-label { color:#6dbe8d; }
  .idr-attr-chip.bonus .idr-attr-val   { color:#6dbe8d; }

  /* ── HABILIDADES ──────────────────────────────────────────────
     Sem border-radius. Idêntico ao .hab-item.
  ──────────────────────────────────────────────────────────── */
  .idr-hab-item {
    padding:10px 12px;
    background:rgba(0,0,0,0.22);
    border:1px solid rgba(139,105,20,0.14);
  }
  .idr-hab-nome {
    font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;
    color:var(--gold);margin-bottom:4px;
  }
  .idr-hab-desc {
    font-family:'EB Garamond',serif;font-size:13px;font-style:italic;
    color:var(--parchment-dark);line-height:1.5;
  }

  /* ── CHECKBOXES DE PERÍCIA ────────────────────────────────────
     Idêntico ao .origem-pericia-opt.
  ──────────────────────────────────────────────────────────── */
  .idr-check-row { display:flex;flex-direction:column;gap:0; }
  .idr-check {
    display:flex;align-items:center;gap:10px;
    padding:7px 8px;cursor:pointer;user-select:none;
    font-family:'EB Garamond',serif;font-size:14px;
    color:var(--parchment-dark);
    border-bottom:1px solid rgba(139,105,20,0.08);
    transition:background 0.12s;
  }
  .idr-check:last-child { border-bottom:none; }
  .idr-check:hover { background:rgba(201,168,76,0.05); }
  .idr-check input { accent-color:var(--gold);width:14px;height:14px;cursor:pointer;flex-shrink:0; }
  .idr-check.marcada { color:var(--gold); }
  .idr-check.travada { opacity:0.35;cursor:not-allowed; }
  .idr-check.travada:hover { background:none; }
`;
document.head.appendChild(uploadStyle);

window.addEventListener('beforeunload', () => { if (_saveTimeout) salvarAgora(); });

init();

// Retorna um Set com todos os IDs de perícias que não podem ser desmarcadas
// manualmente (concedidas por classe ou antecedente/origem).
function getPericiasProtegidas() {
  const d = PERSONAGEM.dados;
  const protegidas = new Set();
  (d.classePericiasAtivas || []).forEach(id => protegidas.add(id));
  (d.origemPericiasEscolhidas || []).forEach(id => protegidas.add(id));
  return protegidas;
}

// Remove de d.profs todas as perícias que vieram exclusivamente da classe
// (não remove se a mesma perícia também foi escolhida via antecedente).
function removerPericiasDeClasse() {
  const d = PERSONAGEM.dados;
  (d.classePericiasAtivas || []).forEach(id => {
    const origemTem = (d.origemPericiasEscolhidas || []).includes(id);
    if (!origemTem) delete d.profs[id];
  });
  d.classePericiasAtivas = [];
}

// Lê o array pericias[] da especialização escolhida e marca em d.profs.
function aplicarPericiasDeClasse(classeBaseId, classeEspecId) {
  if (!classeBaseId || !classeEspecId || typeof classesRPG === 'undefined') return;
  const base = classesRPG[classeBaseId];
  if (!base) return;
  const espec = (base.especializacoes || {})[classeEspecId];
  if (!espec) return;

  const d = PERSONAGEM.dados;
  const pericias = espec.pericias || [];
  pericias.forEach(id => { d.profs[id] = true; });
  d.classePericiasAtivas = [...pericias];
}

// Novas Funções Lógicas de Classe e Especialização
function listarClassesBase() {
  if (typeof classesRPG === 'undefined') return [];
  return Object.keys(classesRPG).map(k => ({ id: k, nome: classesRPG[k].nome }));
}

function listarEspecializacoes(classeBaseId) {
  if (!classeBaseId || typeof classesRPG === 'undefined' || !classesRPG[classeBaseId]) return [];
  const especs = classesRPG[classeBaseId].especializacoes || {};
  return Object.keys(especs).map(k => ({ id: k, nome: especs[k].nome }));
}

function onMudarClasseBase(val) {
  const d = PERSONAGEM.dados;
  removerPericiasDeClasse();
  d.classeBase = val;
  d.classeEspec = '';
  // Mantém um label legível em d.classeNome (mesmo padrão de d.raca em
  // aplicarRaca()) — permite que outras telas (ex: campanha.html, que
  // não carrega classes.js) mostrem o nome da classe sem duplicar o
  // banco de classesRPG.
  d.classeNome = (typeof classesRPG !== 'undefined' && classesRPG[val]) ? classesRPG[val].nome : '';
  recalcularEAplicarRecursos();
  agendarSalvar();
  renderPrincipal();
  renderPericias();
}

function aplicarEspecializacao(val) {
  const d = PERSONAGEM.dados;
  removerPericiasDeClasse();
  d.classeEspec = val;
  if (val) aplicarPericiasDeClasse(d.classeBase, val);
  // Mesmo raciocínio de onMudarClasseBase: guarda o nome legível da
  // especialização (ou volta ao nome da classe base, se a especialização
  // foi desmarcada) para leitura fora do contexto de classesRPG.
  if (typeof classesRPG !== 'undefined' && classesRPG[d.classeBase]) {
    const base = classesRPG[d.classeBase];
    const espec = val ? (base.especializacoes || {})[val] : null;
    d.classeNome = espec ? espec.nome : base.nome;
  }
  recalcularEAplicarRecursos();
  agendarSalvar();
  renderPrincipal();
  renderPericias();
}
