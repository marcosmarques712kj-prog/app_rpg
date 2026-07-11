// =============================================================
// TESTE RÁPIDO — Valida que os dois sistemas funcionam corretamente
// =============================================================

// Carregar os dois sistemas
const desarmado = require('./combateDesarmado.js');
const armado = require('./combateArmado.js');

let erros = 0;
let testes = 0;

function assert(condicao, mensagem) {
  testes++;
  if (!condicao) {
    erros++;
    console.error(`  ✗ FALHOU: ${mensagem}`);
  }
}

// ===========================================================
// 1. TESTE DE ESTRUTURA — combateDesarmado.js
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  COMBATE DESARMADO — Testes de Estrutura');
console.log('═══════════════════════════════════════════');

const viaIds = Object.keys(desarmado.vias);
const impulsoIds = Object.keys(desarmado.impulsos);
const posturaIds = Object.keys(desarmado.posturas);
const nivelIds = Object.keys(desarmado.niveisSopro);

console.log(`  Vias: ${viaIds.length} (esperado 6)`);
assert(viaIds.length === 6, 'Deve ter exatamente 6 Vias');

console.log(`  Impulsos: ${impulsoIds.length} (esperado 5)`);
assert(impulsoIds.length === 5, 'Deve ter exatamente 5 Impulsos');

console.log(`  Posturas: ${posturaIds.length} (esperado 8)`);
assert(posturaIds.length === 8, 'Deve ter exatamente 8 Posturas');

console.log(`  Níveis Sopro: ${nivelIds.length} (esperado 3)`);
assert(nivelIds.length === 3, 'Deve ter exatamente 3 níveis de Sopro');

// Verificar que todas as Vias têm os campos obrigatórios
for (const id of viaIds) {
  const via = desarmado.vias[id];
  assert(via.nome, `Via ${id}: falta nome`);
  assert(via.dadoBase, `Via ${id}: falta dadoBase`);
  assert(via.mecanicaExclusiva, `Via ${id}: falta mecanicaExclusiva`);
  assert(via.template, `Via ${id}: falta template`);
  for (const imp of impulsoIds) {
    assert(via.template[imp], `Via ${id}: falta template.${imp}`);
  }
}

// ===========================================================
// 2. TESTE DE GERAÇÃO COMBINATÓRIA — todas as 720 combinações
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  COMBATE DESARMADO — Geração Combinatória');
console.log('═══════════════════════════════════════════');

let combinacoesDesarmado = 0;
let errosDesarmado = 0;

for (const viaId of viaIds) {
  for (const impulsoId of impulsoIds) {
    for (const posturaId of posturaIds) {
      for (const nivelId of nivelIds) {
        combinacoesDesarmado++;
        const tecnica = desarmado.gerarTecnica(viaId, impulsoId, posturaId, nivelId);
        if (tecnica.erro) {
          errosDesarmado++;
          console.error(`  ✗ ${viaId}+${impulsoId}+${posturaId}+${nivelId}: ${tecnica.erro}`);
        }
        // Verificar que custo nunca é NaN
        assert(!isNaN(tecnica.custoFinal), `${viaId}+${impulsoId}+${posturaId}: custoFinal é NaN`);
      }
    }
  }
}

console.log(`  Total combinações: ${combinacoesDesarmado} (esperado 720)`);
assert(combinacoesDesarmado === 720, 'Devem existir exatamente 720 combinações');
console.log(`  Erros de geração: ${errosDesarmado}`);
assert(errosDesarmado === 0, 'Nenhuma combinação deve gerar erro');

// ===========================================================
// 3. TESTE DE CUSTO — Regra de Ouro
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  COMBATE DESARMADO — Regra de Ouro');
console.log('═══════════════════════════════════════════');

