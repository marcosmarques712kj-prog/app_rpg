// =============================================================
// FICHA ARSENAL — GERADOR VISUAL DE TÉCNICAS (ARMADAS E DESARMADAS)
// =============================================================

// Estado da UI do Arsenal
let MODO_ARSENAL = 'desarmado'; // 'desarmado' ou 'armado'

// =============================================================
// RENDER PRINCIPAL DA ABA
// =============================================================
function renderArsenal() {
  const d = PERSONAGEM.dados;
  if (!d.arsenal) {
    d.arsenal = {
      comboArmado: { categoria: '', acao: '', postura: '', especializacao: '' },
      comboDesarmado: { via: '', impulso: '', postura: '' }
    };
  }
  const comboA = d.arsenal.comboArmado;
  const comboD = d.arsenal.comboDesarmado;

  const htmlToggle = `
    <div style="display:flex; gap:10px; margin-bottom: 20px;">
      <button class="sheet-tab ${MODO_ARSENAL === 'desarmado' ? 'active' : ''}" style="flex:1" onclick="mudarModoArsenal('desarmado')">Técnicas Corporais (Desarmado)</button>
      <button class="sheet-tab ${MODO_ARSENAL === 'armado' ? 'active' : ''}" style="flex:1" onclick="mudarModoArsenal('armado')">Técnicas Marciais (Armado)</button>
    </div>
  `;

  let htmlCriacao = '';
  let htmlPreview = '';
  let htmlAprender = '';

  if (MODO_ARSENAL === 'desarmado') {
    // ─── COMBATE DESARMADO ───
    const opcoesVia = montarOpcoesArsenal(sistemaCombateDesarmado.vias, comboD.via);
    const opcoesImpulso = montarOpcoesArsenal(sistemaCombateDesarmado.impulsos, comboD.impulso);
    const opcoesPostura = montarOpcoesArsenal(sistemaCombateDesarmado.posturas, comboD.postura);

    htmlCriacao = `
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Via (Estilo de Combate)</label>
        <select class="identity-input" id="ars_desarm_via" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesVia}
        </select>
      </div>
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Impulso (Ação)</label>
        <select class="identity-input" id="ars_desarm_impulso" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesImpulso}
        </select>
      </div>
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Postura (Forma)</label>
        <select class="identity-input" id="ars_desarm_postura" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesPostura}
        </select>
      </div>
    `;

    const tecnica = (comboD.via && comboD.impulso && comboD.postura)
      ? sistemaCombateDesarmado.gerarTecnica(comboD.via, comboD.impulso, comboD.postura, 'sustentado')
      : null;
    htmlPreview = gerarHTMLCardTecnica(tecnica);
    htmlAprender = gerarBlocoAprenderDesarmado(comboD);

  } else {
    // ─── COMBATE ARMADO ───
    const opcoesCategoria = montarOpcoesArsenal(sistemaCombateArmado.categorias, comboA.categoria);
    const opcoesAcao = montarOpcoesArsenal(sistemaCombateArmado.acoes, comboA.acao);
    const opcoesPostura = montarOpcoesArsenal(sistemaCombateArmado.posturas, comboA.postura);

    // Filtra especializações pela categoria escolhida
    const esps = {};
    if (comboA.categoria) {
      for (const [id, e] of Object.entries(sistemaCombateArmado.especializacoes)) {
        if (e.categoria === comboA.categoria) esps[id] = e;
      }
    }
    const opcoesEspec = montarOpcoesArsenal(esps, comboA.especializacao);

    htmlCriacao = `
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Arma (Categoria)</label>
        <select class="identity-input" id="ars_arm_categoria" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesCategoria}
        </select>
      </div>
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Ação (Impulso)</label>
        <select class="identity-input" id="ars_arm_acao" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesAcao}
        </select>
      </div>
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Postura (Forma)</label>
        <select class="identity-input" id="ars_arm_postura" onchange="atualizarPreviewArsenal()">
          <option value="">— Selecione —</option>
          ${opcoesPostura}
        </select>
      </div>
      <div class="identity-field" style="margin-bottom:14px">
        <label class="identity-label">Especialização <span style="opacity:0.5;font-style:italic">(opcional)</span></label>
        <select class="identity-input" id="ars_arm_espec" onchange="atualizarPreviewArsenal()">
          <option value="">— Nenhuma —</option>
          ${opcoesEspec}
        </select>
      </div>
    `;

    const tecnica = (comboA.categoria && comboA.acao && comboA.postura)
      ? sistemaCombateArmado.gerarTecnicaArmada(comboA.categoria, comboA.acao, comboA.postura, comboA.especializacao || null, 'sustentado')
      : null;
    htmlPreview = gerarHTMLCardTecnica(tecnica);
    htmlAprender = gerarBlocoAprenderArmado(comboA);
  }

  document.getElementById('panel-arsenal').innerHTML = `
    <div class="box-title" style="margin-bottom:14px;border-bottom:none">Dojo & Arsenal</div>
    ${htmlToggle}
    <div class="grimorio-grid">
      <!-- COLUNA 1 — Painel de Criação -->
      <div class="box grimorio-criacao">
        <div class="box-title">Composição da Técnica</div>
        ${htmlCriacao}
        <div class="identity-hint" style="font-size:11px;opacity:0.6;margin-top:10px">O nível de Sopro (Curto, Sustentado, Pleno) é escolhido na hora de rolar a técnica, na aba Combate.</div>
      </div>
      <!-- COLUNA 2 — Card de Preview -->
      <div class="grimorio-preview-col">
        <div class="grimorio-preview" id="arsenal-preview-col">
          ${htmlPreview}
        </div>
        <div id="arsenal-aprender-col">${htmlAprender}</div>
      </div>
    </div>
  `;
}

