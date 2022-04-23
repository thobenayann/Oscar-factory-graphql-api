module.exports = {
    reviews(parent, _, { dataSources }) {
        return dataSources.review.findByUser(parent.id);
    },
};