// A técnica mais barata (custo 0) nunca deve ter dado d10+
const custoZero = [];
for (const viaId of viaIds) {
  for (const impulsoId of impulsoIds) {
    for (const posturaId of posturaIds) {
      const custo = desarmado.calcularCusto(viaId, impulsoId, posturaId, 'curto');
      if (custo === 0) {
        const dado = desarmado.resolverDado(viaId, impulsoId, posturaId);
        custoZero.push({ viaId, impulsoId, posturaId, dado: dado ? dado.dado : null });
      }
    }
  }
}

console.log(`  Combinações com custo 0 (Sopro Curto): ${custoZero.length}`);
for (const combo of custoZero) {
  const violacao = combo.dado && (combo.dado === 'd10' || combo.dado === 'd12');
  if (violacao) {
    console.error(`  ✗ VIOLAÇÃO: ${combo.viaId}+${combo.impulsoId}+${combo.posturaId} = custo 0 com ${combo.dado}`);
  }
  assert(!violacao, `Custo 0 com dado alto: ${combo.viaId}+${combo.impulsoId}+${combo.posturaId}`);
}

// A técnica mais cara (Sopro Pleno)
const maisCara = desarmado.calcularCusto('punhoVivo', 'prender', 'sacrificial', 'pleno');
console.log(`  Custo mais alto (Punho Vivo+Prender+Sacrificial+Pleno): ${maisCara}`);
assert(maisCara > 0, 'Técnica mais cara deve ter custo > 0');

// ===========================================================
// 4. TESTE DE ESTRUTURA — combateArmado.js
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  COMBATE ARMADO — Testes de Estrutura');
console.log('═══════════════════════════════════════════');

const catIds = Object.keys(armado.categorias);
const acaoIds = Object.keys(armado.acoes);
const posturaIdsArmado = Object.keys(armado.posturas);
const espIds = Object.keys(armado.especializacoes);

console.log(`  Categorias: ${catIds.length} (esperado 8)`);
assert(catIds.length === 8, 'Deve ter exatamente 8 Categorias');

console.log(`  Ações: ${acaoIds.length} (esperado 5)`);
assert(acaoIds.length === 5, 'Deve ter exatamente 5 Ações');

console.log(`  Posturas: ${posturaIdsArmado.length} (esperado 8)`);
assert(posturaIdsArmado.length === 8, 'Deve ter exatamente 8 Posturas');

console.log(`  Especializações: ${espIds.length} (esperado 16)`);
assert(espIds.length === 16, 'Deve ter exatamente 16 Especializações');

// Verificar 2 especializações por categoria
for (const catId of catIds) {
  const espsDestaCategoria = espIds.filter(id => armado.especializacoes[id].categoria === catId);
  console.log(`    ${catId}: ${espsDestaCategoria.length} especializações`);
  assert(espsDestaCategoria.length === 2, `${catId} deve ter exatamente 2 especializações`);
}

// ===========================================================
// 5. TESTE DE GERAÇÃO COMBINATÓRIA — combateArmado.js
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  COMBATE ARMADO — Geração Combinatória');
console.log('═══════════════════════════════════════════');

let combinacoesArmado = 0;
let errosArmado = 0;

for (const catId of catIds) {
  for (const acaoId of acaoIds) {
    for (const posturaId of posturaIdsArmado) {
      for (const nivelId of nivelIds) {
        combinacoesArmado++;
        const tecnica = armado.gerarTecnicaArmada(catId, acaoId, posturaId, null, nivelId);
        if (tecnica.erro) {
          errosArmado++;
          console.error(`  ✗ ${catId}+${acaoId}+${posturaId}+${nivelId}: ${tecnica.erro}`);
        }
        assert(!isNaN(tecnica.custoFinal), `${catId}+${acaoId}+${posturaId}: custoFinal é NaN`);
      }
    }
  }
}

console.log(`  Total combinações (sem especialização): ${combinacoesArmado} (esperado 960)`);
assert(combinacoesArmado === 960, 'Devem existir 960 combinações base (8×5×8×3)');
console.log(`  Erros de geração: ${errosArmado}`);
assert(errosArmado === 0, 'Nenhuma combinação deve gerar erro');

