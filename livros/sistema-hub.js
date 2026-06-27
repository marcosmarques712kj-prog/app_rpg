// =============================================================
// SISTEMAS — cópia temporária da lista que vive em home-screen.html
// TODO: extrair pra um arquivo sistemas-data.js compartilhado entre
// home-screen.html e este hub, pra não precisar manter os dois em sincronia
// manualmente quando um sistema novo for adicionado ou um campo mudar.
// =============================================================
const SISTEMAS = [
  {
    id: 'dnd5e',
    nome: 'D&D 5e',
    desc: 'Dungeons & Dragons 5ª Edição — o sistema de fantasia medieval mais jogado do mundo.',
    icon: 'D&D',
    img: '../assets/icons/dnd.png',
    cor: '#C9A84C',
    corBg: 'rgba(201,168,76,0.08)',
    ficha: '../rpg-interface.html',
    urlCampanha: '../sistemas/dnd/campanha-dnd.html',
    campos: [
      { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Bárbaro','Bardo','Clérigo','Druida','Feiticeiro','Guerreiro','Ladino','Mago','Monge','Paladino','Ranger','Bruxo'] },
      { id: 'race', label: 'Raça', tipo: 'select', opcoes: ['Humano','Elfo','Anão','Halfling','Gnomo','Meio-Orc','Meio-Elfo','Tiefling','Draconato','Outro'] },
      { id: 'level', label: 'Nível', tipo: 'number', min: 1, max: 20, default: 1 },
      { id: 'align', label: 'Alinhamento', tipo: 'select', opcoes: ['Leal Bom','Neutro Bom','Caótico Bom','Leal Neutro','Neutro','Caótico Neutro','Leal Mau','Neutro Mau','Caótico Mau'] }
    ]
  },
  {
    id: 'op',
    nome: 'Ordem Paranormal',
    desc: 'Horror investigativo com agentes que enfrentam o paranormal. NEX, rituais e sanidade.',
    icon: 'OP',
    img: '../assets/icons/op.png',
    cor: '#1BBFB5',
    corBg: 'rgba(27,191,181,0.08)',
    ficha: '../sistemas/ordem_paranormal/rpg-op.html',
    urlCampanha: '../sistemas/ordem_paranormal/campanha-op.html',
    campos: [
      { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Combatente','Especialista','Ocultista'] },
      { id: 'origem', label: 'Origem', tipo: 'select', opcoes: ['Acadêmico','Amnésico','Artista','Atleta','Criança Prodígio','Detetive','Enfermeiro','Engenheiro','Executivo','Jornalista','Líder Comunitário','Lutador','Médico','Militar','Ocultista','Policial','Refugiado','Religioso','Servidor Público','Técnico'] },
      { id: 'nex', label: 'NEX Inicial (%)', tipo: 'number', min: 5, max: 95, default: 5 }
    ]
  },
  {
    id: 'tormenta',
    nome: 'Tormenta 20',
    desc: 'Fantasy épico brasileiro. Sistema d20 com raças e classes únicas do cenário de Arton.',
    icon: 'T20',
    img: '../assets/icons/tmt.png',
    cor: '#C45A10',
    corBg: 'rgba(196,90,16,0.08)',
    ficha: '../rpg-interface.html',
    urlCampanha: '../sistemas/tormenta/campanha-tormenta.html',
    campos: [
      { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Arcanista','Bárbaro','Bardo','Bucaneiro','Caçador','Cavaleiro','Clérigo','Druida','Guerreiro','Inventor','Ladino','Lutador','Nobre','Paladino'] },
      { id: 'race', label: 'Raça', tipo: 'select', opcoes: ['Humano','Elfo','Anão','Halfling','Gnomo','Goblin','Lefou','Minotauro','Qareen','Sereia/Tritão','Sílfide','Suraggel','Tigrino'] },
      { id: 'level', label: 'Nível', tipo: 'number', min: 1, max: 20, default: 1 }
    ]
  }
];

function getSistema(id) { return SISTEMAS.find(s => s.id === id) || null; }

function sysIcon(s, size = '1.4em') {
  if (!s) return '✦';
  if (s.img) return `<img src="${s.img}" alt="${s.nome}" style="width:${size};height:${size};object-fit:contain;display:inline-block;vertical-align:middle;">`;
  return s.icon || '✦';
}

function sistemaBadge(id) {
  const s = getSistema(id);
  if (!s) return `<span class="sys-badge" style="color:#888;border-color:rgba(128,128,128,0.3)">${id}</span>`;
  return `<span class="sys-badge" style="color:${s.cor};border-color:${s.cor}40;background:${s.corBg}">${sysIcon(s,'1em')} ${s.nome}</span>`;
}

// =============================================================
// STORAGE — mesma base usada pela tela principal
// =============================================================
function loadData(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch(e) { return fallback; }
}
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

let CAMPANHAS   = loadData('forja_campanhas', []);
let PERSONAGENS = loadData('forja_personagens', []);

let SISTEMA_ATUAL = null;

function pegarSysDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('sys');
}

function voltarParaHome() {
  window.location.href = '../index.html';
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
// DEFINIÇÃO DAS ABAS
// =============================================================
const HUB_TABS = [
  { id: 'estatisticas', label: 'Estatísticas', icon: '📊', pronto: true },
  { id: 'campanhas',    label: 'Campanhas',    icon: '⚔', pronto: true },
  { id: 'bestiario',    label: 'Bestiário',    icon: '🐉', pronto: false },
  { id: 'magias',       label: 'Magias',       icon: '✦', pronto: false },
  { id: 'equipamentos', label: 'Equipamentos', icon: '🗡', pronto: false },
  { id: 'regras',       label: 'Regras',       icon: '📜', pronto: false },
  { id: 'homebrew',     label: 'HomeBrew',     icon: '🔥', pronto: false },
];

function renderHubTabs() {
  const nav = document.getElementById('hubTabs');
  nav.innerHTML = HUB_TABS.map(t => `
    <button class="hub-tab ${t.pronto ? '' : 'disabled'} ${t.id === 'estatisticas' ? 'active' : ''}"
            data-tab="${t.id}"
            onclick="${t.pronto ? `switchHubTab('${t.id}')` : `avisarEmBreve('${t.label}')`}">
      ${t.icon} ${t.label}
      ${t.pronto ? '' : '<span class="hub-tab-soon">em breve</span>'}
    </button>
  `).join('');
}

function switchHubTab(id) {
  document.querySelectorAll('.hub-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.hub-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
}

function avisarEmBreve(nomeAba) {
  showToast(`🔧 A aba "${nomeAba}" ainda está sendo forjada — em breve!`, 'info');
}
// =============================================================
// ABA: ESTATÍSTICAS
// =============================================================
function campanhasDoSistema() {
  return CAMPANHAS.filter(c => c.sistema === SISTEMA_ATUAL.id);
}
function personagensDoSistema() {
  return PERSONAGENS.filter(p => p.sistema === SISTEMA_ATUAL.id);
}

// Campanhas criadas antes desse recurso existir não têm `criadaEm` salvo.
// Pra não quebrar a ordenação, tratamos ausência de criadaEm como "a mais
// antiga possível" (0) — ela aparece como mais antiga até ser recriada/editada,
// o que é aceitável já que não temos um dado real pra essas.
function dataCriacao(c) { return c.criadaEm || 0; }

function formatarData(timestamp) {
  if (!timestamp) return 'Data desconhecida';
  const d = new Date(timestamp);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderEstatisticas() {
  const camps = campanhasDoSistema();
  const chars = personagensDoSistema();

  const maisAntiga = camps.length
    ? camps.reduce((a, b) => dataCriacao(a) <= dataCriacao(b) ? a : b)
    : null;

  const comSessao = camps.filter(c => c.ultimaSessao);
  const maisRecenteSessao = comSessao.length
    ? comSessao.reduce((a, b) => a.ultimaSessao >= b.ultimaSessao ? a : b)
    : null;

  document.getElementById('panel-estatisticas').innerHTML = `
    <div class="hub-sec-header">
      <div class="hub-sec-title">Estatísticas</div>
      <div class="hub-sec-desc">Um retrato rápido de como ${SISTEMA_ATUAL.nome} está sendo jogado por aqui.</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-card-icon">⚔</span>
        <span class="stat-card-value">${camps.length}</span>
        <span class="stat-card-label">Campanha${camps.length!==1?'s':''}</span>
      </div>
      <div class="stat-card">
        <span class="stat-card-icon">🧙</span>
        <span class="stat-card-value">${chars.length}</span>
        <span class="stat-card-label">Personagem${chars.length!==1?'s':''}</span>
      </div>
      <div class="stat-card wide">
        <span class="stat-card-icon">📜</span>
        <span class="stat-card-value" style="font-size:18px">${maisAntiga ? esc(maisAntiga.nome) : '—'}</span>
        <span class="stat-card-label">Campanha mais antiga</span>
        ${maisAntiga ? `<span class="stat-card-sub">criada em ${formatarData(dataCriacao(maisAntiga))}</span>` : ''}
      </div>
      <div class="stat-card wide">
        <span class="stat-card-icon">📅</span>
        <span class="stat-card-value" style="font-size:18px">${maisRecenteSessao ? esc(maisRecenteSessao.nome) : '—'}</span>
        <span class="stat-card-label">Sessão mais recente</span>
        ${maisRecenteSessao
          ? `<span class="stat-card-sub">jogada em ${formatarData(maisRecenteSessao.ultimaSessao)}</span>`
          : `<span class="stat-card-sub">nenhuma sessão marcada ainda</span>`}
      </div>
    </div>

    ${camps.length === 0 && chars.length === 0 ? `
      <div class="hub-empty">
        <div class="hub-empty-icon">🌑</div>
        <div class="hub-empty-text">Ainda não há campanhas ou personagens de ${SISTEMA_ATUAL.nome} por aqui.</div>
      </div>
    ` : ''}
  `;
}
// =============================================================
// ABA: CAMPANHAS
// =============================================================
const HUB_STATUS_MAP = {
  active: { cls: 'status-active', label: 'ATIVA' },
  paused: { cls: 'status-paused', label: 'PAUSADA' },
  done:   { cls: 'status-done',   label: 'CONCLUÍDA' }
};

function renderHubCampanhas() {
  const camps = campanhasDoSistema();

  const gridHTML = camps.length ? `
    <div class="hub-camps-grid">
      ${camps.map((c, i) => campCardHTML(c, i)).join('')}
    </div>
  ` : `
    <div class="hub-empty">
      <div class="hub-empty-icon">📖</div>
      <div class="hub-empty-text">Nenhuma campanha de ${SISTEMA_ATUAL.nome} foi criada ainda.</div>
    </div>
  `;

  document.getElementById('panel-campanhas').innerHTML = `
    <div class="hub-sec-header">
      <div class="hub-sec-title">Campanhas de ${SISTEMA_ATUAL.nome}</div>
      <div class="hub-sec-desc">Todas as mesas que usam este sistema, num só lugar.</div>
    </div>
    ${gridHTML}
  `;
}

// Mesmo card visual usado em home-screen.html (renderCampanhas), reaproveitando
// as classes camp-card / camp-status / sys-badge / meta-chip / char-mini-dot
// já definidas em home-screen.css.
function campCardHTML(c, i) {
  const s = getSistema(c.sistema);
  const st = HUB_STATUS_MAP[c.status] || HUB_STATUS_MAP.active;
  const chars = PERSONAGENS.filter(p => (c.personagens||[]).includes(p.id));
  return `
  <div class="camp-card fade-in" style="animation-delay:${i*0.06}s" onclick="abrirCampanhaDoHub('${c.id}')">
    <div class="camp-card-top" style="${c.banner ? `background:url('${c.banner}') center/cover no-repeat` : `background:${s ? `linear-gradient(135deg, ${s.corBg}, rgba(0,0,0,0))` : ''}`}">
      ${c.banner ? `<div class="camp-banner-overlay"></div>` : ''}
      <div class="camp-icon" style="position:relative;z-index:1">${s ? sysIcon(s,'2.2em') : '⚔'}</div>
      <span class="camp-status ${st.cls}" style="position:relative;z-index:1">${st.label}</span>
    </div>
    <div class="camp-card-body">
      <div class="camp-nome">${esc(c.nome)}</div>
      <div class="camp-desc">${esc(c.desc)}</div>
      <div class="camp-meta">
        ${sistemaBadge(c.sistema)}
        <span class="meta-chip">👥 ${c.jogadores} jogadores</span>
        <span class="meta-chip">📖 ${c.sessoes} sessões</span>
      </div>
      ${chars.length ? `<div class="camp-chars-mini">${chars.slice(0,4).map(p=>`<div class="char-mini-dot" title="${esc(p.nome)}">${esc(p.nome[0])}</div>`).join('')}${chars.length > 4 ? `<div class="char-mini-dot more">+${chars.length-4}</div>` : ''}</div>` : ''}
    </div>
  </div>`;
}

// Abre os detalhes da campanha — mesma lógica de abrirCampanha() da home,
// usando o campo urlCampanha do sistema (ainda não existe como arquivo,
// mas o link já fica correto pra quando existir).
function abrirCampanhaDoHub(id) {
  const c = CAMPANHAS.find(x => x.id === id);
  if (!c) return;
  const s = getSistema(c.sistema);
  if (s && s.urlCampanha) {
    window.location.href = `${s.urlCampanha}?id=${c.id}`;
  } else {
    showToast('⚠ Painel de campanha não configurado para este sistema.', 'warning');
  }
}
// =============================================================
// TOAST (mesmo padrão dos outros arquivos)
// =============================================================
function showToast(msg, type = '') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  if (type === 'gold')    t.style.borderColor = 'var(--gold)';
  if (type === 'warning') t.style.borderColor = 'var(--blood-light)';
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(30px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// =============================================================
// PAINEL "EM BREVE" (genérico p/ Bestiário, Magias, Equipamentos, Regras, HomeBrew)
// =============================================================
function soonPanelHTML(tab) {
  return `
    <div class="hub-soon-box">
      <div class="hub-soon-icon">${tab.icon}</div>
      <div class="hub-soon-title">${tab.label} — em breve</div>
      <div class="hub-soon-text">Esta seção ainda está sendo forjada. Em breve você poderá consultar e gerenciar ${tab.label.toLowerCase()} de ${SISTEMA_ATUAL.nome} por aqui.</div>
    </div>
  `;
}

// =============================================================
// MONTAGEM E INIT
// =============================================================
function montarPaineis() {
  document.getElementById('hubContent').innerHTML = HUB_TABS.map(t => `
    <section class="hub-panel ${t.id === 'estatisticas' ? 'active' : ''}" id="panel-${t.id}">
      ${t.pronto ? '' : soonPanelHTML(t)}
    </section>
  `).join('');
}

function aplicarCorDoSistema(s) {
  document.documentElement.style.setProperty('--sys-cor', s.cor);
  document.documentElement.style.setProperty('--sys-cor-bg', s.corBg);
}

function mostrarSistemaInvalido() {
  document.getElementById('hubTabs').style.display = 'none';
  document.getElementById('hubContent').innerHTML = `
    <div class="hub-empty" style="padding-top:120px">
      <div class="hub-empty-icon">⚠</div>
      <div class="hub-empty-text">Sistema não encontrado. Volte e escolha um sistema válido.</div>
      <button class="hub-back" onclick="voltarParaHome()" style="opacity:0.8;margin-top:8px">← Voltar para Forja das Eras</button>
    </div>`;
}

function init() {
  const sysId = pegarSysDaUrl();
  SISTEMA_ATUAL = getSistema(sysId);
  if (!SISTEMA_ATUAL) { mostrarSistemaInvalido(); return; }

  aplicarCorDoSistema(SISTEMA_ATUAL);
  document.getElementById('hubSysIcon').innerHTML = sysIcon(SISTEMA_ATUAL, '1.6em');
  document.getElementById('hubSysName').textContent = SISTEMA_ATUAL.nome;
  document.getElementById('hubSysDesc').textContent = SISTEMA_ATUAL.desc;

  renderHubTabs();
  montarPaineis();
  renderEstatisticas();
  renderHubCampanhas();
}

init();
