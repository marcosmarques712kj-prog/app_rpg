// ============================================================
// AUTH SUPABASE — módulo central de login, compartilhado entre
// todas as páginas do app_rpg (hub, fichas, campanhas).
// ============================================================
// Uso típico em qualquer botão que precise de usuário logado:
//
//   async function criarCampanha(dados) {
//     const sessao = await exigirLogin();
//     if (!sessao) return; // pessoa cancelou o login (ação pendente
//                          // continua salva, será retomada no próximo load)
//     // ...resto da função (salvar no Supabase, etc)...
//     consumirAcaoPendente('criarCampanha'); // ⚠️ OBRIGATÓRIO ao terminar
//     // com sucesso — sem isto, se a pessoa já estava logada (ação
//     // rodou direto, sem precisar de redirect) mas você chamou
//     // guardarAcaoPendente() antes de exigirLogin() por precaução,
//     // a entrada fica "órfã" no sessionStorage. Um F5 acidental
//     // mais tarde faria o handler de DOMContentLoaded reexecutar a
//     // MESMA ação de novo (ex: criar a campanha duplicada). Sempre
//     // limpe a própria ação pendente ao concluir com sucesso.
//   }
//
//   document.getElementById('btnCriar').onclick = () => {
//     const dados = { nome: ... };
//     guardarAcaoPendente('criarCampanha', dados); // ANTES do exigirLogin
//     criarCampanha(dados);
//   };
//
//   window.addEventListener('DOMContentLoaded', async () => {
//     const pendente = consumirAcaoPendente('criarCampanha');
//     if (pendente) await criarCampanha(pendente); // retoma pós-redirect
//   });
//
// Login é "lazy": nenhuma página exige login só por carregar.
// exigirLogin() só aparece quando uma ação de fato precisa saber
// quem é o usuário (salvar campanha, entrar numa campanha, etc).
//
// O modal é visualmente autocontido (CSS injetado inline via JS,
// mesmo padrão já usado em etherion-ficha.js pro upload de imagem)
// porque este módulo precisa funcionar em páginas com temas MUITO
// diferentes (hub claro/dourado vs ficha gótica do Etherion vs
// outros sistemas) sem depender de nenhum CSS externo específico.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://qqaatpndnngdczatpjxf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zhHOZiEV-YipHcW8GNPwvQ_F4s40QmK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ------------------------------------------------------------
// Estado de sessão em memória — espelha o que o Supabase Auth
// já mantém, mas exposto de forma síncrona pro resto do app
// poder checar "tem usuário logado agora?" sem await.
// ------------------------------------------------------------
let _usuarioAtual = null;
let _perfilAtual = null; // linha espelhada de public.usuarios (nome, avatar)
let _prontoPromise = null;

// FIX RACE CONDITION: o Supabase dispara onAuthStateChange várias
// vezes na mesma carga de página (ex: INITIAL_SESSION, e em seguida
// SIGNED_IN ou TOKEN_REFRESHED), e cada disparo chama _aplicarSessao,
// que é assíncrona (faz um await numa query em `usuarios`). Sem
// proteção, duas chamadas concorrentes de _aplicarSessao podem
// terminar fora de ordem — a que demorar mais "vence" e sobrescreve
// o estado mesmo sendo mais antiga, mesmo que a sessão já tenha
// mudado de novo nesse meio tempo (ex: virou null/deslogou). Isso
// causava o sintoma observado: usuarioLogado() oscilando entre um
// UUID válido e null várias vezes na mesma carga, e ações disparadas
// num momento de inconsistência (ex: criar personagem) gravando com
// dono_id ausente/undefined.
// A correção: cada chamada de _aplicarSessao recebe um número de
// geração. Se, quando ela terminar seu await, uma chamada MAIS NOVA
// já tiver começado, esta versão antiga descarta seu resultado em
// vez de sobrescrever o estado.
let _geracaoSessao = 0;

// Resolve quando a sessão inicial já foi checada pelo menos uma vez
// (evita condição de corrida: páginas que checam usuarioLogado() no
// primeiro frame, antes do Supabase ter respondido getSession()).
function aguardarPronto() {
  if (!_prontoPromise) {
    _prontoPromise = supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) await _aplicarSessao(session);
    });
  }
  return _prontoPromise;
}

