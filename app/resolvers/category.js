module.exports = {
    movies(parent, _, { dataSources }) {
        return dataSources.movie.findByCategory(parent.id);
    },
};
