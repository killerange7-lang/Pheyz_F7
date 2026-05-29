// On déclare Dom7 pour manipuler le DOM selon les standards Framework7
var $$ = Dom7;

// Initialisation globale de Framework7 avec les routes
var app = new Framework7({
  el: '#app',
  name: 'Ma ToDo',
  id: 'com.matodo.app',
  routes: [
    {
      path: '/',
      url: './pages/home.html', // Ta page d'accueil
    },
    {
      path: '/tasks/',
      url: './pages/tasks.html', // Ta page de tâches
    },
  ],
});

// Initialisation de la vue principale (obligatoire pour activer le routeur)
var mainView = app.views.create('.view-main');

// Variable pour suivre le filtre sélectionné (Séance 3)
var filtreActif = 'toutes'; // Valeurs possibles : 'toutes', 'afaire', 'faites'

// MODIFICATION : Chargement des données depuis le localStorage ou initialisation par défaut (Séance 3)
var donneesSauvegardees = localStorage.getItem('mes_taches_todo');

var taches = donneesSauvegardees ? JSON.parse(donneesSauvegardees) : [
  { id: 1, texte: "Tâche 1", fait: false },
  { id: 2, texte: "Tâche 2", fait: false },
  { id: 3, texte: "Tâche 3", fait: false },
  { id: 4, texte: "Tâche 4", fait: false },
];

// Fonction qui génère le HTML d'une ligne
function ligneTache(t) {
  // On gère dynamiquement la classe si la tâche est faite
  var classeStatut = t.fait ? 'tache-faite' : '';

  return '<li class="item-content" data-id="' + t.id + '">' +
    '<div class="item-media">' +
      '<label class="checkbox">' +
        '<input type="checkbox" class="cb-statut" ' + (t.fait ? 'checked' : '') + '>' +
        '<i class="icon-checkbox"></i>' +
      '</label>' +
    '</div>' +
    '<div class="item-inner">' +
      // Utilisation de la variable classeStatut pour barrer le texte si besoin
      '<div class="item-title ' + classeStatut + '">' + t.texte + '</div>' +
      '<div class="item-after">' +
        '<a href="#" class="btn-suppr f7-icons"><i class="icon f7-icons">trash</i></a>' +
      '</div>' +
    '</div>' +
  '</li>';
}

// Fonction pour afficher les tâches ET mettre à jour le compteur (avec FILTRES Séance 3)
function afficher() {
  var conteneur = document.getElementById('liste-taches-ul');
  if (conteneur) {
    var htmlResultat = '';
    var nbFaites = 0; // Initialisation du compteur de tâches terminées

    for (var i = 0; i < taches.length; i++) {
      var laTache = taches[i];

      // 1. On gère le compteur global (indépendant du filtre visuel)
      if (laTache.fait) {
        nbFaites++;
      }

      // 2. On vérifie si la tâche doit être affichée selon le filtre actif
      if (filtreActif === 'toutes') {
        htmlResultat += ligneTache(laTache);
      } else if (filtreActif === 'afaire' && !laTache.fait) {
        htmlResultat += ligneTache(laTache);
      } else if (filtreActif === 'faites' && laTache.fait) {
        htmlResultat += ligneTache(laTache);
      }
    }
    
    // Insertion des lignes filtrées dans la liste HTML
    conteneur.innerHTML = htmlResultat;

    // MISE À ZONE DU COMPTEUR
    var zoneCompteur = document.getElementById('zone-compteur');
    if (zoneCompteur) {
      zoneCompteur.innerHTML = 'Tâches complétées : ' + nbFaites + ' / ' + taches.length;
    }

    // MODIFICATION : Sauvegarde automatique du tableau mis à jour dans le localStorage (Séance 3)
    localStorage.setItem('mes_taches_todo', JSON.stringify(taches));
  }
}

// ==========================================
// LOGIQUE LIÉE AU CYCLE DE VIE DES PAGES
// ==========================================

// On écoute le moment où la page des tâches ("tasks") est initialisée à l'écran
$$(document).on('page:init', '.page[data-name="tasks"]', function (e) {
  
  // 1. On affiche directement les tâches existantes et le compteur initial
  afficher();

  // 2. Écouteur pour le bouton d'ajout
  var btnAjouter = document.getElementById('btn-ajouter');
  if (btnAjouter) {
    btnAjouter.addEventListener('click', function () {
      var champ = document.getElementById('champ-tache');
      var texteTache = champ.value.trim();

      if (texteTache === '') {
        alert('Veuillez saisir un texte pour la tâche !');
        return;
      }

      taches.push({
        id: Date.now(),
        texte: texteTache,
        fait: false
      });

      champ.value = ''; // Vide le champ input
      afficher();       // Rafraîchit l'écran, le compteur et sauvegarde

      // AJOUT DU TOAST
      var notificationToast = app.toast.create({
        text: 'Tâche ajoutée avec succès !',
        closeTimeout: 2000,
        position: 'bottom',
      });
      
      notificationToast.open();
    });
  }

  // 3. ÉCOUTEURS POUR LES BOUTONS DE FILTRES (Séance 3)
  var btnToutes = document.getElementById('filtre-toutes');
  var btnAfaire = document.getElementById('filtre-afaire');
  var btnFaites = document.getElementById('filtre-faites');

  if (btnToutes && btnAfaire && btnFaites) {
    
    btnToutes.addEventListener('click', function () {
      // On bascule la classe active visuellement
      $$(this).addClass('button-active');
      $$(btnAfaire).removeClass('button-active');
      $$(btnFaites).removeClass('button-active');
      // On applique le filtre et on rafraîchit
      filtreActif = 'toutes';
      afficher();
    });

    btnAfaire.addEventListener('click', function () {
      $$(this).addClass('button-active');
      $$(btnToutes).removeClass('button-active');
      $$(btnFaites).removeClass('button-active');
      filtreActif = 'afaire';
      afficher();
    });

    btnFaites.addEventListener('click', function () {
      $$(this).addClass('button-active');
      $$(btnToutes).removeClass('button-active');
      $$(btnAfaire).removeClass('button-active');
      filtreActif = 'faites';
      afficher();
    });
  }

});

// ==========================================
// ÉCOUTEURS GLOBAUX (DÉLÉGATION D'ÉVÉNEMENTS)
// ==========================================

// Pour la suppression
document.addEventListener('click', function (e) {
  var boutonSuppr = e.target.closest('.btn-suppr');
  
  if (boutonSuppr) {
    e.preventDefault();
    var liElement = boutonSuppr.closest('li');
    var idASupprimer = parseInt(liElement.getAttribute('data-id'));

    taches = taches.filter(function (t) {
      return t.id !== idASupprimer;
    });

    afficher(); // Rafraîchit et sauvegarde
  }
});

// Pour le changement de statut (Cocher / Décocher)
document.addEventListener('change', function (e) {
  if (e.target && e.target.classList.contains('cb-statut')) {
    var liElement = e.target.closest('li');
    var idTache = parseInt(liElement.getAttribute('data-id'));
    var estCoche = e.target.checked;

    for (var i = 0; i < taches.length; i++) {
      if (taches[i].id === idTache) {
        taches[i].fait = estCoche;
        break;
      }
    }

    afficher(); // Rafraîchit et sauvegarde
  }
});