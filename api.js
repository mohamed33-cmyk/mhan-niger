// ════════════════════════════════════════
// MHAN-Niger — api.js
// Gestion des appels vers le backend
// ════════════════════════════════════════

// ── URL de base du backend ──
const API_URL = 'http://localhost:5226/api';

// ── Récupérer le token stocké ──
function getToken() {
    return localStorage.getItem('mhan_token');
}

// ── Stocker le token après connexion ──
function setToken(token) {
    localStorage.setItem('mhan_token', token);
}

// ── Supprimer le token à la déconnexion ──
function removeToken() {
    localStorage.removeItem('mhan_token');
    localStorage.removeItem('mhan_user');
}

// ── Vérifier si l'utilisateur est connecté ──
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
            headers: {
                'Content-Type': 'application/json'
            },
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
            afficherNotification('✅ ' + data.message);
            return true;
        } else {
            afficherNotification('❌ ' + data.message);
            return false;
        }

    } catch (erreur) {
        afficherNotification('❌ Erreur de connexion au serveur.');
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
            headers: {
                'Content-Type': 'application/json'
            },
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

            afficherNotification('👋 Bienvenue ' + data.utilisateur.nom + ' !');
            afficherDashboard(data.utilisateur);
            return true;
        } else {
            afficherNotification('❌ ' + data.message);
            return false;
        }

    } catch (erreur) {
        afficherNotification('❌ Erreur de connexion au serveur.');
        return false;
    }
}

// ════════════════════════════════════════
// DÉCONNEXION
// ════════════════════════════════════════
function deconnecter() {
    removeToken();
    afficherNotification('👋 Vous êtes déconnecté.');

    // Afficher le formulaire de connexion
    document.getElementById('authBox').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

// ════════════════════════════════════════
// RÉCUPÉRER LES PROJETS
// ════════════════════════════════════════
async function getProjets() {
    try {
        const reponse = await fetch(`${API_URL}/projets`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Content-Type': 'application/json'
            }
        });

        const projets = await reponse.json();

        if (reponse.ok) {
            return projets;
        } else {
            return [];
        }

    } catch (erreur) {
        return [];
    }
}

// ════════════════════════════════════════
// ENVOYER UN MESSAGE CONTACT
// ════════════════════════════════════════
async function envoyerMessage(nom, email, service, contenu) {
    try {
        const reponse = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom: nom,
                email: email,
                service: service,
                contenu: contenu
            })
        });

        const data = await reponse.json();

        if (reponse.ok) {
            afficherNotification('✅ ' + data.message);
            return true;
        } else {
            afficherNotification('❌ Une erreur est survenue.');
            return false;
        }

    } catch (erreur) {
        afficherNotification('❌ Erreur de connexion au serveur.');
        return false;
    }
}

// ════════════════════════════════════════
// AFFICHER LE DASHBOARD CLIENT
// ════════════════════════════════════════
async function afficherDashboard(utilisateur) {

    // Cacher le formulaire
    document.getElementById('authBox').style.display = 'none';

    // Afficher le dashboard
    const dashboard = document.getElementById('dashboard');
    dashboard.style.display = 'block';

    // Mettre à jour les infos utilisateur
    document.getElementById('dashNom').textContent = utilisateur.nom;
    document.getElementById('dashEmail').textContent = utilisateur.email;
    document.getElementById('dashRole').textContent = utilisateur.role;
    document.getElementById('dashAvatar').textContent = 
        utilisateur.nom.charAt(0).toUpperCase();

    // Charger les projets
    const projets = await getProjets();
    document.getElementById('dashNbProjets').textContent = projets.length;
}