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

// Ton tableau de données de base
var taches = [
  { id: 1, texte: "Tâche 1", fait: false },
  { id: 2, texte: "Tâche 2", fait: false },
  { id: 3, texte: "Tâche 3", fait: false },
  { id: 4, texte: "Tâche 4", fait: false },
];

// Fonction qui génère le HTML d'une ligne (inchangée, elle est parfaite)
function ligneTache(t) {
  return '<li class="item-content" data-id="' + t.id + '">' +
    '<div class="item-media">' +
      '<label class="checkbox">' +
        '<input type="checkbox" class="cb-statut" ' + (t.fait ? 'checked' : '') + '>' +
        '<i class="icon-checkbox"></i>' +
      '</label>' +
    '</div>' +
    '<div class="item-inner">' +
      '<div class="item-title ' + (t.fait ? 'tache-faite' : '') + '">' + t.texte + '</div>' +
      '<div class="item-after">' +
        '<a href="#" class="btn-suppr f7-icons"><i class="icon f7-icons">trash</i></a>' +
      '</div>' +
    '</div>' +
  '</li>';
}

// Fonction pour afficher les tâches
function afficher() {
  var conteneur = document.getElementById('liste-taches-ul');
  if (conteneur) {
    var htmlResultat = '';
    for (var i = 0; i < taches.length; i++) {
      htmlResultat += ligneTache(taches[i]);
    }
    conteneur.innerHTML = htmlResultat;
  }
}

// ==========================================
// LOGIQUE LIÉE AU CYCLE DE VIE DES PAGES
// ==========================================

// On écoute le moment où la page des tâches ("tasks") est initialisée à l'écran
$$(document).on('page:init', '.page[data-name="tasks"]', function (e) {
  
  // 1. On affiche directement les tâches existantes
  afficher();

  // 2. Écouteur pour le bouton d'ajout (on le place ICI car le bouton existe enfin dans le DOM)
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
      afficher();       // Rafraîchit l'écran
    });
  }
});

// ==========================================
// ÉCOUTEURS GLOBAUX (DÉLÉGATION D'ÉVÉNEMENTS)
// ==========================================

// Pour la suppression (fonctionne n'importe quand et n'importe où sur le document)
document.addEventListener('click', function (e) {
  var boutonSuppr = e.target.closest('.btn-suppr');
  
  if (boutonSuppr) {
    e.preventDefault();
    var liElement = boutonSuppr.closest('li');
    var idASupprimer = parseInt(liElement.getAttribute('data-id'));

    taches = taches.filter(function (t) {
      return t.id !== idASupprimer;
    });

    afficher();
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

    afficher();
  }
});