function mudarModoArsenal(modo) {
  MODO_ARSENAL = modo;
  renderArsenal();
}

function atualizarPreviewArsenal() {
  const d = PERSONAGEM.dados;
  if (!d.arsenal) d.arsenal = { comboArmado: {}, comboDesarmado: {} };

  if (MODO_ARSENAL === 'desarmado') {
    d.arsenal.comboDesarmado.via = document.getElementById('ars_desarm_via').value;
    d.arsenal.comboDesarmado.impulso = document.getElementById('ars_desarm_impulso').value;
    d.arsenal.comboDesarmado.postura = document.getElementById('ars_desarm_postura').value;
  } else {
    const catAntiga = d.arsenal.comboArmado.categoria;
    d.arsenal.comboArmado.categoria = document.getElementById('ars_arm_categoria').value;
    d.arsenal.comboArmado.acao = document.getElementById('ars_arm_acao').value;
    d.arsenal.comboArmado.postura = document.getElementById('ars_arm_postura').value;
    const especElement = document.getElementById('ars_arm_espec');
    if (especElement) d.arsenal.comboArmado.especializacao = especElement.value;
    
    // Se mudou a categoria, reseta a especialização
    if (catAntiga !== d.arsenal.comboArmado.categoria) {
      d.arsenal.comboArmado.especializacao = '';
    }
  }
  
  agendarSalvar();
  renderArsenal();
}

// =============================================================
// UTILIDADES E RENDERIZAÇÃO
// =============================================================

function montarOpcoesArsenal(objDict, selecionadoId) {
  if (!objDict) return '';
  return Object.keys(objDict).map(id => {
    const item = objDict[id];
    const sel = id === selecionadoId ? 'selected' : '';
    return `<option value="${id}" ${sel}>${item.nome}</option>`;
  }).join('');
}

