const bcrypt = require('bcrypt');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    async signup(_, args, { dataSources }) {
        const { username, email, password } = args.input;

        const users = await dataSources.user.findAll({ $or: { username, email } });

        if (users.length) {
            throw new UserInputError('User already exists with those informations');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const userData = {
            username,
            email,
            password: encryptedPassword,
        };

        const user = await dataSources.user.insert(userData);

        return user;
    },

    async createMovie(_, args, { dataSources, user }) {
        if (!user) {
            throw new AuthenticationError('You must be authenticate to add a movie');
        }

        const data = args.input;

        const movies = await dataSources.movie.findAll({ title: data.title });

        if (movies.length) {
            throw new UserInputError('A movie already exists with this title');
        }

        const { category_ids: categoryIds, ...movieData } = data;

        const newMovie = await dataSources.movie.insert(movieData);

        await dataSources.movie.addCategories(newMovie.id, categoryIds);

        return newMovie;
    },

    async createReview(_, args, { dataSources, user }) {
        if (!user) {
            throw new AuthenticationError('You must be authenticate to add a review');
        }

        const data = args.input;

        const movie = await dataSources.movie.findByPk(data.movie_id);

        if (!movie) {
            throw new UserInputError(`No movie with the id : ${data.movie_id}`);
        }

        const reviews = await dataSources.review.findAll({
            user_id: user.id,
            movie_id: data.movie_id,
        });

        if (reviews.length) {
            throw new UserInputError('User has already review this movie');
        }

        return dataSources.review.insert({ ...data, user_id: user.id });
    },

    async addToMyFavorites(_, args, { dataSources, user }) {
        if (!user) {
            throw new AuthenticationError('You must be authenticate to add a favorite');
        }

        const movie = await dataSources.movie.findByPk(args.movie_id);

        if (!movie) {
            throw new UserInputError(`No movie with the id : ${args.movie_id}`);
        }

        const favorites = await dataSources.favorite.findAll({
            user_id: user.id,
            movie_id: args.movie_id,
        });

        if (favorites.length) {
            throw new UserInputError('User has already add this movie to favorite');
        }

        await dataSources.favorite.insert({ ...args, user_id: user.id });
        return movie;
    },

    async removeToMyFavorites(_, args, { dataSources, user }) {
        if (!user) {
            throw new AuthenticationError('You must be authenticate to remove a favorite');
        }

        const movie = await dataSources.movie.findByPk(args.movie_id);

        if (!movie) {
            throw new UserInputError(`No movie with the id : ${args.movie_id}`);
        }

        const favorites = await dataSources.favorite.findAll({
            user_id: user.id,
            movie_id: args.movie_id,
        });

        if (!favorites.length) {
            throw new UserInputError('User hasn\'t this movie in his favorite list');
        }

        await dataSources.favorite.delete(favorites[0].id);
        return movie;
    },
};
