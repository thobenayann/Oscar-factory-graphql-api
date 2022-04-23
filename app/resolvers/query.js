const categoryModel = require('../models/category');
const movieModel = require('../models/movie');

module.exports = {

    async getAllCategories() {
        const categories = await categoryModel.findAll();
        return categories;
    },

    async getMovie(_, args) {
        // En 2eme argument des resolvers on retrouve la liste de l'ensemble des arguments
        // envoyés dans la requête utilisateur
        const movie = await movieModel.findByPk(args.id);
        return movie;
    },

};