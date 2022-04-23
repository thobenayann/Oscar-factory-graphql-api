/**
 * Ce fichier sert à la validation des données, la documentation, mais également le routage
 * Plugin VSCode pour graphQL : https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode
 */

const { gql } = require('apollo-server');
const { readFileSync } = require('fs');
const path = require('path');

// Types
const category = readFileSync(path.join(__dirname, './category.gql'));
const movie = readFileSync(path.join(__dirname, './movie.gql'));

// Query and mutations
const query = readFileSync(path.join(__dirname, './query.gql'));

/*
Les gabarits étiquetés (tagged templates)
sont une forme plus avancée de gabarits.
On peut ici utiliser une fonction pour analyser les différents fragments du gabarit.
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Litt%C3%A9raux_gabarits
*/

const schema = gql`

    ${category}

    ${movie}

    ${query}

`;

module.exports = schema;
