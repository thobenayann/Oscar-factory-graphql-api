/**
 * Ce fichier sert à la validation des données, la documentation, mais également le routage
 * Plugin VSCode pour graphQL : https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode
 */

const { gql } = require('apollo-server');
const { readFileSync } = require('fs');
const path = require('path');

// Scalars
const scalars = readFileSync(path.join(__dirname, './scalars.gql'));

// Types
const user = readFileSync(path.join(__dirname, './user.gql'));
const category = readFileSync(path.join(__dirname, './category.gql'));
const movie = readFileSync(path.join(__dirname, './movie.gql'));
const review = readFileSync(path.join(__dirname, './review.gql'));
const favorite = readFileSync(path.join(__dirname, './favorite.gql'));
const imdb = readFileSync(path.join(__dirname, './imdb.gql'));

// Query and mutations
const query = readFileSync(path.join(__dirname, './query.gql'));
const mutation = readFileSync(path.join(__dirname, './mutation.gql'));

/*
Les gabarits étiquetés (tagged templates)
sont une forme plus avancée de gabarits.
On peut ici utiliser une fonction pour analyser les différents fragments du gabarit.
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Litt%C3%A9raux_gabarits
*/

const schema = gql`
    ${scalars}

    ${user}

    ${category}

    ${movie}

    ${review}

    ${favorite}

    ${imdb}

    ${query}

    ${mutation}
`;

module.exports = schema;