// ===========================================================
// 6. TESTE DE EXEMPLO — Reproduzir técnicas do documento
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  EXEMPLOS DE TÉCNICAS');
console.log('═══════════════════════════════════════════');

// Desarmado: "Golpe do Último Fôlego" — Punho Vivo + Romper + Cheia + Pleno
const golpeUltimoFolego = desarmado.gerarTecnica('punhoVivo', 'romper', 'cheia', 'pleno');
console.log(`\n  ► ${golpeUltimoFolego.nomeVia} + ${golpeUltimoFolego.nomeImpulso} + ${golpeUltimoFolego.nomePostura}`);
console.log(`    Custo: ${golpeUltimoFolego.custoFinal} Sopro (${golpeUltimoFolego.nivelSopro})`);
console.log(`    Dado: ${golpeUltimoFolego.quantidadeDados || 0}${golpeUltimoFolego.dadoResolvido || 'N/A'}`);
console.log(`    Mecânica: ${golpeUltimoFolego.mecanicaExclusiva ? golpeUltimoFolego.mecanicaExclusiva.nome : 'N/A'}`);

// Desarmado: "Resposta do Espelho" — Eco + Desviar + Curva + Sustentado
const respostaEspelho = desarmado.gerarTecnica('eco', 'desviar', 'curva', 'sustentado');
console.log(`\n  ► ${respostaEspelho.nomeVia} + ${respostaEspelho.nomeImpulso} + ${respostaEspelho.nomePostura}`);
console.log(`    Custo: ${respostaEspelho.custoFinal} Sopro (${respostaEspelho.nivelSopro})`);
console.log(`    Mecânica: ${respostaEspelho.mecanicaExclusiva ? respostaEspelho.mecanicaExclusiva.nome : 'N/A'}`);

// Armado: Espada + Desviar + Vazia + Sustentado
const espadaDesviar = armado.gerarTecnicaArmada('espadas', 'desviar', 'vazia', null, 'sustentado');
console.log(`\n  ► ${espadaDesviar.nomeCategoria} + ${espadaDesviar.nomeAcao} + ${espadaDesviar.nomePostura}`);
console.log(`    Custo: ${espadaDesviar.custoFinal} Sopro (${espadaDesviar.nivelSopro})`);
console.log(`    Mecânica: ${espadaDesviar.mecanicaExclusiva ? espadaDesviar.mecanicaExclusiva.nome : 'N/A'}`);

// Armado: Machado + Romper + Cheia + Pleno + Arco Largo
const machadoPleno = armado.gerarTecnicaArmada('machados', 'romper', 'cheia', 'arcoLargo', 'pleno');
console.log(`\n  ► ${machadoPleno.nomeCategoria} + ${machadoPleno.nomeAcao} + ${machadoPleno.nomePostura} + ${machadoPleno.especializacao ? machadoPleno.especializacao.nome : 'sem esp.'}`);
console.log(`    Custo: ${machadoPleno.custoFinal} Sopro (${machadoPleno.nivelSopro})`);
console.log(`    Dado: ${machadoPleno.quantidadeDados || 0}${machadoPleno.dadoResolvido || 'N/A'}`);

// ===========================================================
// RESUMO FINAL
// ===========================================================
console.log('\n═══════════════════════════════════════════');
console.log('  RESUMO');
console.log('═══════════════════════════════════════════');
console.log(`  Total de testes: ${testes}`);
console.log(`  Testes passaram: ${testes - erros}`);
console.log(`  Testes falharam: ${erros}`);
console.log(`  Combinações desarmado: ${combinacoesDesarmado}`);
console.log(`  Combinações armado: ${combinacoesArmado}`);
console.log(`  Total de técnicas possíveis: ${combinacoesDesarmado + combinacoesArmado}`);

if (erros === 0) {
  console.log('\n  ✓ TODOS OS TESTES PASSARAM!\n');
} else {
  console.log(`\n  ✗ ${erros} TESTES FALHARAM!\n`);
}

process.exit(erros > 0 ? 1 : 0);
