class CoreModel {
    #id;

    #created_at;

    #updated_at;

    static tableName;

    constructor(obj) {
        this.setData(obj);
    }

    set id(value) {
        this.#id = value;
    }

    get id() {
        return this.#id;
    }

    set created_at(value) {
        this.#created_at = value;
    }

    get created_at() {
        return this.#created_at;
    }

    set updated_at(value) {
        this.#updated_at = value;
    }

    get updated_at() {
        return this.#updated_at;
    }

    /**
     * Helper method to set class properties from an literal object
     * @param {object} data data which feed class properties
     */
    setData(data) {
        if (!data) {
            throw new Error('data is undefined');
        }
        if (data.id) {
            this.id = data.id;
        }
        if (data.created_at) {
            this.created_at = data.created_at;
        }
        if (data.updated_at) {
            this.updated_at = data.updated_at;
        }
        Object.keys(this).forEach((prop) => {
            if (!data[prop]) {
                return;
            }
            this[prop] = data[prop];
        });
    }

    /**
     * Configuration des models
     * @param {object} config
     */
    static init(config) {
        this.client = config.client;
    }

    /**
     * Get a model instance with his primary key
     * @param {number} pkValue value of the identity column
     * @returns {object} Instance of the current model
     */
    static async findByPk(pkValue) {
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE id = $1`,
            values: [pkValue],
        };

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            return null;
        }

        return new this(result.rows[0]);
    }

    /**
     * Get all model instances or filtered records if params received
     * @param {object} params query filters
     * @returns {object[]} Instances of the current model
     */
    static async findAll(params) {
        let filter = '';
        const values = [];

        if (params) {
            const filters = [];
            let indexPlaceholder = 1;

            Object.entries(params).forEach(([param, value]) => {
                if (param === '$or') {
                    const filtersOr = [];
                    Object.entries(value).forEach(([key, val]) => {
                        filtersOr.push(`"${key}" = $${indexPlaceholder}`);
                        values.push(val);
                        indexPlaceholder += 1;
                    });
                    filters.push(`(${filtersOr.join(' OR ')})`);
                } else {
                    filters.push(`"${param}" = $${indexPlaceholder}`);
                    values.push(value);
                    indexPlaceholder += 1;
                }
            });
            filter = `WHERE ${filters.join(' AND ')}`;
        }

        const preparedQuery = {
            text: `
                SELECT * FROM "${this.tableName}"
                ${filter}
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);

        const instanceList = [];

        result.rows.forEach((row) => {
            const instance = new this(row);
            instanceList.push(instance);
        });

        return instanceList;
    }

    /**
     * Insert a record into database based on instance properties
     * and update instance properties
     */
    async insert() {
        const fields = [];
        const placeholders = [];
        const values = [];
        let indexPlaceholder = 1;

        Object.entries(this).forEach(([prop, value]) => {
            fields.push(`"${prop}"`);
            placeholders.push(`$${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        const preparedQuery = {
            text: `
                INSERT INTO "${this.constructor.tableName}"
                (${fields})
                VALUES (${placeholders})
                RETURNING *
            `,
            values,
        };

        const result = await this.constructor.client.query(preparedQuery);
        const row = result.rows[0];

        this.setData(row);
    }

    /**
     * Update a record into database based on instance properties
     * and update instance properties
     */
    async update() {
        const fieldsAndPlaceholders = [];
        let indexPlaceholder = 1;
        const values = [];

        Object.entries(this).forEach(([prop, value]) => {
            fieldsAndPlaceholders.push(`"${prop}" = $${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        values.push(this.id);

        const preparedQuery = {
            text: `
                UPDATE "${this.constructor.tableName}" SET
                ${fieldsAndPlaceholders},
                updated_at = now()
                WHERE id = $${indexPlaceholder}
                RETURNING *
            `,
            values,
        };

        const result = await this.constructor.client.query(preparedQuery);
        const row = result.rows[0];

        this.setData(row);
    }

    /**
     * Delete a record into database based on instance properties
     */
    async delete() {
        await this.constructor.client.query(`DELETE FROM "${this.constructor.tableName}" WHERE id = $1`, [this.id]);
    }

    /**
     * Shortcut to insert or update according id property
     */
    async save() {
        if (this.id) {
            await this.update();
        } else {
            await this.insert();
        }
    }

    /**
     * Overloaded method of implicit cast instance into JSON
     */
    toJSON() {
        const obj = {};
        obj.id = this.id;

        Object.entries(this).forEach(([key, value]) => {
            obj[key] = value;
        });

        obj.created_at = this.created_at;
        obj.updated_at = this.updated_at;

        return obj;
    }
}

module.exports = CoreModel;