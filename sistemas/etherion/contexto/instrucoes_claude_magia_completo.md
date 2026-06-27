# Diretrizes de Codificação para Claude 3.5 Sonnet: Sistema de Magia Modular
**Contexto do Sistema:** RPG Aetherion (Fantasia Sombria / Horror Cósmico)
**Escopo do Site:** A interface é estritamente uma **Ficha Digital Interativa**. O site NÃO gerencia o combate automaticamente, não rastreia turnos e não rola testes de concentração automáticos por dano. Toda a automação se limita a: calcular custos de recursos, definir perícias de conjuração, renderizar a descrição dinâmica das magias criadas e armazenar o Grimório do jogador. O controle de regras e estado do jogo pertence ao Mestre e aos jogadores.

---

## 1. Arquitetura de Dados: O Banco de Dados Combinatório (`magias.js`)

O arquivo deve exportar um objeto literal padrão chamado `sistemaMagia` contendo as três camadas puras. Toda a matemática de escalonamento deve ser tratada via funções que recebem o `circulo` (1 a 10).

### A. Os 15 Aspectos Divinos e Primais
Cada aspecto define a perícia utilizada, o tipo de recurso consumido (Sopro para Trilha Pura, Mácula para Trilha Corrompida) e o elemento/efeito base narrativo.
1. `sopro_archeon`: Perícia `sintonia` | Recurso `sopro` | Força pura, escudos de energia mística.
2. `sol_pyrael`: Perícia `sintonia` ou `intimidacao` | Recurso `sopro` | Fogo solar, derreter defesas, condição Queimado.
3. `lua_nyxara`: Perícia `percepcao` ou `furtividade` | Recurso `sopro` | Clarividência, revelação de mapa, controle mental sutil.
4. `tempo_khairos`: Perícia `arcanismo` ou `legado` | Recurso `sopro` | Manipulação de iniciativa, aceleração/desaceleração de ações.
5. `saber_aethrys`: Perícia `tradicao` ou `investigacao` | Recurso `sopro` | Contramágica, silenciar conjuradores, decifrar runas.
6. `vida_elyssera`: Perícia `socorrismo` ou `adestramento` | Recurso `sopro` | Cura biológica na carne, mutações físicas benéficas.
7. `terra_maelthra`: Perícia `fortitude` ou `artificio` | Recurso `sopro` | Paredes de pedra, abalos táteis, bônus brutos de Defesa Física.
8. `caos_zyrhun`: Perícia `ocultismo` | Recurso `macula` | Dano corrosivo, mutações instáveis de alto risco.
9. `trovao_karyon`: Perícia `atletismo` ou `intimidacao` | Recurso `sopro` | Dano de eletricidade, empurrar alvos no mapa, Atordoamento.
10. `oceanos_neryth`: Perícia `adaptacao` ou `exploracao` | Recurso `sopro` | Dano de impacto aquático, terrenos lentos (inundação), purificação.
11. `beleza_lyrea`: Perícia `diplomacia` ou `enganacao` | Recurso `sopro` | Encantamento, fascinar inimigos, névoas hipnóticas, espelhos de ilusão.
12. `ordem_ordelyne`: Perícia `tatica` ou `vontade` | Recurso `sopro` | Dano radiante, dissipar ilusões, punição luminosa reativa.
13. `morte_morvethra`: Perícia `vontade` | Recurso `macula` | Dano necrótico, dreno de vida, negação de cura biológica.
14. `trevas_kharvion`: Perícia `malandragem` ou `ocultismo` | Recurso `macula` | Zonas de escuridão mágica total, cegueira, dreno de Sanidade.
15. `teia_mabryth`: Perícia `ladinagem` ou `ocultismo` | Recurso `macula` | Restrição de movimentos, fios de destino venenosos, controle de pragas.

### B. Os 9 Verbos (Ação e Custo Base)
Cada verbo dita o multiplicador numérico ou efeito base da ação.
- `manifestar`: Custo Base 1 | Dano/Cura equilibrada de alvo único (Fórmula: `circulo`d6).
- `alterar`: Custo Base 2 | Buffs/Debuffs estruturais de atributos na ficha.
- `vincular`: Custo Base 1 | Aplica condições de restrição física (Agarrado, Caído).
- `selar`: Custo Base 2 | Aprisionamento místico, trancar portões do Véu ou habilidades.
- `destruir`: Custo Base 2 | Dano massivo em área explosiva (Fórmula: `circulo`d10).
- `invocar`: Custo Base 3 | Cria um lacaio/construto em campo com PV = `circulo * 10`.
- `cortar`: Custo Base 1 | Projéteis ou lâminas de vácuo puro (Fórmula: `circulo`d8, ignora RD mundana).
- `proteger`: Custo Base 1 | Gera Escudo Místico ou absorção de dano (Fórmula: `circulo`d6 em PV Temporários - Não Acumulativo).
- `deslocar`: Custo Base 2 | Teletransporte, vetor de empurrão ou puxada tática no mapa.

### C. Os 7 Modificadores (Forma, Alcance e Impostos)
Altera a área ou comportamento da conjuração na ficha.
- `direcionado`: Custo +0 | Alvo único, alcance curto.
- `caotico`: Custo +2 | Dispersão imprevisível, chance de ricochetear.
- `continuo`: Custo +3 | Duração sustentada por rodadas (Limitado a exatamente 3 rodadas ou igual ao `circulo` injetado, o que for menor. Exige gasto de Ação Bônus do jogador mantido em mesa).
- `fragmentado`: Custo +1 | Divide o efeito bruto entre múltiplos alvos menores.
- `estavel`: Custo +1 | Garante alcance longo e elimina riscos ambientais mundanos.
- `espelhado`: Custo +2 | Duplica o ponto de origem através de um clone ilusório/cópia.
- `latente`: Custo +2 | Transforma a magia em uma armadilha tática de gatilho em quadrado do mapa.

---

## 2. Regras Lógicas da Engine (`engine.js`)

Claude, implemente estas três regras matemáticas cruciais que governam a progressão de Aetherion do nível 1 ao 50 dentro do motor de cálculos:

### A. Fórmulas de Custo e Escalonamento
A fórmula de cálculo de custos na ficha deve ser estritamente:
$$	ext{Custo Final} = (	ext{Custo Base do Verbo} 	imes 	ext{Círculo Injetado}) + 	ext{Custo do Modificador}$$
* O site deve subtrair esse valor do recurso correspondente do Aspecto (Sopro ou Mácula) quando o jogador clicar em "Conjurar".

### B. Progressão de Limites Máximos (Nível 1 ao 50)
A engine deve calcular os tetos dinâmicos de recursos da ficha baseando-se no nível atual do personagem:
- **Limite de Sopro:** $	ext{Base (3)} + 	ext{Modificador de Atributo de Foco da Classe} + 	ext{Math.floor(Nível / 2)}$
- **Limite de Mácula:** $	ext{Base (12)} + (	ext{Math.floor(Nível / 5)} 	imes 2)$

### C. Trava de Sintonização (O Limite do Grimório Ativo)
A interface deve impedir o jogador de ter magias prontas excessivas equipadas na aba de ações rápidas. O teto de slots ativos na ficha obedece à fórmula:
$$	ext{Slots de Grimório Equipados} = 	ext{Nível do Personagem} + 	ext{Math.max(Modificador de INT, Modificador de SAB)}$$

---

## 3. Formato de Saída Esperado
Gere o arquivo `magias.js` contendo o mapeamento completo e limpo por extenso das strings de texto de lore e dos modificadores numéricos explicados, pronto para ser lido pela interface de criação de receitas mágicas.
