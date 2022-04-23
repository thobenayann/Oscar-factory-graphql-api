// Scalars
// @see : https://www.graphql-scalars.dev/docs
const {
    PositiveIntResolver: PositiveInt,
    EmailAddressResolver: EmailAddress,
    DateTimeResolver: DateTime,
} = require('graphql-scalars');
const Year = require('./scalars/year');

// Types
const User = require('./user');
const Movie = require('./movie');
const Category = require('./category');
const Review = require('./review');
const Favorite = require('./favorite');
const Imdb = require('./imdb');
const ImdbSearchItem = require('./imdbSearchItem');

// Query and mutations
const Query = require('./query');
const Mutation = require('./mutation');

module.exports = {
    Year,

    PositiveInt,

    EmailAddress,

    DateTime,

    User,

    Movie,

    Category,

    Review,

    Favorite,

    Imdb,

    ImdbSearchItem,

    // Liste des actions de récupération possibles
    Query,

    // Liste des actions de mise à jour des données possibles
    Mutation,
};
