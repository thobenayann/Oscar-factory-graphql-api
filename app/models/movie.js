const client = require('../db/pg');

const CoreModel = require('./coreModel');

/**
 * @typedef {object} Movie
 * @property {number} id - Unique identifier
 * @property {string} image - movie image
 * @property {string} title - Unique movie title
 * @property {string} description - movie description
 * @property {number} release_year - movie release date
 * @property {string} directors - movie director(s)
 * @property {string} countries - movie country(ies)
 * @property {string} imbd_id - movie imdb identifier
 * @property {string} created_at - movie selection date
 * @property {string} updated_at - movie last update date
 */

/**
 * @typedef {object} InputMovie
 * @property {string} image - movie image
 * @property {string} title - Unique movie title
 * @property {string} description - movie description
 * @property {number} release_year - movie release date
 * @property {string} directors - movie director(s)
 * @property {string} countries - movie country(ies)
 * @property {string} imbd_id - movie imdb identifier
 */

class Movie extends CoreModel {
    image;

    title;

    description;

    release_year;

    directors;

    countries;

    static tableName = 'movie';

    constructor(obj) {
        super(obj);
        this.image = obj.image;
        this.title = obj.title;
        this.description = obj.description;
        this.release_year = obj.release_year;
        this.directors = obj.directors;
        this.countries = obj.countries;
        this.imdb_id = obj.imdb_id;
    }

    static async findByCategory(categoryId) {
        const preparedQuery = {
            text: `
                SELECT "movie".*
                FROM "movie"
                JOIN "movie_has_category" ON  "movie"."id" = "movie_has_category"."movie_id"
                WHERE "category_id" = $1
                ORDER BY random()
            `,
            values: [categoryId],
        };

        const result = await this.client.query(preparedQuery);

        const instanceList = [];

        result.rows.forEach((row) => {
            const instance = new this(row);
            instanceList.push(instance);
        });

        return instanceList;
    }

    async removeCategories() {
        const preparedQuery = {
            text: 'DELETE FROM movie_has_category WHERE movie_id = $1',
            values: [this.id],
        };

        await this.constructor.client.query(preparedQuery);
    }

    addCategories(categoryIds) {
        const setValues = categoryIds.map((_, categoryIndex) => `($1, $${categoryIndex + 2})`);
        const preparedQuery = {
            text: `
                INSERT INTO movie_has_category
                ("movie_id", "category_id")
                VALUES
                ${setValues}
            `,
            values: [this.id, ...categoryIds],
        };

        return this.constructor.client.query(preparedQuery);
    }
}

Movie.init({ client });

module.exports = Movie;