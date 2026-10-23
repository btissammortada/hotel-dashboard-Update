# Hotel Dashboard - TP4

## Description

Application frontend de gestion d'hôtel réalisée avec HTML, Bootstrap et JavaScript (modules ES).
Elle charge trois fichiers JSON liés (clients, produits, commandes), les relie grâce à leurs
identifiants et affiche les commandes avec des indicateurs calculés dynamiquement.

## Structure du projet

```
tp4/
├── index.html
├── css/
│   └── style.css
├── data/
│   ├── customers.json
│   ├── products.json
│   └── orders.json
└── js/
    ├── app.js          # initialisation, événements, render()
    ├── state.js        # état central de l'application
    ├── dataService.js  # chargement des fichiers JSON (fetch)
    ├── selectors.js    # relations, filtres et calculs
    └── view.js         # affichage dans le DOM
```

## Relations entre les données

Customer ← customerId ← Order → productId → Product

Le nom du client, le prix du produit et les montants ne sont pas stockés dans `orders.json` :
ils sont retrouvés et calculés à partir des identifiants.

## Fonctionnalités principales

- Chargement de 3 fichiers JSON avec `fetch()`, `async/await` et `try/catch`
- Indicateurs dynamiques : clients, produits, commandes, montant cumulé, montant livré
- Recherche d'une commande par nom de client
- Filtre par statut (Livrée, En attente, Annulée)
- Filtre par catégorie de produit
- Les filtres fonctionnent ensemble
- Détail d'une commande dans un modal Bootstrap (client, ville, date, statut, lignes, total)
- Gestion des erreurs de chargement avec message dans l'interface et dans la console

## Lancer le projet

Les modules ES et `fetch()` ne fonctionnent pas en ouvrant `index.html` directement.
Il faut un serveur local :

1. Ouvrir le dossier du projet dans VS Code
2. Installer l'extension **Live Server**
3. Clic droit sur `index.html` puis **Open with Live Server**



## Auteur

BTISSAM MORTADA- TP4 Développement Web Full Stack et DevOps

