const DataLoader = require('dataloader');
const CoreSQLDataSource = require('./core/sql');

const SECONDS = 10;

class Review extends CoreSQLDataSource {
    tableName = 'review';

    async findByMovie(movieId, { asc }) {
        if (process.env.DATALOADER_ENABLED) {
            return this.movieIdLoader.load({ movieId, asc });
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .where('movie_id', movieId);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async findByMovieBulk(movieIds, asc) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .whereIn('movie_id', movieIds)
            .orderBy('created_at', asc ? 'asc' : 'desc');

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    movieIdLoader = new DataLoader(async (keys) => {
        const intIds = keys.map((k) => parseInt(k.movieId, 10));
        const records = await this.findByMovieBulk(intIds, keys[0].asc);

        /*
        Attention ici on ne doit pas utilisé un find, mais un filter,
        car il peut y avoir plusieurs catégories
        */
        return intIds.map((id) => records.filter((record) => record.movie_id === id));
    });

    async findByUser(userId) {
        if (process.env.DATALOADER_ENABLED) {
            return this.userIdLoader.load(userId);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .where('user_id', userId);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async findByUserBulk(userIds) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .whereIn('user_id', userIds);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    userIdLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findByUserBulk(intIds);

        /*
        Attention ici on ne doit pas utilisé un find, mais un filter,
        car il peut y avoir plusieurs catégories
        */
        return intIds.map((id) => records.filter((record) => record.user_id === id));
    });
}

module.exports = Review;
