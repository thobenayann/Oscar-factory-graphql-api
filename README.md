# Oscar-factory-graphql-api

![logo](./assets/images/logo-oscar-factory.svg)

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prérequis">Prérequis</a></li>
        <li><a href="#création-de-la-bdd">Création de la BDD</a></li>
      </ul>
    </li>
    <li><a href="#lancement-de-lapi">Lancement de l'API</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project
:sparkles::sparkles::sparkles:

Projet personnel qui m'a permis d'intégrer les notions liées aux APIs GraphQL et à la gestion des performances de mes requêtes.

L'objectif de l'application sera de pouvoir rechercher et intégrer des données de films grâce à un outil de recherche.<br/>
L'utilisateur non connecté pourra visualiser les films receuillis et voir les commentaires des utilisateurs enregistrés.<br/>
Un utilisateur connecté pourra ajouter des films à la liste, les mettres en favoris et ajouter des commentaires aux films.

Cette API graphql consomme à la fois les données d'une BDD postgres mais également les données d'une api externe fournie par [The Open Movie Database](https://www.omdbapi.com/)

:point_down:

![schema](./assets/images/schema.jpg)

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

* [Node JS](https://nodejs.org/en/)
* [Apollo GraphQL](https://www.apollographql.com/)
* [PostgreSQL](https://www.postgresql.org/)

## Getting Started
:sunglasses:
### Prérequis

1. Récupérer une API key gratuite depuis le site [OMDB](https://www.omdbapi.com/)
2. Avoir une base de donnée PostgresQL disponible et un utilisateur créé.
3. Cloner le repository, utiliser le .env.example afin de renseigner vos credentials
4. Installer les dépendances à l'aide du gestionnaire de package NPM

<p align="right">(<a href="#top">back to top</a>)</p>

### Création de la BDD

Si vous avez configuré un utilisateur par défaut vous pouvez utiliser `npm run initDB`.

Sinon créez votre BDD avec le nom `oscar-factory-db` et lancez le script `npm run resetDB`.<br/>
(attention, ce script est adapté pour un OS windows, il doit être légèrement réajusté pour un autre OS comme linux)<br/>
Vous pouvez voir un example ici :point_right: [script-linux](script-linux.md)

Si votre environnement ne vous permet pas d'exécuter la commande, passez en utilisateur `postgres` grâce à la commande `sudo -i -u postgres`

<p align="right">(<a href="#top">back to top</a>)</p>

## Lancement de l'API

`npm run devDataloader`

## Documentation

RDV sur la page de bac à sable de Apollo de l'application web [Apollo Studio](https://studio.apollographql.com/sandbox/explorer)

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

:speech_balloon: Thobena Yann - [@Mon porte-folio](https://thobena-yann-developpeur-web.netlify.app/) - mail: thobena.yann@gmail.com

<!-- Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name) -->

<p align="right">(<a href="#top">back to top</a>)</p>
