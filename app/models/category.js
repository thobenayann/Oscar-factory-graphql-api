const client = require('../db/pg');

const CoreModel = require('./coreModel');

/**
 * @typedef {object} Category
 * @property {number} id - Unique identifier
 * @property {string} label - Unique label
 * @property {string} created_at - category creation date
 * @property {string} updated_at - category last update date
 */

/**
 * @typedef {object} InputCategory
 * @property {string} label - Unique label
 */

class Category extends CoreModel {
    label;

    static tableName = 'category';

    constructor(obj) {
        super(obj);
        this.label = obj.label;
    }

    static async findByMovie(movieId) {
        const preparedQuery = {
            text: `
                SELECT "category".*
                FROM "category"
                JOIN "movie_has_category" ON  "category"."id" = "movie_has_category"."category_id"
                WHERE "movie_id" = $1
                ORDER BY "category"."label"
            `,
            values: [movieId],
        };

        const result = await this.client.query(preparedQuery);

        const instanceList = [];

        result.rows.forEach((row) => {
            const instance = new this(row);
            instanceList.push(instance);
        });

        return instanceList;
    }
}

Category.init({ client });

module.exports = Category;