function gerarHTMLCardTecnica(tecnica) {
  if (!tecnica) {
    return `<div class="magia-card-vazio">Selecione os componentes ao lado para visualizar a técnica.</div>`;
  }
  if (tecnica.erro) {
    return `<div class="magia-card-vazio" style="color:var(--blood-light)">Erro: ${tecnica.erro}</div>`;
  }

  const tipo = tecnica.nomeCategoria ? 'Armada' : 'Desarmada';
  const nomePrincipal = tecnica.nomeCategoria || tecnica.nomeVia;
  const acao = tecnica.nomeAcao || tecnica.nomeImpulso;
  
  const icone = tecnica.icone || '⚔';
  const especializacaoText = tecnica.especializacao ? ` · ${tecnica.especializacao.nome}` : '';

  const tagsHtml = (tecnica.tags || []).map(t => `<span class="magia-badge" style="border: 1px solid rgba(255,255,255,0.1)">${esc(t)}</span>`).join('');
  
  // Detalhe principal (Dado e Custo fixado em Sustentado p/ preview)
  const dadoStr = (tecnica.quantidadeDados && tecnica.dadoResolvido) ? `${tecnica.quantidadeDados}${tecnica.dadoResolvido}${tecnica.bonusFixoDado ? ` +${tecnica.bonusFixoDado}` : ''}` : '—';
  
  return `
    <div class="magia-card-header" style="background:var(--parchment-dark); border-bottom:1px solid rgba(201,168,76,0.2)">
      <div class="magia-card-icone">${icone}</div>
      <div class="magia-card-titulo-area">
        <div class="magia-card-titulo" style="color:var(--gold)">${esc(nomePrincipal)} ${esc(especializacaoText)}</div>
        <div class="magia-card-subtitulo" style="color:rgba(255,255,255,0.7)">${esc(acao)} · Postura ${esc(tecnica.nomePostura)}</div>
      </div>
    </div>
    
    <div style="padding:16px;">
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
        ${tagsHtml}
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;opacity:0.6;margin-bottom:4px;color:var(--gold)">PRÉVIA (SOPRO SUSTENTADO)</div>
        <div style="display:flex; gap:16px;">
          <div><span style="opacity:0.6;font-size:12px;">Custo:</span> <strong style="color:var(--gold)">${tecnica.custoFinal} Sopro</strong></div>
          <div><span style="opacity:0.6;font-size:12px;">Dado Base:</span> <strong style="color:var(--gold)">${dadoStr}</strong></div>
        </div>
      </div>
      
      <div class="magia-card-desc" style="color:rgba(255,255,255,0.85); line-height:1.5;">
        ${esc(tecnica.descricaoFinal).replace(/\n/g, '<br>')}
      </div>
    </div>
  `;
}

// =============================================================
// APRENDIZADO
// =============================================================

function gerarBlocoAprenderDesarmado(combo) {
  if (!combo.via || !combo.impulso || !combo.postura) return '';
  
  const idCombo = `${combo.via}::${combo.impulso}::${combo.postura}`;
  const d = PERSONAGEM.dados;
  const jaAprendeu = (d.tecnicasDesarmadasSalvas || []).some(t => `${t.via}::${t.impulso}::${t.postura}` === idCombo);

  if (jaAprendeu) {
    return `<div class="grimorio-aprender-aviso ja-aprendida">✓ Técnica corporal já registrada no seu Combate.</div>`;
  }
  return `<button class="btn-aprender-magia" onclick="aprenderDesarmado()">+ Adicionar ao Combate</button>`;
}

function gerarBlocoAprenderArmado(combo) {
  if (!combo.categoria || !combo.acao || !combo.postura) return '';
  
  const idCombo = `${combo.categoria}::${combo.acao}::${combo.postura}::${combo.especializacao||''}`;
  const d = PERSONAGEM.dados;
  const jaAprendeu = (d.tecnicasArmadasSalvas || []).some(t => `${t.categoria}::${t.acao}::${t.postura}::${t.especializacao||''}` === idCombo);

  if (jaAprendeu) {
    return `<div class="grimorio-aprender-aviso ja-aprendida">✓ Técnica marcial já registrada no seu Combate.</div>`;
  }
  return `<button class="btn-aprender-magia" onclick="aprenderArmado()">+ Adicionar ao Combate</button>`;
}

function aprenderDesarmado() {
  const d = PERSONAGEM.dados;
  if (!d.tecnicasDesarmadasSalvas) d.tecnicasDesarmadasSalvas = [];
  const combo = d.arsenal.comboDesarmado;
  
  d.tecnicasDesarmadasSalvas.push({
    id: 'tcd_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    via: combo.via,
    impulso: combo.impulso,
    postura: combo.postura,
    nivelSopro: 'sustentado' // padrão ao aprender
  });
  
  showToast('✓ Técnica corporal adicionada!');
  renderArsenal();
  if (document.getElementById('panel-combate')) renderCombate();
  agendarSalvar();
}

