module.exports = {
    movie(parent, _, { dataSources }) {
        return dataSources.movie.findByPk(parent.movie_id);
    },

    user(parent, _, { dataSources }) {
        return dataSources.user.findByPk(parent.user_id);
    },
};
