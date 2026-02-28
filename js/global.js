// ════════════════════════════════════════
// MHAN-Niger — global.js
// Scripts communs à toutes les pages
// ════════════════════════════════════════

// ── CURSEUR PERSONNALISÉ ──
const curseur = document.createElement('div');
curseur.classList.add('curseur');
document.body.appendChild(curseur);

const curseurAnneau = document.createElement('div');
curseurAnneau.classList.add('curseur-anneau');
document.body.appendChild(curseurAnneau);

document.addEventListener('mousemove', function(e) {
  curseur.style.left = e.clientX - 6 + 'px';
  curseur.style.top = e.clientY - 6 + 'px';
  curseurAnneau.style.left = e.clientX - 18 + 'px';
  curseurAnneau.style.top = e.clientY - 18 + 'px';
});

document.addEventListener('mousedown', function() {
  curseur.style.transform = 'scale(1.8)';
  curseurAnneau.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', function() {
  curseur.style.transform = 'scale(1)';
  curseurAnneau.style.transform = 'scale(1)';
});

// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── MENU HAMBURGER ──
const hamburger = document.querySelector('.hamburger');
const menuMobile = document.querySelector('.menu-mobile');
const btnFermer = document.querySelector('.btn-fermer');

hamburger.addEventListener('click', function() {
  menuMobile.classList.add('ouvert');
});

btnFermer.addEventListener('click', function() {
  menuMobile.classList.remove('ouvert');
});

document.querySelectorAll('.menu-mobile a').forEach(function(lien) {
  lien.addEventListener('click', function() {
    menuMobile.classList.remove('ouvert');
  });
});

// ── ANIMATIONS AU SCROLL ──
const observateur = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right')
  .forEach(function(el) {
    observateur.observe(el);
  });

// ── TOAST NOTIFICATION ──
function afficherToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(function() {
    toast.classList.remove('visible');
  }, 3500);
}

// ════════════════════════════════════════
// THEME TOGGLE — Dark / Light
// ════════════════════════════════════════

const themeToggle = document.getElementById('themeToggle');

// Récupérer le thème sauvegardé
const themeSauvegarde = localStorage.getItem('mhan_theme') || 'dark';
document.documentElement.setAttribute('data-theme', themeSauvegarde);

// Appliquer le thème au chargement
function appliquerTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('mhan_theme', theme);
}

// Toggle au clic
if (themeToggle) {
  themeToggle.addEventListener('click', function() {
    const themeActuel = document.documentElement
      .getAttribute('data-theme');
    const nouveauTheme = themeActuel === 'dark' ? 'light' : 'dark';
    appliquerTheme(nouveauTheme);

    // Animation rotation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(function() {
      themeToggle.style.transform = '';
    }, 400);
  });
}

// Appliquer immédiatement au chargement
appliquerTheme(themeSauvegarde);