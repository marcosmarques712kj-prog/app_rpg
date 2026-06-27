// engine.js — Aetherion RPG System
// Motor de Cálculos Automatizados da Ficha Digital

import classesRPG from './classes.js';
import origensRPG from './origens.js';

const AetherionEngine = {
  /**
   * 1. CÁLCULO DE MODIFICADOR (Matemática Achatada de Aetherion)
   * Baseado na regra do sistema: Math.floor(Atributo / 2)
   */
  calcularModificador(valorAtributo) {
    if (!valorAtributo || valorAtributo < 0) return 0;
    return Math.floor(valorAtributo / 2);
  },

  /**
   * 2. CÁLCULO DE PONTOS DE VIDA (HP) MÁXIMO
   * Fórmula: HP Inicial + Modificador de COS + (HP por Nível * (Nível - 1))
   */
  calcularHPMaximo(classeChave, valorCos, nivel = 1) {
    const classe = classesRPG[classeChave];
    if (!classe) return 0;

    const modCos = this.calcularModificador(valorCos);
    const hpBase = classe.hpInicial + modCos;
    const hpNiveisExtras = classe.hpPorNivel * (nivel - 1);

    return hpBase + hpNiveisExtras;
  },

  /**
   * 3. CÁLCULO DO LIMIAR DE TRAUMA
   * Fórmula Base: 5 + Modificador de COS
   * Regra Especial: Vanguarda possui a passiva 'Carne Firme/Corpo de Aço', aumentando a base para 7.
   */
  calcularLimiarTrauma(classeChave, valorCos) {
    const modCos = this.calcularModificador(valorCos);
    const base = (classeChave === 'vanguarda') ? 7 : 5;
    return base + modCos;
  },

  /**
   * 4. CÁLCULO DE DEFESA FÍSICA E MÍSTICA
   * Defesa Física Base: 10 + Modificador de AGI + Bônus de Armadura
   * Defesa Mística Base: 10 + Modificador de SAB ou INT (O que for maior no místico)
   */
  calcularDefesas(valorAgi, valorSab, valorInt, bonusArmaduraFisica = 0) {
    const modAgi = this.calcularModificador(valorAgi);
    const modSab = this.calcularModificador(valorSab);
    const modInt = this.calcularModificador(valorInt);

    return {
      defesaFisica: 10 + modAgi + bonusArmaduraFisica,
      defesaMistica: 10 + Math.max(modSab, modInt)
    };
  },

  /**
   * 5. CÁLCULO DE SANIDADE MÁXIMA (Sistema de Horror)
   * Fórmula: 10 + Modificador de VONTADE (atrelado à Sabedoria)
   */
  calcularSanidadeMaxima(valorSab) {
    const modSab = this.calcularModificador(valorSab);
    return 10 + modSab;
  },

  /**
   * 6. CÁLCULO DA MARGEM DE SOPRO DA CRIAÇÃO
   * Fórmula: 3 + Modificador do Atributo de Foco da Classe
   */
  calcularSoproMaximo(classeChave, atributosBrutos) {
    const classe = classesRPG[classeChave];
    if (!classe) return 0;

    const atributoFoco = classe.atributoFoco; // ex: 'for', 'agi', 'int'
    const valorAtributo = atributosBrutos[atributoFoco] || 0;
    const modFoco = this.calcularModificador(valorAtributo);

    return 3 + modFoco;
  },

  /**
   * 7. MARGEM DE MÁCULA DO ABISMO (Estática)
   * Regra do Cenário: O limite absoluto antes do colapso/surto é sempre 12.
   */
  calcularMaculaMaxima() {
    return 12;
  },

  /**
   * 8. COMPILADOR COMPLETO DA FICHA (Retorna tudo mastigado para o Frontend)
   * Recebe o estado atual da ficha do jogador e processa todos os status de uma vez.
   */
  processarFichaCompleta(dadosJogador) {
    const { classe, origem, nivel, atributos, bonusEquipamento } = dadosJogador;
    
    const defesas = this.calcularDefenses(
      atributos.agi, 
      atributos.sab, 
      atributos.int, 
      bonusEquipamento?.armadura || 0
    );

    return {
      hpMax: this.calcularHPMaximo(classe, atributos.cos, nivel),
      limiarTrauma: this.calcularLimiarTrauma(classe, atributos.cos),
      defesaFisica: defesas.defesaFisica,
      defesaMistica: defesas.defesaMistica,
      sanidadeMax: this.calcularSanidadeMaxima(atributos.sab),
      soproMax: this.calcularSoproMaximo(classe, atributos),
      maculaMax: this.calcularMaculaMaxima()
    };
  }
};

export default AetherionEngine;