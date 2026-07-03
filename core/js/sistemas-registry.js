(function () {
  const SISTEMAS = [
    {
      id: 'dnd5e',
      pasta: 'dnd5e',
      nome: 'D&D 5e',
      desc: 'Dungeons & Dragons 5a Edicao - o sistema de fantasia medieval mais jogado do mundo.',
      icon: 'D&D',
      img: '/assets/icons/dnd.png',
      cor: '#C9A84C',
      corBg: 'rgba(201,168,76,0.08)',
      ficha: '/sistemas/dnd5e/ficha/ficha.html',
      urlCampanha: '/sistemas/dnd5e/campanha/campanha.html',
      mesa: '/sistemas/dnd5e/mesa/mesa.html',
      hub: '/features/livros/sistema-hub.html?sys=dnd5e',
      disponivel: false,
      campos: [
        { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Barbaro','Bardo','Clerigo','Druida','Feiticeiro','Guerreiro','Ladino','Mago','Monge','Paladino','Ranger','Bruxo'] },
        { id: 'race', label: 'Raca', tipo: 'select', opcoes: ['Humano','Elfo','Anao','Halfling','Gnomo','Meio-Orc','Meio-Elfo','Tiefling','Draconato','Outro'] },
        { id: 'level', label: 'Nivel', tipo: 'number', min: 1, max: 20, default: 1 },
        { id: 'align', label: 'Alinhamento', tipo: 'select', opcoes: ['Leal Bom','Neutro Bom','Caotico Bom','Leal Neutro','Neutro','Caotico Neutro','Leal Mau','Neutro Mau','Caotico Mau'] }
      ]
    },
    {
      id: 'op',
      pasta: 'ordem_paranormal',
      nome: 'Ordem Paranormal',
      desc: 'Horror investigativo com agentes que enfrentam o paranormal. NEX, rituais e sanidade.',
      icon: 'OP',
      img: '/assets/icons/op.png',
      cor: '#1BBFB5',
      corBg: 'rgba(27,191,181,0.08)',
      ficha: '/sistemas/ordem_paranormal/ficha/ficha.html',
      urlCampanha: '/sistemas/ordem_paranormal/campanha/campanha.html',
      hub: '/features/livros/sistema-hub.html?sys=op',
      disponivel: false,
      campos: [
        { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Combatente','Especialista','Ocultista'] },
        { id: 'origem', label: 'Origem', tipo: 'select', opcoes: ['Academico','Amnesico','Artista','Atleta','Crianca Prodigio','Detetive','Enfermeiro','Engenheiro','Executivo','Jornalista','Lider Comunitario','Lutador','Medico','Militar','Ocultista','Policial','Refugiado','Religioso','Servidor Publico','Tecnico'] },
        { id: 'nex', label: 'NEX Inicial (%)', tipo: 'number', min: 5, max: 95, default: 5 }
      ]
    },
    {
      id: 'tormenta',
      pasta: 'tormenta20',
      nome: 'Tormenta 20',
      desc: 'Fantasy epico brasileiro. Sistema d20 com racas e classes unicas do cenario de Arton.',
      icon: 'T20',
      img: '/assets/icons/tmt.png',
      cor: '#C45A10',
      corBg: 'rgba(196,90,16,0.08)',
      ficha: '/core/ficha/ficha.html',
      urlCampanha: '/sistemas/tormenta20/campanha/campanha.html',
      hub: '/features/livros/sistema-hub.html?sys=tormenta',
      disponivel: false,
      campos: [
        { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Arcanista','Barbaro','Bardo','Bucaneiro','Cacador','Cavaleiro','Clerigo','Druida','Guerreiro','Inventor','Ladino','Lutador','Nobre','Paladino'] },
        { id: 'race', label: 'Raca', tipo: 'select', opcoes: ['Humano','Elfo','Anao','Halfling','Gnomo','Goblin','Lefou','Minotauro','Qareen','Sereia/Tritao','Silfide','Suraggel','Tigrino'] },
        { id: 'level', label: 'Nivel', tipo: 'number', min: 1, max: 20, default: 1 }
      ]
    },
    {
      id: 'etherion',
      pasta: 'etherion',
      nome: 'Etherion',
      desc: 'Sistema heroico de alto poder - aventura classica, exploracao de ruinas e vida de mercenarios em um mundo magico com horrores antigos.',
      icon: 'ETH',
      img: '/assets/icons/eth.png',
      cor: '#9B6FD4',
      corBg: 'rgba(155,111,212,0.08)',
      ficha: '/sistemas/etherion/ficha/ficha.html',
      urlCampanha: '/sistemas/etherion/campanha/campanha.html',
      hub: '/features/livros/sistema-hub.html?sys=etherion',
      disponivel: true,
      campos: [
        { id: 'cls', label: 'Classe', tipo: 'select', opcoes: ['Guerreiro','Paladino','Ranger','Ladino','Mago','Feiticeiro','Clerigo','Druida','Bardo','Monge','Mercenario','Explorador','Outro'] },
        { id: 'race', label: 'Raca', tipo: 'select', opcoes: ['Humano','Elfo','Elfo das Sombras','Anao','Halfling','Orken','Zirkin','Draconato','Tiefling','Aasimar','Feerico','Outro'] },
        { id: 'level', label: 'Nivel', tipo: 'number', min: 1, max: 20, default: 1 }
      ]
    }
  ];

  window.SISTEMAS = SISTEMAS;
  window.getSistema = function getSistema(id) {
    return SISTEMAS.find(s => s.id === id) || null;
  };
}());
