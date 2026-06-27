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

function carregarPersonagem() {
  const params = new URLSearchParams(window.location.search);
  CHAR_ID = params.get('id');
  PERSONAGENS = loadData('forja_personagens') || [];

  if (!CHAR_ID) { mostrarVazio('Nenhum personagem especificado na URL.'); return false; }
  PERSONAGEM = PERSONAGENS.find(p => p.id === CHAR_ID);
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
  if (!d.origemId) d.origemId = '';
  if (!d.origemPericiasEscolhidas) d.origemPericiasEscolhidas = [];
  if (!d.classePericiasAtivas) d.classePericiasAtivas = [];
  if (!d.grimorio) d.grimorio = { ultimaCombo: { aspecto: '', verbo: '', mod: '', manifestacao: '', circulo: 1 }, magiasSalvas: [] };
  // Migração: combos antigos não tinham o campo 'manifestacao'
  if (d.grimorio.ultimaCombo && d.grimorio.ultimaCombo.manifestacao === undefined) {
    d.grimorio.ultimaCombo.manifestacao = '';
  }

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

// Gera o HTML do painel: citação, traço narrativo, interação mecânica
// e os 4 checkboxes do pool de perícias. Some por completo se nenhuma
// origem estiver selecionada.
function gerarHTMLPainelOrigem(d) {
  if (!d.origemId || typeof origensRPG === 'undefined' || !origensRPG[d.origemId]) return '';
  const origem = origensRPG[d.origemId];
  const escolhidas = d.origemPericiasEscolhidas || [];

  const pericias = (origem.poolPericias || []).map(periciaId => {
    const periciaDef = PERICIAS_ETH.find(p => p.id === periciaId);
    const nomeLabel = periciaDef ? periciaDef.nome : periciaId;
    const marcada = escolhidas.includes(periciaId);
    const travada = !marcada && escolhidas.length >= MAX_PERICIAS_ORIGEM;
    return `
      <label class="origem-pericia-opt ${marcada ? 'marcada' : ''} ${travada ? 'travada' : ''}">
        <input type="checkbox" ${marcada ? 'checked' : ''} ${travada ? 'disabled' : ''}
          onchange="toggleOrigemPericia('${periciaId}', this.checked)">
        <span>${esc(nomeLabel)}</span>
      </label>`;
  }).join('');

  return `
    <div class="box origem-painel" style="margin-bottom:16px">
      <div class="box-title">
        Origem: ${esc(origem.nome)}
        <span style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;color:var(--parchment-dark);opacity:0.6;letter-spacing:0;text-transform:none">
          Escolha ${MAX_PERICIAS_ORIGEM} entre as 4 perícias do antecedente
        </span>
      </div>

      <p class="origem-citacao">"${esc(origem.citacao)}"</p>

      <div class="origem-grid">
        <div class="origem-texto-col">
          <div class="origem-bloco">
            <span class="origem-bloco-titulo">Traço Narrativo</span>
            <p>${esc(origem.tracoNarrativo)}</p>
          </div>
          <div class="origem-bloco">
            <span class="origem-bloco-titulo">Interação Mecânica</span>
            <p>${esc(origem.interacaoMecanica)}</p>
          </div>
        </div>

        <div class="origem-pericias-col">
          <span class="origem-bloco-titulo">Perícias (${escolhidas.length}/${MAX_PERICIAS_ORIGEM})</span>
          <div class="origem-pericias-lista">${pericias}</div>
        </div>
      </div>
    </div>
  `;
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
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
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

  // Lógica de Fé/Heresia
  let isHeresia = false;
  if (!d.divindade || d.divindade.includes('Nenhuma') || d.divindade.includes('Zyrhûn') || d.divindade.includes('Kharvion') || d.divindade.includes('Mabryth') || d.divindade.includes('Morvethra')) {
      isHeresia = true;
  }
  
  const statusTexto = isHeresia ? "Em estado de heresia" : "Fé Ativa";
  const statusCorTexto = isHeresia ? "var(--blood-light)" : "var(--gold-light)";
  const estiloInputDivindade = isHeresia 
    ? "border: 1px solid var(--blood-light); box-shadow: 0 0 8px rgba(122, 24, 24, 0.3); background: rgba(122, 24, 24, 0.03);" 
    : "border: 1px solid var(--gold); box-shadow: 0 0 8px rgba(201, 168, 76, 0.3); background: rgba(201, 168, 76, 0.02);";

  // Extrair nomes dinâmicos dos seus arquivos
  const opcoesClasses = typeof classesRPG !== 'undefined' ? Object.values(classesRPG).map(c => `<option value="${c.nome}">`).join('') : '';

  document.getElementById('panel-principal').innerHTML = `
<div class="box" style="margin-bottom:16px">
  <div class="box-title">Identidade</div>
  
  <div class="identity-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
    <div class="identity-field">
      <label class="identity-label">Raça (Família)</label>
      <select class="identity-input" id="sel_racaFamilia" onchange="onMudarFamilia(this.value)">
        <option value="">Selecione...</option>
        ${listarFamilias().map(f => `<option value="${f.id}" ${d.racaFamilia===f.id?'selected':''}>${esc(f.nome)}</option>`).join('')}
      </select>
    </div>
    <div class="identity-field">
      <label class="identity-label">Sub-raça</label>
      <select class="identity-input" id="sel_racaSubraca" onchange="aplicarRaca(document.getElementById('sel_racaFamilia').value,this.value)" ${!d.racaFamilia ? 'disabled' : ''}>
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
    </div>
    <div class="identity-field">
      <label class="identity-label">Especialização</label>
      <select class="identity-input" id="sel_classeEspec" onchange="aplicarEspecializacao(this.value)" ${!d.classeBase ? 'disabled' : ''}>
        <option value="">${d.classeBase ? 'Selecione...' : '— classe primeiro —'}</option>
        ${listarEspecializacoes(d.classeBase).map(e => `<option value="${e.id}" ${d.classeEspec===e.id?'selected':''}>${esc(e.nome)}</option>`).join('')}
      </select>
    </div>
  </div>

  <div class="identity-row" style="display: grid; grid-template-columns: 1fr 1fr 0.5fr 1fr; gap: 10px; margin-bottom: 0;">
    <div class="identity-field">
      <label class="identity-label">Antecedente (Origem)</label>
      <select class="identity-input" id="sel_origem" onchange="onMudarOrigem(this.value)">
        <option value="">Selecione...</option>
        ${listarOrigens().map(o => `<option value="${o.id}" ${d.origemId===o.id?'selected':''}>${esc(o.nome)}</option>`).join('')}
      </select>
    </div>
    
    <div class="identity-field">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <label class="identity-label">Divindade / Patrono</label>
        <span style="font-size: 10px; font-family: 'Cinzel', serif; color: ${statusCorTexto}; letter-spacing: 0.5px; font-weight: 600; text-transform: uppercase;">${statusTexto}</span>
      </div>
      <input class="identity-input" list="eth-divindades" value="${esc(d.divindade)}" placeholder="Divindade..." style="${estiloInputDivindade}" oninput="atualizarCampo('divindade',this.value);renderPrincipal()">
      <datalist id="eth-divindades">${DIVINDADES_ETH.map(div => `<option value="${div}">`).join('')}</datalist>
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
</div>

${gerarHTMLPainelOrigem(d)}

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
            <input class="atrib-value" type="number" min="${piso}" max="20" value="${val}" id="atrib_${a.id}" oninput="atualizarAtrib('${a.id}',this.value)">
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
      <div class="recursos-grid" style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;">
        ${recursoHTML('vida','Vida','vida', r.vida || {cur: 10, max: 10})}
        ${recursoHTML('san','Sanidade','san', r.san || {cur: 10, max: 10})}
        ${recursoHTML('sopro','Sopro (Pura)','sopro', r.sopro || {cur: 5, max: 5})}
        ${recursoHTML('macula','Mácula (Abismo)','macula', r.macula || {cur: 0, max: 12})}
      </div>
    </div>

    <div class="two-col" style="margin-bottom:16px">
      ${estadosBox('temp','Estado Temporário', d.estados.temp)}
      ${estadosBox('perm','Estado Permanente', d.estados.perm)}
    </div>
    <div class="two-col">
      ${habRacialAutoBox(d)}
      ${habBox('chamados','Chamados Divinos', d.chamados)}
    </div>
    <div class="two-col" style="margin-top:16px">
      ${habBox('habRaciais','Habilidades Raciais Extras', d.habRaciais)}
      ${resistFraqBox(d)}
    </div>
  `;
  
  // eventos de recursos após render
  anexarEventosRecursos();
}

function habRacialAutoBox(d) {
  const sub = getSubraca(d.racaFamilia, d.racaSubraca);
  const habs = sub ? sub.habilidadesTotais : [];
  const corpo = !sub
    ? `<div style="opacity:0.5;font-style:italic;font-size:12.5px">Escolha uma raça para ver as habilidades automáticas.</div>`
    : habs.length === 0
      ? `<div style="opacity:0.5;font-style:italic;font-size:12.5px">Essa sub-raça ainda não tem habilidades cadastradas em etherion-racas.js.</div>`
      : habs.map(h => `
        <div class="hab-item" style="cursor:default">
          <div class="hab-nome-row"><strong style="font-family:'Cinzel',serif;font-size:12px;color:var(--gold)">${esc(h.nome)}</strong></div>
          <div style="font-size:12.5px;opacity:0.85;margin-top:2px">${esc(h.desc)}</div>
        </div>`).join('');
  return `
  <div class="box">
    <div class="box-title">
      Habilidades Raciais ${sub ? `<span style="font-family:'EB Garamond',serif;font-style:italic;font-size:11px;opacity:0.6;text-transform:none;letter-spacing:0">— ${esc(sub.nome)}</span>` : ''}
    </div>
    <div class="hab-list">${corpo}</div>
  </div>`;
}

function resistFraqBox(d) {
  const sub = getSubraca(d.racaFamilia, d.racaSubraca);
  if (!sub) return `<div class="box"><div class="box-title">Resistências & Fraquezas</div>
    <div style="opacity:0.5;font-style:italic;font-size:12.5px">Escolha uma raça para ver.</div></div>`;

  const linha = (titulo, lista) => !lista || lista.length === 0 ? '' : `
    <div style="margin-bottom:8px">
      <div style="font-family:'Cinzel',serif;font-size:10.5px;letter-spacing:1px;color:var(--parchment-dark);opacity:0.7;text-transform:uppercase">${titulo}</div>
      <div style="font-size:12.5px">${lista.map(esc).join(' · ')}</div>
    </div>`;

  return `
  <div class="box">
    <div class="box-title">Resistências & Fraquezas</div>
    ${sub.citacao ? `<div style="font-style:italic;font-size:12px;opacity:0.65;margin-bottom:10px">"${esc(sub.citacao)}"</div>` : ''}
    ${linha('Resistências', sub.resistencias)}
    ${linha('Fraquezas', sub.fraquezas)}
    ${sub.regiao ? linha('Região', [sub.regiao]) : ''}
    <div style="font-size:11px;opacity:0.45;margin-top:6px;font-style:italic">Apenas informativo — ainda não entra nos cálculos.</div>
  </div>`;
}

function recursoHTML(id, label, cls, rec) {
  const pct = rec.max > 0 ? Math.min(100, Math.round((rec.cur / rec.max) * 100)) : 0;
  return `
  <div class="recurso-card">
    <div class="recurso-label ${cls}">${label}</div>
    <div class="recurso-values">
      <input class="recurso-cur" type="number" value="${rec.cur}" id="rcur_${id}"
        oninput="atualizarRecurso('${id}','cur',this.value)">
      <span class="recurso-sep">/</span>
      <input class="recurso-max" type="number" value="${rec.max}" id="rmax_${id}"
        oninput="atualizarRecurso('${id}','max',this.value)">
    </div>
    <div class="recurso-bar-track">
      <div class="recurso-bar-fill ${cls}" id="rbar_${id}" style="width:${pct}%"></div>
    </div>
  </div>`;
}

function atualizarRecurso(id, campo, valor) {
  const d = PERSONAGEM.dados;
  d.recursos[id][campo] = parseInt(valor) || 0;
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
    const focoHTML = p.temFoco ? `
      <input type="text" class="skill-foco-input" placeholder="Foco (ex: Alquimia)"
        value="${esc(d.focos[p.id] || '')}"
        oninput="atualizarFoco('${p.id}',this.value)">` : '';
    const checkboxAttr = isProtegida
      ? `disabled title="Concedida por classe ou antecedente"`
      : `onchange="toggleProf('${p.id}',this.checked)"`;
    return `
    <div class="skill-row ${p.temFoco?'tem-foco':''} ${isProficiente?'is-prof':''} ${isProtegida?'is-protegida':''}">
      <input type="checkbox" class="skill-check" ${isProficiente?'checked':''} ${checkboxAttr}>
      <span class="skill-name">${p.nome}</span>
      <span class="skill-attr-tag">${p.attr.toUpperCase()}</span>
      <span class="skill-val">${total}</span>
      <button class="skill-roll-btn" onclick="rolarD20(${total},'${p.nome}')" title="Rolar d20 + ${total}">
        <svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 2 L21 7.5 V16.5 L12 22 L3 16.5 V7.5 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 2 V22 M3 7.5 L21 16.5 M21 7.5 L3 16.5" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>
      </button>
      ${focoHTML}
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
// GRIMÓRIO ARCANO — integração com motor sistemaMagia (magias.js V2)
// =============================================================

// Converte um objeto {chave: {nome, ...}} em <option> ordenados por nome,
// preservando a chave original como value. Não há nada hardcoded aqui:
// se você adicionar um aspecto/verbo/modificador novo no magias.js, ele
// aparece automaticamente no seletor na próxima renderização.
function montarOpcoesSelect(objeto, valorSelecionado) {
  if (!objeto) return '';
  return Object.keys(objeto)
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
  const circulo        = parseInt(document.getElementById('grim_circulo').value) || 1;

  document.getElementById('grim_circulo_valor').textContent = circulo;

  let magia = null;
  if (aspectoId && verboId && modId) {
    magia = gerarMagiaSegura(aspectoId, verboId, modId, circulo, manifestacaoId || null);
  }

  const modSelecionado = sistemaMagia.modificadores ? sistemaMagia.modificadores[modId] : null;
  document.getElementById('magia-preview-col').innerHTML = gerarHTMLCardMagia(magia, modSelecionado);

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
function gerarMagiaSegura(aspectoId, verboId, modId, circulo, manifestacaoId) {
  const aspecto = sistemaMagia.aspectos[aspectoId];
  if (aspecto && (!aspecto.tracos || !aspecto.sequela)) {
    return { erro: `O aspecto "${aspecto.nome}" ainda não tem os dados de escalonamento (tracos/sequela) cadastrados em magias.js — preview indisponível até a base ser completada.` };
  }
  try {
    // Usa gerarMagiaSegura() do motor (Camada 4): inclui Motor de Degraus,
    // Ricochete do Disco, PV Estrutural, Imposto de Infusão e Falha Crítica.
    return sistemaMagia.gerarMagiaSegura(
      aspectoId, verboId, modId,
      manifestacaoId || null,
      circulo,
      { nivel: 1, modFoco: 0, classePersonagem: null }
    );
  } catch (e) {
    console.error('Erro ao gerar magia:', e);
    return { erro: 'Não foi possível gerar essa combinação. Verifique os dados desse aspecto/verbo no magias.js.' };
  }
}

function renderGrimorio() {
  const d = PERSONAGEM.dados;
  const combo = d.grimorio.ultimaCombo || { aspecto: '', verbo: '', mod: '', manifestacao: '', circulo: 1 };

  const opcoesAspecto  = montarOpcoesSelect(sistemaMagia.aspectos, combo.aspecto);
  const opcoesVerbo    = montarOpcoesSelect(sistemaMagia.verbos, combo.verbo);
  const opcoesMod      = montarOpcoesSelect(sistemaMagia.modificadores, combo.mod);
  const opcoesManifest = montarOpcoesSelect(sistemaMagia.manifestacoes || {}, combo.manifestacao || '');

  document.getElementById('panel-grimorio').innerHTML = `
    <div class="box-title" style="margin-bottom:14px;border-bottom:none">Grimório Arcano</div>
    <div class="grimorio-grid">

      <!-- COLUNA 1 — Painel de Criação -->
      <div class="box grimorio-criacao">
        <div class="box-title">Composição do Feitiço</div>

        <div class="identity-field" style="margin-bottom:14px">
          <label class="identity-label">Aspecto (Deus/Primal)</label>
          <select class="identity-input" id="grim_aspecto" onchange="atualizarPreviewMagia()">
            <option value="">— Selecione —</option>
            ${opcoesAspecto}
          </select>
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
            Círculo Injetado — <span id="grim_circulo_valor">${combo.circulo || 1}</span> / 10
          </label>
          <input type="range" id="grim_circulo" min="1" max="10" step="1"
            value="${combo.circulo || 1}" class="grimorio-slider"
            oninput="atualizarPreviewMagia()">
        </div>
      </div>

      <!-- COLUNA 2 — Card de Preview -->
      <div class="grimorio-preview" id="magia-preview-col">
        ${gerarHTMLCardMagia(
          (combo.aspecto && combo.verbo && combo.mod)
            ? gerarMagiaSegura(combo.aspecto, combo.verbo, combo.mod, combo.circulo, combo.manifestacao || null)
            : null,
          sistemaMagia.modificadores ? sistemaMagia.modificadores[combo.mod] : null
        )}
      </div>

    </div>
  `;
}

// =============================================================
// COMBATE: CÁLCULOS AUTOMÁTICOS (CA / Iniciativa / Deslocamento)
// =============================================================

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

    <!-- MAGIAS / HABILIDADES DE COMBATE -->
    <div class="box">
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
  agendarSalvar();
}

function atualizarCampoSimples(campo, valor) {
  PERSONAGEM.dados[campo] = valor;
  agendarSalvar();
}

function atualizarAtrib(id, valor) {
  const piso = getPisoAtrib(id);
  const v = Math.max(piso, parseInt(valor) || piso);
  PERSONAGEM.dados.attrs[id] = v;

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
  salvarAgora();
  window.location.href = '../../index.html';
}

// =============================================================
// AUTOSAVE
// =============================================================
let _saveTimeout = null;

function agendarSalvar() {
  clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(salvarAgora, 450);
}

function salvarAgora() {
  if (!PERSONAGEM) return;
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
  el._hideTimeout = setTimeout(() => el.classList.remove('show'), 1800);
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

function init() {
  if (!carregarPersonagem()) return;

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
  renderPrincipal();
  renderPericias();
  renderGrimorio();
  renderCombate();
  renderInventario();
  renderBiografia();
  renderNotas();
}

// CSS de upload inline (reutiliza padrão da home)
const uploadStyle = document.createElement('style');
uploadStyle.textContent = `
  .img-upload-area {
    width:100%;height:120px;border:1px dashed rgba(201,168,76,0.35);
    background:rgba(0,0,0,0.2);cursor:pointer;position:relative;overflow:hidden;
    transition:border-color 0.2s,background 0.2s;
    display:flex;align-items:center;justify-content:center;
  }
  .img-upload-area:hover{border-color:rgba(201,168,76,0.6);background:rgba(201,168,76,0.04);}
  .img-upload-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:6px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;color:var(--parchment);pointer-events:none;}
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
  agendarSalvar();
  renderPrincipal();
  renderPericias();
}

function aplicarEspecializacao(val) {
  const d = PERSONAGEM.dados;
  removerPericiasDeClasse();
  d.classeEspec = val;
  if (val) aplicarPericiasDeClasse(d.classeBase, val);
  agendarSalvar();
  renderPrincipal();
  renderPericias();
}