function aprenderArmado() {
  const d = PERSONAGEM.dados;
  if (!d.tecnicasArmadasSalvas) d.tecnicasArmadasSalvas = [];
  const combo = d.arsenal.comboArmado;
  
  d.tecnicasArmadasSalvas.push({
    id: 'tca_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    categoria: combo.categoria,
    acao: combo.acao,
    postura: combo.postura,
    especializacao: combo.especializacao,
    nivelSopro: 'sustentado' // padrão ao aprender
  });
  
  showToast('✓ Técnica marcial adicionada!');
  renderArsenal();
  if (document.getElementById('panel-combate')) renderCombate();
  agendarSalvar();
}

// =============================================================
// LISTAS DINÂMICAS PARA A ABA COMBATE
// =============================================================

function removerTecnicaDesarmadaSalva(id) {
  const d = PERSONAGEM.dados;
  d.tecnicasDesarmadasSalvas = (d.tecnicasDesarmadasSalvas || []).filter(t => t.id !== id);
  if (document.getElementById('panel-combate')) renderCombate();
  if (document.getElementById('panel-arsenal')) renderArsenal();
  agendarSalvar();
}

function removerTecnicaArmadaSalva(id) {
  const d = PERSONAGEM.dados;
  d.tecnicasArmadasSalvas = (d.tecnicasArmadasSalvas || []).filter(t => t.id !== id);
  if (document.getElementById('panel-combate')) renderCombate();
  if (document.getElementById('panel-arsenal')) renderArsenal();
  agendarSalvar();
}

function alterarSoproTecnicaDesarmada(id, novoSopro) {
  const d = PERSONAGEM.dados;
  const tec = (d.tecnicasDesarmadasSalvas || []).find(t => t.id === id);
  if (tec) tec.nivelSopro = novoSopro;
  
  const detalheEl = document.getElementById('tecdesarm_detalhe_' + id);
  if (detalheEl) {
    const tGerada = sistemaCombateDesarmado.gerarTecnica(tec.via, tec.impulso, tec.postura, novoSopro);
    detalheEl.innerHTML = gerarHTMLCardTecnica(tGerada);
  }
  agendarSalvar();
}

function alterarSoproTecnicaArmada(id, novoSopro) {
  const d = PERSONAGEM.dados;
  const tec = (d.tecnicasArmadasSalvas || []).find(t => t.id === id);
  if (tec) tec.nivelSopro = novoSopro;
  
  const detalheEl = document.getElementById('tecarm_detalhe_' + id);
  if (detalheEl) {
    const tGerada = sistemaCombateArmado.gerarTecnicaArmada(tec.categoria, tec.acao, tec.postura, tec.especializacao || null, novoSopro);
    detalheEl.innerHTML = gerarHTMLCardTecnica(tGerada);
  }
  agendarSalvar();
}

function toggleDetalheTecnica(prefix, id) {
  const el = document.getElementById(prefix + '_detalhe_' + id);
  if (!el) return;
  const aberto = el.style.maxHeight && el.style.maxHeight !== '0px';
  el.style.maxHeight = aberto ? '0px' : '2000px';
  el.style.opacity = aberto ? '0' : '1';
  el.style.marginTop = aberto ? '0' : '10px';
}

