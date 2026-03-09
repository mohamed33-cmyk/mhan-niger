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

// ════════════════════════════════════════
// BOUTON RETOUR EN HAUT
// ════════════════════════════════════════
const btnHaut = document.createElement('button');
btnHaut.innerHTML = '↑';
btnHaut.classList.add('btn-haut');
document.body.appendChild(btnHaut);

window.addEventListener('scroll', function() {
  btnHaut.classList.toggle('visible', window.scrollY > 400);
});

btnHaut.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ════════════════════════════════════════
// BOUTON WHATSAPP
// ════════════════════════════════════════
const btnWhatsapp = document.createElement('a');
btnWhatsapp.href = 'https://wa.me/22791151509';
btnWhatsapp.target = '_blank';
btnWhatsapp.classList.add('btn-whatsapp');
btnWhatsapp.innerHTML = `
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
    -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
    -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
    .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
    -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
    -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
    5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
    1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.082
    a.75.75 0 00.921.921l5.227-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373
    12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.953-1.355l-.355-.211-3.684
    1.036 1.036-3.684-.211-.355A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25
    12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>`;
document.body.appendChild(btnWhatsapp);