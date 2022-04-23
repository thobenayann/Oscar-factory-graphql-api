const DataLoader = require('dataloader');
const CoreSQLDataSource = require('./core/sql');

const SECONDS = 10;

class Category extends CoreSQLDataSource {
    tableName = 'category';

    async findByMovie(movieId) {
        if (process.env.DATALOADER_ENABLED) {
            return this.movieIdLoader.load(movieId);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('category.*', 'movie_has_category.movie_id')
            .join('movie_has_category', 'category.id', '=', 'movie_has_category.category_id')
            .where('movie_id', movieId)
            .orderBy('category.label');
        /*
        if (process.env.CACHE_ENABLED) {
            return query.cache(SECONDS);
        }

        return query;
        */
        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async findByMovieBulk(movieIds) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('category.*', 'movie_has_category.movie_id')
            .join('movie_has_category', 'category.id', '=', 'movie_has_category.category_id')
            .whereIn('movie_id', movieIds)
            .orderBy('category.label');

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    movieIdLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findByMovieBulk(intIds);

        /*
        Attention ici on ne doit pas utilisé un find, mais un filter,
        car il peut y avoir plusieurs catégories
        */
        return intIds.map((id) => records.filter((record) => record.movie_id === id));
    });
}

module.exports = Category;
