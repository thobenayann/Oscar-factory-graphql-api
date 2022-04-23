const DataLoader = require('dataloader');
const CoreSQLDataSource = require('./core/sql');

const SECONDS = 10;

class Movie extends CoreSQLDataSource {
    tableName = 'movie';

    async findByCategory(categoryId) {
        if (process.env.DATALOADER_ENABLED) {
            return this.categoryIdLoader.load(categoryId);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('movie.*', 'movie_has_category.category_id')
            .join('movie_has_category', 'movie.id', '=', 'movie_has_category.movie_id')
            .where('category_id', categoryId)
            .orderByRaw('random()');
        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async findByCategoryBulk(categoryIds) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('movie.*', 'movie_has_category.category_id')
            .join('movie_has_category', 'movie.id', '=', 'movie_has_category.movie_id')
            .whereIn('category_id', categoryIds)
            .orderByRaw('random()');

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    categoryIdLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findByCategoryBulk(intIds);

        /*
        Attention ici on ne doit pas utilisé un find, mais un filter,
        car il peut y avoir plusieurs catégories
        */
        return intIds.map((id) => records.filter((record) => record.category_id === id));
    });

    async findByImdbId(imdbId) {
        if (process.env.DATALOADER_ENABLED) {
            return this.imdbIdLoader.load(imdbId);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .where('imdb_id', imdbId);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result[0];
    }

    async findByImdbIdBulk(imdbIds) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .whereIn('imdb_id', imdbIds);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    imdbIdLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findByImdbIdBulk(intIds);

        return intIds.map((id) => records.find((record) => record.imdb_id === id));
    });

    async removeCategories(id) {
        const result = await this.knex('movie_has_category')
            .connection(this.establishedConnection)
            .where({ movie_id: id })
            .delete();

        return result;
    }

    async addCategories(id, categoryIds) {
        const values = categoryIds.map((categoryId) => ({ movie_id: id, category_id: categoryId }));
        const result = await this.knex('movie_has_category').connection(this.establishedConnection).insert(values);

        return result;
    }

    async findFavoriteMoviesByUser(userId) {
        if (process.env.DATALOADER_ENABLED) {
            return this.favoriteMoviesByUserIdLoader.load(userId);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('movie.*', 'favorite.user_id')
            .join('favorite', 'movie.id', '=', 'favorite.movie_id')
            .where('user_id', userId);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async findFavoriteMoviesByUserBulk(userIds) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('movie.*', 'favorite.user_id')
            .join('favorite', 'movie.id', '=', 'favorite.movie_id')
            .whereIn('user_id', userIds);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    favoriteMoviesByUserIdLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findFavoriteMoviesByUserBulk(intIds);
        /*
        Attention ici on ne doit pas utilisé un find, mais un filter,
        car il peut y avoir plusieurs catégories
        */
        return intIds.map((id) => records.filter((record) => record.user_id === id));
    });
}

module.exports = Movie;
