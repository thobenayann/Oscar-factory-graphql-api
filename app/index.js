const { UserInputError, AuthenticationError } = require('apollo-server');
const depthLimit = require('graphql-depth-limit');

const db = require('./db/pg');
const jwt = require('./helpers/jwt');

const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const CategoryDatasource = require('./datasources/category');
const ImdbDatasource = require('./datasources/imdb');
const MovieDatasource = require('./datasources/movie');
const ReviewDatasource = require('./datasources/review');
const FavoriteDatasource = require('./datasources/favorite');
const UserDatasource = require('./datasources/user');

const logger = require('./helpers/logger');

const knexConfig = {
    client: 'pg',
    establishedConnection: db,
};

module.exports = {
    typeDefs,
    resolvers,
    dataSources: () => ({
        category: new CategoryDatasource(knexConfig),
        imdb: new ImdbDatasource(),
        movie: new MovieDatasource(knexConfig),
        review: new ReviewDatasource(knexConfig),
        favorite: new FavoriteDatasource(knexConfig),
        user: new UserDatasource(knexConfig),
    }),
    context: ({ req }) => {
        const ctx = {
            ...req,
            ip: req.headers['x-forwarded-for']
                ? req.headers['x-forwarded-for'].split(/, /)[0]
                : req.connection.remoteAddress,
            user: jwt.get(req),
        };
        return ctx;
    },
    formatError: (err) => {
        logger.error(err);
        if (!(err instanceof UserInputError || err instanceof AuthenticationError)) {
            if (!['production', 'test'].includes(process.env.NODE_ENV)) {
                return err;
            }
            return 'Internal server error';
        }
        return err.message;
    },
    plugins: [
        {
            async requestDidStart() {
                db.queryCount = 0;
            },
        },
    ],
    validationRules: [depthLimit(5)],
};
