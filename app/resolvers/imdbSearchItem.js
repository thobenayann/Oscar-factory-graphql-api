module.exports = {
    movie(parent, _, { dataSources }) {
        return dataSources.movie.findByImdbId(parent.imdbID);
    },
};
