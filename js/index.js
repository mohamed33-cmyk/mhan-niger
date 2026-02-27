// ════════════════════════════════════════
// MHAN-Niger — index.js
// Scripts de la page d'accueil
// ════════════════════════════════════════

// ── 1. EFFET TYPING ──
const textes = [
  'commence ici.',
  'c\'est MHAN-Niger.',
  'c\'est maintenant.',
  'c\'est pour vous.'
];

let indexTexte = 0;
let indexCaractere = 0;
let enEcriture = true;
const elementTyping = document.getElementById('texte-typing');

function taper() {
  const texteActuel = textes[indexTexte];

  if (enEcriture) {
    elementTyping.textContent = texteActuel.slice(0, indexCaractere + 1);
    indexCaractere++;
    if (indexCaractere === texteActuel.length) {
      enEcriture = false;
      setTimeout(taper, 2000);
      return;
    }
  } else {
    elementTyping.textContent = texteActuel.slice(0, indexCaractere - 1);
    indexCaractere--;
    if (indexCaractere === 0) {
      enEcriture = true;
      indexTexte = (indexTexte + 1) % textes.length;
    }
  }
  setTimeout(taper, enEcriture ? 80 : 40);
}

taper();


// ── 2. EFFET PARTICULES ──
const canvas = document.getElementById('canvas-particules');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particules = [];
const NOMBRE_PARTICULES = 80;

class Particule {
  constructor() {
    this.reinitialiser();
  }

  reinitialiser() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.taille = Math.random() * 1.5 + 0.5;
    this.vitesseX = (Math.random() - 0.5) * 0.4;
    this.vitesseY = (Math.random() - 0.5) * 0.4;
    this.opacite = Math.random() * 0.5 + 0.1;
  }

  mettrAJour() {
    this.x += this.vitesseX;
    this.y += this.vitesseY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reinitialiser();
    }
  }

  dessiner() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(14, 165, 233, ${this.opacite})`;
    ctx.fill();
  }
}

// Créer les particules
for (let i = 0; i < NOMBRE_PARTICULES; i++) {
  particules.push(new Particule());
}

// Dessiner les lignes entre particules proches
function dessinerLignes() {
  for (let i = 0; i < particules.length; i++) {
    for (let j = i + 1; j < particules.length; j++) {
      const dx = particules[i].x - particules[j].x;
      const dy = particules[i].y - particules[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particules[i].x, particules[i].y);
        ctx.lineTo(particules[j].x, particules[j].y);
        ctx.strokeStyle = `rgba(14, 165, 233, ${0.08 * (1 - distance / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particules.forEach(function(p) {
    p.mettrAJour();
    p.dessiner();
  });
  dessinerLignes();
  requestAnimationFrame(animer);
}

animer();


// ── 3. COMPTEURS ANIMÉS ──
function animerCompteur(element, cible, duree) {
  let debut = 0;
  const increment = cible / (duree / 16);

  const timer = setInterval(function() {
    debut += increment;
    if (debut >= cible) {
      element.textContent = cible;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(debut);
    }
  }, 16);
}

// Déclencher les compteurs quand visibles
const observateurCompteurs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const compteurs = entry.target.querySelectorAll('.compter');
      compteurs.forEach(function(compteur) {
        const cible = parseInt(compteur.getAttribute('data-cible'));
        animerCompteur(compteur, cible, 2000);
      });
      observateurCompteurs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const sectionCompteurs = document.getElementById('compteurs');
if (sectionCompteurs) {
  observateurCompteurs.observe(sectionCompteurs);
}