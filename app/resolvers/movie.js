module.exports = {
    imdb(parent, _, { dataSources }) {
        return dataSources.imdb.findByPk(parent.imdb_id);
    },

    categories(parent, _, { dataSources }) {
        return dataSources.category.findByMovie(parent.id);
    },

    reviews(parent, args, { dataSources }) {
        return dataSources.review.findByMovie(parent.id, args);
    },

    favorites(parent, _, { dataSources }) {
        return dataSources.favorite.findByMovie(parent.id);
    },
};
