// ════════════════════════════════════════
// MHAN-Niger — script.js
// ════════════════════════════════════════


// ── 1. NAVBAR : change d'apparence au scroll ──
const navbar = document.querySelector('nav');

window.addEventListener('scroll', function() {

  if (window.scrollY > 50) {
    // L'utilisateur a scrollé → navbar plus visible
    navbar.style.background = 'rgba(10, 22, 40, 0.98)';
    navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)';
  } else {
    // L'utilisateur est en haut → navbar transparente
    navbar.style.background = 'rgba(10, 22, 40, 0.95)';
    navbar.style.boxShadow = 'none';
  }

});


// ── 2. ANIMATION : les cartes apparaissent au scroll ──
const cartes = document.querySelectorAll('.service-card');

// On cache les cartes au départ
cartes.forEach(function(carte) {
  carte.style.opacity = '0';
  carte.style.transform = 'translateY(40px)';
  carte.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// On crée un observateur qui surveille quand les cartes deviennent visibles
const observateur = new IntersectionObserver(function(entries) {

  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      // La carte est visible → on la fait apparaître
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });

}, { threshold: 0.1 });

// On demande à l'observateur de surveiller chaque carte
cartes.forEach(function(carte) {
  observateur.observe(carte);
});


// ── 3. BOUTON RETOUR EN HAUT ──

// On crée le bouton dynamiquement
const boutonHaut = document.createElement('button');
boutonHaut.textContent = '↑';
boutonHaut.id = 'boutonHaut';
document.body.appendChild(boutonHaut);

// On le style directement en JS
boutonHaut.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, transform 0.2s;
  z-index: 999;
`;

// On l'affiche seulement quand l'utilisateur a scrollé
window.addEventListener('scroll', function() {
  if (window.scrollY > 400) {
    boutonHaut.style.opacity = '1';
  } else {
    boutonHaut.style.opacity = '0';
  }
});

// Au clic, on remonte en haut de la page
boutonHaut.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── FORMULAIRE CONNEXION ──
document.getElementById('formConnexion')
    .addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('connexionEmail').value;
        const motDePasse = document.getElementById('connexionMotDePasse').value;
        await connecter(email, motDePasse);
        this.reset();
    });

// ── FORMULAIRE INSCRIPTION ──
document.getElementById('formInscription')
    .addEventListener('submit', async function(event) {
        event.preventDefault();
        const nom = document.getElementById('inscriptionNom').value;
        const email = document.getElementById('inscriptionEmail').value;
        const motDePasse = document.getElementById('inscriptionMotDePasse').value;
        const entreprise = document.getElementById('inscriptionEntreprise').value;
        const service = document.getElementById('inscriptionService').value;
        const succes = await inscrire(nom, email, motDePasse, entreprise, service);
        if (succes) {
            basculerOnglet('connexion');
            this.reset();
        }
    });

// ── FORMULAIRE CONTACT ──
document.getElementById('formContact')
    .addEventListener('submit', async function(event) {
        event.preventDefault();
        const nom = document.querySelector('#contact input[type="text"]').value;
        const email = document.querySelector('#contact input[type="email"]').value;
        const service = document.querySelector('#contact select').value;
        const contenu = document.querySelector('#contact textarea').value;
        const succes = await envoyerMessage(nom, email, service, contenu);
        if (succes) this.reset();
    });

// ── BASCULER ENTRE CONNEXION ET INSCRIPTION ──
function basculerOnglet(onglet) {
    const formConnexion = document.getElementById('formConnexion');
    const formInscription = document.getElementById('formInscription');
    const onglets = document.querySelectorAll('.onglet');

    if (onglet === 'connexion') {
        formConnexion.style.display = 'flex';
        formInscription.style.display = 'none';
        onglets[0].classList.add('actif');
        onglets[1].classList.remove('actif');
    } else {
        formConnexion.style.display = 'none';
        formInscription.style.display = 'flex';
        onglets[0].classList.remove('actif');
        onglets[1].classList.add('actif');
    }
}

// ── VÉRIFIER SI DÉJÀ CONNECTÉ AU CHARGEMENT ──
window.addEventListener('load', function() {
    if (estConnecte()) {
        const user = JSON.parse(localStorage.getItem('mhan_user'));
        if (user) afficherDashboard(user);
    }
});


// ── 6. FONCTION NOTIFICATION (réutilisable) ──
function afficherNotification(message) {

  // On crée la notification
  const notification = document.createElement('div');
  notification.textContent = message;

  // On la style
  notification.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 30px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    max-width: 320px;
  `;

  // On l'ajoute à la page
  document.body.appendChild(notification);

  // On la fait apparaître
  setTimeout(function() {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // On la fait disparaître après 3.5 secondes
  setTimeout(function() {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(function() {
      notification.remove();
    }, 400);
  }, 3500);

}

// ── 7. MENU HAMBURGER MOBILE ──
const btnHamburger = document.getElementById('btnHamburger');
const menuPrincipal = document.getElementById('menuPrincipal');

btnHamburger.addEventListener('click', function() {
  menuPrincipal.classList.toggle('ouvert');

  // Change l'icône selon l'état du menu
  if (menuPrincipal.classList.contains('ouvert')) {
    btnHamburger.textContent = '✕';
  } else {
    btnHamburger.textContent = '☰';
  }
});

// Ferme le menu quand on clique sur un lien
const liensMenu = document.querySelectorAll('#menuPrincipal a');
liensMenu.forEach(function(lien) {
  lien.addEventListener('click', function() {
    menuPrincipal.classList.remove('ouvert');
    btnHamburger.textContent = '☰';
  });
});