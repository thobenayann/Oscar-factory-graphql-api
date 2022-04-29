const bcrypt = require('bcrypt');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('../helpers/jwt');

module.exports = {
    user(_, args, { dataSources }) {
        return dataSources.user.findByPk(args.id);
    },

    async signin(_, args, { dataSources, ip }) {
        const errorMessage = 'Authentication invalid';
        const { email, password } = args;

        const users = await dataSources.user.findAll({ email });
        if (!users.length) {
            throw new UserInputError(errorMessage);
        }

        const user = users[0];

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            throw new AuthenticationError(errorMessage);
        }
        /*
        // La propriété id n'est pas une propriété, mais un getter, il faut donc l'ajouter
        // manuellement
        */
        // Avec les dataSources l'id est redevenu un paramètre, on peut donc le retirer de façon
        // manuel
        user.token = jwt.create({ ...user, ip });

        return user;
    },

    async getAllMovies(_, args, { dataSources }) {
        const params = { ...args };
        const data = await dataSources.movie.findAll(params);
        return data;
    },

    async getMovie(_, args, { dataSources }) {
        return dataSources.movie.findByPk(args.id);
    },

    async getMoviesByCategory(_, args, { dataSources }) {
        return dataSources.movie.findByCategory(args.category_id);
    },

    getReviewsByUser(_, args, { dataSources }) {
        return dataSources.review.findByUser(args.user_id);
    },

    getAllCategories(_, args, { dataSources }) {
        const params = { ...args };
        return dataSources.category.findAll(params);
    },

    getCategory(_, args, { dataSources }) {
        return dataSources.category.findByPk(args.id);
    },

    searchImdb(_, args, { dataSources }) {
        return dataSources.imdb.search(args.searchTerm);
    },

    echoYear(_, { year }) {
        return year;
    },

    getMyFavoriteMovies(_, __, { dataSources, user }) {
        // if (!user) {
        //     throw new AuthenticationError('You must be authenticate to get your favorites');
        // }
        return dataSources.movie.findFavoriteMoviesByUser(user.id);
    },

    getAllFavorites(_, __, { dataSources }) {
        return dataSources.favorite.findAll();
    },
};
