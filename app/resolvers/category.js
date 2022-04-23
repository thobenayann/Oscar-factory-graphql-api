const movieModel = require('../models/movie');

module.exports = {

    // Une méthode du resolver correspond à une des propriétés du schéma Pour une category la
    // valeur de Movie n'est pas en dans la table de BDD "category", contrirement a l'ensemble
    // des autres propriétés du schéma// On doit donc spécifier à travers les resolvers comment
    // récupérer ces infos
    async movies(parent) {
        // Le premier parmamètre disponible dans les méthodes de resolvers contient / ou pas,
        // l'entité parente qui utilise cet méthode Ici on se trouve dans l'entité "Category",
        // donc parent === category courante.
        const movies = await movieModel.findByCategory(parent.id);
        return movies;
    },

};