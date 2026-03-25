// LES TEVES 14 IMATGES amb les seves parelles
// DOS ARRAYS: frases i conceptes
const parella_frase = [
  { imatge: "Imatges/02.png" },
  { imatge: "Imatges/03.png" },
  { imatge: "Imatges/05.png" },
  { imatge: "Imatges/08.png" },
  { imatge: "Imatges/10.png" },
  { imatge: "Imatges/11.png" },
  { imatge: "Imatges/14.png" }
];

const parella_concepte = [
  { imatge: "Imatges/01.png" },
  { imatge: "Imatges/04.png" },
  { imatge: "Imatges/06.png" },
  { imatge: "Imatges/07.png" },
  { imatge: "Imatges/09.png" },
  { imatge: "Imatges/12.png" },
  { imatge: "Imatges/13.png" }
];

// Carta del darrere (inici)
const imatgeDors = "Imatges/dors.png";

let cartesGirades = []; 
let cartesEmparellades = [];
let bloquejat = false;

// Barrejar les cartes 
function barrejar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Crear tauler 
function iniciarJoc() {
  const tauler = document.getElementById('tauler');
  const victoria = document.getElementById('victoria');
  
  tauler.innerHTML = '';
  victoria.classList.remove('mostrar');
  cartesGirades = [];
  cartesEmparellades = [];
  bloquejat = false;

  const todesLesCartes = [
    ...parella_frase.map((c, i) => ({ ...c, indexParella: i, tipus: 'frase' })),
    ...parella_concepte.map((c, i) => ({ ...c, indexParella: i, tipus: 'concepte' }))
  ];

  const cartesBarrejades = barrejar([...todesLesCartes]);

  cartesBarrejades.forEach((carta, index) => {
    const divCarta = document.createElement('div');
    divCarta.className = 'carta';
    divCarta.dataset.imatge = carta.imatge;
    divCarta.dataset.indexParella = carta.indexParella;
    divCarta.dataset.tipus = carta.tipus;
    divCarta.dataset.index = index;
    
    divCarta.innerHTML = `
      <div class="carta-interior">
        <div class="cara dors">
          <img src="${imatgeDors}" alt="Dors">
        </div>
        <div class="cara davant">
          <img src="${carta.imatge}" alt="Carta ${index + 1}">
        </div>
      </div>
    `;

    divCarta.addEventListener('click', girarCarta);
    tauler.appendChild(divCarta);
  });
}

// GIRAR CARTA
function girarCarta() {
  if (bloquejat) return;
  if (this.classList.contains('girada')) return;
  if (this.classList.contains('emparellada')) return;

  this.classList.add('girada');
  cartesGirades.push(this);

  if (cartesGirades.length === 2) {
    comprovarParella();
  }
}

// COMPROVAR SI FAN PARELLA
function comprovarParella() {
  bloquejat = true;
  const [carta1, carta2] = cartesGirades;
  const parella1 = carta1.dataset.indexParella;
  const parella2 = carta2.dataset.indexParella;
  const tipus1 = carta1.dataset.tipus;
  const tipus2 = carta2.dataset.tipus;

  if (parella1 === parella2 && tipus1 !== tipus2) {
    const cartaFrase = [carta1, carta2].find(c => c.dataset.tipus === 'frase');
    const cartaConcepte = [carta1, carta2].find(c => c.dataset.tipus === 'concepte');

    document.getElementById('cartaParella1').src = cartaFrase.dataset.imatge;
    document.getElementById('cartaParella2').src = cartaConcepte.dataset.imatge;
    document.getElementById('overlayParella').classList.add('mostrar');

    // Funció que tanca l'overlay i continua el joc
    function tancarOverlay() {
      clearTimeout(temporizadorOverlay);
      document.getElementById('overlayParella').classList.remove('mostrar');
      document.getElementById('overlayParella').removeEventListener('click', tancarOverlay);

      carta1.classList.add('emparellada');
      carta2.classList.add('emparellada');
      carta1.style.visibility = 'hidden';
      carta2.style.visibility = 'hidden';

      cartesEmparellades.push(carta1, carta2);
      cartesGirades = [];
      bloquejat = false;

      if (cartesEmparellades.length === parella_frase.length + parella_concepte.length) {
        setTimeout(() => mostrarVictoria(), 10);
      }
    }

    // Opció 1: clic a l'overlay
    document.getElementById('overlayParella').addEventListener('click', tancarOverlay);

    // Opció 2: passats 5 segons automàticament
    const temporizadorOverlay = setTimeout(tancarOverlay, 5000);

  } else {
    carta1.classList.add('error');
    carta2.classList.add('error');
    
    // Mostrar "No és correcte"
    const overlayError = document.getElementById('overlayError');
    overlayError.textContent = 'No és correcte';
    overlayError.classList.add('mostrar');

    setTimeout(() => {
      carta1.classList.remove('girada', 'error');
      carta2.classList.remove('girada', 'error');
      cartesGirades = [];
      bloquejat = false;
      overlayError.classList.remove('mostrar');
    }, 1500);
  }
}