function gerarHTMLListaTecnicasDesarmadas(d) {
  const salvas = d.tecnicasDesarmadasSalvas || [];
  if (salvas.length === 0) {
    return `
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Técnicas Corporais (Combate Desarmado)</div>
      <div class="magia-card-vazio">Nenhuma técnica registrada. Acesse o 🥋 Arsenal para montá-las.</div>
    </div>`;
  }

  const itens = salvas.map(t => {
    const via = sistemaCombateDesarmado.vias[t.via] || { nome: t.via, icone: '👊' };
    const imp = sistemaCombateDesarmado.impulsos[t.impulso] || { nome: t.impulso };
    const pos = sistemaCombateDesarmado.posturas[t.postura] || { nome: t.postura };
    
    const nivelSopro = t.nivelSopro || 'sustentado';
    const opcoesSopro = Object.keys(sistemaCombateDesarmado.niveisSopro).map(idS => {
      const nome = sistemaCombateDesarmado.niveisSopro[idS].nome;
      return `<option value="${idS}" ${idS === nivelSopro ? 'selected' : ''}>${nome}</option>`;
    }).join('');

    const tGerada = sistemaCombateDesarmado.gerarTecnica(t.via, t.impulso, t.postura, nivelSopro);

    return `
    <div class="magsalva-item" style="--cor-aspecto:#C9A84C">
      <div class="magsalva-linha">
        <div class="magsalva-icone">${via.icone}</div>
        <div class="magsalva-info" onclick="toggleDetalheTecnica('tecdesarm', '${t.id}')">
          <div class="magsalva-titulo">${esc(via.nome)}</div>
          <div class="magsalva-subtitulo">${esc(imp.nome)} · Postura ${esc(pos.nome)}</div>
        </div>
        <button class="magsalva-btn-remover" onclick="removerTecnicaDesarmadaSalva('${t.id}')" title="Esquecer">✕</button>
      </div>
      <div class="magsalva-linha" style="margin-top:6px">
        <label class="magsalva-circulo-label" style="flex-shrink:0">Comprometimento</label>
        <select class="identity-input magsalva-verbo-select" style="flex:1;min-width:0"
          onchange="alterarSoproTecnicaDesarmada('${t.id}',this.value)">
          ${opcoesSopro}
        </select>
      </div>
      <div class="magsalva-detalhe" id="tecdesarm_detalhe_${t.id}" style="max-height:0;opacity:0;margin-top:0; border: 1px solid rgba(201,168,76,0.1); border-radius: 4px; overflow: hidden; background: rgba(0,0,0,0.2);">
        ${gerarHTMLCardTecnica(tGerada)}
      </div>
    </div>`;
  }).join('');

  return `
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Técnicas Corporais (Combate Desarmado)</div>
      <div class="magsalva-lista">${itens}</div>
    </div>`;
}

function gerarHTMLListaTecnicasArmadas(d) {
  const salvas = d.tecnicasArmadasSalvas || [];
  if (salvas.length === 0) {
    return `
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Técnicas Marciais (Combate Armado)</div>
      <div class="magia-card-vazio">Nenhuma técnica registrada. Acesse o 🥋 Arsenal para montá-las.</div>
    </div>`;
  }

  const itens = salvas.map(t => {
    const cat = sistemaCombateArmado.categorias[t.categoria] || { nome: t.categoria, icone: '⚔️' };
    const acao = sistemaCombateArmado.acoes[t.acao] || { nome: t.acao };
    const pos = sistemaCombateArmado.posturas[t.postura] || { nome: t.postura };
    
    const nivelSopro = t.nivelSopro || 'sustentado';
    const opcoesSopro = Object.keys(sistemaCombateArmado.niveisSopro).map(idS => {
      const nome = sistemaCombateArmado.niveisSopro[idS].nome;
      return `<option value="${idS}" ${idS === nivelSopro ? 'selected' : ''}>${nome}</option>`;
    }).join('');

    const tGerada = sistemaCombateArmado.gerarTecnicaArmada(t.categoria, t.acao, t.postura, t.especializacao || null, nivelSopro);

    return `
    <div class="magsalva-item" style="--cor-aspecto:#556677">
      <div class="magsalva-linha">
        <div class="magsalva-icone">${cat.icone}</div>
        <div class="magsalva-info" onclick="toggleDetalheTecnica('tecarm', '${t.id}')">
          <div class="magsalva-titulo">${esc(cat.nome)}</div>
          <div class="magsalva-subtitulo">${esc(acao.nome)} · Postura ${esc(pos.nome)}</div>
        </div>
        <button class="magsalva-btn-remover" onclick="removerTecnicaArmadaSalva('${t.id}')" title="Esquecer">✕</button>
      </div>
      <div class="magsalva-linha" style="margin-top:6px">
        <label class="magsalva-circulo-label" style="flex-shrink:0">Comprometimento</label>
        <select class="identity-input magsalva-verbo-select" style="flex:1;min-width:0"
          onchange="alterarSoproTecnicaArmada('${t.id}',this.value)">
          ${opcoesSopro}
        </select>
      </div>
      <div class="magsalva-detalhe" id="tecarm_detalhe_${t.id}" style="max-height:0;opacity:0;margin-top:0; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; background: rgba(0,0,0,0.2);">
        ${gerarHTMLCardTecnica(tGerada)}
      </div>
    </div>`;
  }).join('');

  return `
    <div class="box" style="margin-bottom:16px">
      <div class="box-title">Técnicas Marciais (Combate Armado)</div>
      <div class="magsalva-lista">${itens}</div>
    </div>`;
}
