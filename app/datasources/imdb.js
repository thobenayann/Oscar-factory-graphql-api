const MyRESTDataSource = require('./core/rest');

class Imdb extends MyRESTDataSource {
    constructor() {
        super();
        this.baseURL = ' https://www.omdbapi.com';
    }

    async findByPk(id) {
        // Le cache est tributaire du cache des headers de la réponse à la requête HTTP
        // ici
        // cache-control: max-age=86400
        return this.get(`?i=${id}&apikey=${process.env.OMDB_API_KEY}`);
    }

    async search(searchTerm) {
        // Le cache est tributaire du cache des headers de la réponse à la requête HTTP
        // ici
        // cache-control: max-age=3600
        const response = await this.get(`?s=${searchTerm}&apikey=${process.env.OMDB_API_KEY}`);
        return response.Search;
    }
}

module.exports = Imdb;
