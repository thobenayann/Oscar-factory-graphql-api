const { gql } = require('apollo-server');

const typeDefs = gql`
# ICI NOUS NE SOMMES PLUS DANS DU JAVASCRIPT
# C'est le langage partculier de GraphQL
# Afin de definir un type complexe on utilise le mot clé "type"
# Celui-ci est interprété par le serveur GraphQL
# Ce type sera alors accessible dans l'ensemble du schema en tant que nouveau type.
type Category {
    # Dans la définition d'un type complexe
    # - On précise la liste des propriété de cette entité
    # - Le type des ces propriétés
    # - Ainsi que l'obligation de présence des ceux-ci avec le signe ! juste après le type
    id: Int!
    label: String!
    created_at: String!
    updated_at: String
    movies: [Movie]
}
type Movie {
    id: Int!
    image: String!
    title: String!
    description: String
    release_year: Int!
    directors: String
    countries: String
    imdb_id: String!
    created_at: String!,
    updated_at: String
}
type Query{
    getMovie: [String]
    # Maintenant dans le type Query, je peux utiliser le type d'entité (ou type complexe) que l'on a créer précédemment
    # Ici on retounre une liste de categories
    "Liste de toutes les catégories"
    getAllCategories: [Category]
}

`;
module.exports = typeDefs;
