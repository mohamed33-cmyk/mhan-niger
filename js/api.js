// ════════════════════════════════════════
// MHAN-Niger — api.js
// Communication avec le backend ASP.NET
// ════════════════════════════════════════

const API_URL = 'http://localhost:5226/api';

// ── TOKEN ──
function getToken() {
  return localStorage.getItem('mhan_token');
}

function setToken(token) {
  localStorage.setItem('mhan_token', token);
}

function removeToken() {
  localStorage.removeItem('mhan_token');
  localStorage.removeItem('mhan_user');
}

function estConnecte() {
  return getToken() !== null;
}

// ════════════════════════════════════════
// INSCRIPTION
// ════════════════════════════════════════
async function inscrire(nom, email, motDePasse, entreprise, service) {
  try {
    const reponse = await fetch(`${API_URL}/auth/inscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: nom,
        email: email,
        motDePasse: motDePasse,
        entreprise: entreprise,
        serviceSouhaite: service
      })
    });

    const data = await reponse.json();

    if (reponse.ok) {
      afficherToast('✅ ' + data.message);
      return true;
    } else {
      afficherToast('❌ ' + data.message);
      return false;
    }

  } catch (erreur) {
    afficherToast('❌ Impossible de contacter le serveur. Vérifiez que le backend tourne.');
    console.error('Erreur inscription:', erreur);
    return false;
  }
}

// ════════════════════════════════════════
// CONNEXION
// ════════════════════════════════════════
async function connecter(email, motDePasse) {
  try {
    const reponse = await fetch(`${API_URL}/auth/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        motDePasse: motDePasse
      })
    });

    const data = await reponse.json();

    if (reponse.ok) {
      // Stocker le token et les infos utilisateur
      setToken(data.token);
      localStorage.setItem('mhan_user', JSON.stringify(data.utilisateur));

      afficherToast('👋 Bienvenue ' + data.utilisateur.nom + ' !');

      // Afficher le dashboard
      afficherDashboard(data.utilisateur);

      // Charger les projets
      chargerProjets();

      return true;
    } else {
      afficherToast('❌ ' + data.message);
      return false;
    }

  } catch (erreur) {
    afficherToast('❌ Impossible de contacter le serveur. Vérifiez que le backend tourne.');
    console.error('Erreur connexion:', erreur);
    return false;
  }
}

// ════════════════════════════════════════
// DÉCONNEXION
// ════════════════════════════════════════
function deconnecter() {
  removeToken();
  afficherToast('👋 Vous êtes déconnecté.');
}

// ════════════════════════════════════════
// RÉCUPÉRER LES PROJETS
// ════════════════════════════════════════
async function chargerProjets() {
  try {
    const reponse = await fetch(`${API_URL}/projets`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      }
    });

    if (reponse.ok) {
      const projets = await reponse.json();
      afficherProjets(projets);
    }

  } catch (erreur) {
    console.error('Erreur chargement projets:', erreur);
  }
}

// ════════════════════════════════════════
// AFFICHER LES PROJETS DANS LE DASHBOARD
// ════════════════════════════════════════
function afficherProjets(projets) {
  const container = document.querySelector('.dash-section .projet-liste');
  if (!container) return;

  if (projets.length === 0) {
    container.innerHTML = `
      <p style="color:var(--blanc-40);font-size:0.85rem;
        text-align:center;padding:20px 0">
        Aucun projet pour le moment.
      </p>`;
    return;
  }

  container.innerHTML = projets.map(function(projet) {
    let classeStatut = 'statut-attente';
    if (projet.statut === 'EnCours') classeStatut = 'statut-cours';
    if (projet.statut === 'Terminé') classeStatut = 'statut-termine';

    return `
      <div class="projet-item">
        <div>
          <div class="projet-nom">${projet.titre}</div>
          <div class="projet-service">${projet.description}</div>
        </div>
        <span class="projet-statut ${classeStatut}">
          ${projet.statut}
        </span>
      </div>`;
  }).join('');

  // Mettre à jour le compteur
  const compteur = document.querySelector('.dash-stat-valeur');
  if (compteur) {
    compteur.innerHTML = projets.length + '<span>+</span>';
  }
}

// ════════════════════════════════════════
// ENVOYER MESSAGE CONTACT
// ════════════════════════════════════════
async function envoyerMessage(nom, email, service, contenu) {
  try {
    const reponse = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: nom,
        email: email,
        service: service,
        contenu: contenu
      })
    });

    const data = await reponse.json();

    if (reponse.ok) {
      afficherToast('✅ ' + data.message);
      return true;
    } else {
      afficherToast('❌ Une erreur est survenue.');
      return false;
    }

  } catch (erreur) {
    afficherToast('❌ Impossible de contacter le serveur.');
    console.error('Erreur contact:', erreur);
    return false;
  }
}