async function _aplicarSessao(session) {
  const minhaGeracao = ++_geracaoSessao;
  const usuarioId = session.user.id;
  const { data: perfil, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', usuarioId)
    .maybeSingle();
  if (error) {
    console.error('[auth-supabase] erro ao buscar perfil em public.usuarios:', error.message);
  }
  // Se outra chamada de _aplicarSessao começou DEPOIS desta (geração
  // mais alta), esta é obsoleta — descarta o resultado sem tocar no
  // estado global, mesmo que tenha terminado depois (fora de ordem).
  if (minhaGeracao !== _geracaoSessao) {
    console.log('[auth-supabase] _aplicarSessao descartada (obsoleta) — geração', minhaGeracao, 'vs atual', _geracaoSessao);
    return;
  }
  _usuarioAtual = session.user;
  _perfilAtual = perfil || null;
  _notificarOuvintes();
}

supabase.auth.onAuthStateChange(async (_evento, session) => {
  console.log('[auth-supabase] onAuthStateChange evento =', _evento, 'session =', session ? session.user.id : null);
  if (session) {
    await _aplicarSessao(session);
  } else {
    // Mesma proteção de geração do logout: avança a geração para que
    // qualquer _aplicarSessao() antiga ainda "em voo" seja descartada
    // ao terminar, em vez de reviver um usuário que já deslogou.
    ++_geracaoSessao;
    _usuarioAtual = null;
    _perfilAtual = null;
    _notificarOuvintes();
  }
});

// ------------------------------------------------------------
// API pública de leitura de estado
// ------------------------------------------------------------

// Devolve o usuário logado AGORA (sincrono, pode ser null se a
// sessão inicial ainda não foi checada — use aguardarPronto() ou
// onMudancaAuth() se precisar reagir ao carregamento).
export function usuarioLogado() {
  return _usuarioAtual;
}

// Devolve o perfil público (nome, avatar) espelhado de public.usuarios.
export function perfilLogado() {
  return _perfilAtual;
}

const _ouvintes = [];
function _notificarOuvintes() {
  _ouvintes.forEach(fn => fn(_usuarioAtual, _perfilAtual));
}

// Callback chamado toda vez que o estado de login muda (login,
// logout, ou perfil carregado pela primeira vez). Útil pra páginas
// que precisam atualizar um avatar/nome no canto da tela.
export function onMudancaAuth(callback) {
  _ouvintes.push(callback);
  // chama imediatamente com o estado atual, se já existir
  if (_usuarioAtual !== null || _perfilAtual !== null) callback(_usuarioAtual, _perfilAtual);
}

// ------------------------------------------------------------
// Modal de login (CSS injetado inline, autocontido)
// ------------------------------------------------------------

let _modalInjetado = false;
let _resolverPendente = null;

function _injetarModal() {
  if (_modalInjetado) return;
  _modalInjetado = true;

  const style = document.createElement('style');
  style.textContent = `
    .auth-modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      display: none; align-items: center; justify-content: center;
      z-index: 99999; backdrop-filter: blur(4px);
    }
    .auth-modal-backdrop.open { display: flex; }
    .auth-modal-box {
      background: #16110b; border: 1px solid rgba(201,168,76,0.4);
      border-radius: 8px; padding: 32px 28px; max-width: 360px;
      width: 90%; text-align: center; font-family: Georgia, serif;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    }
    .auth-modal-title {
      color: #E0C89A; font-size: 13px; letter-spacing: 2px;
      text-transform: uppercase; margin-bottom: 8px;
    }
    .auth-modal-sub {
      color: #C9A84C; opacity: 0.65; font-size: 12px;
      font-style: italic; margin-bottom: 22px; line-height: 1.5;
    }
    .auth-modal-btn-discord {
      display: flex; align-items: center; justify-content: center;
      gap: 10px; width: 100%; background: #5865F2; color: #fff;
      border: none; border-radius: 6px; padding: 12px 18px;
      font-family: Georgia, serif; font-size: 13px; cursor: pointer;
      transition: background 0.2s;
    }
    .auth-modal-btn-discord:hover { background: #4752c4; }
    .auth-modal-btn-cancelar {
      display: block; margin: 14px auto 0; background: none;
      border: none; color: #C9A84C; opacity: 0.6; font-size: 11px;
      letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
      font-family: Georgia, serif;
    }
    .auth-modal-btn-cancelar:hover { opacity: 1; }
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'auth-modal-backdrop';
  backdrop.id = 'authModalBackdrop';
  backdrop.innerHTML = `
    <div class="auth-modal-box">
      <div class="auth-modal-title">✦ Entrar na Forja</div>
      <div class="auth-modal-sub" id="authModalMensagem">Esta ação precisa que você esteja logado.</div>
      <button class="auth-modal-btn-discord" id="authModalBtnDiscord">
        <svg width="18" height="14" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60.1 4.9A58.5 58.5 0 0 0 45.1.3a.2.2 0 0 0-.2.1c-.6 1.2-1.4 2.7-1.9 3.9a54 54 0 0 0-16.3 0c-.5-1.2-1.3-2.7-1.9-3.9a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 9.5 4.9a.2.2 0 0 0-.1.1C1.6 16.5-1 27.8.3 39a.2.2 0 0 0 .1.2 60.4 60.4 0 0 0 18.3 9.3.2.2 0 0 0 .2-.1c1.4-2 2.6-4 3.7-6.2a.2.2 0 0 0-.1-.3 39.6 39.6 0 0 1-5.7-2.7.2.2 0 0 1 0-.4c.4-.3.8-.6 1.1-.8a.2.2 0 0 1 .2 0c12 5.5 25 5.5 36.9 0a.2.2 0 0 1 .2 0c.4.3.7.5 1.1.8a.2.2 0 0 1 0 .4c-1.8 1.1-3.7 1.9-5.7 2.7a.2.2 0 0 0-.1.3c1.1 2.1 2.4 4.2 3.7 6.2a.2.2 0 0 0 .2.1A60.3 60.3 0 0 0 72.6 39a.2.2 0 0 0 .1-.2c1.6-13-2.5-24.3-9.1-33.8a.2.2 0 0 0-.1-.1ZM23.8 32c-3.6 0-6.6-3.3-6.6-7.3s2.9-7.3 6.6-7.3c3.7 0 6.7 3.3 6.6 7.3 0 4-2.9 7.3-6.6 7.3Zm24.2 0c-3.6 0-6.6-3.3-6.6-7.3s2.9-7.3 6.6-7.3c3.7 0 6.6 3.3 6.6 7.3 0 4-2.9 7.3-6.6 7.3Z" fill="white"/></svg>
        Entrar com Discord
      </button>
      <button class="auth-modal-btn-cancelar" id="authModalBtnCancelar">Cancelar</button>
    </div>
  `;
  document.body.appendChild(backdrop);

  document.getElementById('authModalBtnDiscord').onclick = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        // NUNCA usar window.location.href aqui — se o usuário clicar
        // em "Entrar" estando em qualquer página que não seja a raiz
        // (ex: /livros/livros-sistema.html, /fichas/etherion-ficha.html),
        // o Discord devolveria o token pra ESSA página, que pode não
        // ter o SDK Supabase carregado ou ter algum redirect automático
        // que navega pra outro lugar antes do hash #access_token=...
        // ser processado — o token se perde, nunca é salvo no
        // localStorage, e a sessão "logada" só existe em memória por
        // uns segundos antes de sumir. Sempre redirecionamos pra raiz,
        // que é a única página que com certeza tem o auth-supabase.js
        // carregado e não vai navegar pra lugar nenhum antes de processar.
        redirectTo: window.location.origin + '/'
      }
    });
    if (error) {
      document.getElementById('authModalMensagem').textContent = 'Erro ao iniciar login: ' + error.message;
    }
    // Nota: signInWithOAuth navega a página inteira pra fora (redirect
    // de verdade pro Discord) — não há "retorno" de Promise útil aqui.
    // Quando a pessoa voltar autenticada, a página recarrega e
    // onAuthStateChange dispara — exigirLogin() detecta isso na nova
    // carga da página (ver fluxo de retorno mais abaixo).
  };

  document.getElementById('authModalBtnCancelar').onclick = () => {
    _fecharModal();
    if (_resolverPendente) { _resolverPendente(null); _resolverPendente = null; }
  };

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) {
      _fecharModal();
      if (_resolverPendente) { _resolverPendente(null); _resolverPendente = null; }
    }
  });
}

function _abrirModal(mensagem) {
  _injetarModal();
  document.getElementById('authModalMensagem').textContent =
    mensagem || 'Esta ação precisa que você esteja logado.';
  document.getElementById('authModalBackdrop').classList.add('open');
}

function _fecharModal() {
  const el = document.getElementById('authModalBackdrop');
  if (el) el.classList.remove('open');
}

// ------------------------------------------------------------
// Ação pendente — sobrevive ao redirect OAuth
// ------------------------------------------------------------
// Como explicado acima, signInWithOAuth troca a página inteira.
// Pra evitar que cada chamador tenha que reimplementar "salvar o que
// eu ia fazer, recuperar depois que voltar logado", este módulo
// oferece um padrão pronto: salva a INTENÇÃO (nome de uma ação +
// dados) em sessionStorage antes do redirect, e expõe
// consumirAcaoPendente() pra página ler de volta no load seguinte.
//
// Uso típico:
//
//   async function criarCampanha() {
//     const dados = { nome: ..., sistema: ... };
//     const sessao = await exigirLogin(); // pode redirecionar e não voltar nesta carga
//     if (!sessao) return; // cancelou
//     await _criarCampanhaNoSupabase(dados, sessao.user);
//   }
//
//   // Se o usuário cancelar OU já estiver logado, o fluxo acima
//   // funciona normalmente numa Promise só. SE precisar de redirect,
//   // chame guardarAcaoPendente() ANTES de exigirLogin() com os
//   // dados que a função vai precisar depois de voltar, e cheque
//   // consumirAcaoPendente() no carregamento da página:
//
//   window.addEventListener('DOMContentLoaded', async () => {
//     const pendente = consumirAcaoPendente('criarCampanha');
//     if (pendente) await _criarCampanhaNoSupabase(pendente, usuarioLogado());
//   });

export function guardarAcaoPendente(nomeAcao, dados) {
  sessionStorage.setItem('auth_acao_pendente', JSON.stringify({ nomeAcao, dados }));
}

// Lê e REMOVE a ação pendente, se o nome bater (ou se nenhum nome for
// passado, devolve qualquer ação pendente que exista). Retorna null
// se não houver nada — chamadas seguras de fazer sempre no load da
// página, sem precisar checar antes se existe.
export function consumirAcaoPendente(nomeAcao) {
  const raw = sessionStorage.getItem('auth_acao_pendente');
  if (!raw) return null;
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { sessionStorage.removeItem('auth_acao_pendente'); return null; }
  if (nomeAcao && parsed.nomeAcao !== nomeAcao) return null;
  sessionStorage.removeItem('auth_acao_pendente');
  return parsed.dados;
}

// ------------------------------------------------------------
// API pública principal: exigirLogin()
// ------------------------------------------------------------
// Devolve uma Promise que resolve com { user, perfil } se a pessoa
// já está (ou ficou) logada, ou null se cancelou o modal.
//
// IMPORTANTE sobre o fluxo de redirect: signInWithOAuth navega a
// página inteira pro Discord e depois de volta — isso significa que
// a Promise de exigirLogin() NUNCA resolve com sucesso na MESMA
// carga de página em que o botão "Entrar com Discord" foi clicado
// (a página é substituída antes disso poder acontecer). Ela resolve
// null se a pessoa cancelar, ou fica pendente até a navegação.
// Quem chama exigirLogin() deve estruturar a ação como reentrante:
// ao voltar do Discord, a página recarrega, e o código que precisa
// rodar "depois do login" deve rodar de novo nesse load (ver exemplo
// de uso completo no comentário de topo do arquivo e no README).
export async function exigirLogin(mensagem) {
  await aguardarPronto();
  if (_usuarioAtual) {
    return { user: _usuarioAtual, perfil: _perfilAtual };
  }

  return new Promise(resolve => {
    _resolverPendente = resolve;
    _abrirModal(mensagem);
  });
}

export async function logout() {
  await supabase.auth.signOut();
  _usuarioAtual = null;
  _perfilAtual = null;
  _notificarOuvintes();
}

// Dispara a checagem de sessão imediatamente ao importar o módulo,
// pra páginas que só querem ler usuarioLogado() de forma síncrona
// o quanto antes (ex: mostrar/escoder um botão "Sair" no header).
aguardarPronto();
