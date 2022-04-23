# Oscar-factory-graphql-api

![logo](./assets/images/logo_oscar-factory.png)

## Contexte

Projet personnel qui m'a permis d'intégrer les notions liés aux APIs GraphQL et à la gestion des performances de mes requêtes.

L'objectif de l'application sera de pouvoir rechercher et intégrer des données de films grâce à un outil de recherche.
L'utilisateur non connecté pourra visualiser les films receuillis et voir les commentaires des utilisateurs enregistrés.
Un utilisateur connecté pourra ajouter des films à la liste, les mettres en favoris et ajouter des commentaires aux films.

Cette API graphql consomme à la fois les données d'une BDD postgres mais également les données d'une api externe fournie par [The Open Movie Database](https://www.omdbapi.com/)

![schema](./assets/images/schema.jpg)

## Création de la BDD

Si vous avez configuré un utilisateur par défaut vous pouvez utiliser `npm run initDB`.

Sinon créez votre BDD avec le nom `oscar-factory-db` et lancer le script `npm run resetDB`.
(attention, ce script est adapté pour un OS windows, il doit être légèrement adapté pour linux)

Si votre environnement ne vous permet pas d'exécuter la commande, passez en utilisateur `postgres` grâce à la commande `sudo -i -u postgres`

## Lancement de l'API

`npm run dev`

## documentation

RDV sur la page de bac à sable de Apollo de l'application web `/`
