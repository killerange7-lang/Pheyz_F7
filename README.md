# Ma ToDo — projet de démarrage (Framework7)

Squelette de l'application fil rouge du module Framework7 (L1 Informatique).
Application **mono-écran** : toute l'interface tient dans `index.html`,
sans routage ni pages séparées.

Les emplacements à compléter sont indiqués par des commentaires `SÉANCE 1/2/3`
dans `index.html`, `js/app.js` et `css/app.css`.

## Arborescence

```
ma-todo-starter/
├── index.html      L'écran (navbar + zone à compléter)
├── css/app.css     Couleur du thème
└── js/app.js       Initialisation de Framework7
```

## Lancer le projet

- VS Code + extension _Live Server_ → clic droit sur `index.html`.
- ou `python -m http.server 8080` puis http://localhost:8080
- ou `npx serve`

> Comme il n'y a pas de routage, le double-clic sur `index.html` fonctionne
> aussi ; un serveur local reste conseillé (notamment pour `localStorage`
> en séance 3).

Pour le rendu mobile : outils développeur du navigateur (F12) → mode appareil.

## Progression

- **Séance 1** : afficher une liste de tâches écrite en dur.
- **Séance 2** : tableau de données, génération de la liste, ajout, suppression.
- **Séance 3** : cocher/décocher, compteur, filtres, persistance `localStorage`.

## Version

Framework7 v9 + framework7-icons (via CDN).

---

## ⚙️ VERSION HORS-LIGNE

Framework7 et la police d'icônes sont **embarqués localement** dans `lib/` :
aucune connexion Internet n'est nécessaire.

```
lib/
├── framework7-bundle.min.css
├── framework7-bundle.min.js
└── framework7-icons/
    ├── css/framework7-icons.css
    └── fonts/   (woff2 / woff / ttf)
```

Cette application étant mono-écran (pas de routage), elle peut s'ouvrir par
simple double-clic sur `index.html`, sans aucun serveur ni réseau.

> Conseil : pour que `localStorage` (séance 3) fonctionne de façon fiable sur
> tous les navigateurs, il est tout de même préférable de passer par un petit
> serveur local (Live Server, `python -m http.server`, `npx serve`). Aucune
> connexion Internet n'est requise dans tous les cas.

Version embarquée : Framework7 v9 + framework7-icons (copie locale).