// MOSTRAR PANTALLA DE VICTÒRIA AMB TOTES LES CARTES
function mostrarVictoria() {
  const victoria = document.getElementById('victoria');
  const taulerFinal = document.getElementById('tauler-final');
  
  taulerFinal.innerHTML = '';
  
  // FILA 1: parella_concepte
  for (let i = 0; i < parella_frase.length; i++) {
    const divCarta = document.createElement('div');
    divCarta.className = 'carta';
    divCarta.innerHTML = `<img src="${parella_frase[i].imatge}" alt="Frase ${i + 1}">`;
    taulerFinal.appendChild(divCarta);
  }

  // FILA 2: parella_frase
  for (let i = 0; i < parella_concepte.length; i++) {
    const divCarta = document.createElement('div');
    divCarta.className = 'carta';
    divCarta.innerHTML = `<img src="${parella_concepte[i].imatge}" alt="Concepte ${i + 1}">`;
    taulerFinal.appendChild(divCarta);
  }
    
  victoria.classList.add('mostrar');
}

// INICIAR JOC EN FER CLICK A LA PANTALLA
// PANTALLA D'INICI
const pantallaInici = document.getElementById('pantallaStandby');

pantallaInici.addEventListener('click', () => {
  pantallaInici.classList.add('amagar');
  document.body.classList.remove('joc-no-iniciat');
  iniciarJoc();
});

// TEMPORITZADOR D'INACTIVITAT (1 minut)
let temporizadorInactivitat;
const TEMPS_INACTIVITAT = 300000; // 5 minuts

function reiniciarTemporizador() {
  clearTimeout(temporizadorInactivitat);
  temporizadorInactivitat = setTimeout(tornarAInici, TEMPS_INACTIVITAT);
}

function tornarAInici() {
  // Mostrar pantalla d'inici
  document.getElementById('pantallaStandby').classList.remove('amagar');
  document.body.classList.add('joc-no-iniciat');
  
  // Amagar pantalla de victòria si està visible
  document.getElementById('victoria').classList.remove('mostrar');
  
  // Reiniciar variables del joc
  cartesGirades = [];
  cartesEmparellades = [];
  bloquejat = false;
}

// Detectar activitat (clics, tocs, moviment)
document.addEventListener('click', reiniciarTemporizador);
document.addEventListener('touchstart', reiniciarTemporizador);
document.addEventListener('mousemove', reiniciarTemporizador);

// Iniciar el temporizador quan comenci el joc
const pantallaIniciOriginal = pantallaInici.addEventListener;
pantallaInici.addEventListener('click', () => {
  pantallaInici.classList.add('amagar');
  document.body.classList.remove('joc-no-iniciat');
  iniciarJoc();
  reiniciarTemporizador(); // Iniciar temporizador
});