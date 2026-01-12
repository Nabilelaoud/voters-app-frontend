# PayMeMaroc – Frontend

Ce dossier contient le frontend de l’application PayMeMaroc.

Le frontend permet à l’utilisateur de consulter un sondage et de voter via une interface web simple.  
Il communique avec un backend GraphQL pour récupérer les données et envoyer les votes.

---

## Technologies utilisées

Ce projet frontend est développé avec :

- React
- TypeScript
- Vite
- Apollo Client
- GraphQL

---

## Structure du projet

```text
frontend/
├── public/
├── src/
│   ├── assets/        Ressources (images, fichiers statiques)
│   ├── apollo.ts      Configuration du client Apollo
│   ├── App.tsx        Composant principal de l’application
│   ├── App.css        Styles du composant App
│   ├── index.css      Styles globaux
│   └── main.tsx       Point d’entrée de l’application React
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

Installation

Avant de commencer, il faut avoir Node.js installé.

Dans le dossier frontend, exécuter :

npm install


Cette commande installe toutes les dépendances nécessaires.

Lancer l’application

Pour démarrer le serveur de développement :

npm run dev


L’application sera disponible à l’adresse :

http://localhost:5173

Connexion avec le backend

Le frontend dépend d’un backend GraphQL qui doit être lancé séparément.

Le backend doit être accessible à l’adresse :

http://localhost:4000/graphql


La configuration de la connexion GraphQL se trouve dans le fichier :

src/apollo.ts